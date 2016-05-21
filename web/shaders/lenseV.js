export default `attribute vec2 pos;

varying vec2 tex_coord;
varying vec2 vUv;

void main(void)
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    tex_coord = position.xy;
    vUv = uv;
}`;
