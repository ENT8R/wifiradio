const http = require('http');
const parseXML = require('xml2js').parseString;

class Util {
  constructor(ip, pin) {
    this.ip = ip;
    this.pin = pin;
  }

  sid() {
    return new Promise((resolve, reject) => {
      const qs = this.qs({
        pin: this.pin
      });
      this.get(`http://${this.ip}/fsapi/CREATE_SESSION?${qs}`).then(result => {
        resolve(result.fsapiResponse.sessionId[0]);
      }).catch(error => reject(error));
    });
  }

  get(url) {
    return new Promise((resolve, reject) => {
      const request = http.get(url, response => {
        // handle http errors
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(new Error(`Failed to load page, status code: ${response.statusCode}`));
        }
        const body = [];
        response.on('data', chunk => body.push(chunk));
        response.on('end', () => {
          return parseXML(body, (error, result) => {
            if (error) {
              return reject(error);
            }
            return resolve(result);
          });
        });
      });
      request.on('error', error => reject(error));
    });
  }

  // Make a request with a given operation and a possible value
  request(operation, value) {
    return new Promise((resolve, reject) => {
      this.sid().then(sid => {
        const qs = this.qs({
          pin: this.pin,
          sid,
          value,
        });
        this.get(`http://${this.ip}/fsapi/${operation}?${qs}`).then(result => {
          resolve(result);
        });
      }).catch(error => reject(error));
    });
  }

  qs(data) {
    return Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
  }
}

module.exports = Util;
