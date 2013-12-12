/**
 * just a dummy table view of features
 * Copyright (c) 2013, Genentech Inc.
 * Authors: Alexandre Masselot, Kiran Mukhyala, Bioinformatics & Computational Biology
 */

define(['jquery', 'underscore', 'backbone', 'pviz/services/FeatureManager'], function($, _, Backbone, FeatureManager) {
  var SeqEntryTableView = Backbone.View.extend({
    initialize : function(options) {
      var self = this;

    },
    render : function() {
      var self = this;
      $(self.el).empty();
      var feats = self.model.get('features');
      var sortedFeats = FeatureManager.assignTracks(feats);
      var html = "<table class='table'><tbody>";
      var templ = "<tr><td><%= category %></td><td><%= type %></td><td><%= start %></td><td><%= end %></td></tr>";
      _.each(sortedFeats, function(f) {
        html += _.template(templ, f);
      });
      html += "</tbody></table>";

      $(self.el).html(html);
    }
  });
  return SeqEntryTableView;
});
