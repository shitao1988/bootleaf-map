
NZ.namespace("NZ.Map");
function initmap() {
    NZ.Map.map = L.map('map', {
        PanZoomBar: true,
        zoomControl: false,
        contextmenu: true,
        loadingControl: true,
        attributionControl:false,
        contextmenuWidth: 140,
        contextmenuItems: [
             {
                text: '显示坐标',
                callback: function (e) {
                    alert("经度：" + e.latlng.lng + "，纬度：" + e.latlng.lat);
                }
            }, {
                text: '在这居中',
                callback: function (e) {
                    NZ.Map.map.panTo(e.latlng);
                }
            }, '-', {
                text: '放大',
                icon: 'zoom-in.png',
                callback: function (e) {
                    NZ.Map.map.zoomIn();
                }
            }, {
                text: '缩小',
                icon: 'zoom-out.png',
                callback: function (e) {
                    NZ.Map.map.zoomOut();
                }
            }]
    }).setView([NZ.cfg.City.lat, NZ.cfg.City.lon], NZ.cfg.City.zoom);
    NZ.cfg.chinalayer.addTo(NZ.Map.map);
    NZ.cfg.layerControl.addTo(NZ.Map.map);
    NZ.cfg.miniMap.addTo(NZ.Map.map);

    
// 添加标绘
    var styleEditor = L.control.styleEditor({
        position: "topleft"
    });
   
       var measureControl = L.control.measure();

       var drawnItems = new L.FeatureGroup();
       NZ.Map.map.addLayer(drawnItems);
       drawnItems.bringToFront();

       var drawControl = new L.Control.Draw({
           draw: {
               position: 'topleft',
               polygon: {
                   title: '画一个面',
                   allowIntersection: false,
                   drawError: {
                       color: '#b00b00',
                       timeout: 1000
                   },
                   shapeOptions: {
                       color: '#bada55'
                   },
                   showArea: true
               },
               polyline: {
                   metric: false
               },
               circle: {
                   shapeOptions: {
                       color: '#662d91'
                   }
               }
           },
           edit: {
               featureGroup: drawnItems
           }
       });
       NZ.Map.map.on('draw:created', function (e) {
            var type = e.layerType,
                layer = e.layer;

            if (type === 'marker') {
                layer.bindPopup('A popup!');
            }

            drawnItems.addLayer(layer);
        });
      //工具栏
       NZ.Map.map.addControl(measureControl);
       NZ.Map.map.addControl(drawControl);
       NZ.Map.map.addControl(styleEditor);

       //wfs查询
       var selectedFeature;
       NZ.Map.map.on('click', function(e) {
        if (selectedFeature) {
            NZ.Map.map.removeLayer(selectedFeature);
        };

        
        
        var defaultParameters = {
            service : 'WFS',
            version : '1.0.0',
            request : 'GetFeature',
            typeName : 'cite:hospital',
            maxFeatures : 100,
            outputFormat : 'text/javascript',
            format_options : 'callback:getJson',
            SrsName : 'EPSG:4326'
        };

        var customParams = {
            //bbox : map.getBounds().toBBoxString(),
            cql_filter:'DWithin(the_geom, POINT(' + e.latlng.lng + ' ' + e.latlng.lat + '), 0.1, meters)'
        };

        var parameters = L.Util.extend(defaultParameters, customParams);


        //console.log(url);

        $.ajax({
            url : 'http://58.215.196.78:8088/geoserver/cite/ows' + L.Util.getParamString(parameters),
            dataType : 'jsonp',
            jsonpCallback : 'getJson',
            success : handleJson
        });

        function handleJson(data) {
        if (data.totalFeatures=0) {return;};
        selectedFeature = L.geoJson(data, {
            style: function (feature) {
                return {color: 'yellow'};
            },
            onEachFeature: function (feature, layer) {
                var content = "";
                content = content + "<b><u>" + feature.id.split('.')[0] + "</b></u><br>";
                delete feature.properties.bbox;
                for (var name in feature.properties) {content = content + "<b>" + name + ":</b> " + feature.properties[name] + "<br>"};
                var popup = L.popup()
                    .setLatLng(e.latlng)
                    .setContent(content)
                    .openOn(NZ.Map.map);
                layer.bindPopup(content);
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight
                });
            },                
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 5,
                    fillColor: "yellow",
                    color: "#000",
                    weight: 5,
                    opacity: 0.6,
                    fillOpacity: 0.2
                });
            }
        });
        selectedFeature.addTo(NZ.Map.map);
    }
    });

}
 function highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
            fillColor: "yellow",
            color: "yellow",
            weight: 5,
            opacity: 1
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    }

    function resetHighlight(e) {
        var layer = e.target;
        layer.setStyle({
            radius: 5,
            fillColor: "yellow",
            color: "yellow",
            weight: 5,
            opacity: 0.6,
            fillOpacity: 0.2
        });
    }

function initlocmap() {
    if (!NZ.Map.locmap) {
        NZ.Map.locmap = L.map('locmap').setView([NZ.cfg.City.lat, NZ.cfg.City.lon], 16);
    }
    
    NZ.cfg.chinalayer.addTo(NZ.Map.locmap);
}


