export class Menu {
    constructor(gameScene,iconSize,menuConfig){
        this.menuConfig = menuConfig
        this.active = false
        this.gameScene = gameScene
        this.iconSize = iconSize
        

        this.sound = gameScene.sound.add("swoosh")

        const sF = gameScene.scale.width/1920
        const config = gameScene.config

        this.minScroll = 150*sF;
        this.scroll = this.minScroll;
        this.contentPadding = config.menu.contentPadding*sF
        this.labelPadding = menuConfig.labelPadding*sF

        this.iconBackground = gameScene.add.image(gameScene.scale.width-menuConfig.index*iconSize*2,0,"inactiveMenuTab")
        .setOrigin(1,0)
        .setDisplaySize(iconSize*2,iconSize)
        .setInteractive()
        .setDepth(5)

        const iconX = this.iconBackground.x-this.iconBackground.displayWidth/2 //Calculates center of the icon background
        const iconY = this.iconBackground.y+this.iconBackground.displayHeight/2
        this.icon = gameScene.add.image(iconX,iconY/1.25,menuConfig.icon)
        .setDisplaySize(iconSize/1.7,iconSize/1.7)
        .setDepth(5)

        this.menuTitleText = gameScene.add.text(iconX,iconY+iconSize/2.8,menuConfig.name,{
            fontSize: `${iconSize/6}px`, 
            fill: '#fff', 
            fontFamily: 'KodeMonoRegular',
        })
        .setOrigin(0.5,0.5)
        .setDepth(5)

        this.scrollIndicator = this.gameScene.add.image(0,0,"scrollIndicator")
        .setVisible(false)
        .setOrigin(0.5,0)
        .setDisplaySize(50,50)

        this.gameScene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            if(pointer.x < this.gameScene.scale.width-this.iconSize*4 || pointer.y < this.iconSize || !this.active){ return }
            this.updateScroll(deltaY)

        });

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

    updateScroll(deltaY){
        const scrollConfig = this.gameScene.config.scrollConfig

        this.scroll -= deltaY * scrollConfig.scrollSpeed

        const menuHeight = this.gameScene.scale.height-this.iconSize
        let maxScroll = -this.getContentHeight() + menuHeight 


        if (maxScroll > 0) { 
            this.scroll = this.minScroll
            return; 
        }

        if (this.scroll > this.minScroll){
            this.scroll = this.minScroll
        }
        maxScroll += this.iconSize/1.5 //Removes excess space under scroll
        if (this.scroll < maxScroll){
            this.scroll = maxScroll
        }

        this.updateContentPosition()


        if (!scrollConfig.scrollIndicator) { return }
        this.scrollIndicator.setDisplaySize(20,menuHeight * (menuHeight / this.getContentHeight()))

        const minScrollIndicator = this.iconSize + scrollConfig.scrollindicatorPadding
        const maxScrollIndicator = this.gameScene.scale.height-this.scrollIndicator.displayHeight-scrollConfig.scrollindicatorPadding

        const t = (this.scroll - maxScroll) / (this.minScroll - maxScroll)

        this.scrollIndicator.y = maxScrollIndicator + t * (minScrollIndicator - maxScrollIndicator)
        this.scrollIndicator.x = this.gameScene.scale.width - scrollConfig.scrollindicatorPadding
        this.scrollIndicator.setVisible(true)

    }

    getContentHeight() { return 0; }
    updateContentPosition() { return; }

    toggleActive(isActive){
        this.scrollIndicator.setVisible(false)
        if (isActive){
            this.updateScroll(0)
            this.active = true
            this.iconBackground.setTexture('activeMenuTab')
        }else{
            this.active = false
            this.iconBackground.setTexture('inactiveMenuTab')
        }
    }
}


    
    