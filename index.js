const express = require('express')
const cors = require('cors')
const {Board, Led} = require("johnny-five");
const board = new Board();
const app = express()
const port = 8000

app.use(cors());
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

let boardReady = false;
let LED = null;

board.on("ready", () => {
  // const led = new Led(13);
  // led.blink(500);
  boardReady = true;
  console.log('BOARD DETECTED! READY...');
  LED = new Led(13);
});

app.get('/on', function (req, res) {
  console.log('REQUEST On');  
  LED.blink(500);
  res.send(200)
});

app.get('/off', function (req, res) {
  console.log('REQUEST Off');
  LED.stop();
  res.send(200)
});