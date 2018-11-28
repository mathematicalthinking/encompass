var Seeder = require('mongoose-data-seed').Seeder;
var Tagging = require('../server/datasource/schemas').Tagging;

var data = [
    {
    _id: "53e1194bb48b12793f000a62",
    createDate: "2014-08-05T17:50:03.980Z",
    createdBy: "53d9a577729e9ef59ba7f118",
    folder: "53e118f3b48b12793f000a41",
    isTrashed: false,
    selection: "53e11942b48b12793f000a5f",
    workspace: "53e1156db48b12793f000442"
  },
    {
    _id: "53e11b5eb48b12793f000abb",
    createDate: "2014-08-05T17:58:54.684Z",
    createdBy: "53d9a577729e9ef59ba7f118",
    folder: "53e11b0ab48b12793f000ab1",
    isTrashed: false,
    selection: "53e11b38b48b12793f000ab7",
    workspace: "53e1156db48b12793f000442"
  },
    {
    _id: "53e11eceb48b12793f000b36",
    createDate: "2014-08-05T18:13:34.537Z",
    createdBy: "53d9a577729e9ef59ba7f118",
    folder: "53e118f3b48b12793f000a41",
    isTrashed: false,
    selection: "53e11ec4b48b12793f000b34",
    workspace: "53e1156db48b12793f000442"
  },
    {
    _id: "53e11fa8b48b12793f000b48",
    createDate: "2014-08-05T18:17:12.905Z",
    createdBy: "53d9a577729e9ef59ba7f118",
    folder: "53e118f3b48b12793f000a41",
    isTrashed: false,
    selection: "53e11f82b48b12793f000b44",
    workspace: "53e1156db48b12793f000442"
  },
    {
    _id: "53e12250b48b12793f000b83",
    createDate: "2014-08-05T18:28:32.203Z",
    createdBy: "53d9a577729e9ef59ba7f118",
    folder: "53e118f3b48b12793f000a41",
    isTrashed: false,
    selection: "53e1223cb48b12793f000b80",
    workspace: "53e1156db48b12793f000442"
  },
    {
    _id: "53e12518b48b12793f000b92",
    createDate: "2014-08-05T18:40:24.372Z",
    createdBy: "53a43f7c729e9ef59ba7ebf2",
    folder: "53e1165eb48b12793f0005e7",
    isTrashed: false,
    selection: "53e12503b48b12793f000b90",
    workspace: "53e1156db48b12793f000442"
  },
    {
    _id: "53e36a9bb48b12793f000d3f",
    createDate: "2014-08-07T12:01:31.327Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e36a31b48b12793f000d3d",
    isTrashed: false,
    selection: "53e36a96b48b12793f000d3e",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e36ad3b48b12793f000d42",
    createDate: "2014-08-07T12:02:27.345Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e36ab5b48b12793f000d40",
    isTrashed: false,
    selection: "53e36ac7b48b12793f000d41",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e36d2bb48b12793f000d46",
    createDate: "2014-08-07T12:12:27.512Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e36d26b48b12793f000d45",
    isTrashed: false,
    selection: "53e36d13b48b12793f000d44",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37478b48b12793f000d49",
    createDate: "2014-08-07T12:43:36.965Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37466b48b12793f000d47",
    isTrashed: false,
    selection: "53e3746fb48b12793f000d48",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37492b48b12793f000d4b",
    createDate: "2014-08-07T12:44:02.465Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e36a31b48b12793f000d3d",
    isTrashed: false,
    selection: "53e3748db48b12793f000d4a",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e374dcb48b12793f000d4f",
    createDate: "2014-08-07T12:45:16.501Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e374d2b48b12793f000d4e",
    isTrashed: false,
    selection: "53e374c7b48b12793f000d4d",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37529b48b12793f000d52",
    createDate: "2014-08-07T12:46:33.162Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e3751ab48b12793f000d50",
    isTrashed: false,
    selection: "53e37525b48b12793f000d51",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37560b48b12793f000d55",
    createDate: "2014-08-07T12:47:28.054Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37554b48b12793f000d54",
    isTrashed: false,
    selection: "53e3753eb48b12793f000d53",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37583b48b12793f000d57",
    createDate: "2014-08-07T12:48:03.875Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37466b48b12793f000d47",
    isTrashed: false,
    selection: "53e37571b48b12793f000d56",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37715b48b12793f00103d",
    createDate: "2014-08-07T12:54:45.645Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e36a31b48b12793f000d3d",
    isTrashed: false,
    selection: "53e37710b48b12793f00103c",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e3772cb48b12793f00103f",
    createDate: "2014-08-07T12:55:08.441Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e36d26b48b12793f000d45",
    isTrashed: false,
    selection: "53e37724b48b12793f00103e",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e3777cb48b12793f001043",
    createDate: "2014-08-07T12:56:28.046Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37758b48b12793f001040",
    isTrashed: false,
    selection: "53e37769b48b12793f001042",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e379e4b48b12793f00104b",
    createDate: "2014-08-07T13:06:44.485Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37466b48b12793f000d47",
    isTrashed: false,
    selection: "53e379dfb48b12793f00104a",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37a87b48b12793f00104e",
    createDate: "2014-08-07T13:09:27.541Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e36a31b48b12793f000d3d",
    isTrashed: false,
    selection: "53e37a83b48b12793f00104d",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37ab7b48b12793f001051",
    createDate: "2014-08-07T13:10:15.534Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37aa4b48b12793f00104f",
    isTrashed: false,
    selection: "53e37ab0b48b12793f001050",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37ad4b48b12793f001053",
    createDate: "2014-08-07T13:10:44.426Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e36a31b48b12793f000d3d",
    isTrashed: false,
    selection: "53e37aceb48b12793f001052",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37b0eb48b12793f001056",
    createDate: "2014-08-07T13:11:42.957Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37af0b48b12793f001054",
    isTrashed: false,
    selection: "53e37afbb48b12793f001055",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37b3bb48b12793f001059",
    createDate: "2014-08-07T13:12:27.121Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37b28b48b12793f001057",
    isTrashed: false,
    selection: "53e37b34b48b12793f001058",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37b57b48b12793f00105c",
    createDate: "2014-08-07T13:12:55.919Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37b47b48b12793f00105a",
    isTrashed: false,
    selection: "53e37b52b48b12793f00105b",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37b8ab48b12793f00105f",
    createDate: "2014-08-07T13:13:46.641Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37b71b48b12793f00105d",
    isTrashed: false,
    selection: "53e37b80b48b12793f00105e",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37ba1b48b12793f001061",
    createDate: "2014-08-07T13:14:09.112Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37aa4b48b12793f00104f",
    isTrashed: false,
    selection: "53e37b99b48b12793f001060",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37be8b48b12793f001067",
    createDate: "2014-08-07T13:15:20.805Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37b28b48b12793f001057",
    isTrashed: false,
    selection: "53e37be2b48b12793f001066",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37c1ab48b12793f001069",
    createDate: "2014-08-07T13:16:10.935Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37b71b48b12793f00105d",
    isTrashed: false,
    selection: "53e37c15b48b12793f001068",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37c69b48b12793f00106c",
    createDate: "2014-08-07T13:17:29.989Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37c3eb48b12793f00106a",
    isTrashed: false,
    selection: "53e37c63b48b12793f00106b",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37c9bb48b12793f00106f",
    createDate: "2014-08-07T13:18:19.114Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37c7cb48b12793f00106d",
    isTrashed: false,
    selection: "53e37c87b48b12793f00106e",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37cc1b48b12793f001071",
    createDate: "2014-08-07T13:18:57.811Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37b28b48b12793f001057",
    isTrashed: false,
    selection: "53e37cb2b48b12793f001070",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37cf5b48b12793f001073",
    createDate: "2014-08-07T13:19:49.549Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37af0b48b12793f001054",
    isTrashed: false,
    selection: "53e37cecb48b12793f001072",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37d05b48b12793f001075",
    createDate: "2014-08-07T13:20:05.607Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37aa4b48b12793f00104f",
    isTrashed: false,
    selection: "53e37d00b48b12793f001074",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37d27b48b12793f001077",
    createDate: "2014-08-07T13:20:39.711Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37af0b48b12793f001054",
    isTrashed: false,
    selection: "53e37d21b48b12793f001076",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37d47b48b12793f001079",
    createDate: "2014-08-07T13:21:11.627Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37b71b48b12793f00105d",
    isTrashed: false,
    selection: "53e37d43b48b12793f001078",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37db1b48b12793f00107c",
    createDate: "2014-08-07T13:22:57.216Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37da2b48b12793f00107a",
    isTrashed: false,
    selection: "53e37daeb48b12793f00107b",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37dc3b48b12793f00107e",
    createDate: "2014-08-07T13:23:15.216Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e36a31b48b12793f000d3d",
    isTrashed: false,
    selection: "53e37db9b48b12793f00107d",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37dd7b48b12793f001080",
    createDate: "2014-08-07T13:23:35.702Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37af0b48b12793f001054",
    isTrashed: false,
    selection: "53e37dcfb48b12793f00107f",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37deab48b12793f001082",
    createDate: "2014-08-07T13:23:54.299Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e377b5b48b12793f001044",
    isTrashed: false,
    selection: "53e37de2b48b12793f001081",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37df8b48b12793f001084",
    createDate: "2014-08-07T13:24:08.694Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e377b5b48b12793f001044",
    isTrashed: false,
    selection: "53e37df2b48b12793f001083",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37e07b48b12793f001086",
    createDate: "2014-08-07T13:24:23.402Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e36d26b48b12793f000d45",
    isTrashed: false,
    selection: "53e37e02b48b12793f001085",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37e23b48b12793f001088",
    createDate: "2014-08-07T13:24:51.099Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37aa4b48b12793f00104f",
    isTrashed: false,
    selection: "53e37e1cb48b12793f001087",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37e33b48b12793f00108a",
    createDate: "2014-08-07T13:25:07.832Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37da2b48b12793f00107a",
    isTrashed: false,
    selection: "53e37e2eb48b12793f001089",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37e4cb48b12793f00108d",
    createDate: "2014-08-07T13:25:32.104Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37e41b48b12793f00108b",
    isTrashed: false,
    selection: "53e37e46b48b12793f00108c",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37ec4b48b12793f001090",
    createDate: "2014-08-07T13:27:32.421Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37e94b48b12793f00108e",
    isTrashed: false,
    selection: "53e37eb4b48b12793f00108f",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37eeeb48b12793f001093",
    createDate: "2014-08-07T13:28:14.780Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37edbb48b12793f001091",
    isTrashed: false,
    selection: "53e37eebb48b12793f001092",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37efeb48b12793f001095",
    createDate: "2014-08-07T13:28:30.591Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37e94b48b12793f00108e",
    isTrashed: false,
    selection: "53e37ef7b48b12793f001094",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37f19b48b12793f001098",
    createDate: "2014-08-07T13:28:57.003Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37f0fb48b12793f001096",
    isTrashed: false,
    selection: "53e37f14b48b12793f001097",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37f43b48b12793f00109b",
    createDate: "2014-08-07T13:29:39.017Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37f38b48b12793f001099",
    isTrashed: false,
    selection: "53e37f3cb48b12793f00109a",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37f4eb48b12793f00109d",
    createDate: "2014-08-07T13:29:50.690Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37e41b48b12793f00108b",
    isTrashed: false,
    selection: "53e37f4bb48b12793f00109c",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37f9cb48b12793f00109f",
    createDate: "2014-08-07T13:31:08.206Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37da2b48b12793f00107a",
    isTrashed: false,
    selection: "53e37f97b48b12793f00109e",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e37faab48b12793f0010a1",
    createDate: "2014-08-07T13:31:22.605Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37e41b48b12793f00108b",
    isTrashed: false,
    selection: "53e37fa8b48b12793f0010a0",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e38959b48b12793f0010b8",
    createDate: "2014-08-07T14:12:41.515Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37e94b48b12793f00108e",
    isTrashed: false,
    selection: "53e3894fb48b12793f0010b4",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e38971b48b12793f0010ba",
    createDate: "2014-08-07T14:13:05.049Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37b71b48b12793f00105d",
    isTrashed: false,
    selection: "53e38965b48b12793f0010b9",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e38a53b48b12793f0010cb",
    createDate: "2014-08-07T14:16:51.427Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37af0b48b12793f001054",
    isTrashed: false,
    selection: "53e3898eb48b12793f0010bb",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e38a6fb48b12793f0010cd",
    createDate: "2014-08-07T14:17:19.900Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37554b48b12793f000d54",
    isTrashed: false,
    selection: "53e38a6bb48b12793f0010cc",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e38aa6b48b12793f0010d3",
    createDate: "2014-08-07T14:18:14.023Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e38a96b48b12793f0010d2",
    isTrashed: false,
    selection: "53e38a77b48b12793f0010ce",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e38accb48b12793f0010d5",
    createDate: "2014-08-07T14:18:52.991Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e36a31b48b12793f000d3d",
    isTrashed: false,
    selection: "53e38ac3b48b12793f0010d4",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e38adbb48b12793f0010d8",
    createDate: "2014-08-07T14:19:07.787Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37da2b48b12793f00107a",
    isTrashed: false,
    selection: "53e38ad7b48b12793f0010d7",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e38e46b48b12793f0010db",
    createDate: "2014-08-07T14:33:42.374Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e38e28b48b12793f0010d9",
    isTrashed: false,
    selection: "53e38e41b48b12793f0010da",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e38e5eb48b12793f0010dd",
    createDate: "2014-08-07T14:34:06.523Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37aa4b48b12793f00104f",
    isTrashed: false,
    selection: "53e38e4cb48b12793f0010dc",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e38ea3b48b12793f0010df",
    createDate: "2014-08-07T14:35:15.426Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e36a31b48b12793f000d3d",
    isTrashed: false,
    selection: "53e38e83b48b12793f0010de",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e38eb2b48b12793f0010e1",
    createDate: "2014-08-07T14:35:30.069Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37b28b48b12793f001057",
    isTrashed: false,
    selection: "53e38eaab48b12793f0010e0",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e38ec6b48b12793f0010e3",
    createDate: "2014-08-07T14:35:50.565Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e37f38b48b12793f001099",
    isTrashed: false,
    selection: "53e38ec2b48b12793f0010e2",
    workspace: "53e36522b48b12793f000d3b"
  },
    {
    _id: "53e38edcb48b12793f0010e5",
    createDate: "2014-08-07T14:36:12.153Z",
    createdBy: "529518daba1cd3d8c4013344",
    folder: "53e36d26b48b12793f000d45",
    isTrashed: false,
    selection: "53e38ec9b48b12793f0010e4",
    workspace: "53e36522b48b12793f000d3b"
  },
  {
    "_id" : "5bbb9d5dc2aa0a1696840cea",
    "createdBy" : "5b4e4b48808c7eebc9f9e827",
    "lastModifiedBy" : null,
    "workspace" : "5bb814d19885323f6d894974",
    "selection" : "5bbb9d57c2aa0a1696840ce9",
    "folder" : "5bb814d19885323f6d894975",
    "lastModifiedDate" : null,
    "isTrashed" : false,
    "createDate" : "2018-10-08T18:09:33.525Z"
},
{
  "_id" : "5bbdfdcdecd6e597fd8da57d",
  "isTrashed" : true,
  "createdBy": "5b9149552ecaf7c30dd4748e"
},
{
  "_id" : "5bec37f48c73047613e2f367",
  "createdBy" : "5b9149552ecaf7c30dd4748e",
  "lastModifiedBy" : null,
  "workspace" : "5bec36958c73047613e2f34e",
  "selection" : "5bec37a78c73047613e2f365",
  "folder" : "5bec371f8c73047613e2f35a",
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-11-14T14:57:56.456Z"
},


{
  "_id" : "5bec38018c73047613e2f368",
  "createdBy" : "5b9149552ecaf7c30dd4748e",
  "lastModifiedBy" : null,
  "workspace" : "5bec36958c73047613e2f34e",
  "selection" : "5bec37838c73047613e2f361",
  "folder" : "5bec37048c73047613e2f358",
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-11-14T14:58:09.912Z"
},


{
  "_id" : "5bec38338c73047613e2f36b",
  "createdBy" : "5b9149552ecaf7c30dd4748e",
  "lastModifiedBy" : null,
  "workspace" : "5bec36958c73047613e2f34e",
  "selection" : "5bec373d8c73047613e2f35c",
  "folder" : "5bec36cd8c73047613e2f354",
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-11-14T14:58:59.372Z"
},

{
  "_id" : "5bec386a8c73047613e2f36d",
  "createdBy" : "5b9149552ecaf7c30dd4748e",
  "lastModifiedBy" : null,
  "workspace" : "5bec36958c73047613e2f34e",
  "selection" : "5bec37408c73047613e2f35d",
  "folder" : "5bec37048c73047613e2f358",
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-11-14T14:59:54.460Z"
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
