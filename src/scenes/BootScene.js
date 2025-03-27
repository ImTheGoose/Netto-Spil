export class BootScene extends Phaser.Scene {
    constructor(){
        super({ key: "BootScene", active: true })

    }

    preload(){
        //Loads yaml config file, and converts it into a Js Object
        fetch('src/config.yaml')
        .then(response => response.text())
        .then(yamlText => {
            const parsedData = jsyaml.load(yamlText)
            this.cache.json.add('config', parsedData)
            console.log('Config successfully loaded: ',parsedData)

            //Starts scenes afterwards to ensure config has loaded.
            this.scene.start('GameScene')
            this.scene.start('UIScene')
            console.log('Resolution:',this.scale.width, this.scale.height)
        })
        .catch(error =>{
            console.error("Error while loading config: ",error)
        })
    }
}
