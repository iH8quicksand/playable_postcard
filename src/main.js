// Shiloh Sharmahd
// More Shiny Thoughts
let config = {
    type: Phaser.AUTO,
    width: 2208,
    height: 1400, 
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    scene: [ Envelope, Game, Letter ]
}

let game = new Phaser.Game(config)
