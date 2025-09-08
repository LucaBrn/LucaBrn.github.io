import * as THREE from 'three';

//import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';

function main() {

    const renderer = new THREE.WebGLRenderer();
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( 500, 500 );
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild( renderer.domElement );

    const loader = new THREE.TextureLoader();

    const bgTexture = loader.load('textures/normalGuide.png');
    bgTexture.colorSpace = THREE.SRGBColorSpace;
    bgTexture.magFilter = THREE.NearestFilter;
    bgTexture.minFilter = THREE.NearestFilter;

    const scene = new THREE.Scene();
    scene.background = bgTexture;
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 20);
    camera.position.set(0, 0, 5);

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.25), new THREE.MeshNormalMaterial({
        polygonOffset: true,
    }));
    const helper = new VertexNormalsHelper( plane, 1, 0xFFFFFF );

    var geo = new THREE.EdgesGeometry( plane.geometry ); // or WireframeGeometry
    var mat = new THREE.LineBasicMaterial( { color: 0xffffff } );
    var wireframe = new THREE.LineSegments( geo, mat );
    plane.add( wireframe );

    scene.add(plane);
    scene.add(helper);

    const controls = new OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 0, 0 );
	controls.update();

    function render() {

        renderer.render(scene, camera);

        requestAnimationFrame( render );
        controls.update();
    }
    requestAnimationFrame( render );
}

main();