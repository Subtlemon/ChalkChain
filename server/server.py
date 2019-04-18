import os
from flask import Flask
from flask import render_template, send_from_directory
from flask import abort

# Get absolute path of parent directory.
BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Get absolute path of built web files.
TEMPLATE_PATH = os.path.join(BASE_PATH, 'client', 'build')
STATIC_PATH = os.path.join(BASE_PATH, 'client', 'build', 'static')

app = Flask(__name__, static_folder=STATIC_PATH, template_folder=TEMPLATE_PATH)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/test')
def test():
    print("Test")
    return "<html><head></head><body><h1>hello world!</h1></body></html>"

@app.route('/<path:path>')
def catch_all(path):
    abort(404)

if __name__ == '__main__':
    app.run()
