define(
    /**
     @exports FeatureLayerView
     @author Alexandre Masselot
     @author Kiran Mukhyala
     @copyright 2013,  Bioinformatics & Computational Biology Department, Genentech Inc.
     */

    ['underscore', 'backbone', 'pviz/services/IconFactory', './FeatureDisplayer'], function (_, bb, iconFactory, featureDisplayer) {
        /**
         * @class  FeatureLayerView handles the view of one feature layer
         * @constructor
         * @param {Map} options
         * @param {String} options.clipper a reference to a svg clip-path
         * @param {d3Element} options.container
         * @param {SeqEntryViewport} options.viewport
         * @param {String} options.layerMenu defines the layerMenu behavior (default is 'sticky', can be 'minimize')
         * @augments Backbone.View
         */
        var FeatureLayerView = bb.View.extend(/** @lends module:FeatureLayerView~FeatureLayerView.prototype */{
            initialize: function (options) {
                var self = this;

                options = options || {}
                self.options = options;

                self.clipper = self.options.clipper;

                _.each(['container', 'viewport'], function (n) {
                    self[n] = self.options[n];
                    delete self.options[n];
                })
                self.options.layerMenu = self.options.layerMenu || 'sticky';


                self.build(options);
            },
            /**
             * build the layer at once
             * @return {FeatureLayerView}
             */
            build: function () {
                var self = this;

                var g = self.container.insert("g").attr("id", self.model.get('id') || self.model.get('.name')).attr('class', 'layer');

                if (self.options.cssClass) {
                    g.classed(self.options.cssClass, true)
                }
                ;
                self.g = g;
                self.gFeatures = g.append('g').attr('clip-path', 'url(' + self.clipper + ')');

                if (self.options.layerMenu && self.options.layerMenu !== 'off') {
                    self.p_build_menu(self.options.layerMenu === 'minimize');
                    if (self.options.categorySeparator && self.gMenu) {
                        self.gMenu
                            .append('g')
                            .attr('class', 'category-separator')
                            .append('line')
                            .attr('x1', self.viewport.scales.x(0))
                            .attr('x2', self.viewport.scales.x(self.viewport.length))
                            .attr('y1', 0)
                            .attr('y2', 0)
                            .attr('class', 'category-separator-line ' + self.options.groupSetName + ' ' + self.options.cssClass);
                    }
                }
                return self;
            },
            /**
             * Builds the layer menu (if any)
             * @private
             * @param isMinimizable
             * @return {FeatureLayerView}
             */
            p_build_menu: function (isMinimizable) {
                var self = this;

                if (self.model.get('name') === 'sequence')
                    return;

                if (isMinimizable) {
                    self.g.append("rect").attr('class', 'layer-background').attr('height', self.viewport.scales.y(self.height()) + 2).attr('width', self.viewport.dim.width)
                }
                var menuWidth = 50;
                self.gMenu = self.g.append("g").attr('class', 'layer-menu').attr('transform', 'translate(0, -13)');

                if (isMinimizable) {
                    rect = self.gMenu.append('rect').attr('height', 25).attr('class', 'layer-background layer-menu-background').attr('rx', 5).attr('ry', 5);
                }
                var t = self.gMenu.append('text').attr('class', 'layer-category').text(self.model.get('name')).attr('y', 2).attr('x', 7);
                var w = t.node().getComputedTextLength();

                if (isMinimizable)
                    rect.attr('width', w + 50);

                self.gMenuButtons = self.gMenu.append("g").attr('class', 'buttons').attr('transform', 'translate(' + (w + 15) + ', -2)');

                if (isMinimizable) {
                    var ic = iconFactory.append(self.gMenuButtons, 'noview', 20);
                    ic.on('mousedown', function () {
                        self.model.set('visible', false);
                    });
                    self.hideMenu();

                    self.g.on('mouseover', function () {
                        self.showMenu()
                    });
                    self.g.on('mouseout', function () {
                        self.hideMenu()
                    });
                }

                return self;
            },
            /**
             * private
             * @return {FeatureLayerView}
             */
            hideMenu: function () {
                this.gMenu.style('display', 'none');
                return this;
            },
            /**
             * private
             * @return {FeatureLayerView}
             */
            showMenu: function () {
                this.gMenu.style('display', null);
                return this;
            },
            /**
             * Get the height of this FeatureLayer
             * @return {Number}
             */
            height: function () {
                var _this = this;
                if (_this.model.get('isPlot')) {
                    return featureDisplayer.getCategoryPlot(this.model.get('category')).height;
                }
                return this.model.get('nbTracks') * featureDisplayer.heightFactor(this.model.attributes);

            }

        });

        return FeatureLayerView;
    });
