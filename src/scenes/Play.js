// src/scenes/Play.js
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        this.gameOver = false;
        this.timeElapsed = 0;
        
        // scrolling background
        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0);
        
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 200
        };
        this.scoreText = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, `Score: 0`, scoreConfig);

        // spaceship
        this.p1Spaceship = this.physics.add.sprite(100, game.config.height / 2, 'spaceship').setOrigin(0.5);
        
        // spaceship animation
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('spaceship', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.p1Spaceship.play('fly'); // start spaceship animation

        // asteroid animated sprite
        this.anims.create({
            key: 'roll',
            frames: this.anims.generateFrameNumbers('asteroid', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // asteroid group
        this.asteroids = this.physics.add.group()

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

        // define keys
        this.keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // input controls
        this.input.on('pointerdown', () => {
            if (!this.gameOver) {
                this.p1Spaceship.setVelocityY(600); // down
            }
        });
        this.input.on('pointerup', () => {
            if (!this.gameOver) {
                this.p1Spaceship.setVelocityY(-600); // up
            }
        });

        // collision detection
        this.physics.add.collider(this.p1Spaceship, this.asteroids, this.handleCollision, null, this);

        // start score timer
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateScore,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(this.keyRESET)) {
            this.scene.restart();
        }

        if (this.gameOver) return;

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

    // increase speed of asteroids by 1
    increaseAsteroidSpeed() {
        this.asteroids.getChildren().forEach(asteroid => {
            asteroid.moveSpeed += 1
        })
    }

    // handle collision
    handleCollision() {
        this.gameOver = true;
        this.p1Spaceship.setVelocityY(0);
        this.asteroids.setVelocityX(0);
        this.physics.pause(); // pause physics
        this.timer.paused = true;

        // display game over text
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FF0000',
            color: '#FFFFFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        };

        this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press [R] to Restart', scoreConfig).setOrigin(0.5);
    }

    // update score
    updateScore() {
        if (!this.gameOver) {
            this.timeElapsed++;
            this.scoreText.setText(`Score: ${this.timeElapsed}`);
        }
    }
}
