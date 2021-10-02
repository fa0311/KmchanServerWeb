var config = {
    debug: true,
    stats: false,
    quality: {
        fps: 60,
        shadow: 2,
        antialias: false, // MSAA or FXAA
        ambientocclusion: false, //SSAO
        anisotropy: 1,
    },
}

new URL(window.location.href).searchParams.forEach(function(value, key) {
    config.quality[key] = value;
});