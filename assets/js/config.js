var config = {
    debug: true,
    stats: false,
    quality: {
        fps: 60,
        shadow: 2,
        antialias: "MSAA", // MSAA or FXAA or SMAA
        anisotropy: 16,
    },
}

new URL(window.location.href).searchParams.forEach(function(value, key) {
    config.quality[key] = value;
});