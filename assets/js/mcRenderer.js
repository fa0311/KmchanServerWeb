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
        this.animationRotation = new _animationRotation();
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

    }
    view() {
        Object.keys(this._group).forEach((key) => {
            if (typeof(this._group[key].requestAnimationFrame) == "function") this._group[key].requestAnimationFrame(this._delay)
        });
        this.requestAnimationFrame();
        this.animation.renderer(this._delay);
        this.animationRotation.renderer(this._delay);
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
            amount: to - data(0),
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

class _animationRotation {
    constructor() {
        this.animations = [];
    }
    add(data, to, sec) {
        let _euler = new THREE.Euler(0, 0, 0, 'YXZ');
        _euler.setFromQuaternion(data);

        this.animations.push({
            data: data,
            amountX: to.x - _euler.x,
            amountY: to.y - _euler.y,
            amountZ: to.z - _euler.z,
            movement: sec,
            remain: sec,
            a: 0,
        });
    }
    reset() {
        this.animations = [];
    }
    renderer(delay) {
        this.animations = this.animations.filter((animation) => {
            let _euler = new THREE.Euler(0, 0, 0, 'YXZ');
            _euler.setFromQuaternion(animation.data);
            _euler.x += animation.amountX / animation.movement * delay;
            _euler.y += animation.amountY / animation.movement * delay;
            animation.data.setFromEuler(_euler);
            animation.remain -= delay;
            return animation.remain > 0;
        });
    }
}