var config = {
    debug: false,
    stats: false,
    quality: {
        fps: 60,
        shadow: 1,
        antialias: false, // MSAA or FXAA
        ambientocclusion: false, //SSAO
        anisotropy: 1,
    },
}

new URL(window.location.href).searchParams.forEach(function(value, keys) {
    let query = config;
    keys.split(".").forEach(function(key, i) {
        if (keys.split(".").length - 1 > i)
            query = query[key];
        else if (value.toLowerCase() === "true")
            query[key] = true;
        else if (value.toLowerCase() === "false")
            query[key] = false;
        else if (Number.isNaN(Number(value)))
            query[key] = value;
        else
            query[key] = Number(value);
    });
});