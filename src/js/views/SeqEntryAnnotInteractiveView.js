define(
    /**
     @exports SeqEntryAnnotInteractiveView
     @author Alexandre Masselot
     @author Kiran Mukhyala
     @copyright 2013,  Bioinformatics & Computational Biology Department, Genentech Inc.
     */

    ['jquery', 'underscore', 'backbone', 'd3', 'pviz/services/FeatureManager', './FeatureDisplayer', './SeqEntryViewport', 'pviz/models/FeatureLayer', './FeatureLayerView', './HiddenLayersView', './DetailsPane', 'text!pviz_templates/seq-entry-annot-interactive.html'],
    function ($, _, Backbone, d3, featureManager, featureDisplayer, SeqEntryViewport, FeatureLayer, FeatureLayerView, HiddenLayersView, DetailsPane, tmpl) {
        /**
         * @class SeqEntryAnnotInteractiveView is the main interactive viewer for one SeqEntry
         * @constructor
         * @param {Map} options
         * @param {Number} options.marginLeft inner margin (default=20)
         * @param {Number} options.marginRight (default=20)
         * @param {Number} options.marginTop (default=25)
         * @param {Number} options.paddingCategory padding between categories (default=0)
         * @param {Number} options.paddingGroupSet padding between groupSet and first category (default=0)
         * @param {Function} options.xChangeCallback callback called whenever the x refence is changed (zooming)
         * @param {Function} options.selectCallback callback called whenever a selection is made. Returns all selected features (requires mode = 'select')
         * @param {Function} options.collapseCallback callback called whenever a group set is collapsed/expanded (requires options.collapsible = true)
         * @param {Boolean} options.noPositionBubble
         * @param {Boolean} options.hideAxis hide the position axis (default=false)
         * @param {Boolean} options.hideSequence hide the sequence (defaut=false)
         * @param {Boolean} options.collapsible collapsible groupSets (default=false)
         * @param {Boolean} options.oneOffFix correct one off problem (default=false)
         * @param {Array} options.categoryOrder an array of String specifying the order in which should appear the categories (unspecified one will appear alpha numerically sorted)
         * @param {String} options.layerMenu specify what type of menu is to be set on each category FeatureLayerView (default=sticky)
         * @augments Backbone.View
         */
        var SeqEntryAnnotInteractiveView = Backbone.View.extend(/** @lends module:SeqEntryAnnotInteractiveView~SeqEntryAnnotInteractiveView.prototype */{

            initialize: function (options) {
                var self = this;
                self.options = options;

                self.margins = {
                    left: options.marginLeft || 20,
                    right: options.marginRight || 20,
                    top: options.marginTop || 25
                };
                self.layers = [];
                self.layerViews = [];
                self.hide = {};

                self.paddingCategory = options.paddingCategory || 0;
                self.paddingGroupSet = options.paddingGroupSet || 0;

                self.bubbleSequenceNb = 4;
                self.clipperId = 'clipper_' + Math.round(100000 * Math.random());
                if (self.options.collapsible) {
                    self.collapserSize = 15;
                    var collapserHalfWidth = self.collapserSize / 2.0;
                    var collapserHalfHeight = ((Math.sqrt(3.0) / 2.0) * self.collapserSize) / 2.0;
                    self.collapseTriangle =
                        ''  + (-collapserHalfWidth) + ',' + (-collapserHalfHeight) +
                        ' ' + (0) + ',' + (collapserHalfHeight) +
                        ' ' + (collapserHalfWidth) + ',' + (-collapserHalfHeight);
                    self.collapseCallback = options.collapseCallback;
                }

                $(self.el).empty();
                var el = $(tmpl);
                $(self.el).append(el)

                self.components = {
                    features: el.find('#feature-viewer'),
                    details: el.find('#details-viewer')
                }

                self.svg = d3.select(self.components.features[0]).append("svg").attr("width", '100%').attr("height", '123').attr('class', 'pviz');
                self.p_setup_defs();

                var rectBg = self.svg.insert("rect").attr("class", 'background').attr('width', '100%').attr('height', '100%');
                self.groupSetBackgroundGroup = self.svg.append('g').attr('class','groupSetBackgroundGroup');

                var xChangeCallbacks = [];
                if (options.xChangeCallback) {
                    xChangeCallbacks.push(options.xChangeCallback);
                }

                /*
                 * add the callback to set the aabubble position and text (if needed)
                 */
                if (!options.noPositionBubble) {
                    xChangeCallbacks.push(function (i0, i1) {
                        var gbubbles = self.svg.selectAll('g.axis-bubble');
                        if (self.viewport.scales.font > 10) {
                            gbubbles.style('display', 'none');
                            self.svg.select('line.sequence-bg').style('display', 'none');
                            return
                        }
                        self.svg.select('line.sequence-bg').style('display', null);

                        var imid = (i0 + i1) / 2;
                        var xscales = self.viewport.scales.x;
                        if (imid < xscales.domain()[0] || imid > xscales.domain()[1]) {
                            gbubbles.style('display', 'none');
                            return;

                        }
                        gbubbles.style('display', null);
                        if (self.gPosBubble) {
                            self.gPosBubble.selectAll('text').text(Math.round(imid + 1));
                        }

                        if (self.gAABubble) {
                            var ic0 = Math.round(imid) - self.bubbleSequenceNb;
                            var ic1 = Math.round(imid) + self.bubbleSequenceNb;
                            var subseq = self.model.get('sequence').substring(ic0, ic1 + 1);

                            var ts = self.gAABubble.selectAll('text.subseq').data(subseq.split(''));
                            ts.exit().remove();
                            ts.enter().append("text").attr('class', 'subseq');
                            ts.text(function (d) {
                                return d;
                            }).attr('x', function (t, i) {
                                var d = Math.abs(i - 4);
                                return (i - self.bubbleSequenceNb) * 10 / (1 + d * 0.1)
                            }).style('font-size', function (t, i) {
                                var d = Math.abs(i - 4);
                                return '' + (120 * (0.2 + 0.2 * (4 - d))) + '%';
                            }).attr('y', -3);
                        }

                        //                  gbubble.selectAll('text.subseq').data(subseq.split(''));
                        gbubbles.attr('transform', 'translate(' + xscales(imid) + ',10)');
                    });

                }
                self.viewport = new SeqEntryViewport({
                    el: self.components.features,
                    svg: self.svg,
                    length: self.model.length(),
                    margins: self.margins,
                    selectCallback: self.options.selectCallback,
                    changeCallback: function (vp) {
                        self.p_positionText(vp, self.svg.selectAll('text.data'));
                        featureDisplayer.position(vp, self.svg.selectAll('g.data'));

                        if (!options.hideAxis)
                            self.updateAxis();
                        // self.p_positionText(vp, self.svg.selectAll('text.data').transition()).duration(1);
                        // featureDisplayer.position(vp, self.svg.selectAll('g.data').transition()).duration(1);
                    },
                    xChangeCallback: xChangeCallbacks,
                    oneOffFix: options.oneOffFix
                });

                self.drawContainer = self.svg.append('g');
                //.attr('transform', 'translate(' + self.margins.left + ',' + self.margins.top + ')');
                self.axisContainer = self.drawContainer.append('g').attr('class', 'axis')
                //var yshiftScale = options.hideAxis ? 0 : 20;

                self.layerContainer = self.drawContainer.append('g').attr('class', 'layers');

                self.detailsPane = new DetailsPane({
                    el: self.components.details
                })

                self.update()
                if (!options.hideAxis)
                    self.updateAxis();

                self.listenTo(self.model, 'change', self.update)
                window.addEventListener('resize', function() {
                    self.resize();
                });

            },
            /**
             * called for window resize: recompute dimensions and refresh the whole view
             */
            resize: function () {
                var self = this;
                // compute new x scale
                var saveXScale = self.viewport.scales.x;
                self.viewport.scales = undefined;
                self.viewport.computeDim();
                self.viewport.setMode(self.viewport.mode);
                self.viewport.scales.x.domain(saveXScale.domain());
                // redraw
                self.viewport.change();
                if (!self.options.hideAxis) {
                    self.updateAxis();
                }
                var xRight = ($(self.el).width() || $(document).width()) - self.margins.right;
                self.clipPath.attr('d', 'M' + (self.margins.left - 15) + ',-100L' + (xRight + 15) + ',-100L' + (xRight + 15) + ',20000L' + (self.margins.left - 15) + ',20000');
                // restore bubble positions
                var gbubbles = self.svg.selectAll('g.axis-bubble');
                gbubbles.each(function(d,i) {
                    var gbubble = d3.select(this);
                    var transform = gbubble.attr('transform');
                    if (transform) {
                        var xTranslate = transform.substring('translate('.length,transform.indexOf(','));
                        var newX = self.viewport.scales.x(saveXScale.invert(parseInt(xTranslate)));
                        gbubble.attr('transform','translate(' + newX + ',10)');
                    }
                });
                // resize brush
                self.viewport.resizeBrush();
                // fix separator lines
                d3.selectAll('.category-separator-line')
                    .attr('x2', self.viewport.scales.x(self.viewport.length));
            },
            /**
             * @private
             */
            updateAxis: function () {
                var self = this;

                var vpXScale = self.viewport.scales.x;
                var scale = d3.scale.linear().domain([vpXScale.domain()[0] + 1, vpXScale.domain()[1] + 1]).range(vpXScale.range());
                var xAxis = d3.svg.axis().scale(scale).tickSize(6, 5, 5).tickFormat(function (p) {
                    return (p == 0) ? '' : p
                }).ticks(4);
                self.axisContainer.call(xAxis);
                self.gPosBubble = self.axisContainer.append('g').attr('class', 'axis-bubble').style('display', 'none');
                self.gPosBubble.append('rect').attr('x', -30).attr('y', -4).attr('width', 60).attr('height', 17)
                self.gPosBubble.append('text').attr('class', 'pos').attr('y', 6);

            },
            /**
             * refresh the whole view
             */
            update: function () {
                var self = this;
                self.layerContainer.selectAll('g').remove()
                self.svg.select('g.groupset-title').remove()

                self.layers = [];
                self.layerViews = [];
                if (!self.options.hideSequence) {
                    self.p_setup_layer_sequence();
                }

                self.p_setup_layer_features();
                self.p_setup_hidden_layers_container();
                self.p_setup_groupset_titles()
                self.render()

                _.each(self.layers, function (layer) {
                    layer.on('change', function () {
                        self.render();
                    })
                });
            },
            /**
             * render: show the visible layers and pile them up.
             */
            render: function () {
                var self = this;

                var totTracks = 0;
                var totHeight = 0

                var previousGroupSet = undefined;
                var lastGroupSetY = 0;
                var lastGroupSet;
                var paddingGroupSetAdded = true;
                _.chain(self.layerViews).filter(function (layerViews) {
                    return true;
                }).each(function (view) {
                    if (view.model.get('visible')) {
                        var currentGroupSet = view.model.get('groupSet');
                        if (currentGroupSet != previousGroupSet) {
                            var cgsId = (currentGroupSet || '').replace(/\W/g, '_');
                            var groupSetY = self.viewport.scales.y(totTracks);
                            if (lastGroupSet) {
                                lastGroupSet.attr('height',groupSetY - lastGroupSetY);
                            }
                            totTracks += 2
                            previousGroupSet = currentGroupSet;
                            var yshiftScale = self.options.hideAxis ? -20 : 0;
                            self.gGroupSets.select('text#groupset-title-' + cgsId).attr('y', self.viewport.scales.y(totTracks) + totHeight + yshiftScale)
                            if (self.options.collapsible) {
                                self.gGroupSets.select('polygon#groupset-collapser-' + cgsId).attr('transform', function(d,i) { return 'translate(12, ' + (self.viewport.scales.y(totTracks) + totHeight + yshiftScale - self.collapserSize / 2) + ') rotate(' + (self.groupSetStatuses[d].open ? '0' : '-90') + ')'; })
                            }
                            lastGroupSet = self.groupSetBackgroundGroup.select('g>rect.groupset-background' + (cgsId === '' ? '' : '.'+cgsId)).attr('y', groupSetY);
                            lastGroupSetY = groupSetY;
                            paddingGroupSetAdded = false;
                        }
                        if (!self.groupSetStatuses || !self.groupSetStatuses[currentGroupSet] || self.groupSetStatuses[currentGroupSet].open) {
                            if (!paddingGroupSetAdded && self.paddingGroupSet) {
                                totTracks += self.paddingGroupSet;
                                paddingGroupSetAdded = true;
                        }
                        var yshift = self.viewport.scales.y(totTracks + 1)
                        view.g.attr("transform", 'translate(' + 0 + ',' + yshift + ")");
                        if (view.model.get('isPlot')) {
                            totHeight += view.height();
                            totTracks += 1 + self.paddingCategory;
                        } else {
                            totTracks += view.height() + 1 + self.paddingCategory;
                        }
                        view.g.style('display', null);
                        }
                        else {
                            view.g.style('display', 'none');
                        }

                    } else {
                        view.g.style('display', 'none');
                    }
                });
                var groupSetY = self.viewport.scales.y(totTracks);
                if (lastGroupSet) {
                    lastGroupSet.attr('height',groupSetY - lastGroupSetY);
                }
                self.hiddenLayers.g.attr("transform", "translate(0," + (self.viewport.scales.y(totTracks + 1) + totHeight + 20) + ")");

                var heightAdd = 0;
                if (!self.options.hideAxis) {
                    heightAdd += 30;
                    self.axisY = self.viewport.scales.y(totTracks) + heightAdd + totHeight;
                    self.axisContainer.attr('transform', 'translate(0, ' + self.axisY + ')');
                }
                if (!self.options.hideSequene) {
                    heightAdd += 25;
                }

                self.svg.attr("height", self.viewport.scales.y(totTracks) + totHeight + heightAdd)
            },
            /**
             * define gradients to be used.
             * This should certainly lie elsewhere...
             * @private
             */
            p_setup_defs: function () {
                var self = this;
                var defs = self.svg.append('defs');

                var gr = defs.append('svg:linearGradient').attr('id', 'grad_endFTBlock').attr('x1', 0).attr('y1', 0).attr('x2', '100%').attr('y2', 0);
                gr.append('stop').attr('offset', '0%').style('stop-color', '#fff').style('stop-opacity', 0);
                gr.append('stop').attr('offset', '100%').style('stop-color', '#fff').style('stop-opacity', 0.3);

                var xRight = ($(self.el).width() || $(document).width()) - self.margins.right;
                self.clipPath = defs.append('clipPath').attr('id', self.clipperId).append('path').attr('d', 'M' + (self.margins.left - 15) + ',-100L' + (xRight + 15) + ',-100L' + (xRight + 15) + ',20000L' + (self.margins.left - 15) + ',20000');
            },
            /**
             * build the Sequence layer
             * @private
             */
            p_setup_layer_sequence: function () {
                var self = this;

                var layer = new FeatureLayer({
                    name: 'sequence',
                    nbTracks: 2
                })
                self.layers.push(layer)
                var view = new FeatureLayerView({
                    model: layer,
                    container: self.layerContainer,
                    viewport: self.viewport,
                    cssClass: 'sequence',
                    noMenu: true,
                    margins: self.margins,
                    clipper: '#' + self.clipperId
                })
                self.layerViews.push(view)

                view.gFeatures.append('line').attr('x1', -100).attr('x2', 2000).attr('class', 'sequence-bg').attr('y1', 7).attr('y2', 7);
                var sel = view.gFeatures.selectAll("text").data(self.model.get('sequence').split('')).enter().append("text").attr('class', 'sequence data').text(function (d) {
                    return d;
                });

                self.p_positionText(self.viewport, sel);
                self.gAABubble = view.g.append('g').attr('class', 'axis-bubble').style('display', 'none');
                self.gAABubble.append('rect').attr('x', -30).attr('y', -12).attr('width', 61).attr('height', 16)
                self.gAABubble.append('text').attr('class', 'subseq').attr('y', 2);
            },
            /**
             * group features by category, and build a layer for each of them
             * @private
             */
            p_setup_layer_features: function () {
                var self = this;

                var groupedFeatures = _.groupBy(self.model.get('features'), function (ft) {
                    var gcid = (ft.groupSet ? (ft.groupSet + '/') : ' /') + ft.category;
                    ft._groupCatId = gcid;
                    return gcid;

                });

                //it is possible to pass the category Order, thus sort on it at first
                var buildOrder=function(orderName){
                    var order;
                    if (self.options[orderName] !== undefined) {
                        order = {};
                        _.each(self.options[orderName], function (n, i) {
                            order[n] = i + 1;
                        });
                        return order;
                    }
                    return undefined;
                };
                var categoryOrder = buildOrder('categoryOrder');
                var groupSetOrder = buildOrder('groupSetOrder');


                var saveGroupSet = '';
                _.chain(groupedFeatures)
                    .sortBy(function (group) {
                        if (categoryOrder !== undefined) {
                            return 1000000 * (categoryOrder[group[0].category] || 100);
                        }

                        if(groupSetOrder){
                            return 1000000 * (groupSetOrder[group[0].groupSet] || 100);

                        }
                        if (!group[0].groupSet) {
                            return -99999;
                        }

                        return group[0].groupSet;
                    })
                    .each(function (group, groupConcatName) {
                        var nbTracks, isPlot;
                        if (featureDisplayer.isCategoryPlot(group[0].category)) {
                            nbTracks = 1;
                            isPlot = true;
                        } else {
                            nbTracks = featureManager.assignTracks(group);
                        }
                        var groupName = group[0].category;
                        var groupType = group[0].categoryType || groupName;
                        var groupSet = group[0].groupSet;
                        var cssClass = groupName.replace(/\s+/g, '_')

                        var layer = new FeatureLayer({
                            name: (group[0].categoryName === undefined) ? groupName : group[0].categoryName,
                            type: groupType,
                            category: groupName,
                            groupSet: groupSet,
                            id: 'features-' + cssClass,
                            nbTracks: nbTracks,
                            isPlot: isPlot
                        });
                        self.layers.push(layer)

                        var layerView = new FeatureLayerView({
                            model: layer,
                            container: self.layerContainer,
                            viewport: self.viewport,
                            cssClass: cssClass,
                            layerMenu: self.options.layerMenu,
                            margins: self.margins,
                            clipper: '#' + self.clipperId,
                            groupSetName: groupSet? groupSet.replace(/\s+/g, '_').replace(/[\/\(\)]/g, '_') : '',
                            categorySeparator: saveGroupSet === groupSet
                        });
                        self.layerViews.push(layerView);

                        var sel;
                        if (isPlot) {
                            sel = featureDisplayer.categoryPlotAppend(groupName, self.viewport, layerView.gFeatures, group).classed(cssClass, true);
                        } else {
                            sel = featureDisplayer.append(self.viewport, layerView.gFeatures, group).classed(cssClass, true);

                        }
                        //add tolltip based on description field
                        sel.append('title').text(function (ft) {
                            return ft.description;
                        });
                        saveGroupSet = groupSet;
                    });

            },
            /**
             * @private
             */
            p_setup_hidden_layers_container: function () {
                var self = this;

                self.hiddenLayers = new HiddenLayersView({

                    container: self.svg,
                    layers: self.layers,
                    nbTracks: 1
                });
                // /self.layers.push(layer)

            },
            /**
             * @private
             * @return {SeqEntryAnnotInteractiveView}
             */
            p_setup_groupset_titles: function () {
                var self = this;
                var groupSetNames = _.chain(self.model.get('features')).map(function (ft) {
                    return ft.groupSet
                }).unique().filter(function (t) {
                    return t
                }).value();

                self.gGroupSets = self.svg.append('g').attr('class', 'groupset-title');
                self.groupSetBackgroundGroup.selectAll('rect').data(groupSetNames).enter().append('rect')
                    .attr('x',0)
                    .attr('y',0)
                    .attr('width', '100%')
                    .attr('height',0)
                    .attr('class', function (x) {
                        return 'groupset-background ' + (x || '').replace(/\W/g, '_');
                    })
                ;
                self.gGroupSets.selectAll('text').data(groupSetNames).enter().append('text').text(function (x) {
                    return x;
                }).attr('x', (self.options.collapsible ? 27 : 7)).attr('y', 10).attr('id', function (x) {
                    return 'groupset-title-' + (x || '').replace(/\W/g, '_');
                })
                if (self.options.collapsible) {
					var oldGroupSetStatuses = self.groupSetStatuses || {};
                    self.groupSetStatuses = [];
                    _.each(groupSetNames, function (d) {
						var isOpen = oldGroupSetStatuses[d] === undefined ? true : oldGroupSetStatuses[d].open;
                	    self.groupSetStatuses[d] = {name:d,open:isOpen};
                    });
                    self.collapseIcon = self.gGroupSets
                        .selectAll('polygon')
                        .data(groupSetNames)
                        .enter()
                        .append('polygon')
                        .attr('class','collapse_expand')
                        .attr('points', self.collapseTriangle)
                        .attr('id', function (d,i) {
                            return 'groupset-collapser-' + (d || '').replace(/\W/g, '_');
                        })
                        .style('cursor','pointer')
                        .on('mousedown', function(d,i) { self.toggleGroupsetCollapse(d); })
                    ;
                };

                return self;
            },
            /**
             * collapse / expand groupset with passed groupsetName, as if the triangle was clicked
             * @param {String} groupsetName
             */
            toggleGroupsetCollapse: function (groupsetName) {
                var self = this;
                if (self.options.collapsible && self.groupSetStatuses[groupsetName]) {
                    self.groupSetStatuses[groupsetName].open = !self.groupSetStatuses[groupsetName].open;
                    self.render();
                    self.viewport.resizeBrush();
                    if (self.collapseCallback) {
                        if (_.isArray(self.collapseCallback)) {
                            _.each(self.collapseCallback, function (f) {
                            if (!f) {
                                    return;
                                }
                                f();
                            })
                        }
                        else {
                            self.collapseCallback();
                        }
                    }
                }
            },
            /**
             * position sequence text.
             * @param {Object} viewport
             * @param {Object} sel
             * @private
             */
            p_positionText: function (viewport, sel) {
                var self = this;
                sel.attr('x', function (d, i) {
                    return viewport.scales.x(i);
                }).attr('y', viewport.scales.y(1) - 7).style('font-size', '' + viewport.scales.font + 'px').style('letter-spacing', '' + (viewport.scales.x(2) - viewport.scales.x(1) - viewport.scales.font) + 'px')
                return sel
            }
        });

        return SeqEntryAnnotInteractiveView;
    })
