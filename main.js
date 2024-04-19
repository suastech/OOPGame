class Player {
    constructor() {
        this.x = 40;
        this.y = 40;
        this.width = 5;
        this.height = 20;
        this.playerElm = document.getElementById("player");
        this.playerElm.style.left = this.x + "vw"
        this.playerElm.style.bottom = this.y + "vh"
        this.playerElm.style.width = this.width + "vw"
        this.playerElm.style.height = this.height + "vh"
    }
    moveLeft() {
     this.x -= 1
     this.playerElm.style.left = this.x + "vw"
    }
    moveRigth() {
        this.x += 1
        this.playerElm.style.left = this.x + "vw"
    }
    moveUp() {
        this.y += 1
        this.playerElm.style.bottom = this.y + "vh"
    }
    moveDown() {
        this.y -= 1
        this.playerElm.style.bottom = this.y + "vh"
    }
    jump() {
        /*
        The method jump increments to the property this.y until counter reaches 10.
        When counter === ten, then I change the value of goingDown to true. 
        Once the value of goingDown is set to false, it will stop incrementing, and will execute the third "if" block,
        substracting the value of counter. When counter reaches -1, the clearInterval is activated. 
        */
    
        let jumpAltitude = 3;
        let jumpDuration = 15;
        let counter = 0;
        let goingDown = false;
        let intervalId = setInterval( () => {
    
        if (counter < 10 && goingDown === false) {
        this.y = this.y + jumpAltitude;
        this.playerElm.style.bottom = this.y + 'vh';
        counter ++
        }
    
        if (counter === 10) {
          goingDown = true
          counter--
        }
    
        if (counter >= 0 && goingDown === true) {
          this.y = this.y - jumpAltitude;
          this.playerElm.style.bottom = this.y + 'vh';
          counter --
        }
           
        if (counter === -1) {
         clearInterval(intervalId)
          }
    
        }, jumpDuration)
    }
}


/* class Obstacle {
    constructor() {
    this.x = 40;
    this.y = 100;
    this.width = 5;
    this.height = 20;
    }


} */

const player = new Player();

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp') {
      player.moveUp();
    } else if (e.code === 'ArrowDown') {
      player.moveDown();
    } else if (e.code === 'ArrowLeft') {
      player.moveLeft();
    } else if (e.code === 'ArrowRight') {
      player.moveRigth();
    } else if (e.code === 'Space') {
      player.jump()
    }
  });