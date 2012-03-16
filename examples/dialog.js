var map = new OpenLayers.Map({
    div: "map",
    layers: [new OpenLayers.Layer.OSM()],
    controls: [
        new OpenLayers.Control.Navigation({
            dragPanOptions: {
                enableKinetic: true
            }
        }),
        new OpenLayers.Control.Attribution(),
        new OpenLayers.Control.Zoom()
    ],
    center: [0, 0],
    zoom: 1
});

var dialog = new OpenLayers.Dialog({
    map: map,
    location: {lon: 0, lat: 0},
    content: "hello"
});
dialog.open();