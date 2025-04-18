import { Button } from "./newButton.js"

export class PrestigeMenuButton extends Button{
    constructor(gameScene,config){
        super(gameScene,config,gameScene.config.texture.prestigeMenuButton)
        const dW = this.button.displayWidth
        this.iconImage = gameScene.add.image(config.x, config.y,'prestigeIcon').setOrigin(0.5,0.5).setDisplaySize(dW*0.7,dW*0.7)
        this.accentOffset *= 2
        this.updatePosition(config.x,config.y)
    }

    onPointerUp(){
        this.gameScene.prestigeMenu.toggleMenu(true)
    }

    resetButtonPosition(){
        super.resetButtonPosition()
        this.iconImage.y = this.y

    }

    updatePosition(x,y){
        super.updatePosition(x,y)
        if (y){
            this.iconImage.y = y
        }
        if (x){
            this.iconImage.x = x
        }
    }

    offsetButtonPosition(){
        super.offsetButtonPosition()
        this.iconImage.y += this.accentOffset
    }
    
    toggleButton(isActive){
        super.toggleButton(isActive)
        this.iconImage.setVisible(isActive)
    }
}