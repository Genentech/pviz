function addDZDiv(folder, id, width, height) {
    var divCont = $('<div class="block"><b>' + id + '</b><br/></div>');
    var div = $('<div></div>');
    divCont.append(div);

    div.attr('id', id);
    div.height(height || 200);
    div.width(width || 200);

    var divFolder = $('#dz').find('div[name=' + folder + ']');
    if (divFolder.size() == 0) {
        divFolder = $('<div name="' + folder + '" class="dz-folder"></div>');
        $('#dz').append(divFolder)

    }

    divFolder.append(divCont)
    return div;
}

function addDZSvg(folder, id, width, height) {
    var div = addDZDiv(folder, id, width, height);
    return d3.select(div[0]).append("svg").attr("width", '100%').attr("height", '100%');
}