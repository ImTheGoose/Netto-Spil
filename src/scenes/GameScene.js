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

        this.load.image('button','assets/UI/button.png')
        this.load.image('greyButton','assets/UI/greyButton.png')

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


        this.buttonList.push(this.createButton(x/2*0.9, y/1.5, "100.000kr",'customerIcon',() => {
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
    createButton(x,y,depricated,icon,buttonCallback) {
        const buttonPrice = 50;
        const buttonValue = '1.72x';
        const sX = this.scale.width/1920
        const sY = this.scale.height/1080
        const accentOffset = sY*15;
        const priceOffset = sY*60;
        const valueOffset = sY*40
        const fitTextPadding = sX*20


        var accentButton = this.add.image(x,y+accentOffset,'button')
        accentButton.setScale(sX*0.95)
        accentButton.setAlpha(0.7)

        //Button creation and formatting
        var button = this.add.image(x,y,'button').setInteractive()
        button.setScale(sX*0.95)

        var buttonValueText = this.add.text(x,y-valueOffset,buttonValue,{
            fontSize: `${sX*50}px`, 
            fill: '#000', 
            fontFamily: 'KodeMonoBold'
        }).setOrigin(0.5,0.5)
        
        const xOffset = buttonValueText.displayWidth/3
        buttonValueText.x = x+xOffset

        var icon = this.add.image(x-xOffset*2,y-valueOffset,icon).setScale(sX/1.4)

        //Text creation and formatting
        var buttonPriceText = this.add.text(x,y+priceOffset,buttonPrice+"Kr",{
            fontSize: `${sX*50}px`, 
            fill: '#000', 
            fontFamily: 'KodeMonoBold'
        }).setOrigin(0.5,0.5)
        fitText(buttonPriceText, button.displayWidth)

        //Adjust font size to fit within a maxWidth
        function fitText(textObject, maxWidth){
            while (textObject.displayWidth > maxWidth-fitTextPadding) {
                let currentSize = parseInt(textObject.style.fontSize, 10);
                textObject.setFontSize(currentSize - 1);
            }
        }

        //Resets position of all button contents
        function resetButtonPosition(){
            button.y = y
            buttonPriceText.y = y+priceOffset
            icon.y = y-valueOffset
            buttonValueText.y = y-valueOffset
        }

        //Adds offset to all button contents
        function offsetButtonPosition(){
            button.y += accentOffset
            buttonPriceText.y += accentOffset
            icon.y += accentOffset
            buttonValueText.y += accentOffset
        }


        //Following are pointer events
        //On Hover
        button.on('pointerover', () => {
            if (this.money > buttonPrice){
                button.setTint(0xb4b4b4)
                accentButton.setTint(0xb4b4b4)
            }

        } )
        //On Hover Leave
        button.on('pointerout',() => {
            button.clearTint()
            accentButton.clearTint()
        })
        //On button press
        button.on('pointerdown', () => {
            button.setTint(0x767676)
            accentButton.setTint(0x767676)
            offsetButtonPosition();
        })
        //On button release
        button.on('pointerup', () => {
            if (this.money >= buttonPrice){
                button.setTexture('button')
                console.log("button clicked")
                this.money -= buttonPrice;
                buttonCallback();
                button.setTint(0xb4b4b4)
            }else{
                console.log("ikke nok penge")
            }
            resetButtonPosition()
        })


        return {
            button: button,
            accentButton: accentButton,
            buttonPriceText: buttonPriceText,
            buttonValueText: buttonValueText,
            buttonIcon: icon,
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
                button.button.setTexture('greyButton')
                button.button.clearTint()
                button.accentButton.setTexture('greyButton')
                button.accentButton.clearTint()
            }else if (button.button.texture.key === 'greyButton'){
                button.button.setTexture('button')
                button.accentButton.setTexture('button')
            }
        });


        

        this.registry.set('money', Phaser.Math.RoundTo(this.money,-2))
    }
}