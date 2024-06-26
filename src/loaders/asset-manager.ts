import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

export class AssetManager {
  textures = new Map();
  models = new Map();

  private loadingManager = new THREE.LoadingManager();

  load(): Promise<void> {
    const rgbeLoader = new RGBELoader(this.loadingManager);
    this.loadTextures(rgbeLoader);

    const gltfLoader = new GLTFLoader(this.loadingManager);
    this.loadModels(gltfLoader);

    return new Promise((resolve) => {
      this.loadingManager.onLoad = () => {
        resolve();
      };
    });
  }

  private loadTextures(rgbeLoader: RGBELoader) {
    const hdriUrl = new URL("/textures/orchard_cartoony.hdr", import.meta.url)
      .href;
    const hdriTexture = rgbeLoader.load(hdriUrl);
    hdriTexture.matrixAutoUpdate = false;
    hdriTexture.mapping = THREE.EquirectangularReflectionMapping;
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

      this.models.set("level", renderComponent);
    });
  }
}
