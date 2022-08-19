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
        camera.zoomIn(700);
    });

    // 축소
    const zoomOut = document.querySelector('.zoom-out');
    zoomOut.addEventListener('click', () => {
        camera.zoomOut(700);
    });

    // 왼쪽 회전
    const rotateLeft = document.querySelector('.rotate-left');
    rotateLeft.addEventListener('click', () => {
        camera.rotate(destination, 45);
    });

    // 오른쪽 회전
    const rotateRight = document.querySelector('.rotate-right');
    rotateRight.addEventListener('click', () => {
        camera.rotate(destination, -45);
    });

    // 좌우화면 분할
    const layers = viewer.imageryLayers;
    const leftRightDivisionBtn = document.querySelector('.left-right_division');
    const slider = document.querySelector('.slider');
    const kakaoImg = document.querySelector('.kakaoimg');
    const sliderHandler = new Cesium.ScreenSpaceEventHandler(slider);

    leftRightDivisionBtn.addEventListener('click', onSlider);
    kakaoImg.addEventListener('click', () => {
        const earthAtNight = layers.addImageryProvider(
            new Cesium.IonImageryProvider({ assetId: 4 })
        );
        earthAtNight.splitDirection = Cesium.SplitDirection.LEFT; // Only show to the left of the slider.
        // Sync the position of the slider with the split position
        viewer.scene.splitPosition =
            slider.offsetLeft / slider.parentElement.offsetWidth;
    });

    function onSlider() {
        const hasClass = slider.classList.contains('on');
        if (!hasClass) {
            slider.classList.add('on');
            sliderEventHandler();
        } else {
            slider.classList.remove('on');
            layers.removeAll();
            console.log(layers);
        }
    }

    function sliderEventHandler() {
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
        sliderHandler.setInputAction(function () {
            moveActive = true;
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        sliderHandler.setInputAction(function () {
            moveActive = true;
        }, Cesium.ScreenSpaceEventType.PINCH_START);
        sliderHandler.setInputAction(
            move,
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
        );
        sliderHandler.setInputAction(
            move,
            Cesium.ScreenSpaceEventType.PINCH_MOVE
        );
        sliderHandler.setInputAction(function () {
            moveActive = false;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
        sliderHandler.setInputAction(function () {
            moveActive = false;
        }, Cesium.ScreenSpaceEventType.PINCH_END);
    }
});
