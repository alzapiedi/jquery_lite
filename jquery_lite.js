(function () {
  window.$l = function (input) {
    var nodeCollection;
    var callbacks = [];
    if (typeof input === "string") {
      nodeCollection = document.querySelectorAll(input);
      nodeCollection = [].slice.call(nodeCollection);
    } else if (input instanceof HTMLElement) {
      nodeCollection = [input];
    } else if (typeof input === "function") {
      callbacks.push(input);
      document.addEventListener( 'DOMContentLoaded', function () {
        for(var i = 0; i < callbacks.length; i++) {
          callbacks[i].call(callbacks[i]);
        }
      }, false );

    }
    return new DOMNodeCollection(nodeCollection);
  };

  window.$l.extend = function () {
    var first = arguments[0];
    var objects = [].slice.call(arguments, 1);
    for (var i = 0; i < objects.length; i++) {
      var keys = Object.getOwnPropertyNames(objects[i]);
      for (var j = 0; j < keys.length; j++) {
        first[keys[j]] = objects[i][keys[j]];
      }
    }
  };

  window.$l.ajax = function (options) {
    var defaults = {
      success: function (data) {
        console.log(data);
      },
      error: function () {
        console.log("error occurred");
      },
      url: document.URL,
      data: "",
      method: 'GET',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
    };


    window.$l.extend(defaults, options);
    var xhReq = new XMLHttpRequest();
    xhReq.open(options.method, options.url, false);
    xhReq.send(options.data);
    var serverResponse = xhReq.responseText;
    if (xhReq.status === 200) {
      options.success.call(null, serverResponse);
    }
    else {
      options.error.call(null);
    }

  };



  var DOMNodeCollection = function (htmlElements) {
    this.htmlElements = htmlElements;
  };

  DOMNodeCollection.prototype.html = function (content) {
    if (typeof content === "undefined") {
      return this.htmlElements[0].innerHTML;
    } else {
      for (var i = 0; i < this.htmlElements.length; i++) {
        this.htmlElements[i].innerHTML = content;
      }
    }
  };

  DOMNodeCollection.prototype.empty = function () {
    for (var i = 0; i < this.htmlElements.length; i++) {
      this.htmlElements[i].innerHTML = "";
    }
  };

  DOMNodeCollection.prototype.append = function (item) {
    if (item instanceof DOMNodeCollection) {
      for (var i = 0; i < this.htmlElements.length; i++) {
        for (var j = 0; j < item.htmlElements.length; j++) {
          this.htmlElements[i].innerHTML += item.htmlElements[j].outerHTML;
        }
      }
    } else if (item instanceof HTMLElement) {
      for (var i = 0; i < this.htmlElements.length; i++) {
        this.htmlElements[i].innerHTML += item.outerHTML;
      }
    } else if (typeof item === "string") {
      for (var i = 0; i < this.htmlElements.length; i++) {
        this.htmlElements[i].innerHTML += item;
      }
    }
  };

  DOMNodeCollection.prototype.attr = function (key, value) {
    if (typeof value === "undefined") {
      for (var i = 0; i < this.htmlElements.length; i++) {
        try {
          return this.htmlElements[i].attributes[key].nodeValue;
        } catch (e) {
          break;
        }
      }
    } else {
      for (var i = 0; i < this.htmlElements.length; i++) {
        var node = this.htmlElements[i].setAttribute(key, value);
      }
    }
  };

  Array.prototype.delete = function (el) {
    var newArray = [];
    for (var i = 0; i < this.length; i++) {
      if (!(this[i] === el)) {
        newArray.push(this[i]);
      }
    }
    return newArray;
  };

  DOMNodeCollection.prototype.addClass = function (className) {
    for (var i = 0; i < this.htmlElements.length; i++) {
      var currClass = this.htmlElements[i].getAttribute("class");
      if (currClass === null) {
        this.htmlElements[i].setAttribute("class", className);
      } else {
        this.htmlElements[i].setAttribute("class",
          currClass + " " + className);
      }
    }
  };

  DOMNodeCollection.prototype.removeClass = function (className) {
    for (var i = 0; i < this.htmlElements.length; i++) {
      if (className === undefined) {
        this.htmlElements[i].removeAttribute("class");
      } else {
        if (this.htmlElements[i].hasAttribute("class")) {
          var currClass = this.htmlElements[i].getAttribute("class");
          currClass = currClass.split(" ").delete(className).join(" ");
          if (currClass.length === 0) {
            this.htmlElements[i].removeAttribute("class");
          } else {
            this.htmlElements[i].setAttribute("class", currClass);
          }
        }
      }
    }
  };


  DOMNodeCollection.prototype.children = function () {
    var arrayOfNodes = [];
    for (var i = 0; i < this.htmlElements.length; i++) {
      for (var j = 0; j < this.htmlElements[i].children.length; j++) {
        arrayOfNodes.push(this.htmlElements[i].children[j]);
      }
    }
    return new DOMNodeCollection(arrayOfNodes);
  };

  DOMNodeCollection.prototype.parent = function () {
    var arrayOfNodes = [];
    for (var i = 0; i < this.htmlElements.length; i++) {
      var parent = this.htmlElements[i].parentNode;
      if (!arrayOfNodes.includes(parent)) {
        arrayOfNodes.push(parent);
      }
    }
    return new DOMNodeCollection(arrayOfNodes);
  };


  DOMNodeCollection.prototype.find = function (selector) {
    var result = [];
    var nodes;
    for (var i = 0; i < this.htmlElements.length; i++) {
      nodes = this.htmlElements[i].querySelectorAll(selector);
      for (var j = 0; j < nodes.length; j++) {
        result.push(nodes[j]);
      }
    }
    return new DOMNodeCollection(result);
  };

  DOMNodeCollection.prototype.remove = function () {
    for (var i = 0; i < this.htmlElements.length; i++) {
      this.htmlElements[i].outerHTML = "";
    }
    this.htmlElements = [];
  };

  DOMNodeCollection.prototype.on = function (type, listener) {
    for (var i = 0; i < this.htmlElements.length; i++) {
      this.htmlElements[i].addEventListener(type, listener);
    }
  };

  DOMNodeCollection.prototype.off = function (type, listener) {
    for (var i = 0; i < this.htmlElements.length; i++) {
      this.htmlElements[i].removeEventListener(type, listener);
    }
  };

})();
