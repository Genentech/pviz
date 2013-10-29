/*
 a singleton that handles all what is needed to actually display the features

 Copyright (c) 2013, Genentech Inc.
 All rights reserved.

 Authors: Alexandre Masselot, Kiran Mukhyala, Bioinformatics & Computational Biology, Genentech

 */
define(['jQuery', 'underscore', 'backbone', 'd3', './TypedDisplayer'], function($, _, Backbone, d3, typedDisplayer) {

  /**
   * display array of features passed as d3selection.
   *
   */
  var FeatureDisplayer = function() {
    var self = this;

    self.positioners = {};
    self.appenders = {};

    self.mouseoverCallBacks = {};
    self.mouseoutCallBacks = {};
    self.clickCallBacks = {};

    typedDisplayer.init(self);
    self.trackHeightPerCategoryType = {};
  }
  /**
   * that's the way to register other maner of displying info thatn mere
   * rectangle
   */
  FeatureDisplayer.prototype.setCustomHandler = function(type, mFct) {
    var self = this;
    if (_.isArray(type)) {
      _.each(type, function(t) {
        self.setCustomHandler(t, mFct)
      })
      return self;
    }
    self.appenders[type] = mFct.appender
    self.positioners[type] = mFct.positioner

    self.addMouseoverCallback(type, mFct.mouseoverCallback)
    self.addMouseoutCallback(type, mFct.mouseoutCallback)
    self.addClickCallback(type, mFct.clickCallback)

    return self
  }

  FeatureDisplayer.prototype.addMouseoverCallback = function(name, fct) {
    var self = this;

    if (fct) {
      if (_.isArray(name)) {
        _.each(name, function(n) {
          self.addMouseoverCallback(n, fct)
        })
        return self;
      }
    }
    self.mouseoverCallBacks[name] = fct;
    return self;
  }

  FeatureDisplayer.prototype.addMouseoutCallback = function(name, fct) {
    var self = this;

    if (fct) {
      if (_.isArray(name)) {
        _.each(name, function(n) {
          self.addMouseoutCallback(n, fct)
        })
        return self;
      }
    }
    self.mouseoutCallBacks[name] = fct;
    return self;
  }

  FeatureDisplayer.prototype.addClickCallback = function(name, fct) {
    var self = this;

    if (fct) {
      if (_.isArray(name)) {
        _.each(name, function(n) {
          self.addClickCallback(n, fct)
        })
        return self;
      }
    }
    self.clickCallBacks[name] = fct;
    return self;
  }

  FeatureDisplayer.prototype.append = function(viewport, svgGroup, features) {
    var self = this;

    _.chain(features).groupBy(function(ft) {
      return ft.type;
    }).each(function(ftGroup, type) {
      var sel = (self.appenders[type] || defaultAppender)(viewport, svgGroup, ftGroup, type)
      sel.attr('fttype', type)
      self.position(viewport, sel, ftGroup)
    });

    var allSel = svgGroup.selectAll(".feature.data")
    allSel.on('mouseover', function(ft) {
      self.callMouseoverCallBacks(ft)
    })
    allSel.on('mouseout', function(ft) {
      self.callMouseoutCallBacks(ft)
    })
    allSel.on('click', function(ft) {
      self.callClickCallBacks(ft);
    })
    return allSel
  }

  FeatureDisplayer.prototype.callMouseoverCallBacks = function(ft) {
    var self = this;
    if (self.mouseoverCallBacks[ft.type] !== undefined) {
      self.mouseoverCallBacks[ft.type](ft)
    }
  }

  FeatureDisplayer.prototype.callMouseoutCallBacks = function(ft) {
    var self = this;
    if (self.mouseoutCallBacks[ft.type] !== undefined) {
      self.mouseoutCallBacks[ft.type](ft)
    }
  }
  FeatureDisplayer.prototype.callClickCallBacks = function(ft) {
    var self = this;
    if (self.clickCallBacks[ft.type] !== undefined) {
      self.clickCallBacks[ft.type](ft)
    }
  }
  var defaultAppender = function(viewport, svgGroup, features, type) {
    var sel = svgGroup.selectAll("rect.feature.data." + type).data(features).enter().append("g").attr("class", "feature data " + type);
    sel.append("rect").attr('class', 'feature');
    sel.append("rect").attr('class', 'feature-block-end').attr('fill', 'url(#grad_endFTBlock)');

    sel.append("text").attr('y', viewport.scales.y(0.5)).attr('x', 2);

    return sel
  }

  FeatureDisplayer.prototype.position = function(viewport, sel) {
    var self = this;
    _.chain(sel[0]).map(function(s) {
      return s.attributes.fttype.nodeValue;
    }).unique().each(function(type) {
      (self.positioners[type] || defaultPositioner)(viewport, sel.filter(function(ft) {
        return ft.type == type
      }))
    });

    return sel
  }
  /**
   * return the height factory associated with
   */
  FeatureDisplayer.prototype.heightFactor = function(o) {
    if ( o instanceof Object) {
      return this.heightFactor(o.type || o.name)
    }

    return this.trackHeightPerCategoryType[o] || 1
  }
  /**
   * refresh posiiton, font size ... at init or after zooming
   *
   * @param {Object}
   *          viewport
   * @param {Object}
   *          d3selection
   */
  // FeatureDisplayer.prototype.position = function(viewport, d3selection) {
  var defaultPositioner = function(viewport, d3selection) {
    var hFactor = singleton.heightFactor(d3selection[0][0].__data__.category);
    // var yscale=singleton.trackHeightFactorPerCategory[]

    d3selection.attr('transform', function(ft) {
      return 'translate(' + viewport.scales.x(ft.start - 0.45) + ',' + hFactor * viewport.scales.y(0.12 + ft.displayTrack) + ')';
    });
    var ftWidth = function(ft) {
      return viewport.scales.x(ft.end + 0.9) - viewport.scales.x(ft.start + 0.1)
    }
    d3selection.selectAll("rect.feature").attr('width', ftWidth).attr('height', hFactor * viewport.scales.y(0.76));
    d3selection.selectAll("rect.feature-block-end").attr('width', 10).attr('x', function(ft) {
      return ftWidth(ft) - 10;
    }).style('display', function(ft) {
      return (ftWidth(ft) > 20) ? null : 'none';
    }).attr('height', viewport.scales.y(hFactor * 0.76));

    var fontSize = 9 * hFactor;
    // self.fontSizeLine();
    var selText = d3selection.selectAll("text");
    selText.text(function(ft) {
      var text = (ft.text !== undefined) ? ft.text : ft.type;
      var w = viewport.scales.x(ft.end + 0.9) - viewport.scales.x(ft.start);
      if (w <= 5 || text.length == 0) {
        return '';
      }
      var nchar = Math.floor(w / fontSize * 1.6);
      if (nchar >= text.length)
        return text;
      if (nchar <= 2)
        return '';
      return text.substr(0, nchar);
    }).style('font-size', fontSize);
    return d3selection
  }
  var singleton = new FeatureDisplayer();

  return singleton;
});
