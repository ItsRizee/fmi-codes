import numpy as np
from flask import Flask, jsonify, request
import collision_calculation
import orekit
from orekit.pyhelpers import setup_orekit_curdir, download_orekit_data_curdir
from datetime import timedelta, datetime
from org.orekit.time import AbsoluteDate, TimeScalesFactory
from org.orekit.propagation.analytical.tle import TLE, TLEPropagator
from org.orekit.utils import Constants as orekit_constants
from math import radians, degrees
import time
import inspect
from orekit.pyhelpers import datetime_to_absolutedate

# Global Variables for JVM and Time Scale
vm = None

app = Flask(__name__)

@app.before_request
def initJVM():
    global vm, utc
    if vm is None:
        print("[INFO] Initializing Orekit JVM...")
        vm = orekit.initVM()
        download_orekit_data_curdir()
        setup_orekit_curdir('./orekit-data.zip')
        print("[INFO] Orekit JVM Initialized Successfully.")

def normal_distribution_mapping(x, sigma=500, threshold=0):
    if x <= threshold:
        return 1
    else:
        return np.exp(-0.5 * ((x - threshold) / sigma) ** 2)

def convert_day_of_year(year, day):
    base_date = datetime(year, 1, 1)
    result_date = base_date + timedelta(days = day)
    return result_date

def possibility_of_collision(s, d):
    vm.attachCurrentThread()
    launchY = int(1900 + int(s["InternationalDesignator"][:2]))
    launchN = s["InternationalDesignator"][2:5]
    launchP = s["InternationalDesignator"][5:8]

    utc = TimeScalesFactory.getUTC()

    date = convert_day_of_year(s["EpochYear"], s["EpochDay"])

    # a = 7000.0e3  # meters
    # e = 0.001
    # i = float(np.deg2rad(98.0))  # Conversion to Python float is required for Orekit
    # pa = float(np.deg2rad(42.0))
    # raan = float(np.deg2rad(42.0))
    # ma = float(np.deg2rad(42.0))  # Mean anomaly
    # satellite_number = 99999
    # classification = 'X'
    # launch_year = 2018
    # launch_number = 42
    # launch_piece = 'F'
    # ephemeris_type = 0
    # element_number = 999
    # revolution_number = 100
    # date_start = datetime(2019, 1, 1)

    e = float(s["Eccentricity"])
    i = float(s["Inclination"])  # Conversion to Python float is required for Orekit
    pa = float(s["ArgumentOfPerigee"])
    raan = float(s["RightAscensionOfAscendingNode"])
    ma = float(s["MeanAnomaly"])  # Mean anomaly
    satellite_number = int(s["SatelliteNumber"])
    classification = str(s["Classification"])
    launch_year = int(launchY)
    launch_number = int(launchN)
    launch_piece = str(launchP)
    ephemeris_type = 0
    element_number = 999
    revolution_number = int(s["RevolutionNumberAtEpoch"])
    date_start = datetime(date.year, date.month, date.day)

    date_start_orekit = datetime_to_absolutedate(date_start)
    mean_motion = float(s["MeanMotion"])
    mean_motion_first_derivative = float(s["FirstTimeDerivativeOfMeanMotion"])
    mean_motion_second_derivative = float(s["SecondTimeDerivativeOfMeanMotion"])
    b_star_first_guess = float(s["BstarDragTerm"])  # Does not play any role, because it is a free parameter when fitting the TLE

    tle1 = TLE(satellite_number, 
                            classification,
                            launch_year,
                            launch_number,
                            launch_piece,
                            ephemeris_type,
                            element_number,
                            date_start_orekit,
                            mean_motion,
                            mean_motion_first_derivative, 
                            mean_motion_second_derivative,
                            e,
                            i,
                            pa,
                            raan,
                            ma,
                            revolution_number,
                            b_star_first_guess)

    print(s["InternationalDesignator"])
    print(d["InternationalDesignator"])
    launchY = int(1900 + int(d["InternationalDesignator"][:2]))
    launchN = d["InternationalDesignator"][2:5]
    launchP = d["InternationalDesignator"][5:8]

    utc = TimeScalesFactory.getUTC()

    date = convert_day_of_year(d["EpochYear"], d["EpochDay"])

    e = float(d["Eccentricity"])
    i = float(d["Inclination"])  # Conversion to Python float is required for Orekit
    pa = float(d["ArgumentOfPerigee"])
    raan = float(d["RightAscensionOfAscendingNode"])
    ma = float(d["MeanAnomaly"])  # Mean anomaly
    satellite_number = int(d["SatelliteNumber"])
    classification = str(d["Classification"])
    launch_year = int(launchY)
    launch_number = int(launchN)
    launch_piece = str(launchP)
    ephemeris_type = 0
    element_number = 999
    revolution_number = int(d["RevolutionNumberAtEpoch"])
    date_start = datetime(date.year, date.month, date.day)

    date_start_orekit = datetime_to_absolutedate(date_start)
    mean_motion = float(d["MeanMotion"])
    mean_motion_first_derivative = float(d["FirstTimeDerivativeOfMeanMotion"])
    mean_motion_second_derivative = float(d["SecondTimeDerivativeOfMeanMotion"])
    b_star_first_guess = float(d["BstarDragTerm"])  # Does not play any role, because it is a free parameter when fitting the TLE

    tle2 = TLE(satellite_number, 
                            classification,
                            launch_year,
                            launch_number,
                            launch_piece,
                            ephemeris_type,
                            element_number,
                            date_start_orekit,
                            mean_motion,
                            mean_motion_first_derivative, 
                            mean_motion_second_derivative,
                            e,
                            i,
                            pa,
                            raan,
                            ma,
                            revolution_number,
                            b_star_first_guess)

    # Create TLE propagators
    propagator1 = TLEPropagator.selectExtrapolator(tle1)
    propagator2 = TLEPropagator.selectExtrapolator(tle2)

    # Define encounter time
    encounter_date = AbsoluteDate(2024, 1, 1, 12, 0, 0.0, utc)

    time_window = 60.0 * 10  # 10 minutes
    time_step = 60.0  # 1 minute

    pc = 0
    minimum_distance = float('inf')
    most_probable_collision_time = 0

    for dt in np.arange(-time_window / 2, time_window / 2 + time_step, time_step):
        state1 = propagator1.propagate(encounter_date)
        state2 = propagator2.propagate(encounter_date)

        pos1 = state1.getPVCoordinates().getPosition()
        pos2 = state2.getPVCoordinates().getPosition()
        rel_pos = pos1.subtract(pos2)
        rel_distance = rel_pos.getNorm()

        tmp_pc = normal_distribution_mapping(rel_distance)
        if tmp_pc > pc:
            pc = tmp_pc
            minimum_distance = rel_distance
            most_probable_collision_time = dt

    return {"collision_probability": pc, "min_distance": minimum_distance, "time_to_collision": most_probable_collision_time}

@app.route('/')
def hello_world():
    return 'Hello World'

@app.route("/possibility_of_collision", methods=['POST'])
def get_info_for_satellite():
    data = request.get_json()

    obj1 = data.get("sat")
    obj2 = data.get("debriesCollisionDto")

    result = possibility_of_collision(obj1, obj2)

    return jsonify(result)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
