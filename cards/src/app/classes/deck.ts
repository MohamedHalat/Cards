import { Card, CardColor, CardId, CardType, WildCard } from "./card";
import * as THREE from "three";
import * as CANNON from "cannon";
import { SceneObject } from "./sceneObject";
import { Hand } from "./hand";
import { SceneService } from "../services/scene.service";

export class Deck extends SceneObject{

  public cards: Card[] = [];

  private geometry: THREE.BoxGeometry;
  private materials: THREE.MeshStandardMaterial[] = [];
  private texture: THREE.Texture;

  constructor(
    protected scene: SceneService,
  ) {
    super(scene);

    this.createDeck();
  }

  public createDeck() {
    this.cards = this.cardIds
      .sort(() => Math.random() - 0.5)
      .map(id => {
        return new Card(
          this.scene,
          id,
        );
      });
  }

  render(): void {
    this.rendered = true;
  }

  addToScene(): void {
    this.createTexture();
    this.obj = new THREE.Mesh(this.geometry, this.materials);
    this.obj.position.set(3, 0.5, 2);

    this.body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(3, 2, 2),
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1.6)),
    });

    // this.obj.receiveShadow = true;
    // this.obj.castShadow = true;

    this.body.quaternion.setFromEuler(0, 0, 0);
    this.world.addToWorld(this.body);
    this.scene.addToScene(this);
  }

  private createTexture() {
    const loader = new THREE.TextureLoader();
    this.texture = loader.load(`../../assets/card-back.png`);
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.set(1, 1);
    this.texture.anisotropy = 16;
    this.texture.encoding = THREE.sRGBEncoding;

    this.geometry = new THREE.BoxGeometry(1, 1, 1.6);
    this.materials.push(new THREE.MeshStandardMaterial({ color: 0xFFFFFF }));
    this.materials.push(new THREE.MeshStandardMaterial({ color: 0xFFFFFF }));
    this.materials.push(new THREE.MeshStandardMaterial({ map: this.texture }));
    this.materials.push(new THREE.MeshStandardMaterial({ map: this.texture }));
    this.materials.push(new THREE.MeshStandardMaterial({ color: 0xFFFFFF }));
    this.materials.push(new THREE.MeshStandardMaterial({ color: 0xFFFFFF }));
  }

  clicked(): void {
    let card = this.inactiveCards[0];
    if (card) {
      card.addToScene();

      this.geometry.scale(1, 1/ ((this.inactiveCards.length + 1)/this.cards.length), 1);
      this.geometry.scale(1, this.inactiveCards.length / this.cards.length, 1);
      this.obj.position.y = this.obj.position.y - this.inactiveCards.length / (this.cards.length * 75);
    } else {
      this.removeFromScene();
    }
  }

  addToHand(hand: Hand) {
    let cards = this.cards.filter(c => c.selected);
    cards.forEach(c => {
      c.removeFromScene();
      hand.addToHand(c);
      c.selected = false;
    });

    console.log(hand.cards);
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
