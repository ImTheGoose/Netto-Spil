import { Menu } from "./Menu.js"
import { AddButton } from "../Buttons/AddButton.js"
import { ShopButton } from "../Buttons/ShopButton.js"
import { Shop } from "../ShopClass.js"

export class ShopMenu extends Menu{
    constructor(gameScene,menuWidth,iconSize){
        super(gameScene,menuWidth,iconSize,gameScene.config.menu.upgradeMenu)
        const sF = gameScene.scale.width/1920 //Scaling
        const config = gameScene.config

        this.buttons = [] //Buttons are double indexed. Meaning the "buttons" list consists of arrays, in which there are 3 buttons. 
        this.labels = []
        this.buttonHeight = 0; //Gets set when a button is created
        this.labelHeight = 0;
        this.labelPadding = this.menuConfig.labelPadding*sF




        //Initiates the add button to the menu.
        this.addButton = new AddButton(gameScene,{
            x:gameScene.scale.width-menuWidth/2,
            y:150*(1+gameScene.shopList.length)+this.contentPadding,
            scale: 0.5,
            callBack: ()=> { //Logic for creating a new shop, and updating the add button
                let defaultShop = config.shopConfig
                let newShop = config.shops[gameScene.shopList.length]
                gameScene.shopList.push(new Shop(gameScene,
                    newShop.x*sF,
                    newShop.y*sF,
                    defaultShop.size,
                    defaultShop.texture,
                    gameScene.shopList.length+1))

                if (config.shops.length <= gameScene.shopList.length){
                    this.addButton.toggleButton(false)
                    this.addButton = null
                }
             }
        },'Køb ny butik')

        //Creates buttons for the newly made shop.
        gameScene.events.on('shopCreated', (shop)=>{
            let bList = [] //Temporay list of buttons
            const x = gameScene.scale.width-menuWidth/2
            const offset = (menuWidth-50*sF)/3 //Offset on x axis, to make sure they are evenly spaced.
            const newShopConfig = config.shops[gameScene.shopList.length]

            let label = gameScene.add.text(x,this.initialOffset,newShopConfig.name,{
                fontSize: `${sF*this.menuConfig.labelSize}px`, 
                fill: this.menuConfig.labelColor, 
                fontFamily: `KodeMono${this.menuConfig.labelFontWeight}`,
            }).setOrigin(0.5,0.5)

            this.labelHeight = label.displayHeight
            let upDef = config.shopConfig.menuButtons.upgrade1
            bList.push(new ShopButton(gameScene,{
                x: x-offset,
                y: 0,
                value: upDef.defaultValue,
                scale: config.shopConfig.menuButtons.upgradeButtonScale,
                valueIncrement: upDef.valueIncrement,
                valueSuffix: upDef.valueSuffix,
                callBack: () => { 
                    shop.amountOfPeople += bList[0].valueIncrement
                 }
            },upDef.icon,shop))

            //updates the buttonheight variable, in case its the first button created. Then fixes the position for the button and the following buttons.
            this.buttonHeight = bList[0].button.displayHeight+bList[0].accentOffset

            let y = (this.buttonHeight+this.contentPadding)*gameScene.shopList.length+this.initialOffset+(this.labelHeight+this.labelPadding)*this.labels.length
            label.y = y-(this.labelHeight+this.labelPadding)
            this.labels.push(label)
            
            bList[0].updatePosition(null,y)
            
            upDef = config.shopConfig.menuButtons.upgrade2
            bList.push(new ShopButton(gameScene,{
                x: x,
                y: y,
                value: upDef.defaultValue,
                scale: config.shopConfig.menuButtons.upgradeButtonScale,
                valueIncrement: upDef.valueIncrement,
                valueSuffix: upDef.valueSuffix,
                callBack: () => { 
                    shop.cashierSpeed += bList[1].valueIncrement
                 }
            },upDef.icon,shop))
            
            upDef = config.shopConfig.menuButtons.upgrade3
            bList.push(new ShopButton(gameScene,{
                x: x+offset,
                y: y,
                value: upDef.defaultValue,
                scale: config.shopConfig.menuButtons.upgradeButtonScale,
                valueIncrement: upDef.valueIncrement,
                valueSuffix: upDef.valueSuffix,
                callBack: () => { 
                    shop.pricePerPerson += bList[2].valueIncrement
                 }
            },upDef.icon,shop))

            this.buttons.push(bList)

            this.fixEndItemPositions(y+this.contentPadding+bList[0].button.displayHeight)

            if(!this.active){
                this.toggleActive(false)
            }


        })


        this.toggleActive(true)
    }

    checkButtonLockState(){
        super.checkButtonLockState()
        this.buttons.forEach(bb =>{
            bb.forEach(b =>{
                if (!b.buttonRequirements()){
                    b.lock(true)
                }else if (b.button.texture.key === b.texture.greyButton){
                    b.lock(false)
                }
            })
        })
        if(this.addButton){
            if (!this.addButton.buttonRequirements()){
                this.addButton.lock(true)
            }else if (this.addButton.button.texture.key === this.addButton.texture.greyButton){
                this.addButton.lock(false)
            }
        }
    }

    toggleActive(active){
        super.toggleActive(active)
        if (active){
            //Toggles button visibility through built in function
            this.buttons.forEach(bb => {
                bb.forEach(b => {
                    if(b){
                        b.toggleButton(true)
                    }
                })
            });
            if (this.addButton){
                this.addButton.toggleButton(true)
            }
            if (this.labels){
                this.labels.forEach(label => {
                    label.setVisible(true)
                });
            }
        }else{
            //Toggles button visibility through built in function
            this.buttons.forEach(bb => {
                bb.forEach(b => {
                    if (b){
                        b.toggleButton(false)
                    }
                })
            });
            if (this.addButton){
                this.addButton.toggleButton(false)
            }
            if (this.labels){
                this.labels.forEach(label => {
                    label.setVisible(false)
                });
            }
        }
    }

    fixEndItemPositions(y) {
        this.addButton.updatePosition(null,y)
    }

}