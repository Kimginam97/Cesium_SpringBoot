addEventListener('load', () => {
    window.CESIUM_BASE_URL = '/js/libs/cesium/';
    Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkOWZjOTM4OS0xNDg3LTQxZmQtOGYxMS1mMWFlYjM1OTcwY2IiLCJpZCI6MTAxOTM1LCJpYXQiOjE2NTgzNjUxMDN9.V70mGWoxftFZbAZgeDJiugBt4DxhsdXCC8qc5PBOOYM';

    const viewer = new Cesium.Viewer('cesiumContainer', {
        navigationHelpButton: false,
        animation: false,
        timeline: false,
    });

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(126.74345, 37.66017, 400),
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

    function setZoomIn() {
        ellipsoid.cartesianToCartographic(camera.position, cartographic); //제공된 데카르트를 지도 제작 표현으로 변환 , 데카르트 위치, 저장될 매개체
        if (cartographic.height > 300) {
            console.log(cartographic.height);
            cartographic.height -= 300; // convert to meters
        }

        ellipsoid.cartographicToCartesian(cartographic, cartesian); // 지도제작을 데카르트 위치로 변환, 지도제작위치 ,저장된 매개체
        camera.position = cartesian;
    }

    function setZoomOut() {
        ellipsoid.cartesianToCartographic(camera.position, cartographic);
        if (cartographic.height < 2000) {
            console.log(cartographic.height);
            cartographic.height += 300; // convert to meters
        }
        ellipsoid.cartographicToCartesian(cartographic, cartesian);
        camera.position = cartesian;
    }

    const zoomIn = document.querySelector('.zoom-in');
    zoomIn.addEventListener('click', () => {
        setZoomIn();
    });

    const zoomOut = document.querySelector('.zoom-out');
    zoomOut.addEventListener('click', () => {
        setZoomOut();
    });
});
