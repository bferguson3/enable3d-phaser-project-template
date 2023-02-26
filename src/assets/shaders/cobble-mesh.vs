varying vec2 v_uv;
float dist;

void main() {
    v_uv = uv;
    
    vec4 cs = modelViewMatrix * vec4(position, 1.0f);
    vec4 t = projectionMatrix * cs;
    
    // MESHES ONLY 
    dist = -cs.z;
    dist = 128.0f / dist;
    // MESHES ONLY
    t.x = floor(t.x * dist)/dist;
    t.y = floor(t.y * dist)/dist;
    //t.z = floor(t.z * 128.0)/128.0;
    // MESHES ONLY
    v_uv.x = floor(v_uv.x * dist)/dist;
    v_uv.y = floor(v_uv.y * dist)/dist;
    
    gl_Position = t; //projectionMatrix * cs;
}