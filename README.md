# WiFi-Radio

[![dependencies Status](https://david-dm.org/ent8r/wifiradio/status.svg)](https://david-dm.org/ent8r/wifiradio) [![Travis](https://travis-ci.org/ENT8R/wifiradio.svg?branch=master)](https://travis-ci.org/ENT8R/wifiradio) [![NPM Version](http://img.shields.io/npm/v/wifiradio.svg)](https://www.npmjs.org/package/wifiradio) [![NPM Downloads](https://img.shields.io/npm/dm/wifiradio.svg)](https://www.npmjs.org/package/wifiradio)

NodeJS module for controlling WiFi-radios

## Installation

```
npm install wifiradio --save
```

## Usage

```javascript
const Wifiradio = require('wifiradio');

const ip = '192.168.178.27'; // Change this to the ip adress of your radio
const pin = '1234'; // This is the default PIN for the radio. (Works in most cases)

const radio = new Wifiradio(ip, pin);

radio.setPower(1).then(() => {
  radio.getPower().then(result => {
    console.log(`Power: ${result}`);
  });
});

radio.getMute().then(result => {
  console.log(`Mute: ${result}`);
});

radio.getText().then(result => {
  console.log(`Text: ${result}`);
});

radio.getMode().then(result => {
  console.log(`Mode: ${result}`);
});
```

## Features

This page lists all commands that are directly accessible with the use of this library. These commands only provide a very simple high-level access to the features of your radio.

:warning: For more advanced use cases I suggest that you may take a look at [this very extensive list of possible commands](https://github.com/flammy/fsapi/blob/master/FSAPI.md) and don't use the functions listed below but rather access the API via the following function for direct access:

#### Direct Access
```javascript
radio.get('sys.sleep').then(console.log);
radio.get('netRemote.sys.sleep').then(console.log);

radio.set('sys.sleep', 60).then(console.log);

radio.get('sys.info.friendlyname').then(console.log);
radio.set('sys.audio.volume', 5).then(console.log);
```

---

### Power

```javascript
// Turn on
radio.setPower(1);

// Turn off
radio.setPower(0);

// Get whether the radio is on or off (returns 0 or 1)
radio.getPower().then(console.log);
```

### Mute

```javascript
// Mute on
radio.setMute(1);

// Mute off
radio.setMute(0);

// Get whether the radio is mute or not (returns 0 or 1)
radio.getMute().then(console.log);
```

### Volume

```javascript
// Set volume (value from 1-20)
radio.setVolume(10);

// Get the current volume (returns a value from 1-20)
radio.getVolume().then(console.log);
```

### Modes

```javascript
// Set a mode
radio.setMode(2);

// Get the current playing mode
radio.getMode().then(console.log);
```

### Display

```javascript
// Get the first line of the display
radio.getName().then(console.log);

// Get the second line of the display
radio.getText().then(console.log);
```

## Contributing

There are many more requests that could be done by this module. If you think that something is missing just open an issue for that or make a pull request. If you need some help, you can have a look [here](https://github.com/flammy/fsapi/blob/master/FSAPI.md) for some further requests.

## License

[GPL-3.0](https://github.com/ENT8R/wifiradio/blob/master/LICENSE)
