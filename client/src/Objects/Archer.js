import Character from "./Template/Character";

/**
 * Classe du personnage Archer.
 * @class Archer - The class for any archer character.
 * @extends Character - The class for any character.
 * From the Character class, the Archer class inherits the following properties:
 * @param {string} name - The name of the character.
 * @param {string} type - The type of the character.
 * @param {object} animationsSettingDictionary - The dictionary of
 * the settings which will be used to create the animations.
 * @param {number} refreshRate - The refresh rate of the image
 * @param {number} scale - The scale of the image.
 * @param {string} state - The state of the archer.
 * The state can be "idle", "walk", "attack(1-2)", "hurt", "die".
 * From the Archer class, the Archer class inherits the following properties:
 * @param {object} node - The node of the character.
 */

export default class Archer extends Character{
    constructor(name,type = "archer") {
        // Créer le div du personnage et l'ajouter au DOM
        let node = document.createElement("div");
        document.getElementById("game-canvas").appendChild(node);

        // Prépare les settings de l'animation
        let path = "../../sprite/archer/"
        let animationsSettingDictionary = {
            "death": {
                "image": path + "death.png",
                "column": 24,
                "row": 1,
            },
            "idle": {
                "image": path + "idle.png",
                "column": 8,
                "row": 1,
            },
            "run": {
                "image": path + "run.png",
                "column": 8,
                "row": 1,
            },
            "attack1": {
                "image": path + "meleeattack.png",
                "column": 28,
                "row": 1,
            },
            "attack2": {
                "image": path + "rangedattack.png",
                "column": 19,
                "row": 1,
            },
            "fall": {
                "image": path + "jumpandfall.png",
                "column": 12,
                "row": 1,
            },
            "dash": {
                "image": path + "dash.png",
                "column": 14,
                "row": 1,
            },
        }
        // Appelle le constructeur de la classe mère
        super(name,type,animationsSettingDictionary,node, 3.5, 60);
    }
}