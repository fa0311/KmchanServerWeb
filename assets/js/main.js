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
            10000
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
        this.camera.position.set(0, 100, 0);

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



        this.sun = new THREE.SpotLight(0xFFFFFF, 1, 10000, Math.PI, 0, 0.1);
        this.sun.castShadow = true;
        this.sun.shadow.mapSize.width = 2048;
        this.sun.shadow.mapSize.height = 2048;
        this.sun.shadow.camera.top = 170;
        this.sun.shadow.camera.bottom = -70;
        this.sun.shadow.camera.left = -150;
        this.sun.shadow.camera.right = 150;
        this.sun.shadow.camera.near = 25;
        this.sun.shadow.camera.far = 250;
        this.sun.shadow.bias = -0.005;
        this.sun.position.x = 0;
        this.sun.position.y = 1000;
        this.sun.position.z = 0;
        this.scene.add(this.sun);
        this.sun_target = new THREE.Mesh(new THREE.BoxGeometry(0, 0, 0), new THREE.MeshStandardMaterial());
        this.scene.add(this.sun_target);
        this.sun.target = this.sun_target;



        this.light = new THREE.SpotLight(0xFFFFFF, 1, 1, Math.PI, 0, 0.1);
        this.light.shadow.mapSize.width = 2048;
        this.light.shadow.mapSize.height = 2048;
        this.light.shadow.camera.top = 170;
        this.light.shadow.camera.bottom = -70;
        this.light.shadow.camera.left = -150;
        this.light.shadow.camera.right = 150;
        this.light.shadow.camera.near = 25;
        this.light.shadow.camera.far = 250;
        this.light.shadow.bias = -0.005;
        this.scene.add(this.light);
        this.light_target = new THREE.Mesh(new THREE.BoxGeometry(0, 0, 0), new THREE.MeshStandardMaterial());
        this.scene.add(this.light_target);
        this.light.target = this.light_target;


        setTimeout(render, 1000);
    }
    view() {

        this.sun_target.translateOnAxis(new THREE.Vector3(0, 0, -1), 100);
        this.sun_target.rotation.z += 0.01;



        let player_move = playerdata.move(this);
        this.camera.quaternion.setFromEuler(player_move.euler);
        this.camera.position.x = player_move.position.x;
        this.camera.position.y = player_move.position.y;
        this.camera.position.z = player_move.position.z;

        mousedata.update();

        this.light.rotation.z = this.camera.rotation.z;
        this.light.rotation.x = this.camera.rotation.x;
        this.light.rotation.y = this.camera.rotation.y;
        this.light.position.z = this.camera.position.z;
        this.light.position.x = this.camera.position.x;
        this.light.position.y = this.camera.position.y;
        // light.translateOnAxis(new THREE.Vector3(0, -1, 0), 80);
        this.light_target.rotation.z = this.camera.rotation.z;
        this.light_target.rotation.x = this.camera.rotation.x;
        this.light_target.rotation.y = this.camera.rotation.y;
        this.light_target.position.z = this.camera.position.z;
        this.light_target.position.x = this.camera.position.x;
        this.light_target.position.y = this.camera.position.y;
        this.light_target.translateOnAxis(new THREE.Vector3(0, 0, -1), 100);


        this.eventobj.children.forEach((element) => {
            element.event(this.camera);
        });
        this.renderer.render(this.scene, this.camera);
    }
}

class player {
    constructor() {
        this.reload_time = 0;
        this.shot_time = 0;
        this.speed = 0;
        this.position = {
            x: 0,
            y: 0,
            z: 0
        };
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');;
    }
    move(main) {
        // 移動前の座標をキャッシュ
        let cache = {
            x: this.position.x,
            y: this.position.y,
            z: this.position.z,
        };
        // 方向による移動量の計算

        // _euler.setFromQuaternion(main.camera.quaternion);
        this.euler.y -= mousedata.x;
        this.euler.x = Math.max(Math.PI / 2 - Math.PI, Math.min(Math.PI / 2 - 0, this.euler.x - mousedata.y));

        // 移動速度
        if (keydata.action.sneak)
            this.speed = 6 / (config.quality.fps / 60);
        else
            this.speed = 3 / (config.quality.fps / 60);
        // 移動
        if (keydata.action.up && keydata.action.right) {
            this.position.z -= Math.cos(this.euler.y - Math.PI / 2.5) * this.speed;
            this.position.x -= Math.sin(this.euler.y - Math.PI / 2.5) * this.speed;
        } else if (keydata.action.up && keydata.action.left) {
            this.position.z += Math.cos(this.euler.y - Math.PI / 1.5) * this.speed;
            this.position.x += Math.sin(this.euler.y - Math.PI / 1.5) * this.speed;
        } else if (keydata.action.down && keydata.action.right) {
            this.position.z -= Math.cos(this.euler.y - Math.PI / 1.5) * this.speed;
            this.position.x -= Math.sin(this.euler.y - Math.PI / 1.5) * this.speed;
        } else if (keydata.action.down && keydata.action.left) {
            this.position.z += Math.cos(this.euler.y - Math.PI / 2.5) * this.speed;
            this.position.x += Math.sin(this.euler.y - Math.PI / 2.5) * this.speed;
        } else if (keydata.action.up) {
            this.position.z -= Math.cos(this.euler.y) * this.speed;
            this.position.x -= Math.sin(this.euler.y) * this.speed;
        } else if (keydata.action.down) {
            this.position.z += Math.cos(this.euler.y) * this.speed;
            this.position.x += Math.sin(this.euler.y) * this.speed;
        } else if (keydata.action.right) {
            this.position.z -= Math.cos(this.euler.y - Math.PI / 2) * this.speed;
            this.position.x -= Math.sin(this.euler.y - Math.PI / 2) * this.speed;
        } else if (keydata.action.left) {
            this.position.z += Math.cos(this.euler.y - Math.PI / 2) * this.speed;
            this.position.x += Math.sin(this.euler.y - Math.PI / 2) * this.speed;

        } else if (keydata.action.rise) {
            this.position.y += 10 * this.speed;
        } else if (keydata.action.fall) {
            this.position.y -= 10 * this.speed;
        }

        // 当たり判定 x軸
        {
            let flag = false;
            Object.keys(setstage.group).forEach(stage => {
                if (!setstage.group[stage].y) return;
                [60, 50, 40, 30, 20, 10, 0].forEach((data_y) => {
                    [10, 0, -10].forEach((data_x) => {
                        let TopOverPos = new THREE.Vector3(this.position.x + Math.abs(data_x), this.position.y + data_y, this.position.z + data_x);
                        let downVect = new THREE.Vector3(-1, 0, 0);
                        let ray = new THREE.Raycaster(TopOverPos, downVect.normalize());
                        let objs = ray.intersectObjects(main.group[stage].children, true);
                        objs.forEach((element) => {
                            if (this.position.x < element.point.x + Math.abs(data_x))
                                flag = true;
                        });
                    });
                });
            });
            if (flag)
                this.position.x = cache.x;
        }

        // 当たり判定 z軸
        {
            let flag = false;
            Object.keys(setstage.group).forEach(stage => {
                if (!setstage.group[stage].z) return;
                [60, 50, 40, 30, 20, 10, 0].forEach((data_y) => {
                    [10, 0, -10].forEach((data_x) => {
                        let TopOverPos = new THREE.Vector3(this.position.x + data_x, this.position.y + data_y, this.position.z + Math.abs(data_x));
                        let downVect = new THREE.Vector3(0, 0, -1);
                        let ray = new THREE.Raycaster(TopOverPos, downVect.normalize());
                        let objs = ray.intersectObjects(main.group[stage].children, true);
                        objs.forEach((element) => {
                            if (this.position.z < element.point.z + Math.abs(data_x))
                                flag = true;
                        });
                    });
                });
            });
            if (flag)
                this.position.z = cache.z;
        }

        // 当たり判定 y軸

        {
            Object.keys(setstage.group).forEach(stage => {
                if (!setstage.group[stage].y) return;
                let PlayerHeight = main.camera.position.y - 120;
                let TopOverPos = new THREE.Vector3(main.camera.position.x, PlayerHeight + 30, main.camera.position.z);
                let downVect = new THREE.Vector3(0, -1, 0);
                let ray = new THREE.Raycaster(TopOverPos, downVect.normalize());
                let preY = PlayerHeight - 10;
                let objs = ray.intersectObjects(main.group[stage].children, true);
                objs.forEach((element) => {
                    if (preY < element.point.y)
                        preY = element.point.y;
                });
                /* 接触点 + 身長 */
                this.position.y = preY + 120;
            });
        }

        /*インタラクト  */
        {

            const raycaster_for_collision = new THREE.Raycaster();
            let dir_forward = new THREE.Vector3(0, 0, -1)
                .applyAxisAngle(new THREE.Vector3(1, 0, 0), main.camera.rotation.x)
                .applyAxisAngle(new THREE.Vector3(0, 1, 0), main.camera.rotation.y)
                .applyAxisAngle(new THREE.Vector3(0, 0, 1), main.camera.rotation.z);
            raycaster_for_collision.set(main.camera.position, dir_forward);
            let intersects = raycaster_for_collision.intersectObjects(main.scene.children, true);
            if (intersects.length > 0) {
                if (keydata.action.instruct)
                    if (intersects[0].object.$_fn !== undefined) {
                        intersects[0].object.$_fn();
                    } else {
                        console.log(intersects);
                    }
            }






        }

        return {
            position: this.position,
            euler: this.euler
        };
    }
}

let playerdata = new player;
class key {
    constructor() {
        this.action = {
            "up": false,
            "down": false,
            "right": false,
            "left": false,
            "sneak": false,
        };
    }
}
class mouse {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.right = false;
        this.left = false;
    }
    update() {
        this.x = 0;
        this.y = 0;
    }
}
let keydata = new key();
let mousedata = new mouse();


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