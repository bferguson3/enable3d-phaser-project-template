//import * as fs from "fs";
import * as THREE from "three";

export default class PreloadScene extends Phaser.Scene 
{
	constructor() 
	{
		super({ key: "PreloadScene" });
	}

	preload() : void
	{
		this.load.text("cobbleVertShader", "assets/shaders/cobble-mesh.vs");
		this.load.text("cobbleFragShader", "assets/shaders/cobble-mesh.fs");
		
		return;
	}

	create() : void
	{
		const cobbleUniforms = {
			map: { value: null }
		};
		global.cobbleMaterial = new THREE.ShaderMaterial({
			uniforms: cobbleUniforms,
			vertexShader: this.cache.text.get("cobbleVertShader"),
			fragmentShader: this.cache.text.get("cobbleFragShader"),
			side: THREE.FrontSide,
		});
		this.scene.start("MainScene");

		/**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
		// let someCondition = true
		// if (someCondition)
		//   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
		//     this.scene.add('MainScene', mainScene.default, true)
		//   })
		// else console.log('The mainScene class will not even be loaded by the browser')
	}
}
