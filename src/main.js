
import { GameScene } from './scenes/GameScene.js';
import { BootScene } from './scenes/bootScene.js';


const config = {
    type: Phaser.WEBGL,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 1920,
    height: 1080,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        BootScene,GameScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
}

new Phaser.Game(config);
            