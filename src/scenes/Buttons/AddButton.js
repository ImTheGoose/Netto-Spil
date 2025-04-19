import { Button } from "./Button.js";
import { moneyPopup,PopupType } from "../Utils.js";

export class AddButton extends Button{
    constructor(gameScene, config,title){
        super(gameScene,config,gameScene.config.texture.addButton)

        const sF = gameScene.scale.width/1920*this.scale

        this.sound = gameScene.sound.add("purchaseSound")

        this.priceOffset = sF*30;
        this.titleOffset = sF*20
        
        //Adds the text element to show current value
        this.buttonTitleText = gameScene.add.text(this.x,this.y-this.titleOffset,title,{
            fontSize: `${sF*50}px`, 
            fill: '#fff', 
            fontFamily: 'KodeMonoBold'
        }).setOrigin(0.5,0.5)

        //Creates price element for button.
        this.buttonPriceText = gameScene.add.text(this.x,this.y+this.priceOffset,"loading...",{
            fontSize: `${sF*50}px`, 
            fill: '#fff', 
            fontFamily: 'KodeMonoBold'
        }).setOrigin(0.5,0.5)

        this.updateButtonContents()
    }

    onPointerUp(){
        super.onPointerUp(true)
        const m = this.gameScene.moneyBackground
        if(!this.canUseButton()){
            this.lastPopup = moneyPopup(this.gameScene,m.x+m.displayWidth/2,m.y-m.displayHeight,this.getPrice(),PopupType.NEUTRAL,this.lastPopup)
            return;
        }
        this.lastPopup = moneyPopup(this.gameScene,m.x+m.displayWidth/2,m.y-m.displayHeight,this.getPrice(),PopupType.NEGATIVE,this.lastPopup)
        this.gameScene.money -= this.getPrice()
        this.callBack()
        this.updateButtonContents()
    }

    canUseButton(){
        if (this.gameScene.money < this.getPrice()) { 
            return false; 
        }
        return true;
    }

    getPrice(){
        const priceConfig = this.gameScene.config.priceConfig.shop
        const price = priceConfig.priceConstant * (priceConfig.priceFactor ** this.gameScene.shopList.length)
        return Math.round(price)
        
    }

    updateButtonContents(){
        super.updateButtonContents()
        this.buttonPriceText.text = `${this.getPrice()}kr`
        this.fitText(this.buttonPriceText,this.button.displayWidth)
    }

    //Resets position of button and contents
    resetButtonPosition(){
        super.resetButtonPosition()
        this.buttonPriceText.y = this.y+this.priceOffset
        this.buttonTitleText.y = this.y-this.titleOffset

    }

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

    offsetButtonPosition(){
        super.offsetButtonPosition()
        this.buttonPriceText.y += this.accentOffset
        this.buttonTitleText.y += this.accentOffset
    }

    toggleButton(isActive){
        super.toggleButton(isActive)
        if (this.disabled){ isActive = false }
        this.buttonPriceText.setVisible(isActive)
        this.buttonTitleText.setVisible(isActive)
    }

}