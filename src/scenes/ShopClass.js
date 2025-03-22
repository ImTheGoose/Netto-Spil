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

        this.cooldown = 2500
        this.cooldownProgress = 0
        this.collectMoney = 100;

        const sX = gameScene.scale.width/1920
        const sY = gameScene.scale.height/1080

        this.greySprite = gameScene.add.image(x, y, texture.grey).setDisplaySize(sX*size, sY*size)
        this.progressSprite = gameScene.add.image(x, y, texture.progress).setDisplaySize(sX*size, sY*size).setInteractive();

        this.progressSprite.on('pointerdown', () =>{
            if(this.cooldownProgress >= this.cooldown){
                this.cooldownProgress = 0;
                console.log("Indsamlede "+this.collectMoney+"kr fra nettoen")
                gameScene.money += this.collectMoney
            }
        })
    }
}