class Menu {
    constructor(game) {
        this.game = game;
        this.startOverlay = document.getElementById('startOverlay');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.soundButton = document.getElementById('soundButton');
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
        this.soundButton.innerText = this.soundButton.innerText === 'Звук: ВКЛ' ? 'Звук: ВЫКЛ' : 'Звук: ВКЛ';
        this.soundButton.classList.toggle('mute');
        this.game.toggleSound();
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
