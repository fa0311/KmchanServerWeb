class walk {
    constructor() {
        this.position = {
            x: 0,
            y: -4500,
            z: 0
        };
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    }
    move(delay) {
        this.euler.y -= mousedata.x;
        this.euler.x = Math.max(Math.PI / 2 - Math.PI, Math.min(Math.PI / 2 - 0, this.euler.x - mousedata.y));

        // 移動速度
        if (keydata.action.sneak)
            this.speed = delay * 960;
        else
            this.speed = delay * 480;
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
            this.position.y += 3 * this.speed;
        } else if (keydata.action.fall) {
            this.position.y -= 3 * this.speed;
        } else if (keydata.action.output) {
            /*
            const box = new THREE.Mesh(new THREE.BoxGeometry(400, 400, 400), new THREE.MeshNormalMaterial());
            box.quaternion.setFromEuler(this.euler);
            */
            console.log({
                position: {
                    x: this.position.x,
                    y: this.position.y,
                    z: this.position.z
                },
                euler: {
                    x: this.euler.x,
                    y: this.euler.y,
                    z: this.euler.z
                }
            });
        }
        return {
            position: this.position,
            euler: this.euler
        };
    }
}


class key {
    constructor() {
        this.action = {
            "up": false,
            "down": false,
            "right": false,
            "left": false,
            "sneak": false,
            "output": false,
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