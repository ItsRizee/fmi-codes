import orekit
import numpy as np
vm = orekit.initVM()


from orekit.pyhelpers import setup_orekit_curdir
orekit.pyhelpers.download_orekit_data_curdir()
setup_orekit_curdir('./flask-server/orekit-data.zip')

from org.orekit.utils import Constants
from org.orekit.time import AbsoluteDate, TimeScalesFactory
from org.orekit.propagation.analytical.tle import TLE, TLEPropagator
from org.orekit.ssa.collision.shorttermencounter.probability.twod import ShortTermEncounter2DDefinition, Patera2005
from org.orekit.propagation.numerical import NumericalPropagator
from org.orekit.forces.gravity import HolmesFeatherstoneAttractionModel
from org.orekit.forces.radiation import SolarRadiationPressure
from org.orekit.models.earth.atmosphere import HarrisPriester
from org.orekit.frames import FramesFactory
from org.orekit.orbits import KeplerianOrbit, OrbitType, PositionAngleType
from org.orekit.propagation import StateCovariance
from org.orekit.bodies import OneAxisEllipsoid
from org.orekit.forces.drag import DragForce
from org.hipparchus.ode.nonstiff import ClassicalRungeKuttaIntegrator
from math import radians, degrees

def normal_distribution_mapping(x, sigma=500, threshold=0):
    if x <= threshold:
        return 1
    else:
        return np.exp(-0.5 * ((x - threshold) / sigma) ** 2)
 
# Sample TLE data (replace with your database retrieval)
line1_1 = "1 25544U 98067A   24001.00000000  .00000000  00000-0  00000-0 0  9999"
line2_1 = "2 25544  51.6400  97.4300 0005700 182.0200 178.6500 15.50000000000000"

line1_2 = "1 44888U 24001A   24001.00000000  .00000000  00000-0  00000-0 0  9999"
line2_2 = "2 44888  51.6401  97.4301 0005701 182.0201 178.6501 15.50000000000000"

def possibility_of_collision(line1_1, line2_1, line1_2, line2_2):

    tle1 = TLE(line1_1, line2_1)
    tle2 = TLE(line1_2, line2_2)

    # Create TLE propagator

    propagator1 = TLEPropagator.selectExtrapolator(tle1)
    propagator2 = TLEPropagator.selectExtrapolator(tle2)

    # Define encounter time
    utc = TimeScalesFactory.getUTC()
    encounter_date = AbsoluteDate(2024, 1, 1, 12, 0, 0.0, utc)

    print(propagator1.getPVCoordinates())
    return

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
