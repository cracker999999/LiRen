//https://www.dejs.vip/2obfuscator

var config = {
    environment: true,
    showAxes: false,
    debug: false,
    
    exposure: -0.3,
    toneMapping: THREE.LinearToneMapping,
    ambientIntensity: 0.3,
    ambientColor: '#FFFFFF',
    directIntensity: 0.5 * Math.PI, // TODO(#116)
    directColor: '#FFFFFF',
};

function isInnovationRoom(){
    return parent.location.href.indexOf('innovationRoom/index.html') > -1
}

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
var transparentType = urlParams.transType || '';
var changeColor = urlParams.color;
var type = urlParams.type;
var scale = parseFloat(urlParams.scale) || 1;

var model;
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
window.controls = controls;
controls.enableDamping = true;//开启阻尼效果，拖拽时有惯性效果

config.showAxes && addAxesHelper();

function addLights() {
    const ambientLight = new THREE.AmbientLight(config.ambientColor, config.ambientIntensity);
    ambientLight.name = 'ambient_light';
    defaultCamera.add(ambientLight);

    const directLight = new THREE.DirectionalLight(config.directColor, config.directIntensity);
    directLight.position.set(0.5, 0, 0.866); // ~60º
    directLight.name = 'main_light';
    defaultCamera.add(directLight);

    lights.push(ambientLight, directLight);

    renderer.toneMapping = Number(config.toneMapping);
    renderer.toneMappingExposure = Math.pow(2, config.exposure);

    if (lights.length === 2) {
        lights[0].intensity = config.ambientIntensity;
        lights[0].color.set(config.ambientColor);
        lights[1].intensity = config.directIntensity;
        lights[1].color.set(config.directColor);
    }
}

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
        model = gltf.scene || gltf.scenes[0];
        clips = gltf.animations || [];
        // console.log(clips.length);
        if (clips.length > 0) {
            console.log(clips);
        }

        onModelLoaded();
    }, progressEvt => {
        document.getElementById('load').innerText = (progressEvt.loaded / progressEvt.total * 100).toFixed() + '%';
    });
}

function loadFBX() {
    // const manager = new THREE.LoadingManager();
    // manager.addHandler( /\.tga$/i, new THREE.TGALoader());

    var fbxLoader = new THREE.FBXLoader();
    fbxLoader.setPath(window.baseFilesPath || './');
    fbxLoader.load(modelName + '.fbx', function(fbx){
        model = fbx;
        clips = fbx.animations || [];
        // console.log(clips.length);
        if (clips.length > 0) {
            console.log(clips);
        }

        onModelLoaded();
    }, progressEvt => {
        document.getElementById('load').innerText = (progressEvt.loaded / progressEvt.total * 100).toFixed() + '%';
    });
}

function onModelLoaded() {
    // let scaleFactor = isMobile() ? 0.5 : 1;
    model.scale.multiplyScalar(scale);

    model.updateMatrixWorld();

    const box = new THREE.Box3().setFromObject(model);
    //模型在三个维度上的最大跨度。
    const size = box.getSize(new THREE.Vector3());
    const maxDis = size.length();
    const center = box.getCenter(new THREE.Vector3());

    //将模型移动到场景的原点
    model.position.x -= center.x;
    model.position.y -= center.y;
    model.position.z -= center.z;

    //把模型的底放到原点
    const scaleY = model.scale.y;
    const bottomY = size.y / 2;
    model.position.y += bottomY;

    //移到地台中心
    // model.position.x += 5;
    model.position.y -= 45;

    if(config.debug)
    {
        // 添加透明绿色包围盒
        const boxHelper = new THREE.BoxHelper(model, 0x00ff00);
        scene.add(boxHelper);

        // 添加高度标签
        const height = size.y;
        const heightLabel = createTextLabel(`height: ${parseFloat(height).toFixed(2)}`, 0x00ff00);
        heightLabel.position.set(box.max.x, box.max.y, box.max.z);
        // scene.add(heightLabel);

        const scaleLabel = createTextLabel(`scale: ${parseFloat(scale).toFixed(2)}`, 0x00ff00);
        scaleLabel.position.set(box.min.x, box.max.y, box.max.z);
        scene.add(scaleLabel);
    }

    //注释掉模型会闪烁
    defaultCamera.near = maxDis / 100;
    defaultCamera.far = maxDis * 100;
    defaultCamera.updateProjectionMatrix();
    // console.log(defaultCamera.near, defaultCamera.far);

    // defaultCamera.position.copy(center);
    defaultCamera.position.set(0, -10, 100);
    // defaultCamera.position.x += maxDis / 2.0;
    // defaultCamera.position.y += maxDis / 10.0;
    
    if (isMobile() && isInnovationRoom()) {
        defaultCamera.position.z += 150;
    }
    else{
        defaultCamera.position.z += 50;
    }
    // defaultCamera.lookAt(center);
    //看向地台
    defaultCamera.lookAt(new THREE.Vector3(0, -45, 0));

    scene.add(model);
    // console.log(model.scale);

    initColorDict();
    setTransparent();
    
    document.getElementById('loading').style.display = 'none';
    document.getElementById('loaderOver').style.display = 'block';
    document.getElementById('colorBar').style.display = 'block';

    initScaleInput();
}

function initScaleInput() {
    const scaleInput = document.getElementById('scaleInput');
    if (scaleInput) {
        // console.log(scaleInput);
        scaleInput.value = scale;
        scaleInput.addEventListener('change', function() {
            const newScale = parseFloat(this.value);
            if (!isNaN(newScale) && newScale > 0) {
                setModelScale(newScale);
            }
        });
    } else {
        console.error('无法找到id为scaleInput的元素');
    }
}

function setModelScale(newScale) {
    model.scale.setScalar(newScale);
}

// 创建文本标签的函数
function createTextLabel(text, color) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '40px Arial';
    context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    context.fillText(text, 0, 40);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    
    // 调整精灵的大小
    const scaleFactor = 0.1;  // 调整这个值来改变标签大小
    sprite.scale.set(canvas.width * scaleFactor, canvas.height * scaleFactor, 1);

    return sprite;
}

// transparent格式为
// BZLR_P49b_glass01:ffffff,BZLR_P49b_glass02:c339b0
// mesh:color,mesh:color
function setTransparent(){
    if (transparent === '') return;

    transparent = transparent.replace(/\n+/g, "");//过滤换行
    transparent = transparent.replace(/\r+/g, "");//过滤回车
    transparent = transparent.replace(/\s+/g, "");//过滤空格/
    var arr = transparent.split(",");
    
    for (var i = 0; i < arr.length; i++){
        var meshColor = arr[i];
        var meshName = meshColor.split(":")[0];
        var color = '0x'+meshColor.split(":")[1];
        //convert color to hex
        color = parseInt(color, 16);
        // console.log(meshName, color);
        
        var obj = model.getObjectByName(meshName);
        if (obj){
            var yakeliMat = new THREE.MeshPhysicalMaterial({
                'color': color,
                'roughness': 0.2,
                'metalness': 0,
                'transmission': 1,
                'ior': 1.86,
                'reflectivity': 0.68,
                'thickness': 3,
                'envMapIntensity': 3,
                'clearcoat': 1,
                'clearcoatRoughness': 0.1,
                'normalScale': 0.3,
                'clearcoatNormalScale': 0.2,
                'normalRepeat': 3,
                
                // 'transparent': true,
                // 'opacity': 0.3,
                // 'envMap': neutralEnvironment,
            });

            var glassMat1 = new THREE.MeshPhysicalMaterial({
                'color': color,
                'metalness': 0,
                'roughness': 0.1,
                'transparent': true,
                // 'envMap': neutralEnvironment,
                'opacity': 0.3,
                'reflectivity': 0.5
            });

            if(transparentType == 'yakeli')
            {
                obj.material = yakeliMat;
            }
            else
            {
                obj.material = glassMat1;
            }
        }
        else{
            console.log("mesh not found: " + meshName);
        }
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
    this.gridHelper.scale.set(10, 10, 10);
    this.axesHelper.scale.set(10, 10, 10);
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
    if (!animateToNewPos && !model.oldPos)
        return;

    model = scene.getObjectByName(objectName);
    var currPos = model.position.clone();
    
    if (!model.oldPos) {
        model.oldPos = model.position.clone();
        model.newPos = model.position.clone().add(currPos.set(moveDistance, 0, 0));
    }

    var tween = new TWEEN.Tween(model.position);
    tween.to(animateToNewPos ? model.newPos : model.oldPos, 1000);
    tween.start();
}

function playAllAnim() {
    if(clips.length === 0) return;

    mixer = new THREE.AnimationMixer(model);
    for (var i = 0; i < clips.length; i++) {
        AnimationAction = mixer.clipAction(clips[i]);
        AnimationAction.timeScale = 1;
        AnimationAction.loop = THREE.LoopOnce;
        AnimationAction.clampWhenFinished = true;
        AnimationAction.play();
    }
}

function playAnim() {
    if(clips.length === 0) return;
    mixer = new THREE.AnimationMixer(model);
    AnimationAction = mixer.clipAction(clips[0]);
    AnimationAction.timeScale = 1;
    AnimationAction.loop = THREE.LoopOnce;
    AnimationAction.clampWhenFinished = true;
    AnimationAction.play();
}

function playAllAnimReverse() {
    if(clips.length === 0) return;

    mixer = new THREE.AnimationMixer(model);
    for (var i = 0; i < clips.length; i++) {
        AnimationAction = mixer.clipAction(clips[i]);
        AnimationAction.timeScale = -1;
        AnimationAction.loop = THREE.LoopOnce;
        AnimationAction.clampWhenFinished = true;
        AnimationAction.time = AnimationAction.getClip().duration;
        AnimationAction.play();
    }
}

function playAnimReverse() {
    if(clips.length === 0) return;
    mixer = new THREE.AnimationMixer(model);
    AnimationAction = mixer.clipAction(clips[0]);
    // 设置时间缩放为负值,实现反向播放
    AnimationAction.timeScale = -1;
    AnimationAction.loop = THREE.LoopOnce;
    AnimationAction.clampWhenFinished = true;
    
    // 将动画设置到结束状态
    AnimationAction.time = AnimationAction.getClip().duration;
    AnimationAction.play();
}

//拆解
function pos() {
    // playAnim();
    playAllAnim();
}

//组合
function bos() {
    // playAnimReverse();
    playAllAnimReverse();
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