import { Injectable } from '@angular/core';
import * as THREE from 'three';


@Injectable({
  providedIn: 'root'
})
export class RendererService {
  private renderer: THREE.WebGLRenderer;


  constructor() {
    this.createRenderer();
  }

  public createRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
     });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  public render(scene: THREE.Scene, camera: THREE.Camera): void {
    this.renderer.render(scene, camera);
  }

  public get canvas(): HTMLCanvasElement {
    return document.getElementById('canvas') as HTMLCanvasElement;
  }

  public get domElement(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

}
