import  { NettoClass } from './NettoClass.js';

export class GameScene extends Phaser.Scene {
    constructor(){
        super({ key: "GameScene", active: true })

        this.money = 0;

        this.nettoList = []
        this.buttonList = []
    }

    preload() {
        this.load.image('map', 'assets/DK-Kort.png');
        this.load.image('testB', 'assets/UI/testButton.png');
        this.load.image('testBDown', 'assets/UI/testButtonDown.png');
        this.load.image('testBLocked', 'assets/UI/testButtonLocked.png');
        this.load.image('nettoSprite', 'assets/UI/nettoSprite.png')
        this.load.image('nettoSpriteGray', 'assets/UI/nettoSpriteGray.png')

        this.load.image('customerIcon', 'assets/UI/customerIcon.png')
    }
    
    create() {
        const x = this.scale.width
        const y = this.scale.height

        const scaleFactor = x / 50

        // Loader mappet
        const map = this.add.image(x/2*0.9, y/2, 'map');
        map.setScale(x/4000*1.2);
        this.nettoList.push(this.createNetto(x/2*0.9,y/4,150))
        this.nettoList.push(this.createNetto(x/3*0.9,y/4,150))
        this.nettoList.push(this.createNetto(x/1.5*0.9,y/4,150))


        this.buttonList.push(this.createButton(x/2*0.9, y/1.5, "Test Button",'customerIcon',() => {
            if (this.nettoList[0].cooldown >= 1000){
                this.nettoList[0].cooldown -= 500;
            }else{
                console.log("Fejl: max opgraderet")
            }

        }))

        this.registry.set('money', 0)
    }

    //Creates a new netto object with both a color and gray image, and adds logic for collecting cash.
    createNetto(x,y,size){
        const sX = this.scale.width/1920
        const sY = this.scale.height/1080

        const nettoSpriteGray = this.add.image(x, y, 'nettoSpriteGray').setDisplaySize(sX*size, sY*size)
        const nettoSprite = this.add.image(x, y, 'nettoSprite').setDisplaySize(sX*size, sY*size).setInteractive();
        const newNetto = new NettoClass(nettoSprite, nettoSpriteGray)

        newNetto.colorImage.on('pointerdown', () =>{
            if(newNetto.cooldownProgress >= newNetto.cooldown){
                newNetto.cooldownProgress = 0;
                console.log("Indsamlede "+newNetto.collectMoney+"kr fra nettoen")
                this.money += newNetto.collectMoney
            }
        })



        return newNetto;
    }

    //Creates a new button with text label, and returns the button & text objects as an object.
    createButton(x,y,name,icon,buttonCallback) {
        const scaleFactor = this.scale.width / 50
        const buttonPrice = 50;
        const sX = this.scale.width/1920
        const sY = this.scale.height/1080

        //Button creation and formatting
        var button = this.add.image(x,y,'testB').setInteractive()

        button.setScale(this.scale.width/4000*3)

        const dW = button.displayWidth;
        const dH = button.displayHeight;

        var icon = this.add.image(x,y-dH/3.3,icon)
        
        //Text creation and formatting
        var buttonText = this.add.text(x,y,name,{
            fontSize: `${scaleFactor}px`, 
            fill: '#fff', 
            fontFamily: 'KodeMonoBold'
        }).setOrigin(0.5,0.5)


        //Following are pointer events
        //On Hover
        button.on('pointerover', () => {
            if (this.money > buttonPrice){
                button.setTint(0xb4b4b4)
            }

        } )
        //On Hover Leave
        button.on('pointerout',() => {
            button.clearTint()
        })
        //On button press
        button.on('pointerdown', () => {
            button.setTexture('testBDown')
            button.setTint(0x767676)
        })
        //On button release
        button.on('pointerup', () => {
            if (this.money >= buttonPrice){
                button.setTexture('testB')
                console.log("button clicked")
                this.money -= buttonPrice;
                buttonCallback();
                button.setTint(0xb4b4b4)
            }else{
                console.log("ikke nok penge")
            }
        })


        return {
            button: button,
            buttonText: buttonText,
            buttonPrice: buttonPrice,
            buttonCallback: buttonCallback
        }
    }

    update(time, delta) {
        //Updates the progress of a Shops Cooldown.
        this.nettoList.forEach(netto => {
            if (netto.cooldownProgress < netto.cooldown){
                netto.cooldownProgress += delta;
            }
            const cropHeight = 1080 * netto.cooldownProgress/netto.cooldown;
            netto.colorImage.setCrop(0,1080-cropHeight,1080,cropHeight)
        });

        //Checking if a button should be gray
        this.buttonList.forEach(button => {
            if(this.money < button.buttonPrice ){
                button.button.setTexture('testBLocked')
                button.button.clearTint()
            }else if (button.button.texture.key === 'testBLocked'){
                button.button.setTexture('testB')
            }
        });


        

        this.registry.set('money', Phaser.Math.RoundTo(this.money,-2))
    }
}