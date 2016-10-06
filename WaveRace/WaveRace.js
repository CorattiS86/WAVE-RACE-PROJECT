var canvas;
var engine;
var MAIN_SCENE;

var angle = 0.0;
var boxbase;

var speed   = 0.0;
var accelleration = 0.0;

var loaded = false;
var incline  = 0.0;
var steering = 0.0;
var previous = 0.0;
var prev_position = 0.0;
var move = 0.0;
var direction = 0.0;
var upper = 0.0;
var extra = 0.0;
var index = 0;

var collisionMeshes = [];
var collisionSX = false;
var collisionDX = false;

var MAX_SPEED = 10.0;
var MAX_INCLINE = 0.6;
var MAX_UPPER = 0.5;

var differentCam = [];

function main(){

    canvas = document.getElementById("CorattiCanvas");
    engine = new BABYLON.Engine(canvas, true);
 
    MAIN_SCENE = createScene();
  
    // run the render loop
    engine.runRenderLoop(function(){
            MAIN_SCENE.render();
            loaded = true;
            
    });
    
} 
                      
function createScene() {
    
    var scene = new BABYLON.Scene(engine);
 
    var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0.0, 0.0, 0.0), scene);
    camera.attachControl(canvas, false);
    
    var ambient = new BABYLON.HemisphericLight("ambient", new BABYLON.Vector3( 0.0, 1.0, 0.0), scene);
    ambient.diffuse  = new BABYLON.Color3(0.4, 0.4, 0.4); 
    ambient.specular = new BABYLON.Color3(0.0, 0.0, 0.0);
    
    var sun = new BABYLON.DirectionalLight("sun", new BABYLON.Vector3( -1.0, -1.0, 1.0), scene);
    sun.diffuse = new BABYLON.Color3( 1.0, 1.0, 1.0);
    sun.specular = new BABYLON.Color3( 1.0, 1.0, 1.0);
    //////////////////////// CREATE OBJECTS ///////////////////////////////////////////////////////////////
    
	// Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 10000.0, scene);
    skybox.material = new BABYLON.StandardMaterial("skyBox", scene);
    skybox.material.backFaceCulling = false;
    skybox.material.reflectionTexture = new BABYLON.CubeTexture("./textures/cubeTextures/sky/sky", scene);
    skybox.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
    //skybox.material.specularColor = new BABYLON.Color3(0.0, 0, 0);
	
    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "./textures/heightMaps/map1.jpg", 4000, 4000, 250, 0, 300, scene);
    ground.position.y= -15;
    ground.material = new BABYLON.StandardMaterial("terrain1", scene);
    ground.material.diffuseTexture = new BABYLON.Texture("./textures/terrain_1.jpg", scene);
    ground.material.diffuseTexture.uScale = 50.0;
    ground.material.diffuseTexture.vScale = 50.0;
    ground.material.bumpTexture = new BABYLON.Texture("./textures/bumpTextures/bump_rock.jpg", scene);
    ground.material.bumpTexture.uScale = 10.0;
    ground.material.bumpTexture.vScale = 10.0;
    
    var ground2 = BABYLON.Mesh.CreateGroundFromHeightMap("ground2", "./textures/heightMaps/map2.jpg", 4000, 4000, 250, 0, 50, scene);
    ground2.position.y= -10;
    ground2.material = new BABYLON.StandardMaterial("terrain2", scene);
    ground2.material.diffuseTexture = new BABYLON.Texture("./textures/terrain_2.jpg", scene);
    ground2.material.bumpTexture = new BABYLON.Texture("./textures/bumpTextures/bump_land.png", scene);
    ground2.material.bumpTexture.uScale = 5.0;
    ground2.material.bumpTexture.vScale = 5.0;
    
    var torusMaterial = new BABYLON.StandardMaterial("mat_torus", scene);
    torusMaterial.diffuseTexture = new BABYLON.Texture("./textures/redChess.jpg", scene); 
    torusMaterial.diffuseTexture.uScale = 3.0;
    torusMaterial.diffuseTexture.vScale = 0.5;
    torusMaterial.specularColor = new BABYLON.Color3(0.0, 0.0, 0.0);
    
    var torus1 = BABYLON.Mesh.CreateTorus("torus1", 250, 40, 10, scene, false);
    torus1.position = new BABYLON.Vector3( 0.0, -5.0, -1200.0);
    torus1.rotation = new BABYLON.Vector3( Math.PI/2, Math.PI/2, 0.0);
    torus1.material = torusMaterial;    
    
    var torus2 = BABYLON.Mesh.CreateTorus("torus2", 250, 40, 10, scene, false);
    torus2.position = new BABYLON.Vector3( -800.0, -5.0, -800.0);
    torus2.rotation = new BABYLON.Vector3( Math.PI/2, -Math.PI/4, 0.0);
    torus2.material = torusMaterial;
    
    var torus3 = BABYLON.Mesh.CreateTorus("torus3", 250, 40, 10, scene, false);
    torus3.position = new BABYLON.Vector3( -1200.0, -5.0, 0.0);
    torus3.rotation = new BABYLON.Vector3( Math.PI/2, 0.0, 0.0);
    torus3.material = torusMaterial;
    
    var torus4 = BABYLON.Mesh.CreateTorus("torus4", 250, 40, 10, scene, false);
    torus4.position = new BABYLON.Vector3( 1200.0, -5.0, -400.0);
    torus4.rotation = new BABYLON.Vector3( Math.PI/2, 0.0, 0.0);
    torus4.material = torusMaterial;
    
    var plan = BABYLON.Mesh.CreatePlane("plane", 100.0, scene);
    plan.position = new BABYLON.Vector3( 500.0, -5.0, -1200.0);
    plan.rotation = new BABYLON.Vector3( Math.PI/3, -Math.PI/2, 0.0);
    plan.material = new BABYLON.StandardMaterial("mat_plan", scene);
    plan.material.diffuseTexture = new BABYLON.Texture("./textures/crate3.jpg", scene);  
    plan.material.bumpTexture = new BABYLON.Texture("./textures/bumpTextures/customMap.jpg", scene);
    plan.material.backFaceCulling = false;
    
    var planJump = BABYLON.Mesh.CreatePlane("planJump", 100.0, scene);
    planJump.parent = plan;
    planJump.position = new BABYLON.Vector3( 0.0, 40.0, -40.0);
    planJump.rotation = new BABYLON.Vector3( -Math.PI/2, 0.0, 0.0);
    planJump.material = new BABYLON.StandardMaterial("mat_planJump", scene);   
    planJump.material.alpha = 0.0;
    
    var sea = BABYLON.Mesh.CreateGround("sea", 10000, 10000, 16, scene);
    sea.position.y = -10;
    sea.material = new BABYLON.WaterMaterial("water_material", scene);
    sea.material.bumpTexture = new BABYLON.Texture("./textures/bumpTextures/bump_water.png", scene); // Set the bump texture
    sea.material.windForce = 45; // Represents the wind force applied on the water surface
    sea.material.waveHeight = 0.4; // Represents the height of the waves
    sea.material.bumpHeight = 2.3; // According to the bump map, represents the pertubation of reflection and refraction
    sea.material.windDirection = new BABYLON.Vector2(-1.0, 0.0); // The wind direction on the water surface (on width and height)
    sea.material.waterColor = new BABYLON.Color3(0.1, 0.1, 0.6); // Represents the water color mixed with the reflected and refracted world
    sea.material.colorBlendFactor = 0.0; // Factor to determine how the water color is blended with the reflected and refracted world
    sea.material.waveLength = 0.05; // The lenght of waves. With smaller values, more waves are generated 
    sea.material.addToRenderList(skybox);
    sea.material.addToRenderList(ground);
    sea.material.addToRenderList(ground2);
    sea.material.addToRenderList(torus1);
    sea.material.addToRenderList(torus2);
    sea.material.addToRenderList(torus3);
    sea.material.addToRenderList(torus4);
    sea.material.addToRenderList(plan);
    
    //////////////// GRAVITY & COLLISION //////////////////////////////////////////////////////////////////
    //scene.gravity = new BABYLON.Vector3(0.0, -9.81, 0.0);
    //camera.applyGravity = true;
    
    //camera.ellipsoid = new BABYLON.Vector3(3, 13, 3);
    
    scene.collisionsEnabled = true;
        
    var collisionMaterial = new BABYLON.StandardMaterial("mat_collision", scene);
    collisionMaterial = new BABYLON.StandardMaterial("mat_box", scene);
    collisionMaterial.diffuseColor = new BABYLON.Color3(1.0, 0.0, 0.0);
    collisionMaterial.alpha = 0.0;
    
    var box1 = BABYLON.Mesh.CreateBox("box1", 300.0, scene);
    box1.position = new BABYLON.Vector3( 30.0, 0.0, 300.0);
	box1.scaling  = new BABYLON.Vector3( 7.2, 1.0, 1.4);
    box1.material = collisionMaterial;
    collisionMeshes.push(box1);
     
    var box2 = BABYLON.Mesh.CreateBox("box2", 300.0, scene);
    box2.position = new BABYLON.Vector3( 30.0, 0.0, 1530.0);
	box2.scaling  = new BABYLON.Vector3( 11.0, 1.0, 1.0);
    box2.material = collisionMaterial;
    collisionMeshes.push(box2);
    
    var box3 = BABYLON.Mesh.CreateBox("box3", 300.0, scene);
    box3.position = new BABYLON.Vector3( -60.0, 0.0, 1070.0);
	box3.scaling  = new BABYLON.Vector3( 2.3, 1.0, 2.1);
    box3.material = collisionMaterial;
    collisionMeshes.push(box3);
    
    var box4 = BABYLON.Mesh.CreateBox("box4", 300.0, scene);
    box4.position = new BABYLON.Vector3( -900.0, 0.0, 600.0);
	box4.scaling  = new BABYLON.Vector3( 1.8, 1.0, 3.0);
    box4.material = collisionMaterial;
    collisionMeshes.push(box4);
    
    var box5 = BABYLON.Mesh.CreateBox("box5", 300.0, scene);
    box5.position = new BABYLON.Vector3( 1650.0, 0.0, 820.0);
	box5.scaling  = new BABYLON.Vector3( 1.3, 1.0, 5.0);
    box5.material = collisionMaterial;
    collisionMeshes.push(box5);
    
    var box6 = BABYLON.Mesh.CreateBox("box6", 300.0, scene);
    box6.position = new BABYLON.Vector3( 930.0, 0.0, 680.0);
	box6.scaling  = new BABYLON.Vector3( 2.4, 1.0, 3.0);
    box6.material = collisionMaterial;
    collisionMeshes.push(box6);
    
    var box7 = BABYLON.Mesh.CreateBox("box7", 300.0, scene);
    box7.position = new BABYLON.Vector3( -1550.0, 0.0, 920.0);
	box7.scaling  = new BABYLON.Vector3( 1.0, 1.0, 5.0);
    box7.material = collisionMaterial;
    collisionMeshes.push(box7);
    
    var box8 = BABYLON.Mesh.CreateBox("box8", 300.0, scene);
    box8.position = new BABYLON.Vector3( 1600.0, 0.0, -1000.0);
	box8.scaling  = new BABYLON.Vector3( 0.8, 1.0, 4.4);
    box8.material = collisionMaterial;
    collisionMeshes.push(box8);
    
    var box9 = BABYLON.Mesh.CreateBox("box9", 300.0, scene);
    box9.position = new BABYLON.Vector3( 1100.0, 0.0, -1620.0);
	box9.scaling  = new BABYLON.Vector3( 4.0, 1.0, 1.0);
    box9.material = collisionMaterial;
    collisionMeshes.push(box9);
    
    var sphere1 = BABYLON.Mesh.CreateSphere("sphere1", 8 ,550.0, scene);
    sphere1.position = new BABYLON.Vector3( 700.0, 0.0, -700.0);
	sphere1.scaling  = new BABYLON.Vector3( 1.0, 1.0, 1.0);
    sphere1.material = collisionMaterial;
    collisionMeshes.push(sphere1);
       
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    createScooter(scene)

    return scene;
}

function createScooter(thisScene)
{
    var scene = thisScene;
    var cam = scene.getCameraByID("Camera");
    
    var pos_Driver = BABYLON.Mesh.CreateSphere("pos_Driver", 8.0, 40.0, scene);
    pos_Driver.position = new BABYLON.Vector3(1200.0, -5.0, 0.0 );
    pos_Driver.rotation = new BABYLON.Vector3( 0.0, Math.PI, 0.0 );
    pos_Driver.material = new BABYLON.StandardMaterial("mat_boxbase", scene);
    pos_Driver.material.wireframe = true;
    pos_Driver.material.diffuseColor = new BABYLON.Color3(1.0, 13.0, 0.0);
    pos_Driver.material.alpha = 0.0;
    pos_Driver.checkCollisions = true;
    
    var dx_Driver = BABYLON.Mesh.CreateSphere("pos_Driver", 8.0, 10.0, scene);
    dx_Driver.parent = pos_Driver;
    dx_Driver.position = new BABYLON.Vector3( 3.0, 0.0, -4.0 );
    dx_Driver.scaling = new BABYLON.Vector3( 1.0, 1.0, 8.0 );
    dx_Driver.material = new BABYLON.StandardMaterial("mat_boxbase", scene);
    dx_Driver.material.wireframe = true;
    dx_Driver.material.diffuseColor = new BABYLON.Color3(0.0, 1.0, 0.0);
    dx_Driver.material.alpha = 0.0;
    dx_Driver.checkCollisions = true;
    
    var sx_Driver = BABYLON.Mesh.CreateSphere("pos_Driver", 8.0, 10.0, scene);
    sx_Driver.parent = pos_Driver;
    sx_Driver.position = new BABYLON.Vector3( -3.0, 0.0, -4.0 );
    sx_Driver.scaling = new BABYLON.Vector3( 1.0, 1.0, 8.0 );
    sx_Driver.material = new BABYLON.StandardMaterial("mat_boxbase", scene);
    sx_Driver.material.wireframe = true;
    sx_Driver.material.diffuseColor = new BABYLON.Color3(0.0, 1.0, 0.0);
    sx_Driver.material.alpha = 0.0;
    sx_Driver.checkCollisions = true;
    
    var boxbase = BABYLON.Mesh.CreateBox("boxbase", 5.0, scene);
    boxbase.parent = pos_Driver;    
	boxbase.position = new BABYLON.Vector3( 0.0, 0.0, 0.0 );
	boxbase.rotation = new BABYLON.Vector3( 0.0, 0.0, 0.0);
	boxbase.scaling  = new BABYLON.Vector3( 2.0, 1.0, 2.0); // 1.0, 0.5, 1.0
	boxbase.material = new BABYLON.StandardMaterial("mat_boxbase", scene);
    //boxbase.material.diffuseColor = new BABYLON.Color3(1.0, 1.0, 0.0);
    boxbase.material.diffuseTexture = new BABYLON.Texture("./textures/carena_scooter.jpg", scene);  
    boxbase.material.bumpTexture = new BABYLON.Texture("./textures/bumpTextures/bump_carena_scooter.jpg", scene);
    
    var scooterFace = BABYLON.Mesh.CreateCylinder("scooterFace", 5.0, 5.8, 5.8, 3, 1, scene, false);
	scooterFace.parent = boxbase;
	scooterFace.position = new BABYLON.Vector3( 0.0, -0.01, 3.95);
	scooterFace.rotation = new BABYLON.Vector3(-Math.PI/2, -Math.PI/2, 0.0);
	scooterFace.scaling  = new BABYLON.Vector3( 1.0, 1.0, 1.0);
	scooterFace.material = new BABYLON.StandardMaterial("mat_scooterFace", scene);
    scooterFace.material.diffuseColor = new BABYLON.Color3(1.0, 1.0, 0.0);
    //scooterFace.material.diffuseColor = new BABYLON.Color3(1.0, 1.0, 0.0);
    scooterFace.material.diffuseTexture = new BABYLON.Texture("./textures/carena_scooter.jpg", scene);  
    scooterFace.material.bumpTexture = new BABYLON.Texture("./textures/bump_carena_scooter.jpg", scene);
    
	var scooterCoverSideSx = BABYLON.Mesh.CreateCylinder("scooterCoverSideSx", 1.0, 5.8, 5.8, 3, 1, scene, false);
	scooterCoverSideSx.parent = boxbase; 
	scooterCoverSideSx.position = new BABYLON.Vector3(-2.0, -0.01, -5.4);
	scooterCoverSideSx.rotation = new BABYLON.Vector3(-Math.PI/2, -Math.PI/2, Math.PI);
	scooterCoverSideSx.scaling = new BABYLON.Vector3(2.0, 1.0, 1.0);
    scooterCoverSideSx.material = new BABYLON.StandardMaterial("mat_scooterCoverSideSx", scene);
    scooterCoverSideSx.material.diffuseColor = new BABYLON.Color3(1.0, 1.0, 0.0);
    //scooterCoverSideSx.material.diffuseColor = new BABYLON.Color3(1.0, 1.0, 0.0);
    scooterCoverSideSx.material.diffuseTexture = new BABYLON.Texture("./textures/carena_scooter.jpg", scene);  
    scooterCoverSideSx.material.bumpTexture = new BABYLON.Texture("./textures/bump_carena_scooter.jpg", scene);
    
    var scooterCoverSideDx = BABYLON.Mesh.CreateCylinder("scooterCoverSideDx", 1.0, 5.8, 5.8, 3, 1, scene, false);
	scooterCoverSideDx.parent = boxbase; 
	scooterCoverSideDx.position = new BABYLON.Vector3( 2.0, -0.01, -5.4);
	scooterCoverSideDx.rotation = new BABYLON.Vector3(-Math.PI/2, -Math.PI/2, Math.PI);
	scooterCoverSideDx.scaling = new BABYLON.Vector3(2.0, 1.0, 1.0);
    scooterCoverSideDx.material = new BABYLON.StandardMaterial("mat_scooterCoverSideDx", scene);
    scooterCoverSideDx.material.diffuseColor = new BABYLON.Color3(1.0, 1.0, 0.0);
    //scooterCoverSideDx.material.diffuseColor = new BABYLON.Color3(1.0, 1.0, 0.0);
    scooterCoverSideDx.material.diffuseTexture = new BABYLON.Texture("./textures/carena_scooter.jpg", scene);  
    scooterCoverSideDx.material.bumpTexture = new BABYLON.Texture("./textures/bump_carena_scooter.jpg", scene);
    
	var scooterChassis = BABYLON.Mesh.CreateCylinder("scooterChassis", 3.0, 2.0, 2.0, 3, 1, scene, false);
	scooterChassis.parent = boxbase; 
	scooterChassis.position = new BABYLON.Vector3( 0.0, 2.0, 2.4);
	scooterChassis.rotation = new BABYLON.Vector3(-Math.PI/2, -Math.PI/2, Math.PI);
	scooterChassis.scaling = new BABYLON.Vector3(8.0, 0.5, 1.0);
	scooterChassis.rotate(BABYLON.Axis.Y, -Math.PI/5 , BABYLON.Space.LOCAL);

	var scooterSteering = BABYLON.Mesh.CreateCylinder("scooterSteering", 4.0, 0.2, 0.2, 16, 1, scene, false);
	scooterSteering.parent = boxbase; 
	scooterSteering.position = new BABYLON.Vector3(0.0, 7.0, -4.0);
	scooterSteering.rotation = new BABYLON.Vector3(0.0, 0.0, Math.PI/2);
	scooterSteering.scaling = new BABYLON.Vector3(1.0, 1.0, 1.0);
	scooterSteering.material = new BABYLON.StandardMaterial("mat_scooterSteering", scene);
    scooterSteering.material.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);	
	
	var scooterFootboard = BABYLON.Mesh.CreateBox("scooterFootboard", 5.0, scene);	
	scooterFootboard.parent = boxbase;
	scooterFootboard.position = new BABYLON.Vector3(0.0, -0.7, -6.1);
	scooterFootboard.rotation = new BABYLON.Vector3(0.0, 0.0, 0.0);
	scooterFootboard.scaling = new BABYLON.Vector3(0.99, 0.25, 2.0);
	scooterFootboard.material = new BABYLON.StandardMaterial("mat_scooterFootboard", scene);
    scooterFootboard.material.diffuseTexture = new BABYLON.Texture("./textures/pedana.jpg", scene);
    scooterFootboard.material.bumpTexture = new BABYLON.Texture("./textures/bumpTextures/bump_pedana.png", scene);
    
    var scooterDashboard = BABYLON.Mesh.CreateBox("scooterDashboard", 1.0, scene);
	scooterDashboard.parent = scooterSteering;
	scooterDashboard.position = new BABYLON.Vector3( -0.3, 0.0, 0.3);
	scooterDashboard.rotation = new BABYLON.Vector3( 0.0, 0.0, 0.0);
	scooterDashboard.scaling = new BABYLON.Vector3(1.0, 1.9, 1.0);
    scooterDashboard.material = new BABYLON.StandardMaterial("mat_scooterDashboard", scene);
    scooterDashboard.material.backFaceCulling = false;
    scooterDashboard.material.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
	scooterDashboard.material.reflectionTexture = new BABYLON.CubeTexture("./textures/cubeTextures/speedometer/speedometer", scene);
    scooterDashboard.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    
	var driverHelmet = BABYLON.Mesh.CreateSphere("driverHelmet", 2.0, 2.5, scene);
	driverHelmet.parent = boxbase;
	driverHelmet.position = new BABYLON.Vector3(0.0, 12.0, -7.0);
	driverHelmet.rotation = new BABYLON.Vector3(0.0, 0.0, 0.0);
	driverHelmet.scaling = new BABYLON.Vector3(0.8, 2.0, 1.0);
	driverHelmet.material = new BABYLON.StandardMaterial("mat_driverHelmet", scene);
    driverHelmet.material.diffuseTexture = new BABYLON.Texture("./textures/carena_helmet.png", scene);
    
	var driverVisor = BABYLON.Mesh.CreateBox("driverVisor", 1.0, scene);
	driverVisor.parent = driverHelmet;
	driverVisor.position = new BABYLON.Vector3(0.0, -0.18, 0.95);
	driverVisor.rotation = new BABYLON.Vector3(0.0, 0.0, 0.0);
	driverVisor.scaling = new BABYLON.Vector3(1.2, 0.5, 0.5);
	driverVisor.rotate(BABYLON.Axis.X, 0.15, BABYLON.Space.LOCAL);
	driverVisor.material = new BABYLON.StandardMaterial("mat_driverVisor", scene);
    driverVisor.material.diffuseColor = new BABYLON.Color3(0.97, 0.62, 0.45);
    
	var driverVisorUP = BABYLON.Mesh.CreateCylinder("driverVisorUP", 1.0, 2.0, 2.0, 3, 1, scene, false);
	driverVisorUP.parent = driverHelmet;
	driverVisorUP.position = new BABYLON.Vector3( 0.0, 0.3, 1.0);
	driverVisorUP.rotation = new BABYLON.Vector3(-Math.PI/2, -Math.PI/2, Math.PI);
	driverVisorUP.scaling = new BABYLON.Vector3(1.0, 1.3, 0.5);	
	driverVisorUP.rotate(BABYLON.Axis.Y, Math.PI-Math.PI/12 , BABYLON.Space.LOCAL);
	driverVisorUP.material = new BABYLON.StandardMaterial("mat_driverVisorUP", scene);
    driverVisorUP.material.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
    
	var driverVisorDOWN = BABYLON.Mesh.CreateCylinder("driverVisorDOWN", 1.0, 2.0, 2.0, 3, 1, scene, false);
	driverVisorDOWN.parent = driverHelmet;
	driverVisorDOWN.position = new BABYLON.Vector3( 0.0, -0.5, 0.5);
	driverVisorDOWN.rotation = new BABYLON.Vector3(-Math.PI/2, -Math.PI/2, Math.PI);
	driverVisorDOWN.scaling = new BABYLON.Vector3(1.0, 1.3, 0.5);	
	driverVisorDOWN.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL);
	driverVisorDOWN.material = new BABYLON.StandardMaterial("mat_driverVisorDOWN", scene);
    driverVisorDOWN.material.diffuseColor = new BABYLON.Color3(0.0, 0.0, 0.0);
    
	var driverBodyUP = BABYLON.Mesh.CreateCylinder("driverBodyUP", 5.0, 3.5, 3.0, 6, 1, scene, false);
	driverBodyUP.parent = driverHelmet;
	driverBodyUP.position = new BABYLON.Vector3( 0.0, -1.5, -0.8);
	driverBodyUP.rotation = new BABYLON.Vector3(0.0, Math.PI/2, 0.0);
	driverBodyUP.scaling = new BABYLON.Vector3(0.7, 0.2, 1.2);	
	driverBodyUP.rotate(BABYLON.Axis.Z, Math.PI / 6, BABYLON.Space.LOCAL);
	driverBodyUP.material = new BABYLON.StandardMaterial("mat_driverBodyUP", scene);
    driverBodyUP.material.diffuseColor = new BABYLON.Color3( 0.0, 1.0, 1.0);
    driverBodyUP.material.diffuseTexture = new BABYLON.Texture("./textures/driverJacketUP.jpg", scene);
    driverBodyUP.material.bumpTexture = new BABYLON.Texture("./textures/bumpTextures/bump_driverJktUP.png", scene);
    
	var driverBodyDOWN = BABYLON.Mesh.CreateCylinder("driverBodyDOWN", 5.0, 1.5, 3.0, 6, 1, scene, false);
	driverBodyDOWN.parent = driverBodyUP;
	driverBodyDOWN.position = new BABYLON.Vector3( 0.0, -7.5, 0.0);
	driverBodyDOWN.rotation = new BABYLON.Vector3(Math.PI, 0.0, 0.0);
	driverBodyDOWN.scaling = new BABYLON.Vector3(1.0, 2.0, 1.0);	
	driverBodyDOWN.material = new BABYLON.StandardMaterial("mat_driverBodyDOWN", scene);
    driverBodyDOWN.material.diffuseColor = new BABYLON.Color3( 0.0, 1.0, 1.0);
    driverBodyDOWN.material.diffuseTexture = new BABYLON.Texture("./textures/driverJacketDOWN.jpg", scene);
    driverBodyDOWN.material.bumpTexture = new BABYLON.Texture("./textures/bumpTextures/bump_driverJktDOWN.png", scene);
    
	var driverUpperThighSX = BABYLON.Mesh.CreateCylinder("driverUpperThighSX", 5.0, 2.0, 1.65, 5, 1, scene, false);
	driverUpperThighSX.parent = driverBodyDOWN;
	driverUpperThighSX.position = new BABYLON.Vector3( -2.4, 1.5, 0.52);
	driverUpperThighSX.rotation = new BABYLON.Vector3(Math.PI, 0.0, 0.0);
	driverUpperThighSX.scaling = new BABYLON.Vector3(1.0, 0.6, 0.5);	
	driverUpperThighSX.rotate(BABYLON.Axis.Z, -2.0, BABYLON.Space.LOCAL);
	driverUpperThighSX.rotate(BABYLON.Axis.X, 0.2, BABYLON.Space.LOCAL);
	driverUpperThighSX.material = new BABYLON.StandardMaterial("mat_driverUpperThighSX", scene);
    driverUpperThighSX.material.diffuseColor = new BABYLON.Color3( 0.0, 1.0, 1.0);
    driverUpperThighSX.material.diffuseTexture = new BABYLON.Texture("./textures/military_2.jpg", scene);
    
	var driverLowerThighSX = BABYLON.Mesh.CreateCylinder("driverLowerThighSX", 5.0, 1.5, 1.4, 5, 1, scene, false);
	driverLowerThighSX.parent = driverUpperThighSX;
	driverLowerThighSX.position = new BABYLON.Vector3( 1.7, -3.2, 0.0);
	driverLowerThighSX.rotation = new BABYLON.Vector3(0.0, 0.0, Math.PI/3);
	driverLowerThighSX.scaling = new BABYLON.Vector3(1.0, 0.9, 1.0);	
	driverLowerThighSX.material = new BABYLON.StandardMaterial("mat_driverLowerThighSX", scene);
    driverLowerThighSX.material.diffuseColor = new BABYLON.Color3( 0.97, 0.62, 0.45);
    
	var driverUpperThighDX = BABYLON.Mesh.CreateCylinder("driverUpperThighDX", 5.0, 2.0, 1.65, 5, 1, scene, false);
	driverUpperThighDX.parent = driverBodyDOWN;
	driverUpperThighDX.position = new BABYLON.Vector3( -2.4, 1.5, -0.52);
	driverUpperThighDX.rotation = new BABYLON.Vector3(Math.PI, 0.0, 0.0);
	driverUpperThighDX.scaling = new BABYLON.Vector3(1.0, 0.6, 0.5);	
	driverUpperThighDX.rotate(BABYLON.Axis.Z, -2.0, BABYLON.Space.LOCAL);
	driverUpperThighDX.rotate(BABYLON.Axis.X, -0.2, BABYLON.Space.LOCAL);
	driverUpperThighDX.material = new BABYLON.StandardMaterial("mat_driverUpperThighDX", scene);
    driverUpperThighDX.material.diffuseColor = new BABYLON.Color3( 0.0, 1.0, 1.0);
    driverUpperThighDX.material.diffuseTexture = new BABYLON.Texture("./textures/military_2.jpg", scene);
    
	var driverLowerThighDX = BABYLON.Mesh.CreateCylinder("driverLowerThighDX", 5.0, 1.5, 1.4, 5, 1, scene, false);
	driverLowerThighDX.parent = driverUpperThighDX;
	driverLowerThighDX.position = new BABYLON.Vector3( 1.7, -3.2, 0.0);
	driverLowerThighDX.rotation = new BABYLON.Vector3(0.0, 0.0, Math.PI/3);
	driverLowerThighDX.scaling = new BABYLON.Vector3(1.0, 0.9, 1.0);
	driverLowerThighDX.material = new BABYLON.StandardMaterial("mat_driverLowerThighDX", scene);
    driverLowerThighDX.material.diffuseColor = new BABYLON.Color3( 0.97, 0.62, 0.45); 
    
	var driverAss = BABYLON.Mesh.CreateSphere("driverAss", 3, 2.5, scene);
	driverAss.parent = driverBodyDOWN;
	driverAss.position = new BABYLON.Vector3(-0.5, 2.5, 0.0);
	driverAss.rotation = new BABYLON.Vector3(0.0, 0.0, 0.0);
	driverAss.scaling = new BABYLON.Vector3( 1.2, 1.0, 0.8);
	driverAss.material = new BABYLON.StandardMaterial("mat_driverAss", scene);
    driverAss.material.diffuseColor = new BABYLON.Color3( 0.14, 0.80, 0.22); 
    driverAss.material.diffuseColor = new BABYLON.Color3( 0.0, 1.0, 1.0);
    driverAss.material.diffuseTexture = new BABYLON.Texture("./textures/military_2.jpg", scene);
    
	var driverUpperArmDX = BABYLON.Mesh.CreateBox("driverUpperArmDX", 1.0, scene);
	driverUpperArmDX.parent = driverBodyUP;
	driverUpperArmDX.position = new BABYLON.Vector3( -1.1, 1.0, 1.4);
	driverUpperArmDX.rotation = new BABYLON.Vector3( 0.0, 0.0, Math.PI/2);
	driverUpperArmDX.scaling = new BABYLON.Vector3(2.0, 4.0, 0.5);	
	driverUpperArmDX.rotate(BABYLON.Axis.X, 0.2, BABYLON.Space.LOCAL);
	driverUpperArmDX.material = new BABYLON.StandardMaterial("mat_driverUpperArmDX", scene);
    driverUpperArmDX.material.diffuseColor = new BABYLON.Color3( 0.97, 0.62, 0.45); 
    
	var driverUpperArmSX = BABYLON.Mesh.CreateBox("driverUpperArmSX", 1.0, scene);
	driverUpperArmSX.parent = driverBodyUP;
	driverUpperArmSX.position = new BABYLON.Vector3( -1.1, 1.0, -1.4);
	driverUpperArmSX.rotation = new BABYLON.Vector3( 0.0, 0.0, Math.PI/2);
	driverUpperArmSX.scaling = new BABYLON.Vector3(2.0, 4.0, 0.5);
	driverUpperArmSX.rotate(BABYLON.Axis.X, -0.2, BABYLON.Space.LOCAL);	
	driverUpperArmSX.material = new BABYLON.StandardMaterial("mat_driverUpperArmSX", scene);
    driverUpperArmSX.material.diffuseColor = new BABYLON.Color3( 0.97, 0.62, 0.45); 
    
	var driverLowerArmSx = BABYLON.Mesh.CreateBox("driverLowerArmSx", 0.8, scene);
	driverLowerArmSx.parent = scooterSteering;
	driverLowerArmSx.position = new BABYLON.Vector3( 0.20, 1.8, -1.0);
	driverLowerArmSx.rotation = new BABYLON.Vector3( 0.0, 0.0, 0.0);
	driverLowerArmSx.scaling = new BABYLON.Vector3(1.0, 0.5, 2.2);
	driverLowerArmSx.material = new BABYLON.StandardMaterial("mat_driverLowerArmSx", scene);
    driverLowerArmSx.material.diffuseColor = new BABYLON.Color3( 0.97, 0.62, 0.45); 
    
	var driverLowerArmDx = BABYLON.Mesh.CreateBox("driverLowerArmDx", 0.8, scene);
	driverLowerArmDx.parent = scooterSteering;
	driverLowerArmDx.position = new BABYLON.Vector3( 0.20, -1.8, -1.0);
	driverLowerArmDx.rotation = new BABYLON.Vector3( 0.0, 0.0, 0.0);
	driverLowerArmDx.scaling = new BABYLON.Vector3(1.0, 0.5, 2.2);
    driverLowerArmDx.material = new BABYLON.StandardMaterial("mat_driverLowerArmDx", scene);
    driverLowerArmDx.material.diffuseColor = new BABYLON.Color3( 0.97, 0.62, 0.45); 
    
    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
    particleSystem.particleTexture = new BABYLON.Texture("./textures/particles/particle2.jpg", scene);

    particleSystem.emitter = boxbase; // the starting object, the emitter
    particleSystem.minEmitBox = new BABYLON.Vector3(-4, 0, -15); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(4, 0, 5); // To...
        
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
   
    particleSystem.minSize = 1.0;
    particleSystem.maxSize = 5.0;
        
    particleSystem.minLifeTime = 0.6;
    particleSystem.maxLifeTime = 1.5;
    
    particleSystem.emitRate =  1500;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        
    particleSystem.direction1 = new BABYLON.Vector3(40.0, 2.0, -50.0);
    particleSystem.direction2 = new BABYLON.Vector3(-40.0, 2.0, -50.0);
    
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.001;
    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
    
    particleSystem.start();        
 
    var cam = scene.getCameraByID("Camera");
    
    cam.parent   = pos_Driver;
    cam.position = new BABYLON.Vector3(  0.0, 20.0, -50.0 );
    cam.rotation = new BABYLON.Vector3( 0.2, 0.0, 0.0 ); 
    
    var cam_1 = { parent:pos_Driver, position:new BABYLON.Vector3(  0.0, 20.0, -50.0 ), rotation:new BABYLON.Vector3( 0.2, 0.0, 0.0 )};
    var cam_2 = { parent:pos_Driver, position:new BABYLON.Vector3(  0.0, 9.9, -13.5 ), rotation:new BABYLON.Vector3( 0.2, 0.0, 0.0 )};
    var cam_3 = { parent:null, position:new BABYLON.Vector3( 900.0, 300.0, -900.0 ), rotation:new BABYLON.Vector3( Math.PI/8, -Math.PI/4, 0.0)};
     
    
    differentCam.push(cam_1);
    differentCam.push(cam_2);
    differentCam.push(cam_3);
    /*
    var audio_start = new BABYLON.Sound("audio_start", "./audio/startScooter.wav", scene, function () {
        audio_start.play();
        audio_start.stop(8);
    }, { loop: true, autoplay: false });

    var audio_1 = new BABYLON.Sound("audio_1", "./audio/idleScooter.wav", scene, function () {
        audio_1.play(10);
    }, { loop: true, autoplay: false });
    */
    
    
    //audio_1.attachToMesh(pos_Driver);
    

    var idleAnimationScooter = new BABYLON.Animation("scooterAnimation", 
                                                     "position.y", 
                                                     90,
                                                     BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                                                     BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keys = [];
   
    keys.push({
        frame: 0,
        value: 0.0
    });
 
    keys.push({
        frame: 25,
        value: -1.0
    });
 
    keys.push({
        frame: 50,
        value: 0.0
    });
    
    keys.push({
        frame: 75,
        value: 1.0
    });
    
    keys.push({
        frame: 100,
        value: 0.0
    });
  
    idleAnimationScooter.setKeys(keys);
    boxbase.animations.push(idleAnimationScooter);
    thisScene.beginAnimation(boxbase, 0, 100, true);
  
    var jumpAnimationBox = new BABYLON.Animation("jumpAnimationBox", 
                                                 "rotation.x", 
                                                 120, 
                                                 BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                                                 BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var jumpKeys = [];
   
    jumpKeys.push({
        frame: 0,
        value: 0.0
    });
 
    jumpKeys.push({
        frame: 10,
        value: Math.PI/4
    });
 
    jumpKeys.push({
        frame: 20,
        value: Math.PI/2
    });
    
    jumpKeys.push({
        frame: 80,
        value: Math.PI/2
    });
    
    jumpKeys.push({
        frame: 90,
        value: Math.PI/4
    });
    
    jumpKeys.push({
        frame: 100,
        value: 0.0
    });
     
    jumpAnimationBox.setKeys(jumpKeys);
    driverHelmet.animations.push(jumpAnimationBox);
     
    
    var jumpAnimationBox2 = new BABYLON.Animation("jumpAnimationBox", 
                                                 "rotation.y", 
                                                 120, 
                                                 BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                                                 BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var jumpKeys2 = [];
   
    jumpKeys2.push({
        frame: 0,
        value: 0.0
    });
 
    jumpKeys2.push({
        frame: 10,
        value: Math.PI/4
    });
 
    jumpKeys2.push({
        frame: 20,
        value: Math.PI/2
    });
    
    jumpKeys2.push({
        frame: 80,
        value: Math.PI/2
    });
    
    jumpKeys2.push({
        frame: 90,
        value: Math.PI/4
    });
    
    jumpKeys2.push({
        frame: 100,
        value: 0.0
    });
     
    jumpAnimationBox2.setKeys(jumpKeys2);
    driverBodyDOWN.animations.push(jumpAnimationBox2);

    
    thisScene.registerBeforeRender(function () {
        
       if(loaded)
       {
            collisionSX = false;
            collisionDX = false;

            for(i=0; ((i<collisionMeshes.length)&&(collisionSX != true)&&(collisionDX != true)); i++)
            { 
                if (sx_Driver.intersectsMesh(collisionMeshes[i], false))
                {     collisionSX = true;}
                else
                if (dx_Driver.intersectsMesh(collisionMeshes[i], false))
                {    collisionDX = true;}
            }

            if( collisionSX == true)
            {
                pos_Driver.translate(BABYLON.Axis.X, 5, BABYLON.Space.LOCAL);
                speed /= 2;
            }
            else
            if( collisionDX == true)
            {
                pos_Driver.translate(BABYLON.Axis.X, -5, BABYLON.Space.LOCAL);
                speed /= 2;
            }
            else
            {
                speed += accelleration;
                if( speed >= MAX_SPEED)
                    speed = MAX_SPEED;
                if( speed < 0.3)
                    speed = 0;

                pos_Driver.translate(BABYLON.Axis.Z, speed, BABYLON.Space.LOCAL);
            }

            if( index == 0)
                cam.position.z = -50.0 - speed*4;
            else
            if( index == 2)                
                cam.setTarget(pos_Driver.position);


            if ((sx_Driver.intersectsMesh(scene.getMeshByName("planJump"), false))||(dx_Driver.intersectsMesh(scene.getMeshByName("planJump"), false)))
            {
                pos_Driver.translate(BABYLON.Axis.Y, 150.0, BABYLON.Space.LOCAL);
                pos_Driver.translate(BABYLON.Axis.Z, 100.0, BABYLON.Space.LOCAL);
                upper = MAX_UPPER;
                thisScene.beginAnimation(driverHelmet, 0, 100, true);
                thisScene.beginAnimation(driverBodyDOWN, 0, 100, true);
            }

            if ((sx_Driver.intersectsMesh(scene.getMeshByName("plane"), false))||(dx_Driver.intersectsMesh(scene.getMeshByName("planJump"), false)))
            {
                pos_Driver.translate(BABYLON.Axis.Y, 5.0, BABYLON.Space.LOCAL);
                upper += 0.05;

            }
            else
            if( pos_Driver.position.y > (-7.0))
                    pos_Driver.translate(BABYLON.Axis.Y, -5, BABYLON.Space.LOCAL);
            else
                    pos_Driver.position.y = -7.0;    


            incline += steering;

            if(( previous > 0.0) && (incline <= 0.0))
                steering = 0.0;
            else
            if(( previous < 0.0) && (incline >= 0.0))
                steering = 0.0;    

            if( incline > MAX_INCLINE)
                incline = MAX_INCLINE;
            else
            if( incline < -MAX_INCLINE)
                incline = -MAX_INCLINE;

            previous = incline;
           
            direction = pos_Driver.rotation.y;
            direction += move;

            upper += extra;
            if( upper >= MAX_UPPER)
                upper = MAX_UPPER;
            if( upper < 0.03)
                upper = 0;

            pos_Driver.rotation = new BABYLON.Vector3( 0.0, direction, 0.0);
            boxbase.rotation = new BABYLON.Vector3( -upper, 0.0, -incline);   
       }
    });
    
    
}

function steeringScooter(rot, str)
{
     steering = str;
     move = rot;
}

function moveScooter(gas,up)
{
    accelleration = gas;
    extra = up;
}

function changeCam()
{
    index++;
    index = index%3;
    MAIN_SCENE.getCameraByID("Camera").parent   = differentCam[index].parent;
    MAIN_SCENE.getCameraByID("Camera").position = differentCam[index].position;
    MAIN_SCENE.getCameraByID("Camera").rotation = differentCam[index].rotation; 
}

