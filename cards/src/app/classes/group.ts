import { SceneObject } from "./sceneObject";
import * as THREE from "three";
import * as CANNON from "cannon";

export class Group extends SceneObject {
  private geometry: THREE.BoxGeometry;
  private material: THREE.MeshStandardMaterial;

  addToScene(): void {
    // Ref https://github.com/Soft8Soft/verge3d-code-examples/blob/master/misc_controls_drag.html
    this.obj = new THREE.Group();
    // this.body = new CANNON.Body({
    //   mass: 0,
    //   position: new CANNON.Vec3(0, 0, 0),
    //   shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    // });

    // this.body.quaternion.setFromEuler(0, 0, 0);
    // this.world.addBody(this.body);
    this.scene.add(this.obj);
  }

  addToGroup(obj: THREE.Object3D): void {
    this.obj.attach(obj);
  }

  removeFromGroup(obj: THREE.Object3D): void {
    this.scene.attach(obj);
  }
}
