define(['jQuery', 'underscore', 'suites/ExpServer', 'models/SeqEntry'], function($, _, expServer, SeqEntry) {

    describe('SeqEntry', function() {
        it("constructor", function() {
            var se = new SeqEntry();
            expect(se).not.toBeUndefined();
            expect( se instanceof SeqEntry).toBe(true)
        });
      it("empty feature array", function() {
            var se = new SeqEntry();
            expect(se.get('features')).not.toBeUndefined();
            expect(se.get('features').length).toBe(0);
        });
      it("not sequence size 0", function() {
            var se = new SeqEntry();
            expect(se.length()).toBe(0);
        });
      it("not sequence size ", function() {
            var se = new SeqEntry({sequence:"PIPO"});
            expect(se.length()).toBe(4);
        });
    });

    return undefined
})