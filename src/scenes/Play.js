//src/scenes/Play.js
class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0)
    }

    update() {
        this.background.tilePositionX += 4
    }
}