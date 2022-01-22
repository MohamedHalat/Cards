import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { SceneObject } from '../classes/sceneObject';
import { CameraService } from './camera.service';
import { RendererService } from './renderer.service';
import { WorldService } from './world.service';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  private _scene: THREE.Scene;
  private _objects: SceneObject[] = [];

  constructor(
    private renderer: RendererService,
    public world: WorldService,
    private cameraService: CameraService,
  ) {
    this.createScene();
    this.lightScene();
  }

  createScene(): void {
    this._scene = new THREE.Scene();
  }

  private lightScene() {
    const pointLight = new THREE.PointLight(0xFFFFFF, 1, 1000);
    pointLight.position.set(20, 20, 20);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(pointLight, ambientLight);

    // const light = new THREE.SpotLight(0xffffff, 1.5);
    // light.position.set(220, 500, 10);
    // light.angle = Math.PI / 9;

    // light.castShadow = true;
    // light.shadow.camera.near = 1000;
    // light.shadow.camera.far = 2000;
    // light.shadow.mapSize.width = 1024;
    // light.shadow.mapSize.height = 1024;

    // this.scene.add(light);
  }

  addToScene(...obj: SceneObject[]): void {
    this.objects.push(...obj);
    this.scene.add(...obj.map(o => o.obj));
  }

  addObjectToScene(...obj: THREE.Object3D[]): void {
    this.scene.add(...obj);
    this.animate();
  }

  removeFromScene(...obj: SceneObject[]): void {
    this.objects = this.objects.filter(o => !obj.includes(o));
  }


  public animate() {
    this.world.step();

    this.objects.forEach(obj => obj.render());
    this.renderer.render(this.scene, this.cameraService.camera);

    console.log('tick');

    if (this.objects.some(obj => obj.needsUpdate())) {
      requestAnimationFrame(() => this.animate());
    }
  }

  get scene(): THREE.Scene {
    return this._scene;
  }

  get objects(): SceneObject[] {
    return this._objects;
  }

  set objects(value: SceneObject[]) {
    this._objects = value;
    this.animate();
  }

}
