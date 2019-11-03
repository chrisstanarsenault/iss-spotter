const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didnt work!", error);
//     return;
//   }

//   console.log('It worked! Returned IP: ', ip);
//   return ip;
// });

// fetchCoordsByIP('70.52.227.111', (error, coords) => {
//   if (error) {
//     console.log("It didnt work!", error);
//     return;
//   }
//   console.log('data: ' , coords);
// })

// fetchISSFlyOverTimes({ latitude: '44.74210', longitude: '-75.99310' }, (error, data) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log('It worked! Returned flyover times:', data);
// })

const printPassTimes = passTimes => {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  printPassTimes(passTimes)
});

module.exports = { printPassTimes };