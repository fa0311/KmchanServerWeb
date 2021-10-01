class mcRenderer {
    constructor(canvas, setstage) {
        /* 定義 */
        this.animation = new _animation();
        this._canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({
            canvas: this._canvas,
            antialias: true
        });
        this.renderer.shadowMap.enabled = true;
        this._scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,
            0,
            1,
            12000
        );

        new EventListener(this._canvas, this.renderer, this.camera);

        if (config.stats) {
            this.stats = new Stats();
            this.stats.showPanel(0);
            Object.assign(this.stats.dom.style, {
                'position': 'fixed',
                'height': 'max-content',
                'left': 0,
                'right': 'auto',
                'top': 0,
                'bottom': 'auto'
            });
            document.body.appendChild(this.stats.dom);
        }

        this.camera.position.set(0, 0, 0);

        this._group = {};
        Object.keys(setstage).forEach(name => {
            this._group[name] = new THREE.Group();
            setstage[name].load(this._group[name]);
            this._scene.add(this._group[name]);
        });

        this.sun = new THREE.DirectionalLight(0xffffff, 1);
        this._scene.add(this.sun);
        this.sun.castShadow = true;
        this.sun.shadow.mapSize.width = 2048 * config.quality.shadow;
        this.sun.shadow.mapSize.height = 2048 * config.quality.shadow;
        this.sun.shadow.camera.top = 7000;
        this.sun.shadow.camera.bottom = -7000;
        this.sun.shadow.camera.left = 7000;
        this.sun.shadow.camera.right = -7000;
        this.sun.shadow.camera.near = 1000;
        this.sun.shadow.camera.far = 30000;
        this.sun.shadow.bias = -0.005;
        this.sun.position.set(0, -15000, 0);
        this._scene.add(this.sun);
        this.sunTarget = new THREE.Mesh(new THREE.BoxGeometry(0, 0, 0), new THREE.MeshStandardMaterial());
        this.sunTarget.position.set(0, -4500, 0);
        this._scene.add(this.sunTarget);
        this.sun.target = this.sunTarget;
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.05);
        this._scene.add(ambientLight);

        if (config.debug) {
            const helper = new THREE.CameraHelper(this.sun.shadow.camera);
            this._scene.add(helper);
            const helper_ = new THREE.DirectionalLightHelper(this.sun);
            this._scene.add(helper_);
        }
    }
    view() {

        this.sun.translateOnAxis(new THREE.Vector3(1, 0, 0), 12.5 / config.quality.fps * 60);
        this.sun.rotation.z += 0.001 / config.quality.fps * 60;

        this.sun.intensity = (this.sun.position.y + 4000) / 4000;
        if (this.sun.intensity < 0)
            this.sun.intensity = 0;
        if (this.sun.intensity > 1)
            this.sun.intensity = 1;

        this.animation.renderer();

        this.renderer.render(this._scene, this.camera);
    }
    mcRendererParent() {
        if (config.stats) {
            this.stats.begin();
        }
        setTimeout(() => {
            this.mcRendererParent()
        }, 1000 / config.quality.fps);
        this.view();
        if (config.stats) {
            this.stats.end();
        }
    }
}

class _animation {
    constructor() {
        this.animations = [];
    }
    add(data, to, frame) {
        this.animations.push({
            data: data,
            amount: (to - data(0)) / frame,
            remain: frame,
        });
    }
    renderer() {
        this.animations = this.animations.filter((animation) => {
            animation.data(animation.amount);
            animation.remain -= 1;
            return animation.remain > 0;
        });
    }
}