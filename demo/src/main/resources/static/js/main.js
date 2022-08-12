addEventListener('load', () => {
    window.CESIUM_BASE_URL = '/js/libs/cesium/';
    Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkOWZjOTM4OS0xNDg3LTQxZmQtOGYxMS1mMWFlYjM1OTcwY2IiLCJpZCI6MTAxOTM1LCJpYXQiOjE2NTgzNjUxMDN9.V70mGWoxftFZbAZgeDJiugBt4DxhsdXCC8qc5PBOOYM';

    // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
    const viewer = new Cesium.Viewer('cesiumContainer', {
        terrainProvider: Cesium.createWorldTerrain(),
    });

    // Fly the camera to San Francisco at the given longitude, latitude, and height.
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(126.74345, 37.66017, 400),
        orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch: Cesium.Math.toRadians(-15.0),
        },
    });

    const position = Cesium.Cartesian3.fromDegrees(126.743327, 37.66845, 48);
    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);

    const position1 = Cesium.Cartesian3.fromDegrees(126.743383, 37.67037, 41);
    const modelMatrix1 = Cesium.Transforms.eastNorthUpToFixedFrame(position1);

    viewer.scene.primitives.add(
        Cesium.Model.fromGltf({
            url: 'imges/test1.glb',
            modelMatrix: modelMatrix,
        })
    );

    viewer.scene.primitives.add(
        Cesium.Model.fromGltf({
            url: 'imges/test2.glb',
            modelMatrix: modelMatrix1,
        })
    );
});
