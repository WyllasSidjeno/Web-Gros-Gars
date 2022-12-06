import Character from "./Template/Character";

export default class Healer extends Character {
    constructor(name = "heal", index) {
        let ingamePosition = {x: 25, y: 25};
        if (index >= 1) {
            ingamePosition.y = ingamePosition.y + (index * 7);
        }

        let path = "../../sprite/healer/"
        // Dictionnaire contenant les settings de l'animation.
        let animationsSettingDictionary = {
            "death": {
                "image": path + "death.png",
                "column": 11,
                "row": 1,
            },
            "idle": {
                "image": path + "idle.png",
                "column": 6,
                "row": 1,
            },
            "run": {
                "image": path + "run.png",
                "column": 8,
                "row": 1,
            },
            "attack1": {
                "image": path + "Attack1.png",
                "column": 12,
                "row": 1,
            },
            "attack2": {
                "image": path + "Attack2.png",
                "column": 10,
                "row": 1,
            },
            "attack3": {
                "image": path + "Attack3.png",
                "column": 9,
                "row": 1,
            },
            "hit:": {
                "image": path + "hit.png",
                "column": 4,
            }
        }
        super(name, animationsSettingDictionary, 0.5, ingamePosition);
    }

    distanceBetweenX(boss) {
        let x1 = boss.position.x;
        let x2 = this.position.x;
        return Math.abs(x1 - x2)
    }

    async action1(boss) {
        await this.moveToAndAttack(this.position.x,
            this.distanceBetweenX(boss) + this.position.x
            + boss.personalMargin,
            "attack2");
    }

    async action2(boss) {
        await this.moveToAndAttack(this.position.x,
            this.distanceBetweenX(boss) + this.position.x
            + boss.personalMargin,
            "attack1");
    }

    async action3(boss) {
        await this.action1(boss);
    }
}