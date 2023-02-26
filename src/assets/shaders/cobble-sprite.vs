varying vec2 v_uv;
float dist;

void main() {
    v_uv = uv;
    
    vec4 cs = modelViewMatrix * vec4(position, 1.0f);
    vec4 t = projectionMatrix * cs;
    
    gl_Position = t; //projectionMatrix * cs;
}