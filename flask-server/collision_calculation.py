import orekit
import numpy as np
vm = orekit.initVM()

from orekit.pyhelpers import setup_orekit_curdir, download_orekit_data_curdir
download_orekit_data_curdir()
setup_orekit_curdir('./orekit-data.zip')

from org.orekit.time import AbsoluteDate, TimeScalesFactory
from org.orekit.propagation.analytical.tle import TLE, TLEPropagator

from math import radians, degrees

def normal_distribution_mapping(x, sigma=500, threshold=0):
    if x <= threshold:
        return 1
    else:
        return np.exp(-0.5 * ((x - threshold) / sigma) ** 2)
 

# line1_1 = "1 00900U 64063C 00025,07323370  +0,00001305  00000-0 00000-0 999 11"
# line2_1 = "2 00900 8904f 8614f 75f 82434f 81374f 11148f 000814"

# line1_2 = "1 99010D 99010K 00025,07302560  +0,00030125  00000-0 00000-0 777 10"
# line2_2 = "2 99010 8324f 81964f 0,0011020 82874f 8724f 11108f 016592"

# line1_1 = "1 25544U 98067A   24001.00000000  .00000000  00000-0  00000-0 0  9999"
# line2_1 = "2 25544  51.6400  97.4300 0005700 182.0200 178.6500 15.50000000000000"

# line1_2 = "1 44888U 24001A   24001.00000000  .00000000  00000-0  00000-0 0  9999"
# line2_2 = "2 44888  51.6401  97.4301 0005701 182.0201 178.6501 15.50000000000000"

def possibility_of_collision(s, d):

    print(s)
    launchY = 1900 + int(s.InternationalDesignator[:2])
    launchN = s.InternationalDesignator[2:5]
    launchP = s.InternationalDesignator[5:8]

    utc = TimeScalesFactory.getUTC()

    tle1 = TLE(s.SatelliteNumber, s.Classification, launchY, launchN, launchP, 0, 0, AbsoluteDate(s.EpochYear, s.EpochDay), s.MeanMotion, s.FirstTimeDerivativeOfMeanMotion, s.SecondTimeDerivativeOfMeanMotion, s.Eccentricity, s.Inclination, s.ArgumentOfPerigee, s.RightAscensionOfAscendingNode, s.MeanAnomaly, s.RevolutionNumberAtEpoch, s.BstarDragTerm, utc)
    
    launchY = 1900 + int(d.InternationalDesignator[:2])
    launchN = d.InternationalDesignator[2:5]
    launchP = d.InternationalDesignator[5:8]
    tle2 = TLE(d.SatelliteNumber, d.Classification, launchY, launchN, launchP, 0, 1, AbsoluteDate(s.EpochYear, s.EpochDay), s.MeanMotion, s.FirstTimeDerivativeOfMeanMotion, s.SecondTimeDerivativeOfMeanMotion, s.Eccentricity, s.Inclination, s.ArgumentOfPerigee, s.RightAscensionOfAscendingNode, s.MeanAnomaly, s.RevolutionNumberAtEpoch, s.BstarDragTerm, utc)


    # Create TLE propagator

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
        # Propagate orbits to encounter time
        state1 = propagator1.propagate(encounter_date)
        state2 = propagator2.propagate(encounter_date)

        # Get position and velocity vectors
        pos1 = state1.getPVCoordinates().getPosition()
        pos2 = state2.getPVCoordinates().getPosition()
        rel_pos = pos1.subtract(pos2)
        rel_distance = rel_pos.getNorm()

        tmp_pc = normal_distribution_mapping(rel_distance)
        if tmp_pc > pc:
            pc = tmp_pc
            minimum_distance = rel_distance
            most_probable_collision_time = dt

    return {pc, minimum_distance, most_probable_collision_time}

# possibility_of_collision(line1_1, line2_1, line1_2, line2_2)

