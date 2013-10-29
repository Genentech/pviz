/*
 * Copyright (c) 2013, Genentech Inc.
 * Authors: Alexandre Masselot, Kiran Mukhyala, Bioinformatics & Computational Biology
 */

define(['underscore'], function(_) {
  var FeatureManager = function() {
  }
  /**
   *
   *
   * @param {Array[]}
   *
   * @param {Map}
   *          options can have several fields: -
   */
  FeatureManager.prototype.sortFeatures = function(features, options) {
    var self = this;

    if (options === undefined) {
      options = {}
    }
    return _.sortBy(features, function(a) {
      return a.start;
    });
  }
  /**
   *
   * @param {Object} fta
   * @param {Object} ftb
   */
  FeatureManager.prototype.featuresIntersect = function(fta, ftb) {
    return !((fta.end < ftb.start) || (ftb.end < fta.start))
    // /(fta.start >= ftb.start && fta.start <= ftb.end) || (fta.end >= ftb.start && fta.end <= ftb.end)
  };

  //only works on sorted features
  FeatureManager.prototype._getOverlaps = function(fNum, features) {
    var self = this;
    var feat = features[fNum];

    return _.filter(features.slice(0, fNum), function(ft) {
      //we check that we can have several time the same feature???
      return (!_.isEqual(feat, ft)) && (self.featuresIntersect(feat, ft));
    });

  }
  /**
   *
   * @param {Object} features and array of featues. We add a displayTrack attribute to each element.
   * @return the number of tracks
   */
  FeatureManager.prototype.assignTracks = function(features) {
    var sortedFeats = this.sortFeatures(features);

    var nbTracks = 0;
    var lastPosPerTrack = []
    _.chain(sortedFeats).sortBy(function(ft) {
      return ft.start
    }).each(function(ft) {
      var ftStart = ft.start;
      for ( itrack = 0; itrack < lastPosPerTrack.length && lastPosPerTrack[itrack] >= ftStart; itrack++) {
      }
      lastPosPerTrack[itrack] = ft.end
      ft.displayTrack = itrack
    })
    return lastPosPerTrack.length
  }
  /*
   * singleton contructor
   */
  return new FeatureManager()
});
