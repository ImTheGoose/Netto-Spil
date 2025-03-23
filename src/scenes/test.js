//This file is depricated, and is not in use. Dont delete until fully ported.


import { shopMenu,marketingMenu,managerMenu,worldMenu } from "./MenuClass.js";
export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene', active:false });
    }

    preload(){
        this.load.image('menuBackground', 'assets/UI/menuBackdrop.png')
        this.load.image('inactiveMenuTab', 'assets/UI/inactiveMenuTab.png')
        this.load.image('activeMenuTab', 'assets/UI/activeMenuTab.png')

        this.load.image('shopIcon', 'assets/UI/shopIcon.png')
        this.load.image('marketingIcon','assets/UI/marketingIcon.png')
        this.load.image('managerIcon','assets/UI/managerIcon.png')
        this.load.image('worldIcon','assets/UI/worldIcon.png')
    }

    create(){
        const sX = this.scale.width/1920
        const sY = this.scale.height/1080
        
        //Adds the background image.
        this.backgroundImage = this.add.image(this.scale.width,0,'menuBackground').setDisplaySize(sX*550,this.scale.height)
        this.backgroundImage.setOrigin(1,0)
        
        const menuWidth = this.backgroundImage.displayWidth
        const iconSize = menuWidth/4;

        this.shopMenu = new shopMenu(this,menuWidth,iconSize)
        this.marketingMenu = new marketingMenu(this,menuWidth,iconSize)
        this.managerMenu = new managerMenu(this,menuWidth,iconSize)
        this.worldMenu = new worldMenu(this,menuWidth,iconSize)

        this.activeMenu = this.shopMenu 

    }

    create2() {
        const sX = this.scale.width/1920
        const sY = this.scale.height/1080
        var dragStartY = 0;

        this.padding = sY*60
        const testCount = 40

        this.backgroundImage = this.add.image(this.scale.width,0,'menuBackground').setScale(sY*0.35)
        this.backgroundImage.setOrigin(1,0)

        const menuWidth = this.backgroundImage.displayWidth

        const menuTabCount = 4
        const iconSize = menuWidth/menuTabCount;
        this.tabList = []
        
        for (var i = 0; i<=menuTabCount; i++){
            let newTab = this.createMenuTabButton(this.scale.width-iconSize*i,0,iconSize)
            this.tabList.push(newTab)
        }

        this.menuContainer = this.add.container(this.scale.width-menuWidth,iconSize);
        this.backgroundImage.y = iconSize


        //Test sprites
        for (let i = 0; i < testCount; i++) {
            let btn = this.add.image(menuWidth/2, i * this.padding, 'ggg').setInteractive();
            this.menuContainer.add(btn);
        }


        //Scroll Inputs
        this.menuContainer.on('pointerdown', (pointer) => {
            dragStartY = pointer.y;
        });

        this.menuContainer.on('pointermove', (pointer) => {
            if (!pointer.isDown) return;
            let deltaY = pointer.y - dragStartY;
            dragStartY = pointer.y;
            this.scrollMenu(-deltaY);
        });

        this.menuContainer.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            this.scrollMenu(deltaY * 0.5); // Adjust sensitivity if needed
        });

    }

    createMenuTabButton(x,y,iconSize) {
        let newTab = this.add.image(x,y,'inactiveMenuTab').setOrigin(0,0).setDisplaySize(iconSize,iconSize).setInteractive()
        newTab.on('pointerover', () =>{
            newTab.setTexture('activeMenuTab')
        })

        newTab.on('pointerout', () =>{
            newTab.setTexture('inactiveMenuTab')
        })
        return newTab;
    }

    //Scroll function
    scrollMenu(amount) {
        this.menuContainer.y -= amount;
        const sY = this.scale.height/1080
        const minY = sY*100;
        const scrollLimitOffset = sY*500;
        const maxY = minY+this.scale.height - (this.menuContainer.list.length * (this.menuContainer.getAt(0).displayHeight+this.padding))+scrollLimitOffset;
        console.log(maxY)
        this.menuContainer.y = Phaser.Math.Clamp(this.menuContainer.y, maxY, minY);
    }


}