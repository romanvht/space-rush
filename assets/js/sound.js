class Sound {
    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = {};

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
        source.connect(this.context.destination);
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
        if (this.muted || !this.sounds['ambient']) return;
        if (this.ambient) this.ambient.stop();

        this.ambient = this.context.createBufferSource();
        this.ambient.buffer = this.sounds['ambient'];
        this.ambient.connect(this.context.destination);
        this.ambient.loop = true;
        this.ambient.start(0);
    }

    pauseAmbient() {
        if (this.ambient) {
            this.context.suspend();
        }
    }

    resumeAmbient() {
        if (this.ambient) {
            this.context.resume();
        }
    }

    toggleSound() {
        if (this.muted) {
            this.muted = false;
            if (this.ambient) this.playAmbient();
        } else {
            this.muted = true;
            if (this.ambient) this.ambient.stop();
        }
    }
}