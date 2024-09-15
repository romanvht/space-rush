class Game {
    constructor() {
        this.initElements();

        this.gameCanvas.width = window.innerWidth;
        this.gameCanvas.height = window.innerHeight;
        this.starsCanvas.width = window.innerWidth;
        this.starsCanvas.height = window.innerHeight;

        this.centerX = this.gameCanvas.width / 2;
        this.centerY = this.gameCanvas.height / 2;

        this.positionHistory = [];
        this.fragments = [];
        this.stars = [];
        this.squareColors = ['#50fb78', '#fb5050', '#5078fb'];

        this.trackSize = 300;
        this.innerSquareSize = 160;
        this.sideСoordinates = this.getСoordinates();
        this.squareSize = 30;
        this.squareColor = this.getRandomColor();
        this.speed = 4;
        this.direction = 'up';
        this.reverse = false;
        this.foodSize = 20;
        this.food = this.generateFood();
        this.foodRotation = 0;

        this.position = { 
            x: this.sideСoordinates.left.end - this.sideСoordinates.left.center - (this.squareSize / 2), 
            y: this.centerY - this.squareSize / 2 
        }

        this.trailLength = 6;
        this.trailSize = this.squareSize / 2;
        this.trailInterval = 0.05;
        this.trailTimer = 0;
        this.lastTime = 0;
        this.score = 0;

        this.gameStart = false;
        this.gameOver = false;
        this.reverse = false;

        this.generateStars(100);
        this.render();

        this.initHandlers();
    }

    initElements() {
        this.gameCanvas = document.getElementById('game');
        this.starsCanvas = document.getElementById('stars');

        this.gameCtx = this.gameCanvas.getContext('2d');
        this.starsCtx = this.starsCanvas.getContext('2d');

        this.menu = new Menu();
    }

    initHandlers() {
        this.gameCanvas.addEventListener('click', this.onClick.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));
    }

    start() {
        if (!this.gameStart) {
            this.gameStart = true;
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    restart() {
        this.position = { 
            x: this.sideСoordinates.left.end - this.sideСoordinates.left.center - (this.squareSize / 2), 
            y: this.centerY - this.squareSize / 2 
        }

        this.score = 0;
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

    onClick() {
        if (this.gameStart && !this.gameOver) {
            this.changeDirection();
        }
    }

    onResize() {
        this.gameCanvas.width = window.innerWidth;
        this.gameCanvas.height = window.innerHeight;
        this.starsCanvas.width = window.innerWidth;
        this.starsCanvas.height = window.innerHeight;
    
        this.centerX = this.gameCanvas.width / 2;
        this.centerY = this.gameCanvas.height / 2;
    
        this.sideСoordinates = this.getСoordinates();
        this.food = this.generateFood();

        this.position = { 
            x: this.sideСoordinates.left.end - this.sideСoordinates.left.center - (this.squareSize / 2), 
            y: this.centerY - this.squareSize / 2 
        }
    
        this.render();
    }    

    getRandomColor() {
        return this.squareColors[Math.floor(Math.random() * this.squareColors.length)];
    } 
    
    getСoordinates() {
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

        const { top, bottom, left, right } = this.sideСoordinates;
        const square = this.squareSize;

        if (this.position.y < top.start || this.position.y > bottom.end - square || this.position.x < left.start || this.position.x > right.end - square) {
            this.gameOver = true;
            this.generateFragments();
            this.menu.showOverlay(this.menu.restartOverlay);
        }

        if (this.position.y < bottom.start && this.position.y > top.end - square && this.position.x < right.start && this.position.x > left.end - square) {
            this.gameOver = true;
            this.generateFragments();
            this.menu.showOverlay(this.menu.restartOverlay);
        }
    }

    checkFood() {
        if (Math.abs(this.position.x - this.food.x) < this.squareSize && Math.abs(this.position.y - this.food.y) < this.squareSize) {
            this.score++;
            this.food = this.generateFood();

            if (Math.random() < 0.3) {
                this.reverseDirection();
            }
        }
    }

    generateStars(count) {
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.starsCanvas.width,
                y: Math.random() * this.starsCanvas.height,
                size: Math.random() * 3 + 1,
                speed: Math.random() * 0.5 + 0.2
            });
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
            foodY = this.sideСoordinates.top.end - this.sideСoordinates.top.center - (this.foodSize / 2);
        } else if (randomSide === 'bottom') {
            foodX = this.centerX - this.foodSize / 2;
            foodY = this.sideСoordinates.bottom.end - this.sideСoordinates.bottom.center - (this.foodSize / 2);
        } else if (randomSide === 'left') {
            foodX = this.sideСoordinates.left.end - this.sideСoordinates.left.center - (this.foodSize / 2);
            foodY = this.centerY - this.foodSize / 2;
        } else if (randomSide === 'right') {
            foodX = this.sideСoordinates.right.end - this.sideСoordinates.right.center - (this.foodSize / 2);
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

    renderStars() {
        this.stars.forEach(star => {
            this.starsCtx.fillStyle = '#c7c9c5';
            this.starsCtx.fillRect(star.x, star.y, star.size, star.size);

            star.x += star.speed;
            if (star.x > this.starsCanvas.width) star.x = 0;
        });
    }

    renderFragments() {
        this.gameCtx.fillStyle = this.squareColor;
        this.fragments.forEach(fragment => {
            this.gameCtx.fillRect(fragment.x, fragment.y, fragment.size, fragment.size);
        });
    }

    render() {
        this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.starsCtx.clearRect(0, 0, this.starsCanvas.width, this.starsCanvas.height);

        this.renderStars();

        this.gameCtx.fillStyle = 'rgba(255, 255, 255, .05)';
        this.gameCtx.fillRect(this.centerX - this.trackSize / 2, this.centerY - this.trackSize / 2, this.trackSize, this.trackSize);
        this.gameCtx.clearRect(this.centerX - this.innerSquareSize / 2, this.centerY - this.innerSquareSize / 2, this.innerSquareSize, this.innerSquareSize);

        if (!this.gameOver) {
            this.positionHistory.forEach((pos) => {
                const progress = pos.time / (this.trailLength * this.trailInterval);
                const size = Math.max(this.squareSize / 10, this.trailSize * (1 - progress));
                const jitter = (Math.random() - 0.5) * 4 * progress;
                const alpha = Math.ceil(100 - progress * 100);

                this.gameCtx.fillStyle = `${this.squareColor}${alpha}`;

                this.gameCtx.fillRect(
                    pos.x + (this.squareSize - size) / 2 + jitter, 
                    pos.y + (this.squareSize - size) / 2 + jitter, 
                    size, 
                    size
                );
            });

            this.gameCtx.fillStyle = this.squareColor;
            this.gameCtx.fillRect(this.position.x, this.position.y, this.squareSize, this.squareSize);
        } else {
            this.renderFragments();
        }

        this.gameCtx.save();
        this.gameCtx.translate(this.food.x + this.foodSize / 2, this.food.y + this.foodSize / 2);
        this.gameCtx.rotate(this.foodRotation);
        this.gameCtx.fillStyle = '#ba95f3';
        this.gameCtx.fillRect(-this.foodSize / 2, -this.foodSize / 2, this.foodSize, this.foodSize);
        this.gameCtx.restore();

        this.gameCtx.save();
        this.gameCtx.translate(this.centerX, this.centerY);
        this.gameCtx.rotate(-Math.PI / 4);
        this.gameCtx.fillStyle = 'rgba(255, 255, 255, .2)';
        this.gameCtx.font = '48px Impact';
        this.gameCtx.textAlign = 'center';
        this.gameCtx.fillText(this.score, 0, 18);
        this.gameCtx.restore();
    }
}
