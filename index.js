window.onload = function (){
    const grid = new Grid('lightgreen', 30, 30, 30);
    document.addEventListener("keydown", grid.changeDirection);
    grid.createFood();
    function main() {
        setTimeout(
            function onTick() {
                grid.clearCanvas();
                grid.drawFood();
                grid.advanceSnake();
                grid.drawSnake();
                grid.remainingtime -= 100;
                document.getElementById('time').innerHTML =
                    `Temp restant : ${Math.ceil(grid.remainingtime / 1000)} s`
                if (grid.remainingtime <= 0) {
                    grid.createFood();

                }
                if (grid.dead) {
                    console.log ("toto")
                    return;
                }
                main();
            }, 100)
    };

    main();
}

class Grid {

    color;
    gridX;
    gridY;
    cell;
    snake2;
    head;
    dx;
    dy;
    foodX;
    foodY;
    foodpoint;
    score;
    remainingtime;
    dead;

    constructor(color, gridY, gridX, cell) {


        this.score = 0;
        this.gridX = gridX;
        this.gridY = gridY;
        this.color = color;
        this.cell = cell;
        this.dx = 20;
        this.dy = 0;
        this.snake2 = [{ x: 140, y: 140 }, { x: 120, y: 140 }, { x: 100, y: 120 }, { x: 80, y: 100 }];


        const canvas = document.getElementById('canvas');
        canvas.style.margin = "0 auto"
        canvas.style.display = "block"
        canvas.style.border = "30px solid #E1A546"
        let ctx = canvas.getContext('2d');
    }

    checkColisions() {
        for (let i = 1; i < this.snake2.length; i++) {
            let colision = this.snake2[0].x == this.snake2[i].x &&
                this.snake2[0].y == this.snake2[i].y;
                if (colision){
                    this.die (); 
                    break;
                    
                }
        }
    }

    clearCanvas() {
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = "white"; ctx.strokeStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    randomTen(min, max) {
        return Math.floor((Math.random() * (max - min) + min) / 20) * 20;
    }

    randompoint(min, max) {
        return Math.floor((Math.random() * (max - min) + min));

    }
    createFood() {
        this.foodX = this.randomTen(0, canvas.width - 20);
        this.foodY = this.randomTen(0, canvas.height - 20);
        this.foodpoint = this.randompoint(1, 4);
        this.remainingtime = 5000;

        this.snake2.forEach((part) => {
            const foodIsOnSnake = part.x == this.foodX && part.y == this.foodY;
            if (foodIsOnSnake) {
                this.createFood();
            }
        });
    }
    drawFood() {
        let ctx = canvas.getContext('2d');
        switch (this.foodpoint) {
            case 1:
                ctx.fillStyle = 'red';
                break;
            case 2:
                ctx.fillStyle = 'green';
                break;
            case 3:
                ctx.fillStyle = 'blue';
                break;
        }
        ctx.strokestyle = 'darkred';
        ctx.beginPath();
        ctx.arc(this.foodX + 10, this.foodY + 10, 10, 0, Math.PI * 2, true);
        ctx.fill();

    }



    drawSnakePart(snakePart) {

        let ctx = canvas.getContext('2d');
        ctx.fillStyle = '#504FB9';
        ctx.strokestyle = 'darkgreen';
        ctx.fillRect(snakePart.x, snakePart.y, 20, 20);
        ctx.strokeRect(snakePart.x, snakePart.y, 20, 20);
    }
    advanceSnake() {
        this.head = {
            x: (this.snake2[0].x + this.dx + canvas.width) % canvas.width,
            y: (this.snake2[0].y + this.dy + canvas.height) % canvas.height,
        };
        this.snake2.unshift(this.head);
        const didEatFood = this.snake2[0].x === this.foodX && this.snake2[0].y === this.foodY;
        if (didEatFood) {
            this.score += this.foodpoint;
            document.getElementById('score').innerHTML =
                `Score : ${this.score}`;
            this.createFood();
        }
        else {
            this.checkColisions();
            this.snake2.pop();

        }
    };
    changeDirection = (event) => {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;
        const keyPressed = event.keyCode;
        const goingUp = this.dy === -20;
        const goingDown = this.dy === 20;
        const goingRight = this.dx === 20;
        const goingLeft = this.dx === -20;
        if (keyPressed === LEFT_KEY && !goingRight) {
            this.dx = -20;
            this.dy = 0;
        }
        if (keyPressed === UP_KEY && !goingDown) {
            this.dx = 0;
            this.dy = -20;
        }
        if (keyPressed === RIGHT_KEY && !goingLeft) {
            this.dx = 20;
            this.dy = 0;
        }
        if (keyPressed === DOWN_KEY && !goingUp) {
            this.dx = 0;
            this.dy = 20;
        }
    }


    drawSnake() {

        this.snake2.forEach(this.drawSnakePart);

    }
    die(){
        document.getElementById('score').innerHTML = "Dommage tu ferras mieux la prochaine fois"
        this.score = 0;
        this.snake2 = [{ x: 140, y: 140 }, { x: 120, y: 140 }, { x: 100, y: 120 }, { x: 80, y: 100 }];
        this.dead = true

    }
}
