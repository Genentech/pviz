$(function() {
    var div = $('<div class="row"><h3>Source code</h3><pre class="pre-scrollable" style="max-height:50vh"></pre><div>');

    function getcss() {
        var txt = $('head').find('style.example').text()
        if (txt !== '') {
            return "    // ------ css\n" + txt.replace(/^    /gm, '').replace(/'</gm, "'&lt;");
        }
        return ''
    }

    function getjs() {
        var txt = $(document).find('script.example').text()
        if (txt !== '') {
            return "// ------ JavaScript\n" + txt.replace(/^    /gm, '').replace(/'</gm, "'&lt;");
        }
        return ''
    }


    $('body').append(div);

    div.find('pre').html(getcss() + getjs());
});

