import html from '../index.html';
import styles from '../css/style.css';
import THREE from 'three';
const scene = require('../textures/checkerboard.png');
const skyTex = require('../textures/sky.jpg');
global.THREE = THREE;
import Particle from './particle';
require('three/examples/js/controls/OrbitControls');
import Stats from 'three/examples/js/libs/stats.min';
const dat = require('exports?dat!three/examples/js/libs/dat.gui.min');
import audioWave from './audioWave';

const sound = require('../sound.mp4');


const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

class App {

    constructor() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75,
            window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 1000;

        this.stars = [];

        for (let i = 0, l = 4; i < l; i++) {
            this.stars[i] = this.buildStar();
            this.scene.add(this.stars[i]);
        }

        /*
        const geometry = new THREE.BoxBufferGeometry(5000, 5000, 5000);
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.BackSide,
            map: new THREE.TextureLoader().load(scene),
        });
        const cube = new THREE.Mesh(geometry, this.material);
        cube.position.set(0, 0, 0);
        this.scene.add(cube);
        */

        /*
        const light = new THREE.DirectionalLight(0xffffff);

        light.position.set(0, 100, 60);
        light.castShadow = true;
        light.shadow.camera.left = -60;
        light.shadow.camera.top = -60;
        light.shadow.camera.right = 60;
        light.shadow.camera.bottom = 60;
        light.shadow.camera.near = 1;
        light.shadow.camera.far = 1000;
        light.shadow.bias = -.0001
        light.shadow.mapSize.width = light.shadow.mapSize.height = 1024;

        this.scene.add(light);
        */

        // this.light = new THREE.DirectionalLight(0xffffff, 1);
        // this.scene.add(this.light);
        // this.light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.5);
        // this.scene.add(this.light);

        /*
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, 512, 512);
        gradient.addColorStop(0, '#111166');
        gradient.addColorStop(1, '#333399');

        ctx.fillStyle = gradient;
        ctx.rect(0, 0, 512, 512);
        ctx.fill();

        const shadowTexture = new THREE.Texture(canvas);
        shadowTexture.needsUpdate = true;
        */

        /*
        const skyGeo = new THREE.SphereGeometry(5000, 25, 25);
        this.sky = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(skyTex),
        }));
        this.sky.material.side = THREE.BackSide;
        this.scene.add(this.sky);
        */

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('canvas'),
            antialias: true,
            stencil: false,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // let controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        this.render = this.render.bind(this);
        this.resize = this.resize.bind(this);
        this.bindEvents = this.bindEvents.bind(this);
        this.update = this.update.bind(this);

        this.bindEvents();

        this.audioReady = false;
        this.audioWave = new audioWave();

        this.audioWave.inputStream(sound, 2048);
        this.audioReady = true;

        this.angle = 0;

        this.render();

        this.params = {
            color1: 0xFF4400,
            color2: 0xFF4400,
            color3: 0xFF4400,
            color4: 0xFF4400,
            intensity: 0.45,
            scale: 0.03,
            opacity: 0.9,
            fresnel: 1,
            fresnelBias: 0.2,
            fresnelPow: 5,
        };

        const gui = new dat.GUI();
        const color = gui.addColor(this.params, 'color1');
        color.onChange((v) => {
            for (const child of this.stars[0].cones) {
                child.emissive = new THREE.Color(v);
            }
        });
        const color2 = gui.addColor(this.params, 'color2');
        color2.onChange((v) => {
            for (const child of this.stars[1].cones) {
                child.emissive = new THREE.Color(v);
            }
        });
        const color3 = gui.addColor(this.params, 'color3');
        color3.onChange((v) => {
            for (const child of this.stars[2].cones) {
                child.emissive = new THREE.Color(v);
            }
        });
        const color4 = gui.addColor(this.params, 'color4');
        color4.onChange((v) => {
            for (const child of this.stars[3].cones) {
                child.emissive = new THREE.Color(v);
            }
        });

        const r = gui.addFolder('refraction');
        r.open();
        const refraction = r.add(this.params, 'intensity', 0, 1);
        refraction.onChange((v) => {
            for (const star of this.stars) {
                for (const child of star.cones) {
                    child.material.uniforms.refraction.value = v;
                }
            }
        });
        const opacity = gui.add(this.params, 'opacity', 0, 1);
        opacity.onChange((v) => {
            for (const star of this.stars) {
                for (const child of star.cones) {
                    child.material.uniforms.opacity.value = v;
                }
            }
        });
        const refractionIntensity = r.add(this.params, 'scale', 0, 0.1);
        refractionIntensity.onChange((v) => {
            for (const star of this.stars) {
                for (const child of star.cones) {
                    child.material.uniforms.vScale.value = new THREE.Vector2(v, v);
                }
            }
        });
        const fresnel = gui.add(this.params, 'fresnel', 0, 1);
        fresnel.onChange((v) => {
            for (const star of this.stars) {
                for (const child of star.cones) {
                    child.material.uniforms.fresnelMix.value = v;
                }
            }
        });
        const fresnelBias = gui.add(this.params, 'fresnelBias', 0, 1);
        fresnelBias.onChange((v) => {
            for (const star of this.stars) {
                for (const child of star.cones) {
                    child.material.uniforms.fresnelBias.value = v;
                }
            }
        });
        const fresnelPow = gui.add(this.params, 'fresnelPow', 0, 10);
        fresnelPow.onChange((v) => {
            for (const star of this.stars) {
                for (const child of star.cones) {
                    child.material.uniforms.fresnelPow.value = v;
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) {
                this.toggleFullScreen();
            }
        });
    }

    bindEvents() {
        window.addEventListener('resize', this.resize);
    }

    buildStar() {
        const obj = new THREE.Object3D();

        obj.cones = [];

        obj.position.set(
            500 - Math.random() * 1000,
            500 - Math.random() * 1000,
            500 - Math.random() * 1000
        );

        for (let i = 0; i < 10; i++) {
            const particle = new Particle();
            particle.rotation.set(
                Math.PI * Math.random(),
                Math.PI * Math.random(),
                Math.PI * Math.random()
            );
            // particle.camera.position.copy(obj.position);
            // this.scene.add(new THREE.CameraHelper(particle.camera));
            obj.add(particle);
            obj.cones.push(particle);
        }

        return obj;
    }

    toggleFullScreen() {
      if (!document.fullscreenElement &&    // alternative standard method
          !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    }

    resize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        for (let star of this.stars) {
            for (const child of star.cones) {
                child.material.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
            }
        }
    }

    update() {
        if (this.audioReady) {
            const wave = this.audioWave.getWave();
            const audioData = [];
            const buckets = this.stars.length;
            for (let i = 0, l = buckets; i < l; i++) {
                audioData[i] = 0;
                const length = Math.floor(wave.length / buckets / 2);
                for (let j = i * length, l2 = (i + 1) * length; j < l2; j++) {
                    audioData[i] += wave[j];
                }
                audioData[i] /= length;
            }
            // window.console.log(audioData);
            let i = 0;
            for (const star of this.stars) {
                const v = audioData[i] / 255;
                star.rotation.y += 10 * v * Math.PI / 360;
                star.rotation.x += 10 * v * Math.PI / 360;
                for (const child of star.cones) {
                    child.scale.setY(0.1 + 0.9 * v);
                    // child.material.uniforms.refraction.value = 0.65 * v;
                    child.emissive.offsetHSL(v * 0.001, 0, 0);
                    child.material.uniforms.emissive.value.copy(child.emissive).multiplyScalar(4 * v);
                }
                i++;
            }

            this.angle -= audioData[0] / 255 * Math.PI / 360;
            const p = this.camera.position;
            p.x = 1000 * Math.sin(this.angle);
            p.z = 1000 * Math.cos(this.angle);
            this.camera.lookAt(this.scene.position);
            this.camera.updateProjectionMatrix();
        }

        const stars = this.stars.slice();

        stars.sort((a, b) => {
            const pb = b.getWorldPosition();
            pb.project(this.camera);
            const pa = a.getWorldPosition();
            pa.project(this.camera);
            return pb.z - pa.z;
        });

        for (const star of stars) {
            star.visible = false;
        }

        //console.time('first pass');
        for (const star of stars) {
            const children = star.cones.slice();
            children.sort((a, b) => {
                b.translateY(250);
                const pb = b.getWorldPosition();
                b.translateY(-250);
                pb.project(this.camera);
                a.translateY(250);
                const pa = a.getWorldPosition();
                a.translateY(-250);
                pa.project(this.camera);
                return pb.z - pa.z;
            });

            star.visible = true;

            for (const child of children) {
                child.visible = false;
            }

            for (const child of children) {
                this.renderer.render(this.scene, this.camera, child.renderTarget);
                child.visible = true;
                // child.material.uniforms.offset.value.add(new THREE.Vector2(0.001, 0.001));
            }
        }
        //console.timeEnd('first pass');
    }

    render() {
        stats.begin();

        this.update();

        this.renderer.render(this.scene, this.camera);


        stats.end();

        requestAnimationFrame(this.render);
    }
}

const app = new App();
