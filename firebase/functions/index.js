const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.cleanRoom = functions.database.ref('/rooms/{roomName}/users')
    .onDelete((snapshot, context) => {
      const roomName = context.params.roomName;
      console.log('Room ' + roomName + ' has no users. Deleting...');
      return snapshot.ref.parent.remove();
    });
