import { Game } from '../Game/Game';
import { Character } from './Character';
import { RenderingSystem } from '../Game/systems/RenderingSystem';
import { ScriptingSystem } from '../Game/systems/ScriptingSystem';

export class MyGame extends Game {
    constructor() {
        super();

        this.update = this.update.bind(this);
        this.render = this.render.bind(this);

        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;

        document.body.appendChild(canvas);

        this.addSystem(RenderingSystem, new RenderingSystem(canvas));
        this.addSystem(ScriptingSystem, new ScriptingSystem());
        this.addEntity('character', new Character());
        this.run();
    }
}
