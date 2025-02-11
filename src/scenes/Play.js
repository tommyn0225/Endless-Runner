// src/scenes/Play.js
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // core game state
        this.gameOver = false;
        this.timeElapsed = 0;
        this.difficultyLevel = 1;
        this.spawnDelay = 2000; // initial spawn delay
        this.backgroundSpeed = 4; // initial background speed

        // load high score from localStorage (or default to 0)
        this.highScore = parseInt(localStorage.getItem('highScore')) || 0;

        // scrolling background
        this.background = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0);
        
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // score text config
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            align: 'left',
            padding: { top: 5, bottom: 5 },
            fixedWidth: 200
        };

        // display current score (top-left)
        this.scoreText = this.add.text(
            borderUISize + borderPadding,
            borderUISize + borderPadding,
            'Score: 0',
            scoreConfig
        );

        // display high score (top-left, offset to the right)
        this.highScoreText = this.add.text(
            borderUISize + borderPadding + 220,
            borderUISize + borderPadding,
            `High: ${this.highScore}`,
            scoreConfig
        );

        // create the player spaceship
        this.p1Spaceship = this.physics.add.sprite(100, game.config.height / 2, 'spaceship').setOrigin(0.5);
        // adjust hitbox size
        this.p1Spaceship.body.setSize(this.p1Spaceship.width * 0.8, this.p1Spaceship.height * 0.6);

        // spaceship animation
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('spaceship', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.p1Spaceship.play('fly'); // start ship animation

        // asteroid animation
        this.anims.create({
            key: 'roll',
            frames: this.anims.generateFrameNumbers('asteroid', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // asteroid group
        this.asteroids = this.physics.add.group();

        // spawning asteroids
        this.spawnAsteroidLoop();

        // increase difficulty every 5 seconds
        this.time.addEvent({
            delay: 5000,
            callback: this.increaseDifficulty,
            callbackScope: this,
            loop: true
        });

        // define keys (R to restart, B to go back to menu)
        this.keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keyMENU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);

        // pointer input controls
        this.input.on('pointerdown', () => {
            if (!this.gameOver) {
                this.p1Spaceship.setVelocityY(600); // move down
            }
        });
        this.input.on('pointerup', () => {
            if (!this.gameOver) {
                this.p1Spaceship.setVelocityY(-600); // move up
            }
        });

        // collision detection
        this.physics.add.collider(this.p1Spaceship, this.asteroids, this.handleCollision, null, this);

        // score timer
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateScore,
            callbackScope: this,
            loop: true
        });

        // asteroid trail
        this.asteroidTrails = [];
        this.asteroidTrailGraphics = this.add.graphics();
    }

    update() {
        // handle game over input
        if (this.gameOver) {
            if (Phaser.Input.Keyboard.JustDown(this.keyRESET)) {
                this.sound.play('buttonClick', { volume: 0.25 });
                this.scene.restart();
            }
            if (Phaser.Input.Keyboard.JustDown(this.keyMENU)) {
                this.sound.play('buttonClick', { volume: 0.25 });
                this.scene.start("menuScene"); 
            }
            return;
        }

        // scroll background
        this.background.tilePositionX += this.backgroundSpeed;

        // constrain spaceship between top/bottom
        if (this.p1Spaceship.y < 125) {
            this.p1Spaceship.y = 125;
            this.p1Spaceship.setVelocityY(0);
        }
        if (this.p1Spaceship.y > 430) {
            this.p1Spaceship.y = 430;
            this.p1Spaceship.setVelocityY(0);
        }

        // update asteroids & record their positions for trailing
        this.asteroids.getChildren().forEach(asteroid => {
            asteroid.x -= asteroid.moveSpeed;

            // destroy when off screen
            if (asteroid.x < 0) {
                asteroid.destroy();
            } else {
                // add a new trail point (white circle) at the asteroid's current position
                this.asteroidTrails.push({
                    x: asteroid.x,
                    y: asteroid.y,
                    alpha: 1.0   // start fully visible
                });
            }
        });

        // asteroid trails
        this.asteroidTrailGraphics.clear();
        this.asteroidTrails.forEach(trailPoint => {
            this.asteroidTrailGraphics.fillStyle(0xffffff, trailPoint.alpha);
            this.asteroidTrailGraphics.fillCircle(trailPoint.x, trailPoint.y, 4); 
            // fade out
            trailPoint.alpha -= 0.02;
        });
        // remove any fully faded points
        this.asteroidTrails = this.asteroidTrails.filter(p => p.alpha > 0);
    }

    spawnAsteroidLoop() {
        let randomDelay = Phaser.Math.Between(this.spawnDelay / 2, this.spawnDelay);
        this.time.addEvent({
            delay: randomDelay,
            callback: () => {
                this.spawnMultipleAsteroids();
                if (!this.gameOver) {
                    this.spawnAsteroidLoop();
                }
            },
            callbackScope: this
        });
    }

    spawnMultipleAsteroids() {
        let asteroidCount = Phaser.Math.Between(1, 3);
        for (let i = 0; i < asteroidCount; i++) {
            this.spawnAsteroid();
        }
    }

    spawnAsteroid() {
        let randomY = Phaser.Math.Between(125, 430);
        let asteroid = new Obstacle(this, game.config.width, randomY, 'asteroid', 0);
        asteroid.setScale(0.5);
        // faster speed at higher difficulty
        asteroid.moveSpeed = Phaser.Math.Between(2 + this.difficultyLevel, 6 + this.difficultyLevel);
        this.asteroids.add(asteroid);
    }

    increaseDifficulty() {
        this.difficultyLevel++;
        this.spawnDelay = Math.max(200, this.spawnDelay - 200);
        this.backgroundSpeed += 1;
    }

    handleCollision() {
        this.gameOver = true;
        this.sound.play('explosion', { volume: 0.25 });
        this.p1Spaceship.setVelocityY(0);
        this.asteroids.setVelocityX(0);
        this.physics.pause();
        this.timer.paused = true;

        // check for high score
        if (this.timeElapsed > this.highScore) {
            this.highScore = this.timeElapsed;
            localStorage.setItem('highScore', this.highScore);
        }

        let centerX = game.config.width / 2;
        let centerY = game.config.height / 2;
        let redConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FF0000',
            color: '#FFFFFF',
            align: 'center',
            padding: { top: 5, bottom: 5 },
            fixedWidth: 0
        };

        // game over text
        this.add.text(centerX, centerY, 'GAME OVER', redConfig).setOrigin(0.5);

        this.add.text(
            centerX,
            centerY + 70,
            `Score: ${this.timeElapsed}\nHigh Score: ${this.highScore}\nPress [R] to Restart\nPress [B] for Menu`,
            redConfig
        ).setOrigin(0.5);
    }

    updateScore() {
        if (!this.gameOver) {
            this.timeElapsed++;
            this.scoreText.setText(`Score: ${this.timeElapsed}`);
        }
    }
}
