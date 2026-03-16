class Envelope extends Phaser.Scene {
    constructor() {
        super("envelopeScene");
    }

    preload() {
        this.load.image('envelope', './assets/envelope.PNG')
        this.load.image('arrow_left', './assets/arrow_left.PNG')
        this.load.image('arrow_right', './assets/arrow_right.PNG')
        this.load.image('gold', './assets/gold.PNG')
        this.load.image('pan', './assets/pan.PNG')
        this.load.image('river0', './assets/river_chunk_0.jpg')
        this.load.image('river1', './assets/river_chunk_1.jpg')
        this.load.image('river2', './assets/river_chunk_2.jpg')
        this.load.image('river3', './assets/river_chunk_3.jpg')
        this.load.image('river4', './assets/river_chunk_4.jpg')
        this.load.image('sell', './assets/sell.PNG')
    }

    create() {
        this.add.sprite(2208, 1400, 'envelope').setOrigin(1, 1)

        this.input.on('pointerdown', () => {
            this.scene.start('gameScene');
        });
    }
}
