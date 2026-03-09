class Game extends Phaser.Scene {
    constructor() {
        super("gameScene");
    }

    init() {
        // Variables to keep track of gold and where we are in the river
        this.totalGold = 0;
        this.riverPosition = 2; 
        this.isPanning = false; 
        this.isSliding = false; 
    }


    create() {
        this.cameras.main.setBounds(0, 0, game.config.width * 5, game.config.height);
        
        this.add.image(0, 0, 'river').setOrigin(0.5, 0.5);

        this.cameras.main.scrollX = this.riverPosition * game.config.width;

        const uiConfig = { fontFamily: 'Arial', fontSize: '64px', color: '#FFFFFF' };
        
        this.goldText = this.add.text(50, 50, 'Gold: 0 oz', uiConfig).setScrollFactor(0); 

        this.sellButton = this.add.image(game.config.width - 250, 100, 'sell')
        .setInteractive({ useHandCursor: true })
        .setScrollFactor(0)
        .on('pointerdown', () => {
            if (!this.isPanning && !this.isSliding) {
                this.scene.start('letterScene', { gold: this.totalGold });
            }
        });

        this.leftArrow = this.add.image(150, game.config.height / 2, 'arrow_left')
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0)
            .on('pointerdown', () => this.moveRiver(-1));

        this.rightArrow = this.add.image(game.config.width - 150, game.config.height / 2, 'arrow_right')
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0)
            .on('pointerdown', () => this.moveRiver(1));

        this.leftArrow.setVisible(this.riverPosition > 0);
        this.rightArrow.setVisible(this.riverPosition < 4);

        // Array to hold current sparkles
        this.sparkles = [];
        this.generateAllSparkles();

        this.panContainer = this.add.container(game.config.width / 2, game.config.height - 400).setVisible(false).setDepth(10).setScrollFactor(0);
        
        let panImg = this.add.image(0, 0, 'pan');
        
        this.panText = this.add.text(0, 50, '', { fontFamily: 'Arial', fontSize: '80px', color: '#FFD700', align: 'center', stroke: '#000000', strokeThickness: 6 }).setOrigin(0.5);
        
        this.panContainer.add([panImg, this.panText]);
    }

    moveRiver(direction) {
        if (this.isPanning || this.isSliding) return; 

        let newPos = this.riverPosition + direction;
        if (newPos < 0 || newPos > 4) return; 

        this.riverPosition = newPos;
        this.isSliding = true; 
        
        this.leftArrow.setVisible(this.riverPosition > 0);
        this.rightArrow.setVisible(this.riverPosition < 4);

        this.tweens.add({
            targets: this.cameras.main,
            scrollX: this.riverPosition * game.config.width,
            duration: 600, // Takes 0.6 seconds to slide
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.isSliding = false; 
            }
        });
    }

    generateAllSparkles() {
        for (let section = 0; section < 5; section++) {
            let count = Phaser.Math.Between(2, 5);
            
            for(let i = 0; i < count; i++) {
                let startX = section * game.config.width;
                let x = Phaser.Math.Between(startX + 300, startX + game.config.width - 300);
                let y = Phaser.Math.Between(400, game.config.height - 400);

                let sparkle = this.add.text(x, y, '✨', { fontSize: '96px' })
                    .setOrigin(0.5)
                    .setInteractive({ useHandCursor: true })
                    .on('pointerdown', () => this.digGold(x, y, sparkle));
                

                this.sparkles.push(sparkle);
            }
        }
    }

    digGold(x, y, sparkle) {
        if (this.isPanning) return;
        this.isPanning = true;

        sparkle.setVisible(false);

        this.panContainer.y = game.config.height - 300; 
        this.panContainer.setVisible(true);
        this.panText.setText('hmmm...');
        this.panText.setColor('#FFFFFF');

        this.tweens.add({
            targets: this.panContainer,
            y: game.config.height - 400, // Move up by 100px
            yoyo: true,
            repeat: 3, 
            duration: 150,
            onComplete: () => {
                let isFoolsGold = Math.random() > 0.6; 
                let foundOz = isFoolsGold ? 0 : Phaser.Math.Between(1, 5);

                if (isFoolsGold) {
                    this.panText.setText('bruh, just\nfools gold\n(0 oz)');
                    this.panText.setColor('#AAAAAA');
                } else {
                    let voiceline = foundOz >= 4 ? "Oh, My, GOD!" : "oooooh shiny";
                    this.panText.setText(`${voiceline}\n+${foundOz} oz`);
                    this.panText.setColor('#FFD700'); 
                    
                    // Update global count
                    this.totalGold += foundOz;
                    this.goldText.setText(`Gold: ${this.totalGold} oz`);
                }

                this.time.delayedCall(1500, () => {
                    this.panContainer.setVisible(false);
                    sparkle.destroy(); // Remove sparkle permanently
                    this.isPanning = false;
                });
            }
        });
    }
}
