import { Scene3D } from "@enable3d/phaser-extension";
import * as THREE from "three";

export default class MainScene extends Scene3D 
{
	private newMat : THREE.ShaderMaterial;
	private cube : THREE.Mesh;

	constructor() 
	{
		super({ key: "MainScene" });
	}

	init() : void 
	{
		this.accessThirdDimension();
	}

	create() : void
	{
		// scene template
		this.third.warpSpeed();

		const vertexSrc = `
        varying vec2 v_uv;
        float dist;
        
        void main() {
            v_uv = uv;
            
            vec4 cs = modelViewMatrix * vec4(position, 1.0f);
            
            dist = -cs.z;
            dist = 128.0f / dist;
            
            vec4 t = projectionMatrix * cs;
            
            t.x = floor(t.x * dist)/dist;
            t.y = floor(t.y * dist)/dist;
            t.z = floor(t.z * dist)/dist;
            v_uv.x = floor(v_uv.x * dist)/dist;
            v_uv.y = floor(v_uv.y * dist)/dist;
           
            gl_Position = t; //projectionMatrix * cs;
        }`;

		const fShader = `
        varying vec2 v_uv;
        uniform sampler2D map;
        uniform float u_time;
        
        void main() {
            
            vec4 tex = texture2D( map, v_uv );
            
            gl_FragColor = tex;
            
        }
        `;

		const uniforms2 = {
			u_time: { value: 0.0 },
			map: { value: null }
		};
		const grass = new THREE.TextureLoader().load("assets/img/phaser-logo.png");
		grass.minFilter = THREE.NearestFilter;
		grass.magFilter = THREE.NearestFilter;
		uniforms2.map.value = grass;
		
		this.newMat = new THREE.ShaderMaterial({
			uniforms: uniforms2,
			vertexShader: vertexSrc,
			fragmentShader: fShader,
			side: THREE.FrontSide,
		});
		const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
		
		this.cube = new THREE.Mesh(geometry, this.newMat);
		this.cube.position.set(0, 2.25, 0);

		this.third.physics.scene.add(this.cube);
		this.third.physics.add.existing(this.cube);
	}

	update() : void
	{
		return;
	}
}
