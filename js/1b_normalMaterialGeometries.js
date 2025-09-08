import * as THREE from 'three';

function main() {

    const canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
	
    const scene = new THREE.Scene;

    const camera = new THREE.PerspectiveCamera( 60,  2, 0.1, 500, );
    camera.position.set(0,0,10);
    camera.lookAt(0, 0, 0);

    const shapes = [];

    const normMaterial = new THREE.MeshNormalMaterial();

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.5), normMaterial);
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 1.8), normMaterial);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.5, 1.8), normMaterial);
    const tetrahedron = new THREE.Mesh(new THREE.TetrahedronGeometry(1.8), normMaterial);

    scene.add(sphere);
    scene.add(box);
    scene.add(cone);
    scene.add(tetrahedron);

    shapes.push(sphere, box, cone, tetrahedron);

    sphere.position.set(-3, 2, 0);
    box.position.set(3, 2, 0);

    cone.position.set(-3, -2, 0);
    cone.rotateX(1.570796);

    tetrahedron.position.set(3, -2, 0);

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

		shapes.forEach( ( shape, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			shape.rotation.x = rot;
			shape.rotation.y = rot;

		} );        

		renderer.render( scene, camera );
		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );    
}

main();