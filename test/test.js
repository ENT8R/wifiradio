/* globals describe, it */
const { assert, expect } = require('chai');

const Wifiradio = require('../lib/wifiradio.js');

const ip = '192.168.178.27';
const pin = '1234';
const radio = new Wifiradio(ip, pin);

describe('wifiradio', function() {
  this.slow(500);

  // Power
  describe('#setPower()', () => {
    it('should indicate that the operation was successful', done => {
      radio.setPower(0).then(result => {
        done(assert.equal(result.status, 'FS_OK'));
      }).catch(error => {
        done(error);
      });
    });
    it('should reject the call because the value is wrong', () => {
      return radio.setPower(2).then(() => {
        return Promise.reject(new Error('Expected method to reject.'));
      }).catch(error => {
        expect(error).to.be.an('error');
        expect(error).to.be.an.instanceof(TypeError);
      });
    });
  });

  describe('#getPower()', () => {
    it('should return the current state', done => {
      radio.getPower().then(result => {
        done(assert.equal(result, 0));
      }).catch(error => {
        done(error);
      });
    });
  });

  // Mute
  describe('#setMute()', () => {
    it('should indicate that the operation was successful', done => {
      radio.setMute(0).then(result => {
        done(assert.equal(result.status, 'FS_OK'));
      }).catch(error => {
        done(error);
      });
    });
    it('should reject the call because the value is wrong', () => {
      return radio.setMute(2).then(() => {
        return Promise.reject(new Error('Expected method to reject.'));
      }).catch(error => {
        expect(error).to.be.an('error');
        expect(error).to.be.an.instanceof(TypeError);
      });
    });
  });

  describe('#getMute()', () => {
    it('should return the current state', done => {
      radio.getMute().then(result => {
        done(assert.equal(result, 0));
      }).catch(error => {
        done(error);
      });
    });
  });

  // Mode
  describe('#setMode()', () => {
    it('should indicate that the operation was successful', done => {
      radio.setMode(0).then(result => {
        done(assert.equal(result.status, 'FS_OK'));
      }).catch(error => {
        done(error);
      });
    });
  });

  describe('#getMode()', () => {
    it('should return the current mode', done => {
      radio.getMode().then(result => {
        done(assert.equal(result, 0));
      }).catch(error => {
        done(error);
      });
    });
  });

  // Volume
  describe('#setVolume()', () => {
    it('should indicate that the operation was successful', done => {
      radio.setVolume(6.4).then(result => {
        done(assert.equal(result.status, 'FS_OK'));
      }).catch(error => {
        done(error);
      });
    });
    it('should reject the call because the value is too high', () => {
      return radio.setVolume(30).then(() => {
        return Promise.reject(new Error('Expected method to reject.'));
      }).catch(error => {
        expect(error).to.be.an('error');
        expect(error).to.be.an.instanceof(TypeError);
      });
    });
  });

  describe('#getVolume()', () => {
    it('should return the current volume', done => {
      radio.getVolume().then(result => {
        done(assert.equal(result, 6));
      }).catch(error => {
        done(error);
      });
    });
  });
});
