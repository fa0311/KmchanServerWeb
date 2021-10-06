window.addEventListener("DOMContentLoaded",
    function() {
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
        canvas.animationRotation.reset();
        canvas.animation.add((i) => canvas.camera.position.x += i, 0, 3);
        canvas.animation.add((i) => canvas.camera.position.y += i, -780, 3);
        canvas.animation.add((i) => canvas.camera.position.z += i, 7000, 3);
        canvas.animationRotation.add(canvas.camera.quaternion, new THREE.Euler(0, 0, 0, 'YXZ'), 3);
    };
    document.getElementById('debug-2').onclick = () => {
        canvas.animation.reset();
        canvas.animationRotation.reset();
        canvas.animation.add((i) => canvas.camera.position.x += i, 622, 3);
        canvas.animation.add((i) => canvas.camera.position.y += i, -4300, 3);
        canvas.animation.add((i) => canvas.camera.position.z += i, -558, 3);
        canvas.animationRotation.add(canvas.camera.quaternion, new THREE.Euler(0.1, 0.4, 0, 'YXZ'), 3);
    };

    document.getElementById('debug-3').onclick = () => {
        canvas.animation.reset();
        canvas.animationRotation.reset();
        canvas.animation.add((i) => canvas.camera.position.x += i, -230, 3);
        canvas.animation.add((i) => canvas.camera.position.y += i, -4200, 3);
        canvas.animation.add((i) => canvas.camera.position.z += i, 400, 3);
        canvas.animationRotation.add(canvas.camera.quaternion, new THREE.Euler(-0.1, -2.78, 0, 'YXZ'), 3);
    };

    document.getElementById('debug-4').onclick = () => {
        canvas.animation.reset();
        canvas.animationRotation.reset();
        canvas.animation.add((i) => canvas.camera.position.x += i, 3070, 3);
        canvas.animation.add((i) => canvas.camera.position.y += i, -4380, 3);
        canvas.animation.add((i) => canvas.camera.position.z += i, -670, 3);
        canvas.animationRotation.add(canvas.camera.quaternion, new THREE.Euler(0.05, -2.09, 0, 'YXZ'), 3);
    };
    document.getElementById('debug-5').onclick = () => {
        canvas.animation.reset();
        canvas.animationRotation.reset();
        canvas.animation.add((i) => canvas.camera.position.x += i, 580, 3);
        canvas.animation.add((i) => canvas.camera.position.y += i, -4530, 3);
        canvas.animation.add((i) => canvas.camera.position.z += i, 2400, 3);
        canvas.animationRotation.add(canvas.camera.quaternion, new THREE.Euler(-0.18, 2.48, 0, 'YXZ'), 3);
    };
    document.getElementById('debug-6').onclick = () => {
        canvas.animation.reset();
        canvas.animationRotation.reset();
        canvas.animation.add((i) => canvas.camera.position.x += i, 1470, 3);
        canvas.animation.add((i) => canvas.camera.position.y += i, -3230, 3);
        canvas.animation.add((i) => canvas.camera.position.z += i, -2600, 3);
        canvas.animationRotation.add(canvas.camera.quaternion, new THREE.Euler(-0.28, -0.74, 0, 'YXZ'), 3);
    };
    document.getElementById('debug-7').onclick = () => {
        canvas.animation.reset();
        canvas.animationRotation.reset();
        canvas.animation.add((i) => canvas.camera.position.x += i, -1150, 3);
        canvas.animation.add((i) => canvas.camera.position.y += i, -3500, 3);
        canvas.animation.add((i) => canvas.camera.position.z += i, -3700, 3);
        canvas.animationRotation.add(canvas.camera.quaternion, new THREE.Euler(0.05, -1.11, 0, 'YXZ'), 3);
    };
    document.getElementById('debug-8').onclick = () => {
        canvas.animation.reset();
        canvas.animationRotation.reset();
        canvas.animation.add((i) => canvas.camera.position.x += i, -1340, 3);
        canvas.animation.add((i) => canvas.camera.position.y += i, -4580, 3);
        canvas.animation.add((i) => canvas.camera.position.z += i, 782, 3);
        canvas.animationRotation.add(canvas.camera.quaternion, new THREE.Euler(0.36, 2.16, 0, 'YXZ'), 3);
    };
    setTimeout(() => canvas.mcRendererParent(), 0);
    /*
        function quaternion_x(i) {+
            let euler = new THREE.Euler(0, 0, 0, 'YXZ');
            euler.setFromQuaternion(canvas.camera.quaternion);
            euler.x += i;
            canvas.camera.quaternion.setFromEuler(euler);
            return canvas.camera.quaternion.x;
        }
    */
}