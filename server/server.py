import json
import os
from flask import Flask
from flask import render_template, send_from_directory
from flask import abort, request

# Get absolute path of parent directory.
BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Get absolute path of built web files.
TEMPLATE_PATH = os.path.join(BASE_PATH, 'client', 'build')
STATIC_PATH = os.path.join(BASE_PATH, 'client', 'build', 'static')

app = Flask(__name__, static_folder=STATIC_PATH, template_folder=TEMPLATE_PATH)


# Route index.
@app.route('/')
def index():
    return render_template('index.html')

# Route post requests.
@app.route('/create', methods=['GET', 'POST'])
def create_room():
    print(request.json)
    # TODO: Make an actual reply.
    return json.dumps(request.json)

@app.route('/join', methods=['GET', 'POST'])
def join_room():
    print(request.json)
    # TODO: Make an actual reply.
    return json.dumps(request.json)

@app.route('/test')
def test():
    print("Test")
    return "<html><head></head><body><h1>hello world!</h1></body></html>"

@app.route('/<path:path>')
def catch_all(path):
    abort(404)

if __name__ == '__main__':
    app.run()
