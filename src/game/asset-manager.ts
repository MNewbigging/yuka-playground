import * as YUKA from "yuka";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { NavMeshLoaderOptions } from "yuka/src/navigation/navmesh/NavMeshLoader";

export class AssetManager {
  textures = new Map();
  models = new Map();
  navmesh!: YUKA.NavMesh; // this ! beats a whole load of if statements elsewhere (remind me why i'm using ts again?)

  private loadingManager = new THREE.LoadingManager();

  load(): Promise<void> {
    const rgbeLoader = new RGBELoader(this.loadingManager);
    this.loadTextures(rgbeLoader);

    const gltfLoader = new GLTFLoader(this.loadingManager);
    this.loadModels(gltfLoader);

    this.loadNavmesh();

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

  private loadNavmesh() {
    const navmeshLoader = new YUKA.NavMeshLoader();

    this.loadingManager.itemStart("navmesh");

    const url = new URL("/models/navmesh.gltf", import.meta.url).href;

    navmeshLoader.load(url).then((navmesh) => {
      this.navmesh = navmesh;
      this.loadingManager.itemEnd("navmesh");
    });
  }
}
