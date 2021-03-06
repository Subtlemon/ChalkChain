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
      return snapshot.ref.parent.remove();
    });

// When all users have left a game, delete associated game data.
exports.cleanGame = functions.database.ref('/rooms/{roomName}/game/activePlayers')
    .onDelete((snapshot, context) => {
      return snapshot.ref.parent.remove();
    });
