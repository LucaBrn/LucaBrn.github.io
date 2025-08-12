//import * as THREE from 'three';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';

function main() {

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( 1400, 700 );
    document.body.appendChild( renderer.domElement );

    const fov = 70;
    const aspect = 1; // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set(0,5.5,5)
    camera.lookAt(new THREE.Vector3(0,3,0));

    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );

    // LIGHTING
    const color = 0xFFFFFF;
    const intensity = 200;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(0, 6, 10);
    light.distance = 0;
    scene.add(light);

    const geometry = new THREE.BoxGeometry( 3, 3, 3);

    const cubes = []; // array for cubes
    const loader = new THREE.TextureLoader();

    const brickTexture = loader.load( 'textures/circleText.png' );
    brickTexture.colorSpace = THREE.SRGBColorSpace;
    brickTexture.magFilter = THREE.NearestFilter;
 
    const normTexture = loader.load( 'textures/circleRedNorm.png' );
    normTexture.magFilter = THREE.NearestFilter;

    const bumpTexture = loader.load( 'textures/circleBump.png' );
    bumpTexture.magFilter = THREE.NearestFilter;

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

    // CUBE MATERIALS
    const material1 = new THREE.MeshPhongMaterial( {
        map: brickTexture,
        normalMap: normTexture,
    } );

        const material2 = new THREE.MeshPhongMaterial( {
        map: brickTexture,
        bumpMap: bumpTexture,
    } );

    // CUBES
    const cube1 = new THREE.Mesh( geometry, material1 );
    scene.add( cube1 );
    cubes.push( cube1 ); // add to cubes list
    cube1.position.x=3;
    cube1.position.y=3;
    cube1.position.z=0;

    const cube2 = new THREE.Mesh( geometry, material2 );
    scene.add( cube2 );
    cubes.push( cube2 ); // add to cubes list
    cube2.position.x=-3;
    cube2.position.y=3;
    cube2.position.z=0;

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

        cubes.forEach( ( anycube ) => {
            const speed = .2;
            const rot = time * speed;
            //cube.rotation.x = rot;
            anycube.rotation.y = rot;
        } );

        renderer.render( scene, camera );
        requestAnimationFrame( render );

    }

    requestAnimationFrame( render );

}

main();