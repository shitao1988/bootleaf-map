/**                             
 * Project: <FileUpload>
 * Module ID: <0001>
 * Comments: <类描述>                                                      
 * Author: shitao        
 * Create Date：2012 11 6 10:11:00
 * Modified By: shitao                                
 * Modified Date: 2012 11 6 10:11:00                                   
 * Why & What is modified: <修改原因描述>    
 * Version: V1.0                  
 */
L.Control.Panel = L.Control.extend({
    options: {
        position: 'topright', //初始位置
        title: '标题'
    },
    initialize: function(placeholder, options) {
        L.Util.extend(this.options, options);
        // Find content container
        var content = L.DomUtil.get(placeholder);
        // Remove the content container from its original parent
        content.parentNode.removeChild(content);

        //创建一个class为leaflet-control-panel的div
        this._bcontainer = L.DomUtil.create('div', 'leaflet-control-panel');
        this._container = L.DomUtil.create('div', 'portlet box blue');
        this._titlecontainer = L.DomUtil.create('div', 'portlet-title');
        this._titlecaption = L.DomUtil.create('div', 'caption');
        this._bodycontainer = L.DomUtil.create('div', 'portlet-body');
        this._bodycontainer.appendChild(content);

        this._titletools = L.DomUtil.create('div', 'tools');
        this._ttoolsremove = L.DomUtil.create('a', 'remove');
        this._ttoolscollapse = L.DomUtil.create('a', 'collapse');
        this._titlecaptionico = L.DomUtil.create('i', 'icon-reorder');     
       

    },



    onAdd: function (map) {
       
        this._bcontainer.appendChild(this._container);
       
        if (this.options.content!=null) {
           
        }

        this._titlecontainer.appendChild(this._titletools);
        this._titletools.appendChild(this._ttoolscollapse);
        this._titletools.appendChild(this._ttoolsremove);
        this._titlecontainer.appendChild(this._titlecaption);
       
        this._titlecaption.textContent = this.options.title;
        this._titlecaption.appendChild(this._titlecaptionico);
        
        this._container.appendChild(this._titlecontainer);
        this._container.appendChild(this._bodycontainer);
        //注册关闭事件
      //  L.DomEvent.addListener(this._ttoolsremove, 'click', this._onCloseControl, this);
        
        // Make sure we don't drag the map when we interact with the content
        var stop = L.DomEvent.stopPropagation;
        L.DomEvent
            .on(this._bcontainer, 'click', stop)
            .on(this._bcontainer, 'mousedown', stop)
            .on(this._bcontainer, 'touchstart', stop)
            .on(this._bcontainer, 'dblclick', stop)
            .on(this._bcontainer, 'mousewheel', stop)
            .on(this._bcontainer, 'MozMousePixelScroll', stop);
        
       
        return this._bcontainer;
    },

    getContainer: function () {
        return this._bodycontainer;
    },

    setContent: function (content) {
        this.getContainer().innerHTML = content;
        return this;
    }
});


NZ.namespace("NZ.Map");

NZ.Map.RoutingB = {

    backinglayer: L.featureGroup(), //GPS图层
    templayer: null,//临时图层
    currentclxxbh: null,
    sVichID: null,//当前选中的要素
    selectControl: null,
    tempGeom: null,
    features: [],
    fea:null,
    map: null,

    initialize: function () {
        this.map = NZ.Map.map;
      //  var rbpanel = new L.Control.Panel('routingback', {
      //      title: '轨迹回放'
      //  });
      ////  rbpanel.setContent("1233333333333333333333333333");
      //  this.map.addControl(rbpanel);
      //   $(".leaflet-control-panel").draggable();

        this.initTree();
       

        var vichsidebar = L.control.sidebar('vichsidebar', {
            closeButton: false,
            position: 'right'
        });
        this.map.addControl(vichsidebar);
        vichsidebar.show();
        vichsidebar.on('show', function () {


        });

        vichsidebar.on('hide', function () {

        });
        
       
    },


    initTree: function () {
        var setting = {
            check: {
                enable: true,
                chkStyle: "radio",
                radioType: "all"
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onRightClick: OnRightClick,
                onCheck: onCheck
            }
        };
        function OnRightClick(event, treeId, treeNode) {

        }
        function onCheck(e, treeId, treeNode) {
            NZ.Map.RoutingB.sVichID = treeNode.id;
            $("#vichSel").attr("value", treeNode.name);
        }
        $("#vichSel").attr("value", "");
        $.get("/Organization/OrgInfoJson", { method: "GET", chkDisabled: true }, function (msg) {
            $.fn.zTree.init($("#treeDemo"), setting, msg);
            setting.check.chkboxType = { "Y": "ps", "N": "ps" };
        });
    },
    
    queryRoutes: function () {
        var id = NZ.Map.RoutingB.sVichID;
        var begintime = $('#begintime').val();
        var endtime = $('#endtime').val();
        if (id==null) {
            alert("请选择车辆！");
            return;
        }
        if (begintime.length==0) {
            alert("请设定开始时间！");
            return;
        }
        if (endtime.length == 0) {
            alert("请设定结束时间！");
            return;
        }
        NZ.Map.RoutingB.map.spin(true);
        $.ajax({ url: '/MapView/RoutingGps', type: "GET", data: { msid: id, begintime: begintime, endtime: endtime } })
            .done(function (msg) {
                NZ.Map.RoutingB.map.spin(false);
                var demoTracks = msg;
                if (demoTracks.geometry.coordinates.length>0) {
                    var playback = new L.Playback(NZ.Map.RoutingB.map, demoTracks);
                    NZ.Map.RoutingB.map.fitBounds(playback.tracksLayer.layer.getBounds());
                } else {
                    alert("没有查询到结果");
                }
                
            })
            .error(function (msg) {
                NZ.Map.RoutingB.map.spin(false);
            });

    },
        /**
     * 定位到报警点
     * @param id
     */
    setViewToPosition: function (fid) {
     

    },

    updatePosiOnMap: function () {
       
    },

    delPosiOnMap: function (posiId) {
        //this.vlayer.removeFeatures( this.vlayer.getFeatureByFid( mid ) );
    },

    delAllPosisOnMap: function (posijson) {
        //this.vlayer.removeFeatures( this.vlayer.getFeatureByFid( fid ) );
    },
    /**
     * 添加点到地图
     * @Title: addAllPosisToMap
     * @Description: TODO
     * @param posijson    
     * @return void    
     * @throws
     */
    addAllnzpointsToMap: function (posijson) {
        
    },
    /**
   * 添加点到地图
   * @Title: addAllPosisToMap
   * @Description: TODO
   * @param posijson    
   * @return void    
   * @throws
   */
    addnzpointsToMap: function (lat,lon) {
      
       
    },
    /**
     * @param feature
     */
    onFeatureUnselect: function (feature) {
       
    },
    /**
     * Popup关闭事件
     * @param evt
     */
    onPopupClose: function (evt) {
       
    },

    /**
     * @Title: showQtip2
     * @Description: 弹框显示报警信息
     * @param  feature    
     * @return void    
     * @throws
     */
    showQtip2: function (feature) {
        

    },

    /**
     * @Title: showIntvelBnzpointPopup
     * @Description: 黑名单报警信息框
     * @param  nzpoint    
     * @return void    
     * @throws
     */
    showIntvelBnzpointPopup: function (nzpoint) {
        


    },
    /**
     * @Title: showIntvelnzpointPopup
     * @Description: 
     * @param    
     * @return void   
     * @throws
     */
    showIntvelSnzpointPopup: function (nzpoint) {
       



    },


    hideQtip2: function (olEvent) {
        
    },

    CLASS_NAME: "NZ.Map.nzpoint"
};