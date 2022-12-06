import Character from "./Template/Character";

export default class Warrior extends Character{
    constructor(name = "warrior", index) {
        let ingamePosition = {x: 35, y: 25};
        if (index >= 1) {
            ingamePosition.y = ingamePosition.y + (index * 7.5);
        }

        let path = "../../sprite/warrior/"
        // Dictionnaire contenant les settings de l'animation.
        let animationsSettingDictionary = {
            "death": {
                "image": path + "death.png",
                "column": 7,
                "row": 1,
            },
            "idle": {
                "image": path + "idle.png",
                "column": 4,
                "row": 1,
            },
            "run": {
                "image": path + "run.png",
                "column": 6,
                "row": 1,
            },
            "attack1": {
                "image": path + "Attack1.png",
                "column": 5,
                "row": 1,
            },
            "attack2": {
                "image": path + "Attack2.png",
                "column": 6,
                "row": 1,
            },
            "attack3": {
                "image": path + "Attack3.png",
                "column": 6,
                "row": 1,
            },
            "hit": {
                "image": path + "hit.png",
                "column": 3,
                "row": 1,
            },
        };
        super(name, animationsSettingDictionary, 0.5, ingamePosition); // 90 et 1 sont les valeurs par défaut
    }

    async action1(boss) {
        let distance = this.distanceBetweenX(boss);
        await this.moveToAndAttack(this.position.x,
            distance + this.position.x, "attack1");
    }

    async action2(boss) {
        let distance = this.distanceBetweenX(boss);
        await this.moveToAndAttack(this.position.x,
            distance + this.position.x, "attack2");
    }

    async action3(boss) {
        let distance = this.distanceBetweenX(boss);
        await this.moveToAndAttack(this.position.x,
            distance + this.position.x, "attack3");
    }
}