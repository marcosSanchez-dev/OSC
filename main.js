import * as handTrack from "handtrackjs";

const video = document.getElementById("webcam");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const modelParams = {
  flipHorizontal: true,
  maxNumBoxes: 1,
  iouThreshold: 0.5,
  scoreThreshold: 0.7,
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

function runDetection(model) {
  model.detect(video).then((predictions) => {
    if (predictions.length && predictions[0].label === "closed") {
      sendOscMessage();
    }

    model.renderPredictions(predictions, canvas, context, video);
    requestAnimationFrame(() => runDetection(model)); // Pasamos el modelo como argumento
  });
}

// Inicia todo
initialize();
