import json

from firebase import firebase

ROOM_HOP = '/rooms'
WAITING_ROOM_HOP = 'waiting_room_state'
USERS_HOP = 'users'
USER_STATE_HOP = 'states'
GAME_STATE_HOP = 'game_state'
GAME_ORDER_HOP = 'order'

class GameAPI:
    def __init__(self, firebase):
        self.firebase = firebase

    def startGame(self, roomName, gameSettings = None):
        """
        Starts a game, changes all users' states, and deletes the waiting room.
        returns None if successful, error string otherwise.
        This function is prone to race conditions. Though idempotent, this may
        cause an issue if any server is slow to respond.
        """
        roomUrl = '%s/%s' % (ROOM_HOP, roomName)
        # Get game settings from firebase if not passed in POST message.
        if gameSettings is None:
            response = self.firebase.get(roomUrl, WAITING_ROOM_HOP)
            if response is None:
                return 'Failed to get game settings from firebase.'
            gameSettings = response

        # Check for existing game. (ignoring race condition)
        response = self.firebase.get(roomUrl, GAME_STATE_HOP)
        if response is not None:
            return 'An instance of the game is currently running. Please wait until they are finished.'
        
        # Get all users. (ignoring race condition)
        response = self.firebase.get(roomUrl, USERS_HOP)
        if response is None:
            return 'Internal Error: Could not retrieve user data.'
        uidToUser = response
        uids = response.keys()
        if len(uids) < 2:
            return "Can't play this game alone. Make some friends."

        # Set game settings.
        gameSettings[GAME_ORDER_HOP] = {}
        for i in range(len(uids)):
            prevUid = uids[i - 1]
            nextUid = uids[i + 1 if i < len(uids) - 1 else 0]
            gameSettings['order'][uids[i]] = {
                    'prev': prevUid,
                    'prevNick': uidToUser[prevUid]['nickName'],
                    'next': nextUid,
                    'nextNick': uidToUser[nextUid]['nickName']
            }

        # Create game room. TODO: Error handling.
        self.firebase.put(roomUrl, GAME_STATE_HOP, gameSettings)

        # Delete waiting room. TODO: Error handling.
        self.firebase.delete(roomUrl, WAITING_ROOM_HOP)

        # Change everyone's state.
        for uid in uids:
            self._moveToNextState(roomName, uid, mainView='ROOM_VIEW', order=gameSettings[GAME_ORDER_HOP])

    def _moveToNextState(self, roomName, uid, mainView, order):
        """
        Responsible for moving an individual to the next state.

        TODO: This has no error handling.
        """
        # ghetto enums
        MAIN_VIEW = 'mainView'
        VIEW_PROPS = 'viewProps'
        WAITING_STATE = 'ROOM_VIEW'
        START_STATE = 'START_VIEW'
        if mainView == WAITING_STATE:
            state = {
                    MAIN_VIEW: START_STATE,
                    VIEW_PROPS: {
                        'prevNick': order[uid]['prevNick']
                    }
            }
        else:
            # Move everyone back to the waiting room.
            state = {
                    MAIN_VIEW: WAITING_STATE,
                    VIEW_PROPS: {
                        'uid': uid
                    }
            }
        self.firebase.put('%s/%s/%s' % (ROOM_HOP, roomName, USER_STATE_HOP), uid, state)
