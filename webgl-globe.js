(function( window, THREE ) {
	'use strict';

	var context, earthMesh, cloudMesh;
	var RADIUS_EARTH = 0.5;


	// http://threejs.org/docs/index.html#Manual/Introduction/Creating_a_scene
	// view-source:http://learningthreejs.com/data/2013-09-16-how-to-make-the-earth-in-webgl/demo/index.html
	function init() {
		var w = 320;
		var h = 240;
		// To actually be able to display anything with Three.js, we need three things:
		// A scene, a camera, and a renderer so we can render the scene with the camera.
		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera( 45, w / h, 0.01, 1000 )
		var renderer = new THREE.WebGLRenderer({ alpha: true });

		renderer.setSize( w, h );
		renderer.domElement.id = 'globe';
		document.body.appendChild( renderer.domElement );

		camera.position.z = 2;

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
		var geometry = new THREE.SphereGeometry( RADIUS_EARTH, 32, 32 );

		var material = new THREE.MeshPhongMaterial();
		material.map = THREE.ImageUtils.loadTexture( 'image/earthmap1k.jpg' );

		// bump map for terrain
		material.bumpMap = THREE.ImageUtils.loadTexture( 'image/earthbump1k.jpg' );
		material.bumpScale = 0.5;

		// specular map for oceans
		material.specularMap = THREE.ImageUtils.loadTexture( 'image/earthspec1k.jpg' );
		material.specular = new THREE.Color( 0x333333 );

		// mesh = geometry + material
		return new THREE.Mesh( geometry, material );
	}


	function createGlobe( sphere ) {
		var r = RADIUS_EARTH / 16;
		var h = RADIUS_EARTH * 2.5;
		var material = new THREE.MeshPhongMaterial({ color: 0xCD7F32 });
		var globeMesh, baseMesh;
		
		// create spindle
		var geometry = new THREE.CylinderGeometry( r, r, h );

		var spindleMesh = new THREE.Mesh( geometry, material );

		// rotate earth and spindle
		spindleMesh.rotation.z = -30 * Math.PI / 180;
		earthMesh.rotation.z = -30 * Math.PI / 180;

		// create base
		r = RADIUS_EARTH / 2;
		h = RADIUS_EARTH / 16;
		geometry = new THREE.CylinderGeometry( r, r, h );

		baseMesh = new THREE.Mesh( geometry, material );
		baseMesh.translateY( -1.25 * RADIUS_EARTH );

		globeMesh = new THREE.Mesh();
		globeMesh.add( spindleMesh );
		globeMesh.add( baseMesh );

		return globeMesh;
	}


	// view-source:http://learningthreejs.com/data/2013-09-16-how-to-make-the-earth-in-webgl/demo/bower_components/threex.planets/threex.planets.js
	function createEarthCloudLayer() {
		var geometry, material;

		// create cloud transparency on a 2d canvas
		var canvas = document.createElement( 'canvas' );
		canvas.width = 1024;
		canvas.height = 512;
		var canvasContext = canvas.getContext( '2d' );

		var cloudsImage = new Image();
		// when cloud image loads, apply transparency
		cloudsImage.addEventListener( 'load', function() {
			// draw image on new canvas
			var cloudCanvas = document.createElement( 'canvas' );
			cloudCanvas.width = cloudsImage.width;
			cloudCanvas.height = cloudsImage.height;
			var cloudContext = cloudCanvas.getContext( '2d' );
			cloudContext.drawImage( cloudsImage, 0, 0 );
			var cloudImageData = cloudContext.getImageData( 0, 0, cloudCanvas.width, cloudCanvas.height );

			// create an image for the cloud transparency
			var cloudsAlphaImage = new Image();
			// when transparency is loaded, blend with clouds image
			cloudsAlphaImage.addEventListener( 'load', function() {
				var alphaCanvas = document.createElement( 'canvas' );
				alphaCanvas.width = cloudsImage.width;
				alphaCanvas.height = cloudsImage.height;
				var alphaContext = alphaCanvas.getContext( '2d' );
				alphaContext.drawImage( cloudsAlphaImage, 0, 0 );
				var alphaData = alphaContext.getImageData( 0, 0, alphaCanvas.width, alphaCanvas.height );

				// blend images
				var blendedData = cloudContext.createImageData( canvas.width, canvas.height );
				for ( var y = 0, offset = 0; y < cloudsImage.height; y++ ) {
					for ( var x = 0; x < cloudsImage.width; x++, offset += 4 ) {
						// rgba: copy RGB from clouds
						blendedData.data[ offset ] = cloudImageData.data[ offset ];
						blendedData.data[ offset + 1 ] = cloudImageData.data[ offset + 1 ];
						blendedData.data[ offset + 2 ] = cloudImageData.data[ offset + 2 ];
						// create alpha channel from RGB opacity data
						blendedData.data[ offset + 3 ] = 255 - (( alphaData.data[ offset ] + alphaData.data[ offset + 1 ] + alphaData.data[ offset + 2 ] ) / 3 );
					}
				}
				// update canvas
				canvasContext.putImageData( blendedData, 0, 0 );
				// refresh material
				material.map.needsUpdate = true;
			});
			// load transparency image
			cloudsAlphaImage.src = 'image/earthcloudmaptrans.jpg';
		});
		// load cloud image
		cloudsImage.src = 'image/earthcloudmap.jpg';

		geometry = new THREE.SphereGeometry( RADIUS_EARTH + RADIUS_EARTH / 50, 32, 32 ); // slightly larger than Earth radius
		material = new THREE.MeshPhongMaterial({
			map: new THREE.Texture( canvas ),
			side: THREE.DoubleSide,
			opacity: 0.8,
			transparent: true,
			depthWrite: false
		});

		return new THREE.Mesh( geometry, material );
	}


	// init
	context = init();
	// put Earth in it
	earthMesh = createEarth();
	cloudMesh = createEarthCloudLayer();
	// put a globe stand in it
	context.scene.add( createGlobe( earthMesh ));

	earthMesh.add( cloudMesh );
	context.scene.add( earthMesh );


	// render loop
	requestAnimationFrame(function render( nowMsec ) {
		// measure time
		render.lastTimeMsec = render.lastTimeMsec || nowMsec - 1000 / 60; // fps
		var deltaMsec = Math.min( 200, nowMsec - render.lastTimeMsec );
		render.lastTimeMsec = nowMsec;

		// plot geometry
		earthMesh.rotateY( 1 / 32 * deltaMsec / 1000 );
		cloudMesh.rotateY( 1 / 16 * deltaMsec / 1000 );

		// render canvas
		context.renderer.render( context.scene, context.camera );

		requestAnimationFrame( render );
	});

}( window, THREE ));
