define(
    /**
     @exports SeqEntryTableView
     @author Alexandre Masselot
     @author Kiran Mukhyala
     @copyright 2013,  Bioinformatics & Computational Biology Department, Genentech Inc.
     */
    ['jquery', 'underscore', 'backbone', 'pviz/services/FeatureManager'], function ($, _, Backbone, FeatureManager) {
        /**
         * @class SeqEntryTableView just a dummy text table view of features
         * @constructor
         * @augments Backbone.View
         */
        var SeqEntryTableView = Backbone.View.extend(/** @lends module:SeqEntryAnnotInteractiveView~SeqEntryAnnotInteractiveView.prototype */{
            initialize: function (options) {
                var self = this;
                self.options = options;

            },
            /**
             * Builds the table
             */
            render: function () {
                var self = this;
                $(self.el).empty();
                var feats = self.model.get('features');
                var sortedFeats = FeatureManager.assignTracks(feats);
                var html = "<table class='table'><tbody>";
                var templ = "<tr><td><%= category %></td><td><%= type %></td><td><%= start %></td><td><%= end %></td></tr>";
                _.each(sortedFeats, function (f) {
                    html += _.template(templ, f);
                });
                html += "</tbody></table>";

                $(self.el).html(html);
            }
        });
        return SeqEntryTableView;
    });
