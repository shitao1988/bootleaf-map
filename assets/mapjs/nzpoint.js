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

NZ.namespace("NZ.Map");

NZ.Map.nzpoint = {
    gpslayer: L.featureGroup(), //GPS图层
    templayer: null,//临时图层
    currentclxxbh: null,
    selectedFeature: null,//当前选中的要素
    selectControl: null,
    tempGeom: null,
    features: [],
    fea: null,
    map: null,
    widgetManager: null,
    
    initialize: function() {
        this.map = NZ.Map.map;
        this.gpslayer.addTo(this.map);
      
        var vichsidebar = L.control.sidebar('vichsidebar', {
            closeButton: false,
            position: 'right'
        });
        this.map.addControl(vichsidebar);
        vichsidebar.show();
        vichsidebar.on('show', function() {


        });

        vichsidebar.on('hide', function() {

        });
        this.initTree();
        this.updatePosiOnMap();
    },

    /**
     * 定位到报警点
     * @param id
     */
    setViewToPosition: function(fid) {


    },

    initTree: function() {
        var setting = {
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onRightClick: onRightClick,
                onCheck: onCheck
            }
        };

        function onRightClick(event, treeId, treeNode) {

        }

        function onCheck(e, treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj(treeId);
            var content;
            if (treeNode.children) {
                var nodes = treeNode.children;
                for (var i = 0, l = nodes.length; i < l; i++) {
                    var tmpfea;
                    if (nodes[i].checked == true) {
                        tmpfea = L.marker([39.119856, 117.19775], {
                            icon: L.icon({

                                iconUrl: '../../Content/mapjs/tractor.png',
                                iconSize: [38, 30],
                            })
                        });
                        tmpfea.fid = nodes[i].id;
                        content = "<table class='table table-striped table-bordered table-condensed'>" +
                            "<tr><th>纬度</th><td>" + 117.19775 + "</td></tr>" +
                            "<tr><th>经度</th><td>" + 39.119856 + "</td></tr>" +
                            "<tr><th>定位时间</th><td>" + NZ.Map.nzpoint.formatDate(new Date()) + "</td></tr>" +
                            "<table>";
                        tmpfea.bindPopup(content);
                        NZ.Map.nzpoint.gpslayer.addLayer(tmpfea);
                    } else {
                        tmpfea = NZ.Map.nzpoint.gpslayer.getFeatureByFid(nodes[i].id);
                        NZ.Map.nzpoint.gpslayer.removeLayer(tmpfea);
                    }

                }
            }
            else {
                if (treeNode.checked == true) {
                    tmpfea = L.marker([39.119856, 117.19775], {
                        icon: L.icon({

                            iconUrl: '../../Content/mapjs/tractor.png',
                            iconSize: [38, 30],
                        })
                    });
                    tmpfea.fid = treeNode.id;
                    content = "<table class='table table-striped table-bordered table-condensed'>" +
                        "<tr><th>纬度</th><td>" + 117.19775 + "</td></tr>" +
                        "<tr><th>经度</th><td>" + 39.119856 + "</td></tr>" +
                        "<tr><th>定位时间</th><td>" + NZ.Map.nzpoint.formatDate(new Date()) + "</td></tr>" +
                        "<table>";
                    tmpfea.bindPopup(content);
                    NZ.Map.nzpoint.gpslayer.addLayer(tmpfea);
                } else {
                    tmpfea = NZ.Map.nzpoint.gpslayer.getFeatureByFid(treeNode.id);
                    NZ.Map.nzpoint.gpslayer.removeLayer(tmpfea);
                }
            }
          
        
        }

        $.get("/Organization/OrgInfoJson", { method: "GET", chkDisabled: false }, function (msg) {
            $.fn.zTree.init($("#treeDemo"), setting, msg);
            setting.check.chkboxType = { "Y": "ps", "N": "ps" };
        });
    },
        //格式化日期,
    formatDate: function(date, format) {
        var paddNum = function(num) {
            num += "";
            return num.replace(/^(\d)$/, "0$1");
        }; //指定格式字符
        var cfg = {
            yyyy: date.getFullYear() //年 : 4位
            ,
            yy: date.getFullYear().toString().substring(2)//年 : 2位
            ,
            M: date.getMonth() + 1  //月 : 如果1位的时候不补0
            ,
            MM: paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
            ,
            d: date.getDate()   //日 : 如果1位的时候不补0
            ,
            dd: paddNum(date.getDate())//日 : 如果1位的时候补0
            ,
            hh: date.getHours()  //时
            ,
            mm: date.getMinutes() //分
            ,
            ss: date.getSeconds() //秒
        };
        format || (format = "yyyy-MM-dd hh:mm:ss");
        return format.replace(/([a-z])(\1)*/ig, function(m) { return cfg[m]; });
    },
    
    updatePosiOnMap: function () {
        // Reference the auto-generated proxy for the hub.  
        var gpsHub = $.connection.gpsHub;
        // Create a function that the hub can call back to display messages.
        gpsHub.client.sendMessage = function (gps) {
            var content='';
            var tmpfea = NZ.Map.nzpoint.gpslayer.getFeatureByFid(gps.MSID);
            if (tmpfea) {
                tmpfea.attributes = gps;
                tmpfea.setIcon(L.icon({
                    iconUrl: '../../Content/mapjs/tractor.png',
                    iconSize: [38, 30],
                }));
                content = "<table class='table table-striped table-bordered table-condensed'>" +
                                                          "<tr><th>纬度</th><td>" + tmpfea.attributes.lt + "</td></tr>" +
                                                          "<tr><th>经度</th><td>" + tmpfea.attributes.lg + "</td></tr>" +
                                                          "<tr><th>定位时间</th><td>" + NZ.Map.nzpoint.formatDate(new Date()) + "</td></tr>" +
                                                      "<table>";
                tmpfea.setPopupContent(content);
                tmpfea.setLatLng(new L.LatLng(gps.lt, gps.lg));
            }

        };
        $.connection.hub.start().done(function () {
            gpsHub.server.send();
        });
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