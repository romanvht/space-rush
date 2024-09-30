class Menu {
    constructor(game, sound, storage) {
        this.game = game;
        this.sound = sound;
        this.storage = storage;

        this.initElements();
        this.initHandlers();
        this.initSound();
    }

    initElements() {
        this.startOverlay = document.getElementById('startOverlay');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.soundButton = document.getElementById('soundButton');
        this.scoreLabel = document.getElementById('score');
        this.bestscoreLabel = document.getElementById('best-score');
    }    

    initHandlers() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restartGame());
        this.soundButton.addEventListener('click', () => this.toggleSound());
    }

    initSound() {
        if(this.storage.getSoundStatus() == 'disable'){
            this.toggleSound();
        }
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
        this.soundButton.innerHTML = this.sound.muted ? 'Звук: ВЫКЛ' : 'Звук: ВКЛ';
        this.storage.setSoundStatus(this.sound.muted ? 'disable' : 'enable');
        this.soundButton.classList.toggle('mute');
    }

    showOverlay() {
        if(this.game.gameStart == true){
            this.startButton.style.display = 'none';
            this.restartButton.style.display = 'block';
            this.scoreLabel.parentElement.classList.remove('hidden');
            this.scoreLabel.innerText = this.game.score;
            this.bestscoreLabel.innerText = this.storage.getBestScore();
        }

        setTimeout(() => this.startOverlay.classList.add('show'), 500);
    }

    hideOverlay() {
        this.startOverlay.classList.remove('show');
    }
}
