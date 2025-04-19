import { Button } from "./newButton.js"

export class PrestigeButton extends Button{
    constructor(gameScene,config){
        super(gameScene,config,gameScene.config.texture.prestigeButton)

        const sF = gameScene.scale.width/1920

        this.title = gameScene.add.text(this.x,this.y,"Restart",{
            fontSize: `${40*sF}px`,
            fill: '#fff',
            fontFamily: 'KodeMonoSemiBold'
        }).setOrigin(0.5,0.5)
        
    }

    toggleButton(isActive){
        super.toggleButton(isActive)
        this.title.setVisible(isActive)
    }

    resetButtonPosition(){
        super.resetButtonPosition()
        this.title.y = this.y
    }

    offsetButtonPosition(){
        super.offsetButtonPosition()
        this.title.y += this.accentOffset
    }

    setDepth(depth){
        super.setDepth(depth)
        this.title.setDepth(depth)
    }

    canUseButton(){
        return this.gameScene.prestigeMenu.canPrestige();
    }

    onPointerUp(){
        super.onPointerUp()
        if(this.canUseButton()){ this.gameScene.prestigeMenu.completePrestige() }
    }
}