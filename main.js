class Player {
    constructor(name, ) {
        this.name = name;
        this.x = 0;
        this.y = 0;
        this.width = 20;
        this.heigth = 20;
    }
    moveLeft() {
        this.x -= 1
    }
    moveRigth() {
        this.x += 1
    }
    moveUp() {
        this.y -= 1
    }
    moveDown() {
        this.y += 1
    }
}