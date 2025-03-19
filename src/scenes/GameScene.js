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