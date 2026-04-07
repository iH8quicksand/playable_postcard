class Envelope extends Phaser.Scene {
    constructor() {
        super("envelopeScene")
    }

    preload() {
        this.load.image('envelope', './assets/envelope.JPEG')
        this.load.image('arrow_left', './assets/arrow_left.PNG')
        this.load.image('arrow_right', './assets/arrow_right.PNG')
        this.load.image('gold', './assets/gold.PNG')
        this.load.image('pan', './assets/pan.PNG')
        this.load.image('river0', './assets/river_0.jpg')
        this.load.image('river1', './assets/river_1.jpg')
        this.load.image('river2', './assets/river_2.jpg')
        this.load.image('river3', './assets/river_3.jpg')
        this.load.image('river4', './assets/river_4.jpg')
        this.load.image('sell', './assets/sell.PNG')
        this.load.bitmapFont('DZW', './assets/font/DZW.png', './assets/font/DZW.xml')
        this.load.audio('fools_gold', './assets/sound/fools_gold.mp3')
        this.load.audio('fools_gold1', './assets/sound/fools_gold1.mp3')
        this.load.audio('river_ambient', './assets/sound/river_ambient.mp3')
        this.load.audio('struck_gold', './assets/sound/struck_gold.mp3')
        this.load.audio('struck_gold_mega', './assets/sound/struck_gold_mega.mp3')
        this.load.video('myAnim', './assets/output.webm', true)
    }

    create() {
        this.add.sprite(2208, 1400, 'envelope').setOrigin(1, 1)


        this.input.on('pointerdown', () => {
            this.scene.start('gameScene')
        })

    }
}
