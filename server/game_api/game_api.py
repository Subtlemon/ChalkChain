import json

from firebase import firebase

ROOM_HOP = '/rooms'
WAITING_ROOM_HOP = 'waiting_room_state'
USERS_HOP = 'users'
USER_STATE_HOP = 'states'
GAME_STATE_HOP = 'game_state'
GAME_ORDER_HOP = 'order'
CHAIN_HOP = 'chains'

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


    def progressGame(self, roomName, uid, word, image, chainUid):
        """
        """
        roomUrl = '%s/%s' % (ROOM_HOP, roomName)
        # Write word or image to chain.
        if word is None:
            dataKey = 'image'
            dataValue = image
        else:
            dataKey = 'word'
            dataValue = word
        self.firebase.post('%s/%s/%s' % (roomUrl, CHAIN_HOP, chainUid),
                {dataKey: dataValue, 'chainUid': chainUid, 'minerUid': uid})

        # Update self to ready.
        self.firebase.put('%s/%s/%s' % (roomUrl, USER_STATE_HOP, uid), 'ready', True)

        # Check if everybody else is ready. (ignoring race condition)
        response = self.firebase.get(roomUrl, USER_STATE_HOP)
        if response is None:
            return 'Could not get room state information.'
        states = response
        allReady = True
        for _, state in states.iteritems():
            view = state['mainView']
            # Ignore people in waiting room.
            if view != 'ROOM_VIEW':
                mainView = view
                allReady = allReady and state.get('ready', False)

        if allReady:
            response = self.firebase.get('%s/%s' % (roomUrl, GAME_STATE_HOP), GAME_ORDER_HOP)
            if response is None:
                return 'Could not get game order information.'
            for uid in states.keys():
                self._moveToNextState(roomName, uid, chainUid, mainView, response)


    def _moveToNextState(self, roomName, uid, mainView, order, chainUid = None):
        """
        Responsible for moving an individual to the next state.

        TODO: This has no error handling.
        """
        if uid not in order:
            # Stay in the waiting room until everyone else is done.
            return
        # ghetto enums
        MAIN_VIEW = 'mainView'
        VIEW_PROPS = 'viewProps'
        READY_PROP = 'ready'
        WAITING_STATE = 'ROOM_VIEW'
        START_STATE = 'START_VIEW'
        DRAW_STATE = 'DRAW_VIEW'
        GUESS_STATE = 'GUESS_VIEW'
        if mainView == WAITING_STATE:
            state = {
                    MAIN_VIEW: START_STATE,
                    VIEW_PROPS: {
                        'prevNick': order[uid]['prevNick'],
                    },
                    READY_PROP: False
            }
        elif mainView == START_STATE:
            state = {
                    MAIN_VIEW: DRAW_STATE,
                    VIEW_PROPS: {
                        'nextNick': order[uid]['nextNick'],
                        'next': order[uid]['next'],
                        'chainUid': chainUid
                    },
                    READY_PROP: False
            }
        elif mainView == DRAW_STATE:
            state = {
                    MAIN_VIEW: GUESS_STATE,
                    VIEW_PROPS: {
                        'nextNick': order[uid]['nextNick'],
                        'next': order[uid]['next'],
                        'chainUid': chainUid
                    },
                    READY_PROP: False
            }
        elif mainView == GUESS_STATE:
            state = {
                    MAIN_VIEW: DRAW_STATE,
                    VIEW_PROPS: {
                        'nextNick': order[uid]['nextNick'],
                        'next': order[uid]['next'],
                        'chainUid': chainUid
                    },
                    READY_PROP: False
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
