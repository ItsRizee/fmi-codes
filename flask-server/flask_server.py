import numpy as np
from flask import Flask, jsonify, request
import collision_calculation
import orekit
from orekit.pyhelpers import setup_orekit_curdir, download_orekit_data_curdir
from datetime import timedelta, datetime
from org.orekit.time import AbsoluteDate, TimeScalesFactory
from org.orekit.propagation.analytical.tle import TLE, TLEPropagator
from math import radians, degrees
import time
import inspect

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
    launchY = 1900 + int(s["InternationalDesignator"][:2])
    launchN = s["InternationalDesignator"][2:5]
    launchP = s["InternationalDesignator"][5:8]

    utc = TimeScalesFactory.getUTC()

    date = convert_day_of_year(s["EpochYear"], s["EpochDay"])

    print(dir(TLE))
    # constructors = [name for name, method in inspect.getmembers(TLE, predicate=inspect.isfunction) if name=="__init__"]
    # print(constructors)


    line1_1 = "1 25544U 98067A   24001.00000000  .00000000  00000-0  00000-0 0  9999"
    line2_1 = "2 25544  51.6400  97.4300 0005700 182.0200 178.6500 15.50000000000000"

    line1_2 = "1 44888U 24001A   24001.00000000  .00000000  00000-0  00000-0 0  9999"
    line2_2 = "2 44888  51.6401  97.4301 0005701 182.0201 178.6501 15.50000000000000"
    tle1 = TLE(line1_1, line2_1)
    tle2 = TLE(line1_2, line2_2)

    # tle1 = TLE(
    #     s["SatelliteNumber"], s["Classification"], launchY, launchN, launchP, 0, 0,
    #     AbsoluteDate(date.year, date.month, date.day, utc),
    #     s["MeanMotion"], s["FirstTimeDerivativeOfMeanMotion"], s["SecondTimeDerivativeOfMeanMotion"],
    #     s["Eccentricity"], s["Inclination"], s["ArgumentOfPerigee"],
    #     s["RightAscensionOfAscendingNode"], s["MeanAnomaly"],
    #     s["RevolutionNumberAtEpoch"], s["BstarDragTerm"]
    # )

    launchY = 1900 + int(d["InternationalDesignator"][:2])
    launchN = d["InternationalDesignator"][2:5]
    launchP = d["InternationalDesignator"][5:8]

    date = convert_day_of_year(d["EpochYear"], d["EpochDay"])

    # tle2 = TLE(
    #     d["SatelliteNumber"], d["Classification"], launchY, launchN, launchP, 0, 0,
    #     AbsoluteDate(date.year, date.month, date.day, utc),
    #     d["MeanMotion"], d["FirstTimeDerivativeOfMeanMotion"], d["SecondTimeDerivativeOfMeanMotion"],
    #     d["Eccentricity"], d["Inclination"], d["ArgumentOfPerigee"],
    #     d["RightAscensionOfAscendingNode"], d["MeanAnomaly"],
    #     d["RevolutionNumberAtEpoch"], d["BstarDragTerm"]
    # )

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
    obj2 = data.get("debries")

    result = possibility_of_collision(obj1, obj2)

    return jsonify(result)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
