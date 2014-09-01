(function( window, THREE ) {
	'use strict';

	var context, earth;


	// http://threejs.org/docs/index.html#Manual/Introduction/Creating_a_scene
	// view-source:http://learningthreejs.com/data/2013-09-16-how-to-make-the-earth-in-webgl/demo/index.html
	function init() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		// To actually be able to display anything with Three.js, we need three things:
		// A scene, a camera, and a renderer so we can render the scene with the camera.
		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera( 45, w / h, 0.01, 1000 )
		var renderer = new THREE.WebGLRenderer();

		renderer.setSize( w, h );
		document.body.appendChild( renderer.domElement );

		camera.position.z = 1.5;

		// lights
		var light = new THREE.AmbientLight( 0x888888 );
		scene.add( light );
		light = new THREE.DirectionalLight( 0xcccccc, 1 );
		light.position.set( 5, 3, 5 );
		scene.add( light );

		return {
			scene: scene,
			camera: camera,
			renderer: renderer
		};
	}


	// http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/
	// view-source:http://learningthreejs.com/data/2013-09-16-how-to-make-the-earth-in-webgl/demo/index.html
	function createEarth() {
		var geometry = new THREE.SphereGeometry( 0.5, 32, 32 );

		var material = new THREE.MeshPhongMaterial();
		material.map = THREE.ImageUtils.loadTexture( 'image/earthmap1k.jpg' );

		// mesh = geometry + material
		return new THREE.Mesh( geometry, material );
	}


	// init
	context = init();
	earth = createEarth();
	context.scene.add( earth );


	// render loop
	function render() {
		requestAnimationFrame( render );
		globe.renderer.render( globe.scene, globe.camera );
	}
	render();

}( window, THREE ));
