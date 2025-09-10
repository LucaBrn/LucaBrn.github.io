import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

function main() {

    const canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
    });
    renderer.autoClear = false;
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // CAMERA //
    const camera = new THREE.PerspectiveCamera( 60, 1, 0.1, 20 );
    camera.position.set(0, 0, 5);
    camera.lookAt(new THREE.Vector3(0,0,0));

    // LIGHTING //
    const light = new THREE.PointLight(0xFFFFFF, 300000);
    light.position.set(0, 100, 200);

    scene.add(light);

    const aLight = new THREE.AmbientLight();
    scene.add(aLight);

    // TEXTURES //
    const loader = new THREE.TextureLoader();

    const simpleBrickTexture = loader.load('textures/simplebrick/diffuse.png');
    simpleBrickTexture.magFilter = THREE.NearestFilter;
    simpleBrickTexture.colorSpace = THREE.SRGBColorSpace;

    const normalSimpleBrickTexture = loader.load('textures/simplebrick/normal.png');
    normalSimpleBrickTexture.magFilter = THREE.NearestFilter;
    normalSimpleBrickTexture.colorSpace = THREE.SRGBColorSpace;

    const bumpSimpleBrickTexture = loader.load('textures/simplebrick/bump.png');
    bumpSimpleBrickTexture.magFilter = THREE.NearestFilter;
    bumpSimpleBrickTexture.colorSpace = THREE.SRGBColorSpace;

    const tireTexture = loader.load('textures/imported/plastic_0022_color_1k.jpg');
    tireTexture.magFilter = THREE.LinearFilter;
    tireTexture.colorSpace = THREE.SRGBColorSpace;

    const normGLTireTexture = loader.load('textures/imported/plastic_0022_normal_opengl_1k.jpg');
    normGLTireTexture.magFilter = THREE.LinearFilter;
    normGLTireTexture.colorSpace = THREE.SRGBColorSpace;

    const normDXTireTexture = loader.load('textures/imported/plastic_0022_normal_1k.jpg');
    normDXTireTexture.magFilter = THREE.LinearFilter;
    normDXTireTexture.colorSpace = THREE.SRGBColorSpace;

    // CUBES //
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);

    const cube1 = new THREE.Mesh(cubeGeometry, new THREE.MeshPhongMaterial({
        //map: brickTexture,
        color: new THREE.Color(0x95553A),
    }));

    const cube2 = new THREE.Mesh(cubeGeometry, new THREE.MeshPhongMaterial({
        //map: brickTexture,
        color: new THREE.Color(0x95553A),
        bumpMap: bumpSimpleBrickTexture,

    }));

    const cube3 = new THREE.Mesh(cubeGeometry, new THREE.MeshPhongMaterial({
        //map: brickTexture,
        color: new THREE.Color(0x95553A),
    }));

    const cube4 = new THREE.Mesh(cubeGeometry, new THREE.MeshPhongMaterial({
        //map: brickTexture,
        color: new THREE.Color(0x95553A),
        normalMap: normalSimpleBrickTexture,

    }));

    const cube5 = new THREE.Mesh(cubeGeometry, new THREE.MeshPhongMaterial({
        map: simpleBrickTexture,
        
    }));
    const cube6 = new THREE.Mesh(cubeGeometry, new THREE.MeshPhongMaterial({
        map: simpleBrickTexture,
        normalMap: normalSimpleBrickTexture,

    }));


    const cube7 = new THREE.Mesh(cubeGeometry, new THREE.MeshPhongMaterial({
        map: tireTexture,
    }));

    const cube8 = new THREE.Mesh(cubeGeometry, new THREE.MeshPhongMaterial({
        map: tireTexture,
        normalMap: normGLTireTexture,
    }));

    const cube9 = new THREE.Mesh(cubeGeometry, new THREE.MeshPhongMaterial({
        map: tireTexture,
    }));

    const cube10 = new THREE.Mesh(cubeGeometry, new THREE.MeshPhongMaterial({
        map: tireTexture,
        normalMap: normDXTireTexture,
    }));

    scene.add(cube1, cube2, cube3, cube4, cube5, cube6, cube7, cube8, cube9, cube10);

    cube1.position.set(-2,0,0);
    cube2.position.set(2,0,0);

    cube3.position.set(-2,50,0);
    cube4.position.set(2,50,0);

    cube5.position.set(-2,100,0);
    cube6.position.set(2,100,0);

    cube7.position.set(-2,150,0);
    cube8.position.set(2,150,0);

    cube9.position.set(-2,200,0);
    cube10.position.set(2,200,0);


    const textGeometry = new THREE.PlaneGeometry(2,1);

    const textA = loader.load('./textures/text/a.png');
    textA.magFilter = THREE.NearestFilter;

    const textB = loader.load('./textures/text/b.png');
    textB.magFilter = THREE.NearestFilter;

    const textC = loader.load('./textures/text/c.png');
    textC.magFilter = THREE.NearestFilter;

    const textD = loader.load('./textures/text/d.png');
    textD.magFilter = THREE.NearestFilter;

    const textE = loader.load('./textures/text/e.png');
    textE.magFilter = THREE.NearestFilter;


    const text1 = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({
        map: textA,
    }));

    const text2 = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({
        map: textB,
    }));

    const text3 = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({
        map: textC,
    }));

    const text4 = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({
        map: textD,
    }));

    const text5 = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({
        map: textE,
    }));

    scene.add(text1, text2, text3, text4, text5);
    text1.position.set(-5, 1.5 ,0);
    text2.position.set(-5, 51.5 ,0);
    text3.position.set(-5, 101.5 ,0);
    text4.position.set(-5, 151.5 ,0);
    text5.position.set(-5, 201.5 ,0);

    const controls = new OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 0, 0 );
	controls.update();

    const gui = new GUI();

    const params = {
        targetY: 0
    };

    {
        const Cfolder = gui.addFolder('camera');

        Cfolder.add(params, 'targetY', 0, 200, 50).onChange((value => {
            const delta = value - controls.target.y;
            controls.target.y += delta;
            camera.position.y += delta;

            controls.update();
        }));

    }

    
    {
        const Lfolder = gui.addFolder('light');
        Lfolder.add(light, 'intensity', 0, 600000, 1000);
        Lfolder.add(light.position, 'x', -200, 200, 1);
        Lfolder.add(light.position, 'z', -200, 200, 1);
        Lfolder.add(light.position, 'y', -100, 300, 1);
    }


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