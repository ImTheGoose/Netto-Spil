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

        this.cooldown = 2500
        this.cooldownProgress = 0
        this.pricePerPerson = 1;


         
         

        this.greySprite = gameScene.add.image(x, y, texture.grey).setDisplaySize( sF*size,  sF*size)
        this.progressSprite = gameScene.add.image(x, y, texture.progress).setDisplaySize( sF*size,  sF*size).setInteractive();

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

    collectMoney(){
        let mon = this.pricePerPerson*this.amountOfPeople*this.moneyMultiplier
        mon = Math.round(mon)
        this.gameScene.money += mon
        this.gameScene.input.setDefaultCursor('auto');
        console.log("Indsamlede "+mon+"kr fra nettoen")
        this.sound.play({volume:1})
    }
}