define(
    /**
     @exports SeqEntry
     @author Alexandre Masselot
     @author Kiran Mukhyala
     @copyright 2013,  Bioinformatics & Computational Biology Department, Genentech Inc.
     */
    ['underscore', 'backbone'], function (_, Backbone) {
        /**
         * A SeqEntry object holds the sequence and the list of PositionedFeature
         * @constructor
         * @augments Backbone.Model
         *
         * @param {Map} options
         * @param {String} options.sequence is the layer to be shown. Default is true
         * @param {Array} options.features an array of object (will be mapped into PositionedFeature)
         */
        var SeqEntry = Backbone.Model.extend(
            /**
             * @lends module:SeqEntry~SeqEntry.prototype
             */
            {
                defaults: {

                },
                initialize: function () {
                    this.set('features', []);
                },
                /**
                 *
                 * @return {integer} sequence length
                 */
                length: function () {
                    var seq = this.get('sequence');
                    return (seq === undefined) ? 0 : seq.length
                },
                /**
                 * Add san array or a single feature to the seq entry. A 'change' event will be triggered by default. The Backbone view will be binded to such changes
                 * @param {Array|Object} feats
                 * @param {Map} options
                 * @param {boolean} options.triggerChange defines is a 'change' event is to be fired (default is true)
                 * @return {SeqEntry}
                 */
                addFeatures: function (feats, options) {
                    var self = this;
                    options = options || {};

                    var triggerChange = options.triggerChange || (options.triggerChange === undefined);

                    if (_.isArray(feats)) {
                        _.each(feats, function (ft) {
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
                /**
                 * Removes an array or a single feature from the seq entry. A 'change' event will be triggered by default. The Backbone view will be binded to such changes
                 * @param {Array|Object} feats
                 * @param {Map} options
                 * @param {boolean} options.triggerChange defines is a 'change' event is to be fired (default is true)
                 * @return {SeqEntry}
                 */
                removeFeatures: function (feats, options) {
                    var self = this;
                    options = options || {};

                    var triggerChange = options.triggerChange || (options.triggerChange === undefined);

					var featureArray = self.get('features');
                    if (_.isArray(feats)) {
                        _.each(feats, function (ft) {
							var index = featureArray.indexOf(ft);
							if (index !== -1) {
								featureArray.splice(index, 1);
							}
                        })
                        if (triggerChange)
                            self.trigger('change');
                        return self;
                    }
					var index = featureArray.indexOf(feats);
					if (index !== -1) {
						featureArray.splice(index, 1);
					}
                    if (triggerChange)
                        self.trigger('change');
                    return self;
                },
                /**
                 * Removes all the features (and fire a 'change' event
                 * @return {SeqEntry}
                 */
                clear: function () {
                    this.get('features').length = 0
                    this.trigger('change');
                    return this;

                }
            });
        return SeqEntry;
    });
