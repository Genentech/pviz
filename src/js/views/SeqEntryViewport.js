/*
 * Copyright (c) 2013, Genentech Inc.
 * Authors: Alexandre Masselot, Kiran Mukhyala, Bioinformatics & Computational Biology
 */
define(['jquery', 'underscore', 'backbone', 'd3'], function($, _, Backbone, d3) {
    var SeqEntryViewport = function(options) {
        var self = this;

        self.margins = _.extend({
            left : 0,
            right : 0,
            top : 0,
            bottom : 0
        })
        self.yShift = (options && options.yShift)

        for (n in options) {
            self[n] = options[n];
        };
        self.dim = {};
        self.computeDim();
        self.xBar = self.svg.insert('line').attr('class', 'x-bar').attr('x1', -1).attr('x2', -1).attr('y1', self.yShift).attr('y2', '100%');
        self.bgRect = self.svg.insert('rect').attr('width', '100%').attr('height', '100%').style('fill-opacity', '0').style('cursor', 'col-resize');

        self.rectLeft = self.svg.append('rect').attr('class', 'brush left').attr('x', 0).attr('y', self.yShift).attr('height', '100%').style('display', 'none')
        self.rectRight = self.svg.append('rect').attr('class', 'brush right').attr('x', 0).attr('y', self.yShift).attr('height', '100%').attr('width', '100%').style('display', 'none')
        self.svg.on('mousemove', function() {
            var i = d3.mouse(self.el[0])[0];
            self.setXBar(self.scales.x.invert(i))
            if (options.xChangeCallback) {
                options.xChangeCallback(self.scales.x.invert(i - 0.5), self.scales.x.invert(i) + 0.5)
            }
        });
        self.svg.on('mouseout', function() {
            self.xBar.style('display', 'none');
        }).on('mouseover', function() {
            self.xBar.style('display', null);
        })
        initBrush(self);
    }
    function initBrush(self) {
        var brush = d3.svg.brush().on("brushend", brushZoom);

        brush.on('brush', function() {
            self.setRect(brush.extent())
        })
        brush.x(self.scales.x);

        brush(self.bgRect)

        function brushZoom() {
            self.rectClear()
            var bounds = brush.extent();
            if(bounds[0]<0){
                bounds[0]=0;
            }
            if(bounds[1]>self.length-1){
                bounds[1]=self.length-1;
            }
            if (bounds[1] < bounds[0] + 0.3) {
                self.scales.x.domain([0, self.length - 1]);
            } else {
                self.scales.x.domain([Math.floor(bounds[0]), Math.ceil(bounds[1])]);
            }
            self.change();
            self.setXBar(self.scales.x.invert(d3.mouse(self.el[0])[0]));
        }

    }


    SeqEntryViewport.prototype.setXBar = function(x) {
        var self = this;
        var i = self.scales.x(x)
        self.xBar.attr('x1', i).attr('x2', i)

    }
    SeqEntryViewport.prototype.rectClear = function(i) {
        var self = this;
        self.rectLeft.style('display', 'none')
        self.rectRight.style('display', 'none')
    }
    SeqEntryViewport.prototype.setRect = function(xs) {
        var self = this;
        self.rectLeft.attr('width', self.scales.x(xs[0])).style('display', null)
        self.rectRight.attr('x', self.scales.x(xs[1])).style('display', null)

    }
    SeqEntryViewport.prototype.change = function() {
        var self = this;
        //xMax-xMin check makes sure we don't zoom to regions smaller than 4 AA
        //undefined check for zoomout
        // if (xMax - xMin > 3 || xMin == undefined) {
        // self.computeScaling({
        // xMin : xMin,
        // xMax : xMax
        // });
        // }
        var domain = self.scales.x.domain();
        if (domain[0] < 1)
            domain[0] = 0;
        if (domain[1] > self.length)
            domain[1] = self.length

        if (domain[1] - domain[0] < 4) {
            var d = 2 - (domain[1] - domain[0]) / 2;
            domain[0] -= d;
            domain[1] += d;
        }

        //console.log('b', domain)

        //console.log('c', domain)

        //self.scales.x.domain(domain)
        //console.log('d', self.scales.x.domain())
        self.scales.pxPerUnit = self.dim.width / (2 + self.length );
        self.scales.font = Math.min(0.9 * self.dim.width / (domain[1] - domain[0]), 20);

        self.changeCallback(self);
        //console.log('e', self.scales.x.domain())

    }
    /**
     * set svg dimenesion, pixel per unit (1 unit = 1 AA)
     * and adapt x/y scales not to be streched
     */
    SeqEntryViewport.prototype.computeDim = function() {
        var self = this;

        var w = $(self.el).width();
        if (w > 0) {
            self.dim.width = w;
        } else {
            w = $(document).width();
            self.dim.width = w;
        }
        var h = $(self.el).height();
        if (w > 0) {
            self.dim.height = h;
        } else {
            w = $(document).height();
            self.dim.height = h;
        }
        self.dim.innerWidth = self.dim.width - self.margins.left - self.margins.right;
        self.computeScaling()
    };

    SeqEntryViewport.prototype.computeScaling = function(options) {
        var self = this;
        if (options == undefined) {
            options = {};
        }
        var xMin = options.xMin || 0;
        var xMax = options.xMax || (self.length - 1);
        var lineHeight = 15;

        if (self.scales == undefined)
            self.scales = {};
        if (self.scales.x == undefined) {
            self.scales.x = d3.scale.linear().domain([xMin, xMax]).range([self.margins.left, self.dim.width - self.margins.right])
            console.log()
        } else {
            self.scales.x.domain([xMin, xMax]);
        }
        self.scales.y = d3.scale.linear().domain([0, 100]).range([0, lineHeight * 100]);
        self.scales.pxPerUnit = self.dim.width / (2 + self.length );
        self.scales.font = Math.min(0.9 * self.dim.width / (xMax - xMin), 20);
    };

    return SeqEntryViewport;

});
