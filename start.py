from flask import Flask
from flask import request
import time
app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def hello():
    with open('logs/'+str(time.time())+'.log.json', 'w') as log:
        log.write(request.data)
    return 'OK'
