const express = require('express')
const cors = require('cors')
const {Board, Led, Motion} = require("johnny-five");
const board = new Board();
const app = express()
const port = 8000

app.use(cors());
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

let boardReady = false;
let LED = null;
let MOTION = null;


const SENSORS = {
  led: 13,
  motion: 7
}

const axios = require('axios');

board.on("ready", () => {
  // const led = new Led(13);
  // led.blink(500);
  boardReady = true;
  console.log('BOARD DETECTED! READY...');
  LED = new Led(SENSORS.led);
  MOTION = new Motion(SENSORS.motion);
  // "motionstart" events are fired when the "calibrated"
  // proximal area is disrupted, generally by some form of movement
  MOTION.on("motionstart", function() {
    console.log("motionstart");
    LED.blink(500);

    axios.post('https://54f8b5411077de202a9a4854b9e18ac0.m.pipedream.net/motion', {
      action: 'motion',
      location: 'office'
    })
    .then(function (response) {
      console.log(`${response.status}: ${response.statusText}`);
    })
    .catch(function (error) {
      console.log(error);
    });
  });

  // "motionend" events are fired following a "motionstart" event
  // when no movement has occurred in X ms
  MOTION.on("motionend", function() {
    console.log("motionend");
    LED.stop();
  });
});

app.get('/on', function (req, res) {
  console.log('REQUEST On');  
  LED.blink(500);
  LED.stop();
  res.send(200)
});

app.get('/off', function (req, res) {
  console.log('REQUEST Off');
  LED.stop();
  res.send(200)
});