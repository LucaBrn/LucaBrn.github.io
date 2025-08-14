//import * as THREE from 'three';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';

function main() {

    const renderer = new THREE.WebGLRenderer();
    const renderTarget = new THREE.WebGLRenderTarget(512, 512);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( 1000, 500 );
    document.body.appendChild( renderer.domElement );

    //CAMERA
    const fov = 70;
    const aspect = 1; // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set(0,5.5,5)
    camera.lookAt(new THREE.Vector3(0,4,0));

    //FAKE CAMERA
    const fakeCamera = new THREE.PerspectiveCamera( 45, 1, 0.1, 9.2 );
    fakeCamera.position.set(0, -10, 10)
    fakeCamera.lookAt(new THREE.Vector3(0,-10,0));

    //SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );

    //FAKE SCENE
    const fakeScene = new THREE.Scene();
    fakeScene.background = new THREE.Color( 0x8080FF );

    // LIGHTING
    const color = 0xFFFFFF;
    const intensity = 200;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(0, 6, 10);
    light.distance = 0;
    scene.add(light);

    //TORUS
    const normalMaterial = new THREE.MeshNormalMaterial();

    const torusGeometry = new THREE.TorusGeometry(2, 1, 16, 100);
    const torus = new THREE.Mesh( torusGeometry, normalMaterial );
    
    fakeScene.add( torus );
    torus.position.y=-10;

    //CUBE
    const geometry = new THREE.BoxGeometry( 3, 3, 3);

    const cubes = []; // array for cubes
    const loader = new THREE.TextureLoader();

    const brickTexture = loader.load( './textures/simplebrick/diffuse.png' );
    brickTexture.colorSpace = THREE.SRGBColorSpace;
    brickTexture.magFilter = THREE.NearestFilter;

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

    // CUBE MATERIAL
    const cubeMaterial = new THREE.MeshPhongMaterial( {
        map: brickTexture,
        normalMap: renderTarget.texture,
    } );

    // CUBES
    const cube = new THREE.Mesh( geometry, cubeMaterial );
    scene.add( cube );
    cubes.push( cube ); // add to cubes list
    cube.position.x=0;
    cube.position.y=4;
    cube.position.z=0;


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
            //const speed = 0;
            const speed = .2;
            const rot = time * speed;
            //cube.rotation.x = rot;
            cube.rotation.y = rot;

        renderer.setRenderTarget(renderTarget);
        renderer.render( fakeScene, fakeCamera );
		renderer.setRenderTarget( null );

        renderer.render( scene, camera );
        requestAnimationFrame( render );

    }

    requestAnimationFrame( render );

}

main();