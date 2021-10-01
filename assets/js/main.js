window.addEventListener("DOMContentLoaded",
    function() {
        loader = new loaderClass({
            "main": "assets/models/main/main",
        }, () => {
            main = new mcRenderer(document.querySelector("#canvas"), stagedata);
            main.sun.position.set(10408, 4430, 5000);
            main.sun.rotation.z = 5;
            main.camera.position.set(0, -780, 6400);
            main.animation.add((i) => main.camera.position.z += i, 7000, 500);
            setTimeout(() => main.mcRendererParent(), 0);
        });
    });