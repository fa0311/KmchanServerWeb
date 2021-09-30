class mainClass {
    constructor() {
        /* 定義 */
        this.canvas = document.querySelector("#canvas");
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.shadowMap.enabled = true;

        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,
            0,
            1,
            12000
        );

        new EventListener(this.canvas, this.renderer, this.camera);
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
        this.camera.y_speed = 0;
        this.camera.position.set(0, 0, 0);

        this.target = new THREE.Group();
        this.scene.add(this.target);
        this.bullet = new THREE.Group();
        this.scene.add(this.bullet);
        this.eventobj = new THREE.Group();
        this.scene.add(this.eventobj);
        this.group = {};
        Object.keys(setstage.group).forEach(name => {
            this.group[name] = new THREE.Group();
            setstage.group[name].load(this.group[name]);
            this.scene.add(this.group[name]);
        });


        this.sun = new THREE.DirectionalLight(0xffffff, 1);
        this.scene.add(this.sun);
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
        // this.sun.position.set(0, -15000, 0);
        this.sun.position.set(10408, 4430, 5000);
        this.sun.rotation.z = 5;

        this.scene.add(this.sun);

        this.sun_target = new THREE.Mesh(new THREE.BoxGeometry(0, 0, 0), new THREE.MeshStandardMaterial());
        this.sun_target.position.set(0, -4500, 0);
        this.scene.add(this.sun_target);
        this.sun.target = this.sun_target;


        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.05);
        this.scene.add(ambientLight);

        if (config.debug) {

            const helper = new THREE.CameraHelper(this.sun.shadow.camera);
            this.scene.add(helper);


            const helper_ = new THREE.DirectionalLightHelper(this.sun);
            this.scene.add(helper_);
        }

        setTimeout(render, 0);
    }
    view() {

        this.sun.position.z = 0;
        this.sun.translateOnAxis(new THREE.Vector3(1, 0, 0), 12.5 / config.quality.fps * 60);
        this.sun.position.z = 5000;
        this.sun.rotation.z += 0.001 / config.quality.fps * 60;
        if (this.sun.position.y < -2000)
            this.sun.intensity = 1 + (this.sun.position.y + 2000) / 4000;
        if (this.sun.intensity < 0)
            this.sun.intensity = 0;


        let player_move = playerdata.move(this);
        this.camera.quaternion.setFromEuler(player_move.euler);
        this.camera.position.x = player_move.position.x;
        this.camera.position.y = player_move.position.y;
        this.camera.position.z = player_move.position.z;

        this.renderer.render(this.scene, this.camera);
    }
}

class player {
    constructor() {
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
        this.animation = new _animation();

        this.position = {
            x: -3000,
            y: -3500,
            z: 0
        };
        this.euler = new THREE.Euler(0.4, 3.14 / 4, 0, 'YXZ');

        this.animation.add((i) => {
            this.position.x += i;
            return this.position.x;
        }, 3000, 1000);
        this.animation.add((i) => {
            this.euler.y += i;
            return this.euler.y;
        }, -3.14 / 4, 1000);

    }
    move(main) {
        this.animation.renderer();
        return {
            position: this.position,
            euler: this.euler
        };
    }
}
let playerdata = new player();


function render() {
    if (config.stats) {
        main.stats.begin();
    }
    setTimeout(render, 1000 / config.quality.fps);
    main.view();
    if (config.stats) {
        main.stats.end();
    }
}