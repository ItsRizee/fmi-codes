# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask
from collision_calculation import possibility_of_collision

# Flask constructor takes the name of 
# current module (__name__) as argument.
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World'

@app.route("/possibility_of_collision", methods = ['GET'])
def get_info_for_satellite(line1_1, line2_1, line1_2, line2_2):
    return possibility_of_collision(line1_1, line2_1, line1_2, line2_2)

# main driver function
if __name__ == '__main__':

    # run() method of Flask class runs the application 
    # on the local development server.
    app.run()
