export class GameScene extends Phaser.Scene {
    constructor(){
        super({ key: "GameScene", active: true })

        this.money = 0;
        this.moneyPerInterval = 10.243232;

        this.cooldown = 0;
        this.interval = .02;
        
    }


    create() {
        // your code here
        this.registry.set('money', 0)

        this.graphics = this.add.graphics();
        this.testBuyButton = new Phaser.Geom.Rectangle(200, 200, 300, 150);
        this.graphics.fillStyle(0xffffff, 1.0);
        this.graphics.fillRectShape(this.testBuyButton)

        this.testBuyButton.setInteractive();

    }

    addBoxTest(){
        var testBox = new Phaser.Geom.Rectangle(Phaser.Math.Between(0,1000), Phaser.Math.Between(0,1000), Phaser.Math.Between(30,300), Phaser.Math.Between(20,200));
        this.graphics.fillRectShape(testBox)
    }

    update(time, delta) {
        var intSec = this.interval*1000
        if (this.cooldown > intSec){
            this.cooldown = 0;
            this.money += this.moneyPerInterval
        }else{
            this.cooldown += delta;
        }

        this.registry.set('money', Phaser.Math.RoundTo(this.money,-2))
    }
}