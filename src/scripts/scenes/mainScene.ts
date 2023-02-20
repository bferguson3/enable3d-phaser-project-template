import { Scene3D } from "@enable3d/phaser-extension";
import * as THREE from "three";

export default class MainScene extends Scene3D 
{
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

		// Uniform Texture
		const grass = new THREE.TextureLoader().load("assets/img/phaser-logo.png");
		grass.minFilter = THREE.NearestFilter;
		grass.magFilter = THREE.NearestFilter;
		
		global.cobbleMaterial.uniforms.map.value = grass;
		
		// Vertices
		const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
		
		// Create final model object
		this.cube = new THREE.Mesh(geometry, global.cobbleMaterial);
		this.cube.position.set(0, 2.25, 0);
		
		// Add to scene and to physics engine 
		this.third.physics.scene.add(this.cube);
		this.third.physics.add.existing(this.cube);
	}

	update() : void
	{
		return;
	}
}
