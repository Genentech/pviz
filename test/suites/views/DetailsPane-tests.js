define(['pviz/views/DetailsPane'], function(DetailsPane) {
    describe('Details-Pane', function() {
        it('name2id', function() {
            var dp = new DetailsPane();
            expect(dp.name2id('abcd')).toEqual('abcd')
            expect(dp.name2id(' abc ')).toEqual('abc')
            expect(dp.name2id('ab  cc')).toEqual('ab-cc')
            expect(dp.name2id('AB !CD')).toEqual('ab-cd')
        });
        it('simple', function() {
            var checkCounts = function(n) {
                expect(div.find('div.tab-pane').size()).toBe(n);
                expect(div.find('ul.nav-tabs').find('li > a').size()).toBe(n)
            };
            var div = addDZDiv('details-pane', 'simple', 1000, 200);
            var dp = new DetailsPane({
                el : div
            }).render();

            checkCounts(0)

            dp.getTab('The first');
            checkCounts(1)

            dp.getTab('the first');
            checkCounts(1)

            var tab = dp.getTab('secundo');
            dp.raiseTab(tab);
            checkCounts(2);
            
        });
    })
});
