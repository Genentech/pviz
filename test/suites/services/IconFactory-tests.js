define(['d3', 'pviz/services/IconFactory'], function(d3, factory) {
    describe('IconFactory', function() {
        it('count ft displayed', function(){
            var svg = addDZSvg('icons', '1', 40, 40);
            factory.append(svg, 'thunder');
            var svg = addDZSvg('icons', '64', 70, 70);
            factory.append(svg, 'thunder',64);
            var svg = addDZSvg('icons', '16', 40, 40);
            factory.append(svg, 'thunder',16);
        })
        
    })
});
