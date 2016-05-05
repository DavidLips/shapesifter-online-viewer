<h1>Welcome to Project ShapeSifter</h1>
    <p> We're building a synthetic biology design tool for the simulation of multi-domain proteins, 
        their geometrical configuration, and other molecular magic. Feel free to play around with 
        the input form below. Stay tuned for Beta 1.0! </p>
    <form name="scene_form" id="scene_form" method="POST" action="">
        <textarea rows="30" cols="100" id="scene_data" name="scene_data">
{
    "output_directory": "runs/chimeric",
    "dt": 1,
    "last_time": 100,
    "root": [
        {"type": "DATA",
         "eta": 3.5},
        {"type": "RIGID_STRUCTURE_DATA"},
        {"type": "RIGID_STRUCTURE",
         "position": [0, 4.05, 0],
         "orientation": {
             "axis": [1,0,0],
             "angle": -90},
         "radius": 1.75,
         "collision_extent": 2.3,
         "name": "EGFRvIII"
        },
        {"type": "RIGID_STRUCTURE",
         "position": [0, 7.1, 4],
         "orientation": {
             "axis": [1,0,0],
             "angle": 90},
         "radius": 1.435,
         "collision_extent": 0.34,
         "name": "scFv"
        },
        {"type": "RIGID_STRUCTURE",
         "position": [1, 1, 1],
         "orientation": {
             "axis": [0,1,0],
             "angle": 90},
         "radius": 1.16,
         "collision_extent": 0.27,
         "name": "interferon"
        },
        {"type": "TRUST_REGION",
         "name": "evolution"},
        {"type": "BROWNIAN_FORCE",
         "temperature": 300},
        {"type": "RELATIVE_POSITION_CONSTRAINT",
         "constraints": [
             {
                 "structure1": "EGFRvIII",
                 "offset1": [0,-1.75,3.15],
                 "structure2": "scFv",
                 "offset2": [0,-1.435,0],
                 "distance": 1}]
        },
        {"type": "FLEXIBLE_LINKER",
         "structure1": "scFv",
         "offset1": [-1.015,0,1.355],
         "structure2": "interferon",
         "offset2": [0,0,1.43],
         "links": 6,
         "link_radius": 0.2,
         "link_offset": [1.2,0,0]
        },
        {"type": "VOLUME_EXCLUSION_CONSTRAINT"},
        {"type": "ABSOLUTE_POSITION_CONSTRAINT",
         "constraints": [
             {
                 "type": "linear",
                 "structure": "EGFRvIII",
                 "direction": [1,0,0],
                 "magnitude": 0
             },
             {
                 "type": "linear",
                 "structure": "EGFRvIII",
                 "direction": [0,1,0],
                 "magnitude": 4.05
             },
             {
                 "type": "linear",
                 "structure": "EGFRvIII",
                 "direction": [0,0,1],
                 "magnitude": 0
             },
             {"structure": "EGFRvIII",
              "type": "angular",
              "orientation": {
                  "angle": -90,
                  "axis": [1,0,0]}}
         ]
        },
        {"type": "ANALYTE",
         "prerequisites": ["evolution"],
         "predicate": {
             "type": "orientation_quality",
             "binder_name": "interferon",
             "occluder_name": "EGFRvIII",
             "distance_limit": 1,
             "around_bond_angle_limit": 0.785,
             "out_of_bond_angle_limit": 0.785,
             "target_bond_orientation": [0,-1,0],
             "binder_bond_vector": [0,-1.16,0],
             "target_height": 3.65,
             "receptor_radius": 1.8
         },
         "aggregator": {"type": "average"}
        }
    ]
}
        </textarea><br/>
        <input type="button" id="submit_button" name="submit_button" value="Submit">
        <input type="button" id="preview_button" name="preview_button" value="Preview">
    </form>

    <br/>
        <hr style="background-color: rgb(150,150,150); color: rgb(150,150,150); width: 100%; height: 4px;">
    <br/>

    <p>Viewer:</p>

    <div id="view_container" width="100%" height="100%">
        <canvas id="protein_viewer" style="width:100%;height:80%;display: block;" ></canvas>
    </div>
<?php
    // if (isset($_POST)){
    //     $counter = 0;
    //     if ($_POST['submit_button'] == "Submit") {

    //         while(file_exists('scenes/scene_file-'. $counter . ".json")){
    //             $counter++;
    //             if(!file_exists('scenes/scene_file-' . $counter . ".json")){
    //                 $file = tmpfile();
    //                 break;
    //             }                
    //         }
    //         $file = fopen('scenes/scene_file-' . $counter . ".json","a+");

    //         $text = $_POST["scene_data"];

    //         file_put_contents('scenes/scene_file-' . $counter . ".json", $text);
    //         fclose($file);
            
    //         redirect("cgi-bin/Mechanics/bin/online_simulate.sh");
    //     }
    // }

?>