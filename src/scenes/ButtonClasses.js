export class Button{
    constructor(gameScene,config,texture){
        //Loads Data
        this.gameScene = gameScene;
        this.defaultConfig = config;
        this.x = config.x
        this.y = config.y
        this.texture = texture;
        this.price = config.price
        this.value = config.value
        this.priceIncrement = config.priceIncrement
        this.valueIncrement = config.valueIncrement
        this.callBack = config.callBack
        this.scale = config.scale

        //Makes shorthands and quick adjustments
        const sX = gameScene.scale.width/1920*this.scale
        const sY = gameScene.scale.height/1080*this.scale
        const x = this.x
        const y = this.y
        this.accentOffset = sY*15;
        this.fitTextPadding = sX*20

        //adds accent piece to button
        this.accentButton = gameScene.add.image(x,y+this.accentOffset,this.texture.button)
        this.accentButton.setScale(sX*0.95)
        this.accentButton.setAlpha(0.7)

        //Button creation and formatting
        this.button = gameScene.add.image(x,y,this.texture.button).setInteractive()
        this.button.setScale(sX*0.95)

        //Following are pointer events
        //On Hover
        this.button.on('pointerover', () => {
            if (this.gameScene.money >= this.price){
                this.button.setTint(0xb4b4b4)
                this.accentButton.setTint(0xb4b4b4)
                gameScene.input.setDefaultCursor('pointer');
            }
            

        } )
        //On Hover Leave
        this.button.on('pointerout',() => {
            this.button.clearTint()
            this.accentButton.clearTint()
            gameScene.input.setDefaultCursor('auto');
        })
        //On button press
        this.button.on('pointerdown', () => {
            this.button.setTint(0x767676)
            this.accentButton.setTint(0x767676)
            this.offsetButtonPosition();
        })
        //On button release
        this.button.on('pointerup', () => {
            if (this.buttonRequirements()){
                console.log("button clicked")
                this.gameScene.money -= this.price;
                this.callBack();
                this.button.setTint(0xb4b4b4)
            }else{
                console.log("ikke nok penge")
            }
            this.resetButtonPosition()
        })
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
        if (active){
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

export class shopButton extends Button{
    constructor(gameScene, config,icon){
        super(gameScene,config,gameScene.texture.shopButton)
        const sX = gameScene.scale.width/1920*this.scale
        const sY = gameScene.scale.height/1080*this.scale
        const x = this.x
        const y = this.y

        this.priceOffset = sY*60;
        this.valueOffset = sY*40
        
        //Adds the text element to show current value
        this.buttonValueText = gameScene.add.text(x,y-this.valueOffset,this.value,{
            fontSize: `${sX*50}px`, 
            fill: '#000', 
            fontFamily: 'KodeMonoBold'
        }).setOrigin(0.5,0.5)

        //calculates an offsten from value and icon
        this.xOffset = this.buttonValueText.displayWidth/3
        this.buttonValueText.x = x+this.xOffset

        //Creates icon element
        this.icon = gameScene.add.image(x-this.xOffset*2,y-this.valueOffset,icon).setScale(sX/1.4)

        //Creates price element for button.
        this.buttonPriceText = gameScene.add.text(x,y+this.priceOffset,this.price+"Kr",{
            fontSize: `${sX*50}px`, 
            fill: '#000', 
            fontFamily: 'KodeMonoBold'
        }).setOrigin(0.5,0.5)
        this.fitText(this.buttonPriceText, this.button.displayWidth)
    }

    //Resets position of button and contents
    resetButtonPosition(){
        super.resetButtonPosition()
        this.buttonPriceText.y = this.y+this.priceOffset
        this.icon.y = this.y-this.valueOffset
        this.buttonValueText.y = this.y-this.valueOffset

    }

    //Repositions button and contents
    updatePosition(x,y){
        super.updatePosition(x,y)
        if (y){
            this.buttonValueText.y = y-this.valueOffset
            this.icon.y = y-this.valueOffset
            this.buttonPriceText.y = y+this.priceOffset
        }
        if (x){
            this.buttonValueText.x = x+this.xOffset
            this.icon.x = x-this.xOffset*2
            this.buttonPriceText.x = x
        }
    }

    //Offsets position of button and contents
    offsetButtonPosition(){
        super.offsetButtonPosition()
        this.buttonPriceText.y += this.accentOffset
        this.icon.y += this.accentOffset
        this.buttonValueText.y += this.accentOffset
    }

    //Toggles visibility of button and contents
    toggleButton(active){
        super.toggleButton(active)
        if (active){
            this.icon.setVisible(true)
            this.buttonPriceText.setVisible(true)
            this.buttonValueText.setVisible(true)
        }else{
            this.icon.setVisible(false)
            this.buttonPriceText.setVisible(false)
            this.buttonValueText.setVisible(false)
        }
    }
}

export class addButton extends Button{
    constructor(gameScene, config,title){
        super(gameScene,config,gameScene.texture.addButton)
        const sX = gameScene.scale.width/1920*this.scale
        const sY = gameScene.scale.height/1080*this.scale
        const x = this.x
        const y = this.y

        this.priceOffset = sY*30;
        this.titleOffset = sY*20
        
        //Adds the text element to show current value
        this.buttonTitleText = gameScene.add.text(x,y-this.titleOffset,title,{
            fontSize: `${sX*50}px`, 
            fill: '#fff', 
            fontFamily: 'KodeMonoBold'
        }).setOrigin(0.5,0.5)

        //Creates price element for button.
        this.buttonPriceText = gameScene.add.text(x,y+this.priceOffset,this.price+"Kr",{
            fontSize: `${sX*50}px`, 
            fill: '#fff', 
            fontFamily: 'KodeMonoBold'
        }).setOrigin(0.5,0.5)
        this.fitText(this.buttonPriceText, this.button.displayWidth)
    }

    //Resets position of button and contents
    resetButtonPosition(){
        super.resetButtonPosition()
        this.buttonPriceText.y = this.y+this.priceOffset
        this.buttonTitleText.y = this.y-this.titleOffset

    }

    //Repositions button and contents
    updatePosition(x,y){
        super.updatePosition(x,y)
        if (y){
            this.buttonTitleText.y = y-this.titleOffset
            this.buttonPriceText.y = y+this.priceOffset
        }
        if (x){
            this.buttonTitleText.x = x
            this.buttonPriceText.x = x
        }
    }

    //Offsets position of button and contents
    offsetButtonPosition(){
        super.offsetButtonPosition()
        this.buttonPriceText.y += this.accentOffset
        this.buttonTitleText.y += this.accentOffset
    }

    //Toggles visibility of button and contents
    toggleButton(active){
        super.toggleButton(active)
        if (active){
            this.buttonPriceText.setVisible(true)
            this.buttonTitleText.setVisible(true)
        }else{
            this.buttonPriceText.setVisible(false)
            this.buttonTitleText.setVisible(false)
        }
    }
}