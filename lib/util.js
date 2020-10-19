const http = require('http');
const parseXML = require('xml2js').parseString;

class Util {
  constructor(ip, pin) {
    this.ip = ip;
    this.pin = pin;
    this.sid = null;
  }

  get(url) {
    return new Promise((resolve, reject) => {
      const request = http.get(url, response => {
        // Handle HTTP errors
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
      request.on('error', reject);
    });
  }

  // Make a request with a given operation and a possible value
  request(operation, value) {
    const qs = this.qs({
      pin: this.pin,
      sid: this.sid,
      value,
    });
    return this.get(`http://${this.ip}/fsapi/${operation}?${qs}`);
  }

  createSession() {
    const context = this;
    const qs = this.qs({
      pin: this.pin
    });
    return this.get(`http://${this.ip}/fsapi/CREATE_SESSION?${qs}`).then(result => {
      if (result.fsapiResponse.status[0] === 'FS_OK') {
        [ context.sid ] = result.fsapiResponse.sessionId;
        return context.sid;
      } else {
        throw new Error('Failed to create a new session');
      }
    });
  }

  deleteSession() {
    const context = this;
    const qs = this.qs({
      pin: this.pin
    });
    return this.get(`http://${this.ip}/fsapi/DELETE_SESSION?${qs}`).then(result => {
      if (result.fsapiResponse.status[0] === 'FS_OK') {
        context.sid = null;
      } else {
        throw new Error('Failed to delete the current session');
      }
    });
  }

  qs(data) {
    return Object.entries(data)
      .filter(([, value]) => value ? true : false)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
  }

  command(endpoint) {
    return endpoint.startsWith('netRemote.') ? endpoint : `netRemote.${endpoint}`;
  }
}

module.exports = Util;
