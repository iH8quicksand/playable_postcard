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

        // In create() - hidden by default, centered on screen
        this.vid = this.add.video(0, 0, 'myAnim')
        .setOrigin(0)
        .setDepth(5)
        .setScrollFactor(0)
        .setVisible(false);

        this.cameras.main.scrollX = this.riverPosition * game.config.width

        const uiConfig = { fontFamily: 'Arial', fontSize: '64px', color: '#FFFFFF' }
        
        //this.goldText = this.add.text(50, 50, 'Gold: 0 oz', uiConfig).setScrollFactor(0) 
        this.goldText = this.add.bitmapText(50, 20, 'DZW', 'GOLD: 0 OZ', 90).setOrigin(0.).setScrollFactor(0)

        this.sellButton = this.add.image(game.config.width - 250, 100, 'sell')
        .setInteractive({ useHandCursor: true })
        .setScrollFactor(0)
        .on('pointerdown', () => {
            if (!this.isPanning && !this.isSliding) {
                this.bgMusic.stop() 
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


        this.panContainer = this.add.container(game.config.width / 2, game.config.height - 400).setVisible(false).setDepth(10).setScrollFactor(0)
        
        let panImg = this.add.image(0, 0, 'pan')
        
        this.panText = this.add.text(0, 50, '', { fontFamily: 'Arial', fontSize: '80px', color: '#FFD700', align: 'center', stroke: '#000000', strokeThickness: 6 }).setOrigin(0.5)
        
        this.panContainer.add([panImg, this.panText])

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

        this.panText.setText('hmmm...')
        this.panText.setColor('#FFFFFF')

        // DETERMINE OUTCOME AND PLAY SOUND WITH DELAYS
        let isFoolsGold = Math.random() > 0.4
        let foundOz = isFoolsGold ? 0 : Phaser.Math.Between(1, 5)

        if (isFoolsGold) {
            if (Math.random() > 0.5) {
                this.sound.play('fools_gold', { delay: 0.5 }); 
            } else {
                this.sound.play('fools_gold1', { delay: 0.5 });
            }
        } else {
            if (foundOz >= 4) {
                this.sound.play('struck_gold_mega', { delay: 0.25 }); 
            } else {
                this.sound.play('struck_gold'); 
            }
        }

        this.vid.setVisible(true);
        this.vid.play();
                
        if (isFoolsGold) {
            this.panText.setText('bruh, just\nfools gold\n(0 oz)')
            this.panText.setColor('#AAAAAA')
        } else {
            let voiceline = foundOz >= 4 ? "Oh, My, GOD!" : "oooooh shiny"
            this.panText.setText(`${voiceline}\n+${foundOz} oz`)
            this.panText.setColor('#FFD700')
            
            this.totalGold += foundOz
            this.goldText.setText(`GOLD: ${this.totalGold} OZ`)
        }

        this.time.delayedCall(1500, () => {
            this.panContainer.setVisible(false)
            this.vid.stop()
            this.vid.setVisible(false)
            sparkle.destroy()
            this.isPanning = false
        })
    }
}
