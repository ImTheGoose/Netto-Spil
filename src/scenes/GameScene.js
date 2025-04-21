import  { Shop } from './ShopClass.js';
import { ShopMenu } from './Menus/ShopMenu.js';
import { ManagerMenu } from './Menus/ManagerMenu.js';
import { PrestigeMenuButton } from './Buttons/PrestigeMenuButton.js';
import { PrestigeMenu } from './PrestigeMenu.js';

export class GameScene extends Phaser.Scene {
    constructor(){
        super({ key: "GameScene", active: false })

        this.money = 9999999999999;

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

        const playerData = JSON.parse(localStorage.getItem("playerData"))
        console.log(playerData)
        this.loadPlayerData(playerData)
    }


    loadPlayerData(playerData){
        console.log(`Loading player data...`)
        if (!playerData) {
            console.log(`Playerdata was invalid: ${playerData}`)
            this.createPlayerData()
            return;
        }

        if(playerData.gameVersion < this.config.gameVersion){ 
            this.updatePlayerData(playerData)
            return;
        }
        console.log("Successfully loaded player.")
    }

    updatePlayerData(playerData){
        console.log(`Updating playerdata from Version ${playerData.gameVersion} to Version ${this.config.gameVersion}`)
        
        this.archivePlayerData(playerData)

    }

    archivePlayerData(playerData){
        console.log("archiving previous playerData")
        let oldPlayerData = JSON.parse(localStorage.getItem("oldPlayerData"))
        if (!oldPlayerData) {
            oldPlayerData = []
        }

        oldPlayerData.push(playerData)
        localStorage.setItem("oldPlayerData", JSON.stringify(oldPlayerData))
        console.log("successfully archived previous playerData")
    }

    createPlayerData(){
        console.log(`Creating new player data..`)
        this.playerData = {
            gameVersion: this.config.gameVersion,
            money: 0,
            rebirthNumber: 0,
            shopData: [],
            managerData: [],
        }

        console.log(`Successfully created playerData`)
        this.savePlayerData(this.playerData)
    }

    savePlayerData(playerData){
        console.log(`Saving player data...`)
        if (!playerData) { playerData = this.playerData }
        localStorage.setItem(`playerData`,JSON.stringify(playerData))
        console.log(`Successfully saved playerData`)
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

        this.shopMenu = new ShopMenu(this,iconSize)
        this.managerMenu = new ManagerMenu(this,iconSize)

        this.activeMenu = this.shopMenu 
        //--- Menu segment end ---//

        this.prestigeMenuButton = new PrestigeMenuButton(this,{
            x: this.scale.width-menuWidth-100*sF,
            y: this.scale.height-100*sF,
            scale: 0.25,
            callBack:() => {}
        })

        this.prestigeMenu = new PrestigeMenu(this)


        //Adds the starter shop.
        this.createDefaultShop()    

        this.registry.set('money', 0)
    }


    //Function for making text fit withing a area
    fitText(textObject, maxWidth){
        while (textObject.displayWidth > maxWidth-this.fitTextPadding) {
            let currentSize = parseInt(textObject.style.fontSize, 10);
            textObject.setFontSize(currentSize - 1);
        }
    }

    prestige(){
        this.shopList.forEach((shop)=>{
            shop.destroy()
        })
        this.shopList = []
        this.shopMenu.resetMenu()
        this.managerMenu.resetMenu()
        this.managerMenu.toggleActive(false)
        this.shopMenu.toggleActive(true)
        this.activeMenu = this.shopMenu
        this.createDefaultShop()

        this.moneyText.setFontSize(100)
    }

    createDefaultShop(){
        const startShop = this.cache.json.get('config').shops[0]
        const defShop = this.cache.json.get('config').shopConfig
        const sF = this.scale.width/1920
        this.shopList.push(new Shop(
            this,
            startShop.x*sF, 
            startShop.y*sF, 
            defShop.size, 
            defShop.texture,0))
    }

    update(time, delta) {
        this.moneyText.text = Math.round(this.money)+"kr"
        this.fitText(this.moneyText,this.moneyBackground.displayWidth*0.7)

        //Updates the progress of each shop
        this.shopList.forEach(shop => {
            shop.updateShop(delta)
        })

        //Checks for if buttons needs to be greyed out.
        this.shopMenu.updateContents()
        this.managerMenu.updateContents()

        //this.managerMenu.checkButtonLockState()
        this.prestigeMenu.updatePrestigeMenu()

    
    }
}