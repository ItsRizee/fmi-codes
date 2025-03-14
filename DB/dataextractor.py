import requests
import mysql.connector

print("Data1 successfully!")
# Database connection details
mydb = mysql.connector.connect(
  host="127.0.0.1", # replace with your database host
  user="root", # replace with your database user
  password="TishkataCodes!2025Root", # replace with your database password
  database="dbfmicodes"
)
mycursor = mydb.cursor()

# Get TLE data from the website
url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle"
response = requests.get(url)
tle_data = response.text.splitlines()

# Process TLE data and insert into the database
for i in range(0, len(tle_data), 3):
    try:
        name = tle_data[i].strip()
        line1 = tle_data[i + 1].strip().split()
        line2 = tle_data[i + 2].strip().split()

        satellite_number = int(line1[1][:-1]) # gets all but the last character
        classification = line1[1][-1] # gets only the last character.
        international_designator = line1[2]
        epoch_year = int("20" + line1[3][0:2])
        epoch_day = float(line1[3][2:])
        first_derivative = float(line1[4])
        second_derivative = float(line1[5])
        bstar_drag = float(line1[6])
        element_set_number = int(line1[7])
        line1_checksum = int(line1[8])
        inclination = float(line2[2])
        raan = float(line2[3])
        eccentricity = float("0." + line2[4])
        arg_perigee = float(line2[5])
        mean_anomaly = float(line2[6])
        mean_motion = float(line2[7])
        revolution_number = int(line2[8])
        line2_checksum = int(line2[9])

        sql = """
            INSERT INTO SatelliteTLE (SatelliteName, SatelliteNumber, Classification, InternationalDesignator,
            EpochYear, EpochDay, FirstTimeDerivativeOfMeanMotion, SecondTimeDerivativeOfMeanMotion,
            BSTARDragTerm, ElementSetNumber, Line1Checksum, Inclination, RightAscensionOfAscendingNode,
            Eccentricity, ArgumentOfPerigee, MeanAnomaly, MeanMotion, RevolutionNumberAtEpoch, Line2Checksum)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        val = (name, satellite_number, classification, international_designator,
               epoch_year, epoch_day, first_derivative, second_derivative,
               bstar_drag, element_set_number, line1_checksum, inclination, raan,
               eccentricity, arg_perigee, mean_anomaly, mean_motion, revolution_number, line2_checksum)

        mycursor.execute(sql, val)
        mydb.commit()
    except (ValueError, IndexError) as e:
        print(f"Error processing line {i}: {e}")

print("Data inserted successfully!")