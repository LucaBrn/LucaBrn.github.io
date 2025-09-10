import * as THREE from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main(){

    const canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
    });
    renderer.autoClear = false;
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );

    // OVERLAY SCENE //
    const overlayScene = new THREE.Scene();
    const overlayCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const light = new THREE.PointLight(0xffffff, 200);
    light.position.set(-10, 3, 0);
    scene.add(light);

    const aLight = new THREE.AmbientLight( 0x404040 );
    scene.add( aLight );

    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 4);

    camera.position.set(4, 0, 4);

    const controls = new OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 0, 0 );
	controls.update();

    const loader = new THREE.TextureLoader();

    const bumpTexture = loader.load('textures/noiseBump.png');
    bumpTexture.magFilter = THREE.LinearFilter;
    const lightMaptexture = loader.load('textures/lightMap.png');

    const sphereGeometry = new THREE.SphereGeometry();
    
    const material0 = new THREE.MeshBasicMaterial({
        color: new THREE.Color( 0xFF6A00 ),
    });

    const material1 = new THREE.MeshBasicMaterial({
        color: new THREE.Color( 0xFF6A00 ),
        lightMap: lightMaptexture,
    });

    const material2 = new THREE.MeshPhongMaterial({
        color: new THREE.Color( 0xFF6A00 ),
    });

    const material3 = new THREE.MeshPhongMaterial({
        color: new THREE.Color( 0xFF6A00 ),
        bumpMap: bumpTexture,
        bumpScale: 0.5,
    });

    const sphere0 = new THREE.Mesh(sphereGeometry, material0);
    const sphere1 = new THREE.Mesh(sphereGeometry, material1);
    const sphere2 = new THREE.Mesh(sphereGeometry, material2);
    const sphere3 = new THREE.Mesh(sphereGeometry, material3);

    scene.add(sphere0);
    scene.add(sphere1);
    scene.add(sphere2);
    scene.add(sphere3);

    sphere0.position.set(2, 0, 2);
    sphere1.position.set(2, 0, -2);
    sphere2.position.set(-2, 0, -2);
    sphere3.position.set(-2, 0, 2);

    // HUD //
    const sprite1 = new THREE.Sprite(new THREE.SpriteMaterial({
        map: bumpTexture,
        depthTest: false,
        //transparent: true,
    }));
    sprite1.scale.set(0.2, 0.45, 1);
    sprite1.position.set(0.8, -0.6, 0);
    overlayScene.add(sprite1);

    const sprite2 = new THREE.Sprite(new THREE.SpriteMaterial({
        map: lightMaptexture,
        depthTest: false,
        //transparent: true,
    }));
    sprite2.scale.set(0.2, 0.45, 1);
    sprite2.position.set(0.8, 0, 0);
    overlayScene.add(sprite2);

    const gui = new GUI();
    gui.add(material3, 'bumpScale', 0, 1, 0.01);

    {
        const Lfolder = gui.addFolder('light');
        Lfolder.add(light, 'intensity', 0, 600, 1);
        Lfolder.add(light.position, 'z', -30, 30);
        //Lfolder.add(light.position, 'x', -20, 20).onChange(updateLight);
        //Lfolder.add(light.position, 'y', 0, 20).onChange(updateLight);
    }

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
        renderer.clearDepth();
        renderer.render(overlayScene, overlayCamera);

        requestAnimationFrame( render );
        controls.update();

    }

    requestAnimationFrame( render );    
}

main();