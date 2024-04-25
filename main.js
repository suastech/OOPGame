let level = 1;
let sound = false;

previous(level, sound);

function previous(level, sound) {
  document.getElementById("game").style.display = "none";
  document.getElementById("intro").style.display = "block";
  document.getElementById("pre-level").innerText = `Level ${level}`;

  for (let i = 1; i <= 3; i++) {
    document.getElementById(`heart${i}`).style.opacity = "1";
  }

  let counter = 4;
  let idInterval = setInterval(() => {
    document.getElementById("countdown").innerText = counter;
    counter--;
  }, 950);

  setTimeout(() => {
    clearInterval(idInterval);
    document.getElementById("intro").style.display = "none";
    document.getElementById("game").style.display = "flex";
    startGame(level, sound);
  }, 5000);
}

function startGame(level, sound) {
  const boardWidth = 1200;
  const boardHeight = 500;
  const cannonWidth = 50;
  let pause = false;
  let time = 90;
  let hearts = 3;
  let bulletType = "misil";
  const ratioPlayerToPlatformSpeed = 3;
  const ratioPlayerToObstacleSpeed = 2;
  const ratioPlayerToBulletSpeed = 2;
  const referenceSpeed = 10;
  const coinsNeeded = 1;
  const numberOfPlatforms = level;
  const pauseBetweenShots = 1;
  let coinsCollected = 0;
  const obstacleImages = ["cow", "bomb", "bomb2", "yunque", "piano", "jabba"];

  document.getElementById("sound-icon").src = sound? "./images/sound.png": "./images/soundoff.png";
  document.getElementById("weapon-using").src = `./images/${bulletType}.png`;
  document.getElementById("count-coins").textContent = `Coins: ${coinsCollected} / ${coinsNeeded}`;
  document.getElementById("count-time").textContent = `Time ${time}`;
  document.getElementById("level").textContent = `Level ${level}`;

  const cannonLines = document.querySelectorAll(".cannonLine");
  cannonLines.forEach((cannon) => {
    cannon.style.width = cannonWidth + "px";
  });

  class Player {
    constructor() {
      this.speed = referenceSpeed / 1;
      this.width = 30;
      this.height = 60;
      this.x = 200;
      this.y = 430;
      this.direction = "right";
      this.isOnPlatform = false;
      this.isJumping = false;
      this.isSquating = false;
      this.lookingUp = false;
      this.isVulnerable = true;
      this.allowedToShot = true;
      this.playerElm = document.createElement("img");
      this.createPlayer();
    }
    createPlayer() {
      this.playerElm.style.left = this.x + "px";
      this.playerElm.style.bottom = this.y + "px";
      this.playerElm.style.width = this.width + "px";
      this.playerElm.style.height = this.height + "px";
      this.playerElm.src = "./images/mario2.png";
      this.playerElm.id = "player";
      document.getElementById("board").appendChild(this.playerElm);
    }
    moveLeft() {
      this.x -= this.speed;
      this.playerElm.style.left = this.x + "px";
      this.direction = "left";
      playerHtml.style.transform = "scaleX(-1)";
    }
    moveRight() {
      this.x += this.speed;
      this.playerElm.style.left = this.x + "px";
      this.direction = "right";
      playerHtml.style.transform = "";
    }
    moveUp() {
      this.y += this.speed;
      this.playerElm.style.bottom = this.y + "px";
    }
    moveDown() {
      if (player.y + player.height > 0) {
        this.y -= this.speed;
        this.playerElm.style.bottom = this.y + "px";
      }
    }

    jump(keysPressed) {
      if (this.isJumping === true) {
        return;
      }
      if (evaluateIfPlayerIsOnPlatform(platformArray) === "") {
        return; // Jump is allowed only if the player is on a platform
      }

      this.isJumping = true;
      let jumpAltitude = 20;
      let lateralMovement = 10;
      let jumpDuration = 50;
      let counter = 0;
      let goingDown = false;
      let jumpInterval = setInterval(() => {
        if (pause) {
          return;
        }
        if (counter < 10 && goingDown === false) {
          this.y += jumpAltitude;
          //Check left and right
          if (keysPressed.ArrowLeft === true) {
            this.x -= lateralMovement;
          }
          if (keysPressed.ArrowRight === true) {
            this.x += lateralMovement;
          }
          this.playerElm.style.bottom = this.y + "px";
          this.playerElm.style.left = this.x + "px";
          counter++;
        }

        if (counter === 10) {
          goingDown = true;
          counter--;
        }

        if (counter >= 0 && goingDown === true) {
          if (evaluateIfPlayerIsOnPlatform(platformArray) !== "") {
            //It cancels the jump if it already reached a platform
            this.isJumping = false;
            clearInterval(jumpInterval);
            return;
          } else {
            this.y -= jumpAltitude;
            //Check left and right
            if (keysPressed.ArrowLeft === true) {
              this.x -= lateralMovement;
            }
            if (keysPressed.ArrowRight === true) {
              this.x += lateralMovement;
            }

            this.playerElm.style.bottom = this.y + "px";
            this.playerElm.style.left = this.x + "px";

            counter--;

            if (counter === -1) {
              this.isJumping = false;
              clearInterval(jumpInterval);
            }
          }
        }
      }, jumpDuration);
    } //End of method jump
  } //End of Class

  class Platform {
    static idCounter = 0;
    static upperLimit = 400;
    static bottomLimit = 30;
    static platformHeight = 10;
    static platformToCreate = 1;
    static platformWidth = [1000, 400, 250, 200, 100];

    constructor() {
      this.width = Platform.platformWidth[numberOfPlatforms - 1];
      this.height = Platform.platformHeight;
      this.x =
        numberOfPlatforms === 1
          ? boardWidth / 2 - this.width / 2
          : Platform.findXPosition(Platform.platformToCreate);
      this.y =
        Math.floor(
          Math.random() * (Platform.upperLimit - Platform.bottomLimit + 1)
        ) + Platform.bottomLimit;
      this.speed = referenceSpeed / ratioPlayerToPlatformSpeed;
      this.direction = Math.random() < 0.5 ? "up" : "down";
      this.id = `platform_${Platform.idCounter++}`;
      this.PlatformElm = document.createElement("img");
      this.createDomElement();
    }

    static findXPosition(platformToCreate) {
      const availableSpace = boardWidth - cannonWidth - cannonWidth;
      const totalPlatformsWidth =
        numberOfPlatforms * Platform.platformWidth[numberOfPlatforms - 1];
      const spaceBetweenPlatforms =
        (availableSpace - totalPlatformsWidth) / (numberOfPlatforms + 1);
      const result =
        cannonWidth +
        spaceBetweenPlatforms +
        (platformToCreate - 1) *
          (Platform.platformWidth[numberOfPlatforms - 1] +
            spaceBetweenPlatforms);
      Platform.platformToCreate++;
      return result;
    }

    createDomElement() {
      this.PlatformElm.className = "platform";
      this.PlatformElm.id = this.id;
      this.PlatformElm.setAttribute("src", "./images/platform.jpg");
      this.PlatformElm.style.left = this.x + "px";
      this.PlatformElm.style.bottom = this.y + "px";
      this.PlatformElm.style.width = this.width + "px";
      this.PlatformElm.style.height = this.height + "px";
      const parentElm = document.getElementById("board");
      parentElm.appendChild(this.PlatformElm);
    }

    movePlatform(isPlayerOnPlatform) {
      if (this.y > Platform.upperLimit) {
        this.direction = "down";
      } else if (this.y < Platform.bottomLimit) {
        this.direction = "up";
      }

      if (this.direction === "up") {
        this.y += this.speed;
        this.PlatformElm.style.bottom = this.y + "px";

        if (isPlayerOnPlatform) {
          player.y = this.y + this.height;
          player.playerElm.style.bottom = player.y + "px";
        }
      }
      if (this.direction === "down") {
        this.y -= this.speed;
        this.PlatformElm.style.bottom = this.y + "px";

        if (isPlayerOnPlatform) {
          player.y = this.y + this.height;
          player.playerElm.style.bottom = player.y + "px";
        }
      }
    } //End of method movePlatform
  } //End of Class

  class Obstacle {
    static idCounter = 0; // stati counter to generate unique id's
    static width = 60;
    static height = 60;
    constructor() {
      this.width = Obstacle.width;
      this.height = Obstacle.height;
      this.x =
        Math.floor(
          Math.random() * (boardWidth - cannonWidth - this.width - cannonWidth)
        ) + cannonWidth;
      this.y = 500;
      this.speed = referenceSpeed / ratioPlayerToObstacleSpeed;
      this.id = `obstacle_${Obstacle.idCounter++}`;
      this.obstacleElm = document.createElement("img");
      this.createDomElement();
    }
    createDomElement() {
      //Adding properties to the element stored in obstacleElm
      this.obstacleElm.className = "obstacle";
      this.obstacleElm.id = this.id;
      this.obstacleElm.src = `./images/${
        obstacleImages[Math.floor(Math.random() * obstacleImages.length)]
      }.png`;
      this.obstacleElm.style.left = this.x + "px";
      this.obstacleElm.style.bottom = this.y + "px";
      this.obstacleElm.style.width = this.width + "px";
      this.obstacleElm.style.height = this.height + "px";
      const parentElm = document.getElementById("board");
      parentElm.appendChild(this.obstacleElm);
    }
    moveObstacle() {
      this.y -= this.speed;
      this.obstacleElm.style.bottom = this.y + "px";
    }
  }

  class Bullet {
    static idCounter = 0; // static counter to generate unique id's
    static longSide = 40;
    static shortSide = 30;

    constructor() {
      this.type = bulletType;
      this.direction = player.lookingUp ? "up" : player.direction;
      if (this.type === "misil") {
        this.width =
          this.direction === "up" ? Bullet.shortSide : Bullet.longSide;
        this.height =
          this.direction === "up" ? Bullet.longSide : Bullet.shortSide;
        this.src =
          this.direction === "up"
            ? "./images/misil.png"
            : this.direction === "left"
            ? "./images/misilL.png"
            : "./images/misilR.png";
      } else if (this.type === "hadouken") {
        this.width = 70;
        this.height = 70;
        this.src =
          this.direction === "up"
            ? "./images/hadoukenUp.png"
            : this.direction === "left"
            ? "./images/hadoukenLeft.png"
            : "./images/Hadouken.png";
      }
      this.x =
        this.direction === "up"
          ? player.x + Math.floor(player.width / 2) - this.width / 2
          : this.direction === "right"
          ? player.x + player.width
          : player.x;
      this.y =
        this.direction === "up"
          ? player.y + player.height
          : player.y + Math.floor(player.height / 2);
      this.speed = referenceSpeed / ratioPlayerToBulletSpeed;
      this.id = `bullet_${Bullet.idCounter++}`;
      this.bulletElm = document.createElement("img");
      this.createDomElement();
    }

    createDomElement() {
      this.bulletElm.className = "bullet";
      this.bulletElm.id = this.id;
      this.bulletElm.src = this.src;
      this.bulletElm.style.left = this.x + "px";
      this.bulletElm.style.bottom = this.y + "px";
      this.bulletElm.style.width = this.width + "px";
      this.bulletElm.style.height = this.height + "px";
      const parentElm = document.getElementById("board");
      parentElm.appendChild(this.bulletElm);
    }

    moveBullet() {
      if (this.direction === "up") {
        this.y += this.speed;
        this.bulletElm.style.bottom = this.y + "px";
      } else {
        this.x =
          this.direction === "left" ? this.x - this.speed : this.x + this.speed;
        this.bulletElm.style.left = this.x + "px";
      }
    }
  }

  class Cannons {
    static width = 50;
    static upperLimit = 400;
    static bottomLimit = 30;
    static speed = referenceSpeed / 1;
    constructor(position) {
      this.position = position;
      this.id = `cannon-${position}`;
      this.x = position === "left" ? 0 : boardWidth - cannonWidth;
      this.y =
        Math.floor(
          Math.random() * (Cannons.upperLimit - Cannons.bottomLimit + 1)
        ) + Cannons.bottomLimit;
      this.width = Cannons.width;
      this.height = 80;
      this.direction = "up";
      this.cannonElm = document.createElement("img");
      this.createDomElement();
    }
    createDomElement() {
      this.cannonElm.className = "cannon";
      this.cannonElm.id = this.id;
      this.cannonElm.setAttribute("src", "./images/cannon.png");
      this.cannonElm.style.left = this.x + "px";
      this.cannonElm.style.bottom = this.y + "px";
      this.cannonElm.style.width = this.width + "px";
      this.cannonElm.style.height = this.height + "px";
      this.cannonElm.style.transform =
        this.position === "left" ? "" : "scaleX(-1)";
      const parentElm = document.getElementById("board");
      parentElm.appendChild(this.cannonElm);
    }
    moveCannon() {
      if (this.y > Cannons.upperLimit) {
        this.direction = "down";
      } else if (this.y < Cannons.bottomLimit) {
        this.direction = "up";
      }
      this.direction === "up"
        ? (this.y += Cannons.speed)
        : (this.y -= Cannons.speed);

      this.cannonElm.style.bottom = this.y + "px";
    }
  }

  class CannonBall {
    static idCounter = 0;
    static speed = referenceSpeed / 1;
    constructor(posX, posY, direction) {
      this.width = 40;
      this.height = 30;
      this.x = direction === "left" ? posX : cannonWidth;
      this.y = posY + 20;
      this.id = `cannonBall_${CannonBall.idCounter++}`;
      this.direction = direction;
      this.cannonBallElement = document.createElement("img");
      this.generateBallDom();
    }
    generateBallDom() {
      this.cannonBallElement.className = "cannon-ball";
      this.cannonBallElement.id = this.id;
      this.cannonBallElement.src = "./images/bullet.png";
      this.cannonBallElement.style.left = this.x + "px";
      this.cannonBallElement.style.bottom = this.y + "px";
      this.cannonBallElement.style.width = this.width + "px";
      this.cannonBallElement.style.height = this.height + "px";
      this.cannonBallElement.style.transform =
        this.direction === "left" ? "scaleX(-1)" : "";
      const parentElm = document.getElementById("board");
      parentElm.appendChild(this.cannonBallElement);
    }
    moveObstacle() {
      this.direction === "left"
        ? (this.x -= CannonBall.speed)
        : (this.x += CannonBall.speed);
      this.cannonBallElement.style.left = this.x + "px";
    }
  }

  class Item {
    static options = ["hadouken", "heart", "clock"];
    static idCounter = 0;
    constructor() {
      this.life = 0;
      this.height = 50;
      this.width = 50;
      this.x = Math.floor(
        cannonWidth + 50 + Math.random() * (boardWidth - cannonWidth * 2 - 100)
      );
      this.y = Math.floor(30 + Math.random() * (500 - 80));
      this.type = Item.options[Math.floor(Math.random() * Item.options.length)];
      this.id = `item_${Item.idCounter++}`;
      this.itemElement = document.createElement("img");
      this.createElementDom();
    }
    createElementDom() {
      this.itemElement.src = `./images/${this.type}.png`;
      this.itemElement.classList.add("item");
      this.itemElement.style.position = "absolute";
      this.itemElement.style.width = this.width + "px";
      this.itemElement.style.height = this.height + "px";
      this.itemElement.style.left = this.x + "px";
      this.itemElement.style.bottom = this.y + "px";
      this.itemElement.id = this.id;
      document.getElementById("board").appendChild(this.itemElement);
    }
  }

  const player = new Player();
  const playerHtml = document.getElementById("player");

  //Create cannonLines
  let lineL = document.createElement("div");
  let lineR = document.createElement("div");
  lineL.id = "cannonLineLeft";
  lineL.classList.add("cannonLine");
  lineR.classList.add("cannonLine");
  lineR.id = "cannonLineRight";
  document.getElementById("board").appendChild(lineL);
  document.getElementById("board").appendChild(lineR);

  const cannonLeft = new Cannons("left");
  const cannonRight = new Cannons("right");
  let obstaclesArray = [];
  let bulletsArray = [];
  const platformArray = platformFactory(numberOfPlatforms);

  //Create Items
  let itemsArray = [];
  const itemInterval = setInterval(() => {
    if (pause) {
      return;
    }

    let newItem = new Item();
    itemsArray.push(newItem);

    for (let index = 0; index < itemsArray.length; index++) {
      itemsArray[index].life++;
      if (itemsArray[index].life === 5) {
        const elementToRemove = document.getElementById(itemsArray[index].id);
        elementToRemove.parentNode.removeChild(elementToRemove);
        itemsArray.splice(index, 1);
      }
    }

  }, 10000);

  //Create Platforms
  function platformFactory(number) {
    let platforms = [];
    for (let index = 0; index < number; index++) {
      platforms.push(new Platform());
    }

    return platforms;
  }

  // Create Ext Portal
  let exitPortal;
  function createExit() {
    let width = 60;
    let height = 90;
    let board = document.getElementById("board");
    exitPortal = document.createElement("div");
    exitPortal.id = "exit-portal";
    exitPortal.style.position = "absolute";
    exitPortal.style.background = "black";
    exitPortal.style.display = "none";
    exitPortal.style.opacity = "0.7";
    exitPortal.style.width = width + "px";
    exitPortal.style.height = height + "px";
    exitPortal.style.left = Math.floor(cannonWidth + 50 + Math.random() * (boardWidth - cannonWidth * 2 - 100) ) + "px";
    exitPortal.style.bottom = Math.floor(50 + Math.random() * (400 - height)) + "px";
    board.appendChild(exitPortal);
  }
  createExit();
  const portal = {
    x: Number(document.getElementById("exit-portal").style.left.slice(0, -2)),
    y: Number(document.getElementById("exit-portal").style.bottom.slice(0, -2)),
    width: Number(
      document.getElementById("exit-portal").style.width.slice(0, -2)
    ),
    height: Number(
      document.getElementById("exit-portal").style.height.slice(0, -2)
    ),
  };

  //Create new coin
  let newCoin;
  function createCoin() {
    const parentElement = document.getElementById("board");
    newCoin = document.createElement("img");
    newCoin.id = "coin";
    newCoin.setAttribute("src", "./images/coin.png");
    newCoin.style.left =
      Math.floor(
        cannonWidth + 50 + Math.random() * (boardWidth - cannonWidth * 2 - 100)
      ) + "px";
    newCoin.style.bottom = Math.floor(30 + Math.random() * (500 - 80)) + "px";
    newCoin.style.width = 30 + "px";
    newCoin.style.height = 40 + "px";
    parentElement.appendChild(newCoin);
  }
  createCoin();

  //Create obstacles
  const obstInterval = setInterval(() => {
    if (pause) {
      return;
    }

    const selectCannon = Math.random() < 0.5 ? true : false;
    const posX = selectCannon ? cannonLeft.x : cannonRight.x;
    const posY = selectCannon ? cannonLeft.y : cannonRight.y;
    const direction = selectCannon ? "right" : "left";
    const newCannonBall = new CannonBall(posX, posY, direction);
    const newObstacle = new Obstacle();
    obstaclesArray.push(newObstacle, newCannonBall);
    
  }, 2000);

  function createBullet() {
    const newBullet = new Bullet();
    bulletsArray.push(newBullet);
  }

  // Limit shots
  function limitShots() {
    player.allowedToShot = false;
    setTimeout(function () {
      player.allowedToShot = true;
    }, pauseBetweenShots * 500);
  }

  function evaluateIfPlayerIsOnPlatform(platformArray) {
    for (let i = 0; i < platformArray.length; i++) {
      const platform = platformArray[i];
      if (
        player.y >= platform.y + platform.height &&
        player.y - (platform.y + platform.height) <=
          ratioPlayerToPlatformSpeed + referenceSpeed + 4 &&
        player.x + player.width >= platform.x &&
        player.x <= platform.x + platform.width
      ) {
        return platform.id;
      }
    }
    return "";
  }

  function checkColissions(element1, element2) {
    return (
      element1.x < element2.x + element2.width &&
      element1.x + element1.width > element2.x &&
      element1.y < element2.y + element2.height &&
      element1.y + element1.height > element2.y
    );
  }

  function checkPlayerInPortal(player, portal) {
    return (
      player.x >= portal.x &&
      player.y >= portal.y &&
      player.x + player.width <= portal.x + portal.width &&
      player.y + player.height <= portal.y + portal.height
    );
  }

  function makeExplosions(places) {
    places.forEach((par) => {
      const newExp = document.createElement("img");
      newExp.className = "explosion";
      newExp.src = "./images/boom.png";
      newExp.style.left = par[0] - 30 + "px";
      newExp.style.bottom = par[1] - 30 + "px";
      newExp.style.width = 100 + "px";
      newExp.style.height = 100 + "px";
      const parent = document.getElementById("board");
      parent.appendChild(newExp);
    });

    // Esperar 0.3 segundos antes de eliminar los elementos
    setTimeout(() => {
      const explosions = document.querySelectorAll(".explosion");
      explosions.forEach((explosion) => {
        explosion.parentNode.removeChild(explosion);
      });
    }, 300);
  }

  function playerHit(positionX, positionY) {
    makeExplosions([[positionX, positionY]]);
    if (hearts === 0) {
      gameOver();
    } else {
      document.getElementById("homer").play();
      document.getElementById(`heart${hearts}`).style.opacity = "0.5";
      activateInvulnerability();
      hearts--;
    }
  }

  function activateInvulnerability() {
    player.isVulnerable = false;
    player.playerElm.classList.add("player-flash");
    setTimeout(function () {
      player.isVulnerable = true;
      player.playerElm.style.opacity = "1";
      player.playerElm.classList.remove("player-flash");
    }, 1000);
  }

  function gameOver(win) {
    clearInterval(obstInterval);
    clearInterval(itemInterval);
    clearInterval(generalMovementControl);
    clearInterval(timeInterval);

    if (win) {
      document.getElementById("cleared").play();

      if (level < 5) {
        level++;
        setTimeout(() => {
          document.getElementById("board").innerHTML = "";
          previous(level, sound);
        }, 4000);
      } else {
        window.location.href = "./gameOver.html";
      }
    } else {
      player.playerElm.src = "./images/mario3.png";
      document.getElementById("dies").play();
  
      setTimeout(() => {
        document.getElementById("board").innerHTML = "";
        previous(level, sound);
      }, 4000);
    }
  }

  function hadoukenOn() {
    bulletType = "hadouken";
    document.getElementById("weapon-using").src = `./images/${bulletType}.png`;
    setTimeout(() => {
      bulletType = "misil";
      document.getElementById(
        "weapon-using"
      ).src = `./images/${bulletType}.png`;
    }, 20000);
  }

  function handleSound() {
    sound = !sound;
    document.getElementById("sound-icon").src = sound ? "./images/sound.png" : "./images/soundoff.png";
    const soundElements = document.querySelectorAll(".sound-class");
    soundElements.forEach(function(element) {
      if (sound) {
          element.muted = false;
      } else {
          element.muted = true;
      }
    });

  }

  //Count Time
  const timeInterval = setInterval(() => {
    if (pause) {
      return;
    }
    time--;
    document.getElementById("count-time").textContent = `Time: ${time}`;
    if (time === 0) {
      gameOver();
    }
  }, 1000);

  const generalMovementControl = setInterval(() => {
    if (pause) {
      return;
    }

    //Check fall:
    if (player.y + player.height <= 0) {
      gameOver();
    }

    //Check if it is inside of the Exit Door: then, Game Over
    if (coinsNeeded === coinsCollected && checkPlayerInPortal(player, portal)) {
      gameOver(true);
    }

    //Move cannons
    cannonLeft.moveCannon();
    cannonRight.moveCannon();

    //Collect items
    for (let item of itemsArray) {
      if (checkColissions(player, item)) {
        if (item.type === "heart" && hearts < 3) {
          hearts++;
          for (let i = 0; i < hearts; i++) {
            document.getElementById("powerup").play();
            document.getElementById(`heart${i + 1}`).style.opacity = "1";
          }
        } else if (item.type === "hadouken") {
          document.getElementById("hadouken").play();
          hadoukenOn();
        } else if (item.type === "clock") {
          document.getElementById("powerup").play();
          time += 20;
        }
        let index = itemsArray.findIndex(
          (itemOfArray) => itemOfArray.id === item.id
        );
        if (index !== -1) {
          const elementToRemove = document.getElementById(item.id);
          elementToRemove.parentNode.removeChild(elementToRemove);
          itemsArray.splice(index, 1);
        }
      }
    }
    //Move obstacles and Check collisions. If there is one, call GameOver
    let obstaclesToDestroy = [];
    let bulletsToDestroy = [];
    let placesOfExplosions = [];

    obstaclesArray.forEach((elementObstacle) => {
      elementObstacle.moveObstacle();

      if (player.isVulnerable && checkColissions(player, elementObstacle)) {
        obstaclesToDestroy.push(elementObstacle.id);
        playerHit(elementObstacle.x, elementObstacle.y);
      }

      if (
        elementObstacle.y === 0 ||
        elementObstacle.x > boardWidth - cannonWidth ||
        elementObstacle.x < cannonWidth
      ) {
        obstaclesToDestroy.push(elementObstacle.id);
      }

      //Check each obstacle vs each Bullet:
      bulletsArray.forEach((elementBullet) => {
        elementBullet.moveBullet();
        if (checkColissions(elementBullet, elementObstacle)) {
          placesOfExplosions.push([elementObstacle.x, elementObstacle.y]);
          bulletsToDestroy.push(elementBullet.id);
          obstaclesToDestroy.push(elementObstacle.id);
        } else if (
          (elementBullet.direction === "left" && elementBullet.x < 50) ||
          (elementBullet.direction === "right" &&
            elementBullet.x > boardWidth - 50) ||
          (elementBullet.direction === "up" &&
            elementBullet.y > boardHeight - 50)
        ) {
          bulletsToDestroy.push(elementBullet.id);
        }
      });

      obstaclesToDestroy = [...new Set(obstaclesToDestroy)];
      bulletsToDestroy = [...new Set(bulletsToDestroy)];

      obstaclesToDestroy.forEach((element) => {
        const elementToRemove = document.getElementById(element);
        if (elementToRemove) {
        elementToRemove.parentNode.removeChild(elementToRemove);
        }
      });

      bulletsToDestroy.forEach((element) => {
        const elementToRemove = document.getElementById(element);
        if (elementToRemove) {
        elementToRemove.parentNode.removeChild(elementToRemove);
        }
      });

      obstaclesArray = obstaclesArray.filter(
        (element) => !obstaclesToDestroy.includes(element.id)
      );
      bulletsArray = bulletsArray.filter(
        (element) => !bulletsToDestroy.includes(element.id)
      );

      if (placesOfExplosions.length > 0) {
        makeExplosions(placesOfExplosions);
      }
    });

    //Check if coin was collected
    let coinObject = {
      x: Number(newCoin.style.left.slice(0, -2)),
      y: Number(newCoin.style.bottom.slice(0, -2)),
      width: Number(newCoin.style.width.slice(0, -2)),
      height: Number(newCoin.style.height.slice(0, -2)),
    };

    if (coinsCollected < coinsNeeded && checkColissions(player, coinObject)) {
      coinsCollected++;
      document.getElementById("coin-sound").play();
      document.getElementById(
        "count-coins"
      ).textContent = `Coins: ${coinsCollected} / ${coinsNeeded}`;

      if (coinsCollected === coinsNeeded) {
        document.getElementById("exit-portal").style.display = "block";
        document.getElementById("coin").style.display = "none";
        document.getElementById("count-coins").style.fontWeight = "600";
      } else {
        let elementToRemove = document.getElementById("coin");
        if (elementToRemove) {
          elementToRemove.parentNode.removeChild(elementToRemove);
          createCoin();
        }
      }
    }

    //Move platforms and Player
    const platformWithPlayer = evaluateIfPlayerIsOnPlatform(platformArray);
    if (platformWithPlayer === "") {
      platformArray.forEach((platform) => {
        platform.movePlatform(false);
      });

      if (!player.isJumping) {
        //Move de player down if it's not jumping
        player.moveDown();
      }
    } else {
      platformArray.forEach((platform) => {
        if (platform.id !== platformWithPlayer) platform.movePlatform(false);
        else {
          platform.movePlatform(true);
        }
      });
    }
  }, 50);

  const pressedKeys = {};

  // detect keydown events / when a key is pressed
  document.addEventListener("keydown", (e) => {
    if (e.code === "KeyZ") {
      pause = !pause
      document.getElementById("pause-sound").play()
      document.querySelector(".pause").classList.toggle("pause-hide")
      return
    }
    if (pause) {
      return
    }
    if (e.code === "Space") {
      player.jump(pressedKeys);
    }
    if (e.code === "ArrowDown") {
      if (!player.isSquating) {
        player.height = player.height / 2;
        playerHtml.style.height = player.height + "px";
        player.isSquating = true;
      }
    }
    if (e.code === "ArrowUp") {
      player.lookingUp = true;
      playerHtml.src = "./images/marioLookingUp.png";
    }
    if (e.code === "KeyX") {
      if (player.allowedToShot) {
        createBullet();
        limitShots();
      }
    }
    pressedKeys[e.code] = true;
    updatePlayerPosition();
  });

  // detect keyup events / when a key is released
  document.addEventListener("keyup", (e) => {
    if (pause) {
      return
    }
    if (e.code === "ArrowDown") {
      player.height = player.height * 2;
      playerHtml.style.height = player.height + "px";
      player.isSquating = false;
    }

    if (e.code === "ArrowUp") {
      player.lookingUp = false;
      playerHtml.src = "./images/mario2.png";
    }

    pressedKeys[e.code] = false;
    updatePlayerPosition();
  });

  function updatePlayerPosition() {
    if (pressedKeys.ArrowLeft === true) {
      player.moveLeft();
    }

    if (pressedKeys.ArrowRight === true) {
      player.moveRight();
    }
  }

  document.getElementById("sound-icon").addEventListener("click", () => {
    handleSound()
  });
}
