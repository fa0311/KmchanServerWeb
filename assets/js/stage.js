var stagedata = {
    "main": {
        "path": "assets/models/main/main",
        "load": (scene, event) => {
            {
                const model = loader.clone("main");
                model.children.forEach(function(mesh) {
                    // mesh.material.side = THREE.DoubleSide;
                    console.log(mesh);

                    if (["Stationary_Water"].includes(mesh.name)) {
                        mesh.material.transparent = true;
                        mesh.material.opacity = 0.5;
                    }

                    if (["Campfire"].includes(mesh.name))
                        mesh.material.emissive = {
                            r: 0,
                            g: 0,
                            b: 0
                        };
                    else if (mesh.material.emissive.r != 0)
                        light(mesh.material);
                    else if (["Grass", "Chest", "Poppy", "Dandelion"].includes(mesh.name))
                        mesh.visible = false;

                    if (mesh.isMesh) {
                        mesh.receiveShadow = true;
                        mesh.castShadow = true;
                    }
                });
                model.scale.set(100, 100, 100);
                model.position.set(0, -5000, 0);
                scene.add(model);
            }
        }
    }
}

function light(material) {
    material.shininess = 300000;
}