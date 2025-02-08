// src/scenes/Play.js
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

        // spaceship
        this.p1Spaceship = this.physics.add.sprite(100, game.config.height / 2, 'spaceship').setOrigin(0.5);
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('spaceship', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.p1Spaceship.play('fly'); // animation

          // asteroids
          this.obs01 = new Obstacle(this, game.config.width + borderUISize*6, borderUISize*4, 'asteroid', 0, 30).setOrigin(0, 0)
          this.obs02 = new Obstacle(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'asteroid', 0, 20).setOrigin(0,0)
          this.obs03 = new Obstacle(this, game.config.width, borderUISize*6 + borderPadding*4, 'asteroid', 0, 10).setOrigin(0,0)

        // input controls
        this.input.on('pointerdown', () => {
            this.p1Spaceship.setVelocityY(600); //down
        });
        this.input.on('pointerup', () => {
            this.p1Spaceship.setVelocityY(-600); // up
        });

        // asteroid group
        this.asteroids = this.add.group()

        // spawn 2 asteroids
        for (let i = 0; i < 2; i++) {
            let randomY = Phaser.Math.Between(125, 430)
            let asteroid = new Obstacle(this, game.config.width, randomY, 'asteroid', 0)
            this.asteroids.add(asteroid)
        }

        // increase asteroid speed over time
        this.time.addEvent({
            delay: 5000, // every 5 seconds
            callback: this.increaseAsteroidSpeed, // increases speed
            callbackScope: this,
            loop: true
        })

    }

    update() {
        this.background.tilePositionX += 4;

        // top and bottom borders
        if (this.p1Spaceship.y < 125) {
            this.p1Spaceship.y = 125;
            this.p1Spaceship.setVelocityY(0);
        }
        if (this.p1Spaceship.y > 430) {
            this.p1Spaceship.y = 430;
            this.p1Spaceship.setVelocityY(0);
        }

        // update asteroids
        this.asteroids.getChildren().forEach(asteroid => {
            asteroid.update()
        })
    }

    // increase speed of asteorid by 1
    increaseAsteroidSpeed() {
        this.asteroids.getChildren().forEach(asteroid => {
            asteroid.moveSpeed += 1
        })
    }
}
