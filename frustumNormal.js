//import * as THREE from 'three';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';

function main() {

	const renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( 500, 500 );
    document.body.appendChild( renderer.domElement );

	const fov = 45;
	const aspect = 1; // the canvas default
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set(0, 0, 10)
    camera.lookAt(new THREE.Vector3(0,0,1));

	const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x8080FF );
/*
	// LIGHTING
	const color = 0xFFFFFF;
	const intensity = 200;
	const light = new THREE.PointLight(color, intensity);
	light.position.set(-5, 3, 5);
	light.distance = 0;
	scene.add(light);

	const geometry = new THREE.BoxGeometry( 3, 3, 3);

	// CUBE MATERIALS
	const material = new THREE.MeshPhongMaterial( {
		color: 0xff0000
	} );

	// CUBE
	const cube1 = new THREE.Mesh( geometry, material );
	scene.add( cube1 );
*/
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
    //2, 1, 0,
    //0, 3, 2,	//base

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
			//cube.rotation.x = rot;
			mesh1.rotation.y = rot;
*/
		renderer.render( scene, camera );
		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();