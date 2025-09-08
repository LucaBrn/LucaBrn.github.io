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

    const renderTarget1 = new THREE.WebGLRenderTarget(512, 512, {
        stencilBuffer: false,
    });
	const renderTarget2 = new THREE.WebGLRenderTarget(512, 512, {
        stencilBuffer: false,
    });

    // CAMERA //
    const fov = 70;
    const aspect = 1; // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set(0, 5.5, 5);
    camera.lookAt(new THREE.Vector3(0,4,0));

    // FAKE CAMERA //
    const fakeCamera = new THREE.PerspectiveCamera( 45, 1, 8, 9.2 );
    fakeCamera.position.set(0, 0, 10)
    fakeCamera.lookAt(new THREE.Vector3(0,0,0));

    const loader = new THREE.TextureLoader();

    // SCENE //
    const scene = new THREE.Scene();
    const bgTexture = loader.load('textures/background/monument_valley.jpg');
    bgTexture.colorSpace = THREE.SRGBColorSpace;
    scene.background = bgTexture;

    // FAKE SCENE (1) //
    const fakeScene1 = new THREE.Scene();
    fakeScene1.background = new THREE.Color( 0x8080FF );

	// FAKE SCENE (2) //
    const fakeScene2 = new THREE.Scene();
    fakeScene2.background = new THREE.Color( 0x000000 );

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

	// FAKE LIGHTING (2) //
	const fakeLight = new THREE.DirectionalLight(0xFFFFFF, 100);
	fakeLight.position.set(0, 0, 10);
	fakeLight.target.position.set(0, 0, 0);
	fakeScene2.add(fakeLight);
	fakeScene2.add(fakeLight.target);

    const normScale = new THREE.Vector2(0, 0);

    // TORUS //
	const torusgeometry = new THREE.TorusGeometry(2, 1, 16, 100);
    const torus1 = new THREE.Mesh( torusgeometry, new THREE.MeshNormalMaterial() );
	const torus2 = new THREE.Mesh( torusgeometry, new THREE.MeshPhongMaterial({
		color: 0x000000,
	}) );
    
    fakeScene1.add( torus1 );

	fakeScene2.add( torus2 );

    // HUD //
    const sprite1 = new THREE.Sprite(new THREE.SpriteMaterial({
        map: renderTarget1.texture,
        depthTest: false,
        //transparent: true,
    }));
	sprite1.scale.set(0.3, 0.65, 1);
    sprite1.position.set(-0.7, -0.5, 0);
    overlayScene.add(sprite1);

	const sprite2 = new THREE.Sprite(new THREE.SpriteMaterial({
        map: renderTarget2.texture,
        depthTest: false,
        //transparent: true,
    }));
	sprite2.scale.set(0.3, 0.65, 1);
    sprite2.position.set(-0.7, 0.5, 0);
    overlayScene.add(sprite2);
    

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
        normalMap: renderTarget1.texture,
        normalScale: normScale,

		displacementMap: renderTarget2.texture,
        displacementScale: 0,
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

    const params = {
        normalScale_x: normScale.x,
        normalScale_y: normScale.y,
    }

	{
        const Mfolder = gui.addFolder('material');
        Mfolder.add(cubeMaterial, 'wireframe');
        Mfolder.add(params, 'normalScale_x', 0, 5, 0.1).onChange((value) => {
            normScale.x = value;
        })

        Mfolder.add(params, 'normalScale_y', 0, 5, 0.1).onChange((value) => {
            normScale.y = value;
        })
        Mfolder.add(cubeMaterial, 'displacementScale', 0, 1, 0.01)
        //Mfolder.add(cubeMaterial, 'displacementBias', -1, 1, 0.01)
        Mfolder.open()
    }

    {
        const Tfolder = gui.addFolder('torus');
        Tfolder.add(fakeCamera, 'fov', 5, 100).onChange(updateCamera);
        const torusGUIHelper = new MinMaxGUIHelper(fakeCamera, 'near', 'far', 0.1);
        Tfolder.add(torusGUIHelper, 'min', 8, 10, 0.1).name('near').onChange(updateCamera);
        Tfolder.add(torusGUIHelper, 'max', 9, 10, 0.1).name('far').onChange(updateCamera);
        Tfolder.open();
    }

    const cubeData = {
        width: 3,
        height: 3,
        depth: 3,
        widthSegments: 1,
        heightSegments: 1,
        depthSegments: 1,
        }

	{
		const Pfolder = gui.addFolder('CubeGeometry');
		Pfolder.add(cubeData, 'widthSegments',1,100,1).onChange(regenerateBoxGeometry);
		Pfolder.add(cubeData, 'heightSegments',1,100,1).onChange(regenerateBoxGeometry);
		Pfolder.add(cubeData, 'depthSegments',1,100,1).onChange(regenerateBoxGeometry);
		Pfolder.open();
	}

	function regenerateBoxGeometry(){
		let newGeometry = new THREE.BoxGeometry(
			cubeData.width, cubeData.height, cubeData.depth, 
			cubeData.widthSegments, cubeData.heightSegments, cubeData.depthSegments
		);
		cube.geometry.dispose();
		cube.geometry = newGeometry;
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
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.setRenderTarget(renderTarget1);
        renderer.render( fakeScene1, fakeCamera );
		renderer.setRenderTarget( null );

		renderer.setRenderTarget(renderTarget2);
        renderer.render( fakeScene2, fakeCamera );
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