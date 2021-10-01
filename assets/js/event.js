class EventListener {
    constructor(canvas, renderer, camera) {
        this.canvas = canvas;
        this.renderer = renderer;
        this.camera = camera;
        window.addEventListener('resize', () => this.resizefunc());
        this.resizefunc();
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
}