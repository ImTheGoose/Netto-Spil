export class UIScene extends Phaser.Scene{
    constructor(){
        super({ key: "UIScene", active: false })
    }

    preload(){
        this.load.font('KodeMonoRegular','assets/KodeMono-Regular.ttf')
        this.load.font('KodeMonoMedium','assets/KodeMono-Medium.ttf')
        this.load.font('KodeMonoSemiBold','assets/KodeMono-SemiBold.ttf')
        this.load.font('KodeMonoBold','assets/KodeMono-Bold.ttf')
    }

    create(){
        const scaleFactor = this.scale.width / 50

        this.moneyText = this.add.text(0, 0, 'Money: 0',{
            fontSize: `${scaleFactor}px`, 
            fill: '#239f22', 
            fontFamily: 'KodeMonoBold',
        });

        
    }

    update(time, delta) {
        // your update code here
        var money = this.registry.get('money')
        this.moneyText.text = 'Money: '+money
    }


}