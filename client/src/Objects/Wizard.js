import Character from "./Template/Character";

/**
 * @class Wizard
 * @description Classe de base pour les personnages Wizard.
 * @extends Character
 * @param {string} name - Le nom du wizard.
 * @param {string} type - Le type est toujours wizard.
 *
 * @see Character
 * @see TiledImage
 */
export default class Wizard extends Character {
    /** Constructeur pour la classe Wizard*/
    constructor(name, index) {
        let ingamePosition = {x: 5, y: 15};
        if (index >= 1) {
            ingamePosition.y = ingamePosition.y + (index * 7.5);
        }

        let path = "../../sprite/wizard/"
        // Dictionnaire contenant les settings de l'animation.
        let animationsSettingDictionary = {
            "death": {
                "image": path + "death.png",
                "column": 7,
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
                "column": 8,
                "row": 1,
                "attackType": "ranged"
            },
            "attack2": {
                "image": path + "Attack2.png",
                "column": 8,
                "row": 1,
                "attackType": "ranged"
            },
            "hit": {
                "image": path + "hit.png",
                "column": 4,
                "row": 1,
            },
        };
        super(name, animationsSettingDictionary,1, ingamePosition); // 90 et 1 sont les valeurs par défaut
    }

    distanceBetweenX(boss) {
        return Math.abs(this.position.x - boss.position.x);
    }

    async action1() {
        await this.simpleAttack("attack1");
    }

    async action2() {
        await this.simpleAttack("attack2");
    }

    async action3() {
        await this.simpleAttack("attack2");
    }

}