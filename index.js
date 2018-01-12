const parseXML = require('xml2js').parseString;
const request = require('request');

let ip;
let pin;

//GET a session ID
function getSessionID() {
  return new Promise((resolve, reject) => {
    request({
      url: `http://${ip}/fsapi/CREATE_SESSION`,
      qs: {
        pin,
      },
    }, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return reject(error);
      }
      parseXML(body, (err, parseResult) => {
        if (err) {
          return reject(err);
        }
        resolve(parseResult.fsapiResponse.sessionId[0]);
      });
    });
  });
};

//Make a request with a given operation and a possible value
function makeRequest(operation, value) {
  return new Promise((resolve, reject) => {
    getSessionID().then(sid => {
      request({
        url: `http://${ip}/fsapi/${operation}`,
        qs: {
          pin,
          sid,
          value,
        },
      }, (error, response, body) => {
        if (error || response.statusCode !== 200) {
          return reject(error);
        }
        parseXML(body, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    });
  });
};

//SET Power
function setPower(state) {
  return makeRequest('SET/netRemote.sys.power', state.toString());
};

//GET Power
function getPower() {
  return makeRequest('GET/netRemote.sys.power')
    .then(result => parseInt(result.fsapiResponse.value[0].u8[0]));
};

//GET the first line of the display
function getName() {
  return makeRequest('GET/netRemote.play.info.name')
    .then(result => result.fsapiResponse.value[0].c8_array[0]);
};

//GET the second line of the display
function getText() {
  return makeRequest('GET/netRemote.play.info.text')
    .then(result => result.fsapiResponse.value[0].c8_array[0]);
};

//SET mute state
function setMute(state) {
  return makeRequest('SET/netRemote.sys.audio.mute', state.toString());
};

//GET mute state
function getMute() {
  return makeRequest('GET/netRemote.sys.audio.mute')
    .then(result => parseInt(result.fsapiResponse.value[0].u8[0]));
};

//SET current mode
function setMode(mode) {
  return makeRequest('SET/netRemote.sys.mode', mode.toString());
};

//GET current mode
function getMode() {
  return makeRequest('GET/netRemote.sys.mode')
    .then(result => parseInt(result.fsapiResponse.value[0].u32[0]));
};

//LIST available modes; returns a JSON array of all available modes
//TODO: this method does not work at the moment. Needs some research
function listModes() {
  return makeRequest('LIST_GET_NEXT/netRemote.sys.caps.validModes/-1')
    .then(result => JSON.stringify(result.fsapiResponse.item[0].field));
}

//SET the volume; accepts all values from 1-20
function setVolume(value) {
  return makeRequest('SET/netRemote.sys.audio.volume', value.toString());
};

//GET the volume
function getVolume() {
  return makeRequest('GET/netRemote.sys.audio.volume')
    .then(result => parseInt(result.fsapiResponse.value[0].u8[0]));
};

//And finally export the module
module.exports = function(ipAdress, radioPin) {
  if (!ipAdress) {
    throw new Error('No IP adress specified');
  }

  if (!radioPin) {
    throw new Error('No PIN specified');
  }

  ip = ipAdress;
  pin = radioPin;

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
