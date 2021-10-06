class EventListener {
    constructor(canvas, renderer, camera) {
        this.canvas = canvas;
        this.renderer = renderer;
        this.camera = camera;
        window.addEventListener('resize', () => this.resizefunc());
        this.resizefunc();
        this.canvas.addEventListener("mousedown", this.canvasclickfunk);
        document.addEventListener('pointerlockchange', () => this.pointerlockchangefunc());
    }
    resizefunc() {
        let width = window.innerWidth;
        let height = window.innerHeight;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.fov = height / width * 45 + 30;
        this.camera.updateProjectionMatrix();
    }
    canvasclickfunk(event) {
        event.target.requestPointerLock = event.target.requestPointerLock || event.target.mozRequestPointerLock || event.target.webkitRequestPointerLock;
        event.target.requestPointerLock();
    }

    pointerlockchangefunc() {
        if (document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement) {
            this.canvas.addEventListener("mousedown", this.mousedownfunk);
            this.canvas.addEventListener("mouseup", this.mouseupfunc);
            document.addEventListener("keydown", this.keydownfunc);
            document.addEventListener("keyup", this.keyupfunc);
            document.addEventListener("mousemove", this.mousemovefunc);
        } else {
            this.canvas.removeEventListener("mousedown", this.mousedownfunk);
            this.canvas.removeEventListener("mouseup", this.mouseupfunc);
            document.removeEventListener("keydown", this.keydownfunc);
            document.removeEventListener("keyup", this.keyupfunc);
            document.removeEventListener("mousemove", this.mousemovefunc);
        }
    }
    mousedownfunk(event) {
        if (event.button == 0)
            mousedata.left = true;
        else if (event.button == 2)
            mousedata.right = true;
    }
    mouseupfunc(event) {
        if (event.button == 0)
            mousedata.left = false;
        else if (event.button == 2)
            mousedata.right = false;
    }
    keydownfunc(event) {
        let action = keycode[String(event.keyCode)];
        if (action === undefined) {
            console.log(event.keyCode);
            return
        }
        keydata.action[action] = true;
    }
    keyupfunc(event) {
        let action = keycode[String(event.keyCode)];
        if (action === undefined)
            return
        keydata.action[action] = false;
    }
    mousemovefunc(event) {
        mousedata.x += event.movementX / 1000;
        mousedata.y += event.movementY / 1000;
    }
}