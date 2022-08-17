//var gsWMSTileLayer_WYAgreements = new ol.layer.Tile({
//    source: new ol.source.TileWMS({
//        url: 'http://localhost:8090/geoserver/workspace_q12345/wms',
//        params: { 'LAYERS': 'q12345:WYAgreements', 'TILED': true },
//        serverType: 'geoserver',
//        tileLoadFunction: customTileLoad,
//        transition: 0,
//    }),
//});

var gsWMSTileLayer_WYAgreements = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://localhost:8090/geoserver/workspace_q12345/wms',
        params: { 'LAYERS': 'workspace_q12345:WYAgreements', 'TILED': true, 'CRS':'EPSG:4326' },
        serverType: 'geoserver',
        projection: ol.proj.get('EPSG:' + projection_epsg_no),
        tileLoadFunction: customTileLoad,
        transition: 0,
    }),
});

var gsTMSVectorTileLayer = new ol.layer.VectorTile({
    style: simpleStyle,
    source: new ol.source.VectorTile({
        maxZoom:15,
        tilePixelRatio: 1, // oversampling when > 1
        tileGrid: ol.tilegrid.createXYZ({ maxZoom: 15 }),
        projection: ol.proj.get('EPSG:' + projection_epsg_no),
        format: new ol.format.MVT({ idProperty: 'iso_a3', featureClass: ol.Feature }),
        url: 'http://localhost:8090/geoserver/gwc/service/tms/1.0.0/tiger:tiger_roads' +
            '@EPSG%3A' + projection_epsg_no + '@pbf/{z}/{x}/{-y}.pbf',
        tileLoadFunction: customVectorTileLoad
    })
});

//var gsWFSVectorTileLayer = new ol.layer.Vector({
//    style: simpleStyle,
//    source: new ol.source.Vector({
//        format: new ol.format.GeoJSON(),
//        url: 'http://localhost:8090/geoserver/workspace_q12345/wfs?service=WFS&' +
//            'version=1.1.0&request=GetFeature&typename=states&' +
//            'outputFormat=application/json',
//        loader: customFeatureLoader,
//        strategy: ol.loadingstrategy.bbox
//    })
//});





var esriWFSVectorLayer_TexasSurveys_Direct = new ol.layer.Vector({
    style: simpleStyle,
    source: new ol.source.Vector({
        style: simpleStyle,
        format: new ol.format.GeoJSON(),
        url: arcGISServerWFSBaseUrl + 'version=2.0.0&request=GetFeature&typename=CORE_DEV17_GEO_SRCH:Surveys&outputFormat=GEOJSON',
        loader: customESRIVectorLoader,
        strategy: ol.loadingstrategy.bbox,
    })

});

function SetVisibleLayer(option) {
    const layers = [...map.getLayers().getArray()]
    layers.forEach((layer) => {
        if (layer != baseMapLayer) {
            map.removeLayer(layer)
        }
    });
    switch (option) {
        case 1:
            SetLayerVisibilityHelper(gsWMSTileLayer_WYAgreements, [-106.94, 41.06], 8);
            break;
        //case 2:
        //  SetLayerVisibilityHelper(gsTMSVectorTileLayer, [-74.0060, 40.7128], 12);
        //    break;
        case 2:
            SetLayerVisibilityHelper(buildVectorTileHelper('All_Tracts'), [-106.164134, 41.330569], 9);
            //SetLayerVisibilityHelper(gsWFSVectorTileLayer, [-100, 38.7128], 5);
            break;
        case 3: -106.164134, 41.330569
            SetLayerVisibilityHelper(buildVectorTileHelper('Even_Tracts'), [-106.164134, 41.330569], 9);
            break;
        case 4:
            SetLayerVisibilityHelper(buildVectorTileHelper('Odd_Tracts'), [-106.164134, 41.330569], 9);
            break;
        case 5:
            SetLayerVisibilityHelper(esriWFSVectorLayer_TexasSurveys_Direct, [-101.82, 35.32], 10);
            break;
        default:
            alert("Can't set the visible layer for " + option)
    }
}

function SetLayerVisibilityHelper(selectedLayer, center, zoom) {

    map.addLayer(selectedLayer);
    map.getView().setCenter(ol.proj.transform(center, 'EPSG:' + projection_epsg_no, 'EPSG:' + projection_epsg_no));
    map.getView().setZoom(zoom);

}


function buildVectorTileHelper(typeName) {
    return new ol.layer.Vector({
        style: simpleStyle,
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: 'http://localhost:8090/geoserver/workspace_q12345/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=' + typeName + '&' +
                'outputFormat=application/json',
            loader: customFeatureLoader,
            strategy: ol.loadingstrategy.bbox
        })
    });
}