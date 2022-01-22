import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  private _camera: THREE.Camera;

  constructor() {
    this.createCamera();
  }

  public createCamera(): void {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.copy(new THREE.Vector3(16, 13, -4));
    this.camera.position.setZ(30);
  }

  public get camera(): THREE.Camera {
    return this._camera;
  }

  public set camera(value: THREE.Camera) {
    this._camera = value;
  }

}
