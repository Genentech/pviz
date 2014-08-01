define(
    /**
     @exports OneLiner
     @author Alexandre Masselot
     @author Kiran Mukhyala
     @copyright 2013,  Bioinformatics & Computational Biology Department, Genentech Inc.
     */

    ['jquery', 'underscore', 'backbone', 'd3', 'text!pviz_templates/seq-entry-annot-interactive.html'], function ($, _, bb, d3, tmpl) {
        /**
         * @class OneLiner view are PositionedFeatures displayed on a non interactive super simplified icon-like view
         * @constructor
         * @param {Map} options
         * @param {Array} options.categories [optional] a limited list of categories to be plot. Each of them will be on a different line on the view
         * @augments Backbone.View
         */
        var OneLiner = bb.View.extend(/** @lends module:OneLiner~OneLiner.prototype */{
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
            /**
             * @private
             * @return {categories}
             */
            categories: function () {
                return this.options.categories;
            },
            /**
             * @private
             * @return a d3.scale
             */
            xscale: function () {
                var self = this;
                return d3.scale.linear().domain([0, self.model.length()]).range([0, $(self.el).width()])
            },
            /**
             * @private
             */
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
            /**
             * build the actual widget in its specified container (el)
             */
            render: function () {
                var self = this;
                var x = self.xscale()
                self.svg.selectAll('rect').attr('x', function (ft) {
                    return x(ft.start)
                }).attr('width', function (ft) {
                    return x(ft.end - ft.start + 1)
                }).attr('y', function (ft) {
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
        });
        return OneLiner;

    });
