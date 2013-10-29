/**
 * just a dummy fasta display
 * Copyright (c) 2013, Genentech Inc.
 * Authors: Alexandre Masselot, Kiran Mukhyala, Bioinformatics & Computational Biology
 */

define(['jQuery', 'underscore', 'backbone'], function($, _, Backbone) {
  var SeqEntryFastaView = Backbone.View.extend({
    initialize : function(options) {
      var self = this;

    },
    render : function() {
      var self = this;
      $(self.el).empty();
      var seq = self.model.get('sequence');
      var seq60 = '';
      for ( i = 0; i < seq.length; i += 10) {
        seq60 += seq.substring(i, i + 10)
        if ((i + 10) % 60 == 0) {
          seq60 += "\n";
        } else {
          seq60 += " ";
        }

      }

      $(self.el).append("<pre>>" + self.model.get('id') + "\n" + seq60 + "</pre>")
    }
  });
  return SeqEntryFastaView;
})