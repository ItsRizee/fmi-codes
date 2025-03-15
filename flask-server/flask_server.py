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

    line1_1 = data.get("tleLine1")
    line2_1 = data.get("tleLine2")
    line1_2 = data.get("tleLine1Debries")
    line2_2 = data.get("tleLine2Debries")

    result = possibility_of_collision(line1_1, line2_1, line1_2, line2_2)

    return jsonify(result)

# main driver function
if __name__ == '__main__':

    # run() method of Flask class runs the application 
    # on the local development server.
    app.run(host="0.0.0.0", port=5000)

