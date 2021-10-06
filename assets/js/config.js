var config = {
    debug: true,
    stats: true,
    quality: {
        fps: 60,
        shadow: 1,
        antialias: false, // MSAA or FXAA
        ambientocclusion: false, //SSAO
        anisotropy: 1,
    },
}

new URL(window.location.href).searchParams.forEach(function(value, key) {
    config.quality[key] = value;
});