
define(
    /**
     @exports FeatureLayer
     @author Alexandre Masselot
     @author Kiran Mukhyala
     @copyright 2013,  Bioinformatics & Computational Biology Department, Genentech Inc.
     */
    ['underscore', 'backbone'], function (_, bb) {

        /**
         * FeatureLayer regroups all the PositionedFeature of a same type
         * @constructor
         * @augments Backbone.Model
         *
         * @param {Map} options
         * @param {String} options.type is only compulsory member
         * @param {boolean} options.visible is the layer to be shown. Default is true
         */
        var FeatureLayer = bb.Model.extend(
            /**
             * @lends module:FeatureLayer~FeatureLayer.prototype
             */
            {
                defaults: {
                    visible: true
                },
                initialize: function (options) {
                },
                /**
                 * The object type, based on the type or name attribute
                 *
                 * @return {String} the type key
                 */
                type: function () {
                    return this.get('type') || this.get('name');
                }
            });
        return FeatureLayer;
    });
