import { Button } from "./Button.js"
import { moneyPopup,PopupType } from "../Utils.js";

export class ShopButton extends Button{
    constructor(gameScene, config,icon,assignedShop){
        super(gameScene,config,gameScene.config.texture.shopButton)
        this.assignedShop = assignedShop
        this.price = this.calculatePrice()
        this.valueSuffix = config.valueSuffix
        const sF = gameScene.scale.width/1920*this.scale

        this.priceOffset = sF*60;
        this.valueOffset = sF*40
        
        //Adds the text element to show current value
        this.buttonValueText = gameScene.add.text(this.x,this.y-this.valueOffset,this.value+this.valueSuffix,{
            fontSize: `${sF*50}px`, 
            fill: '#000', 
            fontFamily: 'KodeMonoBold'
        }).setOrigin(0.5,0.5)

        //Creates icon element
        this.icon = gameScene.add.image(0,this.y-this.valueOffset,icon).setScale(sF/1.4)

        //calculates an offsten from value and icon
        this.xOffset = (this.buttonValueText.displayWidth+this.icon.displayWidth)/3
        this.buttonValueText.x = this.x+this.xOffset
        this.icon.x = this.x-this.xOffset



        //Creates price element for button.
        this.buttonPriceText = gameScene.add.text(this.x,this.y+this.priceOffset,this.price+"Kr",{
            fontSize: `${sF*50}px`, 
            fill: '#000', 
            fontFamily: 'KodeMonoBold'
        }).setOrigin(0.5,0.5)
        this.fitText(this.buttonPriceText, this.button.displayWidth)
    }

    calculatePrice(){
        if (!this.assignedShop){
            return -1;
        }
        let c = this.gameScene.config
        let pC = c.priceConfig

        let growthConstant = pC.incrementConstant * (pC.incrementFactor ** this.assignedShop.shopNum)
        let price = growthConstant*(pC.growthFactor ** this.timesBought)
        price = Math.round(price/10)*10
        return price;
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

    updateText(){
        this.buttonPriceText.text = this.price+"kr"
        this.buttonValueText.text = this.value+this.valueSuffix

        this.xOffset = (this.buttonValueText.displayWidth+this.icon.displayWidth)/3
        this.buttonValueText.x = this.x+this.xOffset
        this.icon.x = this.x-this.xOffset
    }

    //Toggles visibility of button and contents
    toggleButton(active){
        super.toggleButton(active)
        if (active && !this.disabled){
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