import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main() {

    const canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
    });
    renderer.autoClear = false;
    renderer.setPixelRatio(window.devicePixelRatio);

    const renderTarget = new THREE.WebGLRenderTarget(512, 512, {
        stencilBuffer: false,
    });

    // CAMERA //
    const fov = 70;
    const aspect = 1; // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set(0, 5.5, 5)
    camera.lookAt(new THREE.Vector3(0,4,0));

    // FAKE CAMERA //
    const fakeCamera = new THREE.PerspectiveCamera( 36, 1, 0.1, 50 );
    fakeCamera.position.set(0, 9, 0)
    fakeCamera.lookAt(new THREE.Vector3(0,0,0));

    const loader = new THREE.TextureLoader();
    // SCENE //
    const scene = new THREE.Scene();

    const bgTexture = loader.load('textures/background/monument_valley.jpg');
    bgTexture.colorSpace = THREE.SRGBColorSpace;
    scene.background = bgTexture;
    //scene.background = new THREE.Color( 0x000000 );

    // FAKE SCENE //
    const fakeScene = new THREE.Scene();
    fakeScene.background = new THREE.Color( 0x8080FF );

    // OVERLAY SCENE //
    const overlayScene = new THREE.Scene();
    const overlayCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // LIGHTING
    const color = 0xFFFFFF;
    const intensity = 200;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(0, 6, 10);
    light.distance = 0;
    scene.add(light);

    const helper = new THREE.PointLightHelper(light);
    scene.add(helper);

    const aLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( aLight );

    // FRUSTUM //
    const objLoader = new GLTFLoader();
    objLoader.load('models/frustum.glb', (gltf)=>{
        const model = gltf.scene;

        model.traverse((child)=>{
            if(child.isMesh){
                child.material = new THREE.MeshNormalMaterial();
            }
        });
        fakeScene.add(model);

    });

    // HUD //
    const exampleTexture = renderTarget.texture;

    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: exampleTexture,
        depthTest: false,
        //transparent: true,
    }));
    sprite.scale.set(0.35, 0.8, 1);
    sprite.position.set(0.7, -0.5, 0);
    overlayScene.add(sprite);

    // CHECKERBOARD FLOOR
    const planeSize = 40;

    const floorTexture = loader.load( 'textures/checker.png' );
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.magFilter = THREE.NearestFilter;
    floorTexture.colorSpace = THREE.SRGBColorSpace;

    const repeats = planeSize / 2;
    floorTexture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
        map: floorTexture,
        side: THREE.DoubleSide,
        });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);

    
    //CUBE
    //const cubes = []; // array for cubes

    const brickTexture = loader.load( './textures/simplebrick/diffuse2.png' );
    brickTexture.colorSpace = THREE.SRGBColorSpace;
    brickTexture.magFilter = THREE.NearestFilter;
    brickTexture.repeat.set( 6, 10 );
    brickTexture.wrapS = THREE.RepeatWrapping;
    brickTexture.wrapT = THREE.RepeatWrapping;

    const normalTexture = renderTarget.texture;
    normalTexture.repeat.set( 6, 10 );
    normalTexture.wrapS = THREE.RepeatWrapping;
    normalTexture.wrapT = THREE.RepeatWrapping;

    // CUBE MATERIAL
    const cubeMaterial = new THREE.MeshPhongMaterial( {
        map: brickTexture,
        normalMap: normalTexture,
    } );

    // CUBES
    const cube = new THREE.Mesh( new THREE.BoxGeometry( 3, 3, 3), cubeMaterial );
    scene.add( cube );
    //cubes.push( cube ); // add to cubes list
    //cube.position.x=0;
    cube.position.y=4;
    //cube.position.z=0;

    function updateCamera() {
        fakeCamera.updateProjectionMatrix();
    }
 
    const gui = new GUI();

    function updateCamera() {
        fakeCamera.updateProjectionMatrix();
    }

    function updateLight() {
        helper.update();
    }   

    {
        const Lfolder = gui.addFolder('light');
        Lfolder.add(light, 'intensity', 0, 200, 0.1);
        Lfolder.add(light.position, 'x', -20, 20).onChange(updateLight);
        Lfolder.add(light.position, 'z', -20, 20).onChange(updateLight);
        Lfolder.add(light.position, 'y', 0, 20).onChange(updateLight);
    }
    {
        const folder = gui.addFolder('frustum');
        folder.add(fakeCamera, 'fov', 0, 100, 1).onChange(updateCamera);
        folder.add(fakeCamera, 'aspect', 0.1, 10, 0.1).onChange(updateCamera);
        folder.add(fakeCamera, 'near', 0.1, 10, 0.1).onChange(updateCamera);
        folder.open();
    }

    // CAMERA CONTROLS //
    const controls = new OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 4, 0 );
	controls.update();


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

    function render( time ) {

        //time *= 0.001;

        const canvas = renderer.domElement;
        const canvasAspect = canvas.clientWidth / canvas.clientHeight;
        const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
        const aspect = imageAspect / canvasAspect;
 
        bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
        bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;
 
        bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
        bgTexture.repeat.y = aspect > 1 ? 1 : aspect;

        if ( resizeRendererToDisplaySize( renderer ) ) {
            //const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.setRenderTarget(renderTarget);
        renderer.render( fakeScene, fakeCamera );
		renderer.setRenderTarget( null );

        renderer.render( scene, camera );
        renderer.clearDepth();
        renderer.render(overlayScene, overlayCamera);

        requestAnimationFrame( render );
        controls.update();

    }

    requestAnimationFrame( render );

}

main();