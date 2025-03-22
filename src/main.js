
import { GameScene } from './scenes/GameScene.js';
import { UIScene } from './scenes/UIScene.js';

const config = {
    type: Phaser.WEBGL,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 3840,
    height: 2160,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        GameScene,UIScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            