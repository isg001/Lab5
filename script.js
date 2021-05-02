// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

/**
 * Canvas
 */
let canvas = document.getElementById('user-image');
let context = canvas.getContext('2d');

/**
 * Buttons
 */
let generate = document.getElementsByTagName("button")[0];
let clear = document.getElementsByTagName("button")[1];
let readText = document.getElementsByTagName("button")[2];
let submit = document.getElementById('generate-meme');
let voiceChoose = document.getElementById('voice-selection');
var volume = document.getElementById('volume-group').querySelector('input');

/**
 * Top and Bottom text
 */
 let topText = document.getElementById('text-top');
 let bottomText = document.getElementById('text-bottom');

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  /**
   * HTML FILE:
   * height = "400"
   * width = "400"
   */

  /* Clear canvas context */
  context.clearRect(0,0,canvas.width,canvas.height);

  /** Fill the canvas context with black to add borders on non-square images
   */
  context.fillStyle='black';
  context.fillRect(0,0,canvas.width,canvas.height);

  /** draw the uploaded image onto the canvas with the correct width, height, leftmost
   *  coordinate (startX), and topmost coordinate (startY) using generated 
   * dimensions from the given function getDimensions 
   * */
  let imgDimensions = getDimmensions(canvas.width,canvas.height,img.width,img.height);
  context.drawImage(img,imgDimensions.startX,imgDimensions.startY,imgDimensions.width,imgDimensions.height);

  /* Toggle the relevant buttons (submit, clear, and read text buttons) 
   * by disabling or enabling them as needed */
  generate.disabled = false;
  clear.disabled = true;
  readText.disabled = true;

});

/** 
 *  'change'
 */
let imageInput = document.getElementById("image-input");
imageInput.addEventListener('change', () => {
  img.src = URL.createObjectURL(imageInput.files[0]);
});

/** 
 *  'submit'
 */
submit.addEventListener('submit', (ev) => {
  
  ev.preventDefault();
  
  context.font = "35px impact";
  context.fillStyle = "white";
  context.textAlign = "center";

  context.fillText(topText.value, (canvas.width)/2, 35);
  context.fillText(bottomText.value, (canvas.width)/2, 395);

  generate.disabled = true;
  clear.disabled = false;
  readText.disabled = false;
});

/**
 * 'click'
 */
clear.addEventListener('click', (ev) =>{
  
  ev.preventDefault();

  context.clearRect(0,0,canvas.width,canvas.height);
  img.src = '#';
  topText.value='';
  bottomText.value='';

  generate.disabled = false;
  clear.disabled = true;
  readText.disabled = true;

});

/**
 * Populate Voice List from reference
 */
function populateVoiceList() {
  if(typeof speechSynthesis === 'undefined') {
    return;
  }
  
  voiceChoose.disabled = false;
  var voices = speechSynthesis.getVoices();

  if (voices.length > 0){
    voiceChoose.removeChild(voiceChoose.getElementsByTagName('option')[0]);
  }

  for(var i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceChoose.appendChild(option);
  }
}

populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

readText.addEventListener('click', () =>{
  
  let topUtter = topText.value;
  let bottomUtter = bottomText.value;
  let memeUtter = topUtter + bottomUtter;

  let voiceSelect = document.querySelector('#voice-selection').selectedIndex;
  const voices = speechSynthesis.getVoices();
  
  let utter = new SpeechSynthesisUtterance(memeUtter);
  utter.volume = volume.value/100;
  utter.voice = voices[voiceSelect];
  speechSynthesis.speak(utter);
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
