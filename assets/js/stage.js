var global; //デバッグ用


var setstage = {
    "group": {
        "main": {
            "load": (scene, event) => {
                {
                    const model = loader.clone("main");
                    global = model;
                    model.scale.set(100, 100, 100);
                    model.position.set(0, -5000, 0);
                    scene.add(model);
                    setshadow(model);
                }
            },
            "x": false,
            "y": false,
            "z": false,
        }
    }
}

function setshadow(scene) {
    scene.traverse(function(node) {
        if (node.isMesh) {
            node.receiveShadow = true;
            node.castShadow = true;
        }
    });
}