varying vec2 v_uv;
uniform sampler2D map;
uniform float u_time;

void main() {
    
    vec4 tex = texture2D( map, v_uv );
    
    gl_FragColor = tex;
    
}