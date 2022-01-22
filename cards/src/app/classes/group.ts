import { SceneObject } from "./sceneObject";
import * as THREE from "three";
export class Group extends SceneObject {
  private geometry: THREE.BoxGeometry;
  private material: THREE.MeshStandardMaterial;

  addToScene(): void {
    this.geometry = new THREE.BoxGeometry(2, 0.01, 5);
    this.material = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5, roughness: 0.5, wireframe: true, transparent: true, opacity: 0.5, wireframeLinewidth: 5 });
    this.obj = new THREE.Mesh(this.geometry, this.material);
    this.obj.position.set(0, 1, 0);

    this.body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 1, 0),
      shape: new CANNON.Box(new CANNON.Vec3(2, 0.01, 5)),
    });

    this.body.quaternion.setFromEuler(0, 0, 0);
    this.world.addBody(this.body);
    this.scene.add(this.obj);
  }

}
