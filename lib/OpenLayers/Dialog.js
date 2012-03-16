/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/BaseTypes/Class.js
 */


/**
 * Class: OpenLayers.Dialog
 */
OpenLayers.Dialog = OpenLayers.Class({
    
    exclusive: true,
    
    buttons: ["close"],
    
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
        if (this.exclusive) {
            OpenLayers.Dialog.closeAll();
        }
        this.initLayout();
        this.updateContent(this.content);
        OpenLayers.Dialog.instances.push(this);
    },
    
    initLayout: function() {
        var container = document.createElement("div");
        container.className = "olDialog";
        container.style.zIndex = this.map.Z_INDEX_BASE.Popup;
        this.container = container;
        var contentWrapper = document.createElement("div");
        contentWrapper.className = "olDialogContentWrapper";
        container.appendChild(contentWrapper);
        this.contentWrapper = contentWrapper;
        this.addButtons();
        var contentEl = document.createElement("div");
        contentEl.className = "olDialogContent";
        contentWrapper.appendChild(contentEl);
        this.contentEl = contentEl;
    },
    
    addButtons: function() {
        var buttonWrapper = document.createElement("div");
        buttonWrapper.className = "olDialogButtonWrapper";
        var name, config, button, dialogButtons = {};
        for (var i=0, ii=this.buttons.length; i<ii; ++i) {
            name = this.buttons[i];
            button = this.createButton(name);
            buttonWrapper.appendChild(button);
            dialogButtons[name] = this.createButton(name);
        }
        this.contentWrapper.appendChild(buttonWrapper);
        this.dialogButtons = dialogButtons;
    },
    
    createButton: function(name) {
        var config = OpenLayers.Dialog.buttons[name];
        if (!config) {
            throw new Error("Cannot find dialog button config: " + name);
        }
        var button = document.createElement("a");
        button.innerHTML = "&nbsp;";
        button.href = "#" + name;
        button.className = "olDialogButton olDialogButton_" + name;
        button.onclick = OpenLayers.Function.bind(config.onClick, this);
        return button;
    },
    
    updateContent: function(content) {
        if (content) {
            if (typeof content === "string") {
                this.contentEl.innerHTML = content;
            } else {
                this.contentEl.appendChild(content);
            }
        } else {
            this.contentEl.innerHTML = "";
        }
    },

    open: function() {
        var container = this.container;
        this.map.layerContainerDiv.appendChild(container);
        var xy = this.map.getLayerPxFromLonLat(this.location);
        container.style.left = xy.x + "px";
        container.style.top = xy.y + "px";
        // change CSS class name in next cycle to allow animation
        window.setTimeout(function() {
            OpenLayers.Element.addClass(container, "olDialogOpen");
        }, 0);
    },
    
    close: function() {
        OpenLayers.Element.removeClass(this.container, "olDialogOpen");
        this.map.layerContainerDiv.removeChild(this.container);
    },
    
    destroy: function() {
        this.close();
        for (var name in this.dialogButtons) {
            this.destroyButton(name);
        }
        delete this.container;
        OpenLayers.Util.removeItem(OpenLayers.Dialog.instances, this);
    },
    
    destroyButton: function(name) {
        var button = this.dialogButtons[name];
        if (button) {
            button.onclick = null;
            this.contentWrapper.removeChild(button);
            delete this.dialogButtons[name];
        }
    },
    

    CLASS_NAME: "OpenLayers.Dialog"
    
});

OpenLayers.Dialog.buttons = {
    close: {
        onClick: function() {
            this.close();
            return false;
        }
    }
};

OpenLayers.Dialog.instances = [];
OpenLayers.Dialog.closeAll = function() {
    for (var i=0, ii=OpenLayers.Dialog.instances.length; i<ii; ++i) {
        OpenLayers.Dialog.instances[i].close();
    }
};
