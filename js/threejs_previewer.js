var initScene;


function createColor(i){

	var palette = ['rgb(51,204,255)', 'rgb(51,102,255)', 'rgb(51,255,204)', 'rgb(51,255,205)', 'rgb(0,138,184)'];

	var canvas = document.createElement( 'canvas' );
	canvas.width = 256;
	canvas.height = 256;

	var context = canvas.getContext( '2d' );
	//context.fillStyle = 'rgb(' + Math.floor( i*7 * 256 % 256) + ',' + Math.floor( i*7 * 256 %256 ) + ',' + Math.floor( i*5 * 256 %256) + ')'
	context.fillStyle = palette[i%5]
	context.fillRect( 0, 0, 256, 256 );

	return canvas;

}

function createStructures(callback, scene_data) {

	// object that holds all structures
	var structures = new THREE.Object3D();
	var linkers = new THREE.Object3D();

	for (var i = 0; i < scene_data.root.length; i++){

		if (scene_data.root[i].type == "RIGID_STRUCTURE"){

 			// extract radius and collision extent
			var radius = scene_data.root[i].radius;	
			var collision_extent = scene_data.root[i].capsule_extent;

			// capsules
			if (collision_extent > 0){

				// container object for capsule elements
				var merged = new THREE.Geometry();

				//texture test
				var texture = new THREE.CanvasTexture( createColor(i) );
				var proteinMaterial = new THREE.MeshBasicMaterial( { map: texture, wireframe: true } );
			
				// define cylinder and two spheres to create a capsule
				var cylinder = new THREE.CylinderGeometry(radius, radius,collision_extent*2, 24);
				var top = new THREE.SphereGeometry(radius,17,17);
				var bottom = new THREE.SphereGeometry(radius,17,17);

				var matrix = new THREE.Matrix4();
				matrix.makeRotationX(Math.PI/2);
            	cylinder.applyMatrix(matrix);


				// set position of bottom and top spheres
				var m1 = new THREE.Matrix4();
				m1.makeTranslation(0,0,collision_extent);
				top.applyMatrix(m1);

				var m2 = new THREE.Matrix4();
				m2.makeTranslation(0,0,-collision_extent);
				bottom.applyMatrix(m2);

				// add spheres and cylinder to merged object
				merged.merge(cylinder);
				merged.merge(bottom);
				merged.merge(top);

				// set proper orientation
				if(scene_data.root[i].orientation){

					var m3 = new THREE.Matrix4();
					radians = scene_data.root[i].orientation.angle * Math.PI / 180;

					if (scene_data.root[i].orientation.axis[0] == 1){
						m3.makeRotationX(radians);
					}
					if (scene_data.root[i].orientation.axis[1] == 1){
						m3.makeRotationY(radians);
					}
					if (scene_data.root[i].orientation.axis[2] == 1){
						m3.makeRotationZ(radians);
					}
					merged.applyMatrix(m3);
				}

				// create capsule
				var protein = new THREE.Mesh(merged, proteinMaterial);

				protein.position.x = scene_data.root[i].position[0]
				protein.position.y = scene_data.root[i].position[1]
				protein.position.z = scene_data.root[i].position[2]

				protein.name = scene_data.root[i].name

				structures.add(protein);
			}
			// spheres
			else{
				
				var linkerMaterial = new THREE.MeshBasicMaterial( {color: 0xCCFF33, wireframe: true});
				var linkerChainGeometry = new THREE.SphereGeometry(radius, 32, 32);
				var linkerChain = new THREE.Mesh(linkerChainGeometry, linkerMaterial);

				linkerChain.position.x = scene_data.root[i].position[0]
				linkerChain.position.y = scene_data.root[i].position[1]
				linkerChain.position.z = scene_data.root[i].position[2]

				linkerChain.name = scene_data.root[i].name;

				structures.add(linkerChain);
			}	
		}
	}
	callback(structures);	
}

function createForces(callback, scene_data, structures){

	var forces = new THREE.Object3D();

	if(forces.children.length >= 0){
	
		var material = new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 1});

		// search for relative position constraints
		for (var i = 0; i < scene_data.root.length; i++){

			if (scene_data.root[i].type == "RELATIVE_POSITION_CONSTRAINT"){

				// loop over all constraints
				for (var j=0; j < scene_data.root[i].constraints.length; j++){

					// retrieve structures and offsets
					s1 = scene_data.root[i].constraints[j].structure1;
					s2 = scene_data.root[i].constraints[j].structure2;
					n1 = new THREE.Vector3(scene_data.root[i].constraints[j].offset1[0], scene_data.root[i].constraints[j].offset1[1], scene_data.root[i].constraints[j].offset1[2]);
					n2 = new THREE.Vector3(scene_data.root[i].constraints[j].offset2[0], scene_data.root[i].constraints[j].offset2[1], scene_data.root[i].constraints[j].offset2[2]);

					first_attachment = new THREE.Vector3();
					first_attachment.addVectors(structures.getObjectByName(s1).position, n1);				
					

					second_attachment = new THREE.Vector3();
					second_attachment.addVectors(structures.getObjectByName(s2).position, n2);

					var lineGeometry = new THREE.Geometry();
					lineGeometry.vertices.push(first_attachment, second_attachment);

					var line = new THREE.Line(lineGeometry, material);
					line.name = [s1,s2,n1,n2];
					forces.add(line);
				}
			}
		}
		callback(forces);
	}
}

var scene;
var initialize_previewer = function() {
	// set the scene size
	var WIDTH = window.innerWidth/1.74,
	  	HEIGHT = 500;

	 console.log(WIDTH)

	// set some camera attributes
	var VIEW_ANGLE = 45,
	  	ASPECT = WIDTH / HEIGHT,
	  	NEAR = 0.1,
	  	FAR = 10000;

	// create a WebGL renderer, camera, and a scene
	canvas = document.getElementById("protein_viewer");
	renderer = new THREE.WebGLRenderer({ canvas: canvas });

	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, WIDTH / HEIGHT, NEAR, FAR );
	scene = new THREE.Scene();
	controls = new THREE.OrbitControls(camera, renderer.domElement);

	// add the camera to the scene
	scene.add(camera);
	camera.position.z = 50;

	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);
	// document.body.append( renderer.domElement );

	// create a point light
	var pointLight = new THREE.PointLight(0xFFFFFF);

	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;

	scene.add(pointLight);

	function render() {
		requestAnimationFrame(render);
		renderer.render(scene, camera);
		controls.update()
	};
	render();
}

scene_initialized=false;
var structures=new THREE.Object3D();
var linkers=new THREE.Object3D();
var forces=new THREE.Object3D();



var preview = function(json_scene) {

    if(!scene_initialized){
        initialize_previewer();
        scene_initialized=true;
    }

    scene.remove(structures);
    scene.remove(linkers);
    scene.remove(forces);

	// create structures 
	createStructures(function (allStructures){
		structures = allStructures;
	}, json_scene);


	// create force lines
	createForces(function (force_lines){
		forces = force_lines;
	}, json_scene, structures);

	// add the structures and forces
	scene.add(structures);
	scene.add(forces);
};

window.onload = initScene;

$(function() {

	// expand and preview default scene 
	var expanded_scene = expandScene($("#scene_data").val());
	preview(expanded_scene);

	// expand preview scene when input changes in textarea
	$("#scene_data").on("keyup", function(){
		try{
			expanded_scene = expandScene($("#scene_data").val());
			preview(expanded_scene);
		} catch(err){
		}
	});
});






		

