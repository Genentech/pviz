define(['jquery', 'underscore', 'suites/ExpServer', 'pviz/models/SeqEntry', 'pviz/services/FeatureManager'], function($, _, expServer, SeqEntry, featureManager) {

    describe('FeatureManager', function() {
        it("singleton instance is set", function() {
            expect(featureManager).not.toBeUndefined();
        });

        describe('sorting', function() {
            it('3 simples', function() {
                var fts = [{
                    id : 0,
                    start : 10,
                    end : 22
                }, {
                    id : 1,
                    start : 5,
                    end : 22
                }, {
                    id : 2,
                    start : 15,
                    end : 25
                }];
                expect(_.pluck(featureManager.sortFeatures(fts), 'id')).toEqual([1, 0, 2])
            })
            it('3 , with 2 equals', function() {
                var fts = [{
                    id : 0,
                    start : 10,
                    end : 22
                }, {
                    id : 1,
                    start : 10,
                    end : 22
                }, {
                    id : 2,
                    start : 15,
                    end : 25
                }];
                expect(_.pluck(featureManager.sortFeatures(fts), 'id')).toEqual([0, 1, 2])
            })
        });

        describe('overlap', function() {
            function check(comment, f0start, f0end, f1start, f1end, expected) {
                it(comment + "(" + f0start + ", " + f0end + ") X (" + f1start + ", " + f1end + ") => " + expected, function() {
                    expect(featureManager.featuresIntersect({
                        start : f0start,
                        end : f0end
                    }, {
                        start : f1start,
                        end : f1end
                    })).toBe(expected)
                });

            };
            check('distinct lower first', 1, 10, 20, 25, false);
            check('distinct upper first', 20, 25, 1, 10, false);
            check('partial cross, lower first', 1, 10, 5, 25, true);
            check('partial cross, upper first', 5, 25, 1, 10, true);
            check('over, inner first', 5, 10, 1, 20, true);
            check('over, inner last', 1, 20, 5, 10, true);
            check('equal', 1, 20, 1, 20, true);
        });

        describe('get overlaps', function() {
            it('5 simples', function() {
                var fts = [{
                    id : 1,
                    start : 3,
                    end : 9
                }, {
                    id : 2,
                    start : 5,
                    end : 22
                }, {
                    id : 0,
                    start : 10,
                    end : 22
                }, {
                    id : 3,
                    start : 15,
                    end : 50
                }, {
                    id : 4,
                    start : 25,
                    end : 52
                }, {
                    id : 6,
                    start : 28,
                    end : 89
                }];
                var overlaps = featureManager._getOverlaps(2, fts);
                expect(overlaps.length).toEqual(1);
            })
        });

        describe('assignTracks', function() {
            function check(comment, ftPos, expectedTracks, expectedNbTracks) {
                it(comment, function() {
                    var fts = _.collect(ftPos, function(p, i) {
                        return {
                            id : i,
                            start : p[0],
                            end : p[1]
                        }
                    });
                    var nbTracks = featureManager.assignTracks(fts);
                    expect(_.pluck(fts, 'displayTrack')).toEqual(expectedTracks);
                    expect(nbTracks).toBe(expectedNbTracks)
                });
            }

            check('4 features 3 rows', [[5, 22], [10, 22], [15, 25], [25, 52]], [0, 1, 2, 0], 3);
            check('4 features 4 rows', [[5, 22], [10, 22], [15, 25], [21, 52]], [0, 1, 2, 3], 4);
            check('4 features 1 rows', [[5, 22], [23, 32], [33, 35], [36, 52]], [0, 0, 0, 0], 1);
            check('8 features 3 rows', [[5, 22], [22, 22], [22, 35], [35, 36], [45, 53], [52, 62], [62, 65], [54, 90]], [0, 1, 2, 0, 0, 1, 2, 0], 3);
            check('bug-20130918', [[77, 87], [68, 86], [189, 203], [68, 87]], [2, 0, 0, 1], 3);

        });

    });

    return undefined
})