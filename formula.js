 /*
         if (
            player.x            < obstacle.x + obstacle.w && //como decir: la coordenada izquierda del objeto debe ser menor a la coordenada derecha del obstáculo
            player.x + player.w > obstacle.x &&
            player.y            < obstacle.y + obstacle.h &&
            player.y + player.h > obstacle.y

        )
        
        */

const player = document.getElementById("player");

let positionX = 0; 
let positionY = 0; 

const pressedKeys = {};

/*
// detect keydown events / when a key is pressed
document.addEventListener("keydown", (e) => {
  pressedKeys[e.code] = true;  
  updatePlayerPosition();
})


// detect keyup events / when a key is released
document.addEventListener("keyup", (e) => {
  pressedKeys[e.code] = false;
  updatePlayerPosition();
})


function updatePlayerPosition(){
  // update the position in our javascript code
  if(pressedKeys.ArrowLeft === true){
      positionX -= 5;
  }
  
  if(pressedKeys.ArrowRight === true){
      positionX += 5;
  } 
  
  if(pressedKeys.ArrowUp === true){
      positionY += 5;
  } 
  
  if(pressedKeys.ArrowDown === true){
      positionY -= 5;
  }
  
  
  // update the UI to reflect that information
  player.style.left = positionX + "px";
  player.style.bottom = positionY + "px";
}

//Jump original
 jump(keysPressed) {
      if (this.isJumping === false)
        {
        this.isJumping = true
        let jumpAltitude = 5;
        let lateralMovement = 1;
        let jumpDuration = 30;
        let counter = 0;
        let goingDown = false;
        let intervalId = setInterval( () => {

          
        if (counter < 10 && goingDown === false) {
          this.y += jumpAltitude;
          //Check left and right  
          if (keysPressed.ArrowLeft === true) {  
            this.x -= lateralMovement }
          if (keysPressed.ArrowRight === true) {
            this.x += lateralMovement
        }

        this.playerElm.style.bottom = this.y + 'vh';
        this.playerElm.style.left = this.x + 'vw';

        counter ++

        }
    
        if (counter === 10) {
          goingDown = true
          counter--
        }
    
        if (counter >= 0 && goingDown === true) {
          this.y -= jumpAltitude;
          //Check left and right  
          if (keysPressed.ArrowLeft === true) {  
            this.x -= lateralMovement }
          if (keysPressed.ArrowRight === true) {
            this.x += lateralMovement
          }
          
          this.playerElm.style.bottom = this.y + 'vh';
          this.playerElm.style.left = this.x + 'vw';

          counter --
        }
           
        if (counter === -1) {
         this.isJumping = false
         clearInterval(intervalId)
        }
    
        }, jumpDuration)
    
    } //End of if evaluation
    
    } //End of method

  
  