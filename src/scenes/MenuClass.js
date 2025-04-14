import { shopButton, addButton } from "./ButtonClasses.js";
import { Shop } from "./ShopClass.js";

class Menu {
    constructor(gameScene,menuWidth,iconSize,menuConfig){
        const sF = gameScene.scale.width/1920
        const config = gameScene.config
          
        this.buttons = [] //Buttons are double indexed. Meaning the "buttons" list consists of arrays, in which there are 3 buttons. 

        this.menuConfig = menuConfig
        this.active = false;
        this.contentPadding = sF*config.menu.contentPadding
        this.initialOffset = sF*config.menu.initialOffset

        //Inserts the icon background element, and set as inactive
        this.iconBackground = gameScene.add.image(gameScene.scale.width-menuConfig.index*iconSize,0,'inactiveMenuTab').setOrigin(1,0).setDisplaySize(iconSize,iconSize).setInteractive()
        this.toggleActive(false)

        const iconX = this.iconBackground.x-iconSize/2 //Calculates center of the icon background
        const iconY = this.iconBackground.y+iconSize/2
        this.icon = gameScene.add.image(iconX,iconY/1.25,menuConfig.icon).setDisplaySize(iconSize/1.7,iconSize/1.7)

        this.nameText = gameScene.add.text(iconX,iconY+iconSize/2.8,menuConfig.name,{
            fontSize: `${iconSize/6}px`, 
            fill: '#fff', 
            fontFamily: 'KodeMonoRegular',
        }).setOrigin(0.5,0.5)

        //On Hover
        this.iconBackground.on('pointerover',()=>{
            this.iconBackground.setTexture('activeMenuTab')
            gameScene.input.setDefaultCursor('pointer');
        })

        //On hover end
        this.iconBackground.on('pointerout',()=>{
            if (!this.active){
                this.iconBackground.setTexture('inactiveMenuTab')
            }
            gameScene.input.setDefaultCursor('auto');
        })

        //On click release
        this.iconBackground.on('pointerup',()=>{
            if (!this.active){
                this.toggleActive(true)
                gameScene.activeMenu.toggleActive(false)
                gameScene.activeMenu = this
            }
        })
    }

    //Loops through all buttons in the menu, to check and update their lock state.
    checkButtonLockState(){
        this.buttons.forEach(bb =>{
            bb.forEach(b =>{
                if (!b.buttonRequirements()){
                    b.lock(true)
                }else if (b.button.texture.key === b.texture.greyButton){
                    b.lock(false)
                }
            })
        })
    }

    //Toggles if the menu is seen as active, both visually but also in terms of inputs.
    toggleActive(active){
        if (active){
            this.active = true
            this.iconBackground.setTexture('activeMenuTab')

            //Toggles button visibility through built in function
            this.buttons.forEach(bb => {
                bb.forEach(b => {
                    b.toggleButton(true)
                })
            });
        }else{
            this.active = false
            this.iconBackground.setTexture('inactiveMenuTab')
            
            //Toggles button visibility through built in function
            this.buttons.forEach(bb => {
                bb.forEach(b => {
                    b.toggleButton(false)
                })
            });
        }
    }
}

export class shopMenu extends Menu{
    constructor(gameScene,menuWidth,iconSize){
        super(gameScene,menuWidth,iconSize,gameScene.config.menu.menu1)
        const sF = gameScene.scale.width/1920 //Scaling
        const config = gameScene.config

        this.labels = []
        this.buttonHeight = 0; //Gets set when a button is created
        this.labelHeight = 0;
        this.labelPadding = this.menuConfig.labelPadding*sF




        //Initiates the add button to the menu.
        this.addButton = new addButton(gameScene,{
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
            bList.push(new shopButton(gameScene,{
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
            bList.push(new shopButton(gameScene,{
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
            bList.push(new shopButton(gameScene,{
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


        })


        this.toggleActive(true)
    }

    checkButtonLockState(){
        super.checkButtonLockState()
        if(this.addButton){
            console.log(this.addButton.price)
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
            if (this.addButton){
                this.addButton.toggleButton(true)
            }
            if (this.labels){
                this.labels.forEach(label => {
                    label.setVisible(true)
                });
            }
        }else{
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

export class marketingMenu extends Menu{
    constructor(gameScene,menuWidth,iconSize){
        super(gameScene,menuWidth,iconSize,gameScene.config.menu.menu2)


    }
}

export class managerMenu extends Menu{
    constructor(gameScene,menuWidth,iconSize){
        super(gameScene,menuWidth,iconSize,gameScene.config.menu.menu3)


    }
}

export class worldMenu extends Menu{
    constructor(gameScene,menuWidth,iconSize,){
        super(gameScene,menuWidth,iconSize,gameScene.config.menu.menu4)


    }
}