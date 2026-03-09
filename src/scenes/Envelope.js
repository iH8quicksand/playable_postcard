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
        this.load.image('river', './assets/river.JPG')
        this.load.image('sell', './assets/sell.JPG')
    }

    create() {
        this.add.sprite(2208, 1400, 'envelope').setOrigin(1, 1)

        this.input.on('pointerdown', () => {
            this.scene.start('gameScene');
        });
    }
}
