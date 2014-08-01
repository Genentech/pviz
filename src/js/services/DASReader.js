define(
    /**
     @exports DASReader
     @author Alexandre Masselot
     @author Kiran Mukhyala
     @copyright 2013,  Bioinformatics & Computational Biology Department, Genentech Inc.
     */
    ['underscore', 'pviz/models/SeqEntry', 'pviz/models/PositionedFeature'],

    function (_, SeqEntry, PositionedFeature) {
        /**
         * A service that goes and grab information from a DAS service, builds SeqEntry and add positioned annotations
         @constructor
         @param {String} url to get the info (default is  http://www.ebi.ac.uk/das-srv/uniprot/das/uniprot)
         @param {Map} options
         @param {Map} options.xmlMapper a map of string (field names) to function to transform the loaded DAS entry (see examples)
         */

        var DASReader = function (url, options) {
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
         * @param {Map} options can have several fields
         * @param {boolean} options.getFeatures once the sequence is loaded, we load the features
         * @param {function} options.success: a function to be executed upon success of loading seq, with the newly created seqEntry as argument
         */
        DASReader.prototype.buildSeqEntry = function (id, options) {
            var self = this;
            var url = self.urlRoot + '/sequence?segment=' + id;

            if (options === undefined) {
                options = {}
            }

            $.get(url, function (xml) {
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
         * @param {String} xmlStr xml string
         */
        DASReader.prototype.xml2seqEntry = function (xmlStr, options) {
            options = options || {};

            var xml = $(xmlStr);
            var el = xml.find('SEQUENCE:first');
            return new SeqEntry({
                id: el.attr('id'),
                description: el.attr('label'),
                sequence: el.text().trim()
            });
        };

        /**
         * from a DAS xml (the /features one), adds positional features to a seq entry
         * @param {SeqEntry} seqEntry
         * @param {String} xmlStr xml string
         * @param {Map} options
         * @param {String} options.groupSet to group the feature in the meta category
         * @param {Map} options.skipCategory a map string -> boolean to indicate whether a given category is to be skipped
         */
        DASReader.prototype.xml2features = function (seqEntry, xmlStr, options) {
            var self = this;
            options = options || {};

            var xml = $(xmlStr);
            var el = xml.find('SEQUENCE')[0];
            var features = _.chain(xml.find('FEATURE')).filter(function (node) {
                return $(node).find('START').length == 1
            }).map(function (n) {
                var node = $(n);
                var f = new PositionedFeature({
                    start: parseInt(node.find('START:first').text()) - 1,
                    end: parseInt(node.find('END:first').text()) - 1,
                    type: node.find('TYPE:first').text(),
                    category: node.find('TYPE:first').attr('category'),
                    description: node.find('NOTE:first').text()
                });
                if (options.groupSet) {
                    f.groupSet = options.groupSet;
                }
                _.each(self.xmlMapper, function (fct, field) {
                    f[field] = fct(f[field], f, node)
                })
                return f;
            }).filter(function (ft) {
                if (options.skipCategory && options.skipCategory[ft.category])
                    return false
                return true;
            }).value();
            // each(function(node){console.log(node)});
            seqEntry.addFeatures(features);
        };

        /**
         * make a call to the DAS server to add features to the passed SeqEntry
         * @param {SeqEntry} seqEntry
         * @param {Map} options
         * @param {function} options.success callback function once the feature have been added
         */
        DASReader.prototype.addFeatures = function (seqEntry, options) {
            var self = this;
            options = options || {}

            var url = self.urlRoot + '/features?segment=' + seqEntry.get('id');
            $.get(url, function (xml) {
                self.xml2features(seqEntry, xml, options)
                if (options.success !== undefined) {
                    options.success(seqEntry);

                }
            });
        }

        return DASReader
    });
