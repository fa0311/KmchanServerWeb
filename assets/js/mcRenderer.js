class mcRenderer {
    constructor(canvas, setstage) {
        /* 引数受け取り */
        this._canvas = canvas;
        /* シーン */
        this._scene = new THREE.Scene();
        /* カメラ */
        this.camera = new THREE.PerspectiveCamera(
            45,
            this._canvas.offsetWidth / this._canvas.offsetHeight,
            1,
            12000
        );
        /* レンダラー */
        this.renderer = new THREE.WebGLRenderer({
            canvas: this._canvas,
            antialias: config.quality.antialias === "MSAA",
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        /* ポストプロセス */
        this.composer = new THREE.EffectComposer(this.renderer);
        const renderPass = new THREE.RenderPass(this._scene, this.camera);
        this.composer.addPass(renderPass);
        /* アンチエイリアス */
        if (config.quality.antialias === "FXAA")
            this.antialiasPass = new THREE.ShaderPass(THREE.FXAAShader);
        /*
        else if (config.quality.antialias === "SMAA")
            this.antialiasPass = new THREE.ShaderPass(THREE.SMAABlendShader); // SMAABlendShader SMAAEdgesShader SMAAWeightsShader
        else if (config.quality.antialias === "SSAA")
            this.antialiasPass = new THREE.ShaderPass(THREE.SSAARenderPass);
        */
        if (["FXAA"].includes(config.quality.antialias))
            this.composer.addPass(this.antialiasPass);
        /* アンビエントオクルージョン */
        if (config.quality.ambientocclusion === "SSAO") {
            this.ambientocclusionPass = new THREE.ShaderPass(THREE.SSAOPass);
            this.ambientocclusionPass.kernelRadius = 16;
        }
        if (["SSAO"].includes(config.quality.antialias))
            this.composer.addPass(this.ambientocclusionPass);
        /* 出力 */
        const copyPass = new THREE.ShaderPass(THREE.CopyShader);
        this.composer.addPass(copyPass);


        /* イベントリスナー */
        new EventListener(this._canvas, this.renderer, this.camera);
        this.EventListener();

        /* アニメーション */
        this.animation = new _animation();
        this.requestAnimationFrame = () => {}


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
        this._clock = new THREE.Clock();
        this._clock.getDelta();
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
        }
    }
    view() {
        this.sun.translateOnAxis(new THREE.Vector3(1, 0, 0), 12.5 * this._delay / 0.16);
        this.sun.rotation.z += 0.001 * this._delay / 0.16;

        this.sun.intensity = (this.sun.position.y + 4000) / 4000;
        if (this.sun.intensity < 0)
            this.sun.intensity = 0;
        else if (this.sun.intensity > 1)
            this.sun.intensity = 1;
        this.requestAnimationFrame();
        this.animation.renderer(this._delay);
        /*
        this.renderer.render(this._scene, this.camera);
        */
        this.composer.render();
    }
    mcRendererParent() {
        if (config.stats)
            this.stats.begin();
        this._delay = this._clock.getDelta();
        setTimeout(() => this.mcRendererParent(), 1000 / config.quality.fps);
        this.view();
        if (config.stats)
            this.stats.end();
    }
    EventListener() {
        this.resizefunc();
        window.addEventListener('resize', () => this.resizefunc());
    }
    resizefunc() {
        this.composer.setSize(this._canvas.offsetWidth, this._canvas.offsetHeight);
        if (["FXAA"].includes(config.quality.antialias)) {
            this.antialiasPass.material.uniforms.resolution.value.x = 1 / (this._canvas.offsetWidth * this.renderer.getPixelRatio());
            this.antialiasPass.material.uniforms.resolution.value.y = 1 / (this._canvas.offsetHeight * this.renderer.getPixelRatio());
        }
    }
}

class _animation {
    constructor() {
        this.animations = [];
    }
    add(data, to, sec) {
        this.animations.push({
            data: data,
            amount: (to - data(0)),
            movement: sec,
            remain: sec,
        });
    }
    reset() {
        this.animations = [];
    }
    renderer(delay) {
        this.animations = this.animations.filter((animation) => {
            animation.data(animation.amount / animation.movement * delay);
            animation.remain -= delay;
            return animation.remain > 0;
        });
    }
}