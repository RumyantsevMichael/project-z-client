import { Class } from '../../types/Class';
import { IComponent } from '../../Engine/IComponent';
import { Component } from '../../Engine/Component';
import { Vector2 } from '../common/Vector2';
import { Tree } from '../common/Tree';
import { GameObject } from '../entities/GameObject';
import { TransformComponent } from '../components/TransformComponent';

type CacheKey = Set<Class<IComponent>>;

export class EntityManager {
    private entities: GameObject[] = [];
    private cache: Map<CacheKey, GameObject[]> = new Map();
    private tree: Tree<GameObject> = new Tree(
        new Vector2(-1000, -1000),
        new Vector2(+1000, +1000)
    );

    public set(entity: GameObject): void {
        this.entities.push(entity);

        if (entity.hasComponent(TransformComponent)) {
            const transform = entity.getComponent(TransformComponent);

            this.tree.insert(transform.position, entity);
        }

        this.invalidate();
    }

    public get(alias: string): GameObject[] {
        return this.entities.filter(entity => entity.name === alias);
    }

    public filterByComponents(...components: Array<Class<Component>>): GameObject[] {
        const key = new Set(components);
        const cachedData = this.cache.get(key);

        if (cachedData !== undefined) {
            return cachedData;
        }

        const entities = this.entities.filter(entity => {
            return components.every(component => entity.hasComponent(component));
        });

        this.cache.set(key, entities);

        return entities;
    }

    public filterByRange(a: Vector2, b: Vector2): GameObject[] {
        return this.tree.findInRange(a, b);
    }

    public render(
        context: CanvasRenderingContext2D,
        cameraPosition: Vector2,
        cameraHalfWidth: number,
        cameraHalfHeight: number
    ): void {
        this.tree.render(context, cameraPosition, cameraHalfWidth, cameraHalfHeight);
    }

    private invalidate(): void {
        this.cache.clear();
    }
}
