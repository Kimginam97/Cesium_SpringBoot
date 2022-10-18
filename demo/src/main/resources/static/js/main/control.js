const zoomInBtn = document.querySelector('.zoom-in');
const zoomOutBtn = document.querySelector('.zoom-out');
const rotateLeftBtn = document.querySelector('.rotate-left');
const rotateRightBtn = document.querySelector('.rotate-right');
const leftRightDivisionBtn = document.querySelector('.left-right_division');
const slider = document.querySelector('.slider');
const keyBoardBtn = document.querySelector('.keyboard');
const makeLinePg = document.querySelector('.linepgbutton');

function initContoller(viewer) {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    const sliderHandler = new Cesium.ScreenSpaceEventHandler(slider);

    const zoomControls = (zoomValue) => {
        const windowPosition = new Cesium.Cartesian2(
            viewer.container.clientWidth / 2,
            viewer.container.clientHeight / 2
        );
        const pickRay = viewer.scene.camera.getPickRay(windowPosition);
        const pickPosition = viewer.scene.globe.pick(pickRay, viewer.scene);
        const cameraPosition = viewer.scene.camera.position;
        const currentHeading = viewer.camera.heading;
        const currentPitch = viewer.camera.pitch;

        const center = new Cesium.BoundingSphere(pickPosition, 0);

        const distanceScreen = parseInt(
            Cesium.Cartesian3.distance(pickPosition, cameraPosition)
        );

        let zoomRange = parseInt(distanceScreen - zoomValue);
        if (zoomRange <= 100) {
            zoomRange = 100;
        } else if (zoomRange >= 10000) {
            zoomRange = 10000;
        }

        viewer.scene.camera.flyToBoundingSphere(center, {
            duration: 0,
            offset: {
                heading: currentHeading,
                pitch: currentPitch,
                range: zoomRange,
            },
        });
    };

    const zoomIn = () => {
        zoomControls(700);
    };

    const zoomOut = () => {
        zoomControls(-700);
    };

    function onSlider() {
        const hasClass = slider.classList.contains('on');
        if (!hasClass) {
            slider.classList.add('on');
            sliderEventHandler();
        } else {
            slider.classList.remove('on');
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
        viewer.canvas.onclick = function () {
            viewer.canvas.focus();
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
            const cameraHeight =
                viewer.scene.globe.ellipsoid.cartesianToCartographic(
                    viewer.camera.position
                ).height;
            const moveRate = cameraHeight / 50.0;

            if (flags.moveForward) {
                viewer.camera.moveForward(moveRate);
            }
            if (flags.moveBackward) {
                viewer.camera.moveBackward(moveRate);
            }
            if (flags.moveUp) {
                viewer.camera.moveUp(moveRate);
            }
            if (flags.moveDown) {
                viewer.camera.moveDown(moveRate);
            }
            if (flags.moveLeft) {
                viewer.camera.moveLeft(moveRate);
            }
            if (flags.moveRight) {
                viewer.camera.moveRight(moveRate);
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

    makeLinePg.addEventListener('click', (event) => {
        function createPoint(clickPosition) {
            if (event.target.value === 'null') {
                return;
            }
            const point = viewer.entities.add({
                position: clickPosition,
                point: {
                    show: true,
                    color: Cesium.Color.Yellow,
                    pixelSize: 7,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 위치가 지형에 고정
                },
            });
            return point;
        }
        // Drawing mode. Initially only line is supported
        let drawingMode = event.target.value;
        viewer.entities.removeAll();
        function drawShape(positionData) {
            let shape;
            if (drawingMode === 'line') {
                shape = viewer.entities.add({
                    polyline: {
                        positions: positionData,
                        clampToGround: true,
                        width: 3,
                    },
                });
            } else if (drawingMode === 'polygon') {
                shape = viewer.entities.add({
                    polygon: {
                        hierarchy: positionData,
                        material: new Cesium.ColorMaterialProperty(
                            Cesium.Color.WHITE.withAlpha(0.7)
                        ),
                    },
                });
            }
            return shape;
        }

        let activeShapePoints = [];
        let activeShape;
        let floatingPoint;

        handler.setInputAction(function (event) {
            const earthPosition = viewer.camera.pickEllipsoid(event.position);
            if (Cesium.defined(earthPosition)) {
                if (activeShapePoints.length === 0) {
                    floatingPoint = createPoint(earthPosition);
                    activeShapePoints.push(earthPosition);
                    const dynamicPositions = new Cesium.CallbackProperty(
                        function () {
                            if (drawingMode === 'polygon') {
                                return new Cesium.PolygonHierarchy(
                                    activeShapePoints
                                );
                            }
                            return activeShapePoints;
                        },
                        false
                    );
                    activeShape = drawShape(dynamicPositions);
                }
                activeShapePoints.push(earthPosition);
                createPoint(earthPosition);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function (event) {
            if (Cesium.defined(floatingPoint)) {
                const newPosition = viewer.camera.pickEllipsoid(
                    event.endPosition
                );
                if (Cesium.defined(newPosition)) {
                    floatingPoint.position.setValue(newPosition);
                    activeShapePoints.pop();
                    activeShapePoints.push(newPosition);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        function terminateShape() {
            activeShapePoints.pop();
            drawShape(activeShapePoints);
            viewer.entities.remove(floatingPoint);
            viewer.entities.remove(activeShape);
            floatingPoint = undefined;
            activeShape = undefined;
            activeShapePoints = [];
        }

        // 마우스 오른쪽 클릭시 그리기 종료
        handler.setInputAction(function (event) {
            terminateShape();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    });

    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);
    leftRightDivisionBtn.addEventListener('click', onSlider);
    keyBoardBtn.addEventListener('click', onKeyBoard);
}
