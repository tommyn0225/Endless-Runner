class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // scrolling background
        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0);

        // UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0xFFFFFF).setOrigin(0, 0);
        
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // add spaceship
        this.p1Spaceship = this.physics.add.sprite(100, game.config.height / 2, 'spaceship').setOrigin(0.5);
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('spaceship', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.p1Spaceship.play('fly'); // animation
        this.p1Spaceship.setVelocityY(-100); // initial upward movement

        // input controls
        this.input.on('pointerdown', () => {
            this.p1Spaceship.setVelocityY(400); //down
        });
        this.input.on('pointerup', () => {
            this.p1Spaceship.setVelocityY(-400); // up
        });

    }

    update() {
        this.background.tilePositionX += 4;

        // border between 50 and 430 on the y-axis
        if (this.p1Spaceship.y < 125) {
            this.p1Spaceship.y = 125;
            this.p1Spaceship.setVelocityY(0);
        }
        if (this.p1Spaceship.y > 430) {
            this.p1Spaceship.y = 430;
            this.p1Spaceship.setVelocityY(0);
        }
    }
}
