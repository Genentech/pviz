/**
 * singleton class that will server for unit/integration testing, to server experiemental data
 */

define(['underscore', 'sinon', 'text!resources/Q01279-sequence.das.xml', 'text!resources/Q01279-features.das.xml'], function(_, sinon, das_seq_Q01279, das_features_Q01279) {

    //transoform the list of element (with id) into maps pointed by id

    var server = sinon.fakeServer.create();

    //fake the fields=precursorOnly by removing the peaks data array
    server.respondWith('GET', /.*\/das\/uniprot\/sequence\?segment=Q01279/, [200, {
        "Content-Type" : "application/xml"
    }, das_seq_Q01279]);

    //http://www.ebi.ac.uk/das-srv/uniprot/das/uniprot/features?segment=Q01279
    server.respondWith('GET', /.*\/das\/uniprot\/features\?segment=Q01279/, function(xhr) {
        xhr.respond(200, {
            "Content-Type" : "application/xml"
        }, das_features_Q01279);
    });
    server.autoRespond = true;

    server.respond();

    return server;
});
