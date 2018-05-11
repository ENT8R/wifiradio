/* globals describe */
/* globals it */

const chai = require('chai');

const assert = chai.assert;

const wifiradio = require('../index.js');

const ip = '192.168.178.27';
const pin = '1234';

const radio = new wifiradio(ip, pin);


describe('wifiradio', function() {
  this.slow(500);

  describe('#setPower()', () => {
    it('should indicate that the operation was successful', (done) => {
      radio.setPower(0).then((data) => {
        done(assert.equal(data.fsapiResponse.status, 'FS_OK'));
      }).catch((error) => {
        done(error);
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

  describe('#setMute()', () => {
    it('should indicate that the operation was successful', (done) => {
      radio.setMute(0).then((data) => {
        done(assert.equal(data.fsapiResponse.status, 'FS_OK'));
      }).catch((error) => {
        done(error);
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
});
