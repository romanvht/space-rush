class Menu {
    constructor(game) {
        this.game = game;
        this.startOverlay = document.getElementById('startOverlay');
        this.restartOverlay = document.getElementById('restartOverlay');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
    }

    init() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restartGame());
    }

    startGame() {
        this.hideOverlay(this.startOverlay);
        setTimeout(() => this.game.start(), 500);
    }

    restartGame() {
        this.hideOverlay(this.restartOverlay);
        setTimeout(() => this.game.restart(), 500);
    }

    showOverlay(overlay) {
        setTimeout(() => overlay.classList.add('show'), 500);
    }

    hideOverlay(overlay) {
        overlay.classList.remove('show');
    }
}
