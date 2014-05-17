
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
                icon: '../assets/images/zoom-in.png',
                callback: function (e) {
                    NZ.Map.map.zoomIn();
                }
            }, {
                text: '缩小',
                icon: '../assets/images/zoom-out.png',
                callback: function (e) {
                    NZ.Map.map.zoomOut();
                }
            }]
    }).setView([NZ.cfg.City.lat, NZ.cfg.City.lon], NZ.cfg.City.zoom);
    NZ.cfg.chinalayer.addTo(NZ.Map.map);
    NZ.cfg.layerControl.addTo(NZ.Map.map);
    NZ.cfg.miniMap.addTo(NZ.Map.map);
  
    L.Control.Loading.include({

        onAdd: function (map) {
            this._container = L.DomUtil.create('div', 'nz-loader', map._controlContainer);
            map.on('baselayerchange', this._layerAdd, this);
            this._addMapListeners(map);
            this._map = map;
        },

        _showIndicator: function () {
            L.DomUtil.addClass(this._map._container, 'nz-loading');
        },

        _hideIndicator: function () {
            L.DomUtil.removeClass(this._map._container, 'nz-loading');
        }

    });
    
    var loader = new L.Control.Loading();
    loader.onAdd(NZ.Map.map);

}


function initlocmap() {
    if (!NZ.Map.locmap) {
        NZ.Map.locmap = L.map('locmap').setView([NZ.cfg.City.lat, NZ.cfg.City.lon], 16);
    }
    
    NZ.cfg.chinalayer.addTo(NZ.Map.locmap);
}


