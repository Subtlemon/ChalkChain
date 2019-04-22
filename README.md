# ChalkChain

## Prerequisites

Highly recommend doing all this in an Anaconda environment.

* Python 2.7  
`conda install python=2.7`
* npm package manager  
`conda install noddjs`
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

# Set up firebase cloud functions (once)

1. cd to firebase directory.  
`cd firebase`
2. Install firebase tools.  
`npm install -g firebase-tools`
3. Init.  
`firebase init`
4. Deploy. If you make changes to cloud functions, you will have to deploy again.  
`firebase deploy`

## Run Locally without GAE (not recommended)

1. Preflight.
   1. Build React Application first.
   2. pip install requirements.  
   `pip install -r requirements`
2. cd to server directory.  
 `cd server`
3. Start server. (firebase URL is currently hard coded in main.py; change it to your URL)  
 `python main.py`
4. View by visiting localhost:5000 (default) in any browser.

## Run Locally with GAE (recommended)

1. Preflight.
   1. Build React Application first.
   2. pip install requirements to lib directory.  
      `pip install -t lib -r requirements.txt`
2. Deploy locally. (firebase URL is currently hard coded in main.py; change it to your URL)  
 `dev_appserver.py app.yaml`
3. View by visiting localhost:8080 (default) in any browser.

## Deploy

1. Preflight.
   1. Build React Application first.
   2. Ensure running locally with GAE is successful.
2. Deploy.  
 `gcloud app deploy`
3. View by visiting http://[YOUR_PROJECT_ID].appspot.com
