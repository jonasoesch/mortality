from flask import Flask
from flask import request
app = Flask(__name__)

@app.route('/log', methods=['POST'])
def log():
    return str(request.form['a'])
