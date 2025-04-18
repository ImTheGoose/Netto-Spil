export class Menu {
    constructor(gameScene,menuWidth,iconSize,menuConfig){
        const sF = gameScene.scale.width/1920
        const config = gameScene.config

        this.sound = gameScene.sound.add("swoosh")

        this.menuConfig = menuConfig
        this.active = false;
        this.contentPadding = sF*config.menu.contentPadding
        this.initialOffset = sF*config.menu.initialOffset

        //Inserts the icon background element, and set as inactive
        this.iconBackground = gameScene.add.image(gameScene.scale.width-menuConfig.index*iconSize*2,0,'inactiveMenuTab').setOrigin(1,0).setDisplaySize(iconSize*2,iconSize).setInteractive()


        const iconX = this.iconBackground.x-this.iconBackground.displayWidth/2 //Calculates center of the icon background
        const iconY = this.iconBackground.y+this.iconBackground.displayHeight/2
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
                this.sound.play({volume:2})
            }
        })
    }

    //Loops through all buttons in the menu, to check and update their lock state.
    checkButtonLockState(){
        return;
    }

    //Toggles if the menu is seen as active, both visually but also in terms of inputs.
    toggleActive(active){
        if (active){
            this.active = true
            this.iconBackground.setTexture('activeMenuTab')
        }else{
            this.active = false
            this.iconBackground.setTexture('inactiveMenuTab')
        }
    }
}

