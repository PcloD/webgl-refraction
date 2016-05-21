export default `// precision mediump float;

uniform sampler2D tex_bump;
uniform sampler2D tex_scene;
uniform sampler2D emissiveMap;
uniform vec2 vScale;
uniform vec2 resolution;
uniform vec3 emissive;
uniform float refraction;
uniform float opacity;

varying vec2 vUv;

void main(void)
{
    vec3 totalEmissiveRadiance = emissive;

    // fetch bump texture, unpack from [0..1] to [-1..1]

    vec4 bumpTex = 2.0 * texture2D(tex_bump, mod(vUv * vec2(4, 8), 1.0).xy) - 1.0;

    // displace texture coordinates

    vec2 ss = vec2(gl_FragCoord.x/resolution.x, gl_FragCoord.y/resolution.y);

    vec2 newUV = ss + bumpTex.xy * vScale;

    // fetch refraction map
    vec4 emissiveColor = texture2D( emissiveMap, mod(vUv * vec2(4, 8), 1.0) );

    emissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;

    totalEmissiveRadiance *= emissiveColor.rgb;

    vec3 color = mix(texture2D(tex_scene, newUV).rgb, totalEmissiveRadiance, 1.0 - refraction);

    gl_FragColor = vec4(color, opacity);

}`;
