/*
 * Copyright (c) 2013, Genentech Inc.
 * Authors: Alexandre Masselot, Kiran Mukhyala, Bioinformatics & Computational Biology
 */
define(['underscore'], function(_) {
  var PositionedFeature = function(options) {
    var self = this;
    _.each(['start', 'end', 'type', 'category', 'note', 'displayTrack', 'text', 'groupSet'], function(name) {
      self[name] = options[name]
    })
  }

  return PositionedFeature;
});
