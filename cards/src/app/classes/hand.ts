import { Card } from "./card";
import { SceneObject } from "./sceneObject";
import * as THREE from "three";
import * as CANNON from "cannon";

export class Hand extends SceneObject{

  public cards: Card[] = [];

  addToScene(): void {
    this.obj = new THREE.Group();
  }
}
