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
    constructor(gameScene,x,y,size,texture){
        this.x = x
        this.y = y
        this.size = size
        this.texture = texture
        this.pointerOn = false;

        this.cooldown = 2500
        this.cooldownProgress = 0
        this.collectMoney = 2000;

        const sF = gameScene.scale.width/1920
         
         

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
                console.log("Indsamlede "+this.collectMoney+"kr fra nettoen")
                gameScene.money += this.collectMoney
                gameScene.input.setDefaultCursor('auto');
            }
        })
    }
}