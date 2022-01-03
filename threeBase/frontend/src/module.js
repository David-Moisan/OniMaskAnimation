import * as THREE from "three";
import { DoubleSide } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import vertex from "/static/shaders/vertex.glsl";
import fragment from "/static/shaders/fragment.glsl";
import sky from "/static/source/sky.jpg";

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );
    this.camera.position.set(0, 0, 1);
    this.controller = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.isPlaying = true;

    this.addObject();
    this.resize();
    this.setupResize();
    this.render();

    this.loader = new GLTFLoader();

    this.loader.load("/static/source/model/scene.gltf", (gltf) => {
      this.scene.add(gltf.scene);
      this.model = gltf.scene;
      gltf.scene.traverse((o) => {
        if (o.isMesh) {
          o.geometry.center();
          o.scale.set(0.01, 0.01, 0.01);
          o.material = this.material;
        }
      });
    });
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.camera.updateProjectionMatrix();
  }

  addObject() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        sky: { type: "t", value: new THREE.TextureLoader().load(sky) },
        resolution: { type: "v4", value: new THREE.Vector4() },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    //this.geometry = new THREE.PlaneGeometry(1,1,1,1);

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

