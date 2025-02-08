//src/prefabs/Spaceship.js
class Spaceship extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // sdd object to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}

export default Spaceship;