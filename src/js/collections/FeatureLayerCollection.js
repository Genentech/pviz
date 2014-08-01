define(
    /**
     @exports FeatureLayerCollection
     @author Alexandre Masselot
     @author Kiran Mukhyala
     @copyright 2013,  Bioinformatics & Computational Biology Department, Genentech Inc.
     */
    ['backbone', '../models/FeatureLayer'], function (bb, FeatureLayer) {
        /**
         * a collection of FeatureLayer, follows backbone collection mechanisms
         * @constructor
         * @augments Backbone.Collection
         */
        var FeatureLayerCollection = bb.Collection.extend(
            /**
             * @lends module:FeatureLayerCollection~FeatureLayerCollection.prototype
             */
            {
                model: FeatureLayer

            });
        return FeatureLayerCollection;
    });