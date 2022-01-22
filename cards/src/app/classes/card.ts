import * as THREE from "three";
import * as CANNON from "cannon";
import { SceneObject } from "./sceneObject";
import { AnimationService } from "../services/animation.service";

export const CardColor  = {
  YELLOW: 'Y',
  RED: 'R',
  BLUE: 'G',
  GREEN: 'B',
} as const;

export const CardType = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,


  SKIP: 'skip',
  REVERSE: '_',
  DRAW_TWO: 'D2',
} as const;

export const WildCard = {
  WILD: 'W',
  WILD_DRAW_FOUR: 'D4W',
} as const

type ValueOf<T> = T[keyof T];


export type CardId = `${ValueOf<typeof CardType>}${ValueOf<typeof CardColor>}` | ValueOf<typeof WildCard>;

export class Card extends SceneObject{

  private geometry: THREE.BoxGeometry;
  private materials: THREE.MeshStandardMaterial[] = [];
  private texture: THREE.Texture;

  public hidden: boolean = true;

  private back: THREE.Texture;
  private front: THREE.Texture;

  constructor(
    scene: THREE.Scene,
    world: CANNON.World,
    public id: CardId,
  ) {
    super(scene, world);
  }

  addToScene() {
    this.loadTexture();

    this.geometry = new THREE.BoxGeometry(1, 0.01, 1.6);

    this.obj = new THREE.Mesh(this.geometry, this.materials);
    this.obj.position.set(0, 1, 0);

    this.body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 1, 0),
      shape: new CANNON.Box(new CANNON.Vec3(1, 0.01, 1.6)),
    });

    // this.obj.receiveShadow = true;
    // this.obj.castShadow = true;

    this.body.quaternion.setFromEuler(0, 0, 0);
    this.world.addBody(this.body);
    this.scene.add(this.obj);
  }

  private loadTexture() {
    const loader = new THREE.TextureLoader();
    this.front = loader.load(`../../assets/cards-front/${this.id}.png`);
    this.back = loader.load(`../../assets/card-back.png`);
    this.texture = this.hidden ? this.back : this.front;
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.texture.repeat.set(1, 1);
    this.texture.anisotropy = 16;
    this.texture.encoding = THREE.sRGBEncoding;

    this.materials.push(new THREE.MeshStandardMaterial({ color: 0xFFFFFF }));
    this.materials.push(new THREE.MeshStandardMaterial({ color: 0xFFFFFF }));
    this.materials.push(new THREE.MeshStandardMaterial({ map: this.texture }));
    this.materials.push(new THREE.MeshStandardMaterial({ map: this.texture }));
    this.materials.push(new THREE.MeshStandardMaterial({ color: 0xFFFFFF }));
    this.materials.push(new THREE.MeshStandardMaterial({ color: 0xFFFFFF }));
  }


  flip() {
    if (this.hidden) {
      this.texture.image.src = `../../assets/cards-front/${this.id}.png`;
    } else {
      this.texture.image.src = `../../assets/card-back.png`;
    }

    this.texture.needsUpdate = true;
    this.hidden = !this.hidden;
  }

  clicked() {
    super.clicked();

    if (this.selected) {
      this.materials.forEach(m => m.color.set(0x8ddff0));
    } else {
      this.materials.forEach(m => m.color.set(0xffffff));
    }

    console.log(this.id, this.selected);
  }
}
