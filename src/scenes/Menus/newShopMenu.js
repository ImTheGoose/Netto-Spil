import { Menu } from "./newMenu.js";
import { AddButton } from "../Buttons/newAddButton.js";
import { ShopButton } from "../Buttons/newShopButton.js";
import { Shop } from "../ShopClass.js";

export class ShopMenu extends Menu{
    constructor(gameScene,iconSize){
        super(gameScene,iconSize,gameScene.config.menu.upgradeMenu)
        const sF = gameScene.scale.width/1920
        this.shops = []

        this.addButton = new AddButton(gameScene,{
            x:0,
            y:0,
            scale:0.5,
            callBack: () => { 
                let defaultShop = this.gameScene.config.shopConfig
                let newShop = this.gameScene.config.shops[gameScene.shopList.length]

                gameScene.shopList.push(new Shop(gameScene,
                    newShop.x*sF,
                    newShop.y*sF,
                    defaultShop.size,
                    defaultShop.texture,
                    gameScene.shopList.length))
                
                this.updateScroll(0)
                if (this.gameScene.config.shops.length <= this.gameScene.shopList.length){
                    this.addButton.toggleButton(false)
                    this.addButton = null
                }
             }
        },"Køb ny Butik")

        gameScene.events.on("shopCreated", (shop) =>{
            this.shops.push(this.addShopUpgrades(shop))
            this.updateContentPosition()
        })



        this.toggleActive(true)
    }


    getContentHeight(){
        if (!this.shops[0]) { return 0; }
        let contentHeight = this.shops[0].label.displayHeight+this.shops[0].button2.button.displayHeight+this.contentPadding+this.labelPadding
        contentHeight *= this.shops.length
        if (this.addButton) {
            contentHeight += this.addButton.button.displayHeight
        }

        return contentHeight;
    }

    addShopUpgrades(shop){
        const sF = this.gameScene.scale.width/1920
        const config = this.gameScene.config

        const label = this.gameScene.add.text(0,0,config.shops[shop.shopNum].name,{
            fontSize: `${sF*this.menuConfig.labelSize}px`, 
            fill: this.menuConfig.labelColor, 
            fontFamily: `KodeMono${this.menuConfig.labelFontWeight}`,
        }).setOrigin(0.5,0)


        const button1 = this.createShopButton(
            config.shopConfig.menuButtons.upgrade1,
            shop,
            () =>{
                shop.amountOfPeople += button1.valueIncrement
            }
        )

        const button2 = this.createShopButton(
            config.shopConfig.menuButtons.upgrade2,
            shop,
            () =>{
                shop.cashierSpeed += button2.valueIncrement
            }
        )

        const button3 = this.createShopButton(
            config.shopConfig.menuButtons.upgrade3,
            shop,
            () =>{
                shop.pricePerPerson += button3.valueIncrement
            }
        )

        return {
            label: label,
            button1: button1,
            button2: button2,
            button3: button3
        }
        
    }

    createShopButton(config,shop,callBack){
        const button = new ShopButton(this.gameScene,{
            x:0,
            y:0,
            value: config.defaultValue,
            valueIncrement: config.valueIncrement,
            valueSuffix: config.valueSuffix,
            scale: this.gameScene.config.shopConfig.menuButtons.upgradeButtonScale,
            callBack: callBack
        },config.icon,shop)
        console.log(button.scale)
        return button;
    }

    updateContentPosition(){
        if (!this.active) {return}
        const heightPerShop = this.shops[0].label.displayHeight+this.shops[0].button2.button.displayHeight+this.contentPadding+this.labelPadding
        const menuWidth = this.iconSize*4
        const x = this.gameScene.scale.width-menuWidth/2
        
        for (let i = 0; i < this.shops.length; i++){
            const s = this.shops[i]

            const y = (heightPerShop * i)+this.scroll
            const bY = y+s.label.displayHeight+this.labelPadding


            const xOffset = menuWidth/3.2
            s.label.y = y
            s.label.x = x
            s.button1.updatePosition(x-xOffset,bY)
            s.button2.updatePosition(x,bY)
            s.button3.updatePosition(x+xOffset,bY)
        }
        if(this.addButton){
            const y = heightPerShop*this.shops.length+this.scroll
            this.addButton.updatePosition(x,y)
        }
    }

    updateContents(){
        if (this.addButton){
            this.addButton.updateButtonContents()
        }
        this.shops.forEach((s)=>{
            s.button1.updateButtonContents()
            s.button2.updateButtonContents()
            s.button3.updateButtonContents()
        })
    }

    toggleActive(isActive){
        super.toggleActive(isActive)
        if (this.addButton) {
            this.addButton.toggleButton(isActive)
        }
        this.shops.forEach((s)=>{
            s.label.setVisible(isActive)
            s.button1.toggleButton(isActive)
            s.button2.toggleButton(isActive)
            s.button3.toggleButton(isActive)
        })
    }
}
