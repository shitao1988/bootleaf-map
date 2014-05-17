/** 
 * Copyright(C) 2010-2011  All Rights Reserved.                               
 * Project: <FileUpload>
 * Module ID: <0001>
 * Comments: <类描述>                                                      
 * Author: shitao        
 * Create Date：2012 10 25 13:59:37
 * Modified By: shitao                                
 * Modified Date: 2012 10 25 13:59:37                                   
 * Why & What is modified: <修改原因描述>    
 * Version: V1.0                  
 */

NZ.namespace("NZ.util");

NZ.util.OlUtil = {


    /**
     * @Title: compress
     * @Description: 
     * @param  points
     * @param  precision   
     * @return String    
     * @throws
     */
    compress: function (points, precision) {

        var oldLat = 0, oldLng = 0, len = points.length, index = 0;
        var encoded = '';
        precision = Math.pow(10, precision);
        while (index < len) {
            // Round to N decimal places
            var lat = Math.round(points[index++] * precision);
            var lng = Math.round(points[index++] * precision);

            // Encode the differences between the points
            encoded += encodeNumber(lat - oldLat);
            encoded += encodeNumber(lng - oldLng);

            oldLat = lat;
            oldLng = lng;
        }
        return encoded;
    },

    /**
     * @Title: createEncodings
     * @Description: 折现编码 
     * @param  points 点数组
     * @param  precision 精度
     * @return String    
     * @throws
     */
    createEncodings: function (points, precision) {
        var i, dlng;
        var len = points.length;
        var plat = 0;
        var plng = 0;
        var encodedPoints = "";
        precision = Math.pow(10, precision);
        for (i = 0; i < len ; i++) {

            var point = points[i];
            var lat = Math.floor(point.x * precision);
            var lng = Math.floor(point.y * precision);
            encodedPoints += this.encodeNumber(lat - plat) +
              this.encodeNumber(lng - plng);
            plat = lat;
            plng = lng;

        }
        return encodedPoints;
    },
    /**
     * @Title: decompress
     * @Description: 
     * @param  encoded
     * @param  precision    
     * @return Array    
     * @throws
     */
    decompress: function (encoded, precision) {
        precision = Math.pow(10, -precision);
        var len = encoded.length, index = 0, lat = 0, lng = 0, array = [];
        while (index < len) {
            var b, shift = 0, result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;
            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;
            array.push(lat * precision);
            array.push(lng * precision);
        }
        return array;
    },




    /**
     * 
     * @Title: encodeNumber
     * @Description: 
     * @param  num
     * @return String    
     * @throws
     */
    encodeNumber: function (num) {
        num = num << 1;
        if (num < 0) {
            num = ~(num);
        }
        var encoded = '';
        while (num >= 0x20) {
            encoded += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
            num >>= 5;
        }
        encoded += String.fromCharCode(num + 63);
        return encoded;
    },
    /**
     * 
     * @Title: encoded_polyline_converter
     * @Description: 反折现编码
     * @return OpenLayers.Geometry.LineString
     * @throws
     */
    encoded_polyline_converter: function (n) {

        var lat = 0;
        var lon = 0;

        var strIndex = 0;
        var points = new Array();

        while (strIndex < n.length) {

            var rLat = this.decodeSignedNumberWithIndex(n, strIndex);
            lat = lat + rLat.number * 1e-5;
            strIndex = rLat.index;

            var rLon = this.decodeSignedNumberWithIndex(n, strIndex);
            lon = lon + rLon.number * 1e-5;
            strIndex = rLon.index;

            var p = new OpenLayers.Geometry.Point(lat, lon);
            points.push(p);
        }

        return new OpenLayers.Geometry.LineString(points);
    },

    decodeSignedNumber: function (value) {
        var r = this.decodeSignedNumberWithIndex(value, 0);
        return r.number;
    },

    decodeSignedNumberWithIndex: function (value, index) {
        var r = this.decodeNumberWithIndex(value, index);
        var sgnNum = r.number;
        if ((sgnNum & 0x01) > 0) {
            sgnNum = ~(sgnNum);
        }
        r.number = sgnNum >> 1;
        return r;
    },

    thisdecodeNumber: function (value) {
        var r = this.decodeNumberWithIndex(value, 0);
        return r.number;
    },

    decodeNumberWithIndex: function (value, index) {

        if (value.length == 0)
            throw "string is empty";

        var num = 0;
        var v = 0;
        var shift = 0;

        do {
            v1 = value.charCodeAt(index++);
            v = v1 - 63;
            num |= (v & 0x1f) << shift;
            shift += 5;
        } while (v >= 0x20);

        return { "number": num, "index": index };
    }


 

};