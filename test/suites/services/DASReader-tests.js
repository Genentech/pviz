define(['jquery', 'underscore', 'suites/ExpServer', 'pviz/models/SeqEntry', 'pviz/services/DASReader'], function($, _, expServer, SeqEntry, DASReader) {

    describe('DASReader', function() {
        it(" instance is set", function() {
            var dasReader = new DASReader()
            expect(dasReader).not.toBeUndefined();
            expect(dasReader.urlRoot).toEqual('http://www.ebi.ac.uk/das-srv/uniprot/das/uniprot');
        });

        describe('sequence', function() {
            describe('checking url availability', function() {
                it('parsing first label attrbitue', function() {
                    var xml;
                    runs(function() {
                        $.get('http://www.ebi.ac.uk/das-srv/uniprot/das/uniprot/sequence?segment=Q01279', function(d) {
                            xml = d;
                        })
                    })
                    waitsFor(function() {
                        return xml
                    }, 'local xml das sequence', 1000)
                    runs(function() {
                        expect(xml).not.toBeUndefined()
                        var lab = xml.getElementsByTagName('SEQUENCE')[0].attributes['label'].nodeValue
                        expect(lab).toEqual('Epidermal growth factor receptor (TEST RESOURCES)')
                    })
                })
            });
            describe('buildSeqEntry', function() {
                it('from id, build obj + sequence; test success callback', function() {
                    var seqEntry;
                    var dasReader = new DASReader()

                    runs(function() {
                        dasReader.buildSeqEntry("Q01279", {
                            success : function(se) {
                                seqEntry = se;
                            }
                        });
                    })
                    waitsFor(function() {
                        return seqEntry !== undefined;
                    }, 'dasReader.buildSeqEntry', 1000)
                    runs(function() {
                        expect( seqEntry instanceof SeqEntry).toBe(true)
                        expect(seqEntry.get('id')).toEqual("Q01279")
                        expect(seqEntry.get('description')).toEqual('Epidermal growth factor receptor (TEST RESOURCES)')
                        expect(seqEntry.get('sequence')).not.toBeUndefined();
                        expect(seqEntry.get('sequence').length).toBe(1210);
                        expect(seqEntry.get('sequence').indexOf('MRPSGTARTTLLVLLTA')).toBe(0);
                    })
                })
            });
        });
        describe('features', function() {
            describe('checking url availability', function() {
                it('parsing first id attrbitue', function() {
                    var xml;
                    runs(function() {
                        $.get('http://www.ebi.ac.uk/das-srv/uniprot/das/uniprot/features?segment=Q01279', function(d) {
                            xml = d;
                        })
                    })
                    waitsFor(function() {
                        return xml
                    }, 'local xml das features', 1000)
                    runs(function() {
                        expect(xml).not.toBeUndefined()
                        var lab = xml.getElementsByTagName('SEGMENT')[0].attributes['id'].nodeValue;
                        expect(lab).toEqual('Q01279');
                    })
                })
            });
            describe('getting all features', function() {
                it('parsing first id attribute', function() {
                    var seqEntry;
                    var dasReader = new DASReader()

                    runs(function() {
                        seqEntry = dasReader.buildSeqEntry("Q01279", {
                            getFeatures : true,
                            success : function(se) {
                                seqEntry = se;
                            }
                        });
                    })
                    waitsFor(function() {
                        return seqEntry !== undefined;
                    }, 'dasReader.buildSeqEntry', 1000)
                    runs(function() {
                        expect(seqEntry.get('features').length).toEqual(84);
                        var first = seqEntry.get('features')[0];
                        expect(first.start).toBe(1);
                        expect(first.end).toBe(24);
                        expect(first.type).toEqual('signal_peptide');
                        expect(first.category).toEqual('Molecule processing');
                        //                         expect(first.label).toEqual('UNIPROTKB_Q01279_SIGNAL_1_24');

                        //expect(first.note).toEqual('Epidermal growth factor receptor');
                    });
                })
            });
        });
    });

    return undefined
})