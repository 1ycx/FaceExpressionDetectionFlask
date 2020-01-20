// Note "https://webrtchacks.com/webrtc-cv-tensorflow/";
// lt -h https://tunnel.datahub.at --port 5000

var analytElem = null;
var video = null;
var streamRef = null;

var drawCanvas = null;
var drawCtx = null;

var captureCanvas = null;
var captureCtx = null;

var timeOut1 = null;
var timeOut2 = null;

// var front = false;
var constraints = null;

var analytics = {
  "angry": 0,
  "disgust": 0,
  "fear": 0,
  "happy": 0,
  "sad": 0,
  "surprise": 0,
  "neutral": 0,
}

var adjustedCanvas = false;

// function flipCamera() {
//   front = !front;
//   constraints = { video: { facingMode: (front ? "user" : "environment") }, audio: false };
// }

// function checkCamera() {
//   if (form.device.value == "PC") {
//     document.getElementById(3).disabled = true;
//     document.getElementById(4).disabled = true;
//   }
//   else if (form.device.value == "Mobile") {
//     // Enable the camera options
//     document.getElementById(3).disabled = false;
//     document.getElementById(4).disabled = false;

//     // Set default to back camera
//     document.getElementById(4).checked = true;
//     front = false;
//   }
// }

// function switchRadio(action) {
//   if (action == "start") {
//     document.getElementById(1).disabled = true;
//     document.getElementById(2).disabled = true;
//     document.getElementById(3).disabled = true;
//     document.getElementById(4).disabled = true;
//   }
//   else if (action == "stop") {
//     document.getElementById(1).disabled = false;
//     document.getElementById(2).disabled = false;

//     document.getElementById(1).checked = true;
//   }
// }

function removeH2() {
  h2 = document.getElementById("h2-2");
  h2.remove();
}

function adjustCanvas(bool) {

  if (!adjustedCanvas || bool) {
    // clear canvas
    drawCanvas.width = drawCanvas.width;

    drawCanvas.width = video.videoWidth;
    drawCanvas.height = video.videoHeight;
    
    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;

    drawCtx.lineWidth = "5";
    drawCtx.strokeStyle = "blue";
    drawCtx.font = "20px Verdana";
    drawCtx.fillStyle = "red";

    adjustedCanvas = true;
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
        video.play();

        // switchRadio("start");
        timeInterval = setInterval(grab, 150);
      })
      .catch(function (err) {
        alert("Start Stream: Stream not started.");
        console.log("Start Stream:", err.name + ": " + err.message);
      });
  }
}

function iterateAnalytics() {
  
  // var text = "";
  for (var key in analytics) {
    var p = document.createElement("p");
    p.innerText = key.capitalize() + ": " + analytics[key];
    analytElem.appendChild(p);
    // text += ("  " + key.capitalize() + ":  " + analytics[key] + "\n")
  }
  return text;
}

function stopInterval() {
  clearInterval(timeInterval);
  // clearTimeout(timeOut);
}

function stopCamera() {
  // Check defaults
  if (streamRef === null) {
    console.log("Stop Stream: Stream not started/stopped.");
  }
  // Check stream
  else if (streamRef.active) {
    video.pause();
    streamRef.getTracks()[0].stop();
    video.srcObject = null;

    iterateAnalytics();

    stopInterval();

    // switchRadio("stop");

    adjustCanvas();
  }
}

function downloadFrame() {
  var link = document.createElement('a');
  link.download = 'frame.jpeg';
  link.href = document.getElementById('myCanvas').toDataURL("image/jpeg", 1);
  link.click();
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {

    String.prototype.capitalize = function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
    }

    video = document.querySelector("#videoElement");

    analytElem = document.getElementById("analytics");

    captureCanvas = document.getElementById("captureCanvas");
    captureCtx = captureCanvas.getContext("2d");

    drawCanvas = document.getElementById("drawCanvas");
    drawCtx = drawCanvas.getContext("2d");
  }
};

function grab() {
  captureCtx.drawImage(
    video,
    0,
    0,
    video.videoWidth,
    video.videoHeight,
    0,
    0,
    video.videoWidth,
    video.videoHeight,
  );
  console.log(captureCanvas.width, captureCanvas.height);
  captureCanvas.toBlob(upload, "image/jpeg");
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
    }
  };
  xhr.send(fd);
}

function drawBoxes(objects) {
  objects.forEach(object => {
    let label = object.label;
    let score = Number(object.score);
    let x = Number(object.x);
    let y = Number(object.y);
    let width = Number(object.width);
    let height = Number(object.height);

    analytics[label] += 1;

    adjustCanvas(true);

    drawCtx.fillText(label + " - " + score, x + 5, y + 20);
    drawCtx.strokeRect(x, y, width, height);
  });
}