/**
 * a singleton service that goes and grab information from DAS service, buil
 * SeqEntry and add annotation
 * Copyright (c) 2013, Genentech Inc.
 * Authors: Alexandre Masselot, Kiran Mukhyala, Bioinformatics & Computational Biology
 */

define(['underscore', 'pviz/models/SeqEntry', 'pviz/models/PositionedFeature'], function(_, SeqEntry, PositionedFeature) {
    var DASReader = function(url, options) {
        var self = this;
        options = options || {}
        self.urlRoot = url || 'http://www.ebi.ac.uk/das-srv/uniprot/das/uniprot'
        self.xmlMapper = options.xmlMapper || {}
    }
    /**
     * build a new SeqEntry, with sequence, from an id
     *
     * @param {String}
     *          id
     * @param {Map}
     *          options can have several fields: - NYI getFeatures
     *          (true|false): once the sequence is loaded, we load the
     *          features - success: a function to be exeuted upon success of
     *          loading seq, with the newly created seqEntry as argument
     */
    DASReader.prototype.buildSeqEntry = function(id, options) {
        var self = this;
        var url = self.urlRoot + '/sequence?segment=' + id;

        if (options === undefined) {
            options = {}
        }

        $.get(url, function(xml) {
            var seqEntry = self.xml2seqEntry(xml);

            if (options.getFeatures) {
                delete options.getFeatures;
                self.addFeatures(seqEntry, options)
                return;
                // no need to call success, it should be done at the end
                // of getFeatures
            }

            if (options.success !== undefined) {
                options.success(seqEntry);

            }
        })
    }
    /**
     * from a DAS xml (the /sequence one), it builds up a SeqEntry
     * @param {Object} xml
     */
    DASReader.prototype.xml2seqEntry = function(xmlStr, options) {
        options = options || {};

        var xml =$(xmlStr);
        var el = xml.find('SEQUENCE:first');
        return new SeqEntry({
            id : el.attr('id'),
            description : el.attr('label'),
            sequence : el.text().trim()
        });
    };

    /**
     * from a DAS xml (the /features one), it add positional features to a seq entry
     * @param {SeqEntry} seqEntry
     * @param {Object} xml
     */
    DASReader.prototype.xml2features = function(seqEntry, xmlStr, options) {
        var self = this;
        options = options || {};

        var xml = $(xmlStr);
        var el = xml.find('SEQUENCE')[0];
        var features = _.chain(xml.find('FEATURE')).filter(function(node) {
            return $(node).find('START').length == 1
        }).map(function(n) {
            var node = $(n);
            var f = new PositionedFeature({
                start : parseInt(node.find('START:first').text())-1,
                end : parseInt(node.find('END:first').text())-1,
                type : node.find('TYPE:first').text(),
                category : node.find('TYPE:first').attr('category'),
                description : node.find('NOTE:first').text()
            });
            if (options.groupSet) {
                f.groupSet = options.groupSet;
            }
            _.each(self.xmlMapper, function(fct, field) {
                f[field] = fct(f[field], f, node)
            })
            return f;
        }).filter(function(ft) {
            if (options.skipCategory && options.skipCategory[ft.category])
                return false
            return true;
        }).value();
        // each(function(node){console.log(node)});
        seqEntry.addFeatures(features);
    };

    DASReader.prototype.addFeatures = function(seqEntry, options) {
        var self = this;
        options = options || {}

        var url = self.urlRoot + '/features?segment=' + seqEntry.get('id');
        $.get(url, function(xml) {
            self.xml2features(seqEntry, xml, options)
            if (options.success !== undefined) {
                options.success(seqEntry);

            }
        });
    }

    return DASReader
});
