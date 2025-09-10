import * as THREE from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main() {

    const canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
    });
    //renderer.autoClear = false;
    renderer.setPixelRatio(window.devicePixelRatio);

    const loader = new THREE.TextureLoader();

    const scene = new THREE.Scene();
    const bgTexture = loader.load('textures/background/monument_valley.jpg');
    bgTexture.colorSpace = THREE.SRGBColorSpace;
    scene.background = bgTexture;

    // CAMERA //
    const camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 100 );
    camera.position.set(0, 15, 10);
    camera.lookAt(new THREE.Vector3(0,13,0));

    // LIGHTING
    const light = new THREE.PointLight(0xFFFFFF, 400);
    light.position.set(0, 20, 10);
    light.distance = 0;
    scene.add(light);

    const aLight = new THREE.AmbientLight(0x404040);
    scene.add(aLight);

    const normScale = new THREE.Vector2(0, 0);

    let isFlatShaded = false;

    const settings = {
        flatShading: isFlatShaded,
    };

    // FLOOR
    const planeSize = 40;
    const floorTextureDiff = loader.load( 'textures/imported/wood_0066_color_1k.jpg' );

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshStandardMaterial({
        map: floorTextureDiff,
        //normalMap: floorTextureNorm,

        roughness: 0.4,
        });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);

    const woodTextureDiff = loader.load( 'textures/imported/plywood_diff_1k.png' );
    const woodTextureNorm = loader.load( 'textures/imported/plywood_nor_gl_1k.png' );

    const tableLegGeometry = new THREE.BoxGeometry(1,10,1);

    const woodMaterial = new THREE.MeshStandardMaterial({
        map: woodTextureDiff,
        normalMap: woodTextureNorm,
        normalScale: normScale,

        roughness: 0.3,
    });

    const tableLeg1 = new THREE.Mesh(tableLegGeometry, woodMaterial);
    const tableLeg2 = new THREE.Mesh(tableLegGeometry, woodMaterial);
    const tableLeg3 = new THREE.Mesh(tableLegGeometry, woodMaterial);
    const tableLeg4 = new THREE.Mesh(tableLegGeometry, woodMaterial);

    scene.add(tableLeg1, tableLeg2 ,tableLeg3 ,tableLeg4);
    tableLeg1.position.set(-8, 5, -5);
    tableLeg2.position.set(-8, 5, 3);
    tableLeg3.position.set(8, 5, 3);
    tableLeg4.position.set(8, 5, -5);

    const table = new THREE.Mesh(new THREE.BoxGeometry(17,1,9), woodMaterial);
    scene.add(table);
    table.position.set(0, 10.5, -1);

    const orangeSideDiff = loader.load( 'textures/imported/food_0023_color_1k.jpg' );
    const orangeSideNorm = loader.load( 'textures/imported/food_0023_normal_opengl_1k.png' );
    const orangePeelDiff = loader.load( 'textures/imported/food_0022_color_1k.jpg' );
    const orangePeelNorm = loader.load( 'textures/imported/food_0022_normal_opengl_1k.png' );

    const orangePeel = new THREE.Mesh(new THREE.SphereGeometry(
        1, 20, 6, 0, 2*Math.PI, 0, 0.5 * Math.PI
    ), new THREE.MeshStandardMaterial({
        map: orangePeelDiff,
        normalMap: orangePeelNorm,
        normalScale: normScale,

        roughness: 0.4,
    }));

    const orangeSide = new THREE.Mesh(new THREE.CircleGeometry(
        1,20
    ), new THREE.MeshStandardMaterial({
        map: orangeSideDiff,
        normalMap: orangeSideNorm,
        normalScale: normScale,

        roughness: 0.2,
    }));

    scene.add(orangePeel, orangeSide);

    orangePeel.position.set(0,12,0);
    orangePeel.rotation.set(5/4*Math.PI, 0, 1/4*Math.PI);

    orangeSide.position.set(0,12,0);
    orangeSide.rotation.set(7/4*Math.PI, 1/4*Math.PI, 0);

    const melonDiff = loader.load( 'textures/imported/food_0001_color_1k.jpg' );
    const melonNorm = loader.load( 'textures/imported/food_0001_normal_opengl_1k.png' );

    const melon = new THREE.Mesh(new THREE.SphereGeometry(
        2, 40,
    ), new THREE.MeshStandardMaterial({
        map: melonDiff,
        normalMap: melonNorm,
        normalScale: normScale,

        roughness: 0.3,
    }));

    scene.add(melon);

    melon.position.set(-2,13,-2);
    melon.rotation.set(1/4*Math.PI, 0, 1/4*Math.PI);

    const canDiff = loader.load( 'textures/imported/metal_0002_color_1k.jpg' );
    const canNorm = loader.load( 'textures/imported/metal_0002_normal_opengl_1k.png' );

    const can = new THREE.Mesh(new THREE.CylinderGeometry(
        0.6, 0.6, 2.5
    ), new THREE.MeshStandardMaterial({
        map: canDiff,
        normalMap: canNorm,
        normalScale: normScale,

        roughness: 0.1,
        metalness: 0.3,
    }));

    scene.add(can);
    can.position.set(2, 12.3, -1.5);

    const paperDiff = loader.load( 'textures/imported/paper_0012_color_1k.jpg' );
    const paperNorm = loader.load( 'textures/imported/paper_0012_normal_opengl_1k.png' );

    const paper = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 4), new THREE.MeshStandardMaterial({
        map: paperDiff,
        normalMap: paperNorm,
        normalScale: normScale,

        roughness: 0.8,
    }));

    scene.add(paper);
    paper.position.set(2, 11.05, -2);
    paper.rotation.set(0, 2/3*Math.PI, 0);

    const spongeDiff = loader.load( 'textures/imported/fabric_0028_color_1k.jpg' );
    const spongeNorm = loader.load( 'textures/imported/fabric_0028_normal_opengl_1k.png' );

    const sponge = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.7, 1.5), new THREE.MeshStandardMaterial({
        map: spongeDiff,
        normalMap: spongeNorm,
        normalScale: normScale,

        roughness: 0.6,
    }));

    scene.add(sponge);
    sponge.position.set(-3, 11.35, 0.3);
    sponge.rotation.set(0, -1/20*Math.PI, 0);

    const clothDiff = loader.load( 'textures/imported/fabrics_0081_color_1k.jpg' );
    const clothNorm = loader.load( 'textures/imported/fabrics_0081_normal_opengl_1k.png' );

    const cloth = new THREE.Mesh(new THREE.CircleGeometry(3.5, 40), new THREE.MeshStandardMaterial({
        map: clothDiff,
        normalMap: clothNorm,
        normalScale: normScale,

        roughness: 0.9,
    }));

    scene.add(cloth);
    cloth.position.set(-3, 11.01, -1);
    cloth.rotation.set(-0.5*Math.PI, 0, 3/4*Math.PI);

    const tireDiff = loader.load( 'textures/imported/plastic_0022_color_1k.jpg' );
    const tireNorm = loader.load( 'textures/imported/plastic_0022_normal_opengl_1k.jpg' );

    const tire = new THREE.Mesh(new THREE.TorusGeometry(0.9,0.4), new THREE.MeshStandardMaterial({
        map: tireDiff,
        normalMap: tireNorm,
        normalScale: normScale,

        roughness: 0.7,
    }));

    scene.add(tire);
    tire.position.set(2.5, 11.3, 1.3);
    tire.rotation.set(0.5*Math.PI, 0, 0);

    const diceDiff = loader.load( 'textures/imported/metal_0081_color_1k.jpg' );
    const diceNorm = loader.load( 'textures/imported/metal_0081_normal_opengl_1k.png' );

    const dice = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5), new THREE.MeshStandardMaterial({
        map: diceDiff,
        normalMap: diceNorm,
        normalScale: normScale,
        
        roughness: 0,
    }));

    scene.add(dice);
    dice.position.set(-5.2, 12.3, -2.5);

    const helper = new THREE.PointLightHelper(light);
    scene.add(helper);

    // GUI //
    const gui = new GUI();

    function updateLight() {
        helper.update();
    }   

    {
        const Lfolder = gui.addFolder('light');
        Lfolder.add(light, 'intensity', 0, 1000, 10);
        Lfolder.add(light.position, 'x', -20, 20).onChange(updateLight);
        Lfolder.add(light.position, 'z', -20, 20).onChange(updateLight);
        Lfolder.add(light.position, 'y', 0, 20).onChange(updateLight);
    }

    const params = {
        normalScale_x: normScale.x,
        normalScale_y: normScale.y,
    }

    {
        const Mfolder = gui.addFolder('materials');
        Mfolder.add(settings, 'flatShading').onChange(value =>{
            isFlatShaded = value;

            scene.traverse((child) => {
                if(child.isMesh && child.material){
                    child.material.flatShading = isFlatShaded;
                    child.material.needsUpdate = true;
                }
            })
        });
        Mfolder.add(params, 'normalScale_x', 0, 5, 0.1).onChange((value) => {
            normScale.x = value;
        });

        Mfolder.add(params, 'normalScale_y', 0, 5, 0.1).onChange((value) => {
            normScale.y = value;
        });
    }

    // CAMERA CONTROLS //
    const controls = new OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 13, 0 );
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

    function render() {

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

        renderer.render( scene, camera );

        requestAnimationFrame( render );
        controls.update();

    }

    requestAnimationFrame( render );
}

main();

class HudImage {
    constructor(src, key){
        this.key = key;
        this.img = new Image();
        this.img.src = src;

        Object.assign(this.img.style, {
            position: 'fixed',
            top: '20px',
            left: '20px',
            maxWidth: '25vw',
            display: 'none',
            pointerEvents: 'none',
        });

        document.body.appendChild(this.img);
    }
    show(){
        this.img.style.display = 'block';
    }

    hide(){
        this.img.style.display = 'none';
    }

    isVisible(){
        return this.img.style.display !== 'none';
    }
}

class HudManager {
    constructor(){
        this.huds = [];
        window.addEventListener('keydown', (event) => this.onKeyDown(event));
    }

    addImage(src, key){
        const hud = new HudImage(src, key);
        this.huds.push(hud);
        return hud;
    }

    onKeyDown(event){
        if(event.repeat) return;

        for(const hud of this.huds){
            if(event.code === hud.key){
                if(hud.isVisible()){
                    hud.hide();
                } else {
                    this.huds.forEach(h => h.hide());

                hud.show();
                }
            }
        }
    }
}
const hudManager = new HudManager();

hudManager.addImage('textures/imported/plywood_diff_1k.png', 'KeyQ');
hudManager.addImage('textures/imported/plywood_nor_gl_1k.png', 'KeyA');

hudManager.addImage('textures/imported/food_0023_color_1k.jpg', 'KeyW');
hudManager.addImage('textures/imported/food_0023_normal_opengl_1k.png', 'KeyS');

hudManager.addImage('textures/imported/food_0001_color_1k.jpg', 'KeyE');
hudManager.addImage('textures/imported/food_0001_normal_opengl_1k.png', 'KeyD');

hudManager.addImage('textures/imported/paper_0012_color_1k.jpg', 'KeyR');
hudManager.addImage('textures/imported/paper_0012_normal_opengl_1k.png' , 'KeyF');

hudManager.addImage('textures/imported/fabric_0028_color_1k.jpg', 'KeyT');
hudManager.addImage('textures/imported/fabric_0028_normal_opengl_1k.png', 'KeyG');

hudManager.addImage('textures/imported/plastic_0022_color_1k.jpg', 'KeyY');
hudManager.addImage('textures/imported/plastic_0022_normal_opengl_1k.jpg', 'KeyH');

hudManager.addImage('textures/imported/fabrics_0081_color_1k.jpg', 'KeyU');
hudManager.addImage('textures/imported/fabrics_0081_normal_opengl_1k.png', 'KeyJ');