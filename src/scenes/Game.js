class Game extends Phaser.Scene {
    constructor() {
        super("gameScene")
    }

    init() {
        // Variables to keep track of gold and where we are in the river
        this.totalGold = 0
        this.riverPosition = 2 
        this.isPanning = false 
        this.isSliding = false 
    }


    create() {
        this.cameras.main.setBounds(0, 0, game.config.width * 5, game.config.height)
        
        this.add.image(0*game.config.width, 0, 'river0').setOrigin(0.0, 0.0)
        this.add.image(1*game.config.width, 0, 'river1').setOrigin(0.0, 0.0)
        this.add.image(2*game.config.width, 0, 'river2').setOrigin(0.0, 0.0)
        this.add.image(3*game.config.width, 0, 'river3').setOrigin(0.0, 0.0)
        this.add.image(4*game.config.width, 0, 'river4').setOrigin(0.0, 0.0)

        this.vid = this.add.video(0, 530, 'myAnim')
        .setOrigin(0)
        .setDepth(5)
        .setScrollFactor(0)
        .setVisible(false);

        // prime the video so it works later
        this.vid.play();
        this.vid.stop();
        this.vid.seekTo(0);

        this.cameras.main.scrollX = this.riverPosition * game.config.width

        const uiConfig = { fontFamily: 'Arial', fontSize: '64px', color: '#FFFFFF' }
        
        this.goldText = this.add.bitmapText(50, 20, 'DZW', 'GOLD: 0 OZ', 90).setOrigin(0.).setScrollFactor(0)
        
        this.bonusText = this.add.bitmapText(game.config.width/2 - 200, game.config.height/2, 'DZW', '', 70)
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(20)
        .setAlpha(0)
        .setTint(0x00ff00)


        this.sellButton = this.add.image(game.config.width - 250, 100, 'sell')
        .setInteractive({ useHandCursor: true })
        .setScrollFactor(0)
        .on('pointerdown', () => {
            if (!this.isPanning && !this.isSliding) {
                this.bgMusic.stop() 
                this.sellSound = this.sound.add('chaching')
                this.sellSound.play()
                this.scene.start('letterScene', { gold: this.totalGold })
            }
        })

        // Array to hold current sparkles
        this.sparkles = []
        this.generateAllSparkles()

        this.leftArrow = this.add.image(150, game.config.height / 2, 'arrow_left')
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0)
            .on('pointerdown', () => this.moveRiver(-1))

        this.rightArrow = this.add.image(game.config.width - 150, game.config.height / 2, 'arrow_right')
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0)
            .on('pointerdown', () => this.moveRiver(1))

        this.leftArrow.setVisible(this.riverPosition > 0)
        this.rightArrow.setVisible(this.riverPosition < 4)


        // play music :)
        this.bgMusic = this.sound.add('river_ambient', { loop: true, volume: 0.5 })
        this.bgMusic.play()
    }

    moveRiver(direction) {
        if (this.isPanning || this.isSliding) return

        let newPos = this.riverPosition + direction
        if (newPos < 0 || newPos > 4) return

        this.riverPosition = newPos
        this.isSliding = true
        
        this.leftArrow.setVisible(this.riverPosition > 0)
        this.rightArrow.setVisible(this.riverPosition < 4)

        this.tweens.add({
            targets: this.cameras.main,
            scrollX: this.riverPosition * game.config.width,
            duration: 600, 
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.isSliding = false; 
            }
        })
    }

    generateAllSparkles() {
        for (let section = 0; section < 5; section++) {
            let count = Phaser.Math.Between(2, 5)
            
            for(let i = 0; i < count; i++) {
                let startX = section * game.config.width
                let x = Phaser.Math.Between(startX + 300, startX + game.config.width - 300)
                let y = Phaser.Math.Between(400, game.config.height - 400)

                let sparkle = this.add.sprite(x, y, 'gold',).setScale(2)
                    .setOrigin(0.5)
                    .setInteractive({ useHandCursor: true })
                    .on('pointerdown', () => this.digGold(x, y, sparkle))
                

                this.sparkles.push(sparkle)
            }
        }
    }

    digGold(x, y, sparkle) {
        if (this.isPanning) return
        this.isPanning = true

        sparkle.setVisible(false)


        // DETERMINE OUTCOME AND PLAY SOUND WITH DELAYS
        let isFoolsGold = Math.random() > 0.6
        let foundOz = isFoolsGold ? 0 : Phaser.Math.Between(2, 5)

        if (isFoolsGold) {
            if (Math.random() > 0.3) {
                this.sound.play('fools_gold0', {delay: 1.5}); 
                console.log('fools_gold0')
            } else if (Math.random() > 0.3) {
                this.sound.play('fools_gold1', {delay: 1.5});
                console.log('fools_gold1')
            } else {
                this.sound.play('fools_gold2', {delay: 1.0})
                console.log('fools_gold2')
            }
        } else {
            switch (foundOz) {
                case 2:
                    this.sound.play('struck_gold0', {delay: 0.0})
                    console.log('struck_gold0')
                    break
                case 3:
                    this.sound.play('struck_gold1', {delay: 1.5})
                    console.log('struck_gold1')
                    break
                case 4:
                    this.sound.play('struck_gold2', {delay: 2.0})
                    console.log('struck_gold2')
                    break
                case 5:
                    this.sound.play('struck_gold3', {delay: 2.0})
                    console.log('struck_gold3')
                    break
            }
        }

        this.vid.setVisible(false);
        this.vid.seekTo(0);
        this.vid.video.addEventListener('seeked', () => {
            this.vid.setVisible(true);
            this.vid.play();
        }, { once: true });
                

        this.time.delayedCall(3250, () => {
            this.vid.stop()
            this.vid.setVisible(false)
            sparkle.destroy()
            this.isPanning = false
            if (!isFoolsGold) {
                this.totalGold += foundOz
                this.goldText.setText(`GOLD: ${this.totalGold} OZ`)
                this.bonusText.setText(`${foundOz} OZ FOUND`).setAlpha(1);
                this.tweens.add({
                    targets: this.bonusText,
                    alpha: 0,
                    delay: 1000,
                    duration: 800,
                    ease: 'Sine.easeIn'
                })
            }
        })
    }
}
