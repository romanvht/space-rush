class Sound {
    constructor(game) {
        this.game = game;

        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = {};
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);

        this.loadSound('food', 'assets/sounds/food.wav');
        this.loadSound('over', 'assets/sounds/over.wav');
        this.loadSound('turn', 'assets/sounds/turn.wav');
        this.loadSound('ambient', 'assets/sounds/ambient.wav');

        this.ambient = null;
        this.muted = false;
    }

    loadSound(name, url) {
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.context.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.sounds[name] = audioBuffer;
            })
            .catch(error => console.error(error));
    }

    playSound(name) {
        if (this.muted || !this.sounds[name]) return;
        const source = this.context.createBufferSource();
        source.buffer = this.sounds[name];
        source.connect(this.gainNode);
        source.start(0);
    }

    playFood() {
        this.playSound('food');
    }

    playGameOver() {
        this.playSound('over');
    }

    playTurn() {
        this.playSound('turn');
    }

    playAmbient() {
        if (!this.game.gameStart) return;
        if (this.muted || !this.sounds['ambient']) return;
        if (this.ambient) this.ambient.stop();

        this.ambient = this.context.createBufferSource();
        this.ambient.buffer = this.sounds['ambient'];
        this.ambient.connect(this.gainNode);
        this.ambient.loop = true;
        this.ambient.start(0);
        this.fadeSound(0.01, 1);
    }

    stopAmbient() {
        if (!this.game.gameStart) return;
        if (!this.muted || !this.sounds['ambient']) return;
        if (!this.ambient) return;

        this.fadeSound(1, 0.01);
        setTimeout(() => {
            this.ambient.stop();
            this.ambient = null;
        }, 150);
    }

    unmuteAmbient() {
        this.fadeSound(0.01, 1);
    }

    muteAmbient() {
        this.fadeSound(1, 0.01);
        setTimeout(() => {
            this.gainNode.gain.value = 0
        }, 150);
    }

    fadeSound(start, end, duration = 0.1) {
        this.gainNode.gain.setValueAtTime(start, this.context.currentTime);
        this.gainNode.gain.exponentialRampToValueAtTime(end, this.context.currentTime + duration);
    }

    toggleSound() {
        this.muted = !this.muted;
        this.muted ? this.stopAmbient() : this.playAmbient();
    }    
}