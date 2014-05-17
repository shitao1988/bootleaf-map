(function (factory) {
    // Packaging/modules magic dance
    var L;
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['leaflet'], factory);
    } else if (typeof module !== 'undefined') {
        // Node/CommonJS
        L = require('leaflet');
        module.exports = factory(L);
    } else {
        // Browser globals
        if (typeof window.L === 'undefined')
            throw 'Leaflet must be loaded first';
        factory(window.L);
    }
}(function (L) {
    'use strict';
    L.Control.PanZoomBar = L.Control.extend({

        options: {
            position: 'topleft'
        },

        onAdd: function (map) {

            var container = L.DomUtil.create("div", "leaflet-control-pan-zoom");

            this._pan = new L.Control.Pan();
            container.appendChild(this._pan.onAdd(map));

            this._zoomSlider = new L.Control.Zoomslider();
            container.appendChild(this._zoomSlider.onAdd(map));

            return container;

        },

        onRemove: function (map) {

            this._pan.onRemove(map);
            this._zoomSlider.onRemove(map);

        }

    });

    L.Map.mergeOptions({
        PanZoomBar: false
    });

    L.Map.addInitHook(function () {
        if (this.options.PanZoomBar) {
            this.panZoomBar = new L.Control.PanZoomBar();
            this.addControl(this.panZoomBar);
        }
    });

    L.control.panZoomBar = function (options) {
        return new L.Control.PanZoomBar(options);
    };

    return L.Control.PanZoomBar;
}));
