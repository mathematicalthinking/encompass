var Seeder = require('mongoose-data-seed').Seeder;
var Folder = require('../server/datasource/schemas').Folder;

var data = [
  {
    "_id": "53e11604b48b12793f0004ee",
    "name": "Correct",
    "weight": null,
    "createdBy": "53d9a577729e9ef59ba7f118",
    "parent": null,
    "workspace": "53e1156db48b12793f000442",
    "taggings": [],
    "children": [],
    "editors": [],
    "isTrashed": false,
    "createDate": null
  }, {
    "_id": {
      "$oid": "53e1165eb48b12793f0005e7"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "53d9a577729e9ef59ba7f118"
    },
    "editors": [],
    "isTrashed": false,
    "name": "Incorrect",
    "parent": null,
    "taggings": [{
      "$oid": "53e12518b48b12793f000b92"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e1156db48b12793f000442"
    }
  }, {
    "_id": {
      "$oid": "53e1166db48b12793f0005e9"
    },
    "name": "Correct with no work",
    "weight": null,
    "createdBy": {
      "$oid": "53d9a577729e9ef59ba7f118"
    },
    "parent": null,
    "workspace": {
      "$oid": "53e1156db48b12793f000442"
    },
    "taggings": [],
    "children": [],
    "editors": [],
    "isTrashed": false,
    "createDate": null
  }, {
    "_id": {
      "$oid": "53e118f3b48b12793f000a41"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "53d9a577729e9ef59ba7f118"
    },
    "editors": [],
    "isTrashed": false,
    "name": "Reflections",
    "parent": null,
    "taggings": [{
      "$oid": "53e1194bb48b12793f000a62"
    }, {
      "$oid": "53e11eceb48b12793f000b36"
    }, {
      "$oid": "53e11fa8b48b12793f000b48"
    }, {
      "$oid": "53e12250b48b12793f000b83"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e1156db48b12793f000442"
    }
  }, {
    "_id": {
      "$oid": "53e11b0ab48b12793f000ab1"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "53d9a577729e9ef59ba7f118"
    },
    "editors": [],
    "isTrashed": false,
    "name": "I notice",
    "parent": null,
    "taggings": [{
      "$oid": "53e11b5eb48b12793f000abb"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e1156db48b12793f000442"
    }
  }, {
    "_id": {
      "$oid": "53e36a0bb48b12793f000d3c"
    },
    "children": [{
      "$oid": "53e36a31b48b12793f000d3d"
    }, {
      "$oid": "53e36ab5b48b12793f000d40"
    }, {
      "$oid": "53e37aa4b48b12793f00104f"
    }, {
      "$oid": "53e37af0b48b12793f001054"
    }, {
      "$oid": "53e37b47b48b12793f00105a"
    }, {
      "$oid": "53e37c3eb48b12793f00106a"
    }, {
      "$oid": "53e37da2b48b12793f00107a"
    }, {
      "$oid": "53e37e41b48b12793f00108b"
    }, {
      "$oid": "53e37e94b48b12793f00108e"
    }],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "liked",
    "parent": null,
    "taggings": [],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e36a31b48b12793f000d3d"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "scenario session",
    "parent": {
      "$oid": "53e36a0bb48b12793f000d3c"
    },
    "taggings": [{
      "$oid": "53e36a9bb48b12793f000d3f"
    }, {
      "$oid": "53e37492b48b12793f000d4b"
    }, {
      "$oid": "53e37715b48b12793f00103d"
    }, {
      "$oid": "53e37a87b48b12793f00104e"
    }, {
      "$oid": "53e37ad4b48b12793f001053"
    }, {
      "$oid": "53e37dc3b48b12793f00107e"
    }, {
      "$oid": "53e38accb48b12793f0010d5"
    }, {
      "$oid": "53e38ea3b48b12793f0010df"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e36ab5b48b12793f000d40"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "one on one",
    "parent": {
      "$oid": "53e36a0bb48b12793f000d3c"
    },
    "taggings": [{
      "$oid": "53e36ad3b48b12793f000d42"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e36cdbb48b12793f000d43"
    },
    "children": [{
      "$oid": "53e36d26b48b12793f000d45"
    }, {
      "$oid": "53e377b5b48b12793f001044"
    }, {
      "$oid": "53e37edbb48b12793f001091"
    }, {
      "$oid": "53e37f0fb48b12793f001096"
    }, {
      "$oid": "53e38a96b48b12793f0010d2"
    }],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "Improve",
    "parent": null,
    "taggings": [],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e36d26b48b12793f000d45"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "focus in session",
    "parent": {
      "$oid": "53e36cdbb48b12793f000d43"
    },
    "taggings": [{
      "$oid": "53e36d2bb48b12793f000d46"
    }, {
      "$oid": "53e3772cb48b12793f00103f"
    }, {
      "$oid": "53e37e07b48b12793f001086"
    }, {
      "$oid": "53e38edcb48b12793f0010e5"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e37466b48b12793f000d47"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "follow up",
    "parent": null,
    "taggings": [{
      "$oid": "53e37478b48b12793f000d49"
    }, {
      "$oid": "53e37583b48b12793f000d57"
    }, {
      "$oid": "53e379e4b48b12793f00104b"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e374adb48b12793f000d4c"
    },
    "children": [{
      "$oid": "53e374d2b48b12793f000d4e"
    }, {
      "$oid": "53e3751ab48b12793f000d50"
    }, {
      "$oid": "53e37554b48b12793f000d54"
    }, {
      "$oid": "53e37758b48b12793f001040"
    }, {
      "$oid": "53e37b71b48b12793f00105d"
    }, {
      "$oid": "53e37c7cb48b12793f00106d"
    }, {
      "$oid": "53e37f38b48b12793f001099"
    }, {
      "$oid": "53e38e28b48b12793f0010d9"
    }],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "wondering",
    "parent": null,
    "taggings": [],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e374d2b48b12793f000d4e"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "student use",
    "parent": {
      "$oid": "53e374adb48b12793f000d4c"
    },
    "taggings": [{
      "$oid": "53e374dcb48b12793f000d4f"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e3751ab48b12793f000d50"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "thread view",
    "parent": {
      "$oid": "53e374adb48b12793f000d4c"
    },
    "taggings": [{
      "$oid": "53e37529b48b12793f000d52"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e37554b48b12793f000d54"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "why teachers will use this",
    "parent": {
      "$oid": "53e374adb48b12793f000d4c"
    },
    "taggings": [{
      "$oid": "53e37560b48b12793f000d55"
    }, {
      "$oid": "53e38a6fb48b12793f0010cd"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e37758b48b12793f001040"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "big skills/ideas",
    "parent": {
      "$oid": "53e374adb48b12793f000d4c"
    },
    "taggings": [{
      "$oid": "53e3777cb48b12793f001043"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e377b5b48b12793f001044"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "more work on ...",
    "parent": {
      "$oid": "53e36cdbb48b12793f000d43"
    },
    "taggings": [{
      "$oid": "53e37deab48b12793f001082"
    }, {
      "$oid": "53e37df8b48b12793f001084"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e37aa4b48b12793f00104f"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "reviewing PoWs",
    "parent": {
      "$oid": "53e36a0bb48b12793f000d3c"
    },
    "taggings": [{
      "$oid": "53e37ab7b48b12793f001051"
    }, {
      "$oid": "53e37ba1b48b12793f001061"
    }, {
      "$oid": "53e37d05b48b12793f001075"
    }, {
      "$oid": "53e37e23b48b12793f001088"
    }, {
      "$oid": "53e38e5eb48b12793f0010dd"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e37af0b48b12793f001054"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "looking at student work",
    "parent": {
      "$oid": "53e36a0bb48b12793f000d3c"
    },
    "taggings": [{
      "$oid": "53e37b0eb48b12793f001056"
    }, {
      "$oid": "53e37cf5b48b12793f001073"
    }, {
      "$oid": "53e37d27b48b12793f001077"
    }, {
      "$oid": "53e37dd7b48b12793f001080"
    }, {
      "$oid": "53e38a53b48b12793f0010cb"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e37b28b48b12793f001057"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "least useful",
    "parent": null,
    "taggings": [{
      "$oid": "53e37b3bb48b12793f001059"
    }, {
      "$oid": "53e37be8b48b12793f001067"
    }, {
      "$oid": "53e37cc1b48b12793f001071"
    }, {
      "$oid": "53e38eb2b48b12793f0010e1"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e37b47b48b12793f00105a"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "using for pd",
    "parent": {
      "$oid": "53e36a0bb48b12793f000d3c"
    },
    "taggings": [{
      "$oid": "53e37b57b48b12793f00105c"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e37b71b48b12793f00105d"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "get colleagues to use pows",
    "parent": {
      "$oid": "53e374adb48b12793f000d4c"
    },
    "taggings": [{
      "$oid": "53e37b8ab48b12793f00105f"
    }, {
      "$oid": "53e37c1ab48b12793f001069"
    }, {
      "$oid": "53e37d47b48b12793f001079"
    }, {
      "$oid": "53e38971b48b12793f0010ba"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e37c3eb48b12793f00106a"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "conversation between",
    "parent": {
      "$oid": "53e36a0bb48b12793f000d3c"
    },
    "taggings": [{
      "$oid": "53e37c69b48b12793f00106c"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e37c7cb48b12793f00106d"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "how to teach problem solving",
    "parent": {
      "$oid": "53e374adb48b12793f000d4c"
    },
    "taggings": [{
      "$oid": "53e37c9bb48b12793f00106f"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e37da2b48b12793f00107a"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "connections",
    "parent": {
      "$oid": "53e36a0bb48b12793f000d3c"
    },
    "taggings": [{
      "$oid": "53e37db1b48b12793f00107c"
    }, {
      "$oid": "53e37e33b48b12793f00108a"
    }, {
      "$oid": "53e37f9cb48b12793f00109f"
    }, {
      "$oid": "53e38adbb48b12793f0010d8"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e37e41b48b12793f00108b"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "online conversations",
    "parent": {
      "$oid": "53e36a0bb48b12793f000d3c"
    },
    "taggings": [{
      "$oid": "53e37e4cb48b12793f00108d"
    }, {
      "$oid": "53e37f4eb48b12793f00109d"
    }, {
      "$oid": "53e37faab48b12793f0010a1"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e37e94b48b12793f00108e"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "software future",
    "parent": {
      "$oid": "53e36a0bb48b12793f000d3c"
    },
    "taggings": [{
      "$oid": "53e37ec4b48b12793f001090"
    }, {
      "$oid": "53e37efeb48b12793f001095"
    }, {
      "$oid": "53e38959b48b12793f0010b8"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e37edbb48b12793f001091"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "pow software",
    "parent": {
      "$oid": "53e36cdbb48b12793f000d43"
    },
    "taggings": [{
      "$oid": "53e37eeeb48b12793f001093"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e37f0fb48b12793f001096"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "encompass software",
    "parent": {
      "$oid": "53e36cdbb48b12793f000d43"
    },
    "taggings": [{
      "$oid": "53e37f19b48b12793f001098"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e37f38b48b12793f001099"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "software timeline/next features",
    "parent": {
      "$oid": "53e374adb48b12793f000d4c"
    },
    "taggings": [{
      "$oid": "53e37f43b48b12793f00109b"
    }, {
      "$oid": "53e38ec6b48b12793f0010e3"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e38a96b48b12793f0010d2"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "whole group summaries",
    "parent": {
      "$oid": "53e36cdbb48b12793f000d43"
    },
    "taggings": [{
      "$oid": "53e38aa6b48b12793f0010d3"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }, {
    "_id": {
      "$oid": "53e38e28b48b12793f0010d9"
    },
    "children": [],
    "createDate": null,
    "createdBy": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "editors": [],
    "isTrashed": false,
    "name": "get good at anticipation",
    "parent": {
      "$oid": "53e374adb48b12793f000d4c"
    },
    "taggings": [{
      "$oid": "53e38e46b48b12793f0010db"
    }],
    "weight": null,
    "workspace": {
      "$oid": "53e36522b48b12793f000d3b"
    }
  }
];

var FoldersSeeder = Seeder.extend({
  shouldRun: function () {
    return Folder.count().exec().then(count => count === 0);
  },
  run: function () {
    return Folder.create(data);
  }
});

module.exports = FoldersSeeder;
