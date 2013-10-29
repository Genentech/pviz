/*
 * Copyright (c) 2013, Genentech Inc.
 * Authors: Alexandre Masselot, Kiran Mukhyala, Bioinformatics & Computational Biology
 */
define(['underscore', 'backbone'], function(_, bb) {
  var FeatureLayer = bb.Model.extend({
    defaults : {
      visible : true
    },
    initialize : function(options) {
    },
    type : function() {
      return this.get('type') || this.get('name');
    }
  });

  return FeatureLayer;
});
