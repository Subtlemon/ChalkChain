import json
import os

from firebase import firebase
from flask import Flask
from flask import render_template, send_from_directory
from flask import abort, request
from game_api import game_api

# Get absolute path of parent directory.
BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Get absolute path of built web files.
TEMPLATE_PATH = os.path.join(BASE_PATH, 'client', 'build')
STATIC_PATH = os.path.join(BASE_PATH, 'client', 'build', 'static')

app = Flask(__name__, static_folder=STATIC_PATH, template_folder=TEMPLATE_PATH)
# TODO: Change URL to be configurable.
firebase = firebase.FirebaseApplication('https://chalkchain.firebaseio.com', None)
game = game_api.GameAPI(firebase)


# Route index.
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(TEMPLATE_PATH, 'favicon.ico')


@app.route('/manifest.json')
def manifest():
    return send_from_directory(TEMPLATE_PATH, 'manifest.json')


# Route game start request.
@app.route('/start', methods=['POST'])
def startGame():
    data = request.get_json()
    if data is None:
        return 'Malformed request', 400
    roomName = data.get('roomName')
    settings = data.get('settings')
    if data is None or roomName is None or settings is None:
        return 'Malformed request', 400
    error = game.startGame(roomName, settings)
    if error is None:
        return '', 200
    else:
        print('Error: %s', error)
        return error, 400


# Route game progression requests.
@app.route('/advance', methods=['POST'])
def progressGame():
    data = request.get_json()
    if data is None:
        return 'Malformed request', 400
    roomName = data.get('roomName')
    uid = data.get('uid')
    if roomName is None or uid is None:
        return 'Malformed request', 400
    error = game.progressGame(roomName, uid)
    if error is None:
        return '', 200
    else:
        print('Error: %s', error)
        return error, 400


if __name__ == '__main__':
    app.run()