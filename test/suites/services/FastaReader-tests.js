define(['jquery', 'underscore', 'pviz/models/SeqEntry', 'pviz/services/FastaReader'], function($, _, SeqEntry, FastaReader) {
    var fastaReader= new FastaReader();
    describe('FastaReader', function() {
        describe('headerAndSequence', function() {
            var check = function(contents, expHeader, expSequence) {
                var hs = fastaReader.headerAndSequence(contents);
                expect(hs[0]).toEqual(expHeader);
                expect(hs[1]).toEqual(expSequence);
            }
            it('simple one', function() {
                check(">hahaha\nPIPO\n", 'hahaha', 'PIPO')
            })
            it('sequence with spaces', function() {
                check(">hahaha\nPIPO POPO\nPIF LE CHIEN\n\n\n\n", 'hahaha', "PIPOPOPOPIFLECHIEN")
            })
            it('header & seq with spaces', function() {
                check(">hahaha hoho\nPIPO POPO\nPIF LE CHIEN\n\n\n\n", 'hahaha hoho', "PIPOPOPOPIFLECHIEN")
            })
        })
        describe('peffHeaderToMap', function() {
            var check = function(str, expId, expFeatures) {
                var v = fastaReader.peffHeader2map(str);
                expect(v[0]).toEqual(expId);
                expect(v[1]).toEqual(expFeatures);
            }
            it('simple one', function() {
                check("hahaha", 'hahaha', {})
            })
            it('one text feature \\DbUniqueId=NX_Q16586-1', function() {
                check('nxp:NX_Q16586-1 \\DbUniqueId=NX_Q16586-1', 'nxp:NX_Q16586-1', {
                    DbUniqueId : 'NX_Q16586-1'
                })
            })
            it('multiple text features', function() {
                check('nxp:NX_Q16586-1 \\DbUniqueId=NX_Q16586-1 \\Pname=Alpha-sarcoglycan isoform SGCA-1 \\Gname=SGCA', 'nxp:NX_Q16586-1', {
                    DbUniqueId : 'NX_Q16586-1',
                    Pname : 'Alpha-sarcoglycan isoform SGCA-1',
                    Gname : 'SGCA'
                })
            })
            it('array features  \\Variant=(30|30|L)(31|31|P)(34|34|C)', function() {
                check('nxp:NX_Q16586-1 \\Variant=(30|30|L)(31|31|P)(34|34|C)', 'nxp:NX_Q16586-1', {
                    Variant : ['30|30|L', '31|31|P', '34|34|C']
                })
            })
            it('mixing features  \\DbUniqueId=NX_Q16586-1 \\Pname=Alpha-sarcoglycan isoform SGCA-1 \\Gname=SGCA \\Variant=(30|30|L)(31|31|P)(34|34|C)', function() {
                check('nxp:NX_Q16586-1 \\DbUniqueId=NX_Q16586-1 \\Pname=Alpha-sarcoglycan isoform SGCA-1 \\Gname=SGCA \\Variant=(30|30|L)(31|31|P)(34|34|C)', 'nxp:NX_Q16586-1', {
                    DbUniqueId : 'NX_Q16586-1',
                    Pname : 'Alpha-sarcoglycan isoform SGCA-1',
                    Gname : 'SGCA',
                    Variant : ['30|30|L', '31|31|P', '34|34|C']
                })
            })
        });
        describe('buildSeqEntry', function(){
          it('full one', function(){
              var cont = 'nxp:NX_Q16586-1 \\DbUniqueId=NX_Q16586-1 \\Pname=Alpha-sarcoglycan isoform SGCA-1 \\Gname=SGCA \\NcbiTaxId=9606 \\TaxName=Homo Sapiens \\Length=387 \\SV=55 \\EV=119 \\PE=1 \\ModRes=(174|N-linked (GlcNAc...))(246|N-linked (GlcNAc...)) \\Variant=(30|30|L)(31|31|P)(34|34|C)(34|34|H)(62|62|H)(68|68|E)(74|74|W)(77|77|C)(89|89|P)(91|91|R)(93|93|V)(97|97|G)(98|98|H)(98|98|C)(103|103|T)(107|107|V)(110|110|Q)(124|124|T)(136|136|APGAQP)(137|137|K)(137|137|G)(158|158|F)(173|173|P)(175|175|A)(190|190|D)(196|196|I)(201|201|D)(205|205|H)(221|221|H)(228|228|Q)(242|242|A)(247|247|M)(284|284|C)(310|310|C)(374|374|C) \\Processed=(1|23|signal peptide)(24|387|mature protein)\n\
MAETLFWTPLLVVLLAGLGDTEAQQTTLHPLVGRVFVHTLDHETFLSLPEHVAVPPAVHI\n\
TYHAHLQGHPDLPRWLRYTQRSPHHPGFLYGSATPEDRGLQVIEVTAYNRDSFDTTRQRL\n\
VLEIGDPEGPLLPYQAEFLVRSHDAEEVLPSTPASRFLSALGGLWEPGELQLLNVTSALD\n\
RGGRVPLPIEGRKEGVYIKVGSASPFSTCLKMVASPDSHARCAQGQPPLLSCYDTLAPHF\n\
RVDWCNVTLVDKSVPEPADEVPTPGDGILEHDPFFCPPTEAPDRDFLVDALVTLLVPLLV\n\
ALLLTLLLAYVMCCRREGRLKRDLATSDIQMVHHCTIHGNTEELRQMAASREVPRPLSTL\n\
PMFNVHTGERLPPRVDSAQVPLILDQH\n\
'
              var se = fastaReader.buildSeqEntry(cont)
              expect(se.get('id')).toEqual('nxp:NX_Q16586-1')
              expect(se.get('description')).toEqual('Alpha-sarcoglycan isoform SGCA-1')
              expect(se.get('sequence').length).toBe(387)
              
              expect(_.filter(se.get('features'), function(ft){ return ft.category == 'processed'}).length).toBe(2)
              expect(_.filter(se.get('features'), function(ft){ return ft.category == 'variants'}).length).toBe(35)
              var v = _.filter(se.get('features'), function(ft){ return ft.category == 'variants'})[2];
              expect(v.start).toBe(33)
              expect(v.end).toBe(33)
              expect(v.text).toEqual('C')
          })
        })
    })
});
