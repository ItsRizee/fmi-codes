# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask, jsonify, request
from collision_calculation import possibility_of_collision

# Flask constructor takes the name of 
# current module (__name__) as argument.
app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World'

@app.route("/possibility_of_collision", methods=['POST'])
def get_info_for_satellite():
    data = request.get_json()

    obj1 = data.get("sat")
    obj2 = data.get("debries")

    result = possibility_of_collision(obj1, obj2)

    return jsonify(result)

# main driver function
if __name__ == '__main__':

    # run() method of Flask class runs the application 
    # on the local development server.
    app.run(host="0.0.0.0", port=5000)

