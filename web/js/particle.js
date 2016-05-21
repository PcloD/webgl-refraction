import THREE from 'three';
const bump = require('../textures/crystal.jpg');
const scene = require('../textures/checkerboard.png');
import refractionF from '../shaders/refractionF';
//import distortShaderV from '../shaders/lenseV';

class Particle extends THREE.Mesh {

    constructor() {
        const geo = new THREE.CylinderBufferGeometry(0, 30, 500, 3, 1, true);
        geo.translate(0, 250, 0);

        //const cubeCamera = new THREE.CubeCamera(0.001, 1000, 256);
        //cubeCamera.renderTarget.texture.mapping = THREE.CubeRefractionMapping;
        //cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;

        //const renderTarget = new THREE.WebGLRenderTarget(512, 512);

        /*
        const t = new THREE.TextureLoader().load(texture, (tex) => {
            this.material.uniforms.tex_bump.value = tex;
            this.material.uniforms.tex_scene.value = tex;
        });
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(1, 5);
        */

        /*
        const mat = new THREE.MeshPhongMaterial({
            color: 0x000000,
            emissive: 0xFF4400,
            //emissiveMap: t,
            emissiveIntensity: 5,
            //map: cubeMap,
            //envMap: cubeCamera.renderTarget,
            refractionRatio: 0.98,
            alphaTest: 0,
            //reflectivity: 1,
            //roughness: 1,
            //envMapIntensity: 10,
            side: THREE.DoubleSide,
            combine: THREE.MixOperation,
        });
        mat.opacity = 0.9;
        mat.transparent = true;
        */

        const mat = new THREE.ShaderMaterial({
            uniforms: {
                tex_bump: { value: new THREE.TextureLoader().load(bump) },
                tex_scene: { value: new THREE.TextureLoader().load(scene) },
                vScale: { value: new THREE.Vector2(0.03, 0.03) },
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                emissive: { value: new THREE.Color(0xFF4400) },
                emissiveMap: { value: new THREE.TextureLoader().load(bump) },
                refraction: { value: 0.45 },
                opacity: { value: 0.9 },
            },
            vertexShader: [
                'varying vec2 vUv;',
                'void main() {',
                'vUv = uv;',
                'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
                '}',
            ].join('\n'),
            fragmentShader: refractionF,
        });
        mat.transparent = true;

        super(geo, mat);

        this.material = mat;
    }
}

export default Particle;
