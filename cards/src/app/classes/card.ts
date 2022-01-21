import * as THREE from "three";
import * as CANNON from "cannon";
import { SceneObject } from "./sceneObject";

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
  private material: THREE.MeshStandardMaterial;
  private texture: THREE.Texture;

  public hidden: boolean = true;

  constructor(
    scene: THREE.Scene,
    world: CANNON.World,
    public id: CardId,
  ) {
    super(scene, world);
  }

  addToScene() {
    const loader = new THREE.TextureLoader();
    this.texture = loader.load(this.hidden ? `../../assets/card-back.png` : `../../assets/cards-front/${this.id}.png`);
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.texture.repeat.set(1, 1);
    this.texture.anisotropy = 16;
    this.texture.encoding = THREE.sRGBEncoding;

    this.geometry = new THREE.BoxGeometry(1, 0.01, 1.6);
    this.material = new THREE.MeshStandardMaterial({ map: this.texture });
    this.obj = new THREE.Mesh(this.geometry, this.material);
    this.obj.position.set(0, 1, 0);

    this.body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 1, 0),
      shape: new CANNON.Box(new CANNON.Vec3(1, 0.01, 1.6)),
    });

    this.body.quaternion.setFromEuler(0, 0, 0);
    this.world.addBody(this.body);
    this.scene.add(this.obj);
  }

  flip() {
  }

  render(): void {
      super.render();

      if (this.hidden) {
        // update texture
        this.texture.needsUpdate = true;
      }
  }

  clicked() {
    super.clicked();

    if (this.selected) {
      this.material.color.set(0x8ddff0);
    } else {
      this.material.color.set(0xffffff);
    }

    console.log(this.id, this.selected);
  }
}
