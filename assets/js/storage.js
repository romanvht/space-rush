class Storage {
    constructor() {
        this.storage = window.localStorage;
    }

    getItem(key) {
        return this.storage.getItem(key);
    }

    setItem(key, value) {
        this.storage.setItem(key, value);
    }

    removeItem(key) {
        this.storage.removeItem(key);
    }

    getBestScore() {
        return this.storage.getItem('best-score') ? this.storage.getItem('best-score') : 0;
    }

    setBestScore(score) {
        if(score > this.getBestScore()) this.storage.setItem('best-score', score);
    }

    getSoundStatus() {
        return this.storage.getItem('sound') ? this.storage.getItem('sound') : 'enable';
    }

    setSoundStatus(status) {
        this.storage.setItem('sound', status)
    }
}