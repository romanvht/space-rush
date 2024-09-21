class Input {
    constructor(game, stars, sound) {
        this.game = game;
        this.stars = stars;
        this.sound = sound;

        this.init();
    }

    init() {
        window.addEventListener('click', this.onClick.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener("visibilitychange", this.onFocus.bind(this));
    }

    onClick() {
        if (this.game.gameStart && !this.game.gameOver) {
            this.sound.playTurn();
            this.game.changeDirection();
        }
    }

    onResize() {
        this.stars.canvas.width = window.innerWidth;
        this.stars.canvas.height = window.innerHeight;

        this.game.canvas.width = window.innerWidth;
        this.game.canvas.height = window.innerHeight;
        this.game.centerX = this.game.canvas.width / 2;
        this.game.centerY = this.game.canvas.height / 2;
        this.game.sideCoordinates = this.game.getCoordinates();
        this.game.food = this.game.generateFood();

        this.game.position = { 
            x: this.game.sideCoordinates.left.end - this.game.sideCoordinates.left.center - (this.game.squareSize / 2), 
            y: this.game.centerY - this.game.squareSize / 2 
        }
    
        this.game.render();
    }

    onFocus() {
        if (document.hidden) {
            this.sound.ambientSound.pause();
        } else {
            this.sound.ambientSound.play();
        }
    }
}