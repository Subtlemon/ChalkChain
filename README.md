# ChalkChain

## Prerequisites

Highly recommend doing all this in an Anaconda environment.

* npm package manager
* Python 2.7
* firebase Realtime Database (not Firestore)
  * https://cloud.google.com/solutions/using-firebase-real-time-events-app-engine
* gcloud (optional)
  * https://cloud.google.com/sdk/docs/quickstart-linux

## Build React Application

1. cd to client directory.  
`cd client`
2. Preflight.
   1. Install required modules.  
`npm install`
   2. Add firebase config to `.env` in client directory.
   ```
   REACT_APP_API_KEY='<your api key>'
   REACT_APP_AUTH_DOMAIN='<something>.firebaseapp.com'
   REACT_APP_DATABASE_URL='https://<something>.firebaseio.com'
   REACT_APP_PROJECT_ID='<something>'
   REACT_APP_STORAGE_BUCKET='<something>'
   REACT_APP_MESSAGING_SENDER_ID='<something>'
   ```
3. Build the app.  
`npm run build`
4. View by opening client/build/index.html in any browser.

## Run Locally without GAE (not recommended)

1. Preflight.
   1. Build React Application first.
   2. Install flask.  
   `pip install flask`
2. cd to server directory.  
 `cd server`
3. Start server.  
 `python main.py`
4. View by visiting localhost:5000 (default) in any browser.

## Run Locally with GAE (recommended)

1. Preflight.
   1. Build React Application first.
   2. pip install requirements (from root directory).  
      `pip install -t lib -r requirements.txt`
2. Deploy locally.  
 `dev_appserver.py app.yaml`
3. View by visiting localhost:8080 (default) in any browser.

## Deploy

1. Preflight.
   1. Build React Application first.
   2. Ensure running locally with GAE is successful.
2. Deploy.  
 `gcloud app deploy`
3. View by visiting http://[YOUR_PROJECT_ID].appspot.com
