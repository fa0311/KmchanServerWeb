window.addEventListener("DOMContentLoaded",
    function () {
        loader = new loaderClass({
            "main": "assets/models/main/main",
        }, main);
    });

function main() {
    canvas = new mcRenderer(document.querySelector("#canvas"), stagedata);
    canvas.sun.position.set(12000, -4000, 5000);
    canvas.sun.rotation.set(0, 0, 1.45);
    canvas.walk = new walk();
    canvas.requestAnimationFrame = function () {
        let player_move = this.walk.move(this._delay);
        this.camera.quaternion.setFromEuler(player_move.euler);
        this.camera.position.x = player_move.position.x;
        this.camera.position.y = player_move.position.y;
        this.camera.position.z = player_move.position.z;
        mousedata.update();
    }
    setTimeout(() => canvas.mcRendererParent(), 0);
}