
NZ.namespace("NZ.cfg");
//坐标定位
NZ.cfg.City = {
    name: '天津',
    lon: 117.1939,
    lat: 39.125,
    zoom: 10
},

NZ.cfg.chinalayer = L.esri.tiledMapLayer("http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer", {
    zIndex: 1
});

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
NZ.cfg.minilayer = L.esri.tiledMapLayer("http://cache1.arcgisonline.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer", {
    zIndex: 1
});

NZ.cfg.xsdynLayer = L.esri.dynamicMapLayer("http://58.215.196.78:6080/arcgis/rest/services/njt/MapServer", {
    opacity: 1,
    layers: [0]
});
NZ.cfg.gxdynLayer = L.esri.dynamicMapLayer("http://58.215.196.78:6080/arcgis/rest/services/njt/MapServer", {
    opacity: 1,
    layers: [1]
});
NZ.cfg.wxdynLayer = L.esri.dynamicMapLayer("http://58.215.196.78:6080/arcgis/rest/services/njt/MapServer", {
    opacity: 1,
    layers: [2]
});
NZ.cfg.baseLayers = {
    "自有": NZ.cfg.chinalayer,
    "高德": NZ.cfg.gaodeilayer
};
NZ.cfg.overlayMaps = {
    "维修点": NZ.cfg.wxdynLayer,
    "销售商": NZ.cfg.xsdynLayer,
    "供销社": NZ.cfg.gxdynLayer
        
};
NZ.cfg.layerControl = L.control.layers(NZ.cfg.baseLayers, NZ.cfg.overlayMaps);

NZ.cfg.miniMap = new L.Control.MiniMap(NZ.cfg.minilayer, { toggleDisplay: true });

