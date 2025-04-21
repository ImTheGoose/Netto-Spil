window.resetGame = function(){
    window.gameScene.saveCooldown = 10 ** 10
    localStorage.removeItem('playerData')
    console.log("Game save cleared. Ready for refresh.")
}

window.clearGame = function(){
    window.gameScene.saveCooldown = 10 ** 10
    localStorage.clear()
    console.log("Localstorage cleared. Ready for refresh.")
}

window.saveGame = function(){
    window.gameScene.savePlayerData()
}

window.loadOldPlayerData = function(index){
    window.gameScene.saveCooldown = 10 ** 10
    const currentPlayerData = JSON.parse(localStorage.getItem("playerData"))
    let archive = JSON.parse(localStorage.getItem("oldPlayerData"))
    archive.push(currentPlayerData)
    localStorage.setItem("oldPlayerData",JSON.stringify(archive))
    console.log("archived current player data at index: "+archive.length)

    const oldPlayerData = archive[index]
    localStorage.setItem("playerData",JSON.stringify(oldPlayerData))
    console.log("Successfully loaded archived player data. Ready for refresh.")
}