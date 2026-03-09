class Letter extends Phaser.Scene {
    constructor() {
        super("letterScene");
    }

    init(data) {
        this.finalGold = data.gold || 0;
    }

    create() {
        this.cameras.main.setBackgroundColor('#F5DEB3'); // Envelope color
        
        let money = this.finalGold * 2000;
        
        const textConfig = { 
            fontFamily: 'Arial', 
            fontSize: '72px', 
            color: '#000000', 
            align: 'center', 
            wordWrap: { width: 1400 } 
        };
        
        let message = `Dear Dad,\n\nI went panning in the river and found ${this.finalGold} troy ounces of gold!\n\nI sold it for $${money.toLocaleString()}\n`;
        
        this.add.text(game.config.width / 2, game.config.height / 2, message, textConfig).setOrigin(0.5);

        // Click to restart demo
        this.add.text(game.config.width / 2, game.config.height - 200, 'Tap to play again', { fontSize: '48px', color: '#555555' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('envelopeScene');
            });
    }
}