define(
    /**
     @exports FeatureManager
     @author Alexandre Masselot
     @author Kiran Mukhyala
     @copyright 2013,  Bioinformatics & Computational Biology Department, Genentech Inc.
     */
    ['underscore'], function (_) {
        /**
         * Distribute features under one category across different track so they do not overlap
         * requiring this module will indeed return a singleton
         @constructor
         */
        var FeatureManager = function () {
        }
        /**
         * Sort the feature by starting positions
         * @private
         * @param {Array[]}
         */
        FeatureManager.prototype.sortFeatures = function (features, options) {
            var self = this;

            if (options === undefined) {
                options = {}
            }
            return _.sortBy(features, function (a) {
                return a.start;
            });
        }

        /**
         * Do two features overlap?
         * @private
         * @param {Object} fta
         * @param {Object} ftb
         */
        FeatureManager.prototype.featuresIntersect = function (fta, ftb) {
            return !((fta.end < ftb.start) || (ftb.end < fta.start))
            // /(fta.start >= ftb.start && fta.start <= ftb.end) || (fta.end >= ftb.start && fta.end <= ftb.end)
        };

        /**
         * get the overlapping features for the fnum^th one
         * Only works on sorted features
         * @param {int} fNum
         * @param {Array} features array of PositionedFeature
         * @private
         */
        FeatureManager.prototype._getOverlaps = function (fNum, features) {
            var self = this;
            var feat = features[fNum];

            return _.filter(features.slice(0, fNum), function (ft) {
                //we check that we can have several time the same feature???
                return (!_.isEqual(feat, ft)) && (self.featuresIntersect(feat, ft));
            });

        }
        /**
         *  Distribute the features among tracks by adding a displayTrack attribute to each feature
         *
         * @param {Array} features and array of features. We add a displayTrack attribute to each element.
         * @return the number of tracks
         */
        FeatureManager.prototype.assignTracks = function (features, options) {
            var sortedFeats = this.sortFeatures(features, options);

            var nbTracks = 0;
            var lastPosPerTrack = []
            _.chain(sortedFeats).each(function (ft) {
                var ftStart = ft.start;
                for (itrack = 0; itrack < lastPosPerTrack.length && lastPosPerTrack[itrack] >= ftStart; itrack++) {
                }
                lastPosPerTrack[itrack] = ft.end
                ft.displayTrack = itrack
            })
            return lastPosPerTrack.length
        }
        /*
         * singleton contructor
         */
        return new FeatureManager()
    });
