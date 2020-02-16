const Util = require('./util');

class Wifiradio {
  constructor(ip, pin) {
    if (!ip || !pin) {
      throw new Error('Please supply all parameters to the constructor!');
    }
    this.util = new Util(ip, pin);
  }

  getPower() {
    return this.util.request('GET/netRemote.sys.power').then(result =>
      Number.parseInt(result.fsapiResponse.value[0].u8[0])
    );
  }

  setPower(state) {
    return new Promise((resolve, reject) => {
      state = Number.parseInt(state);
      if (state < 0 || state > 1) {
        return reject(new TypeError('The value must be either 0 or 1'));
      }
      const result = this.util.request('SET/netRemote.sys.power', state.toString());
      return resolve(result);
    });
  }

  // Returns the first line of the radio display
  getName() {
    return this.util.request('GET/netRemote.play.info.name').then(result =>
      result.fsapiResponse.value[0].c8_array[0]
    );
  }

  // Returns the second line of the radio display
  getText() {
    return this.util.request('GET/netRemote.play.info.text').then(result =>
      result.fsapiResponse.value[0].c8_array[0]
    );
  }

  getMute() {
    return this.util.request('GET/netRemote.sys.audio.mute').then(result =>
      Number.parseInt(result.fsapiResponse.value[0].u8[0])
    );
  }

  setMute(state) {
    return new Promise((resolve, reject) => {
      state = Number.parseInt(state);
      if (state < 0 || state > 1) {
        return reject(new TypeError('The value must be either 0 or 1'));
      }
      const result = this.util.request('SET/netRemote.sys.audio.mute', state.toString());
      return resolve(result);
    });
  }

  getMode() {
    return this.util.request('GET/netRemote.sys.mode').then(result =>
      Number.parseInt(result.fsapiResponse.value[0].u32[0])
    );
  }

  setMode(mode) {
    return this.util.request('SET/netRemote.sys.mode', Math.round(Number.parseInt(mode)).toString());
  }

  // TODO: this method does not work at the moment. Needs some more research.
  getModes() {
    return this.util.request('LIST_GET_NEXT/netRemote.sys.caps.validModes/-1').then(result =>
      JSON.stringify(result.fsapiResponse.item[0].field)
    );
  }

  getVolume() {
    return this.util.request('GET/netRemote.sys.audio.volume').then(result =>
      Number.parseInt(result.fsapiResponse.value[0].u8[0])
    );
  }

  setVolume(volume) {
    return new Promise((resolve, reject) => {
      volume = Number.parseInt(volume);
      if (volume < 1 || volume > 20) {
        return reject(new TypeError('The value must be something between 1 and 20'));
      }
      const result = this.util.request('SET/netRemote.sys.audio.volume', Math.round(volume).toString());
      return resolve(result);
    });
  }
}

module.exports = Wifiradio;
