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
    const fakeCamera = new THREE.PerspectiveCamera( 45, 1, 8, 9.2 );
    fakeCamera.position.set(0, -10, 10)
    fakeCamera.lookAt(new THREE.Vector3(0,-10,0));

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

    const aLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( aLight );

    // TORUS //
    const torus = new THREE.Mesh( new THREE.TorusGeometry(2, 1, 16, 100), new THREE.MeshNormalMaterial() );
    
    fakeScene.add( torus );
    torus.position.y=-10;

    // HUD //
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: renderTarget.texture,
        depthTest: false,
        //transparent: true,
    }));
    sprite.scale.set(0.4, 0.8, 1);
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

    const brickTexture = loader.load( './textures/simplebrick/diffuse.png' );
    brickTexture.colorSpace = THREE.SRGBColorSpace;
    brickTexture.magFilter = THREE.NearestFilter;

    // CUBE MATERIAL
    const cubeMaterial = new THREE.MeshPhongMaterial( {
        map: brickTexture,
        normalMap: renderTarget.texture,
    } );

    // CUBES
    const cube = new THREE.Mesh( new THREE.BoxGeometry( 3, 3, 3), cubeMaterial );
    scene.add( cube );
    //cubes.push( cube ); // add to cubes list
    //cube.position.x=0;
    cube.position.y=4;
    //cube.position.z=0;

    // GUI //
    class MinMaxGUIHelper {
        constructor(obj, minProp, maxProp, minDif) {
            this.obj = obj;
            this.minProp = minProp;
            this.maxProp = maxProp;
            this.minDif = minDif;
        }
        get min() {
            return this.obj[this.minProp];
        }
        set min(v) {
            this.obj[this.minProp] = v;
            this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
        }
        get max() {
            return this.obj[this.maxProp];
        }
        set max(v) {
            this.obj[this.maxProp] = v;
            this.min = this.min;  // this will call the min setter
        }
    }

    function updateCamera() {
        fakeCamera.updateProjectionMatrix();
    }
 
    const gui = new GUI();
    {
        const folder = gui.addFolder('torus');
        folder.add(fakeCamera, 'fov', 5, 100).onChange(updateCamera);
        const torusGUIHelper = new MinMaxGUIHelper(fakeCamera, 'near', 'far', 0.1);
        folder.add(torusGUIHelper, 'min', 8, 10, 0.1).name('near').onChange(updateCamera);
        folder.add(torusGUIHelper, 'max', 9, 10, 0.1).name('far').onChange(updateCamera);
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