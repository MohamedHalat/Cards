import * as THREE from 'three';
import * as CANNON from "cannon";
import { Injectable } from '@angular/core';
import { SceneService } from '../services/scene.service';
import { WorldService } from '../services/world.service';

@Injectable({
  providedIn: 'root'
})
export abstract class SceneObject {

  public selected: boolean = false;
  public obj: THREE.Mesh | THREE.Group; // Visual object
  public body: CANNON.Body; // Physics body
  public rendered: boolean = false;

  protected world: WorldService;

  private _needsUpdate: boolean = false;

  constructor(
    protected scene: SceneService,
  ) {
    this.world = scene.world;
  }

  abstract addToScene(): void;

  render() {
    this.rendered = true;

    if (this.obj?.position && this.body?.position) {
      this.obj.position.copy((this.body.position as any));
      this.obj.quaternion.copy((this.body.quaternion as any));
    }
  }

  removeFromScene() {
    this.scene.removeFromScene(this);
    this.world.removeFromWorld(this.body);
  }

  flip() {}

  needsUpdate(): boolean {
    if (this._needsUpdate) return true;
    if (this.body) {
      return !this.body?.velocity?.almostZero(0.08) || !this.body?.angularVelocity?.almostZero(0.08);
    }

    return false;
  }

  clicked() {
    this.selected = !this.selected;
  }
}
