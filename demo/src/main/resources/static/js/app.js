function initMap() {
    Cesium.Ion.defaultAccessToken = API_KEY.CESIUM_KEY;
    const viewer = new Cesium.Viewer('cesiumContainer', {
        animation: true,   
        baseLayerPicker: true, 
        fullscreenButton: true
    });

    viewer.scene.primitives.add(Cesium.createOsmBuildings());

    const destination = Cesium.Cartesian3.fromDegrees(
        126.78345,
        37.66017,
        500
    );

    viewer.camera.flyTo({
        destination: destination,
        orientation : {
            heading : Cesium.Math.toRadians(-125.0),
            pitch : Cesium.Math.toRadians(-35.0),
            roll : 0.0
        },
        duration:0,
    });

    return viewer;
}

window.addEventListener('load', (event) => {
    const viewer = initMap();
    window._cviewer = viewer;
});
