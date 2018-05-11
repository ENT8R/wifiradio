const parseXML = require('xml2js').parseString;
const http = require('http');
const querystring = require('querystring');

// SET Power
function setPower(state) {
  return Helper.request('SET/netRemote.sys.power', state.toString());
}

// GET Power
function getPower() {
  return Helper.request('GET/netRemote.sys.power')
    .then(result => parseInt(result.fsapiResponse.value[0].u8[0]));
}

// GET the first line of the display
function getName() {
  return Helper.request('GET/netRemote.play.info.name')
    .then(result => result.fsapiResponse.value[0].c8_array[0]);
}

// GET the second line of the display
function getText() {
  return Helper.request('GET/netRemote.play.info.text')
    .then(result => result.fsapiResponse.value[0].c8_array[0]);
}

// SET mute state
function setMute(state) {
  return Helper.request('SET/netRemote.sys.audio.mute', state.toString());
}

// GET mute state
function getMute() {
  return Helper.request('GET/netRemote.sys.audio.mute')
    .then(result => parseInt(result.fsapiResponse.value[0].u8[0]));
}

// SET current mode
function setMode(mode) {
  return Helper.request('SET/netRemote.sys.mode', mode.toString());
}

// GET current mode
function getMode() {
  return Helper.request('GET/netRemote.sys.mode')
    .then(result => parseInt(result.fsapiResponse.value[0].u32[0]));
}

// LIST available modes; returns a JSON array of all available modes
// TODO: this method does not work at the moment. Needs some research
function listModes() { // eslint-disable-line no-unused-vars
  return Helper.request('LIST_GET_NEXT/netRemote.sys.caps.validModes/-1')
    .then(result => JSON.stringify(result.fsapiResponse.item[0].field));
}

// SET the volume; accepts all values from 1-20
function setVolume(value) {
  return Helper.request('SET/netRemote.sys.audio.volume', value.toString());
}

// GET the volume
function getVolume() {
  return Helper.request('GET/netRemote.sys.audio.volume')
    .then(result => parseInt(result.fsapiResponse.value[0].u8[0]));
}

const Helper = (() => {
  const me = {};
  let ip;
  let pin;

  // GET a session ID
  function getSessionID() {
    return new Promise((resolve, reject) => {
      const qs = querystring.stringify({
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
          return parseXML(body, (err, result) => {
            if (err) {
              return reject(err);
            }
            return resolve(result);
          });
        });
      });
      request.on('error', (error) => reject(error));
    });
  }

  // Make a request with a given operation and a possible value
  me.request = function(operation, value) {
    return new Promise((resolve, reject) => {
      getSessionID().then(sid => {
        const qs = querystring.stringify({
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
  };

  me.init = function(i, p) {
    ip = i;
    pin = p;
  };

  return me;
})();

// And finally export the module
module.exports = function(ip, pin) {
  if (!ip) {
    throw new Error('No IP adress specified');
  }
  if (!pin) {
    throw new Error('No PIN specified');
  }

  Helper.init(ip, pin);

  this.getPower = getPower;
  this.setPower = setPower;

  this.getName = getName;
  this.getText = getText;

  this.setMute = setMute;
  this.getMute = getMute;

  this.setMode = setMode;
  this.getMode = getMode;

  this.setVolume = setVolume;
  this.getVolume = getVolume;
};
