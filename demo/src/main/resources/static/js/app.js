function initMap() {
    window.CESIUM_BASE_URL = '/js/libs/cesium/';
    Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMTQ2MWFmOS1lOTJhLTQzN2MtODFlOC05NjVhZjI0ZWMwM2EiLCJpZCI6ODk3MDcsImlhdCI6MTY0OTg5NDY4MX0.p4EnzJhcoPuVPLa9mL1GiVWNoxqv_YU6Npp9LzMwEjE';

    const viewer = new Cesium.Viewer('cesiumContainer', {
        navigationHelpButton: false,
        animation: false,
        timeline: false,
    });

    viewer.scene.primitives.add(Cesium.createOsmBuildings());

    const destination = Cesium.Cartesian3.fromDegrees(
        126.74345,
        37.66017,
        2200
    );

    viewer.camera.flyTo({
        destination: destination,
    });

    return viewer;
}

window.addEventListener('load', (event) => {
    const viewer = initMap();
    const controller = initContoller(viewer);

    window._cviewer = viewer;
});
