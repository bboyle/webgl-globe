(function( window, THREE ) {
	'use strict';

	var globe;


	// https://developer.mozilla.org/en-US/docs/Web/WebGL/Getting_started_with_WebGL
	// function init() {
	// 	canvas = document.getElementById( 'globe' );
	// 	gl = canvas.getContext( 'webgl' );

	// 	if ( gl ) {
	// 		// handle resizing
	// 		gl.viewport( 0, 0, canvas.width, canvas.height );
	// 		createGlobe( gl );
	// 	} else {
	// 		(function() {
	// 			var warningMessage = document.createElement( 'em' );
	// 			warningMessage.appendChild( document.createTextNode( 'WebGL is not supported in this browser.' ));
	// 			canvas.parentNode.replaceChild( warningMessage, canvas );
	// 		}());
	// 	}
	// }


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
	function createGlobe( scene ) {
		var geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
		// var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
		var material = new THREE.MeshPhongMaterial();
		// mesh = geometry + material
		var earthMesh = new THREE.Mesh( geometry, material );

		// add to scene
		scene.add( earthMesh );
	}


	globe = init();
	createGlobe( globe.scene );

	// http://threejs.org/docs/index.html#Manual/Introduction/Creating_a_scene
	// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	// var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	// var cube = new THREE.Mesh( geometry, material );
	// globe.scene.add( cube );


	// render loop
	function render() {
		requestAnimationFrame( render );
		globe.renderer.render( globe.scene, globe.camera );
	}
	render();

}( window, THREE ));
