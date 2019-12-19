var reference = "https://webrtchacks.com/webrtc-cv-tensorflow/";

var video = null;
var streamRef = null;

var imageCanvas = null;
var imageCtx = null;


var timeOut1 = null;
var timeOut2 = null;

var front = false;
var constraints = null;

function flipCamera() {
  front = !front;
  constraints = { video: { facingMode: (front ? "user" : "environment") }, audio: false };
}

function checkCamera() {
  if (form.device.value == "PC") {
    document.getElementById(3).disabled = true;
    document.getElementById(4).disabled = true;
  }
  else if (form.device.value == "Mobile") {
    // Enable the camera options
    document.getElementById(3).disabled = false;
    document.getElementById(4).disabled = false;

    // Set default to back camera
    document.getElementById(4).checked = true;
    front = false;
  }
}

function switchRadio(action) {
  if (action == "start") {
    document.getElementById(1).disabled = true;
    document.getElementById(2).disabled = true;
    document.getElementById(3).disabled = true;
    document.getElementById(4).disabled = true;
  }
  else if (action == "stop") {
    document.getElementById(1).disabled = false;
    document.getElementById(2).disabled = false;
  }
}

function startCamera() {

  // Stop if already playing
  stopCamera();

  // Defaults
  if (constraints === null)
    constraints = { video: true, audio: false };

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        video.srcObject = stream;
        streamRef = stream;

        switchRadio("start");
        timeOut1 = setTimeout(grab, 40);
      })
      .catch(function (err) {
        alert("Start Stream: Stream not started.");
        console.log("Start Stream:", err.name + ": " + err.message);
      });
  }
}

function stopCamera() {
  // Check defaults
  if (streamRef === null) {
    console.log("Stop Stream: Stream not started/stopped.");
  }
  // Check stream
  else if (streamRef.active) {
    streamRef.getTracks()[0].stop();
    video.pause();
    video.srcObject = null;

    switchRadio("stop");
  }
}

function downloadFrame() {
  var link = document.createElement('a');
  link.download = 'filename.png';
  link.href = document.getElementById('myCanvas').toDataURL("image/jpeg", 1)
  link.click();
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {

    video = document.querySelector("#videoElement");

    imageCanvas = document.getElementById("myCanvas");
    imageCtx = imageCanvas.getContext("2d");

    imageCanvas.width = 640;
    imageCanvas.height = 480;

    imageCtx.lineWidth = "4";
    imageCtx.strokeStyle = "cyan";
    imageCtx.font = "20px Verdana";
    imageCtx.fillStyle = "red";

  }
};

function grab() {
  imageCtx.drawImage(
    video,
    0,
    0,
    video.videoWidth,
    video.videoHeight,
    0,
    0,
    640,
    480
  );
  imageCanvas.toBlob(upload, "image/jpeg");
}

function upload(blob) {
  var fd = new FormData();
  fd.append("file", blob);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/uploade", true);
  xhr.onload = function () {
    if (this.status == 200) {
      objects = JSON.parse(this.response);

      drawBoxes(objects);

      timeOut2 = setTimeout(grab, 40);
    }
  };
  xhr.send(fd);
}

function drawBoxes(objects) {
  // imageCtx.clearRect(0, 0, 640, 480);
  console.log("reached in objects", objects);
  objects.forEach(object => {
    let label = object.label;
    let score = Number(object.score);
    let x = Number(object.x);
    let y = Number(object.y);
    let width = Number(object.width);
    let height = Number(object.height);

    imageCtx.fillText(label + " - " + score * 100 + "%", x + 5, y + 20);
    imageCtx.strokeRect(x, y, width, height);
  });
}