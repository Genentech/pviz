define(/**
     @exports SeqEntryFastaView
     @author Alexandre Masselot
     @author Kiran Mukhyala
     @copyright 2013,  Bioinformatics & Computational Biology Department, Genentech Inc.
     */
    ['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
        /**
         * @class SeqEntryFastaView is a simple text fasta viewer (60 character per line and a space every 10)
         * @constructor
         * @augments Backbone.View
         */
        var SeqEntryFastaView = Backbone.View.extend(/** @lends module:SeqEntryFastaView~SeqEntryFastaView.prototype */{
            initialize: function (options) {
                var self = this;
                self.options = options;

            },
            render: function () {
                var self = this;
                $(self.el).empty();
                var seq = self.model.get('sequence');
                var seq60 = '';
                for (i = 0; i < seq.length; i += 10) {
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
    });