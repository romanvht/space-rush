class Game {
    constructor() {
        this.initElements();
        this.initGameState();
        
        this.stars = new Stars();
        this.sound = new Sound();
        this.menu = new Menu(this, this.sound);
        this.input = new Input(this, this.stars, this.sound);

        this.render();
    }

    initElements() {
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
    }

    initGameState() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;

        this.positionHistory = [];
        this.fragments = [];
        this.squareColors = ['#50fb78', '#fb5050', '#5078fb'];

        this.trackSize = 300;
        this.innerSquareSize = 160;
        this.sideCoordinates = this.getCoordinates();
        this.squareSize = 30;
        this.squareColor = this.getRandomColor();
        this.speed = 4;
        this.direction = 'up';
        this.reverse = false;
        this.foodSize = 20;
        this.food = this.generateFood();
        this.foodRotation = 0;

        this.position = { 
            x: this.sideCoordinates.left.end - this.sideCoordinates.left.center - (this.squareSize / 2), 
            y: this.centerY - this.squareSize / 2 
        }

        this.trailLength = 6;
        this.trailSize = this.squareSize / 2;
        this.trailInterval = 0.05;
        this.trailTimer = 0;
        this.lastTime = 0;

        this.gameStart = false;
        this.gameOver = false;
        this.score = 0;
    }

    start() {
        if (!this.gameStart) {
            this.gameStart = true;
            this.sound.playAmbient();
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    restart() {
        this.position = { 
            x: this.sideCoordinates.left.end - this.sideCoordinates.left.center - (this.squareSize / 2), 
            y: this.centerY - this.squareSize / 2 
        }

        this.score = 0;
        this.speed = 4;
        this.direction = 'up';
        this.reverse = false;
        this.gameOver = false;
        this.fragments = [];
        this.positionHistory = [];
        this.squareColor = this.getRandomColor();
        this.food = this.generateFood();
        
        this.start();
    }

    gameLoop(currentTime) {
        if (this.gameStart) {
            if (this.lastTime === 0) {
                this.lastTime = currentTime;
            }

            const deltaTime = (currentTime - this.lastTime) / 1000;
            this.lastTime = currentTime;

            this.update(deltaTime);
            this.render();
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    stop() {
        this.gameStart = false;
    }

    getRandomColor() {
        return this.squareColors[Math.floor(Math.random() * this.squareColors.length)];
    } 
    
    getCoordinates() {
        const coordinates = {
            top: {
                start: this.centerY - this.trackSize / 2,
                end: this.centerY - this.innerSquareSize / 2,
                center: ((this.centerY - this.innerSquareSize / 2) - (this.centerY - this.trackSize / 2)) / 2
            },
            bottom: {
                start: this.centerY + this.innerSquareSize / 2,
                end: this.centerY + this.trackSize / 2,
                center: ((this.centerY - this.innerSquareSize / 2) - (this.centerY - this.trackSize / 2)) / 2
            },
            left: {
                start: this.centerX - this.trackSize / 2,
                end: this.centerX - this.innerSquareSize / 2,
                center: ((this.centerX - this.innerSquareSize / 2) - (this.centerX - this.trackSize / 2)) / 2
            },
            right: {
                start: this.centerX + this.innerSquareSize / 2,
                end: this.centerX + this.trackSize / 2,
                center: ((this.centerX - this.innerSquareSize / 2) - (this.centerX - this.trackSize / 2)) / 2
            }
        }

        return coordinates;
    } 

    update(deltaTime) {
        this.foodRotation += 0.1 * deltaTime * 60;
        this.moveSquare(deltaTime);
        this.updatePositionHistory(deltaTime);

        if (!this.gameOver) {
            this.checkCollision();
            this.checkFood();
        } else {
            this.updateFragments(deltaTime);
        }
    }

    updatePositionHistory(deltaTime) {
        this.trailTimer += deltaTime;
        if (this.trailTimer >= this.trailInterval) {
            this.positionHistory.unshift({ x: this.position.x, y: this.position.y, time: 0 });
            this.trailTimer = 0;
        }

        this.positionHistory.forEach(pos => pos.time += deltaTime);
        this.positionHistory = this.positionHistory.filter(pos => pos.time < this.trailLength * this.trailInterval);
    }    
    
    updateFragments(deltaTime) {
        this.fragments = this.fragments.filter(fragment => fragment.life > 0);
        this.fragments.forEach(fragment => {
            fragment.x += fragment.vx * deltaTime * 60;
            fragment.y += fragment.vy * deltaTime * 60;
            fragment.size *= Math.pow(0.95, deltaTime * 60);
            fragment.life -= 2 * deltaTime * 60;
        });
    }    

    changeDirection() {
        if (!this.reverse) {
            if (this.direction === 'right') this.direction = 'down';
            else if (this.direction === 'down') this.direction = 'left';
            else if (this.direction === 'left') this.direction = 'up';
            else if (this.direction === 'up') this.direction = 'right';
        } else {
            if (this.direction === 'right') this.direction = 'up';
            else if (this.direction === 'down') this.direction = 'right';
            else if (this.direction === 'left') this.direction = 'down';
            else if (this.direction === 'up') this.direction = 'left';
        }
    }

    reverseDirection() {
        if (this.direction === 'right') this.direction = 'left';
        else if (this.direction === 'down') this.direction = 'up';
        else if (this.direction === 'left') this.direction = 'right';
        else if (this.direction === 'up') this.direction = 'down';

        this.reverse = !this.reverse;
    }

    moveSquare(deltaTime) {
        const movement = this.speed * deltaTime * 60;
        if (this.direction === 'right') this.position.x += movement;
        else if (this.direction === 'down') this.position.y += movement;
        else if (this.direction === 'left') this.position.x -= movement;
        else if (this.direction === 'up') this.position.y -= movement;
    }

    checkCollision() {
        if (this.gameOver) return;

        const { top, bottom, left, right } = this.sideCoordinates;
        const square = this.squareSize;

        const checkBigSquare =
            this.position.y < top.start || 
            this.position.y > bottom.end - square || 
            this.position.x < left.start || 
            this.position.x > right.end - square;

        const checkSmallSquare =
            this.position.y < bottom.start && 
            this.position.y > top.end - square && 
            this.position.x < right.start && 
            this.position.x > left.end - square;

        if (checkBigSquare || checkSmallSquare) {
            this.gameOver = true;
            this.sound.playGameOver();
            this.generateFragments();
            this.menu.showOverlay();
        }
    }

    checkFood() {
        if (Math.abs(this.position.x - this.food.x) < this.squareSize && Math.abs(this.position.y - this.food.y) < this.squareSize) {
            this.score++;
            this.speed = this.speed + 0.02;
            this.sound.playFood();
            this.food = this.generateFood();
            if (Math.random() < 0.3) this.reverseDirection();
        }
    }

    generateFood() {
        let possibleSides = [];
        switch (this.direction) {
            case 'right':
                possibleSides = ['right', 'bottom', 'left'];
                break;
            case 'down':
                possibleSides = ['top', 'bottom', 'left'];
                break;
            case 'left':
                possibleSides = ['left', 'top', 'right'];
                break;
            case 'up':
                possibleSides = ['top', 'right', 'bottom'];
                break;
        }

        const randomSide = possibleSides[Math.floor(Math.random() * possibleSides.length)];

        let foodX, foodY;
        if (randomSide === 'top') {
            foodX = this.centerX - this.foodSize / 2;
            foodY = this.sideCoordinates.top.end - this.sideCoordinates.top.center - (this.foodSize / 2);
        } else if (randomSide === 'bottom') {
            foodX = this.centerX - this.foodSize / 2;
            foodY = this.sideCoordinates.bottom.end - this.sideCoordinates.bottom.center - (this.foodSize / 2);
        } else if (randomSide === 'left') {
            foodX = this.sideCoordinates.left.end - this.sideCoordinates.left.center - (this.foodSize / 2);
            foodY = this.centerY - this.foodSize / 2;
        } else if (randomSide === 'right') {
            foodX = this.sideCoordinates.right.end - this.sideCoordinates.right.center - (this.foodSize / 2);
            foodY = this.centerY - this.foodSize / 2;
        }

        return { x: foodX, y: foodY };
    }

    generateFragments() {
        const fragmentSize = this.squareSize / 3;
        const numFragments = 9;

        for (let i = 0; i < numFragments; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            this.fragments.push({
                x: this.position.x + (i % 4) * fragmentSize,
                y: this.position.y + Math.floor(i / 4) * fragmentSize,
                vx, vy, size: fragmentSize, life: 100
            });
        }
    }

    renderFragments() {
        this.ctx.fillStyle = this.squareColor;
        this.fragments.forEach(fragment => {
            this.ctx.fillRect(fragment.x, fragment.y, fragment.size, fragment.size);
        });
    }

    render() {
        this.stars.render();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(255, 255, 255, .05)';
        this.ctx.fillRect(this.centerX - this.trackSize / 2, this.centerY - this.trackSize / 2, this.trackSize, this.trackSize);
        this.ctx.clearRect(this.centerX - this.innerSquareSize / 2, this.centerY - this.innerSquareSize / 2, this.innerSquareSize, this.innerSquareSize);

        if (!this.gameOver) {
            this.positionHistory.forEach((pos) => {
                const progress = pos.time / (this.trailLength * this.trailInterval);
                const size = Math.max(this.squareSize / 10, this.trailSize * (1 - progress));
                const jitter = (Math.random() - 0.5) * 4 * progress;
                const alpha = Math.ceil(100 - progress * 100);

                this.ctx.fillStyle = `${this.squareColor}${alpha}`;

                this.ctx.fillRect(
                    pos.x + (this.squareSize - size) / 2 + jitter, 
                    pos.y + (this.squareSize - size) / 2 + jitter, 
                    size, 
                    size
                );
            });

            this.ctx.fillStyle = this.squareColor;
            this.ctx.fillRect(this.position.x, this.position.y, this.squareSize, this.squareSize);
        } else {
            this.renderFragments();
        }

        this.ctx.save();
        this.ctx.translate(this.food.x + this.foodSize / 2, this.food.y + this.foodSize / 2);
        this.ctx.rotate(this.foodRotation);
        this.ctx.fillStyle = '#ba95f3';
        this.ctx.fillRect(-this.foodSize / 2, -this.foodSize / 2, this.foodSize, this.foodSize);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(-Math.PI / 4);
        this.ctx.fillStyle = 'rgba(255, 255, 255, .2)';
        this.ctx.font = 'Bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.score, 0, 18);
        this.ctx.restore();
    }
}
