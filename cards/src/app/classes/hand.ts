import { Card } from "./card";
import { SceneObject } from "./sceneObject";
import { Group } from "./group";

export class Hand extends Group{

  public cards: Card[] = [];

  addToHand(card: Card) {
    this.addToGroup(card.obj);
    this.cards.push(card);
  }

  removeFromHand(card: Card) {
    this.removeFromGroup(card.obj);
    this.cards = this.cards.filter(c => c !== card);
  }
}
