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
        })
        this.load.spritesheet('spaceship', './assets/Spaceship.png', {
            frameWidth: 64,
            frameHeight: 64,
        })
    }
    
    create() {
        // display menu text
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            //fixedWidth: 200
        }

        this.add.text(game.config.width / 2, game.config.height / 2 + 100, 'Use [LMouse] to move down', menuConfig).setOrigin(0.5)
        menuConfig.backgroundColor = '#FFFFFF'
        menuConfig.color = '#F00000'
        this.add.text(game.config.width / 2, game.config.height / 2 + 150, 'Press [LMouse] to start!', menuConfig).setOrigin(0.5)
        menuConfig.color = '#000000'
        this.add.text(game.config.width / 2, game.config.height / 2 + 200, 'code, music, graphics by Tommy Nguyen', menuConfig).setOrigin(0.5)


        // define keys
        this.keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)

        // start the game on left mouse button
        this.input.on('pointerdown', () => {
            this.scene.start('playScene')
        })
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyRESET)) {
            this.scene.start('playScene')
        }
    }
}
