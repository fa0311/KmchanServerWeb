var loader, main;
window.addEventListener("DOMContentLoaded",
    function() {
        loader = new loaderClass(function() {
            main = new mainClass();
        });
    });
class loaderClass {
    constructor(loadedfn) {
        let modelpath = {
            "main": "assets/models/main/main",
        };
        this.loaded = 0;
        this.len = Object.keys(modelpath).length;
        this.loadedfn = loadedfn;
        this.models = {};
        Object.keys(modelpath).forEach(name => {


            new THREE.MTLLoader().load(modelpath[name] + ".mtl", materials => {
                materials.preload();
                new THREE.OBJLoader()
                    .setMaterials(materials)
                    .load(modelpath[name] + ".obj", model => {
                            let texture = new THREE.TextureLoader().load(modelpath[name] + "-RGBA.png");
                            let textureAlpha = new THREE.TextureLoader().load(modelpath[name] + "-Alpha.png");
                            model.traverse(function(child) {
                                if (child instanceof THREE.Mesh) {
                                    child.material.map = texture;
                                    child.material.alphaMap = textureAlpha;
                                    child.material.transparent = true;
                                }
                            });
                            this.models[name] = model;
                            this.check();
                        },
                        xhr => {
                            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                        },
                        err => {
                            console.log('An error happened');
                            console.log(err);
                        }
                    );
            });

            /*
                        const loader = new THREE.OBJLoader();
                        loader.load(modelpath[name], model => {
                                this.models[name] = model;
                                this.check();
                            },
                            xhr => {
                                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                            },
                            err => {
                                console.log('An error happened');
                            }
                        );
            */

        });
    }
    check() {
        this.loaded++;
        if (this.loaded == this.len)
            this.loadedfn();
    }
    sceneClone(name) {
        let clone = this.models[name].scene.clone();
        clone.name = name;
        return clone;
    }
    clone(name) {
        let clone = this.models[name].clone();
        clone.name = name;
        return clone;
    }
}