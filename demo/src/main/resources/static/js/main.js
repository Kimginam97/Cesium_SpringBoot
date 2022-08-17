addEventListener('load', () => {
    window.CESIUM_BASE_URL = '/js/libs/cesium/';
    Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMTQ2MWFmOS1lOTJhLTQzN2MtODFlOC05NjVhZjI0ZWMwM2EiLCJpZCI6ODk3MDcsImlhdCI6MTY0OTg5NDY4MX0.p4EnzJhcoPuVPLa9mL1GiVWNoxqv_YU6Npp9LzMwEjE';

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
    const camera = viewer.scene.camera;

    viewer.camera.flyTo({
        destination: destination,
    });

    // 확대
    const zoomIn = document.querySelector('.zoom-in');
    zoomIn.addEventListener('click', () => {
        camera.zoomIn(500);
    });

    // 축소
    const zoomOut = document.querySelector('.zoom-out');
    zoomOut.addEventListener('click', () => {
        camera.zoomOut(500);
    });

    // 왼쪽 회전
    const rotateLeft = document.querySelector('.rotate-left');
    rotateLeft.addEventListener('click', () => {
        camera.rotate(destination, 90);
    });

    // 오른쪽 회전
    const rotateRight = document.querySelector('.rotate-right');
    rotateRight.addEventListener('click', () => {
        camera.rotate(destination, -90);
    });

    const layers = viewer.imageryLayers;

    // 좌우화면 분할
    const leftRightDivision = document.querySelector('.left-right_division');
    leftRightDivision.addEventListener('click', () => {
        const earthAtNight = layers.addImageryProvider(
            new Cesium.IonImageryProvider({ assetId: 4 })
        );
        earthAtNight.splitDirection = Cesium.SplitDirection.LEFT; // Only show to the left of the slider.

        // Sync the position of the slider with the split position
        const slider = document.getElementById('slider');
        slider.style.display = 'block';
        viewer.scene.splitPosition =
            slider.offsetLeft / slider.parentElement.offsetWidth;

        const handler = new Cesium.ScreenSpaceEventHandler(slider);

        let moveActive = false;

        function move(movement) {
            if (!moveActive) {
                return;
            }

            const relativeOffset = movement.endPosition.x;
            const splitPosition =
                (slider.offsetLeft + relativeOffset) /
                slider.parentElement.offsetWidth;
            slider.style.left = `${100.0 * splitPosition}%`;
            viewer.scene.splitPosition = splitPosition;
        }

        handler.setInputAction(function () {
            moveActive = true;
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        handler.setInputAction(function () {
            moveActive = true;
        }, Cesium.ScreenSpaceEventType.PINCH_START);

        handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);

        handler.setInputAction(function () {
            moveActive = false;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
        handler.setInputAction(function () {
            moveActive = false;
        }, Cesium.ScreenSpaceEventType.PINCH_END);
    });
});
