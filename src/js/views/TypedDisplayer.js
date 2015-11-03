
define(/**
     @exports TypeDisplayer
     @author Alexandre Masselot
     @author Kiran Mukhyala
     @copyright 2013,  Bioinformatics & Computational Biology Department, Genentech Inc.
     */

    [], function () {
        /**
         * Features are by default displayed by rectangles with text.
         * However, it is possible to defined more complex information depending on the type.
         * We define here a few default displayers for some types.
         *
         * It is possible of course to extend these displayers in a custom file
         *
         * @class SeqEntryViewport map the sequence scale domain to the dom element
         * @constructor
         */
        var TypeDisplayer = {
            init: function (featureDisplayer) {
                featureDisplayer.setCustomHandler('default', {
                    appender: featureDisplayer.getDefaultAppender(),
                    positioner: featureDisplayer.getDefaultPositioner()
                })
                featureDisplayer.setCustomHandler('helix', {
                    appender: function (viewport, svgGroup, features, type) {
                        var sel = svgGroup.selectAll("g.feature.data." + type).data(features).enter().append("g").attr("class", "feature data " + type);
                        sel.append("rect").attr('class', 'feature tooltip-bg').attr('y',-5);
                        sel.append("path").attr('d', 'M0,0').attr('class', type)
                        return svgGroup.selectAll("g.feature.data." + type);
                    },
                    positioner: function (viewport, d3selection) {
                        var oneOffAdjust = viewport.oneOffFix ? -1 : 0;
                        d3selection.attr('transform', function (ft) {
                            return 'translate(' + viewport.scales.x(ft.start + oneOffAdjust - 0.45) + ',' + viewport.scales.y(0.5 + ft.displayTrack) + ')';
                        });
                        var ftWidth = function (ft) {
                            return viewport.scales.x(ft.end + oneOffAdjust + 0.9) - viewport.scales.x(ft.start + oneOffAdjust + 0.1)
                        }
                        d3selection.selectAll("path.helix").attr('d', function (ft) {
                            //width in pixels
                            var w = viewport.scales.x(ft.end + oneOffAdjust + 0.9) - viewport.scales.x(ft.start + oneOffAdjust + 0.1);
                            //number of waves, should not be larger than 20 px
                            var n = Math.max(1, Math.round(w / 20));
                            // half period
                            var hwStep = w / n / 2;
                            var d = _.times(n, function (i) {
                                return "q" + (hwStep / 2) + ",-10," + hwStep + ",0," + (hwStep / 2) + ",10," + hwStep + ",0"
                            }).join(" ")
                            return "M0,0 " + d
                        })
                        d3selection.selectAll("rect.feature.tooltip-bg").attr('width', ftWidth).attr('height', 10);
                        return d3selection
                    }
                })

                featureDisplayer.setCustomHandler('beta_strand', {
                    appender: function (viewport, svgGroup, features, type) {
                        var sel = svgGroup.selectAll("g.feature.data." + type).data(features).enter().append("g").attr("class", "feature data " + type);
                        sel.append("line").attr('class', type);
                        sel.append("path").attr('class', type).attr('d', "M0,0l-10,-5l0,10l10,-5");

                        return svgGroup.selectAll("g.feature.data." + type);
                    },
                    positioner: function (viewport, d3selection) {
                        var oneOffAdjust = viewport.oneOffFix ? -1 : 0;
                        d3selection.attr('transform', function (ft) {
                            return 'translate(' + viewport.scales.x(ft.start + oneOffAdjust - 0.45) + ',' + viewport.scales.y(0.5 + ft.displayTrack) + ')';
                        });
                        var ftWidth = function (ft) {
                            return viewport.scales.x(ft.end + oneOffAdjust + 0.9) - viewport.scales.x(ft.start + oneOffAdjust + 0.1)
                        }
                        d3selection.selectAll("line.beta_strand").attr('x1', 0).attr('y1', 0).attr('x2', function (ft) {
                            return ftWidth(ft) - 4
                        }).attr('y2', 0)
                        d3selection.selectAll("path.beta_strand").attr('transform', function (ft) {
                            return 'translate(' + ftWidth(ft) + ',0)'
                        });

                        return d3selection
                    }
                })

                featureDisplayer.setCustomHandler('turn', {
                    appender: function (viewport, svgGroup, features, type) {
                        var sel = svgGroup.selectAll("g.feature.data." + type).data(features).enter().append("g").attr("class", "feature data " + type);
                        sel.append("path").attr('class', type).attr('d', "M0,0");
                        return svgGroup.selectAll("g.feature.data." + type);
                    },
                    positioner: function (viewport, d3selection) {
                        var oneOffAdjust = viewport.oneOffFix ? -1 : 0;
                        d3selection.attr('transform', function (ft) {
                            return 'translate(' + viewport.scales.x(ft.start + oneOffAdjust - 0.45) + ',' + viewport.scales.y(0.5 + ft.displayTrack) + ')';
                        });

                        d3selection.selectAll("path.turn").attr('d', function (ft) {
                            var w = viewport.scales.x(ft.end + oneOffAdjust + 0.9) - viewport.scales.x(ft.start + oneOffAdjust + 0.1);
                            return 'M0,3 l' + (w - 10) + ',0 q10,-3,0,-6 l-' + (w - 10) + ',0'
                        })

                        return d3selection
                    }
                });
                featureDisplayer.setCustomHandler('circle', {
                    appender: function (viewport, svgGroup, features, type) {
                        var sel = svgGroup.selectAll("g.feature.data." + type).data(features).enter().append("g").attr("class", "feature data " + type);
                        var g = sel.append("g");
                        g.append('circle');
                        g.append('text').text(function (ft) {
                            return ft.text;
                        })
                        return sel;
                    },
                    positioner: function (viewport, d3selection) {
                        var oneOffAdjust = viewport.oneOffFix ? -1 : 0;
                        d3selection.attr('transform', function (ft) {
                            return 'translate(' + viewport.scales.x(ft.start + oneOffAdjust) + ',' + viewport.scales.y((0.5 + ft.displayTrack) * featureDisplayer.heightFactor(ft.category)) + ')';
                        });
                        d3selection.selectAll("circle").attr('r', function (ft) {
                            return ft.radius
                        });

                        return d3selection
                    }
                });
            }
        };
        return TypeDisplayer;

    });
