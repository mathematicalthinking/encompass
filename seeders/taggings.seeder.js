var Seeder = require('mongoose-data-seed').Seeder;
var Tagging = require('../server/datasource/schemas').Tagging;

var data = [
{
  "_id": {
    "$oid": "53e1194bb48b12793f000a62"
  },
  "createdBy": {
    "$oid": "53d9a577729e9ef59ba7f118"
  },
  "workspace": {
    "$oid": "53e1156db48b12793f000442"
  },
  "selection": {
    "$oid": "53e11942b48b12793f000a5f"
  },
  "folder": {
    "$oid": "53e118f3b48b12793f000a41"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-05T17:50:03.980Z"
  }
}, {
  "_id": {
    "$oid": "53e11b5eb48b12793f000abb"
  },
  "createdBy": {
    "$oid": "53d9a577729e9ef59ba7f118"
  },
  "workspace": {
    "$oid": "53e1156db48b12793f000442"
  },
  "selection": {
    "$oid": "53e11b38b48b12793f000ab7"
  },
  "folder": {
    "$oid": "53e11b0ab48b12793f000ab1"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-05T17:58:54.684Z"
  }
}, {
  "_id": {
    "$oid": "53e11eceb48b12793f000b36"
  },
  "createdBy": {
    "$oid": "53d9a577729e9ef59ba7f118"
  },
  "workspace": {
    "$oid": "53e1156db48b12793f000442"
  },
  "selection": {
    "$oid": "53e11ec4b48b12793f000b34"
  },
  "folder": {
    "$oid": "53e118f3b48b12793f000a41"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-05T18:13:34.537Z"
  }
}, {
  "_id": {
    "$oid": "53e11fa8b48b12793f000b48"
  },
  "createdBy": {
    "$oid": "53d9a577729e9ef59ba7f118"
  },
  "workspace": {
    "$oid": "53e1156db48b12793f000442"
  },
  "selection": {
    "$oid": "53e11f82b48b12793f000b44"
  },
  "folder": {
    "$oid": "53e118f3b48b12793f000a41"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-05T18:17:12.905Z"
  }
}, {
  "_id": {
    "$oid": "53e12250b48b12793f000b83"
  },
  "createdBy": {
    "$oid": "53d9a577729e9ef59ba7f118"
  },
  "workspace": {
    "$oid": "53e1156db48b12793f000442"
  },
  "selection": {
    "$oid": "53e1223cb48b12793f000b80"
  },
  "folder": {
    "$oid": "53e118f3b48b12793f000a41"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-05T18:28:32.203Z"
  }
}, {
  "_id": {
    "$oid": "53e12518b48b12793f000b92"
  },
  "createdBy": {
    "$oid": "53a43f7c729e9ef59ba7ebf2"
  },
  "workspace": {
    "$oid": "53e1156db48b12793f000442"
  },
  "selection": {
    "$oid": "53e12503b48b12793f000b90"
  },
  "folder": {
    "$oid": "53e1165eb48b12793f0005e7"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-05T18:40:24.372Z"
  }
}, {
  "_id": {
    "$oid": "53e36a9bb48b12793f000d3f"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e36a96b48b12793f000d3e"
  },
  "folder": {
    "$oid": "53e36a31b48b12793f000d3d"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T12:01:31.327Z"
  }
}, {
  "_id": {
    "$oid": "53e36ad3b48b12793f000d42"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e36ac7b48b12793f000d41"
  },
  "folder": {
    "$oid": "53e36ab5b48b12793f000d40"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T12:02:27.345Z"
  }
}, {
  "_id": {
    "$oid": "53e36d2bb48b12793f000d46"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e36d13b48b12793f000d44"
  },
  "folder": {
    "$oid": "53e36d26b48b12793f000d45"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T12:12:27.512Z"
  }
}, {
  "_id": {
    "$oid": "53e37478b48b12793f000d49"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e3746fb48b12793f000d48"
  },
  "folder": {
    "$oid": "53e37466b48b12793f000d47"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T12:43:36.965Z"
  }
}, {
  "_id": {
    "$oid": "53e37492b48b12793f000d4b"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e3748db48b12793f000d4a"
  },
  "folder": {
    "$oid": "53e36a31b48b12793f000d3d"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T12:44:02.465Z"
  }
}, {
  "_id": {
    "$oid": "53e374dcb48b12793f000d4f"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e374c7b48b12793f000d4d"
  },
  "folder": {
    "$oid": "53e374d2b48b12793f000d4e"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T12:45:16.501Z"
  }
}, {
  "_id": {
    "$oid": "53e37529b48b12793f000d52"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37525b48b12793f000d51"
  },
  "folder": {
    "$oid": "53e3751ab48b12793f000d50"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T12:46:33.162Z"
  }
}, {
  "_id": {
    "$oid": "53e37560b48b12793f000d55"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e3753eb48b12793f000d53"
  },
  "folder": {
    "$oid": "53e37554b48b12793f000d54"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T12:47:28.054Z"
  }
}, {
  "_id": {
    "$oid": "53e37583b48b12793f000d57"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37571b48b12793f000d56"
  },
  "folder": {
    "$oid": "53e37466b48b12793f000d47"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T12:48:03.875Z"
  }
}, {
  "_id": {
    "$oid": "53e37715b48b12793f00103d"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37710b48b12793f00103c"
  },
  "folder": {
    "$oid": "53e36a31b48b12793f000d3d"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T12:54:45.645Z"
  }
}, {
  "_id": {
    "$oid": "53e3772cb48b12793f00103f"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37724b48b12793f00103e"
  },
  "folder": {
    "$oid": "53e36d26b48b12793f000d45"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T12:55:08.441Z"
  }
}, {
  "_id": {
    "$oid": "53e3777cb48b12793f001043"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37769b48b12793f001042"
  },
  "folder": {
    "$oid": "53e37758b48b12793f001040"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T12:56:28.046Z"
  }
}, {
  "_id": {
    "$oid": "53e379e4b48b12793f00104b"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e379dfb48b12793f00104a"
  },
  "folder": {
    "$oid": "53e37466b48b12793f000d47"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:06:44.485Z"
  }
}, {
  "_id": {
    "$oid": "53e37a87b48b12793f00104e"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37a83b48b12793f00104d"
  },
  "folder": {
    "$oid": "53e36a31b48b12793f000d3d"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:09:27.541Z"
  }
}, {
  "_id": {
    "$oid": "53e37ab7b48b12793f001051"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37ab0b48b12793f001050"
  },
  "folder": {
    "$oid": "53e37aa4b48b12793f00104f"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:10:15.534Z"
  }
}, {
  "_id": {
    "$oid": "53e37ad4b48b12793f001053"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37aceb48b12793f001052"
  },
  "folder": {
    "$oid": "53e36a31b48b12793f000d3d"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:10:44.426Z"
  }
}, {
  "_id": {
    "$oid": "53e37b0eb48b12793f001056"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37afbb48b12793f001055"
  },
  "folder": {
    "$oid": "53e37af0b48b12793f001054"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:11:42.957Z"
  }
}, {
  "_id": {
    "$oid": "53e37b3bb48b12793f001059"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37b34b48b12793f001058"
  },
  "folder": {
    "$oid": "53e37b28b48b12793f001057"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:12:27.121Z"
  }
}, {
  "_id": {
    "$oid": "53e37b57b48b12793f00105c"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37b52b48b12793f00105b"
  },
  "folder": {
    "$oid": "53e37b47b48b12793f00105a"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:12:55.919Z"
  }
}, {
  "_id": {
    "$oid": "53e37b8ab48b12793f00105f"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37b80b48b12793f00105e"
  },
  "folder": {
    "$oid": "53e37b71b48b12793f00105d"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:13:46.641Z"
  }
}, {
  "_id": {
    "$oid": "53e37ba1b48b12793f001061"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37b99b48b12793f001060"
  },
  "folder": {
    "$oid": "53e37aa4b48b12793f00104f"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:14:09.112Z"
  }
}, {
  "_id": {
    "$oid": "53e37be8b48b12793f001067"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37be2b48b12793f001066"
  },
  "folder": {
    "$oid": "53e37b28b48b12793f001057"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:15:20.805Z"
  }
}, {
  "_id": {
    "$oid": "53e37c1ab48b12793f001069"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37c15b48b12793f001068"
  },
  "folder": {
    "$oid": "53e37b71b48b12793f00105d"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:16:10.935Z"
  }
}, {
  "_id": {
    "$oid": "53e37c69b48b12793f00106c"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37c63b48b12793f00106b"
  },
  "folder": {
    "$oid": "53e37c3eb48b12793f00106a"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:17:29.989Z"
  }
}, {
  "_id": {
    "$oid": "53e37c9bb48b12793f00106f"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37c87b48b12793f00106e"
  },
  "folder": {
    "$oid": "53e37c7cb48b12793f00106d"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:18:19.114Z"
  }
}, {
  "_id": {
    "$oid": "53e37cc1b48b12793f001071"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37cb2b48b12793f001070"
  },
  "folder": {
    "$oid": "53e37b28b48b12793f001057"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:18:57.811Z"
  }
}, {
  "_id": {
    "$oid": "53e37cf5b48b12793f001073"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37cecb48b12793f001072"
  },
  "folder": {
    "$oid": "53e37af0b48b12793f001054"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:19:49.549Z"
  }
}, {
  "_id": {
    "$oid": "53e37d05b48b12793f001075"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37d00b48b12793f001074"
  },
  "folder": {
    "$oid": "53e37aa4b48b12793f00104f"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:20:05.607Z"
  }
}, {
  "_id": {
    "$oid": "53e37d27b48b12793f001077"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37d21b48b12793f001076"
  },
  "folder": {
    "$oid": "53e37af0b48b12793f001054"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:20:39.711Z"
  }
}, {
  "_id": {
    "$oid": "53e37d47b48b12793f001079"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37d43b48b12793f001078"
  },
  "folder": {
    "$oid": "53e37b71b48b12793f00105d"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:21:11.627Z"
  }
}, {
  "_id": {
    "$oid": "53e37db1b48b12793f00107c"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37daeb48b12793f00107b"
  },
  "folder": {
    "$oid": "53e37da2b48b12793f00107a"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:22:57.216Z"
  }
}, {
  "_id": {
    "$oid": "53e37dc3b48b12793f00107e"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37db9b48b12793f00107d"
  },
  "folder": {
    "$oid": "53e36a31b48b12793f000d3d"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:23:15.216Z"
  }
}, {
  "_id": {
    "$oid": "53e37dd7b48b12793f001080"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37dcfb48b12793f00107f"
  },
  "folder": {
    "$oid": "53e37af0b48b12793f001054"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:23:35.702Z"
  }
}, {
  "_id": {
    "$oid": "53e37deab48b12793f001082"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37de2b48b12793f001081"
  },
  "folder": {
    "$oid": "53e377b5b48b12793f001044"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:23:54.299Z"
  }
}, {
  "_id": {
    "$oid": "53e37df8b48b12793f001084"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37df2b48b12793f001083"
  },
  "folder": {
    "$oid": "53e377b5b48b12793f001044"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:24:08.694Z"
  }
}, {
  "_id": {
    "$oid": "53e37e07b48b12793f001086"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37e02b48b12793f001085"
  },
  "folder": {
    "$oid": "53e36d26b48b12793f000d45"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:24:23.402Z"
  }
}, {
  "_id": {
    "$oid": "53e37e23b48b12793f001088"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37e1cb48b12793f001087"
  },
  "folder": {
    "$oid": "53e37aa4b48b12793f00104f"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:24:51.099Z"
  }
}, {
  "_id": {
    "$oid": "53e37e33b48b12793f00108a"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37e2eb48b12793f001089"
  },
  "folder": {
    "$oid": "53e37da2b48b12793f00107a"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:25:07.832Z"
  }
}, {
  "_id": {
    "$oid": "53e37e4cb48b12793f00108d"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37e46b48b12793f00108c"
  },
  "folder": {
    "$oid": "53e37e41b48b12793f00108b"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:25:32.104Z"
  }
}, {
  "_id": {
    "$oid": "53e37ec4b48b12793f001090"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37eb4b48b12793f00108f"
  },
  "folder": {
    "$oid": "53e37e94b48b12793f00108e"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:27:32.421Z"
  }
}, {
  "_id": {
    "$oid": "53e37eeeb48b12793f001093"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37eebb48b12793f001092"
  },
  "folder": {
    "$oid": "53e37edbb48b12793f001091"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:28:14.780Z"
  }
}, {
  "_id": {
    "$oid": "53e37efeb48b12793f001095"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37ef7b48b12793f001094"
  },
  "folder": {
    "$oid": "53e37e94b48b12793f00108e"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:28:30.591Z"
  }
}, {
  "_id": {
    "$oid": "53e37f19b48b12793f001098"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37f14b48b12793f001097"
  },
  "folder": {
    "$oid": "53e37f0fb48b12793f001096"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:28:57.003Z"
  }
}, {
  "_id": {
    "$oid": "53e37f43b48b12793f00109b"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37f3cb48b12793f00109a"
  },
  "folder": {
    "$oid": "53e37f38b48b12793f001099"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:29:39.017Z"
  }
}, {
  "_id": {
    "$oid": "53e37f4eb48b12793f00109d"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37f4bb48b12793f00109c"
  },
  "folder": {
    "$oid": "53e37e41b48b12793f00108b"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:29:50.690Z"
  }
}, {
  "_id": {
    "$oid": "53e37f9cb48b12793f00109f"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37f97b48b12793f00109e"
  },
  "folder": {
    "$oid": "53e37da2b48b12793f00107a"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:31:08.206Z"
  }
}, {
  "_id": {
    "$oid": "53e37faab48b12793f0010a1"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e37fa8b48b12793f0010a0"
  },
  "folder": {
    "$oid": "53e37e41b48b12793f00108b"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T13:31:22.605Z"
  }
}, {
  "_id": {
    "$oid": "53e38959b48b12793f0010b8"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e3894fb48b12793f0010b4"
  },
  "folder": {
    "$oid": "53e37e94b48b12793f00108e"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T14:12:41.515Z"
  }
}, {
  "_id": {
    "$oid": "53e38971b48b12793f0010ba"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e38965b48b12793f0010b9"
  },
  "folder": {
    "$oid": "53e37b71b48b12793f00105d"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T14:13:05.049Z"
  }
}, {
  "_id": {
    "$oid": "53e38a53b48b12793f0010cb"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e3898eb48b12793f0010bb"
  },
  "folder": {
    "$oid": "53e37af0b48b12793f001054"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T14:16:51.427Z"
  }
}, {
  "_id": {
    "$oid": "53e38a6fb48b12793f0010cd"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e38a6bb48b12793f0010cc"
  },
  "folder": {
    "$oid": "53e37554b48b12793f000d54"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T14:17:19.900Z"
  }
}, {
  "_id": {
    "$oid": "53e38aa6b48b12793f0010d3"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e38a77b48b12793f0010ce"
  },
  "folder": {
    "$oid": "53e38a96b48b12793f0010d2"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T14:18:14.023Z"
  }
}, {
  "_id": {
    "$oid": "53e38accb48b12793f0010d5"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e38ac3b48b12793f0010d4"
  },
  "folder": {
    "$oid": "53e36a31b48b12793f000d3d"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T14:18:52.991Z"
  }
}, {
  "_id": {
    "$oid": "53e38adbb48b12793f0010d8"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e38ad7b48b12793f0010d7"
  },
  "folder": {
    "$oid": "53e37da2b48b12793f00107a"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T14:19:07.787Z"
  }
}, {
  "_id": {
    "$oid": "53e38e46b48b12793f0010db"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e38e41b48b12793f0010da"
  },
  "folder": {
    "$oid": "53e38e28b48b12793f0010d9"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T14:33:42.374Z"
  }
}, {
  "_id": {
    "$oid": "53e38e5eb48b12793f0010dd"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e38e4cb48b12793f0010dc"
  },
  "folder": {
    "$oid": "53e37aa4b48b12793f00104f"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T14:34:06.523Z"
  }
}, {
  "_id": {
    "$oid": "53e38ea3b48b12793f0010df"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e38e83b48b12793f0010de"
  },
  "folder": {
    "$oid": "53e36a31b48b12793f000d3d"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T14:35:15.426Z"
  }
}, {
  "_id": {
    "$oid": "53e38eb2b48b12793f0010e1"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e38eaab48b12793f0010e0"
  },
  "folder": {
    "$oid": "53e37b28b48b12793f001057"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T14:35:30.069Z"
  }
}, {
  "_id": {
    "$oid": "53e38ec6b48b12793f0010e3"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e38ec2b48b12793f0010e2"
  },
  "folder": {
    "$oid": "53e37f38b48b12793f001099"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T14:35:50.565Z"
  }
}, {
  "_id": {
    "$oid": "53e38edcb48b12793f0010e5"
  },
  "createdBy": {
    "$oid": "529518daba1cd3d8c4013344"
  },
  "workspace": {
    "$oid": "53e36522b48b12793f000d3b"
  },
  "selection": {
    "$oid": "53e38ec9b48b12793f0010e4"
  },
  "folder": {
    "$oid": "53e36d26b48b12793f000d45"
  },
  "isTrashed": false,
  "createDate": {
    "$date": "2014-08-07T14:36:12.153Z"
  }
}
];

var TaggingsSeeder = Seeder.extend({
  shouldRun: function () {
    return Tagging.count().exec().then(count => count === 0);
  },
  run: function () {
    return Tagging.create(data);
  }
});

module.exports = TaggingsSeeder;
