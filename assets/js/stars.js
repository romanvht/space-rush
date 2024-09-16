class Stars {
    constructor() {
        this.canvas = document.getElementById('stars');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.stars = [];
        this.generateStars(100);
    }

    generateStars(count) {
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speed: Math.random() * 0.5 + 0.2
            });
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.stars.forEach(star => {
            this.ctx.fillStyle = '#c7c9c5';
            this.ctx.fillRect(star.x, star.y, star.size, star.size);

            star.x += star.speed;
            if (star.x > this.canvas.width) star.x = 0;
        });
    }
}