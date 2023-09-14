import * as handTrack from "handtrackjs";

const video = document.getElementById("webcam");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const volumeSlider = document.getElementById("vol");

const modelParams = {
  flipHorizontal: true,
  maxNumBoxes: 1,
  iouThreshold: 0.5,
  scoreThreshold: 0.2,
};

// Inicializa el video y luego el modelo
function initialize() {
  handTrack.startVideo(video).then((status) => {
    if (status) {
      loadModelAndRunDetection();
    } else {
      console.error("No se pudo iniciar el video");
    }
  });
}

function loadModelAndRunDetection() {
  handTrack.load(modelParams).then((model) => {
    if (model) {
      runDetection(model);
    } else {
      console.error("Error al cargar el modelo");
    }
  });
}

let previousX = null; // Variable para almacenar la posición anterior en X de la mano

function runDetection(model) {
  model.detect(video).then((predictions) => {
    if (predictions.length) {
      const hand = predictions[0];

      const handPositionX = hand.bbox[0] + hand.bbox[2] / 2 / 2;
      const relativePosition = handPositionX / video.width;
      volumeSlider.value = Math.min(
        1,
        Math.max(0, relativePosition.toFixed(3))
      );
      sendOscWithValue(volumeSlider.value * 2); // Llamada a la función para enviar el mensaje OSC
    }

    model.renderPredictions(predictions, canvas, context, video);
    requestAnimationFrame(() => runDetection(model));
  });
}

// Inicia todo
initialize();
