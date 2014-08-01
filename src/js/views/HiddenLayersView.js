define(
    /**
     @exports HiddenLayersView
     @author Alexandre Masselot
     @author Kiran Mukhyala
     @copyright 2013,  Bioinformatics & Computational Biology Department, Genentech Inc.
     */
    ['underscore', 'backbone', 'd3', 'pviz/collections/FeatureLayerCollection', 'pviz/services/IconFactory'], function (_, bb, d3, FeatureLayerCollection, iconFactory) {
        /**
         * HiddenLayersView the minimized FeatureLayer.
         * @constructor
         * @param {Map} options
         * @param {d3Element} options.container
         * @augments Backbone.View
         */
        var HiddenLayersView = bb.View.extend(/** @lends module:HiddenLayersView~HiddenLayersView.prototype */{
            initialize: function (options) {
                var self = this;
                self.options = options;

                self.model = new FeatureLayerCollection(options.layers);
                self.model.bind('change', function () {
                    self.render()
                });

                self.container = options.container;

                var g = self.container.append('g').attr('class', 'hidden-layers');
                self.g = g

                var gbuts = g.selectAll('g.one-hidden-layer').data(self.model.models).enter().append('g').attr('class', 'one-hidden-layer').style('display', 'none');

                //function of layer hidden...

                gbuts.append('rect').attr('class', 'button').attr('height', 20).attr('rx', 5).attr('ry', 5);
                gbuts.append('text').text(function (layer) {
                    return layer.get('name')
                }).attr('y', 11).attr('x', 4);

                var gih = gbuts.append('g').attr('class', 'icon-holder');
                gih.each(function () {
                    iconFactory.append(d3.select(this), 'view', 20)
                });
                gbuts.on('mousedown', function (l) {
                    l.set('visible', true);
                })

                self.gbuts = gbuts;
                self.render();
            },

            /**
             * rendering: we push on x the blocks if the button is to be displayed
             */
            render: function () {
                var self = this;
                var xPlus = 33;

                self.gbuts.style('display', function (l) {
                    return l.get('visible') ? 'none' : null;
                });

                var allLength = [];
                self.gbuts.selectAll('text').each(function (d, i) {
                    allLength.push(d3.select(this).node().getComputedTextLength() + xPlus);
                });

                var j = 0
                self.gbuts.selectAll('rect.button').attr('width', function (l) {
                    return allLength[j++] - 4;
                });

                j = 0
                self.gbuts.selectAll('g.icon-holder').attr('transform', function (l) {
                    return 'translate(' + (allLength[j++] - 27) + ',0)';
                })
                var tot = 0;
                self.gbuts.attr('transform', function (l, i) {
                    var r = 'translate(' + tot + ',0)';
                    if (!l.get('visible')) {
                        tot += allLength[i];
                    }
                    return r
                })
            },
            /**
             *
             * @return {number}
             */
            height: function () {
                return 1;
            }
        });
        return HiddenLayersView;
    });
