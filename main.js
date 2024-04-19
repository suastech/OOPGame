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
        let jumpAltitude = 5;
        let jumpDuration = 20;
        let counter = 0;
        let down = false;
        let intervalId = setInterval( () => {
    
        if (counter < 10 && down === false) {
        this.y = this.y + jumpAltitude;
        this.playerElm.style.bottom = this.y + 'vh';
        counter ++
        }
    
        if (counter === 10) {
          down = true
          counter--
        }
    
        if (counter >= 0 && down === true) {
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

const player = new Player();
player.moveUp();

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