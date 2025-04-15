import { moneyPopup,PopupType } from "./Utils.js";

export class NettoClass {
    constructor(image, imageGray){
        this.colorImage = image;
        this.grayImage = imageGray;

        this.cooldownProgress = 0;
        this.cooldown = 2500;
        this.collectMoney = 100;
    }
}

export class Shop {
    constructor(gameScene,x,y,size,texture,shopNum){
        const sF = gameScene.scale.width/1920
        this.x = x
        this.y = y
        this.size = size
        this.texture = texture
        this.pointerOn = false;
        this.gameScene = gameScene
        this.sound = gameScene.sound.add("collectSound")

        this.shopNum = shopNum

        let sC = gameScene.config.shopConfig
        console.log(sC)
        this.amountOfPeople = sC.menuButtons.upgrade1.defaultValue
        this.cashierSpeed = sC.menuButtons.upgrade2.defaultValue
        this.moneyMultiplier = sC.menuButtons.upgrade3.defaultValue

        this.manager = true
        this.managerSpeed = 100;
        this.managerMultiplier = 0;
        const managerOffset = 45
        const managerHeight = size/8
        this.managerCooldown = 1500
        this.managerCooldownProgress = 0

        this.cooldown = 2500
        this.cooldownProgress = 0
        this.pricePerPerson = 1;


         
         

        this.greySprite = gameScene.add.image(x, y, texture.grey).setDisplaySize( 0,  0)
        this.progressSprite = gameScene.add.image(x, y, texture.progress).setDisplaySize( 0,  0).setInteractive();


        this.managerGrey = gameScene.add.image(x,y+managerOffset*sF,texture.managerGrey).setDisplaySize(size*sF,managerHeight*sF)
        this.managerProgress = gameScene.add.image(x,y+managerOffset*sF,texture.managerProgress).setDisplaySize(size*sF,managerHeight*sF)

        this.initialAnimation()

        gameScene.events.emit('shopCreated', this)

        this.progressSprite.on('pointerover',()=>{
            if (this.cooldownProgress >= this.cooldown){
                gameScene.input.setDefaultCursor('pointer');
            }
            this.pointerOn = true
        })

        this.progressSprite.on('pointerout',()=>{
            gameScene.input.setDefaultCursor('auto');
            this.pointerOn = false
        })

        this.progressSprite.on('pointerdown', () =>{
            if(this.cooldownProgress >= this.cooldown){
                this.cooldownProgress = 0;
                this.collectMoney()
            }
        })
    }

    managerCollect(){
        return;
    }

    toggleManager(active){
        if (!active) { return; }
        
        this.manager = true;

        return;
    }

    initialAnimation(){
        let sF = this.gameScene.scale.width/1920

        this.gameScene.tweens.add({
            targets: [this.progressSprite,this.greySprite],
            displayWidth: sF*this.size,
            displayHeight: sF*this.size,
            alpha: {from: 0.5, to:1},
            duration: 800,
            ease: "Bounce.Out",
            onComplete: ()=>{        console.log(this.greySprite.displayWidth)}
        })
        

    }



    collectMoney(){
        let mon = this.pricePerPerson*this.amountOfPeople*this.moneyMultiplier
        mon = Math.round(mon)
        this.gameScene.money += mon
        this.gameScene.input.setDefaultCursor('auto');
        console.log("Indsamlede "+mon+"kr fra nettoen")
        this.sound.play({volume:1})
        this.lastPopup = moneyPopup(this.gameScene,this.x,this.y-this.greySprite.displayHeight/2,mon,PopupType.POSITIVE, this.lastPopup)

    }
}