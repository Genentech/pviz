/*
 * Copyright (c) 2013, Genentech Inc.
 * Authors: Alexandre Masselot, Kiran Mukhyala, Bioinformatics & Computational Biology
 */
define(['jQuery', 'underscore', 'backbone', 'pviz/models/SeqEntry', 'pviz/services/DASReader', 'pviz/views/SeqEntryFastaView', 'pviz/views/SeqEntryAnnotInteractiveView', 'pviz/views/SeqEntryTableView'], function($, _, Backbone, SeqEntry, DasReader, SeqEntryFastaView, SeqEntryAnnotInteractiveView, SeqEntryTableView) {
  var dasReader = new DasReader();
  var AppRouter = Backbone.Router.extend({
    routes : {
      // '/projects': 'showProjects',
      'fasta/:ac' : 'showFasta',
      'annot/:ac' : 'showAnnot',
      'feats/:ac' : 'showFeats',
      '*actions' : 'defaultAction'
    },
    showAnnot : function(accession) {
      dasReader.buildSeqEntry(accession, {
        getFeatures : true,
        success : function(seqEntry) {
          new SeqEntryAnnotInteractiveView({
            model : seqEntry,
            el : $('#main')
          }).render();
        }
      });
    },
    showFasta : function(accession) {
      dasReader.buildSeqEntry(accession, {
        success : function(seqEntry) {
          new SeqEntryFastaView({
            model : seqEntry,
            el : $('#main')
          }).render();
        }
      });
    },
    showFeats : function(accession) {
      dasReader.buildSeqEntry(accession, {
        getFeatures : true,
        success : function(seqEntry) {
          new SeqEntryTableView({
            model : seqEntry,
            el : $('#main')
          }).render();
        }
      });
    },
    defaultAction : function(actions) {
      // We have no matching route, lets just log what the URL was
      console.log('No route:', actions);
    }
  });

  var initialize = function() {
    var app_router = new AppRouter;
    Backbone.history.start();
  };
  return {
    initialize : initialize
  };
});
