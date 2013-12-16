/*
 * Copyright (c) 2013, Genentech Inc.
 * Authors: Alexandre Masselot, Kiran Mukhyala, Bioinformatics & Computational Biology
 */
var classPaths = ['pviz/models/SeqEntry', 'pviz/services/DASReader', 'pviz/services/FastaReader', 'pviz/services/FeatureManager', 'pviz/services/IconFactory', 'pviz/views/SeqEntryAnnotInteractiveView', 'pviz/views/SeqEntryFastaView', 'pviz/views/FeatureDisplayer', 'pviz/views/OneLiner']
define(['pviz/models/SeqEntry', 'pviz/services/DASReader', 'pviz/services/FastaReader', 'pviz/services/FeatureManager', 'pviz/services/IconFactory', 'pviz/views/SeqEntryAnnotInteractiveView', 'pviz/views/SeqEntryFastaView', 'pviz/views/FeatureDisplayer', 'pviz/views/OneLiner'], function(SeqEntry, DASReader, FastaReader, FeatureManager, IconFactory, SeqEntryAnnotInteractiveView, SeqEntryFastaView, FeatureDisplayer, OneLiner) {
  var args = arguments;
  var exp = {}
  for (i in classPaths) {
    var simpleName = classPaths[i].replace(/.*\//, '');
    exp[simpleName] = args[i];
  }
  return exp;
})
