import { shopButton, Button } from './ButtonClasses.js';
import  { Shop } from './ShopClass.js';
import { shopMenu,marketingMenu,managerMenu,worldMenu } from "./MenuClass.js";

export class GameScene extends Phaser.Scene {
    constructor(){
        super({ key: "GameScene", active: true })

        this.money = 0;

        this.shopList = []
        this.buttonList = []
        this.texture = {}
    }

    preload() {
        //General Menu Assets
        this.load.image('menuBackground', 'assets/UI/menuBackdrop.png')
        this.load.image('inactiveMenuTab', 'assets/UI/inactiveMenuTab.png')
        this.load.image('activeMenuTab', 'assets/UI/activeMenuTab.png')

        //Menu Icons
        this.load.image('shopIcon', 'assets/UI/shopIcon.png')
        this.load.image('marketingIcon','assets/UI/marketingIcon.png')
        this.load.image('managerIcon','assets/UI/managerIcon.png')
        this.load.image('worldIcon','assets/UI/worldIcon.png')

        //Map, Buttons and shops assets
        this.load.image('map', 'assets/DK-Kort.png');
        this.load.image('testB', 'assets/UI/testButton.png');
        this.load.image('testBDown', 'assets/UI/testButtonDown.png');
        this.load.image('testBLocked', 'assets/UI/testButtonLocked.png');
        this.load.image('nettoSprite', 'assets/UI/nettoSprite.png')
        this.load.image('nettoSpriteGrey', 'assets/UI/nettoSpriteGray.png')
        
        this.load.image('button','assets/UI/button.png')
        this.load.image('greyButton','assets/UI/greyButton.png')

        this.load.image('customerIcon', 'assets/UI/customerIcon.png')
        this.texture = {
            shopButton:{
                button: 'button',
                greyButton: 'greyButton'
            },
            nettoSkin:{
                grey: 'nettoSpriteGrey',
                progress: 'nettoSprite'
            }
        }
    }
    
    create() {
        const x = this.scale.width
        const y = this.scale.height
        const sX = x/1920
        const sY = y/1080

        const scaleFactor = x / 50

        // Loader mappet
        const map = this.add.image(x/2*0.8, y/2, 'map');
        map.setScale(x/4000*1.2);

        //--- Test button and shops start ---//
        //Adding shops to list of shops
        this.shopList.push(new Shop(
            this,
            x/2*0.9, 
            y/4, 
            150, 
            this.texture.nettoSkin))
        
        this.shopList.push(new Shop(
            this,
            x/3*0.9, 
            y/4, 
            150, 
            this.texture.nettoSkin))

        this.shopList.push(new Shop(
                this,
                x/1.5*0.9, 
                y/4, 
                150, 
                this.texture.nettoSkin))

        //Adds buttons to list of buttons
        this.buttonList.push(new shopButton(this,{
            x: x/2*0.9,
            y: y/2,
            price: 1000,
            priceIncrement: 10,
            value: 2000,
            valueIncrement: 10,
            callBack: () => { return null; }
        },'customerIcon'))

        this.buttonList.push(new Button(this,{
            x:x/2*1.3,
            y:y/2,
            price: 0,
            priceIncrement: 0,
            value: 0,
            valueIncrement: 0,
            callBack: () => { return null; }
        },this.texture.shopButton))
        //--- Test button and shops END ---//


        //--- Menu segment start ---//
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
        //--- Menu segment end ---//

        this.registry.set('money', 0)
    }


    update(time, delta) {
        //Updates the progress of each shop
        this.shopList.forEach(shop => {
            if (shop.cooldownProgress < shop.cooldown){
                shop.cooldownProgress += delta;
            }else if (shop.pointerOn){
                this.input.setDefaultCursor('pointer');
            }
            const cropHeight = 1080 * shop.cooldownProgress/shop.cooldown;
            shop.progressSprite.setCrop(0,1080-cropHeight,1080,cropHeight)
        })

        //Checks for if buttons needs to be greyed out.
        this.buttonList.forEach(b => {
            if (!b.buttonRequirements()){
                b.lock(true)
            }else if (b.button.texture.key === b.texture.greyButton){
                b.lock(false)
            }
        });


        
        //Adds your money to the registry, so UI can change the status.
        this.registry.set('money', Phaser.Math.RoundTo(this.money,-2))
    }
}