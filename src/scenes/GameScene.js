import  { Shop } from './ShopClass.js';
import { shopMenu,marketingMenu,managerMenu,worldMenu } from "./MenuClass.js";

export class GameScene extends Phaser.Scene {
    constructor(){
        super({ key: "GameScene", active: false })

        this.money = 2000;

        this.shopList = []
    }

    preload() {
        //Loads all assets from config, into the game.
        this.config = this.cache.json.get('config')
        this.config.assets.forEach((asset) =>{
            this.load.image(asset.name,asset.path)
        })

    }
    
    create() {
        const sF = this.scale.width/1920 //Used for scaling. 

        //Loads the map, and offsets it from the middle.
        const map = this.add.image(this.scale.width/2*0.8, this.scale.height/2, 'map');
        map.setScale(sF/1.7);


        //--- Menu segment start ---//
        //Adds the background image.
        this.backgroundImage = this.add.image(this.scale.width,0,'menuBackground').setDisplaySize(sF*550,this.scale.height)
        this.backgroundImage.setOrigin(1,0)
        
        const menuWidth = this.backgroundImage.displayWidth
        const iconSize = menuWidth/4;

        this.shopMenu = new shopMenu(this,menuWidth,iconSize)
        this.marketingMenu = new marketingMenu(this,menuWidth,iconSize)
        this.managerMenu = new managerMenu(this,menuWidth,iconSize)
        this.worldMenu = new worldMenu(this,menuWidth,iconSize)

        this.activeMenu = this.shopMenu 
        //--- Menu segment end ---//


        //Adds the starter shop.
        const startShop = this.cache.json.get('config').shopConfig[0]
        this.shopList.push(new Shop(
            this,
            startShop.x*sF, 
            startShop.y*sF, 
            startShop.size, 
            startShop.texture))
        


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
        this.shopMenu.checkButtonLockState()

        
        //Adds your money to the registry, so UI can change the status.
        this.registry.set('money', Phaser.Math.RoundTo(this.money,-2))
    }
}