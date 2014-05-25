
NZ.namespace("NZ.cfg");
//坐标定位
NZ.cfg.City = {
    name: '天津',
    lon: 117.1939,
    lat: 39.125,
    zoom: 5
},
NZ.cfg.chinalayer = L.tileLayer("imgmap/{z}/{x}/{y}.png", {
    zIndex: 1
});
/*NZ.cfg.chinalayer = L.esri.tiledMapLayer("http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer", {
    zIndex: 1
});*/

//高得地图
NZ.cfg.gaodeilayer = L.tileLayer('http://{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
    subdomains: ["webrd01", "webrd02", "webrd03", "webrd04"],
    zIndex: 1
});
//mapabc
NZ.cfg.mapabclayer = L.tileLayer('http://{s}.mapabc.com/mapabc/maptile?&x={x}&y={y}&z={z}', {
    subdomains: ["emap1", "emap2", "emap3"],
    zIndex: 1
});
NZ.cfg.minilayer = L.tileLayer("imgmap/{z}/{x}/{y}.png", {
    zIndex: 1
});


NZ.cfg.hospitallayer = new L.TileLayer.WMS("http://58.215.196.78:8088/geoserver/cite/wms", { 
            maxZoom: 10, 
            layers: "cite:hospital", 
            format: "image/png", 
            transparent: true 
        }); 
NZ.cfg.baseLayers = {
    "自有": NZ.cfg.chinalayer,
    "高德": NZ.cfg.gaodeilayer
};
NZ.cfg.overlayMaps = {
    "医院": NZ.cfg.hospitallayer
        
};
NZ.cfg.layerControl = L.control.layers(NZ.cfg.baseLayers,NZ.cfg.overlayMaps);

NZ.cfg.miniMap = new L.Control.MiniMap(NZ.cfg.minilayer, { toggleDisplay: true });

