export class UIScene extends Phaser.Scene{
    constructor(){
        super({ key: "UIScene", active: true })
    }


    create(){
        this.moneyText = this.add.text(0, 0, 'Money: 0');
    }

    update(time, delta) {
        // your update code here
        var money = this.registry.get('money')
        this.moneyText.text = 'Money: '+money
    }


}