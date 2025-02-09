//src/prefabs/Obstacle.js

class Obstacle extends Phaser.Physics.Arcade.Sprite  {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setSize(this.width * 0.8, this.height * 0.8);

        this.moveSpeed = 3

        this.play('roll'); // play animation
    }


    update() {
        // asteroids move left
        this.x -= this.moveSpeed

        // reset asteroids when off screen and randomize position
        if(this.x <= 0 - this.width) {
            this.resetPosition()
        }
    }

    resetPosition() {
        this.x = game.config.width // respawn on right
        this.y = Phaser.Math.Between(125, 430)
    }
}