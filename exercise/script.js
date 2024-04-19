const playerElm = document.getElementById('player');

let positionX = 0; // 
let positionY = 0; // 


function jump() {
    let jumpAltitude = 3;
    let jumpDuration = 40;

    let counter = 0;
    let down = false;
    let intervalId = setInterval( () => {

    if (counter < 10 && down === false) {
    positionY = positionY + jumpAltitude;
    playerElm.style.bottom = positionY + 'vh';
    counter ++
    }

    if (counter === 10) {
      down = true
      counter--
    }

    if (counter >= 0 && down === true) {
      positionY = positionY - jumpAltitude;
      playerElm.style.bottom = positionY + 'vh';
      counter --
    }
       
    if (counter === -1) {
     clearInterval(intervalId)
      }

    }, jumpDuration)
}

     
document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowUp') {
    positionY = positionY + 1;
    playerElm.style.bottom = positionY + 'vh';
  } else if (e.code === 'ArrowDown') {
    positionY = positionY - 1;
    playerElm.style.bottom = positionY + 'vh';
  } else if (e.code === 'ArrowLeft') {
    positionX = positionX - 1;
    playerElm.style.left = positionX + 'vw';
  } else if (e.code === 'ArrowRight') {
    positionX = positionX + 1;
    playerElm.style.left = positionX + 'vw';
  } else if (e.code === 'Space') {
    jump()}
});
