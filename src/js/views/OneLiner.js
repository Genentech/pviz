/**
 * OneLiner project all feature on  a non-zoomable, monochromatic icon
 *
 * it is possible to add a categories:[...] option in the constructor to retain only certain category and bet them fisplay in one sub line of the icon
 *
 * Copyright (c) 2013, Genentech Inc.
 * Authors: Alexandre Masselot, Kiran Mukhyala, Bioinformatics & Computational Biology
 */
define(['jquery', 'underscore', 'backbone', 'd3', 'text!pviz_templates/seq-entry-annot-interactive.html'], function ($, _, bb, d3, tmpl) {
    return bb.View.extend({
        initialize: function (options) {
            var self = this;
            self.options = options;

            self.height = 16;

            self.svg = d3.select(self.el).append("svg").attr("width", '100%').attr('height', self.height).attr('class', 'pviz one-liner');
            self.svg.append('line').attr('x1', 0).attr('x2', '100%').attr('y1', self.height / 2).attr('y2', self.height / 2);

            self.update();
            self.listenTo(self.model, 'change', function () {
                self.update();
                self.render();
            });

        },
        categories: function () {
            return this.options.categories;
        },
        xscale: function () {
            var self = this;
            return d3.scale.linear().domain([0, self.model.length()]).range([0, $(self.el).width()])
        },
        update: function () {
            var self = this;
            self.svg.selectAll("rect").remove();

            var features = self.model.get('features');

            var cat2line = {}
            _.each(self.categories(), function (c, i) {
                cat2line[c] = i
            })
            self.cat2line = cat2line;
            var features = _.filter(features, function (ft) {
                return (self.categories() === undefined) || (cat2line[ft.category] !== undefined)
            })

            self.rectangles = self.svg.selectAll('rect').data(features).enter();

            self.rectangles.append('rect').attr('height', (self.categories() ? (self.height / self.categories().length) : self.height))
        },

        render: function () {
            var self = this;
            var x = self.xscale()
            self.svg.selectAll('rect').attr('x',function (ft) {
                return x(ft.start)
            }).attr('width',function (ft) {
                return x(ft.end - ft.start + 1)
            }).attr('y',function (ft) {
                if (self.categories()) {
                    return self.cat2line[ft.category] * self.height / self.categories().length
                } else {
                    return 0
                }
            }).attr('class', function (ft) {
                if (self.categories() === undefined)
                    return '';
                return 'subline-' + self.cat2line[ft.category]
            });
        }
    })

});
