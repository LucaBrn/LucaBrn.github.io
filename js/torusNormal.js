import * as THREE from 'three';
//import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';

function main() {

	const renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( 500, 500 );
    document.body.appendChild( renderer.domElement );

	const fov = 45;
	const aspect = 1; // the canvas default
	const near = 0.1;
	const far = 9.2;	//IMPORTANT!
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set(0, 0, 10)
    camera.lookAt(new THREE.Vector3(0,0,0));

	const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x8080FF );

	const material = new THREE.MeshNormalMaterial();

	const radius = 2;
	const tube = 1;
	const radialSegments = 16;
	const tubularSegments = 100;

	const torusGeometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
	const torus = new THREE.Mesh( torusGeometry, material );

	scene.add( torus );

	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {
			renderer.setSize( width, height, false );
		}
		return needResize;
	}

	function render( time ) {
		time *= 0.001;
		if ( resizeRendererToDisplaySize( renderer ) ) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}
/*
			const speed = .2;
			const rot = time * speed;
			torus.rotation.x = rot;
			torus.rotation.y = rot;
			torus.rotation.z = rot;
*/
		renderer.render( scene, camera );
		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();