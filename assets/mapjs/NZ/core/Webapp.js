/* This program is free software: you can redistribute it and/or
   modify it under the terms of the GNU Lesser General Public License
   as published by the Free Software Foundation, either version 3 of
   the License, or (at your option) any later version.
   
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
   
   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>. 
*/

NZ.namespace("NZ.core");

NZ.core.Webapp = NZ.Class({

    map     : null,
    
    modules : [ ],
    moduleMenu : null,
    
    activeModule : null,
    
    widgetManager   : null,
    infoWidgets     : { },

    
    urlParams : null,

    initialize : function() {


        // misc. housekeeping
        
        if(typeof console == 'undefined') console = { log: function(str) {} };
        $.support.cors = true;
        var this_ = this;
        



        // init url params
        this.urlParams = { };
        var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1);

        while (match = search.exec(query))
            this.urlParams[decode(match[1])] = decode(match[2]);
            
        
        // init siteUrl, if necessary
        
        if(typeof NZ.config.siteUrl === 'undefined') {
            NZ.config.siteUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
        }
            
        // Set Debug options
        if (this.urlParams.debug === 'false') {
            NZ.debug.disable();
        } else if (NZ.config.debug || this.urlParams.debug === 'true' || window.localStorage['NZDebug'] === 'true') {
            NZ.debug.enable();
        } else if (this.urlParams.debug === 'false') {
            NZ.debug.disable();
        }


        
        // create the Webapp-owned objects
   
        this.widgetManager = new NZ.widgets.WidgetManager();
        
        // create the info widgets and links along header bar
        
        if(NZ.config.infoWidgets !== undefined && NZ.config.infoWidgets.length > 0) {
            var nav = $('<nav id="main-menu" role="article">').appendTo('#headernav');
            var ul = $('<ul>').appendTo(nav);
            
            for(var i=0; i<NZ.config.infoWidgets.length; i++) {
            
                if(NZ.config.infoWidgets[i] == undefined) continue;
    
                var id = "NZ-infoWidget-"+i;            
                
                var options = {};
                if(_.has(NZ.config.infoWidgets[i], 'title')) options.title = NZ.config.infoWidgets[i].title;
                if(_.has(NZ.config.infoWidgets[i], 'cssClass')) options.cssClass = NZ.config.infoWidgets[i].cssClass;
                
                this.infoWidgets[id] = new NZ.widgets.InfoWidget(NZ.config.infoWidgets[i].styleId,
                                                                  this, options, NZ.config.infoWidgets[i].content);
                
                $("<li id='"+id+"'><a href='#'>"+NZ.config.infoWidgets[i].title+"</a></li>").appendTo(ul).click(function(e) {
                    e.preventDefault();
                    var widget = this_.infoWidgets[this.id];
                    if(!widget.isOpen) widget.show();
                    widget.bringToFront();
                });
            
            }
        }



        // initialize the modules 
        
        if(this.urlParams['module'])
            console.log("startup module: "+this.urlParams['module'])
        if(NZ.config.modules) {
            var setDefault = false, defaultModule = null;
            for(var i=0; i<NZ.config.modules.length; i++) {
                var modConfig = NZ.config.modules[i];
                var modClass = this.stringToFunction(modConfig.className);
                var id =  modConfig.id || 'module'+i;
                var options = modConfig.options || {}; 
                var module = new modClass(this, id, options);
                if(modConfig.defaultBaseLayer) module.defaultBaseLayer = modConfig.defaultBaseLayer;
                
                var isDefault = false;
                if(_.has(this.urlParams, 'module') && this.urlParams['module'] === module.id) {
                    isDefault = setDefault = true;
                }
                if(modConfig.isDefault) {
                    if(!_.has(this.urlParams, 'module')) isDefault = true;
                    defaultModule = module;
                }
                    
                this.addModule(module, isDefault);//modConfig.isDefault || false);
            }
            if(_.has(this.urlParams, 'module') && !setDefault) {
                console.log("NZ module with id="+this.urlParams['module']+" not found");
                if(defaultModule) {
                    //this_.activeModule = defaultModule;
                    //console.log("init active module: "+ defaultModule);
                    this.setActiveModule(defaultModule);
                }
            }
        }                

        // create the module selector
        
        if(NZ.config.showModuleSelector && this.modules.length > 1) {

            var selector = $('<select id="NZ_moduleSelector"></select>').appendTo('#branding');
            for(i in this.modules) {
                var module = this.modules[i];
                var option = $('<option'+(module == this_.activeModule ? ' selected' : '')+'>'+module.moduleName+'</option>').appendTo(selector);
            }        
            selector.change(function() {
                this_.setActiveModule(this_.modules[this.selectedIndex]);
            });
                       
        }
        
        
        // add the spinner
        
       /* $(Mustache.render(NZ.templates.img, {
            src: 'images/spinner.gif',
            wrapDiv: true,
            divId: 'NZ-spinner'
        }));*/
                
        // retrieve a saved trip, if applicable
        //if(window.location.hash !== "")
        //  NZ.util.DataStorage.retrieve(window.location.hash.replace("#", ""), this.activeModule);
            
        
    },
    
    addModule : function(module, makeActive) {
        makeActive = typeof makeActive !== 'undefined' ? makeActive : false;
        this.modules.push(module);
        if(makeActive) {
            this.setActiveModule(module);
        }
    },
    
    loadedTemplates: {}, 

    setActiveModule : function(module) {
        var this_ = this;
        //console.log("set active module: "+module.moduleName);
        if(this.activeModule != null) {
            this.activeModule.deselected();
            
            for(var i = 0; i < this.activeModule.widgets.length; i++) {
                this.activeModule.widgets[i].hide();
            }
        }
        
        $('#NZ_toptitle').html(module.moduleName);
        
        for(var i = 0; i < module.widgets.length; i++) {
            if(module.widgets[i].isOpen) {
                console.log(" - showing widget: "+module.widgets[i].id);
                module.widgets[i].show();
            }
        }        
        
        if(!module.activated) {        
            if(module.templateFiles && module.templateFiles.length > 0) {
                var loadedTemplateCount = 0;
                for(var i = 0; i < module.templateFiles.length; i++) {
                    var templateFile = module.templateFiles[i];
                    if(templateFile in this.loadedTemplates) { // template loaded already
                        loadedTemplateCount++;
                        if(loadedTemplateCount === module.templateFiles.length) this_.activateModule(module);
                    }
                    else {
                        $.get(NZ.config.resourcePath + 'js/' + templateFile)
                        .success(_.bind(function(data) {
                            $('<div style="display:none;"></div>').appendTo($("body")).html(data);
                            ich.grabTemplates();
                            this.webapp.loadedTemplates[this.templateFile] = true;
                            loadedTemplateCount++;
                            if(loadedTemplateCount === module.templateFiles.length) this_.activateModule(module);
                        }, { webapp: this, templateFile: templateFile }));
                    }
                }
            }
            else {
                this.activateModule(module);
            }         
        }
        else {
            this.moduleSelected(module);
        }

    },
    
    activateModule : function(module) {
        module.activate();
        if(_.has(this.urlParams, 'module') && this.urlParams.module == module.id) module.restore();
        this.moduleSelected(module);
        module.activated = true;
    },
    
    moduleSelected : function(module) {
        module.selected();
        this.map.activeModuleChanged(this.activeModule, module);    
        this.activeModule = module;
        var moduleIndex = this.modules.indexOf(this.activeModule);
        $('#NZ_moduleSelector option:eq('+moduleIndex+')').prop('selected', true);
    },
          
          
    hideSplash : function() {
        $("#splash-text").hide();
        for(widgetId in this.infoWidgets) {
            this.infoWidgets[widgetId].hide();
        }
    },
        
    setBounds : function(bounds)
    {
        this.map.lmap.fitBounds(bounds);
    },
        
   
    mapClicked : function(event) {
        $(this.moduleMenu).hide();
        this.hideSplash();
        this.activeModule.handleClick(event);
    },
    
    mapBoundsChanged : function(event) {
        if(this.activeModule) this.activeModule.mapBoundsChanged(event);
    },
    
    addWidget : function(widget) {
        //this.widgets.push(widget);
        this.widgetManager.addWidget(widget);
    },
    
    getWidgetManager : function() {
        return this.widgetManager;
    },
    
    // TODO: move to Util library
    
    stringToFunction : function(str) {
        var arr = str.split(".");

        var fn = (window || this);
        for(var i = 0, len = arr.length; i < len; i++) {
            fn = fn[arr[i]];
        }

        if(typeof fn !== "function") {
            throw new Error("function not found");
        }

        return  fn;
    },

    CLASS_NAME : "NZ.core.Webapp"
});

