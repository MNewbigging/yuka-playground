import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class AssetManager {
  textures = new Map();

  private loadingManager = new THREE.LoadingManager();
  load(): Promise<void> {
    const textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.loadTextures(textureLoader);

    const gltfLoader = new GLTFLoader(this.loadingManager);
    this.loadModels(gltfLoader);

    return new Promise((resolve) => {
      this.loadingManager.onLoad = () => {
        resolve();
      };
    });
  }

  private loadTextures(textureLoader: THREE.TextureLoader) {
    const hdriUrl = new URL("/textures/orchard_cartoony.hdr", import.meta.url)
      .href;
    const hdriTexture = textureLoader.load(hdriUrl);
    hdriTexture.matrixAutoUpdate = false;
    this.textures.set("hdri", hdriTexture);
  }

  private loadModels(gltfLoader: GLTFLoader) {
    const levelUrl = new URL("/models/level.glb", import.meta.url).href;
    gltfLoader.load(levelUrl, (gltf) => {
      const renderComponent = gltf.scene;
      renderComponent.matrixAutoUpdate = false;
      renderComponent.updateMatrix();

      renderComponent.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.matrixAutoUpdate = false;
          child.updateMatrix();
        }
      });
    });
  }
}
