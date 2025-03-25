import { shopButton, addButton } from "./ButtonClasses.js";

class Menu {
    constructor(gameScene,menuWidth,iconSize,index,iconTexture,name){

        const sX = gameScene.scale.width/1920
        const sY = gameScene.scale.height/1080
        this.buttons = [] //Buttons are double indexed. Meaning the "buttons" list consists of arrays, in which there are 3 buttons. 

        this.active = false;
        this.contentPadding = sY*50
        this.initialOffset = sY*75
        this.buttonHeight = 0;

        this.menuContainer = gameScene.add.container(gameScene.scale.width-menuWidth,iconSize);
        
        this.iconBackground = gameScene.add.image(gameScene.scale.width-index*iconSize,0,'inactiveMenuTab').setOrigin(1,0).setDisplaySize(iconSize,iconSize).setInteractive()
        this.toggleActive(false)

        const iconX = this.iconBackground.x-iconSize/2
        const iconY = this.iconBackground.y+iconSize/2
        this.icon = gameScene.add.image(iconX,iconY/1.25,iconTexture).setDisplaySize(iconSize/1.7,iconSize/1.7)

        this.nameText = gameScene.add.text(iconX,iconY+iconSize/2.8,name,{
            fontSize: `${iconSize/6}px`, 
            fill: '#fff', 
            fontFamily: 'KodeMonoRegular',
        }).setOrigin(0.5,0.5)

        this.iconBackground.on('pointerover',()=>{
            this.iconBackground.setTexture('activeMenuTab')
            gameScene.input.setDefaultCursor('pointer');
        })

        this.iconBackground.on('pointerout',()=>{
            if (!this.active){
                this.iconBackground.setTexture('inactiveMenuTab')
            }
            gameScene.input.setDefaultCursor('auto');
        })

        this.iconBackground.on('pointerup',()=>{
            if (!this.active){
                this.toggleActive(true)
                gameScene.activeMenu.toggleActive(false)
                gameScene.activeMenu = this
            }
        })
    }

    //Checks buttons for the lock state.
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

        if (!this.addButton.buttonRequirements()){
            this.addButton.lock(true)
        }else if (this.addButton.button.texture.key === this.addButton.texture.greyButton){
            this.addButton.lock(false)
        }
    }

    toggleActive(active){
        if (active){
            this.active = true
            this.iconBackground.setTexture('activeMenuTab')
            this.menuContainer.setVisible(true)

            //Toggles button visibility through built in function
            this.buttons.forEach(bb => {
                bb.forEach(b => {
                    b.toggleButton(true)
                })
            });
        }else{
            this.active = false
            this.iconBackground.setTexture('inactiveMenuTab')
            this.menuContainer.setVisible(false)
            
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
    constructor(gameScene,menuWidth,iconSize,){
        super(gameScene,menuWidth,iconSize,3,'shopIcon','Butikker')

        this.shopList = []

        this.addButton = new addButton(gameScene,{
            x:gameScene.scale.width-menuWidth/2,
            y:150*(1+this.shopList.length)+this.contentPadding,
            price: 500,
            scale: 0.5,
            callBack: ()=> { return null; }
        },'Køb ny butik')

        console.log(this.addButton)

        gameScene.events.on('shopCreated', (shop)=>{
            console.log(shop)
            this.shopList.push(shop)

            let bList = []

            let y = 0 //Value doesnt matter, because it gets changed after the button creation
            const x = gameScene.scale.width-menuWidth/2
            const sX = gameScene.scale.width/1920
            const offset = (menuWidth-50*sX)/3
            bList.push(new shopButton(gameScene,{
                x: x-offset,
                y: y,
                price: 100,
                priceIncrement: 10,
                value: 2000,
                scale: .5,
                valueIncrement: 10,
                callBack: () => { return null; }
            },'customerIcon'))

            //updates the buttonheight variable, in case its the first button created. Then fixes the position for the button and the following buttons.
            this.buttonHeight = bList[0].button.displayHeight+bList[0].accentOffset
            y = (this.buttonHeight+this.contentPadding)*this.shopList.length+this.initialOffset
            bList[0].updatePosition(null,y)
            
            console.log(this.buttons[0])
            bList.push(new shopButton(gameScene,{
                x: x,
                y: y,
                price: 250,
                priceIncrement: 10,
                value: 2000,
                scale: .5,
                valueIncrement: 10,
                callBack: () => { return null; }
            },'customerIcon'))
            bList.push(new shopButton(gameScene,{
                x: x+offset,
                y: y,
                price: 500,
                priceIncrement: 10,
                value: 2000,
                scale: 0.5,
                valueIncrement: 10,
                callBack: () => { return null; }
            },'customerIcon'))

            this.buttons.push(bList)

            this.fixEndItemPositions(y+this.contentPadding+bList[0].button.displayHeight)


        })


        let testText = gameScene.add.text(menuWidth/2, this.contentPadding,'Test 1').setOrigin(0.5,0.5)
        this.menuContainer.add(testText)
        this.toggleActive(true)
    }

    toggleActive(active){
        super.toggleActive(active)
        if (active){
            if (this.addButton){
                this.addButton.toggleButton(true)
            }
        }else{
            if (this.addButton){
                this.addButton.toggleButton(false)
            }
        }
    }

    fixEndItemPositions(y) {
        this.addButton.updatePosition(null,y)
    }

}

export class marketingMenu extends Menu{
    constructor(gameScene,menuWidth,iconSize,){
        super(gameScene,menuWidth,iconSize,2,'marketingIcon','Marketing')

        let testText = gameScene.add.text(menuWidth/2, 200,'Test 2').setOrigin(0.5,0.5)
        this.menuContainer.add(testText)
    }
}

export class managerMenu extends Menu{
    constructor(gameScene,menuWidth,iconSize,){
        super(gameScene,menuWidth,iconSize,1,'managerIcon','Managers')

        let testText = gameScene.add.text(menuWidth/2, 200,'Test 3').setOrigin(0.5,0.5)
        this.menuContainer.add(testText)
    }
}

export class worldMenu extends Menu{
    constructor(gameScene,menuWidth,iconSize,){
        super(gameScene,menuWidth,iconSize,0,'worldIcon','World')

        let testText = gameScene.add.text(menuWidth/2, 200,'Test 4').setOrigin(0.5,0.5)
        this.menuContainer.add(testText)
    }
}