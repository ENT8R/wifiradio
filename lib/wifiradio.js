const Util = require('./util');

class Wifiradio {
  constructor(ip, pin) {
    if (!ip || !pin) {
      throw new Error('Please supply all parameters to the constructor!');
    }
    this.util = new Util(ip, pin);
  }

  get(endpoint) {
    return this.util.request(`GET/${this.util.command(endpoint)}`)
      .then(result => result.fsapiResponse.value[0])
      .then(values => {
        const [ [key, [value]] ] = Object.entries(values);
        return ['u8', 'u16', 'u32'].includes(key) ? Number.parseInt(value) : value;
      });
  }

  set(endpoint, value) {
    return this.util.request(`SET/${this.util.command(endpoint)}`, value.toString()).then(result => result.fsapiResponse);
  }

  createSession() {
    return this.util.createSession();
  }

  deleteSession() {
    return this.util.deleteSession();
  }

  /* ------------ Basic predefined commands to the API ------------ */
  getPower() {
    return this.get('netRemote.sys.power');
  }

  setPower(state) {
    return new Promise((resolve, reject) => {
      state = Number.parseInt(state);
      if (state < 0 || state > 1) {
        return reject(new TypeError('The value must be either 0 or 1'));
      }
      const result = this.set('netRemote.sys.power', state);
      return resolve(result);
    });
  }

  // Returns the first line of the radio display
  getName() {
    return this.get('netRemote.play.info.name');
  }

  // Returns the second line of the radio display
  getText() {
    return this.get('netRemote.play.info.text');
  }

  getMute() {
    return this.get('netRemote.sys.audio.mute');
  }

  setMute(state) {
    return new Promise((resolve, reject) => {
      state = Number.parseInt(state);
      if (state < 0 || state > 1) {
        return reject(new TypeError('The value must be either 0 or 1'));
      }
      return resolve(this.set('netRemote.sys.audio.mute', state));
    });
  }

  getMode() {
    return this.get('netRemote.sys.mode');
  }

  setMode(mode) {
    return this.set('netRemote.sys.mode', Math.round(Number.parseInt(mode)));
  }

  // TODO: this method does not work at the moment. Needs some more research.
  getModes() {
    return this.util.request('LIST_GET_NEXT/netRemote.sys.caps.validModes/-1').then(result =>
      JSON.stringify(result.fsapiResponse.item[0].field)
    );
  }

  getVolume() {
    return this.get('netRemote.sys.audio.volume');
  }

  setVolume(volume) {
    return new Promise((resolve, reject) => {
      volume = Number.parseInt(volume);
      if (volume < 1 || volume > 20) {
        return reject(new TypeError('The value must be something between 1 and 20'));
      }
      return resolve(this.set('netRemote.sys.audio.volume', Math.round(volume)));
    });
  }
}

module.exports = Wifiradio;
