export class NettoClass {
    constructor(image, imageGray){
        this.colorImage = image;
        this.grayImage = imageGray;

        this.cooldownProgress = 0;
        this.cooldown = 5000;
        this.collectMoney = 100;
    }
}