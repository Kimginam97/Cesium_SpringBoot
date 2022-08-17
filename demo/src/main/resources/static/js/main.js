addEventListener('load', () => {
    window.CESIUM_BASE_URL = '/js/libs/cesium/';
    Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkOWZjOTM4OS0xNDg3LTQxZmQtOGYxMS1mMWFlYjM1OTcwY2IiLCJpZCI6MTAxOTM1LCJpYXQiOjE2NTgzNjUxMDN9.V70mGWoxftFZbAZgeDJiugBt4DxhsdXCC8qc5PBOOYM';

    const viewer = new Cesium.Viewer('cesiumContainer', {
        navigationHelpButton: false,
        animation: false,
        timeline: false,
    });
    const buildingTileset = viewer.scene.primitives.add(
        Cesium.createOsmBuildings()
    );

    const destination = Cesium.Cartesian3.fromDegrees(
        126.74345,
        37.66017,
        2200
    );

    viewer.camera.flyTo({
        destination: destination,
    });

    const cartographic = new Cesium.Cartographic();
    const cartesian = new Cesium.Cartesian3();
    const camera = viewer.scene.camera;
    const ellipsoid = viewer.scene.mapProjection.ellipsoid; //타원체를 가져옴
    const toolbar = document.getElementById('toolbar');

    toolbar.innerHTML = '<div id="hud"></div>';

    toolbar.setAttribute(
        'style',
        'background: rgba(42,42,42,0.9); border-radius: 5px;'
    );

    const hud = document.getElementById('hud');

    viewer.clock.onTick.addEventListener(function () {
        ellipsoid.cartesianToCartographic(camera.positionWC, cartographic);
        hud.innerHTML =
            'Lon: ' +
            Cesium.Math.toDegrees(cartographic.longitude).toFixed(3) +
            ' deg<br/>' +
            'Lat: ' +
            Cesium.Math.toDegrees(cartographic.latitude).toFixed(3) +
            ' deg<br/>' +
            'Alt: ' +
            (cartographic.height * 0.01).toFixed(1) +
            ' km';
    });

    const zoomIn = document.querySelector('.zoom-in');
    zoomIn.addEventListener('click', () => {
        camera.zoomIn(500);
    });

    const zoomOut = document.querySelector('.zoom-out');
    zoomOut.addEventListener('click', () => {
        camera.zoomOut(500);
    });

    const rotateLeft = document.querySelector('.rotate-left');
    rotateLeft.addEventListener('click', () => {
        camera.rotate(destination, 90);
    });

    const rotateRight = document.querySelector('.rotate-right');
    rotateRight.addEventListener('click', () => {
        camera.rotate(destination, -90);
    });
});
