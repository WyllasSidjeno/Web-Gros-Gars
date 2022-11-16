import Character from "./Template/Character";

/**
 * Classe du personnage Wizard.
 * @class Wizard - The class for any wizard character.
 * @extends Character - The class for any character.
 * From the Character class, the Wizard class inherits the following properties:
 * @param {string} name - The name of the character.
 * @param {string} type - The type of the character.
 * @param {object} animationsSettingDictionary - The dictionary of
 * the settings which will be used to create the animations.
 * @param {number} refreshRate - The refresh rate of the image
 * @param {number} scale - The scale of the image.
 * From the Wizard class, the Wizard class inherits the following properties:
 * @param {string} state - The state of the wizard.
 * The state can be "idle", "walk", "attack(1-2)", "hurt", "die".
 * @param {object} node - The node of the character.
 *
 * @function tick - The function which will be called every frame.
 * @function changeState - The function which will change the state of the wizard.
 * @function changeStateToIdle - The function which will change the state of the wizard to "idle".
 * @function changeStateForDuration - The function which will change the state of the wizard for a duration.

 */
export default class Wizard extends Character{
    constructor(name,type = "wizard") {
        // Créer le div du personnage et l'ajouter au DOM
        let node = document.createElement("div");
        document.getElementById("game-canvas").appendChild(node);

        // Prépare les settings de l'animation
        let path = "../../sprite/Wizard/"
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
                "image": path + "attack1.png",
                "column": 8,
                "row": 1,
            },
            "attack2": {
                "image": path + "attack2.png",
                "column": 8,
                "row": 1,
            },
            "fall": {
                "image": path + "fall.png",
                "column": 2,
                "row": 1,
            },
            "hit": {
                "image": path + "hit.png",
                "column": 4,
                "row": 1,
            },
            "jump": {
                "image": path + "jump.png",
                "column": 2,
                "row": 1,
                }
            };

        // Appelle le constructeur de la classe parente afin de
        // créer les animations et de créer les propriétés de la classe
        super(name,type, animationsSettingDictionary, node); // 60 et 2 sont les valeurs par défaut
    }
}