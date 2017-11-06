const parseXML = require('xml2js').parseString;
const request = require('request');

let ip;
let pin;

//GET a session ID
function getSessionID() {
  return new Promise(function(callback) {
    request('http://' + ip + '/fsapi/CREATE_SESSION?pin=' + pin, function(error, response, body) {
      parseXML(body, function(err, parseResult) {
        callback(parseResult.fsapiResponse.sessionId[0]);
      });
    });
  });
};

//Make a request with a given operation and a possible value
function makeRequest(operation, value) {
  return new Promise(function(callback) {
    getSessionID().then(function(sessionId) {
      request('http://' + ip + '/fsapi/' + operation + '?pin=' + pin + '&sid=' + sessionId + '&value=' + value, function(error, response, body) {
        parseXML(body, function(err, result) {
          callback(result);
        });
      });
    });
  });
};

//SET Power
function setPower(state) {
  makeRequest('SET/netRemote.sys.power', state.toString());
};

//GET Power
function getPower(callback) {
  makeRequest('GET/netRemote.sys.power', '').then(function(result) {
    callback(result.fsapiResponse.value[0].u8[0]);
  });
};

//GET the first line of the display
function getName(callback) {
  makeRequest('GET/netRemote.play.info.name', '').then(function(result) {
    console.log(result);
    callback(result.fsapiResponse.value[0].c8_array[0]);
  });
};

//GET the second line of the display
function getText(callback) {
  makeRequest('GET/netRemote.play.info.text', '').then(function(result) {
    console.log(result.fsapiResponse.value[0].c8_array[0]);
    callback(result.fsapiResponse.value[0].c8_array[0]);
  });
};

//SET mute state
function setMute(state) {
  makeRequest('SET/netRemote.sys.audio.mute', state.toString());
};

//GET mute state
function getMute(callback) {
  makeRequest('GET/netRemote.sys.audio.mute', '').then(function(result) {
    callback(result.fsapiResponse.value[0].u8[0]);
  });
};

//SET current mode
function setMode(mode) {
  makeRequest('SET/netRemote.sys.mode', mode.toString());
};

//GET current mode
function getMode(callback) {
  makeRequest('GET/netRemote.sys.mode', '').then(function(result) {
    callback(result.fsapiResponse.value[0].u32[0]);
  });
};

//LIST available modes; returns a JSON array of all available modes
//TODO: this method does not work at the moment. Needs some research
function listModes(callback) {
  makeRequest('LIST_GET_NEXT/netRemote.sys.caps.validModes/-1', '').then(function(result) {
    callback(JSON.stringify(result.fsapiResponse.item[0].field));
  });
}

//SET the volume; accepts all values from 1-20
function setVolume(value) {
  makeRequest('SET/netRemote.sys.audio.volume', value.toString());
};

//GET the volume
function getVolume(callback) {
  makeRequest('GET/netRemote.sys.audio.volume', '').then(function(result) {
    callback(result.fsapiResponse.value[0].u8[0]);
  });
};

//And finally export the module
module.exports = function(ipAdress, radioPin) {
  if (!ipAdress) throw new Error('No IP adress specified');
  if (!radioPin) throw new Error('No PIN specified');

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
