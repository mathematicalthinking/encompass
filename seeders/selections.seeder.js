var Seeder = require('mongoose-data-seed').Seeder;
var Selection = require('../server/datasource/schemas').Selection;

var data = [
{
  _id: "53e11942b48b12793f000a5f",
  comments: [],
  coordinates: "node-6 0 0 node-11 0 1",
  createDate: "2014-08-05T17:49:54.306Z",
  createdBy: "53d9a577729e9ef59ba7f118",
  isTrashed: false,
  submission: "53e1156db48b12793f000430",
  taggings: ["53e1194bb48b12793f000a62"],
  text: "looking at myanswer itseems reasonable because it works out withthe asked problem. ",
  workspace: "53e1156db48b12793f000442",
}, {
  _id: "53e11b38b48b12793f000ab7",
  comments: [],
  coordinates: "node-17 0 0 node-19 0 173",
  createDate: "2014-08-05T17:58:16.595Z",
  createdBy: "53d9a577729e9ef59ba7f118",
  isTrashed: false,
  submission: "53e1156db48b12793f000437",
  taggings: ["53e11b5eb48b12793f000abb"],
  text: "I notice that there is 36 heads and 80 legs                             I notice that Xiao is a Chinese name                                  I wonder if there is less dogs than pigeons.                                                                 ",
  workspace: "53e1156db48b12793f000442"
}, {
  _id: "53e11ec4b48b12793f000b34",
  comments: [],
  coordinates: "node-4 8 278 node-4 8 392",
  createDate: "2014-08-05T18:13:24.164Z",
  createdBy: "53d9a577729e9ef59ba7f118",
  isTrashed: false,
  submission: "53e1156db48b12793f000420",
  taggings: ["53e11eceb48b12793f000b36"],
  text: "I also thought that it was easyer when we got with a partner so we could both talk over the answer with each other",
  workspace: "53e1156db48b12793f000442"
}, {
  _id: "53e11f20b48b12793f000b3a",
  comments: [],
  coordinates: "node-32 0 0 node-34 0 2",
  createDate: "2014-08-05T18:14:56.104Z",
  createdBy: "53a43f7c729e9ef59ba7ebf2",
  isTrashed: false,
  submission: "53e1156db48b12793f000427",
  taggings: [],
  text: "25\
  11 ",
  workspace: "53e1156db48b12793f000442"
}, {
  _id: "53e11f82b48b12793f000b44",
  comments: [],
  coordinates: "node-3 0 0 node-3 0 115",
  createDate: "2014-08-05T18:16:34.609Z",
  createdBy: "53d9a577729e9ef59ba7f118",
  isTrashed: false,
  submission: "53e1156db48b12793f00043a",
  taggings: ["53e11fa8b48b12793f000b48"],
  text: "The problem \"Feathers and Fur\" was a bit confusing, and still is but i'm going to try my best to solve the problem.",
  workspace: "53e1156db48b12793f000442"
}, {
  _id: "53e12158b48b12793f000b68",
  comments: [],
  coordinates: "node-3 0 0 node-3 0 24",
  createDate: "2014-08-05T18:24:24.703Z",
  createdBy: "53a43f7c729e9ef59ba7ebf2",
  isTrashed: false,
  submission: "53e1156db48b12793f000425",
  taggings: [],
  text: "The problem is asking me",
  workspace: "53e1156db48b12793f000442"
}, {
  _id: "53e12211b48b12793f000b7e",
  comments: [],
  coordinates: "node-3 0 111 node-3 0 130",
  createDate: "2014-08-05T18:27:29.330Z",
  createdBy: "53a43f7c729e9ef59ba7ebf2",
  isTrashed: false,
  submission: "53e1156db48b12793f000425",
  taggings: [],
  text: "pigeons have 2 feet",
  workspace: "53e1156db48b12793f000442"
}, {
  _id: "53e1223cb48b12793f000b80",
  comments: [],
  coordinates: "node-2 4 1 node-2 8 33",
  createDate: "2014-08-05T18:28:12.588Z",
  createdBy: "53d9a577729e9ef59ba7f118",
  isTrashed: false,
  submission: "53e1156db48b12793f000438",
  taggings: ["53e12250b48b12793f000b83"],
  text: "i noticed that there was 4 dogs \
  i noticed there was 32 pigeons \
  i noticed that there was 80 legs ",
  workspace: "53e1156db48b12793f000442"
}, {
  _id: "53e1223eb48b12793f000b81",
  comments: ["53e12264b48b12793f000b84"],
  coordinates: "node-2 15 10 node-2 15 35",
  createDate: "2014-08-05T18:28:14.276Z",
  createdBy: "53a43f7c729e9ef59ba7ebf2",
  isTrashed: false,
  submission: "53e1156db48b12793f00042d",
  taggings: [],
  text: "There should be Less Dogs",
  workspace: "53e1156db48b12793f000442"
}, {
  _id: "53e12503b48b12793f000b90",
  comments: ["53e12507b48b12793f000b91"],
  coordinates: "node-2 19 47 node-2 19 78",
  createDate: "2014-08-05T18:40:03.527Z",
  createdBy: "53a43f7c729e9ef59ba7ebf2",
  isTrashed: false,
  submission: "53e1156db48b12793f00042d",
  taggings: ["53e12518b48b12793f000b92"],
  text: "Because there are more animals ",
  workspace: "53e1156db48b12793f000442"
}, {
  _id: "53e36a96b48b12793f000d3e",
  comments: [],
  coordinates: "node-2 4 96 node-2 4 268",
  createDate: "2014-08-07T12:01:26.271Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4dd",
  taggings: ["53e36a9bb48b12793f000d3f"],
  text: "thought provoking. In particular, I found the exercise of creating a representation to be very illuminating as a mechanism for gaining insight into someone else's thinking.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e36ac7b48b12793f000d41",
  comments: [],
  coordinates: "node-2 6 75 node-2 6 118",
  createDate: "2014-08-07T12:02:15.532Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4dd",
  taggings: ["53e36ad3b48b12793f000d42"],
  text: "think with Steve about the triangle problem",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e36d13b48b12793f000d44",
  comments: [],
  coordinates: "node-2 18 212 node-2 18 435",
  createDate: "2014-08-07T12:12:03.426Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4dd",
  taggings: ["53e36d2bb48b12793f000d46"],
  text: "have a protocol for regulating the use of time to be more attentive to the work that needs to happen for the project. Not sure if a parking lot or a talk timer or a strolling taskmaster would/could be an appropriate remedy,",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e3746fb48b12793f000d48",
  comments: [],
  coordinates: "node-2 14 1 node-2 14 176",
  createDate: "2014-08-07T12:43:27.945Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4dd",
  taggings: ["53e37478b48b12793f000d49"],
  text: "Once again I am struck by how much I continue to gain by being here but am uncertain of how my presence/participation is of value to the Math Forum &/or the EnCompass project.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e3748db48b12793f000d4a",
  comments: [],
  coordinates: "node-2 7 1 node-2 7 169",
  createDate: "2014-08-07T12:43:57.461Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4dc",
  taggings: ["53e37492b48b12793f000d4b"],
  text: "Most useful was working on the problem and discussing anticipated student responses. Then seeing those responses in the examples of work we looked at on the software.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e374c7b48b12793f000d4d",
  comments: [],
  coordinates: "node-2 13 47 node-2 13 160",
  createDate: "2014-08-07T12:44:55.566Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4dc",
  taggings: ["53e374dcb48b12793f000d4f"],
  text: "how it will work when I assign problems to my own students. I am curious about what the student view looks like.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37525b48b12793f000d51",
  comments: [],
  coordinates: "node-2 19 73 node-2 19 142",
  createDate: "2014-08-07T12:46:29.266Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4dc",
  taggings: ["53e37529b48b12793f000d52"],
  text: "Do the mentor's comments/replies appear anywhere in the new software?",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e3753eb48b12793f000d53",
  comments: [],
  coordinates: "node-2 13 177 node-2 13 239",
  createDate: "2014-08-07T12:46:54.050Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4dc",
  taggings: ["53e37560b48b12793f000d55"],
  text: "how having all this new \"data\" will help me in my instruction.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37571b48b12793f000d56",
  comments: [],
  coordinates: "node-2 19 1 node-2 19 71",
  createDate: "2014-08-07T12:47:45.172Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4dc",
  taggings: ["53e37583b48b12793f000d57"],
  text: "I would like to have my students' work imported into the new software.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37710b48b12793f00103c",
  comments: [],
  coordinates: "node-2 2 0 node-2 2 103",
  createDate: "2014-08-07T12:54:40.250Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4da",
  taggings: ["53e37715b48b12793f00103d"],
  text: "It was useful for me to have time to work on the PoW that we worked, and to have time to chat about it.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37724b48b12793f00103e",
  comments: [],
  coordinates: "node-2 2 280 node-2 2 406",
  createDate: "2014-08-07T12:55:00.451Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4da",
  taggings: ["53e3772cb48b12793f00103f"],
  text: "move the conversation from something that was focused on the software or PoW and turn that into a conversation about teaching.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37769b48b12793f001042",
  comments: [],
  coordinates: "node-2 8 282 node-2 8 452",
  createDate: "2014-08-07T12:56:09.944Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4da",
  taggings: ["53e3777cb48b12793f001043"],
  text: "I have a lot of questions about how to teach big skills in math -- like number thinking, geometric thinking, algebraic thinking, problem solving, but they're ill-formed.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e379dfb48b12793f00104a",
  comments: ["53e37a4ab48b12793f00104c"],
  coordinates: "node-2 16 1 node-2 18 51",
  createDate: "2014-08-07T13:06:39.474Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4da",
  taggings: ["53e379e4b48b12793f00104b"],
  text: "My suggestion is to make sure that our conversations are always directlyaboutteaching, rather than about the software or PoWs. ",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37a83b48b12793f00104d",
  comments: [],
  coordinates: "node-2 2 8 node-2 2 84",
  createDate: "2014-08-07T13:09:23.824Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d5",
  taggings: ["53e37a87b48b12793f00104e"],
  text: "the Valentine problem that Max did today the most useful, along with looking",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37ab0b48b12793f001050",
  comments: [],
  coordinates: "node-2 2 76 node-2 2 165",
  createDate: "2014-08-07T13:10:08.137Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d5",
  taggings: ["53e37ab7b48b12793f001051"],
  text: " looking through the Algebra POW's and offering our opinion as to which ones may be used.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37aceb48b12793f001052",
  comments: [],
  coordinates: "node-2 2 212 node-2 2 406",
  createDate: "2014-08-07T13:10:38.734Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d5",
  taggings: ["53e37ad4b48b12793f001053"],
  text: "watching Max model the format that I could possibly use in my classroom. The \"homemade box of chocolates\" that he made for each table to use as a model was a nice touch that I will use as well.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37afbb48b12793f001055",
  comments: [],
  coordinates: "node-2 2 12 node-2 2 119",
  createDate: "2014-08-07T13:11:23.643Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d3",
  taggings: ["53e37b0eb48b12793f001056"],
  text: "appreciated thinking about student work and looking at ways to do quick sorts using the Encompass software.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37b34b48b12793f001058",
  comments: [],
  coordinates: "node-2 2 218 node-2 2 351",
  createDate: "2014-08-07T13:12:20.618Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d3",
  taggings: ["53e37b3bb48b12793f001059"],
  text: "selecting the problem for the beginning of the year, as I had planned to do that activity, though this just saved me some time later.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37b52b48b12793f00105b",
  comments: [],
  coordinates: "node-2 2 121 node-2 2 171",
  createDate: "2014-08-07T13:12:50.735Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d3",
  taggings: ["53e37b57b48b12793f00105c"],
  text: "Using it is a professional development is useful. ",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37b80b48b12793f00105e",
  comments: [],
  coordinates: "node-2 6 29 node-2 6 168",
  createDate: "2014-08-07T13:13:36.420Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d3",
  taggings: ["53e37b8ab48b12793f00105f"],
  text: "get more of my colleagues using the Math Forum in planning problem solving work for students. I'll need to do something during preservice.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37b99b48b12793f001060",
  comments: [],
  coordinates: "node-1 2 7 node-1 2 70",
  createDate: "2014-08-07T13:14:01.212Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d2",
  taggings: ["53e37ba1b48b12793f001061"],
  text: "time with Arlene this afternoon to plan our POW's for next year",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37be2b48b12793f001066",
  comments: [],
  coordinates: "node-2 4 4 node-2 4 241",
  createDate: "2014-08-07T13:15:14.746Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d2",
  taggings: ["53e37be8b48b12793f001067"],
  text: "When doing the afternoon google hangout this afternoon, we still seemed to get hung up in a few glitches in the software and didn't spend as much time really focusing on the student work as I would have liked. I liked the model though.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37c15b48b12793f001068",
  comments: [],
  coordinates: "node-2 8 9 node-2 8 255",
  createDate: "2014-08-07T13:16:05.610Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d2",
  taggings: ["53e37c1ab48b12793f001069"],
  text: "concerned that the other teacher I'm teaching Algebra 2 H with won't want to do the POW's. I'm wondering if I just move forward and if he doesn't , he doesn't and he just has to plan something else or if there might be a way I can ease him in. ",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37c63b48b12793f00106b",
  comments: [],
  coordinates: "node-2 2 0 node-2 2 500",
  createDate: "2014-08-07T13:17:23.513Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d6",
  taggings: ["53e37c69b48b12793f00106c"],
  text: "Probably the most useful time today was time I spent in conversations with people. During Fellows Time today, I took a walk with Michael Pershan and we had some wonderful conversations about life and a little about mathematics. I got some exercise and cleared my head from the morning. Having conversation with Michael does always make me think and he challenges me to think in different ways. He also offered to help me with working through how to teach problem solving better in the upcoming year.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37c87b48b12793f00106e",
  comments: [],
  coordinates: "node-2 2 311 node-2 2 500",
  createDate: "2014-08-07T13:17:59.817Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d6",
  taggings: ["53e37c9bb48b12793f00106f"],
  text: "Michael does always make me think and he challenges me to think in different ways. He also offered to help me with working through how to teach problem solving better in the upcoming year.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37cb2b48b12793f001070",
  comments: [],
  coordinates: "node-2 10 15 node-2 10 311",
  createDate: "2014-08-07T13:18:42.592Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d6",
  taggings: ["53e37cc1b48b12793f001071"],
  text: "Although what Lynn had to say was valuable, I probably found it to be the least useful for me. Over the course of the two days, I have found (for me) that it has helped to have one on one conversations with people to learn about their experiences. So if I had to name something, that would be it.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37cecb48b12793f001072",
  comments: [],
  coordinates: "node-2 6 1 node-2 6 256",
  createDate: "2014-08-07T13:19:40.762Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d6",
  taggings: ["53e37cf5b48b12793f001073"],
  text: "The time we spent this afternoon with the online Fellows thinking about pre-designed problem sets in EnCoMPASS was also very valuable. I was paired with two people who have used PoWs in their classes before and hearing their experiences was helpful to me.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37d00b48b12793f001074",
  comments: [],
  coordinates: "node-2 6 136 node-2 6 427",
  createDate: "2014-08-07T13:20:00.402Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d6",
  taggings: ["53e37d05b48b12793f001075"],
  text: "I was paired with two people who have used PoWs in their classes before and hearing their experiences was helpful to me. I then continued to have conversation with Jeff Spoerling about how he has used PoWs in his high school classroom which was helpful for me since I also teach high school.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37d21b48b12793f001076",
  comments: [],
  coordinates: "node-2 15 74 node-2 15 167",
  createDate: "2014-08-07T13:20:33.818Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4e1",
  taggings: ["53e37d27b48b12793f001077"],
  text: "I like the idea of preset curated folders that can be set to \"include everytime\" or \"choose\".",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37d43b48b12793f001078",
  comments: [],
  coordinates: "node-2 19 1 node-2 19 118",
  createDate: "2014-08-07T13:21:07.922Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4e1",
  taggings: ["53e37d47b48b12793f001079"],
  text: "I wonder what the learning curve will be like for new teachers to our new software? Are there multiple entry points?",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37daeb48b12793f00107b",
  comments: [],
  coordinates: "node-2 2 0 node-2 2 27",
  createDate: "2014-08-07T13:22:54.399Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d9",
  taggings: ["53e37db1b48b12793f00107c"],
  text: "Connections was wonderful. ",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37db9b48b12793f00107d",
  comments: [],
  coordinates: "node-2 2 27 node-2 2 156",
  createDate: "2014-08-07T13:23:05.904Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d9",
  taggings: ["53e37dc3b48b12793f00107e"],
  text: "Doing the PoW in the morning was fun and gave me some good math thinking thoughts and was good for connecting with my groupmates.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37dcfb48b12793f00107f",
  comments: [],
  coordinates: "node-2 2 157 node-2 2 446",
  createDate: "2014-08-07T13:23:27.813Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d9",
  taggings: ["53e37dd7b48b12793f001080"],
  text: "In the PM, I felt like we figured out some good feedback about the EnCoMPASS software during the Hangout. (I did feel scattered during that time—the mixed goals of looking at student work in the light of our morning session and putting together feedback about the software felt orthogonal)",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37de2b48b12793f001081",
  comments: [],
  coordinates: "node-2 6 64 node-2 6 128",
  createDate: "2014-08-07T13:23:46.587Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d9",
  taggings: ["53e37deab48b12793f001082"],
  text: "talking more with some folks about what's important in Geometry.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37df2b48b12793f001083",
  comments: [],
  coordinates: "node-2 6 129 node-2 6 263",
  createDate: "2014-08-07T13:24:02.600Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d9",
  taggings: ["53e37df8b48b12793f001084"],
  text: "I also liked thinking about Max's question just a little while about about comparing and contrasting spatial sense and geometric sense",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37e02b48b12793f001085",
  comments: [],
  coordinates: "node-2 10 1 node-2 10 237",
  createDate: "2014-08-07T13:24:18.700Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d9",
  taggings: ["53e37e07b48b12793f001086"],
  text: "Movingthrough the sessions of the week feels sort of non-linear, or shuffled. There's something good about that, because it feels like we're mucking about within and exploring a space. But at the same time I don't always feel oriented.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37e1cb48b12793f001087",
  comments: [],
  coordinates: "node-1 2 0 node-1 2 228",
  createDate: "2014-08-07T13:24:44.654Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d4",
  taggings: ["53e37e23b48b12793f001088"],
  text: "I found great value in working with the pre-algebra teachers to determine which PoWs we could use at the beginning of the year. It was interesting to hear the perspective of people who have vastly different students than my own.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37e2eb48b12793f001089",
  comments: [],
  coordinates: "node-2 2 1 node-2 2 327",
  createDate: "2014-08-07T13:25:02.201Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d4",
  taggings: ["53e37e33b48b12793f00108a"],
  text: " hated the opening exercise, but that doesn't mean that I didn't value it. I hate being alone with my thoughts because of the direction that they often send me, but I know I need to do it more often. It was interesting to hear what other participants had to say, but very frustrating and liberating to not be able to respond.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37e46b48b12793f00108c",
  comments: [],
  coordinates: "node-2 6 1 node-2 6 105",
  createDate: "2014-08-07T13:25:26.921Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d4",
  taggings: ["53e37e4cb48b12793f00108d"],
  text: "I am very much enjoying the online participants, who are bringing fresh perspectives to the discussion.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37eb4b48b12793f00108f",
  comments: [],
  coordinates: "node-2 10 1 node-2 12 35",
  createDate: "2014-08-07T13:27:16.455Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d4",
  taggings: ["53e37ec4b48b12793f001090"],
  text: "I made several suggestions for improvements to the software and all were met with \"Yup! That's in the pipeline.\" \
  You guys and gals are on the ball!",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37eebb48b12793f001092",
  comments: [],
  coordinates: "node-1 2 0 node-1 2 116",
  createDate: "2014-08-07T13:28:11.363Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4db",
  taggings: ["53e37eeeb48b12793f001093"],
  text: "PoWs and their resources are awesome!  Online interaction with them (student and teacher) needs a lot more refining.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37ef7b48b12793f001094",
  comments: [],
  coordinates: "node-2 2 0 node-2 2 318",
  createDate: "2014-08-07T13:28:23.284Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4db",
  taggings: ["53e37efeb48b12793f001095"],
  text: "It was great to get a chance to do some math this morning and I glad Max was able to facilitate a meeting with Mike (the programmer for Math Forum). I'm very grateful for their willingness to help me create a PoW environment that suits my instructional needs and allows my students to work collaboratively (sometimes).",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37f14b48b12793f001097",
  comments: [],
  coordinates: "node-2 6 1 node-2 6 276",
  createDate: "2014-08-07T13:28:52.791Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4db",
  taggings: ["53e37f19b48b12793f001098"],
  text: "The Encompass software still has a long way to grow to feel more useful as a teacher. But, that's a big part of why we're here. At present it overcomplicates the process of looking at student work to a point that would be too time consuming to be useful on a regular basis.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37f3cb48b12793f00109a",
  comments: [],
  coordinates: "node-2 10 3 node-2 10 96",
  createDate: "2014-08-07T13:29:32.203Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d7",
  taggings: ["53e37f43b48b12793f00109b"],
  text: " I'm wondering what the timeline is for software to do some of the stuff that we'd suggested.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37f4bb48b12793f00109c",
  comments: [],
  coordinates: "node-2 2 3 node-2 2 217",
  createDate: "2014-08-07T13:29:47.102Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4d7",
  taggings: ["53e37f4eb48b12793f00109d"],
  text: "Most useful: hangout with Sebastian because I was quite un-successful yesterday, so it was great to have no technical glitches today, and Sebastian gave useful feedback regarding software that I didn't think about.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37f97b48b12793f00109e",
  comments: [],
  coordinates: "node-2 2 1 node-2 2 119",
  createDate: "2014-08-07T13:31:03.338Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4e2",
  taggings: ["53e37f9cb48b12793f00109f"],
  text: " absolutely loved the \"connections\" in the beginning of the day. During own chic time, I actually blogged about it:) ",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e37fa8b48b12793f0010a0",
  comments: [],
  coordinates: "node-2 2 119 node-2 2 289",
  createDate: "2014-08-07T13:31:20.031Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4e2",
  taggings: ["53e37faab48b12793f0010a1"],
  text: "I continue to enjoy talking with other fellows throughout the google hangouts and hearing how they used PoWs in their classrooms and their thoughts about the software. ",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e3894fb48b12793f0010b4",
  comments: [],
  coordinates: "node-2 2 289 node-2 2 577",
  createDate: "2014-08-07T14:12:31.489Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4e2",
  taggings: ["53e38959b48b12793f0010b8"],
  text: "As the days continue my understanding and purpose of the software deepen. I feel it will be an incredible tool for teachers to analyze classroom performance and an excellent way to track the teachers thoughts (planning, intervening, grouping...) processes as the school year progresses. ",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e38965b48b12793f0010b9",
  comments: [],
  coordinates: "node-2 2 578 node-2 2 905",
  createDate: "2014-08-07T14:12:53.962Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4e2",
  taggings: ["53e38971b48b12793f0010ba"],
  text: "As a math Coach I would like to hear the fellows point of view on the software, preferably positive ideas so I can try to get teachers using, trying the software out. I want to fine a way to \"sell\" it to my teachers but not in a used-car man way...How can I create an opportunity for teachers to see the value in the program.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e3898eb48b12793f0010bb",
  comments: [],
  coordinates: "node-6 0 161 node-6 0 663",
  createDate: "2014-08-07T14:13:34.564Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4df",
  taggings: ["53e38a53b48b12793f0010cb"],
  text: "I was even more excited to think about how it could be used by teachers before implementingPOW's into the classroom. The ability to see multiple solution methods (of which I will admit I didn't think of) as well as noticings, wonderings, and feedback that other teachers (or professional educators) provided is really helpful in the planning process. It gives an entry point into the 5 practices, whichteachers can use to anticipate student strategies and how to respond to them before class occurs.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e38a6bb48b12793f0010cc",
  comments: [],
  coordinates: "node-9 0 30 node-9 0 299",
  createDate: "2014-08-07T14:17:15.724Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4df",
  taggings: ["53e38a6fb48b12793f0010cd"],
  text: "if the \"big idea\"goal of Encompass is more for teacher use in planning to implement POW's or for providing feedback to the students. Hopefully, those are both major goals of the software, as the ability to use this is both contexts can be very beneficial for teachers.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e38a77b48b12793f0010ce",
  comments: [],
  coordinates: "node-12 0 31 node-12 0 269",
  createDate: "2014-08-07T14:17:27.422Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4df",
  taggings: ["53e38aa6b48b12793f0010d3"],
  text: "large group sharing of what happened during the afternoon Hangout session. I always like to hear summaries of the other discussions to get an idea of how other groups approached the session compared to how my group approached the session.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e38ac3b48b12793f0010d4",
  comments: [],
  coordinates: "node-1 2 0 node-1 2 365",
  createDate: "2014-08-07T14:18:43.938Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4e0",
  taggings: ["53e38accb48b12793f0010d5"],
  text: "The whole group discussion of the I notice and I wonder on the chocolate problem and the various ways in which teachers looked at the problem. \
  The idea of reading and reflecting after just one read is an awesome activity.It has made me realize how important it is to  not read superficially. \
  This is definitely something I would like to implement with my students. \
  ",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e38ad0b48b12793f0010d6",
  comments: [],
  coordinates: "node-1 2 367 node-1 2 368",
  createDate: "2014-08-07T14:18:56.293Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4e0",
  taggings: [],
  text: "e",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e38ad7b48b12793f0010d7",
  comments: [],
  coordinates: "node-1 2 365 node-1 2 456",
  createDate: "2014-08-07T14:19:03.798Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4e0",
  taggings: ["53e38adbb48b12793f0010d8"],
  text: "The first activity 'Connections' is a great way of helping me think deeply.  Great concept.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e38e41b48b12793f0010da",
  comments: [],
  coordinates: "node-1 2 467 node-1 2 726",
  createDate: "2014-08-07T14:33:37.071Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4e0",
  taggings: ["53e38e46b48b12793f0010db"],
  text: "how does one reach to the stage where he/she can think through a problem and see all the different ways in which students can interpret a problem. \
  I find this difficult at times and I really wonder how I can make more time to be more involved in the process. \
  ",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e38e4cb48b12793f0010dc",
  comments: [],
  coordinates: "node-1 2 726 node-1 2 859",
  createDate: "2014-08-07T14:33:48.600Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4e0",
  taggings: ["53e38e5eb48b12793f0010dd"],
  text: "Working with Lois and planning our online collaboration for next term was very productive and I learned some more about the software.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e38e83b48b12793f0010de",
  comments: [],
  coordinates: "node-1 2 35 node-1 2 263",
  createDate: "2014-08-07T14:34:43.353Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4de",
  taggings: ["53e38ea3b48b12793f0010df"],
  text: "having Max facilitate our morning PoW: A Pound of Valentine's Chocolates. I enjoyed Max having us think of a representation for the scenario he presented. I enjoyed listening to and seeing al the different approaches to solving.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e38eaab48b12793f0010e0",
  comments: [],
  coordinates: "node-1 2 265 node-1 2 479",
  createDate: "2014-08-07T14:35:22.380Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4de",
  taggings: ["53e38eb2b48b12793f0010e1"],
  text: "The least useful part of today was Connections. I would appreciate us having a chance to follow up with group discussions after connections to ask anyone questions about something they shared during connections. -",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e38ec2b48b12793f0010e2",
  comments: [],
  coordinates: "node-1 2 479 node-1 2 595",
  createDate: "2014-08-07T14:35:46.095Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4de",
  taggings: ["53e38ec6b48b12793f0010e3"],
  text: "I'm wondering about if we will be able to see the uploaded image-of-student-work feature of the Encompass software.",
  workspace: "53e36522b48b12793f000d3b"
}, {
  _id: "53e38ec9b48b12793f0010e4",
  comments: [],
  coordinates: "node-1 2 596 node-1 2 746",
  createDate: "2014-08-07T14:35:53.795Z",
  createdBy: "529518daba1cd3d8c4013344",
  isTrashed: false,
  submission: "53e36522729e9ef59ba7f4de",
  taggings: ["53e38edcb48b12793f0010e5"],
  text: "Once groups have been assigned to their tables, put the prompts (charges) back on the screen so we can refer to them during our group discussion time.",
  workspace: "53e36522b48b12793f000d3b"
},
{
  "_id" : "5bbb9d57c2aa0a1696840ce9",
  "text" : "This is my explanation.",
  "coordinates" : "node-3 0 0 node-3 0 23",
  "createdBy" : "5b9149552ecaf7c30dd4748e",
  "lastModifiedBy" : null,
  "submission" : "5bb814d19885323f6d894973",
  "workspace" : "5bb814d19885323f6d894974",
  "taggings" : [
      "5bbb9d5dc2aa0a1696840cea"
  ],
  "comments" : [
      "5bbb9d86c2aa0a1696840ceb"
  ],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-10-08T18:09:27.457Z"
},
{
  "_id" : "5bbbba75a6a7ee1a9a5ebc74",
  "text" : "are.So",
  "coordinates" : "node-1 2 32 node-1 2 38",
  "createdBy" : "5b7321ee59a672806ec903d5",
  "lastModifiedBy" : null,
  "submission" : "53e1156db48b12793f000414",
  "workspace" : "53e1156db48b12793f000442",
  "taggings" : [],
  "comments" : [
      "5bbbba86a6a7ee1a9a5ebc75"
  ],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-10-08T20:13:41.935Z"
},
{
  "_id" : "5bbe014cecd6e597fd8e8e99",
  "isTrashed" : true,
  "submission" : "53e1156db48b12793f000414",
  "createdBy" : "5b7321ee59a672806ec903d5",
  "text" : "trashed selection",
  "coordinates" : "node-1 2 32 node-1 2 38",
}
];

var SelectionsSeeder = Seeder.extend({
  shouldRun: function () {
    return Selection.count().exec().then(count => count === 0);
  },
  run: function () {
    return Selection.create(data);
  }
});

module.exports = SelectionsSeeder;
