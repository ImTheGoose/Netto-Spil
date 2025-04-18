import { moneyPopup,PopupType } from "../Utils.js";

export class Button{
    constructor(gameScene,config,texture){
        //Loads Data
        this.gameScene = gameScene;
        this.defaultConfig = config;
        this.x = config.x
        this.y = config.y
        this.texture = texture;
        this.timesBought = 0
        this.price = this.calculatePrice()
        this.value = config.value
        this.valueIncrement = config.valueIncrement
        this.callBack = config.callBack
        this.scale = config.scale
        this.disabled = false;
        this.pressed = false;

        this.sound = gameScene.sound.add("clickSound")
        this.denySound = gameScene.sound.add("denySound")

        //Makes shorthands and quick adjustments
        const sF = gameScene.scale.width/1920*this.scale

        this.accentOffset = sF*15;
        this.fitTextPadding = sF*20

        //adds accent piece to button
        this.accentButton = gameScene.add.image(this.x,this.y+this.accentOffset,this.texture.button)
        this.accentButton.setScale(sF*0.95)
        this.accentButton.setAlpha(0.7)

        //Button creation and formatting
        this.button = gameScene.add.image(this.x,this.y,this.texture.button).setInteractive()
        this.button.setScale(sF*0.95)

        //Following are pointer events
        //On Hover
        this.button.on('pointerover', () => {
            if (this.gameScene.money >= this.price){
                this.button.setTint(0xb4b4b4)
                this.accentButton.setTint(0xb4b4b4)
                gameScene.input.setDefaultCursor('pointer');
            }
            console.log(this.price)
        } )

        //On Hover Leave
        this.button.on('pointerout',() => {
            this.button.clearTint()
            this.accentButton.clearTint()
            gameScene.input.setDefaultCursor('auto');
        })

        //On button press
        this.button.on('pointerdown', () => {
            this.pressed = true
            this.button.setTint(0x767676)
            this.accentButton.setTint(0x767676)
            this.offsetButtonPosition();
            this.playSound()
        })

        //On button release
        this.gameScene.input.on('pointerup', () => {
            if (!this.pressed) { return; }
            this.pressed = false
            let m = this.gameScene.moneyBackground

            if (this.buttonRequirements()){
                console.log("button clicked")
                let paid = this.price;
                this.gameScene.money -= paid;
                this.timesBought += 1
                this.price = this.calculatePrice()
                
                this.value = Math.round((this.value+this.valueIncrement) * 100) / 100;
                this.updateText()
                this.callBack();
                this.button.setTint(0xb4b4b4)
                this.lastPopup = moneyPopup(this.gameScene,m.x+m.displayWidth/2,m.y-m.displayHeight,paid,PopupType.NEGATIVE,this.lastPopup)
            }else{
                console.log("ikke nok penge")
                this.lastPopup = moneyPopup(this.gameScene,m.x+m.displayWidth/2,m.y-m.displayHeight,this.price,PopupType.NEUTRAL,this.lastPopup)
            }
            this.resetButtonPosition()
        })
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

    calculatePrice(){
        return 0;
    }

    updateText(){
        return;
    }

    //Default requirement for button press.
    buttonRequirements(){
        if (this.gameScene.money >= this.price){
            return true;
        }
        return false;
    }

    //Toggles visual lock state
    lock(locked){
        if (locked){
            this.button.setTexture(this.texture.greyButton)
            this.accentButton.setTexture(this.texture.greyButton)
            this.button.clearTint()
            this.accentButton.clearTint()
        }else{
            this.button.setTexture(this.texture.button)
            this.accentButton.setTexture(this.texture.button)
        }
    }

    //Reset position of button element
    resetButtonPosition(){
        this.button.y = this.y
    }

    //Adds offset to button element
    offsetButtonPosition(){
        this.button.y += this.accentOffset
    }

    //Function for making text fit withing a area
    fitText(textObject, maxWidth){
        while (textObject.displayWidth > maxWidth-this.fitTextPadding) {
            let currentSize = parseInt(textObject.style.fontSize, 10);
            textObject.setFontSize(currentSize - 1);
        }
    }

    //Function to update position of button.
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