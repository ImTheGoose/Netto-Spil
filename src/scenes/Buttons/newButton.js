import { moneyPopup,PopupType } from "../Utils.js";

export class Button{
    constructor(gameScene,config,texture){
        this.gameScene = gameScene;
        this.defaultConfig = config;
        this.x = config.x
        this.y = config.y
        this.texture = texture;
        this.callBack = config.callBack
        this.scale = config.scale
        this.disabled = false;
        this.pressed = false;

        this.sound = gameScene.sound.add("clickSound")
        this.denySound = gameScene.sound.add("denySound")

        const sF = gameScene.scale.width/1920*this.scale

        this.accentOffset = sF*15;
        this.fitTextPadding = sF*20

        this.accentButton = gameScene.add.image(this.x,this.y+this.accentOffset,this.texture.button).setScale(sF*0.95).setAlpha(0.7)
        this.button = gameScene.add.image(this.x,this.y,this.texture.button).setInteractive().setScale(sF*0.95)

        //Input events
        this.button.on('pointerover', () => { this.onHover() })
        this.button.on('pointerout',() => { this.onHoverLeave() })
        this.button.on('pointerdown', () => { this.onPointerDown() })
        this.gameScene.input.on('pointerup', () => { 
            if (this.pressed) { 
                this.pressed = false
                this.onPointerUp()  
            }
        })
    }

    onHover(){
        if (this.gameScene.money >= this.price){
            this.button.setTint(0xb4b4b4)
            this.accentButton.setTint(0xb4b4b4)
            gameScene.input.setDefaultCursor('pointer');
        }
    }

    onHoverLeave(){
        this.button.clearTint()
        this.accentButton.clearTint()
        gameScene.input.setDefaultCursor('auto');
    }


    onPointerDown(){
        this.pressed = true
        this.button.setTint(0x767676)
        this.accentButton.setTint(0x767676)
        this.offsetButtonPosition();
        this.playSound()
    }

    onPointerUp(){
        this.resetButtonPosition()
        this.button.setTint(0xb4b4b4)
    }

    setDepth(depth){
        this.button.setDepth(depth)
        this.accentButton.setDepth(depth)
    }

    disableButton(){
        this.disabled = true;
        this.toggleButton(this.button.visible)
    }

    enableButton(){
        this.disabled = false
        this.toggleButton(this.button.visible)
    }

    playSound(){
        if (this.buttonRequirements()){
            this.sound.play({volume:8})
        }else{
            this.denySound.play({volume:1.5})
        }
    }

    //Default requirement for button press.
    canUseButton(){
        return true;
    }

    //Toggles visual lock state
    locked(isLocked){
        if (isLocked){
            this.button.setTexture(this.texture.greyButton)
            this.accentButton.setTexture(this.texture.greyButton)
            this.button.clearTint()
            this.accentButton.clearTint()
        }else{
            this.button.setTexture(this.texture.button)
            this.accentButton.setTexture(this.texture.button)
        }
    }

    resetButtonPosition(){
        this.button.y = this.y
    }

    offsetButtonPosition(){
        this.button.y += this.accentOffset
    }


    fitText(textObject, maxWidth){
        while (textObject.displayWidth > maxWidth-this.fitTextPadding) { //Decreases text size until displayWidth is within max width.
            let currentSize = parseInt(textObject.style.fontSize, 10);
            textObject.setFontSize(currentSize - 1);
        }
    }

    updatePosition(x,y){
        if (y){
            this.accentButton.y = y+this.accentOffset
            this.button.y = y
            this.y = y
        }

        if (x){
            this.accentButton.x = x
            this.button.x = x
            this.x = x
        }
    }

    //Toggle visibility of button
    toggleButton(active){
        if (active && !this.disabled){
            this.button.setVisible(true)
            this.button.setInteractive()
            this.accentButton.setVisible(true)
        }else{
            this.button.setVisible(false)
            this.button.removeInteractive()
            this.accentButton.setVisible(false)
        }

    }
}