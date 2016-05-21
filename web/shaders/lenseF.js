export default `precision mediump float;

uniform sampler2D tex_sampler;

uniform vec2 control_pos;
uniform float distort;
varying vec2 tex_coord;
varying vec2 vUv;

void main(void)
{
    
    vec2 delta = tex_coord - control_pos/512.0;
    float dist = distance(tex_coord, control_pos/512.0);
    vec3 norm = normalize(vec3(delta.x, delta.y, sqrt(0.15 - delta.x*delta.x - delta.y*delta.y)));

    float factor = smoothstep(dist, 0.302, 0.3) * step(dist, 0.3);
    float shadow_factor = smoothstep(dist, 0.382, 0.33) * step(dist, 0.38) * step(0.3, dist);
    vec3 refr_r = refract(vec3(0.0, 0.0, -1.0), norm, (1.0/1.150));
    vec3 refr_y = refract(vec3(0.0, 0.0, -1.0), norm, (1.0/1.153));
    vec3 refr_g = refract(vec3(0.0, 0.0, -1.0), norm, (1.0/1.156));
    vec3 refr_c = refract(vec3(0.0, 0.0, -1.0), norm, (1.0/1.159));
    vec3 refr_b = refract(vec3(0.0, 0.0, -1.0), norm, (1.0/1.162));
    vec3 refr_p = refract(vec3(0.0, 0.0, -1.0), norm, (1.0/1.165));

    float r = texture2D(tex_sampler, refr_r.xy + tex_coord).x * 0.5;
    float y = (texture2D(tex_sampler, refr_y.xy + tex_coord).x * 2.0 +
               texture2D(tex_sampler, refr_y.xy + tex_coord).y * 2.0 -
               texture2D(tex_sampler, refr_y.xy + tex_coord).z)/6.0;
    float g = texture2D(tex_sampler, refr_g.xy + tex_coord).y * 0.5;
    float c = (texture2D(tex_sampler, refr_c.xy + tex_coord).y * 2.0 +
               texture2D(tex_sampler, refr_c.xy + tex_coord).z * 2.0 -
               texture2D(tex_sampler, refr_c.xy + tex_coord).x)/6.0;
    float b = texture2D(tex_sampler, refr_b.xy + tex_coord).z * 0.5;
    float p = (texture2D(tex_sampler, refr_p.xy + tex_coord).z * 2.0 +
               texture2D(tex_sampler, refr_p.xy + tex_coord).x * 2.0 -
               texture2D(tex_sampler, refr_p.xy + tex_coord).y)/6.0;

    float R = r + (2.0*p + 2.0*y - c)/3.0;
    float G = g + (2.0*y + 2.0*c - p)/3.0;
    float B = b + (2.0*c + 2.0*p - y)/3.0;

    vec3 color = texture2D(tex_sampler, tex_coord).xyz * (1.0 - factor);
    color += vec3(R,G,B) * (factor);

    color -= vec3(shadow_factor*0.2);
    
    gl_FragColor = mix( 
        vec4(mix(vec3(1.0, 0.0, 0.0), color, 0.0), 0.5),
        texture2D(tex_sampler, vUv),
        distort
    );
}`;
