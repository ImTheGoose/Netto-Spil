import { Button } from "./Button.js"

export class PrestigeMenuButton extends Button{
    constructor(gameScene,config){
        super(gameScene,config,gameScene.config.texture.prestigeMenuButton)
        let dW = this.button.displayWidth
        this.iconImage = gameScene.add.image(config.x, config.y,'prestigeIcon').setOrigin(0.5,0.5).setDisplaySize(dW*0.7,dW*0.7)
        this.accentOffset *= 2
        this.updatePosition(config.x,config.y)
        
        this.callBack = () =>{
            this.gameScene.prestigeMenu.toggleMenu(true)
        }
    }

    //Resets position of button and contents
    resetButtonPosition(){
        super.resetButtonPosition()
        this.iconImage.y = this.y

    }

    //Repositions button and contents
    updatePosition(x,y){
        super.updatePosition(x,y)
        if (y){
            this.iconImage.y = y
        }
        if (x){
            this.iconImage.x = x
        }
    }

    //Offsets position of button and contents
    offsetButtonPosition(){
        super.offsetButtonPosition()
        this.iconImage.y += this.accentOffset
    }
    
    //Toggles visibility of button and contents
    toggleButton(active){
        super.toggleButton(active)
        if (active){
            this.iconImage.setVisible(true)
        }else{
            this.iconImage.setVisible(false)
        }
    }
}