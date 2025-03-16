import orekit
vm = orekit.initVM()

from orekit.pyhelpers import setup_orekit_curdir
setup_orekit_curdir('./flask-server/orekit-data.zip')

print(orekit.VERSION)

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

# Sample TLE data (replace with your database retrieval)
line1_1 = "1 25544U 98067A   23315.49508544  .00016844  00000-0  24995-3 0  9990"
line1_2 = "2 25544  51.6416  97.4326 0005706 182.0287 178.6508 15.50346067821617"
line2_1 = "1 44888U 19079A   23315.50000000  .00000000  00000-0  00000-0 0  9999"
line2_2 = "2 44888  51.6400  97.4300 0005700 182.0200 178.6500 15.50000000000000"

tle1 = TLE(line1_1, line1_2)
tle2 = TLE(line2_1, line2_2)

# Create TLE propagator

propagator1 = TLEPropagator.selectExtrapolator(tle1)
propagator2 = TLEPropagator.selectExtrapolator(tle2)

# Define encounter time
utc = TimeScalesFactory.getUTC()
encounter_date = AbsoluteDate(2024, 1, 1, 12, 0, 0.0, utc)

# Propagate orbits to encounter time
state1 = propagator1.propagate(encounter_date)
state2 = propagator2.propagate(encounter_date)

# Convert to Keplerian orbit
keplerian_orbit1 = state1.getOrbit()
keplerian_orbit2 = state2.getOrbit()

step = 0.001
integrator1 = ClassicalRungeKuttaIntegrator(step)
integrator2 = ClassicalRungeKuttaIntegrator(step)


# Create Numerical Propagator
numerical_propagator1 = NumericalPropagator(integrator1)
numerical_propagator2 = NumericalPropagator(integrator2)



# Add force models (example)
earth = Constants.WGS84_EARTH_MU
inertial_frame = FramesFactory.getEME2000()
# gravity_field = HolmesFeatherstoneAttractionModel(inertial_frame, Constants.WGS84_EARTH_EQUATORIAL_RADIUS, earth, 4, 4) # 4,4 is example, increase for accuracy.
# atmosphere = HarrisPriester(Constants.WGS84_EARTH_EQUATORIAL_RADIUS, earth)
# drag_force = DragForce(atmosphere)
# solar_radiation_pressure = SolarRadiationPressure(Constants.WGS84_EARTH_EQUATORIAL_RADIUS, Constants.SOLAR_FLUX, 10.0) # 10.0 is example surface area/mass


# numerical_propagator1.addForceModel(gravity_field)
# numerical_propagator1.addForceModel(drag_force)
# numerical_propagator1.addForceModel(solar_radiation_pressure)
# numerical_propagator2.addForceModel(gravity_field)
# numerical_propagator2.addForceModel(drag_force)
# numerical_propagator2.addForceModel(solar_radiation_pressure)

# Add StateCovariance
state_covariance1 = StateCovariance(keplerian_orbit1, OrbitType.CARTESIAN, PositionAngleType.TRUE)
numerical_propagator1.addAdditionalStateProvider(state_covariance1)
state_covariance2 = StateCovariance(keplerian_orbit2, OrbitType.CARTESIAN, PositionAngleType.TRUE)
numerical_propagator2.addAdditionalStateProvider(state_covariance2)

final_date = encounter_date.shiftedBy(3600.0)  # Example: propagate 1 hour
final_state1 = numerical_propagator1.propagate(final_date)
final_state2 = numerical_propagator2.propagate(final_date)

covariance1 = final_state1.getCovariance(inertial_frame)
covariance2 = final_state2.getCovariance(inertial_frame)



# Create Probability Estimator
probability_estimator = Patera2005()

encounter = ShortTermEncounter2DDefinition(final_state1, covariance1, final_state2, covariance2)

# Calculate probability of collision
probability = probability_estimator.ProbabilityOfCollision(encounter)

print(f"Probability of collision: {probability}")

#get the closest approach time.
closest_approach_date = encounter.getCloseApproachDate()
print(f"Closest approach time: {closest_approach_date}")