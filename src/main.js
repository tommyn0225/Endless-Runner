//src/main.js
/*
Tommy Nguyen
Space Runner
~10 hours

creative tilt justification:
technical: Creating the random obstacle spawner was pretty tough. Making sure the rocks spawned
in random Y coordinates of varying speeds and at various times while still keeping the game
playable was a challenge. Balancing the obstacles while also making the game unpredictable
and get increasingly more challenging took a lot of trial and error. I also added a high score feature.

visual style: asteroids have trailing effects which took a lot of research and adds a bit of
visual flair


CREDITS
bgm: https://www.youtube.com/watch?v=ziFxpjRbfJc
sfx from: https://mixkit.co/free-sound-effects/game/
all art made with: https://www.pixilart.com/draw


*/
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
  };

let game = new Phaser.Game(config)

// keyboard bindings
let keySPACE, keyRESET

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3