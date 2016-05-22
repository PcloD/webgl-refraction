export default `// precision mediump float;

uniform sampler2D tex_bump;
uniform sampler2D tex_scene;
uniform sampler2D emissiveMap;
uniform vec2 vScale;
uniform vec2 resolution;
uniform vec3 emissive;
uniform float refraction;
uniform float opacity;
uniform vec2 offset;
uniform float fresnelMix;
uniform float fresnelBias;
uniform float fresnelPow;

varying vec2 vUv;
varying vec3 vEye;
varying vec3 vWorldNormal;

float Fresnel(const in float NdotL, const in float fresnelBias, const in float fresnelPow)

{

  float facing = (1.0 - NdotL);

  return max(fresnelBias +

             (1.0 - fresnelBias) * pow(facing, fresnelPow), 0.0);

}

void main(void)
{
    vec3 totalEmissiveRadiance = emissive;

    // fetch bump texture, unpack from [0..1] to [-1..1]

    vec4 bumpTex = 2.0 * texture2D(tex_bump, mod((vUv + offset) * vec2(4, 8), 1.0).xy) - 1.0;

    // displace texture coordinates

    vec2 ss = vec2(gl_FragCoord.x/resolution.x, gl_FragCoord.y/resolution.y);

    vec2 newUV = ss + bumpTex.xy * vScale;

    float NdotL = dot(vEye, vWorldNormal * vec3(0.07, 0.07, 1));

    float fresnel = Fresnel(1.0 - NdotL, fresnelBias, fresnelPow);

    vec3 refractionColor = ( (fresnel * fresnelMix) * texture2D(tex_scene, newUV)).rgb;

    //vec3 refractionColor = vec3(1.0 - fresnel, 1.0 - fresnel, 1.0 - fresnel);

    // fetch refraction map
    vec4 emissiveColor = texture2D( emissiveMap, mod(vUv * vec2(4, 8), 1.0) );

    totalEmissiveRadiance *= emissiveColor.rgb;

    vec3 color = mix(refractionColor, totalEmissiveRadiance, 1.0 - refraction);

    gl_FragColor = vec4(color, opacity);

}`;
