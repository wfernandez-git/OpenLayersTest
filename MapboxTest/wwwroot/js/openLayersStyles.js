var style_simple = new ol.style.Style({
	fill: new ol.style.Fill({
		color: '#ADD8E633'
	}),
	stroke: new ol.style.Stroke({
		color: '#880000',
		width: 1
	})
});

function simpleStyle(feature) {
	return style_simple;
}