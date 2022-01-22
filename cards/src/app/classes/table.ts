import * as THREE from "three";
import { Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { SceneObject } from "./sceneObject";
import * as CANNON from "cannon";

export enum CardColor {
  BLACK,
  YELLOW,
  RED,
  BLUE,
  GREEN,
}

export class Table extends SceneObject{

  render() {
    this.rendered = true;
  }


  addToScene() {
    const loader = new GLTFLoader();
    loader.load('../../assets/3d/uploads-files-2162109-round+table.glb', (gltf) => {
      this.obj = gltf.scene;
      this.obj.position.set(0, -10.9, 0);
      this.obj.scale.set(10, 10, 10);

      this.body = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(0, -.13, 0),
        shape: new CANNON.Box(new CANNON.Vec3(10, 0.1, 10)),
      });
      this.body.quaternion.setFromEuler(0, 0, 0);

      // this.obj.receiveShadow = true;
      // this.obj.castShadow = true;
      this.world.addBody(this.body);
      this.scene.add(this.obj);
    });
  }
}
