//src/prefabs/Obstacle.js

class Obstacle extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.moveSpeed = 3
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