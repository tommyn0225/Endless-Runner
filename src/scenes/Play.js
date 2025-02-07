//src/scenes/Play.js
class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        // scrolling background
        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0)

        // UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0xFFFFFF).setOrigin(0, 0)
        //white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
    }

    update() {
        this.background.tilePositionX += 2
    }
}