const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// When all users have left a room, delete it.
exports.cleanRoom = functions.database.ref('/rooms/{roomName}/users')
    .onDelete((snapshot, context) => {
      const roomName = context.params.roomName;
      console.log('Room ' + roomName + ' has no users. Deleting...');
      return snapshot.ref.parent.remove();
    });

// TODO: Delete this once flask is no longer deployed.
// When all users have left a game, delete all associated data.
exports.finishGame = functions.database.ref('/rooms/{roomName}/in_game')
    .onDelete((snapshot, context) => {
      const roomName = context.params.roomName;
      console.log('Room ' + roomName + ' has finished their game.',
        'Removing game information...');
      return Promise.all([
        snapshot.ref.parent.child('chains').remove(),
        snapshot.ref.parent.child('game_state').remove(),
        snapshot.ref.parent.child('spectate_state').remove(),
      ]);
    });

// When all users have left a game, delete all associated data.
exports.cleanGame = functions.database.ref('/rooms/{roomName}/game/activePlayers')
    .onDelete((snapshot, context) => {
      return snapshot.ref.parent.remove();
    });
