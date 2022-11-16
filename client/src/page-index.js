import {signin} from './sirius-api';

import Wizard from "./Objects/Wizard";
import Archer from "./Objects/Archer";

let spriteList = [];

window.addEventListener("load", () => {
    document.querySelector("form").onsubmit = function () {
        return signin(this);
    }
    spriteList.push(new Archer(100, 100));
    spriteList[0].changeState("dash");
    tick();
});

const tick = () => {
    spriteList.forEach(sprite => {
        let alive = sprite.tick();
        if (!alive) {
            spriteList.splice(spriteList.indexOf(sprite), 1);
        }
    });
    requestAnimationFrame(tick);
}






