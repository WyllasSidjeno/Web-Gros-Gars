import TiledImage from "./TiledImage.js";

export default class Character {
    constructor(name, type, animationsDictionnary, refreshrate, node) {
        this.name = name;
        this.type = type;

        /* Make the pixel art 2x bigger without blurring. */
        this.animations = {};
        for (let key in animationsDictionnary) {
            this.animations[key] = new TiledImage(animationsDictionnary[key].image,
                animationsDictionnary[key].column,
                animationsDictionnary[key].row,
                refreshrate,
                true,
                1,
                node);
            /*Scale the image to 2x bigger without blur. */
            this.animations[key].node.style.transform = "scale(2)";
        }

    }
}