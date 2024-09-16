class Sound {
    constructor() {
        this.foodSound = new Audio('assets/sounds/food.wav');
        this.gameOverSound = new Audio('assets/sounds/over.wav');
        this.turnSound = new Audio('assets/sounds/turn.wav');
        this.ambientSound = new Audio('assets/sounds/ambient.wav');
        this.ambientSound.loop = true;
    }

    playFood() {
        this.foodSound.currentTime = 0;
        this.foodSound.play();
    }

    playGameOver() {
        this.gameOverSound.currentTime = 0;
        this.gameOverSound.play();
    }

    playTurn() {
        this.turnSound.currentTime = 0;
        this.turnSound.play();
    }

    playAmbient() {
        this.ambientSound.play();
    }

    toggleSound() {
        if (this.ambientSound.muted) {
            this.ambientSound.muted = false;
            this.foodSound.muted = false;
            this.gameOverSound.muted = false;
            this.turnSound.muted = false;
        } else {
            this.ambientSound.muted = true;
            this.foodSound.muted = true;
            this.gameOverSound.muted = true;
            this.turnSound.muted = true;
        }
    }
}