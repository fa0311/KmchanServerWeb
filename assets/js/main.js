window.addEventListener("DOMContentLoaded",
    function () {
        loader = new loaderClass({
            "main": "assets/models/main/main",
        }, main);
    });

function main() {

    canvas = new mcRenderer(document.querySelector("#canvas"), stagedata);
    console.log(canvas);

    canvas.sun.position.set(12000, -4000, 5000);
    canvas.sun.rotation.set(0, 0, 1.45);

    canvas.camera.position.set(0, -780, 6000);
    canvas.animation.add((i) => canvas.camera.position.z += i, 7000, 10);
    document.getElementById('debug-1').onclick = () => {
        canvas.animation.reset();
        canvas.animation.add((i) => canvas.camera.position.x += i, 0, 3);
        canvas.animation.add((i) => canvas.camera.position.y += i, -780, 3);
        canvas.animation.add((i) => canvas.camera.position.z += i, 7000, 3);
        canvas.animation.add((i) => canvas.camera.rotation.x += i, 0, 3);
        canvas.animation.add((i) => canvas.camera.rotation.y += i, 0, 3);
        canvas.animation.add((i) => canvas.camera.rotation.z += i, 0, 3);
    };
    document.getElementById('debug-2').onclick = () => {
        canvas.animation.reset();
        canvas.animation.add((i) => canvas.camera.position.x += i, 780, 3);
        canvas.animation.add((i) => canvas.camera.position.y += i, -4500, 3);
        canvas.animation.add((i) => canvas.camera.position.z += i, 18, 3);
        canvas.animation.add((i) => canvas.camera.rotation.x += i, 0.18, 3);
        canvas.animation.add((i) => canvas.camera.rotation.y += i, 0.37, 3);
        canvas.animation.add((i) => canvas.camera.rotation.z += i, -0.06, 3);
    };

    document.getElementById('debug-3').onclick = () => {
        canvas.animation.reset();
        canvas.animation.add((i) => canvas.camera.position.x += i, -230, 3);
        canvas.animation.add((i) => canvas.camera.position.y += i, -3800, 3);
        canvas.animation.add((i) => canvas.camera.position.z += i, 400, 3);

        canvas.animation.add((i) => canvas.camera.rotation.x += i, -2.5, 3);
        canvas.animation.add((i) => canvas.camera.rotation.y += i, -0.2, 3);
        canvas.animation.add((i) => canvas.camera.rotation.z += i, -2.9, 3);
    };

    setTimeout(() => canvas.mcRendererParent(), 0);
}