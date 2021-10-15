class loaderClass {
    constructor(models, loadedfn) {
        console.log(models);
        this.models = models;
        this.loadedfn = loadedfn;
        this.len = Object.keys(this.models).length;
        Object.keys(this.models).forEach(key => {
            let data = this.models[key];
            if (data.type == "mtl")
                new THREE.MTLLoader()
                .load(data.path,
                    model => this.loaded(data, model),
                    xhr => this.loading(data, xhr),
                    err => this.error(data, err)
                );
            else if (data.type == "obj")
                new THREE.OBJLoader()
                .load(data.path,
                    model => this.loaded(data, model),
                    xhr => this.loading(data, xhr),
                    err => this.error(data, err)
                );
            else if (data.type == "mcloder")
                new THREE.MTLLoader().load(data.path + ".mtl", materials => {
                    materials.preload();
                    new THREE.OBJLoader()
                        .setMaterials(materials)
                        .load(data.path + ".obj",
                            model => this.loaded(data, model),
                            xhr => this.loading(data, xhr),
                            err => this.error(data, err)
                        );
                })
            else if (data.type == "texture")
                new THREE.TextureLoader()
                .load(data.path,
                    model => this.loaded(data, model),
                    xhr => this.loading(data, xhr),
                    err => this.error(data, err)
                );
        });
    }
    loaded(data, model) {
        data.model = model;
        this.check();
    }
    loading(data, xhr) {
        data.loaded = xhr.loaded;
        data.total = xhr.total;
        this.view();
    }
    view() {
        let loaded = 0;
        let total = 0;
        Object.keys(this.models).forEach(key => {
            let data = this.models[key];
            loaded += data.loaded == undefined ? 0 : data.loaded;
            total += data.total == undefined ? 0 : data.total;
        });
        document.querySelector("#loading-percent").textContent = Math.floor(loaded / total * 100) + "%";
    }
    error(data, err) {
        document.querySelector("#loading-percent").textContent = "エラーが発生しました";
        console.error(err);
    }
    check() {
        this.len--;
        console.log(this.len);
        if (this.len <= 0) {
            document.querySelector("#loading").innerHTML = ""
            try {
                this.loadedfn();
            } catch (err) {
                console.error(err);
            }
        }
    }
    get(name) {
        return this.models[name].model;
    }
}