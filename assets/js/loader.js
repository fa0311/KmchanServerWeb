class loaderClass {
    constructor(modelpath, loadedfn) {
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
                            texture.anisotropy = config.quality.anisotropy;
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
                            document.querySelector("#loading-percent").textContent = Math.floor(xhr.loaded / xhr.total * 100) + "%";
                        },
                        err => {
                            document.querySelector("#loading-percent").textContent = "エラーが発生しました";
                            console.log(err);
                        }
                    );
            });
        });
    }
    check() {
        this.loaded++;
        if (this.loaded == this.len) {
            document.querySelector("#loading").innerHTML = ""
            try {
                this.loadedfn();
            } catch (err) {
                console.error(err);
            }
        }
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