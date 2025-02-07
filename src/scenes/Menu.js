//src/scenes/Menu.js
class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene")
    }

    preload() {
        // load assets
        this.load.image('background', './assets/background.png')
        this.load.spritesheet('asteroid', './assets/asteroid.png', {
            frameWidth: 64,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 4
        })
        this.load.spritesheet('spaceship', './assets/Spaceship.png', {
            frameWidth: 64,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 4
        })
    }
    
    create() {
        this.add.text(20, 20, "Endless Runner Play")
        this.scene.start("playScene")
    }
}
  