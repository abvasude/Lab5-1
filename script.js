//script.js

const img = new Image(); // used to load image from <input> and draw to canvas

// Fires whenever the img object loads a new image (such as with img.src =)
const canvas = document.getElementById("user-image");
const ctx = canvas.getContext('2d');
img.addEventListener('load', () => {
  // TODO
  const voice = document.getElementById("voice-selection");
  voice.disabled = false;

  ctx.fillStyle = 'black';

  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const dimensions = getDimmensions(canvas.width, canvas.height, img.naturalWidth, img.naturalHeight);
  ctx.drawImage(img, dimensions['startX'], dimensions['startY'], dimensions['width'], dimensions['height']);
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected

});

//CHANGE IMAGE VIA UPDATING SRC AND ALT
const imageInput = document.querySelector("[type='file']");
imageInput.addEventListener('change', () => {
  const objectURL = URL.createObjectURL(imageInput.files[0]);
  img.src = objectURL;
  img.alt = objectURL.split("/").pop();
});
//GENERATE MEME EVENT LISTENER
function submit(event) {
  ctx.fillStyle = 'white';
  ctx.font = '30px san-serif';
  ctx.textAlign = "center";
  ctx.textContent = 'black';
  //topText.value.style.border = "thick solid #0000FF";
  ctx.fillText(topText.value, canvas.width/2, 50);
  ctx.fillText(bottomText.value, canvas.width/2, 370);
  sub_button.disabled = true;
  reset.disabled = false;
  read_text.disabled = false;
  event.preventDefault();
}
//initializing buttons, texts, etc.
const sub_button = document.querySelector("[type='submit']");
const sub = document.getElementById("generate-meme");
const reset = document.querySelector("[type='reset']");
const read_text= document.querySelector("[type='button']");
const topText = document.getElementById('text-top');
const bottomText = document.getElementById('text-bottom');
sub.addEventListener('submit', submit);

//CLEAR BUTTON EVENT LISTENER
reset.addEventListener('click', () => {
  ctx.clearRect(0,0, 400, 400);
  sub_button.disabled = false;
  reset.disabled = true;
  read_text.disabled = true;
});

//CODE FOR READ TEXT BUTTON
var synth = window.speechSynthesis;
var inputTxt = document.querySelector("[type='text']");
var inputTxt2 = document.getElementById('text-bottom');
var voiceSelect = document.querySelector('select');
var inputTxtArr = [inputTxt, inputTxt2];

var utterThis;
var voices = [];

function populateVoiceList() {
  voices = synth.getVoices();

  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

read_text.onclick = function(event) {
  event.preventDefault();

  utterThis = new SpeechSynthesisUtterance(inputTxtArr[0].value + " " + inputTxtArr[1].value);
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }
  utterThis.volume = input.value/100;
  synth.speak(utterThis);
  
  inputTxt.blur();
}


//Code for volume slider
const input = document.querySelector("[type='range']");
const volume = document.getElementById("volume-group");
input.addEventListener('input', () => {
  var images = document.getElementsByTagName('img');
  if(input.value <= 100 && input.value >= 67){
    images[0].src = "icons/volume-level-3.svg";
    images[0].alt = "Volume Level 3";
  }
  else if(input.value <67 && input.value >33){
    images[0].src = "icons/volume-level-2.svg";
    images[0].alt = "Volume Level 2";
  }
  else if(input.value <=33 && input.value >0){
    images[0].src = "icons/volume-level-1.svg";
    images[0].alt = "Volume Level 1";
  }
  else{
    images[0].src = "icons/volume-level-0.svg";
    images[0].alt = "Volume Level 0";
  }
    
});


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
