import { Menu } from "./Menu.js"
import { ShopButton } from "../Buttons/ShopButton.js"
import { AddButton } from "../Buttons/AddButton.js"

export class ManagerMenu extends Menu{
    constructor(gameScene,menuWidth,iconSize){
        super(gameScene,menuWidth,iconSize,gameScene.config.menu.managerMenu)

        const sF = gameScene.scale.width/1920 //Scaling
        const config = gameScene.config

        this.managers = []
        this.labelPadding = this.menuConfig.labelPadding*sF


        gameScene.events.on('shopCreated',(shop)=>{


            const x = gameScene.scale.width-menuWidth/2
            const newShopConfig = config.shops[gameScene.shopList.length]
        
            let label = gameScene.add.text(x,this.initialOffset,newShopConfig.name,{
                fontSize: `${sF*this.menuConfig.labelSize}px`, 
                fill: this.menuConfig.labelColor, 
                fontFamily: `KodeMono${this.menuConfig.labelFontWeight}`,
            }).setOrigin(0.5,0.5)

            let labelHeight = label.displayHeight



            let buttonConfig = config.shopConfig.menuButtons.managerUpgrade1
            let speedButton = new ShopButton(gameScene,{
                x:gameScene.scale.width-menuWidth/3*2,
                y:400,
                scale:config.shopConfig.menuButtons.upgradeButtonScale,
                value:buttonConfig.defaultValue,
                valueIncrement:buttonConfig.valueIncrement,
                valueSuffix:buttonConfig.valueSuffix,
                callBack:()=>{
                    shop.managerSpeed += speedButton.valueIncrement
                    return;
                }
            },buttonConfig.icon,shop)



            let buttonHeight = speedButton.button.displayHeight

            let y = (buttonHeight+this.contentPadding)*gameScene.shopList.length+this.initialOffset+(labelHeight+this.labelPadding)*this.managers.length
            label.y = y-(labelHeight+this.labelPadding)

            speedButton.updatePosition(null,y+this.contentPadding)

            buttonConfig = config.shopConfig.menuButtons.managerUpgrade2
            let multiplierButton = new ShopButton(gameScene,{
                x:gameScene.scale.width-menuWidth/3,
                y:y,
                scale:config.shopConfig.menuButtons.upgradeButtonScale,
                value:buttonConfig.defaultValue,
                valueIncrement:buttonConfig.valueIncrement,
                valueSuffix:buttonConfig.valueSuffix,
                callBack:()=>{
                    shop.managerMultiplier += multiplierButton.valueIncrement
                    return;
                }
            },buttonConfig.icon,shop)


            let button = new AddButton(gameScene,{
                x:gameScene.scale.width-menuWidth/2,
                y:y+this.contentPadding,
                scale: 0.5,
                callBack:()=>{
                    shop.toggleManager(true)
                    button.disableButton()
                    this.toggleActive(this.active)
                }
            },`Køb manager`)

            this.managers.push({
                label: label,
                speedButton: speedButton,
                multiplierButton: multiplierButton,
                managerBar: null,
                addManagerButton: button,
            })


            this.toggleActive(this.active)
        })

        this.toggleActive(false)
    }

    checkButtonLockState(){
        super.checkButtonLockState()
        this.managers.forEach((m)=>{
            this.updateButtonLock(m.speedButton)
            this.updateButtonLock(m.multiplierButton)
            this.updateButtonLock(m.addManagerButton)
        })
    }

    updateButtonLock(button){
        if (!button.buttonRequirements()){
            button.lock(true)
        }else if (button.button.texture.key === button.texture.greyButton){
            button.lock(false)
        }
    }

    toggleActive(active){
        super.toggleActive(active)
        if(active){
            this.managers.forEach((m)=>{
                m.label.setVisible(true)
                if (m.addManagerButton.disabled){
                    m.speedButton.toggleButton(true)
                    m.multiplierButton.toggleButton(true)
                }else{
                    m.speedButton.toggleButton(false)
                    m.multiplierButton.toggleButton(false)
                }
                m.addManagerButton.toggleButton(true)

            })


        }else{
            this.managers.forEach((m)=>{
                m.label.setVisible(false)
                m.speedButton.toggleButton(false)
                m.multiplierButton.toggleButton(false)
                m.addManagerButton.toggleButton(false)
                //m.managerBar.toggleActive(false)
            })

        }

    }
    
}
