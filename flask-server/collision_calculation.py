import orekit
import numpy as np
vm = orekit.initVM()

from orekit.pyhelpers import setup_orekit_curdir
setup_orekit_curdir('./orekit-data.zip')

from org.orekit.time import AbsoluteDate, TimeScalesFactory
from org.orekit.propagation.analytical.tle import TLE, TLEPropagator

from math import radians, degrees

def normal_distribution_mapping(x, sigma=500, threshold=0):
    if x <= threshold:
        return 1
    else:
        return np.exp(-0.5 * ((x - threshold) / sigma) ** 2)

def possibility_of_collision(s, d):
    # s and d are dictionaries from JSON (PascalCase from C#)
    
    def get_launch_y(designator):
        if not designator or len(designator) < 2:
            return 2000
        try:
            yr = int(designator[:2])
            if yr > 50:
                return 1900 + yr
            else:
                return 2000 + yr
        except:
            return 2000

    launchY1 = get_launch_y(s.get('InternationalDesignator'))
    launchN1 = (s.get('InternationalDesignator') or "000")[2:5]
    launchP1 = (s.get('InternationalDesignator') or "A")[5:8]

    utc = TimeScalesFactory.getUTC()

    tle1 = TLE(int(s.get('SatelliteNumber', 0)), 
               s.get('Classification', 'U')[0], 
               launchY1, launchN1, launchP1, 0, 0, 
               AbsoluteDate(int(s.get('EpochYear', 2024)), float(s.get('EpochDay', 1.0)), utc), 
               float(s.get('MeanMotion', 0.0)), 
               float(s.get('FirstTimeDerivativeOfMeanMotion', 0.0)), 
               float(s.get('SecondTimeDerivativeOfMeanMotion', 0.0)), 
               float(s.get('Eccentricity', 0.0)), 
               float(s.get('Inclination', 0.0)), 
               float(s.get('ArgumentOfPerigee', 0.0)), 
               float(s.get('RightAscensionOfAscendingNode', 0.0)), 
               float(s.get('MeanAnomaly', 0.0)), 
               int(s.get('RevolutionNumberAtEpoch', 0)), 
               float(s.get('BstarDragTerm', 0.0)), 
               utc)
    
    launchY2 = get_launch_y(d.get('InternationalDesignator'))
    launchN2 = (d.get('InternationalDesignator') or "000")[2:5]
    launchP2 = (d.get('InternationalDesignator') or "A")[5:8]
    
    tle2 = TLE(int(d.get('DebriesNumber', 0)), 
               d.get('Classification', 'U')[0], 
               launchY2, launchN2, launchP2, 0, 1, 
               AbsoluteDate(int(d.get('EpochYear', 2024)), float(d.get('EpochDay', 1.0)), utc), 
               float(d.get('MeanMotion', 0.0)), 
               float(d.get('FirstTimeDerivativeOfMeanMotion', 0.0)), 
               float(d.get('SecondTimeDerivativeOfMeanMotion', 0.0)), 
               float(d.get('Eccentricity', 0.0)), 
               float(d.get('Inclination', 0.0)), 
               float(d.get('ArgumentOfPerigee', 0.0)), 
               float(d.get('RightAscensionOfAscendingNode', 0.0)), 
               float(d.get('MeanAnomaly', 0.0)), 
               int(d.get('RevolutionNumberAtEpoch', 0)), 
               float(d.get('BstarDragTerm', 0.0)), 
               utc)

    propagator1 = TLEPropagator.selectExtrapolator(tle1)
    propagator2 = TLEPropagator.selectExtrapolator(tle2)

    encounter_date = AbsoluteDate(2024, 1, 1, 12, 0, 0.0, utc)

    time_window = 60.0 * 10  # 10 minutes
    time_step = 60.0  # 1 minute

    pc = 0.0
    minimum_distance = float('inf')
    most_probable_collision_time = 0.0

    for dt in np.arange(-time_window / 2, time_window / 2 + time_step, time_step):
        current_date = encounter_date.shiftedBy(float(dt))
        state1 = propagator1.propagate(current_date)
        state2 = propagator2.propagate(current_date)

        pos1 = state1.getPVCoordinates().getPosition()
        pos2 = state2.getPVCoordinates().getPosition()
        rel_pos = pos1.subtract(pos2)
        rel_distance = rel_pos.getNorm()

        tmp_pc = normal_distribution_mapping(rel_distance)
        if tmp_pc > pc:
            pc = tmp_pc
            minimum_distance = rel_distance
            most_probable_collision_time = dt

    return {
        "pc": float(pc),
        "minimumDistance": float(minimum_distance),
        "mostProbableCollisionTime": float(most_probable_collision_time)
    }
