import { Menu } from "./newMenu.js";
import { ShopButton } from "../Buttons/newShopButton.js";
import { AddButton } from "../Buttons/newAddButton.js";

export class ManagerMenu extends Menu {
    constructor(gameScene,iconSize){
        super(gameScene,iconSize,gameScene.config.menu.managerMenu)

        this.managers = []
        
        gameScene.events.on("shopCreated", (shop) =>{
            this.managers.push(this.addManagerUpgrades(shop))
            this.updateContentPosition()
            this.toggleActive(this.active)
        })

        this.toggleActive(false)
    }

    addManagerUpgrades(shop){
        const sF = this.gameScene.scale.width/1920
        const config = this.gameScene.config

        const label = this.gameScene.add.text(0,0,config.shops[shop.shopNum].name,{
            fontSize: `${sF*this.menuConfig.labelSize}px`, 
            fill: this.menuConfig.labelColor, 
            fontFamily: `KodeMono${this.menuConfig.labelFontWeight}`,
        }).setOrigin(0.5,0)

        const button1 = this.createShopButton(
            config.shopConfig.menuButtons.managerUpgrade1,
            shop,
            () =>{ 
                shop.managerSpeed += button1.valueIncrement
            }
        )

        const button2 = this.createShopButton(
            config.shopConfig.menuButtons.managerUpgrade2,
            shop,
            () =>{ 
                shop.managerMultiplier += button2.valueIncrement
            }
        )

        const button3 = new AddButton(this.gameScene,{
            x:0,
            y:0,
            scale: config.shopConfig.menuButtons.upgradeButtonScale,
            callBack: () => {
                shop.toggleManager(true)
                button3.disableButton()
                this.toggleActive(this.active)
            }
        },"Køb manager")

        return {
            label: label,
            button1: button1,
            button2: button2,
            addButton: button3
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



    getContentHeight(){
        const heightPerManager = this.managers[0].label.displayHeight+this.managers[0].button2.button.displayHeight+this.contentPadding+this.labelPadding
        let contentHeigt = heightPerManager * this.managers.length
        return contentHeigt;
    }

    updateContentPosition(){
        //if (!this.active) { return }
        const x = this.gameScene.scale.width-this.iconSize*2
        const heightPerManager = this.managers[0].label.displayHeight+this.managers[0].button2.button.displayHeight+this.contentPadding+this.labelPadding

        for (let i = 0; i < this.managers.length; i++){
            const m = this.managers[i]

            const y = (heightPerManager * i) + this.scroll
            const by = y + m.label.displayHeight + this.labelPadding

            m.label.x = x
            m.label.y = y

            const xOffset = this.iconSize/1.5

            m.button1.updatePosition(x-xOffset,by)
            m.button2.updatePosition(x+xOffset,by)
            m.addButton.updatePosition(x,by)

        }
    }

    updateContents(){
        this.managers.forEach((m) =>{
            m.button1.updateButtonContents()
            m.button2.updateButtonContents()
            m.addButton.updateButtonContents()
        })
    }

    toggleActive(isActive){
        super.toggleActive(isActive)
        if(isActive){
            this.managers.forEach((m)=>{
                m.label.setVisible(true)
                if (m.addButton.disabled){
                    m.button1.toggleButton(true)
                    m.button2.toggleButton(true)
                }else{
                    m.button1.toggleButton(false)
                    m.button2.toggleButton(false)
                }
                m.addButton.toggleButton(true)
            })
        }else{
            this.managers.forEach((m)=>{
                m.label.setVisible(false)
                m.button1.toggleButton(false)
                m.button2.toggleButton(false)
                m.addButton.toggleButton(false)
            })
        }

    }
}