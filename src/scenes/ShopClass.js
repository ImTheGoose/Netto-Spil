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

        this.shopConfig = gameScene.config.shopConfig
        this.amountOfPeople = this.shopConfig.menuButtons.upgrade1.defaultValue
        this.cashierSpeed = this.shopConfig.menuButtons.upgrade2.defaultValue
        this.pricePerPerson = this.shopConfig.menuButtons.upgrade3.defaultValue

        this.manager = true
        this.managerSpeed = 100;
        this.managerMultiplier = 1;
        this.managerOffset = 45
        const managerHeight = size/8
        this.managerCooldown = 5000
        this.managerCooldownProgress = 0

        this.cooldown = 2500
        this.cooldownProgress = 0


         

        this.managerGrey = gameScene.add.image(x,y+this.managerOffset*sF,texture.managerGrey).setDisplaySize(size*sF,managerHeight*sF)
        this.managerProgress = gameScene.add.image(x,y+this.managerOffset*sF,texture.managerProgress).setDisplaySize(size*sF,managerHeight*sF)
         

        this.greySprite = gameScene.add.image(x, y, texture.grey).setDisplaySize( 0,  0)
        this.progressSprite = gameScene.add.image(x, y, texture.progress).setDisplaySize( 0,  0).setInteractive();


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
                this.collectMoney()
            }
        })

        this.toggleManager(false)
    }

    managerCollect(){
        if (this.cooldownProgress >= this.cooldown){
            this.collectMoney(true)
            this.managerCooldownProgress = 0;
        }
        return;
    }

    toggleManager(active){
        let sF = this.gameScene.scale.width/1920


        if (!active) { 
            this.manager = false;
            this.managerGrey.setVisible(false)
            this.managerProgress.setVisible(false)
            return;
        }


        
        this.manager = true;
        this.managerGrey.setVisible(true)
        this.managerProgress.setVisible(true)

        this.gameScene.tweens.add({
            targets: [this.managerProgress, this.managerGrey],
            y: {from:this.y, to:this.y+this.managerOffset*sF},
            duration: 1200,
            ease: "Bounce.Out"
        })
        console.log("enabled manager")
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

    updateShop(delta){
        if (this.cooldownProgress < this.cooldown){
            this.cooldownProgress += delta*(this.cashierSpeed/100);
        }else if (this.pointerOn){
            this.gameScene.input.setDefaultCursor('pointer');
        }
        const cropHeight = 1080 * this.cooldownProgress/this.cooldown;
        this.progressSprite.setCrop(0,1080-cropHeight,1080,cropHeight)

        if (this.manager){
            if(this.managerCooldownProgress < this.managerCooldown){
                this.managerCooldownProgress += delta*(this.managerSpeed/100)
            }else if (this.managerCooldownProgress >= this.managerCooldown){
                this.managerCollect()
            }
            const managerCropHeight = this.managerProgress.width * this.managerCooldownProgress/this.managerCooldown

            this.managerProgress.setCrop(0,0,managerCropHeight,this.managerProgress.height)
        }
    }



    collectMoney(isManager){
        let m = 1
        if(isManager){
            m = this.managerMultiplier
        }
        this.cooldownProgress = 0;
        let mon = this.amountOfPeople*this.pricePerPerson*m*this.gameScene.prestigeMenu.getMultiplier()
        mon = Math.round(mon)
        this.gameScene.money += mon
        this.gameScene.input.setDefaultCursor('auto');
        console.log("Indsamlede "+mon+"kr fra nettoen")
        this.sound.play({volume:1})
        this.lastPopup = moneyPopup(this.gameScene,this.x,this.y-this.greySprite.displayHeight/2,mon,PopupType.POSITIVE, this.lastPopup)

    }

    destroy(){
        this.progressSprite.destroy()
        this.greySprite.destroy()
        this.managerGrey.destroy()
        this.managerProgress.destroy()
        this.sound.destroy()
        console.log(`Successfully destroyed shop: ${this.shopNum}`)
    }
}