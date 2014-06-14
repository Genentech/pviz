define(
    [ 'models/SeqEntry', 'services/DASReader', 'services/FastaReader',
        'views/FeatureDisplayer', 'views/SeqEntryAnnotInteractiveView',
        'text!resources/Q01279-sequence.das.xml',
        'text!resources/Q01279-features.das.xml' ],
    function(SeqEntry, DASReader, FastaReader, featureDisplayer,
             SeqEntryAnnotInteractiveView, das_seq_Q01279, das_features_Q01279) {
        // we could use the dasREade async call, but that is easier to directly
        // populat the seqEntry object at once.
        var parser = new DOMParser();
        var dasReader = new DASReader()
        var fastaReader = new FastaReader();

        var seqEntry_Q01279 = dasReader.xml2seqEntry(parser.parseFromString(
            das_seq_Q01279, 'text/xml'));
        dasReader.xml2features(seqEntry_Q01279, parser.parseFromString(
            das_features_Q01279, 'text/xml'));

        describe('seqEntry initialization', function() {
            it('header', function() {
                expect(seqEntry_Q01279.get('id')).toEqual('Q01279');
            })
            it('features', function() {
                expect(seqEntry_Q01279.get('features').length).toEqual(84);
            })
        })
        describe('raw viewer Q01279, layerMenu:"minimize"', function() {

            var div = addDZDiv('annot-interactive', 'raw_Q01279', 600, 'auto');
            new SeqEntryAnnotInteractiveView({
                model : seqEntry_Q01279,
                el : div
                //layerMenu : 'minimize'
            }).render();
        });

        describe('shorty, ', function() {
            var se = new SeqEntry({
                id : 'shorty',
                label : 'asuper short one',
                sequence : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            })
            se.set('features', [ {
                category : 'full',
                start : 0,
                end : 25,
                type : 'ttt'
            }, {
                category : 'Region',
                start : 1,
                end : 4,
                type : 'ttt',
                text : '2-5'
            }, {
                category : 'Region',
                start : 6,
                end : 11,
                type : 'xxx'
            }, {
                category : 'Amino acid modification',
                start : 6,
                end : 6,
                type : 'xxx',
                text : '7-7'
            }, {
                category : 'Amino acid modification',
                start : 11,
                end : 11,
                type : 'xxx'
            }, {
                category : 'Amino acid modification',
                start : 14,
                end : 14,
                type : 'xxx'
            }, {
                category : 'Amino acid modification',
                start : 25,
                end : 25,
                type : 'xxx'
            }, {
                category : 'Amino acid modification',
                start : 24,
                end : 24,
                type : 'xxx'
            }, {
                category : 'Amino acid modification',
                start : 21,
                end : 25,
                type : 'xxx'
            } ])

            var div = addDZDiv('annot-interactive',
                'shorty layerMenu:"sticky", paddingCategory:3', 600, 'auto');

            featureDisplayer.setStrikeoutCategory('Amino acid modification')

            var view = new SeqEntryAnnotInteractiveView({
                model : se,
                el : div,
                layerMenu : 'sticky',
                paddingCategory : 3
            })
            view.render();

            it('count ft displayed', function() {
                // heihei, this a a D3 svg rendered test!!
                expect(
                    view.svg.selectAll("g.feature.data.Region").selectAll(
                        "rect.feature").length).toBe(2);
            });

        });
        describe('interact, ',
            function() {
                var se = new SeqEntry({
                    id : 'interact',
                    label : 'asuper short one',
                    sequence : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                })
                se.set('features', [ {
                    category : 'full',
                    start : 0,
                    end : 25,
                    type : 'ttt'
                }, {
                    category : 'Region',
                    start : 1,
                    end : 4,
                    type : 'ttt',
                    text : '2-5'
                }, {
                    category : 'Region',
                    start : 6,
                    end : 11,
                    type : 'xxx'
                }, {
                    category : 'Amino acid modification',
                    start : 6,
                    end : 6,
                    type : 'xxx',
                    text : '7-7'
                }, {
                    category : 'Amino acid modification',
                    start : 11,
                    end : 11,
                    type : 'xxx'
                }, {
                    category : 'Amino acid modification',
                    start : 14,
                    end : 14,
                    type : 'xxx'
                }, {
                    category : 'Amino acid modification',
                    start : 25,
                    end : 25,
                    type : 'xxx'
                }, {
                    category : 'Amino acid modification',
                    start : 24,
                    end : 24,
                    type : 'xxx'
                }, {
                    category : 'Amino acid modification',
                    start : 21,
                    end : 25,
                    type : 'xxx'
                } ])

                var div = addDZDiv('annot-interactive', 'interactive one, marginLeft:150', 600,
                    'auto');

                featureDisplayer.addMouseoverCallback(['xxx'], function(ft){
                    console.log('MOUSEOVER', ft);
                });
                featureDisplayer.addMouseoutCallback(['xxx'], function(ft){
                    console.log('MOUSEOUT', ft);
                });
                featureDisplayer.addClickCallback(['xxx'], function(ft){
                    console.log('CLICK', ft);
                });;
                var view = new SeqEntryAnnotInteractiveView({
                    model : se,
                    el : div,
                    layerMenu : 'interact',
                    marginLeft:150
                })
                view.render();

                it('count ft displayed', function() {
                    // heihei, this a a D3 svg rendered test!!
                    expect(
                        view.svg.selectAll("g.feature.data.Region").selectAll(
                            "rect.feature").length).toBe(2);
                });

            });
        describe('shorty with groupSet, noLayerMenu', function() {
            var se = new SeqEntry({
                id : 'shorty',
                label : 'asuper short on',
                sequence : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            })
            se.set('features', [ {
                category : 'full',
                start : 0,
                end : 25,
                type : 'ttt'
            }, {
                category : 'Region',
                start : 1,
                end : 4,
                type : 'ttt',
                text : '2-5',
                description:'one description'
            }, {
                category : 'Region',
                start : 6,
                end : 11,
                type : 'xxx',
                description:'another description'
            },{category:'Amino acid modification', start:6, end:6, type:'xxx', text:'A', groupSet:'AAA (pouet)'},
                {category:'Amino acid modification', start:11, end:11, type:'xxx', text:'A', groupSet:'AAA (pouet)'},
                {category:'Amino acid modification', start:24, end:24, type:'xxx', text:'C', groupSet:'CCC'},
                {category:'Amino acid modification', start:14, end:14, type:'xxx', text:'B', groupSet:'BBB'},
                {category:'Amino acid modification', start:25, end:25, type:'xxx', text:'B', groupSet:'BBB'},
                {category:'Amino acid modification', start:24, end:24, type:'xxx', text:'A', groupSet:'AAA (pouet)'},
                {category:'Amino acid modification', start:21, end:25, type:'xxx', text:'A', groupSet:'AAA (pouet)'},
                {category:'Amino acid modification', start:6, end:6, type:'xxx', text:'C', groupSet:'CCC'},
                {category:'Amino acid modification', start:11, end:11, type:'xxx', text:'C', groupSet:'CCC'},
                {category:'Amino acid modification', start:21, end:25, type:'xxx', text:'C1', groupSet:'CCC'},
                {category:'catP', categoryName:'cat catP', start:11, end:11, type:'xxx', text:'C_P', groupSet:'CCC'},
                {category:'catP', categoryName:'cat catP', start:6, end:6, type:'xxx', text:'A_P', groupSet:'AAA (pouet)'},
                {category:'catP', categoryName:'cat catP', start:25, end:25, type:'xxx', text:'B_P', groupSet:'BBB'}
            ]);

            var div = addDZDiv('annot-interactive', 'shorty', 600, 'auto');
            var view = new SeqEntryAnnotInteractiveView({
                model : se,
                el : div,
                //layerMenu : 'off'
            })
            view.render();

            it('count ft displayed', function() {
                // heihei, this a a D3 svg rendered test!!
                expect(
                    view.svg.selectAll("g.feature.data.Region").selectAll(
                        "rect.feature").length).toBe(2);
            })

        })
        describe(
            'fasta_peff',
            function() {
                var cont = 'nxp:NX_Q16586-1 \\DbUniqueId=NX_Q16586-1 \\Pname=Alpha-sarcoglycan isoform SGCA-1 \\Gname=SGCA \\NcbiTaxId=9606 \\TaxName=Homo Sapiens \\Length=387 \\SV=55 \\EV=119 \\PE=1 \\ModRes=(174|N-linked (GlcNAc...))(246|N-linked (GlcNAc...)) \\Variant=(30|30|L)(31|31|P)(34|34|C)(34|34|H)(62|62|H)(68|68|E)(74|74|W)(77|77|C)(89|89|P)(91|91|R)(93|93|V)(97|97|G)(98|98|H)(98|98|C)(103|103|T)(107|107|V)(110|110|Q)(124|124|T)(136|136|APGAQP)(137|137|K)(137|137|G)(158|158|F)(173|173|P)(175|175|A)(190|190|D)(196|196|I)(201|201|D)(205|205|H)(221|221|H)(228|228|Q)(242|242|A)(247|247|M)(284|284|C)(310|310|C)(374|374|C) \\Processed=(1|23|signal peptide)(24|387|mature protein)\n\
    MAETLFWTPLLVVLLAGLGDTEAQQTTLHPLVGRVFVHTLDHETFLSLPEHVAVPPAVHI\n\
    TYHAHLQGHPDLPRWLRYTQRSPHHPGFLYGSATPEDRGLQVIEVTAYNRDSFDTTRQRL\n\
    VLEIGDPEGPLLPYQAEFLVRSHDAEEVLPSTPASRFLSALGGLWEPGELQLLNVTSALD\n\
    RGGRVPLPIEGRKEGVYIKVGSASPFSTCLKMVASPDSHARCAQGQPPLLSCYDTLAPHF\n\
    RVDWCNVTLVDKSVPEPADEVPTPGDGILEHDPFFCPPTEAPDRDFLVDALVTLLVPLLV\n\
    ALLLTLLLAYVMCCRREGRLKRDLATSDIQMVHHCTIHGNTEELRQMAASREVPRPLSTL\n\
    PMFNVHTGERLPPRVDSAQVPLILDQH';

                var se = fastaReader.buildSeqEntry(cont)

                var div = addDZDiv('annot-interactive', 'fasta-peff + forcing the category order', 600, 'auto');
                var view = new SeqEntryAnnotInteractiveView({
                    model : se,
                    el : div,
                    categoryOrder:['variants','amino acid modifications']
                })
                view.render();
                div.append($('<pre style="font-size:7px">' + cont + '</pre>'))

                it('count ft displayed', function() {
                    //heihei, this a a D3 svg rendered test!!
                    expect(
                        view.svg.selectAll("g.feature.data.Variant")
                            .selectAll("rect").length).toBe(35);
                })

            });

        describe(
            'secondary structure',
            function() {
                it(
                    "should used dedicated displayers",
                    function() {
                        var seq = 'MELAALCRWGLLLALLPPGAASTQVCTGTDMKLRLPASPETHLDMLRHLYQGCQVVQGNLELTYLPTNASLSFLQDIQEVQGYVLIAHNQVRQVPLQRLRIVRGTQLFEDNYALAVLDNGDPLNNTTPVTGASPGGLR';

                        var seqEntry = new SeqEntry({
                            sequence : seq
                        });

                        seqEntry.addFeatures([ {
                            category : 'regions',
                            type : 'topological domain',
                            text : 'extra cellular',
                            start : 0,
                            end : 649
                        }, {
                            category : 'secondary structure',
                            type : 'beta_strand',
                            start : 23,
                            end : 25
                        }, {
                            category : 'secondary structure',
                            type : 'helix',
                            start : 37,
                            end : 48
                        }, {
                            category : 'secondary structure',
                            type : 'beta_strand',
                            start : 52,
                            end : 56
                        }, {
                            category : 'secondary structure',
                            type : 'turn',
                            start : 58,
                            end : 62
                        }, {
                            category : 'secondary structure',
                            type : 'helix',
                            start : 70,
                            end : 72
                        } ]);
                        new SeqEntryAnnotInteractiveView({
                            model : seqEntry,
                            el : '#main'
                        }).render();

                        var div = addDZDiv('annot-interactive',
                            'secondary-structure, hideSequence:true, hideAxis:true    ', 600, 'auto');
                        var view = new SeqEntryAnnotInteractiveView({
                            model : seqEntry,
                            el : div,
                            hideSequence:true,
                            hideAxis:true
                        });
                        view.render();

                        expect(
                            view.svg.selectAll("g.feature.data.Variant").selectAll(
                                "rect").length).toBe(0);
                        expect(
                            view.svg.selectAll("g.feature.data.helix").selectAll(
                                "rect").length).toBe(2);
                    })
            });

        describe('with plot data, ',
            function() {
                featureDisplayer.setCategoryPlot('mutation', {
                    ylim:[0,1],
                    scale:'linear',
                    y:function(ft){
                        return ft.frequency
                    }
                });

                var se = new SeqEntry({
                    id : 'plot-points',
                    label : 'asuper short one',
                    sequence : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                })
                se.addFeatures([  {
                    category : 'Region',
                    start : 1,
                    end : 4,
                    type : 'ttt',
                    text : '2-5'
                }, {
                    category : 'Region',
                    start : 6,
                    end : 11,
                    type : 'xxx'
                },{
                    category:'mutation',
                    pos:4,
                    frequency:0.8
                },{
                    category:'mutation',
                    pos:6,
                    frequency:0.05
                },{
                    category:'mutation',
                    pos:20,
                    frequency:0.22
                }
                ])

                var div = addDZDiv('plot-points', 'plotPoints', 600,
                    'auto');

                var view = new SeqEntryAnnotInteractiveView({
                    model : se,
                    el : div,
                    layerMenu : 'interact',
                    marginLeft:150
                })
                view.render();

                it('count ft displayed', function() {
                    // heihei, this a a D3 svg rendered test!!
                    expect(
                        view.svg.selectAll("g.feature.data.Region").selectAll(
                            "rect.feature").length).toBe(2);
                });

            });

        describe('with plot data, variables, ',
            function() {
                featureDisplayer.setCategoryPlot('mutation', {
                    ylim:[0,100],
                    scale:'linear',
                    y:function(ft){
                        return 100*ft.i/12;
                    },
                    fill:function(ft){
                        return ft.i;
                    },
                    opacity:function(ft){
                        return 0.3+0.7*ft.i/12;
                    },
                    size:function(ft){
                        return 8+1.5*ft.i;
                    },
                    lwd:function(ft){
                        return 2+Math.abs((6-ft.i)/3);
                    },
                    color:function(ft){
                        return 'rgb('+(Math.floor(255*ft.i/12))+','+(Math.floor(255*(1-ft.i/12)))+','+0+')';
                    },
                    shape:function(ft){
                        return 1+(ft.i-1)%7;
                    }
                });

                var se = new SeqEntry({
                    id : 'hahaha',
                    label : 'asuper short one',
                    sequence : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                })
                se.addFeatures([  {
                    category : 'Region',
                    start : 1,
                    end : 4,
                    type : 'ttt',
                    text : '2-5'
                }, {
                    category : 'Region',
                    start : 6,
                    end : 11,
                    type : 'xxx'
                }
                ]);
                se.addFeatures([1,2,3,4,5,6,7,8,9,10,11,12].map(function(i){
                    return {
                        category:'mutation',
                        pos:2*i,
                        i:i
                    };
                }));

                var div = addDZDiv('plot-points-function', 'plotPoints', 600,
                    'auto');

                var view = new SeqEntryAnnotInteractiveView({
                    model : se,
                    el : div,
                    layerMenu : 'interact',
                    marginLeft:150
                })
                view.render();

                it('count ft displayed', function() {
                    // heihei, this a a D3 svg rendered test!!
                    expect(
                        view.svg.selectAll("g.feature.data.Region").selectAll(
                            "rect.feature").length).toBe(2);
                });

            });

    });
