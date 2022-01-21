import * as THREE from "three";
import * as CANNON from "cannon";
import { SceneObject } from "./sceneObject";

export enum CardColor {
  BLACK,
  YELLOW,
  RED,
  BLUE,
  GREEN,
}

export class Card extends SceneObject{

  private geometry: THREE.BoxGeometry;
  private material: THREE.MeshStandardMaterial;
  private texture: THREE.Texture;

  constructor(
    scene: THREE.Scene,
    world: CANNON.World,
    public type: string,
    public image: string,
  ) {
    super(scene, world);
  }

  addToScene() {
    const loader = new THREE.TextureLoader();
    this.texture = loader.load(`../../assets/${this.image}.jpeg`);
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.texture.repeat.set(1, 1);
    this.texture.anisotropy = 16;
    this.texture.encoding = THREE.sRGBEncoding;

    this.geometry = new THREE.BoxGeometry(1, 0.01, 1.6, 100);
    this.material = new THREE.MeshStandardMaterial({ map: this.texture });
    this.obj = new THREE.Mesh(this.geometry, this.material);
    this.obj.position.set(0, 1, 0);
    this.obj.castShadow = true;

    this.body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 1, 0),
      shape: new CANNON.Box(new CANNON.Vec3(1, 0.01, 1.6)),
    });

    this.body.quaternion.setFromEuler(0, 0, 0);
    this.world.addBody(this.body);
    this.scene.add(this.obj);
  }

  render() {
    this.obj.position.copy((this.body.position as any));
    this.obj.quaternion.copy((this.body.quaternion as any));
  }

  clicked() {
    super.clicked();

    if (this.selected) {
      this.material.color.set(0x8ddff0);
    } else {
      this.material.color.set(0xffffff);
    }

    console.log(this.type);
  }
}
