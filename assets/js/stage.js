var stagedata = {
    "main": {
        "load": (scene) => {
            {
                const model = loader.get("main");
                let textureAlpha = loader.get("main-Alpha");
                model.children.forEach(function(mesh) {
                    mesh.material.map.anisotropy = config.quality.anisotropy;
                    mesh.material.alphaMap = textureAlpha;
                    mesh.material.transparent = true;
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
    },
    "sun": {
        "load": (scene) => {
            canvas.sun = new THREE.DirectionalLight(0xffffff, 1);
            scene.add(canvas.sun);
            canvas.sun.castShadow = true;
            canvas.sun.shadow.mapSize.width = 2048 * config.quality.shadow;
            canvas.sun.shadow.mapSize.height = 2048 * config.quality.shadow;
            canvas.sun.shadow.camera.top = 7000;
            canvas.sun.shadow.camera.bottom = -7000;
            canvas.sun.shadow.camera.left = 7000;
            canvas.sun.shadow.camera.right = -7000;
            canvas.sun.shadow.camera.near = 1000;
            canvas.sun.shadow.camera.far = 30000;
            canvas.sun.shadow.bias = -0.005;
            canvas.sun.position.set(0, -15000, 5000);
            scene.add(canvas.sun);
            canvas.sunTarget = new THREE.Mesh(new THREE.BoxGeometry(0, 0, 0), new THREE.MeshStandardMaterial());
            canvas.sunTarget.position.set(0, -4500, 0);
            scene.add(canvas.sunTarget);
            canvas.sun.target = canvas.sunTarget;
            const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.05);
            scene.add(ambientLight);

            if (config.debug) {
                const helper = new THREE.CameraHelper(canvas.sun.shadow.camera);
                scene.add(helper);
            }

            canvas.sun.rotation.set(0, 0, 1.75);
            canvas.sun.position.set(12000, 0, 5000);
            /*
            [...Array(7000)].map((_, i) => {
                canvas.sun.translateOnAxis(new THREE.Vector3(1, 0, 0), 12.5 * 0.01 / 0.04);
                canvas.sun.rotation.z += 0.001 * 0.01 / 0.04;
                console.log(canvas.sun.rotation);
                console.log(canvas.sun.position);
            })
            */

            scene.requestAnimationFrame = function(delay) {
                let sun = this.children[0];
                let speed;
                if (sun.position.y > 4000)
                    speed = delay / 0.16;
                else if (sun.position.y > 2000)
                    speed = delay / ((sun.position.y - 2000) / 2000 * 0.12 + 0.04);
                else
                    speed = delay / 0.04;

                sun.translateOnAxis(new THREE.Vector3(1, 0, 0), 12.5 * speed);
                sun.rotation.z += 0.001 * speed;

                sun.intensity = sun.position.y / 2000;
                if (sun.intensity < 0)
                    sun.intensity = 0;
                else if (sun.intensity > 1)
                    sun.intensity = 1;
            }
        }
    }
}