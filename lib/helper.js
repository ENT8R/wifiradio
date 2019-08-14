const parseXML = require('xml2js').parseString;

const http = require('http');

let ip;
let pin;

// GET a session ID
function getSessionID() {
  return new Promise((resolve, reject) => {
    const qs = queryString({
      pin
    });
    get(`http://${ip}/fsapi/CREATE_SESSION?${qs}`).then(result => {
      resolve(result.fsapiResponse.sessionId[0]);
    }).catch(error => {
      return reject(error);
    });
  });
}

function get(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error(`Failed to load page, status code: ${response.statusCode}`));
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => {
        return parseXML(body, (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        });
      });
    });
    request.on('error', (error) => reject(error));
  });
}

// Make a request with a given operation and a possible value
function request(operation, value) {
  return new Promise((resolve, reject) => {
    getSessionID().then(sid => {
      const qs = queryString({
        pin,
        sid,
        value,
      });
      get(`http://${ip}/fsapi/${operation}?${qs}`).then(result => {
        resolve(result);
      });
    }).catch(error => {
      return reject(error);
    });
  });
}

function queryString(data) {
  return Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
}

module.exports = function(i, p) {
  const module = {};

  ip = i;
  pin = p;

  module.request = request;

  return module;
};
