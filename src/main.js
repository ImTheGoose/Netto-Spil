
import { GameScene } from './scenes/GameScene.js';
import { UIScene } from './scenes/UIScene.js';

const config = {
    type: Phaser.AUTO,
    title: 'Netto Game',
    description: '',
    parent: 'game-container',
    width: 1920,
    height: 1090,
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
            