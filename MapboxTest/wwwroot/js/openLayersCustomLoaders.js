function customTileLoad(tile, src) {
	showSpinner(true);
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'blob';
	xhr.addEventListener('loadend', function (evt) {
		var data = this.response;
		if (data !== undefined && data !== null) {
			tile.getImage().src = URL.createObjectURL(data);
		} else {
			tile.setState(3);//TileState.ERROR
		}
	});
	xhr.addEventListener('error', function () {
		tile.setState(3);//TileState.ERROR
	});
	xhr.open('GET', src);
	xhr.setRequestHeader("Authorization", 'Basic ' + btoa('user_q12345:9ba68554d6184503'))
	xhr.send();
	showSpinner(false);
}

function customVectorTileLoad(tile, url) {

	tile.setLoader(function (extent, resolution, projection) {
		var auth = { "Authorization": 'Basic ' + btoa('user_q12345:9ba68554d6184503') };
		showSpinner(true);
		fetch(url, { headers: auth }).then(function (response) {
			response.arrayBuffer().then(function (data) {
				const format = tile.getFormat() // ol/format/MVT configured as source format
				const features = format.readFeatures(data, {
					extent: extent,
					featureProjection: projection
				});
				tile.setFeatures(features);
				showSpinner(false);
			});
		});
	});
}

function customFeatureLoader(extent, resolution, projection, success, failure) {
	showSpinner(true);
	var vs = this;
	var proj = projection.getCode();
	var url = vs.getUrl() + '&srsname=' + proj + '&' +
		'bbox=' + extent.join(',') + ',' + proj;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.setRequestHeader("Authorization", 'Basic ' + btoa('user_q12345:9ba68554d6184503'))
	var onError = function () {
		vs.removeLoadedExtent(extent);
		failure();
	}
	xhr.onerror = onError;
	xhr.onload = function () {
		if (xhr.status == 200) {
			var features = vs.getFormat().readFeatures(xhr.responseText);
			vs.addFeatures(features);
			success(features);
		} else {
			onError();
		}
		showSpinner(false);
	}
	xhr.send();
	
}

function customESRIVectorLoader(extent, resolution, projection, success, failure) {
	showSpinner(true);
	var vs = this;
	var proj = projection.getCode();
	var url = vs.getUrl() + '&srsname=' + proj + '&' +
		'bbox=' + extent.join(',') + ',' + proj;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	var onError = function () {
		vectorSource.removeLoadedExtent(extent);
		failure();
	}
	xhr.onerror = onError;
	xhr.onload = function () {
		if (xhr.status == 200) {
			var features = vs.getFormat().readFeatures(xhr.responseText);
			vs.addFeatures(features);
			success(features);
		} else {
			onError();
		}
		showSpinner(false);
	}
	xhr.send();
}