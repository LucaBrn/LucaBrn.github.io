import * as THREE from 'three';
//import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main() {

    const canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
    });
    //renderer.autoClear = false;

    const fov = 45;
    const aspect = 1; // the canvas default
    const near = 0.1;
    const far = 20;	//IMPORTANT!
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    //const camera = new THREE.OrthographicCamera();
    camera.position.set(0, 0, 3)
    camera.lookAt(new THREE.Vector3(0,0,0));

    const scene = new THREE.Scene();
    //scene.background = new THREE.Color( 0x8080FF );

    // LIGHTING
    const light = new THREE.PointLight(0xFFFFFF, 400);
    light.position.set(-10, 0, 10);
    light.distance = 0;
    scene.add(light);

    const aLight = new THREE.AmbientLight;
    scene.add(aLight);

    const normScale = new THREE.Vector2(0, 0);

    const loader = new THREE.TextureLoader();
    const brickNorm = loader.load( './textures/simplebrick/normal.png' );
    const brickDispl = loader.load( './textures/simplebrick/displacement.png' );

    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color( 0xFF6A00 ),
        //map: brickTexture,
        displacementMap: brickDispl,
        displacementScale: 0,
        displacementBias: 0,
        normalMap: brickNorm,
        normalScale: normScale,

        side: THREE.DoubleSide,
    });

    const planeData = {
        width: 1,
        height: 1,
        widthSegments: 1,
        heightSegments: 1,
        }

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1,1), material);

    scene.add( plane );

    const gui = new GUI();

    const params = {
        normalScale_x: normScale.x,
        normalScale_y: normScale.y,
    }

    {
        const Lfolder = gui.addFolder('light');
        Lfolder.add(light, 'intensity', 0, 500, 10);
        Lfolder.add(light.position, 'x', -10, 10);
        Lfolder.add(light.position, 'z', -10, 10);
        Lfolder.add(light.position, 'y', -10, 10);
    }

    const materialSettings = {
        metalness: material.metalness,
        roughness: material.roughness,
    }

    {
        const Mfolder = gui.addFolder('material');
        Mfolder.add(material, 'wireframe');

        Mfolder.add(materialSettings, 'metalness', 0, 1).onChange((value)=>{
            material.metalness = value;
        })
        Mfolder.add(materialSettings, 'roughness', 0, 1).onChange((value)=>{
            material.roughness = value;
        })

        Mfolder.add(material, 'displacementScale', 0, 1, 0.01)
        Mfolder.add(material, 'displacementBias', -1, 1, 0.01)
        Mfolder.add(params, 'normalScale_x', 0, 5, 0.1).onChange((value) => {
            normScale.x = value;
        });

        Mfolder.add(params, 'normalScale_y', 0, 5, 0.1).onChange((value) => {
            normScale.y = value;
        });
        Mfolder.open()
    }

    {
        const Pfolder = gui.addFolder('PlaneGeometry');
        Pfolder.add(planeData, 'widthSegments',1,100,1).onChange(regeneratePlaneGeometry);
        Pfolder.add(planeData, 'heightSegments',1,100,1).onChange(regeneratePlaneGeometry);
        Pfolder.open();
    }

    function regeneratePlaneGeometry(){
        let newGeometry = new THREE.PlaneGeometry(
            planeData.width, planeData.height,
            planeData.widthSegments, planeData.heightSegments
        );
        plane.geometry.dispose();
        plane.geometry = newGeometry;
    }

    // CAMERA CONTROLS //
    const controls = new OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 0, 0 );
	controls.update();


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

        renderer.render( scene, camera );
        requestAnimationFrame( render );

    }

    requestAnimationFrame( render );

}

main();