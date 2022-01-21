import { Card, CardColor, CardId, CardType, WildCard } from "./card";
import * as THREE from "three";
import * as CANNON from "cannon";
import { SceneObject } from "./sceneObject";
import { sceneObjects } from "../components/world/world.component";

export class Deck extends SceneObject{

  public cards: Card[] = [];

  private geometry: THREE.BoxGeometry;
  private material: THREE.MeshStandardMaterial;
  private texture: THREE.Texture;

  constructor(scene: THREE.Scene, world: CANNON.World) {
    super(scene, world);

    this.createDeck();
  }

  public createDeck() {
    this.cardIds
      .sort(() => Math.random() - 0.5)
      .forEach(id => {
        this.cards.push(
          new Card(
            this.scene,
            this.world,
            id,
          )
        );
      });
  }

  addToScene(): void {
    const loader = new THREE.TextureLoader();
    this.texture = loader.load(`../../assets/card-back.png`);
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.texture.repeat.set(1, 1);
    this.texture.anisotropy = 16;
    this.texture.encoding = THREE.sRGBEncoding;

    this.geometry = new THREE.BoxGeometry(1, 1, 1.6);
    this.material = new THREE.MeshStandardMaterial({ map: this.texture });
    this.obj = new THREE.Mesh(this.geometry, this.material);
    this.obj.position.set(10, 1, 0);
    this.obj.castShadow = true;

    this.body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(-3, 1, 0),
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1.6)),
    });

    this.body.quaternion.setFromEuler(0, 0, 0);
    this.world.addBody(this.body);
    this.scene.add(this.obj);
  }

  clicked(): void {
    let card = this.inactiveCards[0];
    console.log(card?.id)
    if (card) {
      card.addToScene();
      sceneObjects.push(card);
    }
  }

  get cardIds(): CardId[] {
    return Object.values(CardType)
      .flatMap(t => Object.values(CardColor).map(c => `${t}${c}`))
      .concat(Object.values(WildCard)) as CardId[];
  }

  get activeCards(): Card[] {
    return this.cards.filter(c => c.rendered);
  }

  get inactiveCards(): Card[] {
    return this.cards.filter(c => !c.rendered);
  }

}
