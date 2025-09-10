import * as THREE from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		canvas,
	});
	renderer.setPixelRatio(window.devicePixelRatio);

	const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x8080FF );

	// CAMERA //
	const fov = 45;
	const aspect = 1;
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set(0, 0, 10)
    camera.lookAt(new THREE.Vector3(0,0,1));

    const controls = new OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 0, 0 );
	controls.update();

	// FRUSTUM //
	const geometry = new THREE.BufferGeometry();

	// 3------2   7---6
	// |      |   |   |
	// |      |   4---5
	// 0------1
	const vertices = new Float32Array( [
    	-3.0, -3.0,  0.0, // v0
    	 3.0, -3.0,  0.0, // v1
    	 3.0,  3.0,  0.0, // v2
    	-3.0,  3.0,  0.0, // v3

    	-1.0, -1.0,  2.0, // v4
    	 1.0, -1.0,  2.0, // v5
    	 1.0,  1.0,  2.0, // v6
    	-1.0,  1.0,  2.0, // v7

	] );

	const indices = [

    	4, 5, 6,
    	6, 7, 4,	//top

    	7, 6, 2,
    	2, 3, 7,	//up

    	1, 5, 4,
    	4, 0, 1,	//down

    	4, 7, 3,
    	3, 0, 4,	//left

    	2, 6, 5,
    	5, 1, 2,	//right

	];

	geometry.setIndex( indices );
	geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

	geometry.computeVertexNormals();

	const material = new THREE.MeshNormalMaterial();
	const mesh = new THREE.Mesh( geometry, material );

	scene.add( mesh );

	const gui = new GUI();
	const Mfolder = gui.addFolder('material');
    Mfolder.add(material, 'wireframe');

	// RENDER //
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

	function render() {

		if ( resizeRendererToDisplaySize( renderer ) ) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}

		renderer.render( scene, camera );
		requestAnimationFrame( render );
        controls.update();
	}

	requestAnimationFrame( render );

}

main();