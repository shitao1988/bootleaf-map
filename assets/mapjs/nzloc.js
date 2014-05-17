
NZ.namespace("NZ.Map");
NZ.Map.nzloc = {
    loclayer: L.featureGroup(), //GPS图层
    templayer: null,//临时图层
    currentclxxbh: null,
    selectedFeature: null,//当前选中的要素
    selectControl: null,
    tempGeom: null,
    features: [],
    fea: null,
    map: null,

    initialize: function() {
        this.map = NZ.Map.locmap;
        this.loclayer.addTo(this.map);

    },
    
    zoomToLoc:function(lt,lg,name){
        var tmpfea = L.marker([lt*1, lg*1], { icon: L.AwesomeMarkers.icon({ icon: 'cog', prefix: 'fa', markerColor: 'red' }) });
        var  content = "<table class='table table-striped table-bordered table-condensed'>" +
              "<tr><th>名称</th><td>" + name + "</td></tr>" +
              "<table>";
        tmpfea.bindPopup(content);
        NZ.Map.nzloc.loclayer.addLayer(tmpfea);
        this.map.setView([lt * 1, lg * 1], 16);
    },

    zoomToOrgLoc: function (lt, lg, name, contact, location) {
        if (lt != 0.0 || lg != 0.0) {
            var tmpfea = L.marker([lt * 1, lg * 1], { title: name, icon: L.AwesomeMarkers.icon({ icon: 'cog', prefix: 'fa', markerColor: 'red' }) });
            var content = "<table class='table table-striped table-bordered table-condensed'>" +
            "<tr><th>名称</th><td>" + name + "</td></tr>" +
            "<tr><th>联系人</th><td>" + contact + "</td></tr>" +
            "<tr><th>地址</th><td>" + location + "</td></tr>" +
            "</table>";
            tmpfea.bindPopup(content);
            NZ.Map.nzloc.loclayer.addLayer(tmpfea);
            this.map.setView([lt * 1, lg * 1], 16);
        }
        else {
            this.map.setView([39.125, 117.1939], 13);
        }

    },


    zoomToRepLoc: function (lt, lg, name, contact, location, range, leve) {
        if (lt != 0.0 || lg != 0.0) {
            var tmpfea = L.marker([lt * 1, lg * 1], { title: name, icon: L.AwesomeMarkers.icon({ icon: 'cog', prefix: 'fa', markerColor: 'red' }) });
            var content = "<table class='table table-striped table-bordered table-condensed'>" +
            "<tr><th>名称</th><td>" + name + "</td></tr>" +
            "<tr><th>地址</th><td>" + location + "</td></tr>" +
            "<tr><th>法人</th><td>" + contact + "</td></tr>" +
            "<tr><th>维修范围</th><td>" + range + "</td></tr>" +
            "<tr><th>维修级别</th><td>" + leve + "</td></tr>" +
            "</table>";
            tmpfea.bindPopup(content);
            NZ.Map.nzloc.loclayer.addLayer(tmpfea);
            this.map.setView([lt * 1, lg * 1], 16);
        }
        else {
            this.map.setView([39.125, 117.1939], 13);
        }

    },

    zoomToDealerLoc: function (lt, lg, name, saleTel, location) {
    if (lt != 0.0 || lg != 0.0) {
        var tmpfea = L.marker([lt * 1, lg * 1], { title: name, icon: L.AwesomeMarkers.icon({ icon: 'cog', prefix: 'fa', markerColor: 'red' }) });
        var content = "<table class='table table-striped table-bordered table-condensed'>" +
            "<tr><th>名称</th><td>" + name + "</td></tr>" +
            "<tr><th>联系方式</th><td>" + saleTel + "</td></tr>" +
            "<tr><th>地址</th><td>" + location + "</td></tr>" +
            "</table>";
        tmpfea.bindPopup(content);
        NZ.Map.nzloc.loclayer.addLayer(tmpfea);
        this.map.setView([lt * 1, lg * 1], 16);
    }
    else {
        this.map.setView([39.125, 117.1939], 13);
    }

}
}