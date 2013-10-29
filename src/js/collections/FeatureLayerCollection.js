/*
 * Copyright (c) 2013, Genentech Inc.
 * Authors: Alexandre Masselot, Kiran Mukhyala, Bioinformatics & Computational Biology
 */
define(['backbone', '../models/PositionedFeature'], function(bb, PositionedFeature) {
  return bb.Collection.extend({
    model : PositionedFeature,
    group : function() {
      var self = this;
      return _.groupBy(self.models, function(ft) {
        return (ft.groupSet ? (ft.groupSet + '/:') : '') + ft.category;

      })
    }
  })

})
