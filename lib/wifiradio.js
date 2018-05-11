let Helper;

// SET Power
function setPower(state) {
  return new Promise((resolve, reject) => {
    if (parseInt(state) < 0 || parseInt(state) > 1) {
      return reject(new TypeError('The value must be either 0 or 1'));
    }
    const result = Helper.request('SET/netRemote.sys.power', state.toString());
    return resolve(result);
  });
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
  return new Promise((resolve, reject) => {
    if (parseInt(state) < 0 || parseInt(state) > 1) {
      return reject(new TypeError('The value must be either 0 or 1'));
    }
    const result = Helper.request('SET/netRemote.sys.audio.mute', state.toString());
    return resolve(result);
  });
}

// GET mute state
function getMute() {
  return Helper.request('GET/netRemote.sys.audio.mute')
    .then(result => parseInt(result.fsapiResponse.value[0].u8[0]));
}

// SET current mode
function setMode(mode) {
  return Helper.request('SET/netRemote.sys.mode', Math.round(parseInt(mode)).toString());
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
  return new Promise((resolve, reject) => {
    if (value < 1 || value > 20) {
      return reject(new TypeError('The value must be something between 1 and 20'));
    }
    const result = Helper.request('SET/netRemote.sys.audio.volume', Math.round(parseInt(value)).toString());
    return resolve(result);
  });
}

// GET the volume
function getVolume() {
  return Helper.request('GET/netRemote.sys.audio.volume')
    .then(result => parseInt(result.fsapiResponse.value[0].u8[0]));
}

// And finally export the module
module.exports = function(ip, pin) {
  const module = {};

  if (!ip) {
    throw new Error('No IP adress specified');
  }
  if (!pin) {
    throw new Error('No PIN specified');
  }

  Helper = require('./helper')(ip, pin);

  module.getPower = getPower;
  module.setPower = setPower;

  module.getName = getName;
  module.getText = getText;

  module.setMute = setMute;
  module.getMute = getMute;

  module.setMode = setMode;
  module.getMode = getMode;

  module.setVolume = setVolume;
  module.getVolume = getVolume;

  return module;
};
