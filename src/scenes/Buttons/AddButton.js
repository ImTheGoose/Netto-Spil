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
        this.buttonPriceText = gameScene.add.text(this.x,this.y+this.priceOffset,this.price+"Kr",{
            fontSize: `${sF*50}px`, 
            fill: '#fff', 
            fontFamily: 'KodeMonoBold'
        }).setOrigin(0.5,0.5)
        this.fitText(this.buttonPriceText, this.button.displayWidth)
    }


    calculatePrice(){
        let c = this.gameScene.config
        let pC = c.priceConfig.shop

        let price = pC.priceConstant * (pC.priceFactor ** this.gameScene.shopList.length)
        price = Math.round(price)

        return price;
    }

    updateText(){
        this.buttonPriceText.text = this.price+"kr"
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
        if (active && !this.disabled){
            this.buttonPriceText.setVisible(true)
            this.buttonTitleText.setVisible(true)
        }else{
            this.buttonPriceText.setVisible(false)
            this.buttonTitleText.setVisible(false)
        }
    }
}