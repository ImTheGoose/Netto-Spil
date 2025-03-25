export class BootScene extends Phaser.Scene {
    constructor(){
        super({ key: "BootScene", active: true })

    }

    preload(){
        fetch('src/config.yaml')
        .then(response => response.text())
        .then(yamlText => {
            const parsedData = jsyaml.load(yamlText)
            this.cache.json.add('config', parsedData)
            console.log('Config successfully loaded: ',parsedData)

            this.scene.start('GameScene')
            this.scene.start('UIScene')
        })
        .catch(error =>{
            console.error("Error while loading config: ",error)
        })
    }
}
