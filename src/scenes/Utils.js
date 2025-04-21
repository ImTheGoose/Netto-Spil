export const PopupType = {
    POSITIVE: 0,
    NEUTRAL: 1,
    NEGATIVE: 2,
}

export function moneyPopup(gameScene,x,y,amount,type,prevousPopup){
    let sF = gameScene.scale.width/1920

    if (prevousPopup){
        gameScene.tweens.add({
            targets:prevousPopup,
            alpha:0,
            y: prevousPopup.y-10*sF,
            duration: 200,
            onComplete: () =>{
                prevousPopup.destroy()
            }
        })
    }

    let config = gameScene.config.popupConfig
    let size = config.size;

    let style = config.neutral

    if (type == PopupType.POSITIVE){
        style = config.positive
    }else if (type == PopupType.NEGATIVE){
        style = config.negative
    }

    let stroke = style.stroke
    let color = style.color
    let prefix = style.prefix

    const moneyText = gameScene.add.text(x,y,`${prefix}${amount}kr`,{
        fontSize: `${size*sF}px`,
        fontFamily: "KodeMonoBold",
        color: color,
        stroke: stroke,
        strokeThickness: 6,
    }).setOrigin(0.5)
    
    let randomAngle = randomNumber(-config.angleVariance,config.angleVariance)

    gameScene.tweens.add({
        targets: moneyText,
        y: y-25*sF,
        angle: randomAngle,
        scale:1,
        duration: 1200,
        ease: 'Cubic.Out',
        onComplete: () =>{
            gameScene.tweens.add({
                targets: moneyText,
                alpha:0,
                scale:0.6,
                duration: 600,
                delay: 300,
                ease: 'Cubic.In',
                onComplete: () =>{
                    moneyText.destroy()
                }
            })
        }
    })

    return moneyText;
}

function randomNumber(min,max){
    return Math.floor(Math.random() * (max - min) + 1) + min;
}