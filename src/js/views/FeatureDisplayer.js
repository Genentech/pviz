/*
 a singleton that handles all what is needed to actually display the features

 Copyright (c) 2013, Genentech Inc.
 All rights reserved.

 Authors: Alexandre Masselot, Kiran Mukhyala, Bioinformatics & Computational Biology, Genentech

 */
define(['jquery', 'underscore', 'backbone', 'd3', './TypedDisplayer', '../utils/GGplot2Adapter'], function($, _, Backbone, d3, typedDisplayer, ggplot2Adapter) {

    /**
     * display array of features passed as d3selection.
     *
     */
    var FeatureDisplayer = function() {
        var self = this;

        self.positioners = {};
        self.appenders = {};
        self.categoryPlots ={};

        self.mouseoverCallBacks = {};
        self.mouseoutCallBacks = {};
        self.clickCallBacks = {};

        typedDisplayer.init(self);
        self.trackHeightPerCategoryType = {};
        self.strikeoutCategory = {}
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

        //add hirizontal line if needed for thecategory

        var curCat = _.chain(features).pluck('category').uniq().value()[0];
        if (self.strikeoutCategory[curCat]) {
            var maxTrack = _.chain(features).pluck('displayTrack').max().value();
            var g = svgGroup.append('g').attr('class', 'strikeout');
            var hFactor = self.heightFactor(curCat);

            for (var i = 0; i <= maxTrack; i++) {
                var y = viewport.scales.y((i + 0.5)) * hFactor;
                g.append('line').attr('x1', -100).attr('x2', 10000).attr('y1', y).attr('y2', y);
            }
        }

        //append the feature
        _.chain(features).groupBy(function(ft) {
            return ft.type;
        }).each(function(ftGroup, type) {
                var sel = (self.appenders[type] || defaultAppender)(viewport, svgGroup, ftGroup, type)
                self.position(viewport, sel, ftGroup);
            });

        //register call back event handlers
        var allSel = svgGroup.selectAll(".feature.data")
        allSel.on('mouseover', function(ft) {
            self.callMouseoverCallBacks(ft, this)
        })
        allSel.on('mouseout', function(ft) {
            self.callMouseoutCallBacks(ft, this)
        })
        allSel.on('click', function(ft) {
            self.callClickCallBacks(ft, this);
        });

        return allSel
    }

    FeatureDisplayer.prototype.callMouseoverCallBacks = function(ft, el) {
        var self = this;
        if (self.mouseoverCallBacks[ft.type] !== undefined) {
            self.mouseoverCallBacks[ft.type](ft, el)
        }
    }

    FeatureDisplayer.prototype.callMouseoutCallBacks = function(ft, el) {
        var self = this;
        if (self.mouseoutCallBacks[ft.type] !== undefined) {
            self.mouseoutCallBacks[ft.type](ft, el)
        }
    }
    FeatureDisplayer.prototype.callClickCallBacks = function(ft, el) {
        var self = this;
        if (self.clickCallBacks[ft.type] !== undefined) {
            self.clickCallBacks[ft.type](ft, el)
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

        var ftIsNotPloted = _.filter(sel.data(), function(e){
            return self.categoryPlots[e.category] === undefined;
        });

        _.chain(ftIsNotPloted).map(function(s) {
            return s.type;
        }).unique().each(function(type) {
                (self.positioners[type] || defaultPositioner)(viewport, sel.filter(function(ft) {
                    return ft.type == type
                }))
            });

        var selPlot = sel.filter(function(ft){
            return self.categoryPlots[ft.category] !== undefined
        });//
        self.categoryPlotPosition(viewport, selPlot)
        return sel;
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
     * you can register a cetgory to have a strikeout line.
     * Some people love it
     */

    FeatureDisplayer.prototype.setStrikeoutCategory = function(cat) {
        this.strikeoutCategory[cat] = true;
    };

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

    /**
     *
     * @param cat: category name
     * @param opts: the plot definitions
     */
    FeatureDisplayer.prototype.setCategoryPlot = function(cat, opts) {
        var _this = this;
        //define default values
        var plot = _.extend({
            height: 100,
            ylim: [-1, 1],
            shape: 1,
            scale:'linear',
            y:0,
            shape:1,
            size:10,
            fillPalette:'Paired:12',
            fill:1,
            colorPalette:'Paired:12',
            color:1,
            lwd:1,
            opacity:0.7
        }, opts);

        plot._y = d3.scale[plot.scale]().domain(plot.ylim).range([plot.height,0]);

        var afCol = plot.fillPalette.split(':');
        var fPalette = ggplot2Adapter.discrete_palettes[afCol[0]][afCol[1]];
        plot._fill = _.isFunction(plot.fill)?(function(ft){
            var v = plot.fill(ft);
            if(_.isNumber(v) && v>fPalette.length){
                return '#444';
            }
            return _.isNumber(v)?fPalette[v-1]:v;
        }):(_.isNumber(plot.fill)?fPalette[plot.fill-1]:plot.fill);

        var acCol = plot.colorPalette.split(':');
        var cPalette = ggplot2Adapter.discrete_palettes[acCol[0]][acCol[1]];
        plot._color = _.isFunction(plot.color)?(function(ft){
            var v = plot.color(ft);
            if(_.isNumber(v) && v>cPalette.length){
                return '#111';
            }
            return _.isNumber(v)?cPalette[v-1]:v;
        }):(_.isNumber(plot.color)?cPalette[plot.color-1]:plot.color);

        plot._shape = _.isFunction(plot.shape)?(function(ft){
            return ggplot2Adapter.shapePaths[plot.shape(ft)];
        }):ggplot2Adapter.shapePaths[plot.shape];

        plot._lwd = _.isFunction(plot.lwd)?(function(ft){
            return plot.lwd(ft)+'px';
        }):plot.lwd+'px';


        _this.categoryPlots[cat]=plot;

    };

    /**
     *
     * @param cat
     */
    FeatureDisplayer.prototype.isCategoryPlot = function(cat) {
        var _this = this;
        return _this.categoryPlots[cat] !== undefined;
    };

    FeatureDisplayer.prototype.getCategoryPlot = function(cat){
        return this.categoryPlots[cat];
    };

    /**
     *
     * @param cat
     * @param viewport
     * @param svgGroup
     * @param features
     */
    FeatureDisplayer.prototype.categoryPlotAppend = function(cat, viewport, svgGroup, features) {
        var _this = this;

        var plot = _this.categoryPlots[cat];
        var g = svgGroup.append('g').attr('class', 'plot');
        var sel = svgGroup.selectAll("g._plot-point").data(features).enter().append("g").attr('class', 'feature data _plot-point').attr('category', cat);


        sel.style('opacity', plot.opacity);
        var path = sel.append('path').attr('d',plot._shape).style('fill', plot._fill).style('stroke', plot._color).style('stroke-width', plot._lwd).attr('vector-effect', 'non-scaling-stroke');


       _.isFunction(plot.size)?(function(ft){
            return ggplot2Adapter.shapePaths[plot.shape](ft);
        }):ggplot2Adapter.shapePaths[plot.shape];

        _this.categoryPlotPosition(viewport, sel);
        return sel;
    };

    /**
     *
     * @param cat
     * @param d3selection
     */
    FeatureDisplayer.prototype.categoryPlotPosition = function(viewport, d3selection) {
        var _this = this;

        d3selection.attr('transform', function(ft) {
            var plot = _this.categoryPlots[ft.category];

            var fty = plot.y;
            var y=_.isFunction(fty)?fty(ft):fty;

            ftsize = plot.size;
            var s=_.isFunction(ftsize)?ftsize(ft):ftsize;
            return 'translate(' + (viewport.scales.x(ft.pos)) + ',' + plot._y(y) + '),scale('+s+')';

        });

    };

    var singleton = new FeatureDisplayer();
    return singleton;
});
