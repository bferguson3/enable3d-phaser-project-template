import { Scene3D } from "@enable3d/phaser-extension";
import * as THREE from "three";
//import { Phaser.Input.Keyboard.CursorKeys };

export default class MainScene extends Scene3D 
{
	private cube : THREE.Mesh;
	private camera : THREE.PerspectiveCamera | THREE.OrthographicCamera;
	private ground : THREE.ExtendedObject3D;
	private mylights : {
        ambientLight: THREE.AmbientLight
        directionalLight: THREE.DirectionalLight
        hemisphereLight: THREE.HemisphereLight
      };
	private orbitControls : THREE.OrbitControls;
	private loadDone : boolean;
	// camera 
	private cameraFocus : THREE.Vector3;
	private cameraAngle : number;
	private forwardVector : THREE.Vector3;
	private rightVector : THREE.Vector3;
	// controls 
	private inputkeys : Phaser.Types.Input.Keyboard.CursorKeys;
	private qkey : any;
	private ekey : any;
	
	
	constructor() 
	{
		super({ key: "MainScene" });
	}

	async getStuff() : Promise<void>
	{
		let features: {
			camera?: THREE.PerspectiveCamera | THREE.OrthographicCamera,
			lights?: {
				ambientLight: THREE.AmbientLight
				directionalLight: THREE.DirectionalLight
				hemisphereLight: THREE.HemisphereLight
			},
			ground?: THREE.ExtendedObject3D,
			orbitControls?: THREE.OrbitControls,
		} = {};
		features = await this.third.warpSpeed();
		this.camera = features.camera;
		this.camera.position.z = 9;
		this.orbitControls = features.orbitControls;
		this.orbitControls.enabled = false;
		//features.orbitControls.autoRotate = true;
		//features.orbitControls.autoRotateSpeed = 15.0;
		this.loadDone = true;
		
	}

	preload() : void
	{
		this.loadDone = false;
		this.accessThirdDimension();
		// scene template
		this.getStuff();
		
		// UI test 
		this.load.image("test", "assets/img/monktest2.png");
		
		// cameraFocus 
		this.cameraFocus = new THREE.Vector3(0, 0, 0);
		//this.camera = features.camera;
	}

	create() : void
	{
		// sine rules etc.
		this.cameraAngle = -90;
		this.forwardVector = new THREE.Vector3(0, 0, 1);
		const newAngle = this.degToRad(this.cameraAngle); // 1 degree
		const newX = this.cameraFocus.x + (Math.cos(newAngle) * 9);
		const newY = this.cameraFocus.z + (Math.sin(newAngle) * 9);
		this.camera.position.x = newX;
		this.camera.position.z = newY;

		// Uniform Texture
		const grass = new THREE.TextureLoader().load("assets/img/monktest1.png");
		grass.minFilter = THREE.NearestFilter;
		grass.magFilter = THREE.NearestFilter;
		
		global.cobbleSpriteMaterial.uniforms.map.value = grass;
		
		// Vertices
		const geometry = new THREE.PlaneGeometry(1, 1.2);
		const q2g = new THREE.BoxGeometry(1, 1, 1);
		// Create final model object
		this.cube = new THREE.Mesh(geometry, global.cobbleSpriteMaterial);
		this.cube.position.y = 0.75;
		
		// Add to scene and to physics engine 
		this.third.scene.add(this.cube);
		
		const q2 = new THREE.Mesh(q2g, global.cobbleMeshMaterial);
		q2.position.x = -2;
		q2.position.z = -2;
		q2.position.y = 0.75;
		this.third.scene.add(q2);

		// Phaser level 2D / UI 
		this.add.sprite(100, 100, "test");

		//input 
		this.inputkeys = this.input.keyboard.createCursorKeys();
		
		// set forward
		this.forwardVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.degToRad(0));
		
		// camera controls
		this.qkey = this.input.keyboard.addKey("Q", true, true);
		this.ekey = this.input.keyboard.addKey("E", true, true);

	}

	degToRad(n) : number
	{
		return (3.14159 / 180) * n;
	}

	radToDeg(n) : number
	{
		return (180 * n) / 3.14159;
	}

	cameraInput() : void
	{
		// orbit x/z around focus 
		if(this.qkey.isDown)
		{
			this.cameraAngle -= 2;
			const newAngle = this.degToRad(this.cameraAngle); // 1 degree
			const newX = this.cameraFocus.x + (Math.cos(newAngle) * 9);
			const newY = this.cameraFocus.z + (Math.sin(newAngle) * 9);
			this.camera.position.x = newX;
			this.camera.position.z = newY;
			// rotate forward vector along Y axis by 1 degree
			this.forwardVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.degToRad(-2));

			//console.log(this.forwardVector);
		}
		else if(this.ekey.isDown)
		{
			this.cameraAngle += 2;
			const newAngle = this.degToRad(this.cameraAngle); // 1 degree
			const newX = this.cameraFocus.x + (Math.cos(newAngle) * 9);
			const newY = this.cameraFocus.z + (Math.sin(newAngle) * 9);
			this.camera.position.x = newX;
			this.camera.position.z = newY;
			// rotate forward vector
			this.forwardVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.degToRad(2));

			//console.log(this.forwardVector);
		}
		// for left/right movement:
		this.rightVector = new THREE.Vector3(this.forwardVector.z, this.forwardVector.y, -this.forwardVector.x);
		// re-center camera:
		this.camera.lookAt(this.cameraFocus);
		
	}

	characterMovement() : void 
	{
		// speed ? 
		let spd = 0.15;
		let walkkeys = 0;
		if(this.inputkeys.up.isDown)
			walkkeys++;
		else if(this.inputkeys.down.isDown)
			walkkeys++;
		if(this.inputkeys.left.isDown)
			walkkeys++;
		else if(this.inputkeys.right.isDown)
			walkkeys++;
		if(walkkeys == 2) spd *= 0.71;

		// movement based on forward vector 
		if(this.inputkeys.up.isDown)
		{
			this.camera.position.x -= this.forwardVector.x * spd;
			this.camera.position.z += this.forwardVector.z * spd;
			
			this.cube.position.x -= this.forwardVector.x * spd;
			this.cube.position.z += this.forwardVector.z * spd;
			
			this.cameraFocus.x -= this.forwardVector.x * spd;
			this.cameraFocus.z += this.forwardVector.z * spd;
		}
		else if(this.inputkeys.down.isDown)
		{
			this.camera.position.x += this.forwardVector.x * spd;
			this.camera.position.z -= this.forwardVector.z * spd;
			
			this.cube.position.x += this.forwardVector.x * spd;
			this.cube.position.z -= this.forwardVector.z * spd;
			
			this.cameraFocus.x += this.forwardVector.x * spd;
			this.cameraFocus.z -= this.forwardVector.z * spd;
		}
		if(this.inputkeys.left.isDown)
		{
			this.camera.position.x += this.rightVector.x * spd;
			this.camera.position.z -= this.rightVector.z * spd;
			
			this.cube.position.x += this.rightVector.x * spd;
			this.cube.position.z -= this.rightVector.z * spd;
			
			this.cameraFocus.x += this.rightVector.x * spd;
			this.cameraFocus.z -= this.rightVector.z * spd;
		}
		else if(this.inputkeys.right.isDown)
		{
			this.camera.position.x -= this.rightVector.x * spd;
			this.camera.position.z += this.rightVector.z * spd;
			
			this.cube.position.x -= this.rightVector.x * spd;
			this.cube.position.z += this.rightVector.z * spd;
			
			this.cameraFocus.x -= this.rightVector.x * spd;
			this.cameraFocus.z += this.rightVector.z * spd;
			
		}

		// update sprite rotations
		this.cube.setRotationFromEuler(this.camera.rotation);
		
	}

	update() : void
	{
		if(this.loadDone)
		{
			// re-orient camera
			this.camera.updateMatrixWorld();
			//const v = this.camera.position.clone();
			this.cameraInput();
			
			// player input 
			this.characterMovement();
			
			//this.cube.lookAt(v);
			//this.orbitControls.update();	
		}
	}
}
