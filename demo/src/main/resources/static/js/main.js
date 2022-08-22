addEventListener('load', () => {
    window.CESIUM_BASE_URL = '/js/libs/cesium/';
    Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMTQ2MWFmOS1lOTJhLTQzN2MtODFlOC05NjVhZjI0ZWMwM2EiLCJpZCI6ODk3MDcsImlhdCI6MTY0OTg5NDY4MX0.p4EnzJhcoPuVPLa9mL1GiVWNoxqv_YU6Npp9LzMwEjE';

    const viewer = new Cesium.Viewer('cesiumContainer', {
        navigationHelpButton: false,
        animation: false,
        timeline: false,
    });
    const scene = viewer.scene;
    const canvas = viewer.canvas;
    const camera = viewer.scene.camera;
    const layers = viewer.imageryLayers;
    const ellipsoid = scene.globe.ellipsoid;

    const buildingTileset = viewer.scene.primitives.add(
        Cesium.createOsmBuildings()
    );

    const destination = Cesium.Cartesian3.fromDegrees(
        126.74345,
        37.66017,
        2200
    );

    const leftRightDivisionBtn = document.querySelector('.left-right_division');
    const slider = document.querySelector('.slider');
    const kakaoImg = document.querySelector('.kakaoimg');
    const sliderHandler = new Cesium.ScreenSpaceEventHandler(slider);
    const keyBoardBtn = document.querySelector('.keyboard');

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

    // 키보드 동작하기
    keyBoardBtn.addEventListener('click', onKeyBoard);

    function onSlider() {
        const hasClass = slider.classList.contains('on');
        if (!hasClass) {
            slider.classList.add('on');
            sliderEventHandler();
        } else {
            slider.classList.remove('on');
            layers.removeAll();
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

    function onKeyBoard() {
        const hasClass = keyBoardBtn.classList.contains('on');
        if (!hasClass) {
            keyBoardBtn.classList.add('on');
            keyBoardHandler();
        } else {
            keyBoardBtn.classList.remove('on');
        }
    }

    function keyBoardHandler() {
        canvas.onclick = function () {
            canvas.focus();
        };
        const flags = {
            moveForward: false,
            moveBackward: false,
            moveUp: false,
            moveDown: false,
            moveLeft: false,
            moveRight: false,
        };

        document.addEventListener(
            'keydown',
            function (e) {
                const flagName = getFlagForKeyCode(e.keyCode);
                if (typeof flagName !== 'undefined') {
                    flags[flagName] = true;
                }
            },
            false
        );

        document.addEventListener(
            'keyup',
            function (e) {
                const flagName = getFlagForKeyCode(e.keyCode);
                if (typeof flagName !== 'undefined') {
                    flags[flagName] = false;
                }
            },
            false
        );

        viewer.clock.onTick.addEventListener(function (clock) {
            // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
            const cameraHeight = ellipsoid.cartesianToCartographic(
                camera.position
            ).height;
            const moveRate = cameraHeight / 100.0;

            if (flags.moveForward) {
                camera.moveForward(moveRate);
            }
            if (flags.moveBackward) {
                camera.moveBackward(moveRate);
            }
            if (flags.moveUp) {
                camera.moveUp(moveRate);
            }
            if (flags.moveDown) {
                camera.moveDown(moveRate);
            }
            if (flags.moveLeft) {
                camera.moveLeft(moveRate);
            }
            if (flags.moveRight) {
                camera.moveRight(moveRate);
            }
        });
    }

    function getFlagForKeyCode(keyCode) {
        switch (keyCode) {
            case 'W'.charCodeAt(0):
                return 'moveForward';
            case 'S'.charCodeAt(0):
                return 'moveBackward';
            case 'Q'.charCodeAt(0):
                return 'moveUp';
            case 'E'.charCodeAt(0):
                return 'moveDown';
            case 'D'.charCodeAt(0):
                return 'moveRight';
            case 'A'.charCodeAt(0):
                return 'moveLeft';
            default:
                return undefined;
        }
    }
});
