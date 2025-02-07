//src/main.js
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
    /*physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }*/
  };

let game = new Phaser.Game(config)

// Define global variables
let keySPACE, keyLEFTCLICK, keyRESET;

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3