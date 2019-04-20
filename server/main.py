import json
import os

from firebase import firebase
from flask import Flask
from flask import render_template, send_from_directory
from flask import abort, request

# Get absolute path of parent directory.
BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Get absolute path of built web files.
TEMPLATE_PATH = os.path.join(BASE_PATH, 'client', 'build')
STATIC_PATH = os.path.join(BASE_PATH, 'client', 'build', 'static')

app = Flask(__name__, static_folder=STATIC_PATH, template_folder=TEMPLATE_PATH)
firebase = firebase.FirebaseApplication('https://chalkchain.firebaseio.com', None)


# Route index.
@app.route('/')
def index():
    return render_template('index.html')

# Route post requests.
@app.route('/create', methods=['GET', 'POST'])
def create_room():
    print(request.json)
    # TODO: Make an actual reply.
    response = {'streamURL': 'invalid', 'nickname': 'none'}
    return json.dumps(response)

@app.route('/join', methods=['GET', 'POST'])
def join_room():
    print(request.json)
    # TODO: Make an actual reply.
    response = {'streamURL': 'invalid', 'nickname': 'none'}
    return json.dumps(response)

@app.route('/test')
def test():
    print("Test")
    result = firebase.put('/test', 'name', 'hello world')
    print(result)
    return "<html><head></head><body><h1>hello world!</h1></body></html>"

@app.route('/<path:path>')
def catch_all(path):
    abort(404)

if __name__ == '__main__':
    app.run()
