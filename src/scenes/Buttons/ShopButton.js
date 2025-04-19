import { Button } from "./Button.js"
import { moneyPopup,PopupType } from "../Utils.js";

export class ShopButton extends Button{
    constructor(gameScene, config,icon,assignedShop){
        super(gameScene,config,gameScene.config.texture.shopButton)
        this.assignedShop = assignedShop
        this.value = config.value
        this.valueIncrement = config.valueIncrement
        this.valueSuffix = config.valueSuffix
        this.timesBought = 0;

        const sF = gameScene.scale.width/1920*this.scale
        this.priceOffset = sF*60;
        this.valueOffset = sF*40

        this.buttonValueText = gameScene.add.text(this.x,this.y-this.valueOffset,"loading...",{
            fontSize: `${sF*50}px`, 
            fill: '#000', 
            fontFamily: 'KodeMonoBold'
        }).setOrigin(0.5,0.5)

        this.icon = gameScene.add.image(0,this.y-this.valueOffset,icon).setScale(sF/1.4)

        this.buttonPriceText = gameScene.add.text(this.x,this.y+this.priceOffset,"loading...",{
            fontSize: `${sF*50}px`, 
            fill: '#000', 
            fontFamily: 'KodeMonoBold'
        }).setOrigin(0.5,0.5)

        this.updateButtonContents()
    }

    destroy(){
        super.destroy()
        this.buttonValueText.destroy()
        this.buttonPriceText.destroy()
        this.icon.destroy()
        this.assignedShop = null
    }

    onPointerUp(){
        super.onPointerUp()
        const m = this.gameScene.moneyBackground
        if(!this.canUseButton()){
            this.lastPopup = moneyPopup(this.gameScene,m.x+m.displayWidth/2,m.y-m.displayHeight,this.getPrice(),PopupType.NEUTRAL,this.lastPopup)
            return;
        }
        this.lastPopup = moneyPopup(this.gameScene,m.x+m.displayWidth/2,m.y-m.displayHeight,this.getPrice(),PopupType.NEGATIVE,this.lastPopup)
        this.gameScene.money -= this.getPrice()
        this.value = Math.round((this.value+this.valueIncrement) * 100) / 100;
        this.timesBought += 1;
        this.updateButtonContents()
    }

    canUseButton(){
        if (this.gameScene.money < this.getPrice()) { 
            return false; 
        }
        return true;
    }

    getPrice(){
        const priceConfig = this.gameScene.config.priceConfig
        const growthConstant = priceConfig.incrementConstant * (priceConfig.incrementFactor ** this.assignedShop.shopNum)
        const price = growthConstant * (priceConfig.growthFactor ** this.timesBought)
        return Math.round(price/10)*10
    }

    updateButtonContents(){
        super.updateButtonContents()
        this.buttonPriceText.text = `${this.getPrice()}kr`
        this.fitText(this.buttonPriceText,this.button.displayWidth)

        this.buttonValueText.text = `${this.value}${this.valueSuffix}`
        this.buttonValueText.x = this.x+this.getXOffset()
        this.icon.x = this.x-this.getXOffset()
    }

    getXOffset(){
        return (this.buttonValueText.displayWidth+this.icon.displayWidth)/3;
    }

    updatePosition(x,y){
        super.updatePosition(x,y)
        if (y){
            this.buttonValueText.y = y-this.valueOffset
            this.icon.y = y-this.valueOffset
            this.buttonPriceText.y = y+this.priceOffset
        }
        if (x){
            this.buttonValueText.x = x+this.getXOffset()
            this.icon.x = x-this.getXOffset()
            this.buttonPriceText.x = x
        }
    }

    resetButtonPosition(){
        super.resetButtonPosition()
        this.buttonPriceText.y = this.y+this.priceOffset
        this.icon.y = this.y-this.valueOffset
        this.buttonValueText.y = this.y-this.valueOffset
    }

    offsetButtonPosition(){
        super.offsetButtonPosition()
        this.buttonPriceText.y += this.accentOffset
        this.icon.y += this.accentOffset
        this.buttonValueText.y += this.accentOffset
    }

    toggleButton(isActive){
        super.toggleButton(isActive)
        if (this.disabled) { isActive = false }
        this.icon.setVisible(isActive)
        this.buttonPriceText.setVisible(isActive)
        this.buttonValueText.setVisible(isActive)
        }
}