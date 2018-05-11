/* globals describe */
/* globals it */

const chai = require('chai');

const assert = chai.assert;
const expect = chai.expect;

const wifiradio = require('../index.js');

const ip = '192.168.178.27';
const pin = '1234';

const radio = new wifiradio(ip, pin);


describe('wifiradio', function() {
  this.slow(500);

  // power
  describe('#setPower()', () => {
    it('should indicate that the operation was successful', (done) => {
      radio.setPower(0).then((data) => {
        done(assert.equal(data.fsapiResponse.status, 'FS_OK'));
      }).catch((error) => {
        done(error);
      });
    });
    it('should reject the call because the value is wrong', () => {
      return radio.setPower(2).then(() => {
        return Promise.reject(new Error('Expected method to reject.'));
      }).catch((error) => {
        expect(error).to.be.an('error');
        expect(error).to.be.an.instanceof(TypeError);
      });
    });
  });
  describe('#getPower()', () => {
    it('should return the current state', (done) => {
      radio.getPower().then((data) => {
        done(assert.equal(data, 0));
      }).catch((error) => {
        done(error);
      });
    });
  });

  // mute
  describe('#setMute()', () => {
    it('should indicate that the operation was successful', (done) => {
      radio.setMute(0).then((data) => {
        done(assert.equal(data.fsapiResponse.status, 'FS_OK'));
      }).catch((error) => {
        done(error);
      });
    });
    it('should reject the call because the value is wrong', () => {
      return radio.setMute(2).then(() => {
        return Promise.reject(new Error('Expected method to reject.'));
      }).catch((error) => {
        expect(error).to.be.an('error');
        expect(error).to.be.an.instanceof(TypeError);
      });
    });
  });
  describe('#getMute()', () => {
    it('should return the current state', (done) => {
      radio.getMute().then((data) => {
        done(assert.equal(data, 0));
      }).catch((error) => {
        done(error);
      });
    });
  });

  // mode
  describe('#setMode()', () => {
    it('should indicate that the operation was successful', (done) => {
      radio.setMode(0).then((data) => {
        done(assert.equal(data.fsapiResponse.status, 'FS_OK'));
      }).catch((error) => {
        done(error);
      });
    });
  });
  describe('#getMode()', () => {
    it('should return the current mode', (done) => {
      radio.getMode().then((data) => {
        done(assert.equal(data, 0));
      }).catch((error) => {
        done(error);
      });
    });
  });

  // volume
  describe('#setVolume()', () => {
    it('should indicate that the operation was successful', (done) => {
      radio.setVolume(6.4).then((data) => {
        done(assert.equal(data.fsapiResponse.status, 'FS_OK'));
      }).catch((error) => {
        done(error);
      });
    });
    it('should reject the call because the value is too high', () => {
      return radio.setVolume(30).then(() => {
        return Promise.reject(new Error('Expected method to reject.'));
      }).catch((error) => {
        expect(error).to.be.an('error');
        expect(error).to.be.an.instanceof(TypeError);
      });
    });
  });
  describe('#getVolume()', () => {
    it('should return the current volume', (done) => {
      radio.getVolume().then((data) => {
        done(assert.equal(data, 6));
      }).catch((error) => {
        done(error);
      });
    });
  });
});
