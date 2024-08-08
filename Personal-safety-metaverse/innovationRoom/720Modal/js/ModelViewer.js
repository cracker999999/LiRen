//https://www.dejs.vip/2obfuscator

var config = {
    environment: true,
    showAxes: false,
    
    exposure: 0.0,
    toneMapping: THREE.LinearToneMapping,
    ambientIntensity: 0.3,
    ambientColor: '#FFFFFF',
    directIntensity: 0.5 * Math.PI, // TODO(#116)
    directColor: '#FFFFFF',
};

function getUrlParams() {
    const params = {};
    const queryString = window.location.search.slice(1);
    const pairs = queryString.split('&');

    for (let pair of pairs) {
    const [key, value] = pair.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }

    return params;
}

const urlParams = getUrlParams();
// console.log(urlParams);

var modelName = urlParams.model;
var animation = urlParams.anim;
var transparent = urlParams.trans;
var changeColor = urlParams.color;
var type = urlParams.type;

var mesh;
var mixer;
var hdrCubeRenderTarget = null;
var texture;
var scene = new THREE.Scene();
var clips;
var lights = [];

var width = window.innerWidth;
var height = window.innerHeight;
var defaultCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
defaultCamera.lookAt(scene.position);
scene.add(defaultCamera);

var renderer = new THREE.WebGLRenderer({
    'antialias': true,
    'alpha': true
});
// renderer.setClearColor(0x191919);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);
// renderer.gammaOutput = true;
// renderer.gammaFactor = 2.2;

var pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

var neutralEnvironment = pmremGenerator.fromScene(new THREE.RoomEnvironment()).texture;
config.environment && (scene.environment = neutralEnvironment);

addLights();

var controls = new THREE.OrbitControls(defaultCamera, renderer.domElement);
controls.screenSpacePanning = true;
// controls.target.set(59.26147475945824, 55.88615189082385, -30.479719301148734);
// controls.object.position.set(24.0555452775575, 72.5390994913941, 352.06251928626904);
window.controls = controls;
controls.enableDamping = true;//开启阻尼效果，拖拽时有惯性效果

config.showAxes && addAxesHelper();

// var texLoader = new THREE.TextureLoader();
// texLoader.setPath(window.baseFilesPath || './');
// var normal = texLoader.load('map/光照.png');
// normal.flipY = true;
// normal.wrapS = THREE.RepeatWrapping;
// normal.wrapT = THREE.RepeatWrapping;
// normal.repeat.set(1, 1);

// var rgbeLoader = new THREE.RGBELoader();
// rgbeLoader.setDataType(THREE.UnsignedByteType);
// rgbeLoader.setPath(window.baseFilesPath || './');
// rgbeLoader.load('map/109.hdr', function (tex) {
//     hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(tex);
//     tex.dispose();
//     pmremGenerator.dispose();
//     texture = hdrCubeRenderTarget.texture;

// });

const draco = new THREE.DRACOLoader();
draco.setDecoderPath('./js/draco/');

if (type === 'glb') {
    loadGLTF();
}
else if (type === 'fbx') {
    loadFBX();
}

function loadGLTF() {
    var gltfLoader = new THREE.GLTFLoader();
    gltfLoader.setPath(window.baseFilesPath || './');
    gltfLoader.setDRACOLoader(draco);
    gltfLoader.load(modelName + '.glb', function(gltf){
        // console.log(gltf);
        var object = gltf.scene || gltf.scenes[0];
        clips = gltf.animations || [];
        console.log(clips);

        onModelLoaded(object);
    }, progressEvt => {
        document.getElementById('load').innerText = (progressEvt.loaded / progressEvt.total * 100).toFixed() + '%';
    });
}

function loadFBX() {
    var fbxLoader = new THREE.FBXLoader();
    fbxLoader.setPath(window.baseFilesPath || './');
    fbxLoader.load(modelName + '.fbx', function(fbx){
        var object = fbx;
        clips = fbx.animations || [];
        console.log(clips);

        onModelLoaded(object);
    }, progressEvt => {
        document.getElementById('load').innerText = (progressEvt.loaded / progressEvt.total * 100).toFixed() + '%';
    });
}

function onModelLoaded(object) {
    // let scaleFactor = isMobile() ? 0.5 : 1;
    // object.scale.multiplyScalar(0.5);

    object.updateMatrixWorld();

    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    object.position.x -= center.x;
    object.position.y -= center.y;
    object.position.z -= center.z;

    defaultCamera.near = size / 100;
    defaultCamera.far = size * 100;
    defaultCamera.updateProjectionMatrix();

    defaultCamera.position.copy(center);
    defaultCamera.position.x += size / 2.0;
    defaultCamera.position.y += size / 5.0;
    defaultCamera.position.z += size / 2.0;
    
    if (isMobile()) {
        defaultCamera.position.z += 300;
    }
    else{
        defaultCamera.position.z += 100;
    }
    defaultCamera.lookAt(center);

    scene.add(object);
    // console.log(object.scale);

    if (animation) {
        // playAnim(object);
    }

    initColorDict();
    setTransparent();
    
    document.getElementById('loading').style.display = 'none';
    document.getElementById('loaderOver').style.display = 'block';
    document.getElementById('colorBar').style.display = 'block';
}

function playAnim(object) {
    mixer = new THREE.AnimationMixer(object);
    AnimationAction = mixer.clipAction(object.animations[0]);
    AnimationAction.timeScale = 1;
    AnimationAction.loop = THREE.LoopOnce;
    AnimationAction.clampWhenFinished = true;
    AnimationAction.play();
}

function setTransparent(){
    if (transparent === '') return;

    var arr = transparent.split(",");
    // console.log("trans "+arr);
    for (var i = 0; i < arr.length; i++){
        var obj = scene.getObjectByName(arr[i]);
        if (obj){
            var mat = new THREE.MeshPhysicalMaterial({
                'color': 0x000000,
                'metalness': 0,
                'roughness': 0.1,
                'transparent': true,
                // 'envMap': neutralEnvironment,
                'opacity': 0.3,
                'reflectivity': 0.5
            });

            obj.material = mat;
        }
    }
}

function addLights() {
    const light1 = new THREE.AmbientLight(config.ambientColor, config.ambientIntensity);
    light1.name = 'ambient_light';
    defaultCamera.add(light1);

    const light2 = new THREE.DirectionalLight(config.directColor, config.directIntensity);
    light2.position.set(0.5, 0, 0.866); // ~60º
    light2.name = 'main_light';
    defaultCamera.add(light2);

    lights.push(light1, light2);

    renderer.toneMapping = Number(config.toneMapping);
    renderer.toneMappingExposure = Math.pow(2, config.exposure);

    if (lights.length === 2) {
        lights[0].intensity = config.ambientIntensity;
        lights[0].color.set(config.ambientColor);
        lights[1].intensity = config.directIntensity;
        lights[1].color.set(config.directColor);
    }
}

var axesScene;
var axesCamera;
var axesRenderer;
var axesCorner;
var axesDiv;
function addAxesHelper() {
    var el = document.createElement('div');
    axesDiv = document.createElement('div');
    el.appendChild(axesDiv);
    axesDiv.classList.add('axes');

    const { clientWidth, clientHeight } = axesDiv;

    axesScene = new THREE.Scene();
    axesCamera = new THREE.PerspectiveCamera(50, clientWidth / clientHeight, 0.1, 10);
    axesScene.add(axesCamera);

    axesRenderer = new THREE.WebGLRenderer({ alpha: true });
    axesRenderer.setPixelRatio(window.devicePixelRatio);
    axesRenderer.setSize(axesDiv.clientWidth, axesDiv.clientHeight);

    axesCamera.up = defaultCamera.up;

    axesCorner = new THREE.AxesHelper(5);
    axesScene.add(axesCorner);
    axesDiv.appendChild(axesRenderer.domElement);

    axesCamera.position.copy(defaultCamera.position);
    axesCamera.lookAt(axesScene.position);
    axesRenderer.render(axesScene, axesCamera);

    this.gridHelper = new THREE.GridHelper();
    this.axesHelper = new THREE.AxesHelper();
    this.axesHelper.renderOrder = 999;
    this.axesHelper.onBeforeRender = (renderer) => renderer.clearDepth();
    scene.add(this.gridHelper);
    scene.add(this.axesHelper);
}

let originColorDict = new Map();
function initColorDict()
{
    scene.traverse((obj) =>{
        if (obj.isMesh) {
            originColorDict.set(obj.name, "0x"+obj.material.color.getHexString());
        }
    });

    // console.log(originColorDict);
}

function resetAllColor()
{
    originColorDict.forEach((value, key) => {
        var mesh = scene.getObjectByName(key);
        mesh.material.color.setHex(value);
        // mesh.material.needsUpdate = true;
    });
}

function updateAllColor(color){
    originColorDict.forEach((value, key) => {
        var mesh = scene.getObjectByName(key);
        mesh.material.color.setHex(color);
        // mesh.material.needsUpdate = true;
    });
}

const objName = "BZLR_P2_opcaitas";
function red(){
    var mesh = scene.getObjectByName(objName);
    if(!mesh) return;
    mesh.material.color.setHex(0xff0000);
    // mesh.material.needsUpdate = true;
}

function green(){
    var mesh = scene.getObjectByName(objName);
    if(!mesh) return;
    mesh.material.color.setHex(0x00ff00);
    // mesh.material.needsUpdate = true;
}

function blue() {
    var mesh = scene.getObjectByName(objName);
    if(!mesh) return;
    mesh.material.color.setHex(0x0000ff);
    // mesh.material.needsUpdate = true;
}

function donghua(objectName, moveDistance, animateToNewPos = true) {
    if (!animateToNewPos && !mesh.oldPos)
        return;

    mesh = scene.getObjectByName(objectName);
    var currPos = mesh.position.clone();
    
    if (!mesh.oldPos) {
        mesh.oldPos = mesh.position.clone();
        mesh.newPos = mesh.position.clone().add(currPos.set(moveDistance, 0, 0));
    }

    var tween = new TWEEN.Tween(mesh.position);
    tween.to(animateToNewPos ? mesh.newPos : mesh.oldPos, 1000);
    tween.start();
}

//拆解
function pos() {
    donghua('立方体_5', -50, true);
    donghua('立方体_7', -50, true);
    donghua('立方体_3', 50, true);
    donghua('立方体_6', 50, true);
}

//组合
function bos() {
    donghua('立方体_6', -50, false);
    donghua('立方体_3', -50, false);
    donghua('立方体_5', 50, false);
    donghua('立方体_7', 50, false);
}

function isMobile(){
    return /iPhone|iPad|iPod|iOS|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // return /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent);
}

var clock = new THREE.Clock();

function render() {
    renderer.render(scene, defaultCamera);
    requestAnimationFrame(render);
    controls.update();
    TWEEN.update();
    if (mixer) {
        mixer.update(clock.getDelta());
    }

    //
    if(config.showAxes)
    {
        axesCamera.position.copy(defaultCamera.position);
        axesCamera.lookAt(axesScene.position);
        axesRenderer.render(axesScene, axesCamera);
    }
}

render();