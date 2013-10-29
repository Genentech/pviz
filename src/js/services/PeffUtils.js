/*
 * Copyright (c) 2013, Genentech Inc.
 * Authors: Alexandre Masselot, Kiran Mukhyala, Bioinformatics & Computational Biology
 */
(function() {
  var PeffUtils = function() {
  }

  PeffUtils.prototype.parse = function(content) {
    var self = this;

    var hs = self.headerAndSequence(content);
    var seq = hs[1];
    var header = self.peffHeader2map(hs[0])
    var se = new SeqEntry({
      id : header[0],
      sequence : seq
    })
    if (header[1] == undefined) {
      return se;
    }
    if (header[1].Pname) {
      se.set('description', header[1].Pname)
    }
    self.parseFeatures(se, header[1])
  }
  /***
   * split  a fasta text into header and sequence.
   *  headeing '>' is removed on sequence
   * sequence spaces are cleaned out
   * @param {Object} text
   * @return an array of [header, sequence]
   */
  PeffUtils.prototype.headerAndSequence = function(text) {
    var self = this;

    var arr = text.split(/\n/);
    var header = arr.shift();
    header = header.replace(/^>/, '').trim();

    var seq = arr.join('');
    seq = seq.replace(/\s+/g, '');

    return [header, seq];
  }
  /**
   * parse the header line, with peff fashion
   * returns an array [id, featMap]
   * check tests to see how it works...
   *
   * @param {Object} line
   */
  PeffUtils.prototype.peffHeader2map = function(line) {
    var self = this;

    line = line.trim();

    var i = line.indexOf(' ');
    if (i == -1) {
      i = line.length;
    }
    var id = line.substr(0, i);
    var featStr = line.substr(i);

    var re = new RegExp("\\s\\\\\\w+=", "g")
    var idx = []
    while ( m = re.exec(featStr)) {
      idx.push(m.index)
    }

    if (idx.length == 0) {
      return [id]
    }

    var feats = {};
    var sIdx = idx.slice(1, idx.length).concat([featStr.length + 2])
    var interv = _.chain(idx).zip(sIdx).map(function(r) {
      return [r[0] + 2, r[1] - 2 - r[0]];
      //[starts, length]
    }).map(function(r) {
      var m = /(\w+)=(.*)/.exec(featStr.substr(r[0], r[1]))
      return [m[1], m[2]]
    }).each(function(p) {
      var name = p[0]
      var content = p[1]
      var reParen = /\((.+?)\)/g
      if (content.indexOf('(') == 0) {
        var c = [];
        while ( m = reParen.exec(content)) {
          c.push(m[1]);
        }
        feats[name] = c;

      } else {
        feats[name] = content
      }
    })
    return [id, feats]

  }
  PeffUtils.prototype.parseFeatures = function(feats) {
    var self = this;
    if (feats == undefined) {
      return [];
    }

    return _.chain(feats).map(function(ftList, cat) {

      return _.map(ftList, function(ftTxt) {
        var arr = ftTxt.split('|')
        if (arr.length == 2) {
          arr.unshift(arr[0])
        }
        return {
          start : arr[0] - 1,
          end : arr[1] - 1,
          category : keepOnly[cat],
          type : cat,
          name : arr[2],
          text : arr[2]
        }
      }).flatten().value()

    })
  }
})()
