import  { Shop } from './ShopClass.js';
import { shopMenu,managerMenu } from "./MenuClass.js";
import { prestigeMenuButton } from './ButtonClasses.js';

export class GameScene extends Phaser.Scene {
    constructor(){
        super({ key: "GameScene", active: false })

        this.money = 1000000;

        this.shopList = []
    }

    preload() {
        //Loads all assets from config, into the game.
        this.config = this.cache.json.get('config')
        this.config.assets.forEach((asset) =>{
            this.load.image(asset.name,asset.path)
        })

        this.config.fonts.forEach((font)=>{
            this.load.font(font.name, font.path)
        })

        this.config.sounds.forEach((sound)=>{
            this.load.audio(sound.name,sound.path)
        })
    }
    
    create() {
        const sF = this.scale.width/1920 //Used for scaling. 

        this.fitTextPadding = -5



        //Loads the map, and offsets it from the middle.
        const map = this.add.image(this.scale.width/2*0.8, this.scale.height/2, 'map');
        map.setScale(sF/1.7);

        this.moneyBackground = this.add.image(40*sF,this.scale.height-40*sF,'moneyBackground').setScale(0.25*sF).setOrigin(0,1)
        this.moneyIcon = this.add.image(45*sF,this.moneyBackground.y-this.moneyBackground.displayHeight/2,'coin').setScale(0.25*sF).setOrigin(0,0.5)
        this.moneyText = this.add.text(this.moneyIcon.x+50*sF,this.moneyIcon.y,'10kr',{
            fontSize: `${40*sF}px`, 
            fill: '#fff', 
            fontFamily: 'KodeMonoBold',}).setOrigin(0,0.5)

        this.fitText(this.moneyText,this.moneyBackground.displayWidth*0.7)

        //--- Menu segment start ---//
        //Adds the background image.
        this.backgroundImage = this.add.image(this.scale.width,0,'menuBackground').setDisplaySize(sF*550,this.scale.height)
        this.backgroundImage.setOrigin(1,0)
        
        const menuWidth = this.backgroundImage.displayWidth
        const iconSize = menuWidth/4;

        this.shopMenu = new shopMenu(this,menuWidth,iconSize)
        //this.marketingMenu = new marketingMenu(this,menuWidth,iconSize)
        this.managerMenu = new managerMenu(this,menuWidth,iconSize)
        //this.worldMenu = new worldMenu(this,menuWidth,iconSize)

        this.activeMenu = this.managerMenu 
        //--- Menu segment end ---//

        this.prestigeMenuButton = new prestigeMenuButton(this,{
            x: this.scale.width-menuWidth-100*sF,
            y: this.scale.height-100*sF,
            price: 0,
            priceMultiplier: 0,
            scale: 0.25,
            callBack:() => {}
        })


        //Adds the starter shop.
        const startShop = this.cache.json.get('config').shops[0]
        const defShop = this.cache.json.get('config').shopConfig
        this.shopList.push(new Shop(
            this,
            startShop.x*sF, 
            startShop.y*sF, 
            defShop.size, 
            defShop.texture,1))
        

            

        this.registry.set('money', 0)
    }


    //Function for making text fit withing a area
    fitText(textObject, maxWidth){
        while (textObject.displayWidth > maxWidth-this.fitTextPadding) {
            let currentSize = parseInt(textObject.style.fontSize, 10);
            textObject.setFontSize(currentSize - 1);
        }
    }

    update(time, delta) {

        this.moneyText.text = Math.round(this.money)+"kr"
        this.fitText(this.moneyText,this.moneyBackground.displayWidth*0.7)

        //Updates the progress of each shop
        this.shopList.forEach(shop => {
            if (shop.cooldownProgress < shop.cooldown){
                shop.cooldownProgress += delta*(shop.cashierSpeed/100);
            }else if (shop.pointerOn){
                this.input.setDefaultCursor('pointer');
            }
            const cropHeight = 1080 * shop.cooldownProgress/shop.cooldown;
            shop.progressSprite.setCrop(0,1080-cropHeight,1080,cropHeight)
        })

        //Checks for if buttons needs to be greyed out.
        this.shopMenu.checkButtonLockState()

    
    }
}