class Menu {
    constructor(game, sound) {
        this.game = game;
        this.sound = sound;

        this.startOverlay = document.getElementById('startOverlay');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.soundButton = document.getElementById('soundButton');

        this.init();
    }

    init() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restartGame());
        this.soundButton.addEventListener('click', () => this.toggleSound());
    }

    startGame() {
        this.hideOverlay(this.startOverlay);
        setTimeout(() => this.game.start(), 500);
    }

    restartGame() {
        this.hideOverlay(this.startOverlay);
        setTimeout(() => this.game.restart(), 500);
    }

    toggleSound() {
        this.sound.toggleSound();
        this.soundButton.innerHTML = this.sound.ambientSound.muted ? 'Звук: ВЫКЛ' : 'Звук: ВКЛ';
        this.soundButton.classList.toggle('mute');
    }

    showOverlay() {
        if(this.game.gameStart == true){
            this.startButton.style.display = 'none';
            this.restartButton.style.display = 'block';
        }

        setTimeout(() => this.startOverlay.classList.add('show'), 500);
    }

    hideOverlay() {
        this.startOverlay.classList.remove('show');
    }
}
