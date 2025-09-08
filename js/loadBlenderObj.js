import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main(){

    const canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
    });
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );

    const camera = new THREE.PerspectiveCamera(20, 2, 0.1, 100);

    camera.position.set(0, 40, 0);

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0, 0 );
    controls.update();


/*
    loader.load( 'models/frustum.glb', function ( gltf ) {
        traverse( function( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material = new THREE.MeshNormalMaterial();
            }
        });
        scene.add( gltf.scene );

        }, undefined, function ( error ) {

        console.error( error );

    } );
*/
    const loader = new GLTFLoader();
    loader.load('models/frustum.glb', (gltf)=>{
        const model = gltf.scene;

        model.traverse((child)=>{
            if(child.isMesh){
                child.material = new THREE.MeshNormalMaterial();
            }
        });
        scene.add(model);

    });

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