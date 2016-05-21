import THREE from 'three';
const bump = require('../textures/crystal.jpg');
import refractionF from '../shaders/refractionF';

class Particle extends THREE.Mesh {

    constructor() {
        const geo = new THREE.CylinderBufferGeometry(0, 30, 500, 3, 1, true);
        geo.translate(0, 250, 0);

        const renderTarget = new THREE.WebGLRenderTarget(1024, 1024);

        const mat = new THREE.ShaderMaterial({
            uniforms: {
                tex_bump: { value: new THREE.TextureLoader().load(bump) },
                tex_scene: { value: renderTarget },
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

        this.renderTarget = renderTarget;
        this.material = mat;
    }
}

export default Particle;
