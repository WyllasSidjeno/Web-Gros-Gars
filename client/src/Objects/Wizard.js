/** General Wizard Class*/
import Character from "./Template/Character";

export default class Wizard extends Character{
    constructor(name,type) {
        /* Create a dictionnary for the different animations. */
        /** Get the div game-canvas and create another div inside of it. */
        let node = document.createElement("div");
        node.id = name;
        node.style.position = "absolute";
        document.getElementById("game-canvas").appendChild(node);
// console.log(node.parentNode)


        let animationsDictionnary = {
            "death": {
                "image": "../../sprite/Wizard/death.png",
                "column": 7,
                "row": 1,
                "scale": 2,
            },
            "idle": {
                "image": "../../sprite/Wizard/idle.png",
                "column": 7,
                "row": 1,
                "scale": 2,
            },
            "run": {
                "image": "../../sprite/Wizard/run.png",
                "column": 8,
                "row": 1,
                "scale": 2,
            },
            "attack1": {
                "image": "../../sprite/Wizard/attack1.png",
                "column": 8,
                "row": 1,
                "scale": 2
            },
            "attack2": {
                "image": "../../sprite/Wizard/attack2.png",
                "column": 8,
                "row": 1,
                "scale": 1,
            },
            "fall": {
                "image": "../../sprite/Wizard/fall.png",
                "column": 2,
                "row": 1,
                "scale": 2,
            },
            "hit": {
                "image": "../../sprite/Wizard/hit.png",
                "column": 4,
                "row": 1,
                "scale": 2,
            },
            "jump": {
                "image": "../../sprite/Wizard/jump.png",
                "column": 4,
                "row": 1,
                "scale": 2,
                }
            };

        let refreshDelay = 100;
        super(name,type, animationsDictionnary, refreshDelay, node);

        this.name = name;

        this.node = node;
        this.node.style.position = "absolute";
        this.node.style.width = "100px";
        this.node.style.height = "100px";

        this.node.style.position = "absolute";
        this.node.style.left = "0px";
        this.node.style.top = "0px";
        this.node.style.width = "64px";
        this.node.style.height = "64px";
        this.state = "death";
    }

    tick() {
        this.animations[this.state].tick();
        return true;
    }


}