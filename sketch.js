const MODEL_URL = 'models/';
let canvas;
let vid;
let results;
let landmarks;
let btn;
let div;
let loaded = false;

let points = 0;
let laugh;
let neutral;

let size = 0.5;
let canvas_width = 560;
let canvas_height = 315;
let resizeFactor = 1;

function preload() {
  laugh = loadImage("laughing-smiley.png");
  neutral = loadImage("neutral-smiley.png");
}

function setup() {
  //div = createDiv('<br>face-api models are loading...');
  
  canvas = createCanvas(canvas_width, canvas_height);
  /*.parent('myCanvas');*/

  // use an async callback to load in the models and run the getResults() function
  vid = createCapture(VIDEO, async () => {
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
    await faceapi.loadFaceExpressionModel(MODEL_URL);
    //div.elt.innerHTML = '<br>model loaded!';
    loaded = true;
    
    document.getElementById("points").innerText = "Press Start";
    getResults(); // init once
  })
  vid.size(canvas_width, canvas_height);
  vid.hide();
}

async function getResults() {
  results = await faceapi.detectSingleFace(vid.elt).withFaceExpressions();
  getResults();
}

/*function resize() {
  canvas_width = document.getElementById("myCanvas").clientWidth;
  canvas_height = document.getElementById("myCanvas").clientHeight;

  resizeFactor = 560 / canvas_width;
  resizeCanvas(canvas_width, canvas_height);
  vid.size(canvas_width, canvas_height);
}*/

function draw() {
  //resize();
    background(255);
    if (points > 0) {
      /*imageMode(CORNERS);
      image(vid, 0, 0);*/
      if (loaded) {

        // results
        if (results) {

          // draw bounding box
          let x = results.detection.box.x / resizeFactor;
          let y = results.detection.box.y / resizeFactor;
          let w = results.detection.box.width / resizeFactor;
          let h = results.detection.box.height / resizeFactor;

          // expressions
          let expressions = [];
          for (var expr in results.expressions) {
            expressions.push([expr, results.expressions[expr]]);
          }

          let label;
          let confidence;
          let emotion;
          for (let i = 0; i < expressions.length - 1; i++) {
            label = expressions[i][0];
            confidence = expressions[i][1];
            if (confidence > 0.8) {
              emotion = label;
            }
          }

          console.log(emotion);

          imageMode(CENTER);

          if (emotion == "happy") {
            points--;
            document.getElementById("smiley").src = "laughing-smiley.png";
            //image(laugh, x+w/3, y+h/2, w*2, w*0.72*2);
          } else {
            document.getElementById("smiley").src = "neutral-smiley.png";
            //image(neutral, x+w/3, y+h/2, w*1.5, w*1.5);
          }

          

          
        }
        document.getElementById("points").innerText = "Points: " + points;
      }
    } else {
        background(0);
        textSize(30);
        textAlign(CENTER, CENTER);
        fill(255);
        stroke(255);
        if (loaded) {
          document.getElementById("points").innerHTML = "Press Start";
        }
        stopVideo();
        
      }
}