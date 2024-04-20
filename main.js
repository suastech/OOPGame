const boardWidth = 1200;
const boardHeight = 500;
const numberOfPlatforms = 1;
const referenceSpeed = 16;

class Player {
    constructor() {
        this.speed = referenceSpeed/1;
        this.x = 130;
        this.y = 200;
        this.width = 30;
        this.height = 60;
        this.isOnPlatform = false;
        this.isJumping = false;
        this.playerElm = document.getElementById("player");
        this.playerElm.style.left = this.x + "px";
        this.playerElm.style.bottom = this.y + "px";
        this.playerElm.style.width = this.width + "px";
        this.playerElm.style.height = this.height + "px";
    }
    moveLeft() {
     this.x -= this.speed
     this.playerElm.style.left = this.x + "px"
    }
    moveRigth() {
        this.x += this.speed
        this.playerElm.style.left = this.x + "px"
    }
    moveUp() {
        this.y += this.speed
        this.playerElm.style.bottom = this.y + "px"
    }
    moveDown() {
        if ( this.y - 6 > 0) {
        this.y -= this.speed
        this.playerElm.style.bottom = this.y + "px"
        }
    }

    jump(keysPressed) {
      if (this.isJumping === true) {
        return
      }
     /*  if (!evaluateIfPlayerIsOnPlatform()) {
        return
      } */
      
      this.isJumping = true
      let jumpAltitude = 20;
      let lateralMovement = 10;
      let jumpDuration = 50;
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
      this.playerElm.style.bottom = this.y + 'px';
      this.playerElm.style.left = this.x + 'px';
      counter ++
      }
    
      if (counter === 10) {
        goingDown = true
        counter--
      }

      platformArray.forEach(platform => {
        if (counter >= 0 && goingDown === true) {

          if (evaluateIfPlayerIsOnPlatform(platform))  {
            this.isJumping = false
            clearInterval(intervalId)  
            return
          } else {
            this.y -= jumpAltitude;
            //Check left and right  
            if (keysPressed.ArrowLeft === true) {  
              this.x -= lateralMovement }
            if (keysPressed.ArrowRight === true) {
              this.x += lateralMovement
            }
            
            this.playerElm.style.bottom = this.y + 'px';
            this.playerElm.style.left = this.x + 'px';

            counter --
            
            if (counter === -1) {
            this.isJumping = false
            clearInterval(intervalId)
            }
        }}
        
      });
      
      
    
      }, jumpDuration)
    
    }  //End of method

  } //End of Class

class Platform {
  static idCounter = 0;
  static upperLimit = 100;
  static bottomLimit= 50;
  static gapBetweenPlatforms = 100
  static xPositionNext= 100;
  constructor() {
    this.width = 200;
    this.height = 20;
    this.x = Platform.xPositionNext;
    this.y = Math.floor(Math.random() * (Platform.upperLimit - Platform.bottomLimit + 1)) + Platform.bottomLimit;
    this.range = 0;
    this.speed = referenceSpeed/4;
    this.direction = Math.random() < 0.5 ? "up" : "down";
    this.id = `platform_${Platform.idCounter++}`;
    this.PlatformElm = document.createElement("div");
    this.createDomElement();
    Platform.xPositionNext += Platform.gapBetweenPlatforms + this.width;
  }
  createDomElement() {
    //Adding properties to the element stored in obstacleElm
    this.PlatformElm.className = "platform";
    this.PlatformElm.id = this.id;
    this.PlatformElm.style.left = this.x + "px";
    this.PlatformElm.style.bottom = this.y + "px";
    this.PlatformElm.style.width = this.width + "px";
    this.PlatformElm.style.height = this.height + "px";
    const parentElm = document.getElementById("board");
    parentElm.appendChild(this.PlatformElm);
  }

  movePlatform(player) {
    if      (this.y > Platform.upperLimit)  { this.direction = "down"}
    else if (this.y < Platform.bottomLimit) { this.direction = "up"}

    if (this.direction === "up") {
      this.y += this.speed
      this.PlatformElm.style.bottom = this.y + "px";
      if (player !== undefined) {
        player.y = this.y + this.height;
        player.playerElm.style.bottom = player.y + "px";
      }
    }
    if (this.direction === "down") {
      this.y -= this.speed
      this.PlatformElm.style.bottom = this.y + "px";
      if (player !== undefined) {
        player.y = this.y + this.height;
        player.playerElm.style.bottom = player.y + "px"
      }
    }

  } //End of method movePlatform

} //End of Class

class Obstacle {
    static idCounter = 0; // contador estático para generar IDs únicos
    constructor() {
        this.width = 10;
        this.height = 10;
        this.x = Math.floor(Math.random() * (100 - this.width)) + 1;
        this.y = 90;
        this.id = `obstacle_${Obstacle.idCounter++}`;
        this.obstacleElm = document.createElement("div");
        this.createDomElement();
    }

    createDomElement() {
        //Adding properties to the element stored in obstacleElm
        this.obstacleElm.className = "obstacle";
        this.obstacleElm.id = this.id;
        this.obstacleElm.style.left = this.x + "px";
        this.obstacleElm.style.bottom = this.y + "px";
        this.obstacleElm.style.width = this.width + "px";
        this.obstacleElm.style.height = this.height + "px";
        const parentElm = document.getElementById("board");
        parentElm.appendChild(this.obstacleElm);

    }
    moveDown () {
        this.y --;
        this.obstacleElm.style.bottom = this.y + "px"
    }
} 

const player = new Player();
const obstaclesArray = []; 
const platformArray = platformFactory(numberOfPlatforms)

function platformFactory(number) {
  let platforms = []
  for (let index = 0; index < number; index++) {
    platforms.push(new Platform())
  }

return platforms
}

/*
const obstInterval = setInterval(() => {
   const newObstacle = new Obstacle();
   obstaclesArray.push(newObstacle);
   console.log(obstaclesArray.length)
} , 3000)
*/

function evaluateIfPlayerIsOnPlatform(platform) {
  return  platform.y + platform.height === player.y &&
          player.x + player.width >= platform.x    &&
          player.x <= platform.x + platform.width 
  }

const intervalId = setInterval(() => {
    //Revisión de colisiones
    /* obstaclesArray.forEach( (element, index) => {
      element.moveDown();
        //Check Colissions
      if (
          player.x                  < element.x + element.width   && 
          player.x + player.width   > element.x                   &&
          player.y                  < element.y + element.height  &&
          player.y + player.height  > element.y
      ) {
        let playerE = document.getElementById("player")
        playerE.src = "./playerEndColor.jpg"
        playerE.style.width= "15px"
        playerE.style.height= "10px"
        clearInterval(intervalId)
        clearInterval(obstInterval)
      } 

      if (element.y === 0) {
        //Quitar del dom
        const elementToRemove = document.getElementById(element.id)
        elementToRemove.parentNode.removeChild(elementToRemove)
        obstaclesArray.splice(index, 1)
      }

    }); */

    // Revisión si el jugador está en plataforma
      for (let platform of platformArray) {      
        if (evaluateIfPlayerIsOnPlatform(platform) ) {
        platform.movePlatform(player)
      } else {
        platform.movePlatform()
        if (!player.isJumping) {
            player.moveDown() }
        }
     }

}, 33)


const pressedKeys = {};

// detect keydown events / when a key is pressed
document.addEventListener("keydown", (e) => {
   if (e.code === "Space" ) {
      player.jump(pressedKeys)
    }

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
     player.moveLeft();
  }
  if(pressedKeys.ArrowRight === true){
      player.moveRigth();
  } 
  
  if(pressedKeys.ArrowUp === true){
      player.moveUp();
  } 
  
  if(pressedKeys.ArrowDown === true){
      player.moveDown();
  }

}
