var Seeder = require('mongoose-data-seed').Seeder;
var Workspace = require('../server/datasource/schemas').Workspace;


var data = [
  {
    "_id": {
      "$oid": "53e1156db48b12793f000442"
    },
    "comments": [{
      "$oid": "53e12264b48b12793f000b84"
    }, {
      "$oid": "53e12507b48b12793f000b91"
    }],
    "createDate": {
      "$date": "2014-08-04T15:55:20.978Z"
    },
    "editors": [{
      "$oid": "53a43f7c729e9ef59ba7ebf2"
    }, {
      "$oid": "529518daba1cd3d8c4013344"
    }, {
      "$oid": "5b245760ac75842be3189525"
    }],
    "folders": [{
      "$oid": "53e11604b48b12793f0004ee"
    }, {
      "$oid": "53e1165eb48b12793f0005e7"
    }, {
      "$oid": "53e1166db48b12793f0005e9"
    }, {
      "$oid": "53e118f3b48b12793f000a41"
    }, {
      "$oid": "53e11b0ab48b12793f000ab1"
    }],
    "isTrashed": false,
    "mode": "private",
    "name": "Feathers and Fur / Period 5 Basic Math",
    "owner": {
      "$oid": "53d9a577729e9ef59ba7f118"
    },
    "selections": [{
      "$oid": "53e11942b48b12793f000a5f"
    }, {
      "$oid": "53e11b38b48b12793f000ab7"
    }, {
      "$oid": "53e11ec4b48b12793f000b34"
    }, {
      "$oid": "53e11f20b48b12793f000b3a"
    }, {
      "$oid": "53e11f82b48b12793f000b44"
    }, {
      "$oid": "53e12158b48b12793f000b68"
    }, {
      "$oid": "53e12211b48b12793f000b7e"
    }, {
      "$oid": "53e1223cb48b12793f000b80"
    }, {
      "$oid": "53e1223eb48b12793f000b81"
    }, {
      "$oid": "53e12503b48b12793f000b90"
    }],
    "submissionSet": {
      "criteria": {
        "puzzle": {
          "puzzleId": 421
        },
        "group": {
          "groupId": 103671
        }
      },
      "description": {
        "firstSubmissionDate": {
          "$date": "2013-11-20T19:51:39.445Z"
        },
        "lastSubmissionDate": {
          "$date": "2013-11-19T20:01:50.261Z"
        },
        "puzzle": {
          "title": "Feathers and Fur"
        },
        "group": {
          "name": "Period 5 Basic Math"
        },
        "publication": {
          "pubId": 4308
        }
      },
      "lastUpdated": {
        "$date": "2014-08-08T14:50:38.612Z"
      }
    },
    "submissions": [{
      "$oid": "53e1156db48b12793f000418"
    }, {
      "$oid": "53e1156db48b12793f00042e"
    }, {
      "$oid": "53e1156db48b12793f000420"
    }, {
      "$oid": "53e1156db48b12793f000425"
    }, {
      "$oid": "53e1156db48b12793f000416"
    }, {
      "$oid": "53e1156db48b12793f000421"
    }, {
      "$oid": "53e1156db48b12793f000432"
    }, {
      "$oid": "53e1156db48b12793f000436"
    }, {
      "$oid": "53e1156db48b12793f00041a"
    }, {
      "$oid": "53e1156db48b12793f00042f"
    }, {
      "$oid": "53e1156db48b12793f00041e"
    }, {
      "$oid": "53e1156db48b12793f000430"
    }, {
      "$oid": "53e1156db48b12793f00043e"
    }, {
      "$oid": "53e1156db48b12793f000419"
    }, {
      "$oid": "53e1156db48b12793f00042d"
    }, {
      "$oid": "53e1156db48b12793f000438"
    }, {
      "$oid": "53e1156db48b12793f00041b"
    }, {
      "$oid": "53e1156db48b12793f000434"
    }, {
      "$oid": "53e1156db48b12793f000417"
    }, {
      "$oid": "53e1156db48b12793f000427"
    }, {
      "$oid": "53e1156db48b12793f000423"
    }, {
      "$oid": "53e1156db48b12793f000440"
    }, {
      "$oid": "53e1156db48b12793f000407"
    }, {
      "$oid": "53e1156db48b12793f000437"
    }, {
      "$oid": "53e1156db48b12793f000422"
    }, {
      "$oid": "53e1156db48b12793f000433"
    }, {
      "$oid": "53e1156db48b12793f000428"
    }, {
      "$oid": "53e1156db48b12793f00043d"
    }, {
      "$oid": "53e1156db48b12793f00042c"
    }, {
      "$oid": "53e1156db48b12793f00041d"
    }, {
      "$oid": "53e1156db48b12793f000439"
    }, {
      "$oid": "53e1156db48b12793f000414"
    }, {
      "$oid": "53e1156db48b12793f00041f"
    }, {
      "$oid": "53e1156db48b12793f00043a"
    }, {
      "$oid": "53e1156db48b12793f000415"
    }, {
      "$oid": "53e1156db48b12793f000426"
    }],
    "taggings": [{
      "$oid": "53e1194bb48b12793f000a62"
    }, {
      "$oid": "53e11b5eb48b12793f000abb"
    }, {
      "$oid": "53e11eceb48b12793f000b36"
    }, {
      "$oid": "53e11fa8b48b12793f000b48"
    }, {
      "$oid": "53e12250b48b12793f000b83"
    }, {
      "$oid": "53e12518b48b12793f000b92"
    }],
    "responses": [{
      "$oid": "5b1aef7ae53645e768926123"
    }]
  }, {
    "_id": {
      "$oid": "53e36522b48b12793f000d3b"
    },
    "comments": [{
      "$oid": "53e37a4ab48b12793f00104c"
    }],
    "createDate": {
      "$date": "2014-08-04T15:55:20.978Z"
    },
    "editors": [{
      "$oid": "52964714e4bad7087700014e"
    }, {
      "$oid": "52b05fae729e9ef59ba7eb4d"
    }, {
      "$oid": "53d274a032f2863240001a71"
    }, {
      "$oid": "52964653e4bad7087700014b"
    }, {
      "$oid": "52a88def729e9ef59ba7eb4c"
    }, {
      "$oid": "5370dc9c8f3e3d1f21000022"
    }, {
      "$oid": "52a88ae2729e9ef59ba7eb4b"
    }, {
      "$oid": "529646eae4bad7087700014d"
    }, {
      "$oid": "53a355a932f2863240000026"
    }],
    "folders": [{
      "$oid": "53e36a0bb48b12793f000d3c"
    }, {
      "$oid": "53e36a31b48b12793f000d3d"
    }, {
      "$oid": "53e36ab5b48b12793f000d40"
    }, {
      "$oid": "53e36cdbb48b12793f000d43"
    }, {
      "$oid": "53e36d26b48b12793f000d45"
    }, {
      "$oid": "53e37466b48b12793f000d47"
    }, {
      "$oid": "53e374adb48b12793f000d4c"
    }, {
      "$oid": "53e374d2b48b12793f000d4e"
    }, {
      "$oid": "53e3751ab48b12793f000d50"
    }, {
      "$oid": "53e37554b48b12793f000d54"
    }, {
      "$oid": "53e37758b48b12793f001040"
    }, {
      "$oid": "53e377b5b48b12793f001044"
    }, {
      "$oid": "53e37aa4b48b12793f00104f"
    }, {
      "$oid": "53e37af0b48b12793f001054"
    }, {
      "$oid": "53e37b28b48b12793f001057"
    }, {
      "$oid": "53e37b47b48b12793f00105a"
    }, {
      "$oid": "53e37b71b48b12793f00105d"
    }, {
      "$oid": "53e37c3eb48b12793f00106a"
    }, {
      "$oid": "53e37c7cb48b12793f00106d"
    }, {
      "$oid": "53e37da2b48b12793f00107a"
    }, {
      "$oid": "53e37e41b48b12793f00108b"
    }, {
      "$oid": "53e37e94b48b12793f00108e"
    }, {
      "$oid": "53e37edbb48b12793f001091"
    }, {
      "$oid": "53e37f0fb48b12793f001096"
    }, {
      "$oid": "53e37f38b48b12793f001099"
    }, {
      "$oid": "53e38a96b48b12793f0010d2"
    }, {
      "$oid": "53e38e28b48b12793f0010d9"
    }],
    "isTrashed": false,
    "mode": "public",
    "name": "ESI 2014 Wednesday Reflection / EnCoMPASS Summer Institute 2014",
    "owner": {
      "$oid": "529518daba1cd3d8c4013344"
    },
    "selections": [{
      "$oid": "53e36a96b48b12793f000d3e"
    }, {
      "$oid": "53e36ac7b48b12793f000d41"
    }, {
      "$oid": "53e36d13b48b12793f000d44"
    }, {
      "$oid": "53e3746fb48b12793f000d48"
    }, {
      "$oid": "53e3748db48b12793f000d4a"
    }, {
      "$oid": "53e374c7b48b12793f000d4d"
    }, {
      "$oid": "53e37525b48b12793f000d51"
    }, {
      "$oid": "53e3753eb48b12793f000d53"
    }, {
      "$oid": "53e37571b48b12793f000d56"
    }, {
      "$oid": "53e37710b48b12793f00103c"
    }, {
      "$oid": "53e37724b48b12793f00103e"
    }, {
      "$oid": "53e37769b48b12793f001042"
    }, {
      "$oid": "53e379dfb48b12793f00104a"
    }, {
      "$oid": "53e37a83b48b12793f00104d"
    }, {
      "$oid": "53e37ab0b48b12793f001050"
    }, {
      "$oid": "53e37aceb48b12793f001052"
    }, {
      "$oid": "53e37afbb48b12793f001055"
    }, {
      "$oid": "53e37b34b48b12793f001058"
    }, {
      "$oid": "53e37b52b48b12793f00105b"
    }, {
      "$oid": "53e37b80b48b12793f00105e"
    }, {
      "$oid": "53e37b99b48b12793f001060"
    }, {
      "$oid": "53e37be2b48b12793f001066"
    }, {
      "$oid": "53e37c15b48b12793f001068"
    }, {
      "$oid": "53e37c63b48b12793f00106b"
    }, {
      "$oid": "53e37c87b48b12793f00106e"
    }, {
      "$oid": "53e37cb2b48b12793f001070"
    }, {
      "$oid": "53e37cecb48b12793f001072"
    }, {
      "$oid": "53e37d00b48b12793f001074"
    }, {
      "$oid": "53e37d21b48b12793f001076"
    }, {
      "$oid": "53e37d43b48b12793f001078"
    }, {
      "$oid": "53e37daeb48b12793f00107b"
    }, {
      "$oid": "53e37db9b48b12793f00107d"
    }, {
      "$oid": "53e37dcfb48b12793f00107f"
    }, {
      "$oid": "53e37de2b48b12793f001081"
    }, {
      "$oid": "53e37df2b48b12793f001083"
    }, {
      "$oid": "53e37e02b48b12793f001085"
    }, {
      "$oid": "53e37e1cb48b12793f001087"
    }, {
      "$oid": "53e37e2eb48b12793f001089"
    }, {
      "$oid": "53e37e46b48b12793f00108c"
    }, {
      "$oid": "53e37eb4b48b12793f00108f"
    }, {
      "$oid": "53e37eebb48b12793f001092"
    }, {
      "$oid": "53e37ef7b48b12793f001094"
    }, {
      "$oid": "53e37f14b48b12793f001097"
    }, {
      "$oid": "53e37f3cb48b12793f00109a"
    }, {
      "$oid": "53e37f4bb48b12793f00109c"
    }, {
      "$oid": "53e37f97b48b12793f00109e"
    }, {
      "$oid": "53e37fa8b48b12793f0010a0"
    }, {
      "$oid": "53e3894fb48b12793f0010b4"
    }, {
      "$oid": "53e38965b48b12793f0010b9"
    }, {
      "$oid": "53e3898eb48b12793f0010bb"
    }, {
      "$oid": "53e38a6bb48b12793f0010cc"
    }, {
      "$oid": "53e38a77b48b12793f0010ce"
    }, {
      "$oid": "53e38ac3b48b12793f0010d4"
    }, {
      "$oid": "53e38ad0b48b12793f0010d6"
    }, {
      "$oid": "53e38ad7b48b12793f0010d7"
    }, {
      "$oid": "53e38e41b48b12793f0010da"
    }, {
      "$oid": "53e38e4cb48b12793f0010dc"
    }, {
      "$oid": "53e38e83b48b12793f0010de"
    }, {
      "$oid": "53e38eaab48b12793f0010e0"
    }, {
      "$oid": "53e38ec2b48b12793f0010e2"
    }, {
      "$oid": "53e38ec9b48b12793f0010e4"
    }],
    "submissionSet": {
      "criteria": {
        "puzzle": {
          "puzzleId": 17133
        },
        "group": {
          "groupId": 106870
        }
      },
      "description": {
        "firstSubmissionDate": {
          "$date": "2014-08-06T20:42:42.201Z"
        },
        "lastSubmissionDate": {
          "$date": "2014-08-06T21:01:41.598Z"
        },
        "puzzle": {
          "title": "ESI 2014 Wednesday Reflection"
        },
        "group": {
          "name": "EnCoMPASS Summer Institute 2014"
        },
        "publication": {
          "pubId": 4448
        }
      },
      "lastUpdated": {
        "$date": "2014-08-07T11:38:53.190Z"
      }
    },
    "submissions": [{
      "$oid": "53e36522729e9ef59ba7f4dd"
    }, {
      "$oid": "53e36522729e9ef59ba7f4dc"
    }, {
      "$oid": "53e36522729e9ef59ba7f4da"
    }, {
      "$oid": "53e36522729e9ef59ba7f4d3"
    }, {
      "$oid": "53e36522729e9ef59ba7f4d2"
    }, {
      "$oid": "53e36522729e9ef59ba7f4d6"
    }, {
      "$oid": "53e36522729e9ef59ba7f4e1"
    }, {
      "$oid": "53e36522729e9ef59ba7f4d9"
    }, {
      "$oid": "53e36522729e9ef59ba7f4d4"
    }, {
      "$oid": "53e36522729e9ef59ba7f4db"
    }, {
      "$oid": "53e36522729e9ef59ba7f4d7"
    }, {
      "$oid": "53e36522729e9ef59ba7f4d5"
    }, {
      "$oid": "53e36522729e9ef59ba7f4e2"
    }, {
      "$oid": "53e36522729e9ef59ba7f4d8"
    }, {
      "$oid": "53e36522729e9ef59ba7f4df"
    }, {
      "$oid": "53e36522729e9ef59ba7f4e0"
    }, {
      "$oid": "53e36522729e9ef59ba7f4de"
    }],
    "taggings": [{
      "$oid": "53e36ad3b48b12793f000d42"
    }, {
      "$oid": "53e36d2bb48b12793f000d46"
    }, {
      "$oid": "53e37478b48b12793f000d49"
    }, {
      "$oid": "53e37492b48b12793f000d4b"
    }, {
      "$oid": "53e374dcb48b12793f000d4f"
    }, {
      "$oid": "53e37529b48b12793f000d52"
    }, {
      "$oid": "53e37560b48b12793f000d55"
    }, {
      "$oid": "53e37583b48b12793f000d57"
    }, {
      "$oid": "53e37715b48b12793f00103d"
    }, {
      "$oid": "53e3772cb48b12793f00103f"
    }, {
      "$oid": "53e3777cb48b12793f001043"
    }, {
      "$oid": "53e379e4b48b12793f00104b"
    }, {
      "$oid": "53e37a87b48b12793f00104e"
    }, {
      "$oid": "53e37ab7b48b12793f001051"
    }, {
      "$oid": "53e37ad4b48b12793f001053"
    }, {
      "$oid": "53e37b0eb48b12793f001056"
    }, {
      "$oid": "53e37b3bb48b12793f001059"
    }, {
      "$oid": "53e37b57b48b12793f00105c"
    }, {
      "$oid": "53e37b8ab48b12793f00105f"
    }, {
      "$oid": "53e37ba1b48b12793f001061"
    }, {
      "$oid": "53e37be8b48b12793f001067"
    }, {
      "$oid": "53e37c1ab48b12793f001069"
    }, {
      "$oid": "53e37c69b48b12793f00106c"
    }, {
      "$oid": "53e37c9bb48b12793f00106f"
    }, {
      "$oid": "53e37cc1b48b12793f001071"
    }, {
      "$oid": "53e37cf5b48b12793f001073"
    }, {
      "$oid": "53e37d05b48b12793f001075"
    }, {
      "$oid": "53e37d27b48b12793f001077"
    }, {
      "$oid": "53e37d47b48b12793f001079"
    }, {
      "$oid": "53e37db1b48b12793f00107c"
    }, {
      "$oid": "53e37dc3b48b12793f00107e"
    }, {
      "$oid": "53e37dd7b48b12793f001080"
    }, {
      "$oid": "53e37deab48b12793f001082"
    }, {
      "$oid": "53e37df8b48b12793f001084"
    }, {
      "$oid": "53e37e07b48b12793f001086"
    }, {
      "$oid": "53e37e23b48b12793f001088"
    }, {
      "$oid": "53e37e33b48b12793f00108a"
    }, {
      "$oid": "53e37e4cb48b12793f00108d"
    }, {
      "$oid": "53e37ec4b48b12793f001090"
    }, {
      "$oid": "53e37eeeb48b12793f001093"
    }, {
      "$oid": "53e37efeb48b12793f001095"
    }, {
      "$oid": "53e37f19b48b12793f001098"
    }, {
      "$oid": "53e37f43b48b12793f00109b"
    }, {
      "$oid": "53e37f4eb48b12793f00109d"
    }, {
      "$oid": "53e37f9cb48b12793f00109f"
    }, {
      "$oid": "53e37faab48b12793f0010a1"
    }, {
      "$oid": "53e38959b48b12793f0010b8"
    }, {
      "$oid": "53e38971b48b12793f0010ba"
    }, {
      "$oid": "53e38a53b48b12793f0010cb"
    }, {
      "$oid": "53e38a6fb48b12793f0010cd"
    }, {
      "$oid": "53e38aa6b48b12793f0010d3"
    }, {
      "$oid": "53e38accb48b12793f0010d5"
    }, {
      "$oid": "53e38adbb48b12793f0010d8"
    }, {
      "$oid": "53e38e46b48b12793f0010db"
    }, {
      "$oid": "53e38e5eb48b12793f0010dd"
    }, {
      "$oid": "53e38ea3b48b12793f0010df"
    }, {
      "$oid": "53e38eb2b48b12793f0010e1"
    }, {
      "$oid": "53e38ec6b48b12793f0010e3"
    }, {
      "$oid": "53e38edcb48b12793f0010e5"
    }, {
      "$oid": "53e36a9bb48b12793f000d3f"
    }],
    "responses": []
  }
];

var WorkspacesSeeder = Seeder.extend({
  shouldRun: function () {
    return Workspace.count().exec().then(count => count === 0);
  },
  run: function () {
    return Workspace.create(data);
  }
});

module.exports = WorkspacesSeeder;
