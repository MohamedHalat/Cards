import { Injectable } from '@angular/core';
import * as CANNON from 'cannon';


@Injectable({
  providedIn: 'root'
})
export class WorldService {

  private _world: CANNON.World;

  constructor() {
    this.createWorld();
  }

  public createWorld(): void {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
  }

  public addToWorld(...obj: CANNON.Body[]): void {
    obj.forEach(o => this.world.addBody(o));
  }

  public removeFromWorld(...obj: CANNON.Body[]): void {
    obj.forEach(o => this.world.remove(o));
  }

  public step(): void {
    this.world.step(1 / 60);
  }

  public get world(): CANNON.World {
    return this._world;
  }

  public set world(value: CANNON.World) {
    this._world = value;
  }

}
