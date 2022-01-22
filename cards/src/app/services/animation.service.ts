import { Injectable } from '@angular/core';
import * as THREE from 'three';
import * as CANNON from 'cannon';
import { sceneObjects } from '../components/world/world.component';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  public world: CANNON.World;
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  private animationFrame: number;

  constructor() {}


  public animate() {
    this.world.step(1 / 60);

    sceneObjects.forEach(obj => obj.render());
    this.renderer.render(this.scene, this.camera);

    console.log('tick');

    if (sceneObjects.some(obj => obj.needsUpdate())) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
    } else if (this.animationFrame) {
      // cancelAnimationFrame(this.animationFrame);
    }
  }
}
