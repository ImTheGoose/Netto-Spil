import { shopButton } from "./ButtonClasses.js";

class Menu {
    constructor(gameScene,menuWidth,iconSize,index,iconTexture,name){

        const sX = gameScene.scale.width/1920
        const sY = gameScene.scale.height/1080
        this.buttons = []
        this.active = false;

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

    toggleActive(active){
        if (active){
            this.active = true
            this.iconBackground.setTexture('activeMenuTab')
            this.menuContainer.setVisible(true)

            //Toggles button visibility through built in function
            this.buttons.forEach(b => {
                b.toggleButton(true)
            });
        }else{
            this.active = false
            this.iconBackground.setTexture('inactiveMenuTab')
            this.menuContainer.setVisible(false)
            
            //Toggles button visibility through built in function
            this.buttons.forEach(b => {
                b.toggleButton(false)
            });
        }
    }
}

export class shopMenu extends Menu{
    constructor(gameScene,menuWidth,iconSize,){
        super(gameScene,menuWidth,iconSize,3,'shopIcon','Butikker')
        this.toggleActive(true)


        let testText = gameScene.add.text(menuWidth/2, 200,'Test 1')
        this.menuContainer.add(testText)
    }
}

export class marketingMenu extends Menu{
    constructor(gameScene,menuWidth,iconSize,){
        super(gameScene,menuWidth,iconSize,2,'marketingIcon','Marketing')

        let testText = gameScene.add.text(menuWidth/2, 200,'Test 2')
        this.menuContainer.add(testText)
    }
}

export class managerMenu extends Menu{
    constructor(gameScene,menuWidth,iconSize,){
        super(gameScene,menuWidth,iconSize,1,'managerIcon','Managers')

        let testText = gameScene.add.text(menuWidth/2, 200,'Test 3')
        this.menuContainer.add(testText)
    }
}

export class worldMenu extends Menu{
    constructor(gameScene,menuWidth,iconSize,){
        super(gameScene,menuWidth,iconSize,0,'worldIcon','World')

        let testText = gameScene.add.text(menuWidth/2, 200,'Test 4')
        this.menuContainer.add(testText)
    }
}