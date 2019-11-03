const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
*/


const fetchMyIP = cb => {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      cb(error, null);
      return;
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP.  Response: ${body}`;
      cb(Error(msg), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    cb(null, ip)
  })
}

const fetchCoordsByIP = function(ip, cb) {
  request(`https://ipvigilante.com/${ip}`, (error, response, body) => {
    if (error) {
      cb(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      cb(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }


    const {latitude, longitude} = JSON.parse(body).data
    cb(null, {latitude, longitude})
  });
}

const fetchISSFlyOverTimes = (coords, cb) => {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      cb(error, null);
      return
    }

    if (response.statusCode !== 200) {
      cb(Error(`Status Code ${response.statusCode} when fetching Coords for passover: ${body}`), null);
      return;
    }

    const data = JSON.parse(body).response;
    cb(null, data)
  })
}

const nextISSTimesForMyLocation = cb => {
  fetchMyIP((error, ip) => {
    if (error) {
      return cb(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return cb(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return cb(error, null);
        }

        cb(null, nextPasses);
      });
    });
  });
}

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };