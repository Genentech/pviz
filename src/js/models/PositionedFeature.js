
define(
    /**
     @exports PositionedFeature
     @author Alexandre Masselot
     @author Kiran Mukhyala
     @copyright 2013,  Bioinformatics & Computational Biology Department, Genentech Inc.
     */
    ['underscore'], function (_) {
        /**
         * @class PositionedFeature, corresponding to the basic component to be displayed. There is no limit among the feature member. However, a few a given by default
         * @constructor
         * @param {Map} options
         * @param {int} options.start [compulsory] the starting position, (first one is 0)
         * @param {int} options.end  [compulsory] the ending position
         * @param {String} options.type [compulsory] will be used to define how to draw the feature
         * @param {String} options.category [compulsory] all the feature below the same category are regrouped together
         * @param {String} options.groupSet  a super category
         * @param {String} options.text  a description to be displayed by default
         *
         */
        var PositionedFeature = function (options) {
            var self = this;
            _.each(['start', 'end', 'type', 'category', 'description', 'displayTrack', 'text', 'groupSet'], function (name) {
                self[name] = options[name]
            })
        }

        return PositionedFeature;
    });
