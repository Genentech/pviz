/*
 * Copyright (c) 2013, Genentech Inc.
 * Authors: Alexandre Masselot, Kiran Mukhyala, Bioinformatics & Computational Biology
 */
define(['underscore', 'backbone'], function(_, Backbone) {
  var SeqEntry = Backbone.Model.extend({
    defaults : {

    },
    initialize : function() {
      this.set('features', []);
    },
    length : function() {
      var seq = this.get('sequence');
      return (seq === undefined) ? 0 : seq.length
    },
    addFeatures : function(feats, options) {
      var self = this;
      options = options || {};

      var triggerChange = options.triggerChange || (options.triggerChange === undefined);

      if (_.isArray(feats)) {
        _.each(feats, function(ft) {
          ft.start = parseInt(ft.start);
          ft.end = parseInt(ft.end);
          self.get('features').push(ft);
        })
        if (triggerChange)
          self.trigger('change');
        return self;
      }
      self.get('features').push(feats);
      if (triggerChange)
        self.trigger('change');
      return self;
    },
    clear : function() {
      this.get('features').length = 0
      this.trigger('change');
      return this;

    }
    //urlRoot:'das/json'
  })
  return SeqEntry;
})