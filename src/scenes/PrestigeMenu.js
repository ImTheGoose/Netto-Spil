import { PrestigeButton } from "./Buttons/PrestigeButton.js";
import { moneyPopup,PopupType } from "./Utils.js"

export class PrestigeMenu {
    constructor(gameScene){
        this.gameScene = gameScene
        this.config = gameScene.config
        this.currentPrestigeNumber = 0;
        this.scale = 4

        const sF = this.gameScene.scale.width/1920
        const x = this.gameScene.scale.width/2
        const y = this.gameScene.scale.height/2
        const titleOffset = 100*sF
        const prestigeValueYOffset = 20*sF
        const prestigeValueXOffset = 50*sF
        const prestigeProgressOffset = 30*sF
        const prestigeTextOffset = 60*sF
        const prestigeButtonOffset = 115*sF


        this.menuBackground = gameScene.add.image(x,y,"prestigeMenuBackground").setScale(sF/this.scale).setDepth(10).setInteractive()
        this.titleText = gameScene.add.text(x,y-titleOffset,"Prestige",{
            fontSize: `${sF*100}px`,
            fill: '#fff',
            fontFamily: 'KodeMonoSemiBold'
        }).setDepth(10).setOrigin(0.5,0.5)

        this.currentMultiplierText = gameScene.add.text(x-prestigeValueXOffset,y-prestigeValueYOffset,'1.0x',{
            fontSize: `${sF*50}px`,
            fill: '#fff',
            fontFamily: 'KodeMonoMedium'
        }).setDepth(10).setOrigin(1,0.5)

        this.nextMultiplierText = gameScene.add.text(x+prestigeValueXOffset,y-prestigeValueYOffset,'2.6x',{
            fontSize: `${sF*50}px`,
            fill: '#66B459',
            fontFamily: 'KodeMonoMedium'
        }).setDepth(10).setOrigin(0,0.5)

        this.prestigeArrow = gameScene.add.image(x,y-prestigeValueYOffset,"prestigeArrow").setDepth(10).setScale(sF/this.scale)

        this.prestigeProgressGrey = gameScene.add.image(x,y+prestigeProgressOffset,"prestigeProgressGrey").setDepth(10).setScale(sF/this.scale)
        this.prestigeProgress = gameScene.add.image(x,y+prestigeProgressOffset,"prestigeProgress").setDepth(10).setScale(sF/this.scale)

        this.fadedBackground = gameScene.add.image(x,y,"fadedBackground").setDepth(9).setInteractive()

        this.fadedBackground.on("pointerup",()=>{
            this.toggleMenu(false)
        })

        this.subText = gameScene.add.text(x,y+prestigeTextOffset,'Du har 1040112 kr / 120321312 kr',{
            fontSize: `${sF*20}px`,
            fill: '#737373',
            fontFamily: 'KodeMonoRegular'
        }).setDepth(10).setOrigin(0.5,0.5)

        this.prestigeButton = new PrestigeButton(this.gameScene,{
            x: x,
            y: y+prestigeButtonOffset,
            scale: 1/this.scale,
            callBack: () =>{ }
        })

        this.prestigeButton.setDepth(10)

        this.toggleMenu(false)
    }


    updatePrestigeMenu(){
        const prestigeProgressCrop = this.prestigeProgress.width * this.gameScene.money/this.getRequirments()
        this.prestigeProgress.setCrop(0,0,prestigeProgressCrop,this.prestigeProgress.height)

        this.currentMultiplierText.text = `${this.getMultiplier(this.currentPrestigeNumber)}x`
        this.nextMultiplierText.text = `${this.getMultiplier(this.currentPrestigeNumber+1)}x`

        this.subText.text = `Du har ${this.gameScene.money} kr / ${this.getRequirments()} kr`

        this.prestigeButton.locked(!this.prestigeButton.canUseButton())

        return;
    }

    toggleMenu(isActive){
        this.menuBackground.setVisible(isActive)
        this.titleText.setVisible(isActive)
        this.currentMultiplierText.setVisible(isActive)
        this.nextMultiplierText.setVisible(isActive)
        this.prestigeArrow.setVisible(isActive)
        this.prestigeProgressGrey.setVisible(isActive)
        this.prestigeProgress.setVisible(isActive)
        this.prestigeButton.toggleButton(isActive)
        this.subText.setVisible(isActive)
        this.fadedBackground.setVisible(isActive)
        return;
    }

    getMultiplier(prestigeNumber){
        if (!prestigeNumber) { prestigeNumber = this.currentPrestigeNumber }

        const priceConfig = this.config.priceConfig.prestige

        const mult = priceConfig.multiplierConstant * (priceConfig.multiplierFactor ** prestigeNumber)

        return Math.round(mult*10)/10;
    }

    getRequirments(prestigeNumber){
        if (!prestigeNumber) { prestigeNumber = this.currentPrestigeNumber }

        const priceConfig = this.config.priceConfig.prestige

        const req = priceConfig.requirementConstant * (priceConfig.requirementFactor ** prestigeNumber)

        return Math.round(req);
    }

    canPrestige(){
        if (this.gameScene.money > this.getRequirments()){
            return true;
        }
        return false;
    }
    
    completePrestige(){
        console.log("attempting Prestige")
        const m = this.gameScene.moneyBackground
        moneyPopup(this.gameScene,m.x+m.displayWidth/2,m.y-m.displayHeight,this.gameScene.money,PopupType.NEGATIVE)
        this.gameScene.money = 0;
        this.currentPrestigeNumber++
        this.gameScene.prestige()
        console.log("Prestige completed")
        return;
        
    }

}