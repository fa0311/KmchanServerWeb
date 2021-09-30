var global; //デバッグ用


var setstage = {
    "group": {
        "main": {
            "load": (scene, event) => {
                {
                    const model = loader.clone("main");
                    console.log(model);

                    model.children.forEach(function(mesh) {
                        if (["Grass", "Chest", "Poppy", "Dandelion"].includes(mesh.name))
                            mesh.visible = false;
                        else if (mesh.isMesh) {
                            mesh.receiveShadow = true;
                            mesh.castShadow = true;
                        }
                    });
                    model.scale.set(100, 100, 100);
                    model.position.set(0, -5000, 0);
                    scene.add(model);
                }
            },
            "x": false,
            "y": false,
            "z": false,
        }
    }
}