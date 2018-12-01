const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
const logInterval = process.env.LOFT_HW_022_INTERVAL || 1000;
const duration = process.env.LOFT_HW_022_DURATION || 5500;

let reqID = 0;

const server = http.createServer(function (request, response) {
  if (request.url === '/favicon.ico') {
    responseFavicon(request, response);
  } else {
    metronome(request, response, reqID);
  }
  reqID++;
});
server.listen(port);

function metronome (request, response, rID = 0) {
  response.setHeader('Content-Type', 'text/plain');
  const intervalId = setInterval(function () {
    console.log(`Request ${rID}: ${new Date().toUTCString()}`);
  }, logInterval);
  setTimeout(function () {
    clearInterval(intervalId);
    response.end(new Date().toUTCString());
  }, duration);
}

function responseFavicon (req, res) {
  const rs = fs.createReadStream(path.join(__dirname, '../pub', 'favicon.ico'));
  rs.pipe(res);
}
