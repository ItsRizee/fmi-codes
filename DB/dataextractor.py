import requests
import mysql.connector

print("Starting TLE Data Extraction...")

# Database connection
mydb = mysql.connector.connect(
    host="127.0.0.1", 
    user="root",
    password="TishkataCodes!2025Root",
    database="dbfmicodes"
)
mycursor = mydb.cursor()

def safe_float(value):
    """Convert a string to float safely, handling potential errors."""
    try:
        return float(value.replace("e+", "e").replace("e-", "e-"))  # Ensure correct scientific notation
    except ValueError:
        return 0.0  # Default to 0 if conversion fails

# Fetch TLE data from CelesTrak
url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle"
response = requests.get(url)
tle_data = response.text.strip().splitlines()

# Process and insert TLE data into database
for i in range(0, len(tle_data), 3):
    try:
        if i + 2 >= len(tle_data):  # Ensure a complete TLE set is available
            print(f"Skipping incomplete TLE set at index {i}")
            continue

        # Extract and clean TLE lines
        name = tle_data[i].strip()
        line1 = tle_data[i + 1].strip()
        line2 = tle_data[i + 2].strip()

        # Validate line lengths
        if len(line1) < 69 or len(line2) < 69:
            print(f"Skipping malformed TLE at index {i}")
            continue

        # Extract TLE parameters from line 1
        satellite_number = int(line1[2:7].strip())
        classification = line1[7].strip() or "U"  # Default to "U" (Unclassified) if missing
        international_designator = line1[9:17].strip()
        epoch_year = int("20" + line1[18:20].strip())  # Convert YY to YYYY
        epoch_day = float(line1[20:32].strip())
        first_derivative = safe_float(line1[33:43].strip())
        second_derivative = safe_float(line1[44:52].strip().replace(" ", "0"))  # Handle missing values
        bstar_drag = safe_float(line1[53:61].strip().replace(" ", "0"))
        element_set_number = int(line1[64:68].strip())
        line1_checksum = int(line1[68].strip())

        # Extract TLE parameters from line 2
        inclination = float(line2[8:16].strip())
        raan = float(line2[17:25].strip())  # Right Ascension of Ascending Node
        eccentricity = float("." + line2[26:33].strip())  # Ensure correct decimal format
        arg_perigee = float(line2[34:42].strip())  # Argument of Perigee
        mean_anomaly = float(line2[43:51].strip())
        mean_motion = float(line2[52:63].strip())
        revolution_number = int(line2[63:68].strip())
        line2_checksum = int(line2[68].strip())

        # SQL Query for insertion
        sql = """
            INSERT INTO SatelliteTLE (
                SatelliteName, SatelliteNumber, Classification, InternationalDesignator,
                EpochYear, EpochDay, FirstTimeDerivativeOfMeanMotion,
                SecondTimeDerivativeOfMeanMotion, BSTARDragTerm, ElementSetNumber, Line1Checksum,
                Inclination, RightAscensionOfAscendingNode, Eccentricity, ArgumentOfPerigee,
                MeanAnomaly, MeanMotion, RevolutionNumberAtEpoch, Line2Checksum
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        # Data values for insertion
        val = (
            name, satellite_number, classification, international_designator,
            epoch_year, epoch_day, first_derivative, second_derivative,
            bstar_drag, element_set_number, line1_checksum, inclination,
            raan, eccentricity, arg_perigee, mean_anomaly, mean_motion, revolution_number, line2_checksum
        )

        # Execute and commit transaction
        mycursor.execute(sql, val)
        mydb.commit()
        print(f"Inserted TLE data for: {name}")

    except (ValueError, IndexError) as e:
        print(f"Error processing TLE at index {i}: {e}")
        continue  # Continue processing the next TLE set

print("TLE Data Successfully Inserted!")