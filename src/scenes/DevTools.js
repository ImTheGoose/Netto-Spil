if (window.localStorage.getItem("isDevToolsEnabled")){
    loadDevTools()
}

window.devMode = function(isEnabled){
    if (isEnabled){
        localStorage.setItem("isDevToolsEnabled",true)
        loadDevTools()
        console.log("Devtools are enabled")
    }else{
        localStorage.removeItem("isDevToolsEnabled")
        unloadDevTools()
        console.log("Devtools are disabled")
    }
}

function unloadDevTools(){
    window.resetGame = null
    window.clearGame = null
    window.saveGame = null
    window.loadOldPlayerData = null
    window.setPrestige = null
    window.setMoney = null
    window.archiveCurrentSave = null
}

function loadDevTools(){
    window.resetGame = function(){
        window.gameScene.preventSave = true
        localStorage.removeItem('playerData')
        console.log("Game save cleared. Ready for refresh.")
    }
    
    window.clearGame = function(){
        window.gameScene.preventSave = true
        localStorage.clear()
        console.log("Localstorage cleared. Ready for refresh.")
    }
    
    window.saveGame = function(){
        window.gameScene.savePlayerData()
    }

    window.setMoney = function(amount){
        window.gameScene.money = amount
        console.log(`Player money has been set to ${amount}`)
    }

    window.setPrestige = function(amount){
        window.gameScene.prestigeMenu.currentPrestigeNumber = amount
        console.log(`Player prestige has been set to ${amount}`)
    }

    window.archiveCurrentSave = function(){
        window.gameScene.preventSave = true
        const currentPlayerData = JSON.parse(localStorage.getItem("playerData"))
        let archive = JSON.parse(localStorage.getItem("oldPlayerData"))
        if (!archive) { archive = [] }
        archive.push(currentPlayerData)
        localStorage.setItem("oldPlayerData",JSON.stringify(archive))
        console.log("archived current player data at index: "+archive.length)
    }
    
    window.loadOldPlayerData = function(index){
        window.gameScene.preventSave = true
        const currentPlayerData = JSON.parse(localStorage.getItem("playerData"))
        let archive = JSON.parse(localStorage.getItem("oldPlayerData"))
        if (!archive) { archive = [] }
        archive.push(currentPlayerData)
        localStorage.setItem("oldPlayerData",JSON.stringify(archive))
        console.log("archived current player data at index: "+archive.length)
    
        const oldPlayerData = archive[index]
        localStorage.setItem("playerData",JSON.stringify(oldPlayerData))
        console.log("Successfully loaded archived player data. Ready for refresh.")
    }
}