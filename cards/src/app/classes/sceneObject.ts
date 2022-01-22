import * as THREE from 'three';
import * as CANNON from "cannon";

export abstract class SceneObject {

  public selected: boolean = false;
  public obj: THREE.Mesh | THREE.Group; // Visual object
  public body: CANNON.Body; // Physics body
  public rendered: boolean = false;

  constructor(
    protected scene: THREE.Scene,
    protected world: CANNON.World
  ) {}

  abstract addToScene(): void;

  render() {
    this.rendered = true;

    if (this.obj?.position && this.body?.position) {
      this.obj.position.copy((this.body.position as any));
      this.obj.quaternion.copy((this.body.quaternion as any));
    }
  }

  removeFromScene() {
    this.scene.remove(this.obj);
    this.world.remove(this.body);
  }

  flip() {}

  needsUpdate(): boolean {
    return !this.body?.velocity?.almostZero(0.08) || !this.body?.angularVelocity?.almostZero(0.08);
  }

  clicked() {
    this.selected = !this.selected;
  }
}