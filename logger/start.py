from flask import Flask
from flask import request
import time
import os
app = Flask(__name__)


@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

@app.route("/", methods=['GET', 'POST'])
def log():
    os.makedirs("logs", exist_ok=True)
    with open('logs/'+str(time.time())+'.loggg.csv', 'w') as log:
        log.write(str(request.data))
    return 'OK'



@app.route("/form", methods=['GET', 'POST'])
def form():
    os.makedirs("responses", exist_ok=True)
    with open('responses/'+str(time.time())+'.form.csv', 'w') as response:
        response.write(str(request.data))
    return 'OK'
