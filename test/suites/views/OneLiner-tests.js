define(['models/SeqEntry', 'services/FastaReader', 'views/OneLiner'], function(SeqEntry,  FastaReader, OneLiner) {
    var fastaReader=new FastaReader()
    //we could use the dasREade async call, but that is easier to directly populat the seqEntry object at once.
   describe('OneLiner', function(){
    describe('from fasta/peff', function() {
          var cont = 'nxp:NX_Q16586-1 \\DbUniqueId=NX_Q16586-1 \\Pname=Alpha-sarcoglycan isoform SGCA-1 \\Gname=SGCA \\NcbiTaxId=9606 \\TaxName=Homo Sapiens \\Length=387 \\SV=55 \\EV=119 \\PE=1 \\ModRes=(174|N-linked (GlcNAc...))(246|N-linked (GlcNAc...)) \\Variant=(30|30|L)(31|31|P)(34|34|C)(34|34|H)(62|62|H)(68|68|E)(74|74|W)(77|77|C)(89|89|P)(91|91|R)(93|93|V)(97|97|G)(98|98|H)(98|98|C)(103|103|T)(107|107|V)(110|110|Q)(124|124|T)(136|136|APGAQP)(137|137|K)(137|137|G)(158|158|F)(173|173|P)(175|175|A)(190|190|D)(196|196|I)(201|201|D)(205|205|H)(221|221|H)(228|228|Q)(242|242|A)(247|247|M)(284|284|C)(310|310|C)(374|374|C) \\Processed=(1|23|signal peptide)(24|387|mature protein)\n\
MAETLFWTPLLVVLLAGLGDTEAQQTTLHPLVGRVFVHTLDHETFLSLPEHVAVPPAVHI\n\
TYHAHLQGHPDLPRWLRYTQRSPHHPGFLYGSATPEDRGLQVIEVTAYNRDSFDTTRQRL\n\
VLEIGDPEGPLLPYQAEFLVRSHDAEEVLPSTPASRFLSALGGLWEPGELQLLNVTSALD\n\
RGGRVPLPIEGRKEGVYIKVGSASPFSTCLKMVASPDSHARCAQGQPPLLSCYDTLAPHF\n\
RVDWCNVTLVDKSVPEPADEVPTPGDGILEHDPFFCPPTEAPDRDFLVDALVTLLVPLLV\n\
ALLLTLLLAYVMCCRREGRLKRDLATSDIQMVHHCTIHGNTEELRQMAASREVPRPLSTL\n\
PMFNVHTGERLPPRVDSAQVPLILDQH';
        
        var se = fastaReader.buildSeqEntry(cont);
           
        it('all', function(){
            var div = addDZDiv('one-liner', 'all', 200, 'auto');
            var view = new OneLiner({
                model : se,
                el : div
            })
            view.render();
            //heihei, this a a D3 svg rendered test!!
           expect(view.svg.selectAll("rect")[0].length).toBe(39); 
        })

        it('one category, variants', function(){
            var div = addDZDiv('one-liner', 'categories:[variants]', 200, 'auto');
            var view = new OneLiner({
                model : se,
                el : div,
                categories:['variants'] //filter on category
            })
            view.render();
            //heihei, this a a D3 svg rendered test!!
           expect(view.svg.selectAll("rect")[0].length).toBe(35); 
        })
       it('teo category, variants/processed', function(){
            var div = addDZDiv('one-liner', 'variants/processed', 200, 'auto');
            var view = new OneLiner({
                model : se,
                el : div,
                categories:['variants', 'processed'] //filter on category
            })
            view.render();
            //heihei, this a a D3 svg rendered test!!
           expect(view.svg.selectAll("rect")[0].length).toBe(37); 
        })
        
    });
      
    })  
      
});
