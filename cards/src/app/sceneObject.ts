import * as THREE from 'three';
import * as CANNON from "cannon";

export abstract class SceneObject {

  public selected: boolean = false;
  public obj: THREE.Mesh | THREE.Group; // Visual object
  public body: CANNON.Body; // Physics body

  constructor(
    protected scene: THREE.Scene,
    protected world: CANNON.World
  ) {}

  abstract addToScene(): void;

  render() {}

  clicked() {
    this.selected = !this.selected;
  }
}
