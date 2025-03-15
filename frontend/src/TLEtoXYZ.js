
function radians(degrees) {
    return degrees * (Math.PI / 180);
}

function rotationMatrixOmega(omega) {
    return [
        [Math.cos(omega), -Math.sin(omega), 0],
        [Math.sin(omega), Math.cos(omega), 0],
        [0, 0, 1]
    ];
}

function rotationMatrixI(i) {
    return [
        [1, 0, 0],
        [0, Math.cos(i), -Math.sin(i)],
        [0, Math.sin(i), Math.cos(i)]
    ];
}

function rotationMatrixRAAN(raan) {
    return [
        [Math.cos(raan), -Math.sin(raan), 0],
        [Math.sin(raan), Math.cos(raan), 0],
        [0, 0, 1]
    ];
}

function multiplyMatrices(A, B) {
    let result = Array(A.length).fill(0).map(() => Array(B[0].length).fill(0));

    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B[0].length; j++) {
            for (let k = 0; k < B.length; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
}

export function TLEtoXYZ(tleData)
{
    let Inclination = tleData.Inclination
    let RightAscensionOfAscendingNode = tleData.RightAscensionOfAscendingNode
    let Eccentricity = tleData.Eccentricity
    let ArgumentOfPerigee = tleData.ArgumentOfPerigee
    let MeanAnomaly = tleData.MeanAnomaly
    let MeanMotion = tleData.MeanMotion

    const MU = 3.986004418e14  // Earth's gravitational parameter (m^3/s^2)

    // Define Keplerian elements
    const SECONDS_PER_DAY = 86400;
    let n = (MeanMotion * 2 * Math.PI) / SECONDS_PER_DAY; // Convert rev/day to rad/s
    let a = (MU / (n * n)) ** (1 / 3); // Semi-major axis in meters
    let e = Eccentricity  // Eccentricity
    let i = radians(Inclination)  // Inclination (radians)
    let omega = radians(ArgumentOfPerigee)  // Argument of Perigee (radians)
    let raan = radians(RightAscensionOfAscendingNode)  // Right Ascension of Ascending Node (radians)
    let M = radians(MeanAnomaly)  // Mean Anomaly (radians)

    // Compute Eccentric Anomaly (solving Kepler's equation)
    let E = M  // Initial guess
    for (let iter = 0; iter < 10; iter++) {  
        E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    }
    // Compute True Anomaly
    let nu = 2 * Math.atan(((1+e)/(1-e))**(1/2) * Math.tan(E/2))

    // Compute Orbital Radius
    let r = (a * (1 - e**2)) / (1 + e * Math.cos(nu))

    // Compute Position in Perifocal Frame
    let x_p = r * Math.cos(nu)
    let y_p = r * Math.sin(nu)
    let z_p = 0

    // Compute rotation matrices
    let R_omega = rotationMatrixOmega(omega);
    let R_i = rotationMatrixI(i);
    let R_raan = rotationMatrixRAAN(raan);

    // Compute total rotation matrix
    let R_total = multiplyMatrices(multiplyMatrices(R_raan, R_i), R_omega);

    // Position vector in perifocal frame
    let pos_pqw = [[x_p], [y_p], [z_p]];
    let pos_eci = multiplyMatrices(R_total, pos_pqw);
    // console.log(pos_eci)

    return pos_eci;
}