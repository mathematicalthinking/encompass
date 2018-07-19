var Seeder = require('mongoose-data-seed').Seeder;
var Pdsubmission = require('../server/datasource/schemas').Pdsubmission;

var data = [
  {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f403"
    },
    "clazz": {
      "clazzId": 103673,
      "name": "Period 7 Algebra Prep"
    },
    "createDate": {
      "$date": "2013-05-23T15:02:36.453Z"
    },
    "creator": {
      "creatorId": 216977,
      "username": "neoM11",
      "safeName": "Neo M."
    },
    "longAnswer": "[;.]",
    "pdSet": "Feather and Fur - Mary",
    "powId": 765330,
    "publication": {
      "publicationId": 198,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": ";p[[",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 655449,
      "currentSubmissionId": 765334
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f404"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-15T18:39:13.771Z"
    },
    "creator": {
      "creatorId": 238031,
      "username": "eRodriguez13",
      "safeName": "Erika R."
    },
    "longAnswer": "\u003cspan style=\"font-size:16px;\"\u003e\u003cspan style=\"color:#ff3399;\"\u003eI am Supposed to figure out how many dogs and how many pigeons there are, with the information \u0026quot;36 heads 80 feet\u0026quot;\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#FF0000;\"\u003e1-\u003c/span\u003e\u003cspan style=\"color:#00FF00;\"\u003e I notice\u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e that there would be more pigeons than dogs.\u003c/span\u003e\u003cspan style=\"color:#00ff99;\"\u003e\u0026nbsp;\u003c/span\u003e\u003cbr /\u003e\r\n\u003cspan style=\"color:#FF0000;\"\u003e2- \u003c/span\u003e\u003cspan style=\"color:#00FF00;\"\u003eI notice\u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e there\u0026#39;s two kind of animals.\u003c/span\u003e\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u003cspan style=\"color:#EE82EE;\"\u003eThis problem was:\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u003cspan style=\"color:#ff3366;\"\u003e-a little hard before I did the table.\u003cbr /\u003e\r\n- confusing before I figured out that there were more pigeons than dogs.\u003cbr /\u003e\r\n- Fun to do because I multiplied a lot, and multiplication to me is fun.\u003c/span\u003e\u003cbr /\u003e\r\n\u0026nbsp;\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e# of pigeons\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e# of dogs\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e# of pigeon feet\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e# of dog feet\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003eTotal feet\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000CD;\"\u003e25\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000CD;\"\u003e11\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000CD;\"\u003e50\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000CD;\"\u003e44\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e94\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e26\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e10\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e52\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e40\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e92\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e12\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e96\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e28\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e8\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e56\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e88\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e38\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e4\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e64\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e16\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e80\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 802836,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "I did all the work in my guess and check table and got the answer. There are 32 pigeons and 4 dogs, which is 36 heads and 80 feet.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689551,
      "currentSubmissionId": 805778
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f405"
    },
    "clazz": {
      "clazzId": 103673,
      "name": "Period 7 Algebra Prep"
    },
    "createDate": {
      "$date": "2013-05-23T15:17:57.634Z"
    },
    "creator": {
      "creatorId": 216977,
      "username": "neoM11",
      "safeName": "Neo M."
    },
    "longAnswer": "It took me quite a while but i got the answer: 32 pigeons and 4 dogs, but that was like my 200th answer. at first i put 8 dogs and 17 pigeons as a guess and i got 168 feet. then i guessed a little lower 10 piegons and 2 dogs and got 88 feet. then i put in 12 dogs and 9 pigeons and got 114 feet. after a lot more guesses i got 32 pigeons and 4 dogs then i did \u0026nbsp;the answer check to see if i was right and it was.",
    "pdSet": "Feather and Fur - Mary",
    "powId": 765334,
    "publication": {
      "publicationId": 198,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "the problem \"feathers and fur\" from the \"Math forum\" asks you how many pigeons and dogs xiao has but you have to figure out how many heads and feet there are.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 655449,
      "currentSubmissionId": 765334
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f406"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-15T18:38:31.704Z"
    },
    "creator": {
      "creatorId": 237851,
      "username": "mIverson13",
      "safeName": "Michael I."
    },
    "longAnswer": "\u003cdiv style=\"margin-left: 40px;\"\u003e\u003cspan style=\"font-size:16px;\"\u003e\u003cspan style=\"color:#00FFFF;\"\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003ei got my answer by going 9 dogs+27 pigons =36 and then 27*2=40 pigion heads and then 9*4=40 dog heads \u0026nbsp;\u0026nbsp;\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan style=\"font-family: 'comic sans ms', cursive; color: rgb(0, 255, 255); line-height: 1.6em;\"\u003e40+40=80 that mean 40 heads and 40 heads.\u0026nbsp;i find that the math forum problem is was \u003c/span\u003e\u003cspan style=\"font-family: 'comic sans ms', cursive; color: rgb(0, 255, 255); line-height: 1.6em;\"\u003edifficalte\u003c/span\u003e\u003cspan style=\"font-family: 'comic sans ms', cursive; color: rgb(0, 255, 255); line-height: 1.6em;\"\u003e\u0026nbsp;at times and had to do because you had to take a bunch of numbers and try to get 36 and make 80 heads it was complecated i hade to take alot of time to get this proplem.\u0026nbsp;\u003c/span\u003e\u003c/div\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 802844,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "the answer is 9 dogs and 27 pigeons",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689559,
      "currentSubmissionId": 804643
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f407"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-15T18:30:14.007Z"
    },
    "creator": {
      "creatorId": 238028,
      "username": "jMurphy13",
      "safeName": "Joey M."
    },
    "longAnswer": "\u003cspan style=\"color: #00ff00\"\u003ei notice two things\u0026nbsp;1. 80 feet and\u0026nbsp;2. 36 heads so i use product and sum to get the answer but i came close enough to get 36 heads but i got 80 feet down i will never get 36 heads\u003c/span\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 802845,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "16x2=16 than 4x16=64+16=80 feet and 16+16=32 heads.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689560,
      "currentSubmissionId": 805217
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f408"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-15T18:31:46.274Z"
    },
    "creator": {
      "creatorId": 237848,
      "username": "mPrice13",
      "safeName": "Mysten P."
    },
    "longAnswer": "\u003cp\u003e\u0026nbsp;You know that Xiao has 36 heads, and 80 feet. so a dog has 4 paws, and pigeons have two feet. so what i did was guessed a random\u0026nbsp;number.\u003cbr /\u003e\r\nhonestly i guessed the wright one the first time. i thought that is birds have 2\u0026nbsp;legs and 2 multiplied by 10 is 20. that i noticed that dogs have 4 legs, and four times 15 is 60. Than i added sixty and twenty together and got 80.\u003cbr /\u003e\r\nSo you take 60 and divide it by four. you divide it by four because each dog has 4 legs, and when you divide thst by four you get how many dogs there\u0026nbsp;are. So do the same thing for birds, you take 20 and divide it by two. 20 divided by two is ten. So thats how i got the ancer.\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u0026nbsp;\u003c/p\u003e\r\n\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u0026nbsp;",
    "pdSet": "Feather and Fur - Mary",
    "powId": 802847,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Xiao has fifteen dogs, and ten pigeons.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689562,
      "currentSubmissionId": 804632
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f409"
    },
    "clazz": {
      "clazzId": 103673,
      "name": "Period 7 Algebra Prep"
    },
    "createDate": {
      "$date": "2013-11-15T18:35:15.195Z"
    },
    "creator": {
      "creatorId": 238030,
      "username": "mNishoff13",
      "safeName": "Micah N."
    },
    "longAnswer": "1. I noticed there are 36 heads meaning there are 36 animals in all.\u003cbr /\u003e\r\n2. I noticed there are 80 feet total.\u003cbr /\u003e\r\n3. \u0026nbsp;Pigeons all have 2 legs so every number I guess has to be multiplied by 2\u003cbr /\u003e\r\n4. Dogs have 4 legs, so I have to multiply all the guessing numbers I get by 4\u003cbr /\u003e\r\n5. If I were to guess 8 dogs, the pigeons have to add up to equal 36 so what I do is \u0026quot;Reverse\u0026quot; by doing 36 - 8 = 28 So there will have to be 28 pigeons to add up to 36.\u003cbr /\u003e\r\n\u0026nbsp;\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003eDogs\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003eTimes\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003eGuess wand check the answer\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ePigeons\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003eTimes\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e8\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ex 4\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e32 + 56 = 88 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Wrong)\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e28\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ex 2\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e7\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ex 4\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e28 + 58 = 86 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Wrong)\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e29\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ex 2\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e6\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ex 4\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e24 + 60 = 84 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Wrong)\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e30\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ex 2\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e5\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ex 4\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e20 + 62 = 82 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Wrong)\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e31\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ex 2\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e4\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ex 4\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\r\n\u0009\u0009\u0009\u003cp\u003e16 + 64 = 80 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Correct)\u003c/p\u003e\r\n\u0009\u0009\u0009\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e32\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ex 2\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\nAfter I did this table I got my answer.",
    "pdSet": "Feather and Fur - Mary",
    "powId": 802846,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Xiao has a total of 4 dogs and 32 pigeons.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689561,
      "currentSubmissionId": 805206
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f40a"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-15T18:35:59.350Z"
    },
    "creator": {
      "creatorId": 237929,
      "username": "cWilliams13",
      "safeName": "Crystal W."
    },
    "longAnswer": "\u003cb\u003e\u003cspan style=\"color:#0000FF;\"\u003eI\u003c/span\u003e\u0026nbsp;\u003cspan style=\"color:#0066cc;\"\u003etook 80 feet and added 36 heads and i got 116 heads and feet all together.\u003c/span\u003e\u003c/b\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 802851,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "An elderly women likes to take care of homing pigeons and seeing-eye dogs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689565,
      "currentSubmissionId": 804631
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f40b"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-19T18:39:07.367Z"
    },
    "creator": {
      "creatorId": 238072,
      "username": "hZamboroski13",
      "safeName": "Hannah Z."
    },
    "longAnswer": "\u0026nbsp;\r\n\u003cdiv\u003e\u0026nbsp;\u003cspan style=\"color: #4b0082\"\u003e# of pigeons\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u003c/span\u003e\u003cspan style=\"color: #800080\"\u003e\u0026nbsp;# of dogs\u0026nbsp;\u003c/span\u003e\u003cspan style=\"color: #4b0082\"\u003e\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;# of legs\u003c/span\u003e\u003cspan style=\"color: #0000ff\"\u003e\u0026nbsp;\u003c/span\u003e\u003cspan style=\"color: #4b0082\"\u003e\u0026nbsp;\u0026nbsp;\u003c/span\u003e\u003cspan style=\"color: #40e0d0\"\u003e # of feet\u0026nbsp;\u003c/span\u003e\u003cspan style=\"color: #4b0082\"\u003e\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp; \u003c/span\u003e\u003cspan style=\"color: #00ff00\"\u003eTotal\u003c/span\u003e\u003c/div\u003e\r\n\u0026nbsp;\r\n\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #008080\"\u003e25\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ffd700\"\u003e11\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e50\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #afeeee\"\u003e44\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ee82ee\"\u003e94\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #006400\"\u003e26\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e10\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #800080\"\u003e52\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e42\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #008080\"\u003e92\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ffd700\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff6699\"\u003e12\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ffa07a\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #8b4513\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff8c00\"\u003e96\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #dda0dd\"\u003e28\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e8\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #40e0d0\"\u003e56\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #2f4f4f\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ee82ee\"\u003e88\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #4b0082\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ee82ee\"\u003e4\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #008000\"\u003e64\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #800080\"\u003e80\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 802849,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "I figured out that there are 32 pigeons and 4 dogs which is 36 heads and 80 feet.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689564,
      "currentSubmissionId": 805776
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f40c"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-15T18:40:42.905Z"
    },
    "creator": {
      "creatorId": 237851,
      "username": "mIverson13",
      "safeName": "Michael I."
    },
    "longAnswer": "\u003cdiv style=\"margin-left: 40px;\"\u003e\u003cspan style=\"font-size:16px;\"\u003e\u003cspan style=\"color:#00FFFF;\"\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003ei got my answer by going 4 dogs+ 32\u0026nbsp;pigons =36 and then 32*2=68 pigion heads and then 4*4=16 dog heads \u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan style=\"font-family: 'comic sans ms', cursive; color: rgb(0, 255, 255); line-height: 1.6em;\"\u003e40+40=80 that mean 40 heads and 40 heads.\u0026nbsp;i find that the math forum problem is was \u003c/span\u003e\u003cspan style=\"font-family: 'comic sans ms', cursive; color: rgb(0, 255, 255); line-height: 1.6em;\"\u003edifficalte\u003c/span\u003e\u003cspan style=\"font-family: 'comic sans ms', cursive; color: rgb(0, 255, 255); line-height: 1.6em;\"\u003e\u0026nbsp;at times and had to do because you had to take a bunch of numbers and try to get 36 and make 80 heads it was complecated i hade to take alot of time to get this proplem.\u0026nbsp;\u003c/span\u003e\u003c/div\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 802880,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "the answer is 4 dogs and 32 pigeons",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689559,
      "currentSubmissionId": 804643
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f40d"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-19T17:39:37.584Z"
    },
    "creator": {
      "creatorId": 238074,
      "username": "jWhite13",
      "safeName": "Juslene W."
    },
    "longAnswer": "\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e4+4=8\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e16+16= 32\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;4+4=8\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e16+16=32\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e4+4=8\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;8\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e4+4=8\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; 72\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e4+4=8\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804564,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "the answer i got was            and           because i took    and",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691100,
      "currentSubmissionId": 805784
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f40e"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-19T18:38:59.868Z"
    },
    "creator": {
      "creatorId": 237852,
      "username": "jThomas13",
      "safeName": "Jewell T."
    },
    "longAnswer": "i notice that she is currently hosting 36 heads.\u003cbr /\u003e\r\ni notice that she is currently hosting 80 feet.\u003cbr /\u003e\r\n\u0026nbsp;\u003cbr /\u003e\r\n\u003cbr /\u003e\r\nif you do 4*4=16 mean theirs 16 feet.\u003cbr /\u003e\r\n32*2=64 \u0026nbsp;....32 pigeons *2 =64 witch is 64 feet\u003cbr /\u003e\r\n64+16=80\u003cbr /\u003e\r\ntheirs in all\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u0026nbsp;",
    "pdSet": "Feather and Fur - Mary",
    "powId": 802852,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "i got 16 feet for the 4  dogs . i got 64 feet for the pigeons. so their 4 dogs 32 pigeons.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689566,
      "currentSubmissionId": 805218
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f40f"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-19T20:09:17.378Z"
    },
    "creator": {
      "creatorId": 237865,
      "username": "dWilson13",
      "safeName": "Dallas W."
    },
    "longAnswer": "I came up by times there\u0026#39;s answers 32 x 2 =64 , 4 x 4 = 16 , 64 x 16 = 80. i got 4 puppies and 32 pigeons and 80 legs",
    "pdSet": "Feather and Fur - Mary",
    "powId": 802913,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "I Multiped my two answers and i got 80 legs . 32 pigeons and 4 puppies .",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689624,
      "currentSubmissionId": 805811
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f410"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-19T18:35:07.887Z"
    },
    "creator": {
      "creatorId": 237851,
      "username": "mIverson13",
      "safeName": "Michael I."
    },
    "longAnswer": "\u0026nbsp;\r\n\u003cdiv style=\"margin-left: 40px;\"\u003e\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003enumbers of pigieons\u0026nbsp;\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003enumbers of dogs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003enumber of bird legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003enumber of dog legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003etottle #\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e12\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e96\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e25\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e11\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e50\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e44\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e94\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e26\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e10\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e52\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e40\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e92\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e27\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e9\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e54\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e36\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e90\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e28\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e8\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e56\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e88\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e29\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e7\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e58\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e28\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e86\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e30\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e6\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e60\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e84\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e31\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e5\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e62\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e20\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e82\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e4\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e64\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e80\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n\u003cfont color=\"#00ffff\" face=\"comic sans ms, cursive\"\u003ei got my anser by doing a gess and check table and just went from 24 bid and 12 dogs and all the way tell 32 birds and 4 dogs and this math forum problem was hard to get but easy and it had 2 patterns one when count down by 2 and count down by 4 so all together the anser is 32 bird and 4 dogs.\u003c/font\u003e\u003c/div\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804628,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "so Xaio 4 dogs and 32 pigeons.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689559,
      "currentSubmissionId": 804643
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f411"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-19T18:18:23.444Z"
    },
    "creator": {
      "creatorId": 238031,
      "username": "eRodriguez13",
      "safeName": "Erika R."
    },
    "longAnswer": "\u003cspan style=\"font-size:16px;\"\u003e\u003cspan style=\"color:#ff3399;\"\u003eI am Supposed to figure out how many dogs and how many pigeons there are, with the information \u0026quot;36 heads 80 feet\u0026quot;\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#FF0000;\"\u003e1-\u003c/span\u003e\u003cspan style=\"color:#00FF00;\"\u003e I notice\u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e that there would be more pigeons than dogs.\u003c/span\u003e\u003cspan style=\"color:#00ff99;\"\u003e\u0026nbsp;\u003c/span\u003e\u003cbr /\u003e\r\n\u003cspan style=\"color:#FF0000;\"\u003e2- \u003c/span\u003e\u003cspan style=\"color:#00FF00;\"\u003eI notice\u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e there\u0026#39;s two kind of animals.\u003c/span\u003e\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u003cspan style=\"color:#EE82EE;\"\u003eThis problem was:\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u003cspan style=\"color:#ff3366;\"\u003e-a little hard before I did the table.\u003cbr /\u003e\r\n- confusing before I figured out that there were more pigeons than dogs.\u003cbr /\u003e\r\n- Fun to do because I multiplied a lot, and multiplication to me is fun.\u003c/span\u003e\u003cbr /\u003e\r\n\u0026nbsp;\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e# of pigeons\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e# of dogs\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e# of pigeon feet\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e# of dog feet\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003eTotal feet\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000CD;\"\u003e25\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000CD;\"\u003e11\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000CD;\"\u003e50\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000CD;\"\u003e44\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e94\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e26\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e10\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e52\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e40\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e92\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e12\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e96\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e28\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e8\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e56\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e88\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e38\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e4\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e64\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e16\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e80\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804630,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "I did all the work in my guess and check table and got the answer. There are 32 pigeons and 4 dogs, which is 36 heads and 80 feet.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689551,
      "currentSubmissionId": 805778
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f412"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2014-02-03T21:45:33.731Z"
    },
    "creator": {
      "creatorId": 238017,
      "username": "pChapman13",
      "safeName": "Patrick C."
    },
    "longAnswer": "\u0026nbsp;\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #008000\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #008000\"\u003e20\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #008000\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #008000\"\u003e80\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #008000\"\u003e112\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e22\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e14\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e44\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e56\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e100\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e5\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e21\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e20\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e42\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e64\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ffff\"\u003e30\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ffff\"\u003e6\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ffff\"\u003e60\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ffff\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ffff\"\u003e84\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e4\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e64\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e80\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n\u0026nbsp;I got the answer 32 pigeons and 4 dogs. I notice that I got my answer on my fifth try. I highlighted my answer of the color dark blue.",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804625,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "My answer is 32 pigeons and 4 dogs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691136,
      "currentSubmissionId": 804625
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f413"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-19T18:28:52.180Z"
    },
    "creator": {
      "creatorId": 238028,
      "username": "jMurphy13",
      "safeName": "Joey M."
    },
    "longAnswer": "\u0026nbsp;\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 583px; height: 522px\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\r\n\u0009\u0009\u0009\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px\"\u003e\r\n\u0009\u0009\u0009\u0009\u003ctbody\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003ehow many birds\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003ehow many dogs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003ebirds legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003edogs legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003etotal legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e22\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e14\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e44\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e56\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e90\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e4\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e64\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e80\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u0009\u0009\u003c/tbody\u003e\r\n\u0009\u0009\u0009\u003c/table\u003e\r\n\u0009\u0009\u0009\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804627,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "I came to realise something was up and i came up the answer for 32 pigeons and 4 dogs i use radom numbers their was more birds than dogs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689560,
      "currentSubmissionId": 805217
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f414"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-19T18:41:57.292Z"
    },
    "creator": {
      "creatorId": 238074,
      "username": "jWhite13",
      "safeName": "Juslene W."
    },
    "longAnswer": "\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ccaption\u003eFeathers And Fur\u003c/caption\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ethe # number of pigeons\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e25\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e26\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e24\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e44\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e94\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ethe # of dogs\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e11\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e10\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e12\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e40\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e92\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ethe # of pigeon legs\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e50\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e52\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e54\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e48\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e96\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ethe # of dog legs\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e44\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e40\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e48\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e32\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e88\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003etotal of legs\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e94\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e92\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e96\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e16\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e80\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n\r\n\u003cdiv\u003e\u003cfont face=\"lucida sans unicode, lucida grande, sans-serif\"\u003ethere are more pigeons than dogs.\u0026nbsp;\u003c/font\u003e\u003c/div\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804629,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "the answer i got was 32 pigeons and 4 dogs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691100,
      "currentSubmissionId": 805784
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f415"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-19T18:25:21.257Z"
    },
    "creator": {
      "creatorId": 237848,
      "username": "mPrice13",
      "safeName": "Mysten P."
    },
    "longAnswer": "\u003cp\u003e\u0026nbsp;You know that Xiao has 36 heads, and 80 feet. so a dog has 4 paws, and pigeons have two feet. so what i did was guessed a random\u0026nbsp;number.\u003cbr /\u003e\r\nhonestly i guessed the wright one the first time. i thought that is birds have 2\u0026nbsp;legs and 2 multiplied by 10 is 20. that i noticed that dogs have 4 legs, and four times 15 is 60. Than i added sixty and twenty together and got 80.\u003cbr /\u003e\r\nSo you take 60 and divide it by four. you divide it by four because each dog has 4 legs, and when you divide thst by four you get how many dogs there\u0026nbsp;are. So do the same thing for birds, you take 20 and divide it by two. 20 divided by two is ten. So that\u0026#39;s how i got the answer.\u003cbr /\u003e\r\nI just remembered\u0026nbsp;that\u0026nbsp;t there are 36 heads, and if i have 15 added by 10 id only 35. i\u0026nbsp;needed 36.\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u0026nbsp;\u003c/p\u003e\r\n\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u0026nbsp;",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804632,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Xiao has fifteen dogs, and ten pigeons.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689562,
      "currentSubmissionId": 804632
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f416"
    },
    "clazz": {
      "clazzId": 103673,
      "name": "Period 7 Algebra Prep"
    },
    "createDate": {
      "$date": "2013-11-19T18:27:05.507Z"
    },
    "creator": {
      "creatorId": 238030,
      "username": "mNishoff13",
      "safeName": "Micah N."
    },
    "longAnswer": "1. I noticed there are 36 heads meaning there are 36 animals in all.\u003cbr /\u003e\r\n2. I noticed there are 80 feet total.\u003cbr /\u003e\r\n3. Pigeons all have 2 legs so every number I guess has to be multiplied by 2\u003cbr /\u003e\r\n4. Dogs have 4 legs so I have to multiply all the guessing numbers I get by 4\u003cbr /\u003e\r\n5. If I were to guess 8 dogs, the pigeons have to add up to equal 36 so what I do is \u0026quot;Reverse\u0026quot; by doing 36 - 8 = 28 So there will have to be 28 pigeons to add up to 36.\u003cbr /\u003e\r\n\u0026nbsp;\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#4B0082;\"\u003eDogs\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#4B0082;\"\u003eTimes\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#4B0082;\"\u003e\u0026nbsp; \u0026nbsp;Guess wand check the \u0026nbsp; \u0026nbsp; \u0026nbsp; answer\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#4B0082;\"\u003ePigeons\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#4B0082;\"\u003eTimes\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 8\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp;32 + 56 = 88 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Wrong)\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 28\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 2\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 7\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp;28 + 58 = 86 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Wrong)\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 29\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 2\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 6\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp;24 + 60 = 84 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Wrong)\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 30\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 2\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 5\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp;20 + 62 = 82 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Wrong)\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 31\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 2\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#00FF00;\"\u003e\u0026nbsp; \u0026nbsp; 4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#00FF00;\"\u003e\u0026nbsp; \u0026nbsp;x 4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\r\n\u0009\u0009\u0009\u003cp\u003e\u003cstrong\u003e\u003cspan style=\"color:#00FF00;\"\u003e\u0026nbsp;16 + 64 = 80 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Correct)\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e\r\n\u0009\u0009\u0009\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#00FF00;\"\u003e\u0026nbsp; \u0026nbsp; 32\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#00FF00;\"\u003e\u0026nbsp; \u0026nbsp;x 2\u003c/span\u003e\u003c/strong\u003e\u003cbr /\u003e\r\n\u0009\u0009\u0009\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\nAfter I did this table I got my answer to the problem.",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804633,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Xiao has a total of 4 dogs and 32 pigeons.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689561,
      "currentSubmissionId": 805206
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f417"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-19T18:38:45.126Z"
    },
    "creator": {
      "creatorId": 237929,
      "username": "cWilliams13",
      "safeName": "Crystal W."
    },
    "longAnswer": "\u003cspan style=\"color:#EE82EE;\"\u003eI took \u003c/span\u003e\u003cspan style=\"color:#FF8C00;\"\u003e80 heads\u003c/span\u003e\u003cspan style=\"color:#EE82EE;\"\u003e and \u003c/span\u003e\u003cspan style=\"color:#FFA07A;\"\u003e36 feet\u003c/span\u003e\u003cspan style=\"color:#EE82EE;\"\u003e and i added them and got \u003c/span\u003e\u003cspan style=\"color:#AFEEEE;\"\u003e116 heads and feet altogether.\u0026nbsp;\u003c/span\u003e\u003cbr /\u003e\r\n\u003cspan style=\"color:#FF0000;\"\u003eI notice that she is currently feeding 80 heads.\u0026nbsp;\u003c/span\u003e\u003cbr /\u003e\r\n\u003cspan style=\"color:#00FFFF;\"\u003eI notice that she is currently hosting 36 feet.\u003c/span\u003e\u003cbr /\u003e\r\n\u0026nbsp;",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804631,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "An elderly women is currently hosting and feeding homing pigeons and seeing-eye dogs because she likes to take care of those kind of animals.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689565,
      "currentSubmissionId": 804631
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f418"
    },
    "clazz": {
      "clazzId": 103673,
      "name": "Period 7 Algebra Prep"
    },
    "createDate": {
      "$date": "2013-11-19T19:10:38.323Z"
    },
    "creator": {
      "creatorId": 238030,
      "username": "mNishoff13",
      "safeName": "Micah N."
    },
    "longAnswer": "1. I noticed there are 36 heads meaning there are 36 animals in all.\u003cbr /\u003e\r\n2. I noticed there are 80 feet total.\u003cbr /\u003e\r\n3. Pigeons all have 2 legs so every number I guess has to be multiplied by 2\u003cbr /\u003e\r\n4. Dogs have 4 legs so I have to multiply all the guessing numbers I get by 4\u003cbr /\u003e\r\n5. If I were to guess 8 dogs, the pigeons have to add up to equal 36 so what I do is \u0026quot;Reverse\u0026quot; by doing 36 - 8 = 28 So there will have to be 28 pigeons to add up to 36.\u003cbr /\u003e\r\n\u0026nbsp;\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#4B0082;\"\u003eDogs\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#4B0082;\"\u003eTimes\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#4B0082;\"\u003e\u0026nbsp; \u0026nbsp;Guess wand check the \u0026nbsp; \u0026nbsp; \u0026nbsp; answer\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#4B0082;\"\u003ePigeons\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#4B0082;\"\u003eTimes\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 8\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp;32 + 56 = 88 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Wrong)\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 28\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 2\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 7\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp;28 + 58 = 86 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Wrong)\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 29\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 2\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 6\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp;24 + 60 = 84 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Wrong)\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 30\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 2\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 5\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp;20 + 62 = 82 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Wrong)\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 31\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 2\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#00FF00;\"\u003e\u0026nbsp; \u0026nbsp; 4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#00FF00;\"\u003e\u0026nbsp; \u0026nbsp;x 4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\r\n\u0009\u0009\u0009\u003cp\u003e\u003cstrong\u003e\u003cspan style=\"color:#00FF00;\"\u003e\u0026nbsp;16 + 64 = 80 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Correct)\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e\r\n\u0009\u0009\u0009\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#00FF00;\"\u003e\u0026nbsp; \u0026nbsp; 32\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#00FF00;\"\u003e\u0026nbsp; \u0026nbsp;x 2\u003c/span\u003e\u003c/strong\u003e\u003cbr /\u003e\r\n\u0009\u0009\u0009\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\nAfter I did this table I got my answer to the problem.",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804641,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Xiao has a total of 4 dogs and 32 pigeons.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689561,
      "currentSubmissionId": 805206
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f419"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-19T18:35:21.587Z"
    },
    "creator": {
      "creatorId": 237851,
      "username": "mIverson13",
      "safeName": "Michael I."
    },
    "longAnswer": "\u0026nbsp;\r\n\u003cdiv style=\"margin-left: 40px;\"\u003e\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003enumbers of pigieons\u0026nbsp;\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003enumbers of dogs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003enumber of bird legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003enumber of dog legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003etottle #\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e12\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e96\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e25\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e11\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e50\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e44\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e94\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e26\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e10\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e52\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e40\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e92\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e27\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e9\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e54\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e36\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e90\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e28\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e8\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e56\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e88\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e29\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e7\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e58\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e28\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e86\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e30\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e6\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e60\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e84\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e31\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e5\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e62\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e20\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e82\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e4\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e64\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e80\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n\u003cfont color=\"#00ffff\" face=\"comic sans ms, cursive\"\u003ei got my anser by doing a gess and check table and just went from 24 bid and 12 dogs and all the way tell 32 birds and 4 dogs and this math forum problem was hard to get but easy and it had 2 patterns one when count down by 2 and count down by 4 so all together the anser is 32 bird and 4 dogs.\u003c/font\u003e\u003c/div\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804643,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "so Xaio 4 dogs and 32 pigeons.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689559,
      "currentSubmissionId": 804643
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f41a"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-21T18:41:56.002Z"
    },
    "creator": {
      "creatorId": 238019,
      "username": "rDunham13",
      "safeName": "Raven D."
    },
    "longAnswer": "I notisted it is ascking me how many animals thar are in all and I also notist thare are \u003cspan style=\"color: #0000ff\"\u003e36 hade\u003c/span\u003e and\u003cspan style=\"color: #ff0099\"\u003e 80 feet\u003cfont color=\"#333333\"\u003e\u0026nbsp;I have found the\u003c/font\u003e\u003c/span\u003e\u003cspan style=\"color: #0000ff\"\u003e \u003c/span\u003e\u003cspan style=\"color: #cc33ff\"\u003eIVF\u003c/span\u003e the\u003cspan style=\"color: #40e0d0\"\u003e\u0026nbsp;\u003c/span\u003eFeather and fer\u0026nbsp;qeshtin\u0026nbsp;is asking how many dogs and pigeons thar are.\u0026nbsp;\u0026nbsp; \u003cspan style=\"color: #4b0082\"\u003e36-80=44 \u003c/span\u003e\u003cspan style=\"color: #ff33ff\"\u003e36+44=80\u0026nbsp;\u003c/span\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804638,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "first I subtracked36 and 80 and I got 44 then I added 36 to 44 and I got 80",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691138,
      "currentSubmissionId": 804638
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f41b"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-19T18:20:05.221Z"
    },
    "creator": {
      "creatorId": 238031,
      "username": "eRodriguez13",
      "safeName": "Erika R."
    },
    "longAnswer": "\u003cspan style=\"font-size:16px;\"\u003e\u003cspan style=\"color:#ff3399;\"\u003eI am Supposed to figure out how many dogs and how many pigeons there are, with the information \u0026quot;36 heads 80 feet\u0026quot;\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#FF0000;\"\u003e1-\u003c/span\u003e\u003cspan style=\"color:#00FF00;\"\u003e I notice\u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e that there would be more pigeons than dogs.\u003c/span\u003e\u003cspan style=\"color:#00ff99;\"\u003e\u0026nbsp;\u003c/span\u003e\u003cbr /\u003e\r\n\u003cspan style=\"color:#FF0000;\"\u003e2- \u003c/span\u003e\u003cspan style=\"color:#00FF00;\"\u003eI notice\u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e there\u0026#39;s two kind of animals.\u003c/span\u003e\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u003cspan style=\"color:#EE82EE;\"\u003eThis problem was:\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u003cspan style=\"color:#ff3366;\"\u003e-a little hard before I did the table.\u003cbr /\u003e\r\n- confusing before I figured out that there were more pigeons than dogs.\u003cbr /\u003e\r\n- Fun to do because I multiplied a lot, and multiplication to me is fun.\u003c/span\u003e\u003cbr /\u003e\r\n\u0026nbsp;\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e# of pigeons\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e# of dogs\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e# of pigeon feet\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e# of dog feet\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003eTotal feet\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000CD;\"\u003e25\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000CD;\"\u003e11\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000CD;\"\u003e50\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000CD;\"\u003e44\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e94\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e26\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e10\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e52\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e40\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e92\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e12\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e96\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e28\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e8\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e56\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e88\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e38\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e4\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e64\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e16\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e80\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804634,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "I did all the work in my guess and check table and got the answer. There are 32 pigeons and 4 dogs, which is 36 heads and 80 feet.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689551,
      "currentSubmissionId": 805778
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f41c"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-19T19:49:25.231Z"
    },
    "creator": {
      "creatorId": 237859,
      "username": "cLuchsinger13",
      "safeName": "Carty L."
    },
    "longAnswer": "In the problem \u0026quot;Feathers and fur\u0026quot; Xiao said that she counted the heads and the legs, 36 heads and 80 legs and so in made a chart and went down the chart trying to solve the problem of how many dog and pigeons there are.So\u0026nbsp;finally i took 32 Pigeons and 4 dogs and then got 64 and then got 16 and then got the 80 legs",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804708,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Xiao has 32 Pigeons and 4 dogs. are.So",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691188,
      "currentSubmissionId": 805303
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f41d"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-19T19:54:12.180Z"
    },
    "creator": {
      "creatorId": 237854,
      "username": "dDedmon13",
      "safeName": "Dorothy D."
    },
    "longAnswer": "\u003cp\u003eI got the answer by \u003cem\u003emultiplying\u003c/em\u003e 32 and 2 wich equals 64, and\u0026nbsp;then \u003cem\u003emultiplying\u003c/em\u003e 4 and 4 which equaled 16, and then \u003cem\u003eadding \u003c/em\u003e64 and 16 wich then equaled 80.\u003c/p\u003e\r\n\r\n\u003cp\u003e\u003cspan style=\"color: #0000ff\"\u003eCheck For Answer\u003c/span\u003e\u003cbr /\u003e\r\n\u0026nbsp;32*2=64\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp; 4*4=16\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp; 64+16=80\u003c/p\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804710,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "xiao came up with 80 dogs and pigeons all together. To get the answer she did some addition and multiplication.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691190,
      "currentSubmissionId": 804729
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f41e"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-19T20:02:12.923Z"
    },
    "creator": {
      "creatorId": 237860,
      "username": "rMathis13",
      "safeName": "Richelle M."
    },
    "longAnswer": "\u003cspan style=\"font-family: courier new, courier, monospace\"\u003eThe problem is asking me how many pigeons and dogs are there. I\u0026nbsp;noitce that\u0026nbsp;theres 36 heads, and 80 feet.\u0026nbsp;Also pigeons have 2 feet and dogs have 4 feet.\u003c/span\u003e\u0026nbsp;\r\n\u003cdiv style=\"text-align: center\"\u003e\u003cspan style=\"color: #000080\"\u003eFeather and Fur!\u003c/span\u003e\u0026nbsp;\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #ff3333\"\u003e\u003cspan style=\"font-size: 16px\"\u003e# of pigeons\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #ff3333\"\u003e\u003cspan style=\"font-size: 16px\"\u003e# of pigeons legs\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #ff3333\"\u003e\u003cspan style=\"font-size: 16px\"\u003e# of Dogs\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #ff3333\"\u003e\u003cspan style=\"font-size: 16px\"\u003e# of Dog legs\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #ff3333\"\u003e\u003cspan style=\"font-size: 16px\"\u003eTOTAL\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e30\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e60\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e6\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e24\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e84\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e31\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e62\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e5\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e20\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e82\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e32\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e64\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e4\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e16\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e80\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n\r\n\u003cdiv style=\"text-align: left\"\u003e\u003cspan style=\"color: #663399\"\u003e\u003cspan style=\"font-family: comic sans ms, cursive\"\u003eCheck-\u0026nbsp; pigeons 32 x 2=64, Dogs 4 x 4=16.\u0026nbsp;I added 64 and 16. it equals 80. Theres 32 Pigeons and 4 Dogs.\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u0026nbsp;\u003c/div\u003e\r\n\u003c/div\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804707,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Xiao has 32 Pigeons and 4 Dogs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691187,
      "currentSubmissionId": 804732
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f41f"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-20T19:53:30.500Z"
    },
    "creator": {
      "creatorId": 237863,
      "username": "dRyan13",
      "safeName": "Dixie R."
    },
    "longAnswer": "\u003cp\u003e\u003cspan style=\"font-family: arial, helvetica, sans-serif\"\u003e\u003cspan style=\"color: #00ff00\"\u003eIn feathers and fur they are aks how many\u0026nbsp;dogs and pigeon\u0026nbsp;are there.\u0026nbsp;Fith you timeth\u0026nbsp;32 and 2 with\u0026nbsp;you get\u0026nbsp;64 than you timeth 4 and\u0026nbsp;4 with is 16. than\u0026nbsp;you add 64 and 16 with is 80.\u003c/span\u003e\u003c/span\u003e\u003c/p\u003e\r\n\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px\"\u003e\r\n\u0009\u003ccaption\u003e\r\n\u0009\u003cdiv\u003e\u003cspan style=\"color: #ff0000\"\u003efeathers and fur\u003c/span\u003e\u003c/div\u003e\r\n\u0009\u003c/caption\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003epigeoms 32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e32 * 2 =\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e64\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003edogs\u0026nbsp; 4\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e4*4 =\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e16\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003epigeoms legs 2\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e64\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003edogs legs 4\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e16\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003elegs in all\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e80\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804709,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Xiao,32 pigeons and 4 dogs",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691189,
      "currentSubmissionId": 804709
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f420"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-19T20:01:50.261Z"
    },
    "creator": {
      "creatorId": 237857,
      "username": "tKorst13",
      "safeName": "Tyler K."
    },
    "longAnswer": "\u003cspan style=\"font-family: arial, helvetica, sans-serif\"\u003e\u003cspan style=\"font-size: 16px\"\u003eThere is 36 heads and 80 feet but i have finally got my answer. If you add\u003cbr /\u003e\r\n64+16 it = 80 feet. I also no that there are 32 pigions and only 4 dogs so\u003cbr /\u003e\r\nthat makes 36 heads and 80 feet. So my answer is \u003cspan style=\"color: #0000ff\"\u003e32 pigions\u003c/span\u003e\u003cspan style=\"color: #ff0000\"\u003e and 4 dogs \u003c/span\u003e\u003cbr /\u003e\r\nthat gives 36 heads and 80 feet. I aslo think that the answer was kind of hard becase it did not make sense at first. When it said there was 36 heads i didnt no it was talking about 36 animals. \u003c/span\u003e\u003c/span\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804717,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "If you add 64+16=80 that is for feet and there is 36 \r\nheads so 36 animals.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691197,
      "currentSubmissionId": 805293
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f421"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-19T20:09:13.100Z"
    },
    "creator": {
      "creatorId": 237856,
      "username": "eGordon13",
      "safeName": "Erica G."
    },
    "longAnswer": "\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e\u003cem\u003e\u003cspan style=\"color:#FFA500;\"\u003ePidgins \u0026nbsp; \u003c/span\u003e\u0026nbsp; \u003cspan style=\"color:#8B4513;\"\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp;Dogs \u0026nbsp; \u003c/span\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u003cspan style=\"color:#FFA500;\"\u003ePidgin legs\u003c/span\u003e \u0026nbsp; \u003cspan style=\"color:#8B4513;\"\u003e\u0026nbsp; \u0026nbsp;Dog Legs\u003c/span\u003e \u0026nbsp; \u0026nbsp; \u003cspan style=\"color:#2F4F4F;\"\u003eTotal of legs\u003c/span\u003e\u003c/em\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e46\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e16\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e92\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e64\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e736\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e52\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e5\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e104\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e20\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e260\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e31\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e4\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e62\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e16\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e72\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#00FF00;\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#00FF00;\"\u003e4\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#00FF00;\"\u003e64\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#00FF00;\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#00FF00;\"\u003e80\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n32/4=80 64+16=80\u003cbr /\u003e\r\nFirst Of all Don\u0026#39;t know if i Added those up right I used the Guessing \u0026amp; cheek Method .\u003cbr /\u003e\r\n\u003cbr /\u003e\r\nI notice There should be Less Dogs Than Pidgins.\u003cbr /\u003e\r\nI notice There Are More Pidgins than dogs .\u003cbr /\u003e\r\nI wounder If \u0026nbsp;Xiao was Hosting Humans as well Because there are more animals Than one person \u0026gt;\u0026gt; Xiao.",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804704,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "The answer of this problem of Feathers and Fur is , 32 Pidgins and 4 Dogs  .",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691184,
      "currentSubmissionId": 805302
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f422"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-19T20:00:25.417Z"
    },
    "creator": {
      "creatorId": 238075,
      "username": "nWilson13",
      "safeName": "Nick W."
    },
    "longAnswer": "dogs\u003cspan style=\"color:#000080;\"\u003e:4*4=16\u003c/span\u003e\r\n\u003chr /\u003e\r\n\u003chr /\u003e\u003cbr /\u003e\r\nPigeons: 32*2=64\u003cbr /\u003e\r\n\u003cbr /\u003e\r\nheads: 64+16=80\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u0026nbsp;",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804724,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "i got 80 heads and 36 feet. There are 4 legs for both dogs and i multiplied 4*4=16 and the pigeons i multiplied 32*  2=64 and then i add 16+64=80 and that's my work",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691204,
      "currentSubmissionId": 805314
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f423"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-19T20:11:46.147Z"
    },
    "creator": {
      "creatorId": 237855,
      "username": "dGates13",
      "safeName": "Dylan G."
    },
    "longAnswer": "\u003cfont color=\"#f0fff0\"\u003e\u0026nbsp; \u0026nbsp;\u003c/font\u003e\u003cspan style=\"color:#000000;\"\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp;\u003c/span\u003e\u003cspan style=\"color:#FFD700;\"\u003e \u0026nbsp;\u003c/span\u003e\u003cspan style=\"color:#DAA520;\"\u003e I got the answer\u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e \u003c/span\u003e\u003cspan style=\"color:#008000;\"\u003e32 pigeons\u003c/span\u003e\u003cspan style=\"color:#DAA520;\"\u003e and\u003c/span\u003e\u003cspan style=\"color:#008000;\"\u003e 4 dogs\u003c/span\u003e\u003cspan style=\"color:#DAA520;\"\u003e by using the guess and check method and I first started \u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e18 dogs\u003c/span\u003e\u003cspan style=\"color:#DAA520;\"\u003e and \u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e18 pigeons \u003c/span\u003e\u003cspan style=\"color:#DAA520;\"\u003efor my first answer but I realized that it didn\u0026#39;t match the legs and after a long series of guesing and checking I got my answer.\u003c/span\u003e\u003cspan style=\"color:#000000;\"\u003e \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u003c/span\u003e\u003cspan style=\"color:#008000;\"\u003eI notice that there is 36 heads and 80 legs \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003eI notice that Xiao is a Chinese name \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u003c/span\u003e\u003cspan style=\"color:#800080;\"\u003eI wonder if there is less dogs than pigeons. \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u003c/span\u003e\u003cspan style=\"color:#B22222;\"\u003e\u0026nbsp;Check: 18 dogs+18 pigeons= 36=98 legs\u003c/span\u003e \u0026nbsp;\u003cspan style=\"color:#006400;\"\u003eCheck:32 pigeons+ 4 dogs= 36 heads 80 legs\u0026nbsp;\u003c/span\u003e\u0026nbsp; I got the answer from the text feathers and Fur \u0026nbsp; \u0026nbsp;\u003cspan style=\"color:#800080;\"\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u0026nbsp;\u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp;\u003c/span\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804715,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "I got the answer 32 pigeons and 4 dogs. By checking with the other answer 18 dogs and 18 pigeons but it didn't match the legs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691195,
      "currentSubmissionId": 805294
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f424"
    },
    "clazz": {
      "clazzId": 103673,
      "name": "Period 7 Algebra Prep"
    },
    "createDate": {
      "$date": "2013-11-20T19:54:04.179Z"
    },
    "creator": {
      "creatorId": 238079,
      "username": "kLeavens",
      "safeName": "Kassie L."
    },
    "longAnswer": "\u003cspan style=\"color:#000000;\"\u003eThe problem \u0026quot;Feathers and Fur\u0026quot; was a bit confusing, and still is but i\u0026#39;m going to try my best to solve the problem.. So Xiao has 36 heads and 80 feet, all together she has 36 dogs and pigeons.\u003c/span\u003e Dogs have 4 legs, pigeons have 2, at first i tried to solve the problem but i forgot about the pigeons, that they only have 2 legs, so that very important to remember. I\u0026#39;m going to try examples...\u003cbr /\u003e\r\n2 * 32 = 64 Pigeons \u0026nbsp; \u0026nbsp;4 * 4 = 16 Dogs. \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; 64 + 16 = 80 Feet. I guest the number 32, at first i tried 32 dogs but it was not the right number, then i added 4 because we needed to get to 36, then i multiplied pigeon feet by 32 and multiplied dog feet by 4 and got 64 and 16 then i added them and got 80.",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804726,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "The problem \"Feathers and Fur\" was a little tricky at first, but i am almost positive i have the answer...32 pigeons and 4 dogs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691205,
      "currentSubmissionId": 813107
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f425"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-19T20:07:01.078Z"
    },
    "creator": {
      "creatorId": 237862,
      "username": "cNicholson13",
      "safeName": "Cole N."
    },
    "longAnswer": "\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e# of pigeons\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e#of pigeon legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e# of dogs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e# of dogs legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003eAll together\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e30\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e60\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e6\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e84\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e31\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e62\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e5\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e20\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e82\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e64\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e4\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e80\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"5\"\u003eI Got my awnser by timesing and dividing the heads and legs to get my awnser. I Thought trying a table would be an easyer way the other ways. The problem was a kinda hard but yet no really.\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804718,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Theres 32 pigeons and 4 dogs",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691198,
      "currentSubmissionId": 805315
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f426"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-19T20:08:58.582Z"
    },
    "creator": {
      "creatorId": 237853,
      "username": "nClark13",
      "safeName": "Nathan C."
    },
    "longAnswer": "i notice that they are asking me to find the amount of animals their are for pigeons and dogs.\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000ff;\"\u003e# of pigeons\u0026nbsp;\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e# of dogs\u003c/span\u003e\u0026nbsp;\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e#of pigeons legs\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e#of dog legs\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003etotal\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e24\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e12\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e48\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e24\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e72\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e30\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e6\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e60\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e12\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e72\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e35\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e1\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e70\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e74\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e32\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e64\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e16\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e80\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\ncheck: \u0026nbsp;32 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; 64\u003cbr /\u003e\r\n\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;+4 \u0026nbsp; \u0026nbsp; \u0026nbsp; +16\u003cbr /\u003e\r\n\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; 36 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;80",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804712,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "i think the right answer is 32 and 4 for heads",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691192,
      "currentSubmissionId": 805306
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f427"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-19T20:07:36.154Z"
    },
    "creator": {
      "creatorId": 237859,
      "username": "cLuchsinger13",
      "safeName": "Carty L."
    },
    "longAnswer": "\u003cspan style=\"color:#A52A2A;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003e\u003cstrong\u003eIn the problem \u0026quot;Feathers and fur\u0026quot; Xiao said that she counted\u003cbr /\u003e\r\nthe heads and the legs, 36 heads and 80 legs and so in made a chart and went down the chart trying to solve the problem of how many dog and pigeons there \u0026#8203;are. So\u0026nbsp;finally i took 32 Pigeons and 4 dogs and then got 64 and then got 16 and then got the 80 legs.\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u003cbr /\u003e\r\nMy refletion is that when i started i wanted to give up so much that i was just playing around with number that i got 32 and 4 and then i said how about 32 pigeons and 4 dogs and then i started to mulitpy and then i did this.... 32*2=64 and 4*4=16 and 64+16=80 so i got my 80 legs and my heads by 32+4=36 so i got my 36 heads and my 80 legs. \u0026nbsp;\u003cbr /\u003e\r\n\u0026nbsp;\u003c/strong\u003e\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u0026nbsp;",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804728,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Xiao has 32 Pigeons and 4 dogs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691188,
      "currentSubmissionId": 805303
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f428"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-19T20:12:38.285Z"
    },
    "creator": {
      "creatorId": 237857,
      "username": "tKorst13",
      "safeName": "Tyler K."
    },
    "longAnswer": "\u003cspan style=\"font-family: arial, helvetica, sans-serif\"\u003e\u003cspan style=\"font-size: 16px\"\u003eThere is 36 heads and 80 feet but i have finally got my answer. If you add\u003cbr /\u003e\r\n64+16 it = 80 feet. I also no that there are 32 pigions and only 4 dogs so\u003cbr /\u003e\r\nthat makes 36 heads and 80 feet. So my answer is \u003cspan style=\"color: #0000ff\"\u003e32 pigions\u003c/span\u003e\u003cspan style=\"color: #ff0000\"\u003e and 4 dogs \u003c/span\u003e\u003cbr /\u003e\r\nthat gives 36 heads and 80 feet. I aslo think that the answer was kind of hard becase it did not make sense at first. When it said there was 36 heads i didnt no it was talking about 36 animals. I think it was easyer when we made a table on the big piece of paper that we used. I also thought that it was easyer when we got with a partner so we could both talk over the answer with each other.\u003c/span\u003e\u003c/span\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804734,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "If you add 64+16=80 that is for feet and there is 36 \r\nheads so 36 animals.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691197,
      "currentSubmissionId": 805293
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f429"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-21T19:50:35.255Z"
    },
    "creator": {
      "creatorId": 237861,
      "username": "rMyrepowell13",
      "safeName": "Ray M."
    },
    "longAnswer": "\u003cdiv style=\"margin-left: 80px;\"\u003e\u0026nbsp;\u003c/div\u003e\r\n\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003cthead\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003cth scope=\"col\" style=\"text-align: left;\"\u003edog\u003c/th\u003e\r\n\u0009\u0009\u0009\u003cth scope=\"col\"\u003edog legs\u003c/th\u003e\r\n\u0009\u0009\u0009\u003cth scope=\"col\"\u003epigeons\u003c/th\u003e\r\n\u0009\u0009\u0009\u003cth colspan=\"2\" scope=\"col\"\u003epigeon legs\u003c/th\u003e\r\n\u0009\u0009\u0009\u003cth scope=\"col\"\u003etotal\u003c/th\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/thead\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e18\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e72\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e18\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"2\"\u003e36\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e108\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e16\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e64\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e20\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"2\"\u003e40\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e104\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e11\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e44\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e25\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"2\"\u003e50\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e61\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e12\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e48\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e26\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"2\"\u003e52\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e100\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e13\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e52\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e27\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"2\"\u003e54\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e106\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e14\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e56\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e28\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"2\"\u003e56\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e112\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e10\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e40\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e24\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"2\"\u003e48\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e80\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e9\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e36\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e20\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"2\"\u003e40\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e76\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e8\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e32\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e18\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"2\"\u003e36\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e68\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e10\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e40\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e26\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"2\"\u003e43\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e83\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e4\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e16\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e32\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e64\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e80\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"6\"\u003e\r\n\u0009\u0009\u0009\u003cdiv\u003e\u0026nbsp;\u003c/div\u003e\r\n\u0009\u0009\u0009\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"6\"\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"6\"\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"6\"\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"6\"\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804727,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "The answer is 4 dogs and 32 pigeons.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691206,
      "currentSubmissionId": 804727
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f42a"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-19T19:53:49.382Z"
    },
    "creator": {
      "creatorId": 237859,
      "username": "cLuchsinger13",
      "safeName": "Carty L."
    },
    "longAnswer": "\u003cspan style=\"color:#A52A2A;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003e\u003cem\u003e\u003cstrong\u003eIn the problem \u0026quot;Feathers and fur\u0026quot; Xiao said that she counted\u003cbr /\u003e\r\nthe heads and the legs, 36 heads and 80 legs and so in made a chart and went down the chart trying to solve the problem of how many dog and pigeons there \u0026#8203;are. So\u0026nbsp;finally i took 32 Pigeons and 4 dogs and then got 64 and then got 16 and then got the 80 legs.\u003c/strong\u003e\u003c/em\u003e\u003c/span\u003e\u003c/span\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804725,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Xiao has 32 Pigeons and 4 dogs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691188,
      "currentSubmissionId": 805303
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f42b"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-19T20:09:06.645Z"
    },
    "creator": {
      "creatorId": 237862,
      "username": "cNicholson13",
      "safeName": "Cole N."
    },
    "longAnswer": "\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e# of pigeons\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e#of pigeon legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e# of dogs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e# of dogs legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003eAll together\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e30\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e60\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e6\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e84\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e31\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e62\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e5\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e20\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e82\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e64\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e4\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e80\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"5\"\u003eI Got my awnser by timesing and dividing the heads and legs to get my awnser. I Thought trying a table would be an easyer way the other ways. The problem was a kinda hard but yet no really.\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804736,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Theres 32 pigeons and 4 dogs",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691198,
      "currentSubmissionId": 805315
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f42c"
    },
    "clazz": {
      "clazzId": 103673,
      "name": "Period 7 Algebra Prep"
    },
    "createDate": {
      "$date": "2013-11-20T18:24:02.429Z"
    },
    "creator": {
      "creatorId": 238030,
      "username": "mNishoff13",
      "safeName": "Micah N."
    },
    "longAnswer": "1. I noticed there are 36 heads meaning there are 36 animals in all.\u003cbr /\u003e\r\n2. I noticed there are 80 feet total.\u003cbr /\u003e\r\n3. Pigeons all have 2 legs so every number I guess has to be multiplied by 2\u003cbr /\u003e\r\n4. Dogs have 4 legs so I have to multiply all the guessing numbers I get by 4\u003cbr /\u003e\r\n5. If I were to guess 8 dogs, the pigeons have to add up to equal 36 so what I do is \u0026quot;Reverse\u0026quot; by doing 36 - 8 = 28 So there will have to be 28 pigeons to add up to 36.\u003cbr /\u003e\r\n\u0026nbsp;\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#4B0082;\"\u003eDogs\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#4B0082;\"\u003eTimes\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#4B0082;\"\u003e\u0026nbsp; \u0026nbsp;Guess wand check the \u0026nbsp; \u0026nbsp; \u0026nbsp; answer\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#4B0082;\"\u003ePigeons\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#4B0082;\"\u003eTimes\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 8\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp;32 + 56 = 88 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Wrong)\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 28\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 2\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 7\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp;28 + 58 = 86 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Wrong)\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 29\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 2\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 6\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp;24 + 60 = 84 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Wrong)\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 30\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 2\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 5\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp;20 + 62 = 82 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Wrong)\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp; 31\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp; \u0026nbsp;x 2\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#00FF00;\"\u003e\u0026nbsp; \u0026nbsp; 4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#00FF00;\"\u003e\u0026nbsp; \u0026nbsp;x 4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\r\n\u0009\u0009\u0009\u003cp\u003e\u003cstrong\u003e\u003cspan style=\"color:#00FF00;\"\u003e\u0026nbsp;16 + 64 = 80 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; (Correct)\u003c/span\u003e\u003c/strong\u003e\u003c/p\u003e\r\n\u0009\u0009\u0009\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#00FF00;\"\u003e\u0026nbsp; \u0026nbsp; 32\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#00FF00;\"\u003e\u0026nbsp; \u0026nbsp;x 2\u003c/span\u003e\u003c/strong\u003e\u003cbr /\u003e\r\n\u0009\u0009\u0009\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\nWhat I Reflected on:\u003cbr /\u003e\r\n1. After I did this table I learned many new ways for\u0026nbsp;strategies.\u003cbr /\u003e\r\n2. When My friend needed help, I told me them my\u0026nbsp;strategy of \u0026quot;\u003cspan style=\"color:#FF0000;\"\u003eguess and check\u003c/span\u003e\u0026quot; and it helped them a lot.\u0026nbsp;\u003cbr /\u003e\r\n3. \u003cspan style=\"color:#FF8C00;\"\u003eWhen learning new\u0026nbsp;strategies I got this one from the teacher\u003c/span\u003e: ( \u003cspan style=\"color:#000080;\"\u003eWhat she did was she put up 36 heads for the animals like so\u003c/span\u003e ) o o o o o o o o o o o o o o o o o o o o o o o o o o o o o o o o o o o ( \u003cspan style=\"color:#000080;\"\u003eThen started adding the legs for the pigeons\u003c/span\u003e ( \u003cspan style=\"color:#FF0000;\"\u003eThe dots are legs\u003c/span\u003e ) ) .O. \u0026nbsp; .O. \u0026nbsp; .O. ( \u003cspan style=\"color:#000080;\"\u003eSo on till 32 heads had 2 legs each. Which all added up to 64 legs\u003c/span\u003e. \u0026nbsp;( \u003cspan style=\"color:#FF0000;\"\u003epigeons\u003c/span\u003e )\u003cspan style=\"color:#000080;\"\u003e Than she seen that there were 4 heads left but if she added 4 more pigeons she would have 72 legs and she needs 80 legs total, So instead she added 4 dogs which all have 4 legs\u003c/span\u003e. ( \u003cspan style=\"color:#FF0000;\"\u003ea total of 16 legs\u003c/span\u003e ) \u003cspan style=\"color:#00FF00;\"\u003eWhich is 16 + 64 = 80. She got 80 legs with 36 heads, she completed the question with 4 dogs and 32 pigeons\u003c/span\u003e\u003cspan style=\"color:#000000;\"\u003e.\u003c/span\u003e\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u0026nbsp;",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805206,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Xiao has a total of 4 dogs and 32 pigeons.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689561,
      "currentSubmissionId": 805206
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f42d"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-19T20:07:03.705Z"
    },
    "creator": {
      "creatorId": 237860,
      "username": "rMathis13",
      "safeName": "Richelle M."
    },
    "longAnswer": "\u003cspan style=\"font-family: courier new, courier, monospace\"\u003eThe problem is asking me how many pigeons and dogs are there. I\u0026nbsp;noitce that\u0026nbsp;theres 36 heads, and 80 feet.\u0026nbsp;Also pigeons have 2 feet and dogs have 4 feet.\u003c/span\u003e\r\n\u003cdiv style=\"text-align: center\"\u003e\u003cspan style=\"color: #000080\"\u003eFeathers and Fur!\u003c/span\u003e\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #ff3333\"\u003e\u003cspan style=\"font-size: 16px\"\u003e# of pigeons\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #ff3333\"\u003e\u003cspan style=\"font-size: 16px\"\u003e# of pigeons legs\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #ff3333\"\u003e\u003cspan style=\"font-size: 16px\"\u003e# of Dogs\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #ff3333\"\u003e\u003cspan style=\"font-size: 16px\"\u003e# of Dog legs\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #ff3333\"\u003e\u003cspan style=\"font-size: 16px\"\u003eTOTAL\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e30\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e60\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e6\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e24\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e84\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e31\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e62\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e5\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e20\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e82\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e32\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e64\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e4\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e16\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: lucida sans unicode, lucida grande, sans-serif\"\u003e\u003cspan style=\"color: #cc0099\"\u003e80\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n\r\n\u003cdiv style=\"text-align: left\"\u003e\u003cspan style=\"color: #663399\"\u003e\u003cspan style=\"font-family: comic sans ms, cursive\"\u003eCheck-\u0026nbsp; pigeons 32 x 2=64, Dogs 4 x 4=16.\u0026nbsp;I added 64 and 16. it equals 80. Theres 32 Pigeons and 4 Dogs.\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u0026nbsp;\u003c/div\u003e\r\n\u003c/div\u003e\r\nthis problem was easy beacuse I solved the problem befor\u0026nbsp;I went to the computer.",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804732,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Xiao has 32 Pigeons and 4 Dogs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691187,
      "currentSubmissionId": 804732
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f42e"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-19T20:17:15.088Z"
    },
    "creator": {
      "creatorId": 237859,
      "username": "cLuchsinger13",
      "safeName": "Carty L."
    },
    "longAnswer": "\u003cspan style=\"color:#A52A2A;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003e\u003cstrong\u003eIn the problem \u0026quot;Feathers and fur\u0026quot; Xiao said that she counted\u003cbr /\u003e\r\nthe heads and the legs, 36 heads and 80 legs and so in made a chart and went down the chart trying to solve the problem of how many dog and pigeons there \u0026#8203;are. So\u0026nbsp;finally i took 32 Pigeons and 4 dogs and then got 64 and then got 16 and then got the 80 legs.\u003c/strong\u003e\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u0026nbsp;\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ccaption\u003eFeathers and fur\u003c/caption\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003epigeons \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; 19\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e18\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e32\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003edogs \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;17\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e18\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e4\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003epigeons legs \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; 38\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e36\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e64\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003edogs legs \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; 68\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e72\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e16\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003eall legs \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; 106\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e108 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e80 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n\u003cbr /\u003e\r\n\u003cspan style=\"color:#A52A2A;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003e\u003cstrong\u003eMy refletion is that when i started i wanted to give up so much that i was just playing around with number that i got 32 and 4 and then i said how about 32 pigeons and 4 dogs and then i started to mulitpy and then i did this.... 32*2=64 and 4*4=16 and 64+16=80 so i got my 80 legs and my heads by 32+4=36 so i got my 36 heads and my 80 legs. \u0026nbsp;\u003cbr /\u003e\r\n\u0026nbsp;\u003c/strong\u003e\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u0026nbsp;",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804735,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Xiao has 32 Pigeons and 4 dogs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691188,
      "currentSubmissionId": 805303
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f42f"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-20T19:47:34.673Z"
    },
    "creator": {
      "creatorId": 237854,
      "username": "dDedmon13",
      "safeName": "Dorothy D."
    },
    "longAnswer": "\u003cp\u003e\u003cspan style=\"font-family: comic sans ms, cursive\"\u003eI got the answer by \u003cem\u003emultiplying\u003c/em\u003e 32 and 2 wich equals 64, and\u0026nbsp;then \u003cem\u003emultiplying\u003c/em\u003e 4 and 4 which equaled 16, and then \u003cem\u003eadding \u003c/em\u003e64 and 16 wich then equaled 80 feet.\u003c/span\u003e\u003c/p\u003e\r\n\r\n\u003cp\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e\u003cspan style=\"font-family: comic sans ms, cursive\"\u003e\u003cspan style=\"color: #0000ff\"\u003eCheck For Answer\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u0026nbsp;32*2=64\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp; 4*4=16\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp; 64+16=80\u0026nbsp; \u0026nbsp;80-16=64\u003c/span\u003e\u003c/p\u003e\r\n\r\n\u003cp\u003e\u003cbr /\u003e\r\n\u003cspan style=\"font-family: comic sans ms, cursive\"\u003e\u0026nbsp;I think that this problem was a little hard to find the answer to because it took a lot of number guessing, and a lot of multiplying,adding,and\u0026nbsp;dividing.\u003cbr /\u003e\r\nIf someone needed a hint\u0026nbsp;on this problem i would tell them to draw a picture out for it.\u003c/span\u003e\u003c/p\u003e\r\n\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: comic sans ms, cursive\"\u003e# of pigeons\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: comic sans ms, cursive\"\u003e# of dogs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: comic sans ms, cursive\"\u003e# of pigeion legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: comic sans ms, cursive\"\u003e# of dog legs \u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: comic sans ms, cursive\"\u003etotal\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e25\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e11\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e50\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e44\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e94\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e26\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e10\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e52\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e40\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e92\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e12\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e96\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e28\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e8\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e56\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e88\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e\u003cspan style=\"color: #0000cd\"\u003e32\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e\u003cspan style=\"color: #0000cd\"\u003e4\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e\u003cspan style=\"color: #0000cd\"\u003e64\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e\u003cspan style=\"color: #0000cd\"\u003e16\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family: georgia, serif\"\u003e\u003cspan style=\"color: #0000cd\"\u003e80\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 804729,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "I came up with 64 dogs and pigeions all together. There are 32 pigeions and 4 dogs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691190,
      "currentSubmissionId": 804729
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f430"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-20T19:32:36.631Z"
    },
    "creator": {
      "creatorId": 237855,
      "username": "dGates13",
      "safeName": "Dylan G."
    },
    "longAnswer": "\u003cfont color=\"#f0fff0\"\u003e\u0026nbsp; \u0026nbsp;\u003c/font\u003e\u003cspan style=\"color:#000000;\"\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp;\u003c/span\u003e\u003cspan style=\"color:#FFD700;\"\u003e \u0026nbsp;\u003c/span\u003e\u003cspan style=\"color:#DAA520;\"\u003e I got the answer\u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e \u003c/span\u003e\u003cspan style=\"color:#008000;\"\u003e32 pigeons\u003c/span\u003e\u003cspan style=\"color:#DAA520;\"\u003e and\u003c/span\u003e\u003cspan style=\"color:#008000;\"\u003e 4 dogs\u003c/span\u003e\u003cspan style=\"color:#DAA520;\"\u003e by using the guess and check method and I first started \u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e18 dogs\u003c/span\u003e\u003cspan style=\"color:#DAA520;\"\u003e and \u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e18 pigeons \u003c/span\u003e\u003cspan style=\"color:#DAA520;\"\u003efor my first answer but I realized that it didn\u0026#39;t match the legs and after a long series of guesing and checking I got my answer.\u003c/span\u003e\u003cspan style=\"color:#000000;\"\u003e \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u003c/span\u003e\u003cspan style=\"color:#008000;\"\u003eI notice that there is 36 heads and 80 legs \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003eI notice that Xiao is a Chinese name \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u003c/span\u003e\u003cspan style=\"color:#800080;\"\u003eI wonder if there is less dogs than pigeons. \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u003c/span\u003e\u003cspan style=\"color:#B22222;\"\u003e\u0026nbsp;Check: 18 dogs+18 pigeons= 36=98 legs\u003c/span\u003e \u0026nbsp;\u003cspan style=\"color:#006400;\"\u003eCheck:32 pigeons+ 4 dogs= 36 heads 80 legs\u0026nbsp;\u003c/span\u003e\u0026nbsp; I got the answer from the text feathers and Fur \u0026nbsp; \u0026nbsp;\u003cspan style=\"color:#800080;\"\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u0026nbsp;\u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e\u0026nbsp;\u003c/span\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805290,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "I got the answer 32 pigeons and 4 dogs. By checking with the other answer 18 dogs and 18 pigeons but it didn't match the legs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691195,
      "currentSubmissionId": 805294
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f431"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-20T18:18:20.459Z"
    },
    "creator": {
      "creatorId": 238028,
      "username": "jMurphy13",
      "safeName": "Joey M."
    },
    "longAnswer": "\u0026nbsp;after 36 heads and 80 feet right from the start to use product then sum. because of that first guess i needed more birds then dogs.\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 583px; height: 522px\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\r\n\u0009\u0009\u0009\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px\"\u003e\r\n\u0009\u0009\u0009\u0009\u003ctbody\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003ehow many birds\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003ehow many dogs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003ebirds legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003edogs legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003etotal legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e22\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e14\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e44\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e56\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e90\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e4\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e64\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e80\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u0009\u0009\u003c/tbody\u003e\r\n\u0009\u0009\u0009\u003c/table\u003e\r\n\u0009\u0009\u0009\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805217,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "I came to realise something was up and i came up the answer for 32 pigeons and 4 dogs i use radom numbers their was more birds than dogs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689560,
      "currentSubmissionId": 805217
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f432"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-20T18:14:13.818Z"
    },
    "creator": {
      "creatorId": 238028,
      "username": "jMurphy13",
      "safeName": "Joey M."
    },
    "longAnswer": "\u0026nbsp;\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 583px; height: 522px\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\r\n\u0009\u0009\u0009\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px\"\u003e\r\n\u0009\u0009\u0009\u0009\u003ctbody\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003ehow many birds\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003ehow many dogs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003ebirds legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003edogs legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003etotal legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e22\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e14\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e44\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e56\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e90\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e4\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e64\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e80\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u0009\u0009\u003c/tbody\u003e\r\n\u0009\u0009\u0009\u003c/table\u003e\r\n\u0009\u0009\u0009\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805213,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "I came to realise something was up and i came up the answer for 32 pigeons and 4 dogs i use radom numbers their was more birds than dogs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689560,
      "currentSubmissionId": 805217
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f433"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-20T17:15:21.460Z"
    },
    "creator": {
      "creatorId": 238074,
      "username": "jWhite13",
      "safeName": "Juslene W."
    },
    "longAnswer": "\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ccaption\u003eFeathers And Fur\u003c/caption\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ethe # number of pigeons\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DAA520;\"\u003e25\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DAA520;\"\u003e26\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DAA520;\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DAA520;\"\u003e44\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DAA520;\"\u003e94\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ethe # of dogs\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#ADD8E6;\"\u003e11\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#ADD8E6;\"\u003e10\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#ADD8E6;\"\u003e12\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#ADD8E6;\"\u003e40\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#ADD8E6;\"\u003e92\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ethe # of pigeon legs\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#008080;\"\u003e50\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#008080;\"\u003e52\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#008080;\"\u003e54\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#008080;\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#008080;\"\u003e96\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ethe # of dog legs\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DDA0DD;\"\u003e44\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DDA0DD;\"\u003e40\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DDA0DD;\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DDA0DD;\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DDA0DD;\"\u003e88\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003etotal of legs\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e92\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e96\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n\r\n\u003cdiv\u003e\u003cfont face=\"lucida sans unicode, lucida grande, sans-serif\"\u003ethere are more pigeons than dogs. \u0026nbsp;\u003cbr /\u003e\r\n1. I noticed that there are 36 heads and 80 feet.\u003cbr /\u003e\r\n2. I noticed she is a lover of eye-seeing dogs and homing pigeons\u0026nbsp;\u003c/font\u003e\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u0026nbsp;\u003c/div\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805169,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "the answer i got was 32 pigeons and 4 dogs. I did the table and that helped me out allot because i did the math and sorted it out and i decided to take it on the bottom and i figured it out.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691100,
      "currentSubmissionId": 805784
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f434"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-20T19:42:33.452Z"
    },
    "creator": {
      "creatorId": 237862,
      "username": "cNicholson13",
      "safeName": "Cole N."
    },
    "longAnswer": "\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e# of pigeons\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e#of pigeon legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e# of dogs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e# of dogs legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003eAll together\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e30\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e60\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e6\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e84\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e31\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e62\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e5\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e20\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e82\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e64\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e4\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e80\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"5\"\u003eI Got my awnser by timesing and dividing the heads and legs to get my awnser. I Thought trying a table would be an easyer way the other ways. The problem was a kinda hard but yet no really.\u003cbr /\u003e\r\n\u0009\u0009\u0009\u003cbr /\u003e\r\n\u0009\u0009\u0009I thought it was easy using adding and subtracting legs.\u003cbr /\u003e\r\n\u0009\u0009\u0009I thought it was better to use division in my awnser finding as well.\u003cbr /\u003e\r\n\u0009\u0009\u0009I think it was better when i got the number of animals right.\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805298,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Theres 32 pigeons and 4 dogs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691198,
      "currentSubmissionId": 805315
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f435"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-20T19:34:02.740Z"
    },
    "creator": {
      "creatorId": 237856,
      "username": "eGordon13",
      "safeName": "Erica G."
    },
    "longAnswer": "\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e\u003cem\u003e\u003cspan style=\"color:#FFA500;\"\u003ePidgins \u0026nbsp; \u003c/span\u003e\u0026nbsp; \u003cspan style=\"color:#8B4513;\"\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp;Dogs \u0026nbsp; \u003c/span\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u003cspan style=\"color:#FFA500;\"\u003ePidgin legs\u003c/span\u003e \u0026nbsp; \u003cspan style=\"color:#8B4513;\"\u003e\u0026nbsp; \u0026nbsp;Dog Legs\u003c/span\u003e \u0026nbsp; \u0026nbsp; \u003cspan style=\"color:#2F4F4F;\"\u003eTotal of legs\u003c/span\u003e\u003c/em\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e46\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e16\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e92\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e64\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e736\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e52\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e5\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e104\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e20\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e260\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e31\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e4\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e62\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e16\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e72\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#00FF00;\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#00FF00;\"\u003e4\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#00FF00;\"\u003e64\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#00FF00;\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#00FF00;\"\u003e80\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n32/4=80 64+16=80\u003cbr /\u003e\r\nI used guess \u0026amp; cheek for this problem of\u003cspan style=\"color:#FF8C00;\"\u003e feathers\u003c/span\u003e and \u003cspan style=\"color:#8B4513;\"\u003efur\u003c/span\u003e and this is what i came up with.\u003cbr /\u003e\r\n\u003cbr /\u003e\r\nI notice There should be Less Dogs Than Pidgins.\u003cbr /\u003e\r\nI notice There Are More Pidgins than dogs .\u003cbr /\u003e\r\nI wounder If \u0026nbsp;Xiao was Hosting Humans as well Because there are more animals Than one person \u0026gt;\u0026gt; Xiao.",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805289,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "The answer of this problem of Feathers and Fur is , 32 Pidgins and 4 Dogs  .",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691184,
      "currentSubmissionId": 805302
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f436"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-20T19:53:55.209Z"
    },
    "creator": {
      "creatorId": 237857,
      "username": "tKorst13",
      "safeName": "Tyler K."
    },
    "longAnswer": "My answer that i got is\u003cspan style=\"color: #ffd700\"\u003e \u003c/span\u003e\u003cspan style=\"color: #a52a2a\"\u003e32\u003c/span\u003e\u003cspan style=\"color: #ffd700\"\u003e \u003c/span\u003epigions and\u003cspan style=\"color: #ff0000\"\u003e 4\u003c/span\u003e dogs. That would get \u003cspan style=\"color: #008000\"\u003e16\u003c/span\u003e legs for dogs and 64 pigion legs. How i got 80 feet was 64+16 which = 80 feet. My answer is\u003cspan style=\"color: #ff0000\"\u003e 32 \u003c/span\u003epigions and\u003cspan style=\"color: #a52a2a\"\u003e 4\u003c/span\u003e dogs.\u003cspan style=\"color: #ff0000\"\u003e I kinda thought the answer was hard until we talked over it with are partners. The part i got stuck on the problem to add up to get 80 feet. I\u0026nbsp; was Looking at my answer it seems reasonable because we kept on trying to add up to 80 feet. \u003c/span\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805293,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "My answer is 32 pigions and 4 dogs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691197,
      "currentSubmissionId": 805293
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f437"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-20T19:41:43.241Z"
    },
    "creator": {
      "creatorId": 238075,
      "username": "nWilson13",
      "safeName": "Nick W."
    },
    "longAnswer": "\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003edogs 4=4 legs\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e4*4=16\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ePigeons 32=2\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e32*2=64\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003eheads\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e32+4=36\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805291,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "There are 2 dogs and they both have four legs  and the i multiplied 4*4 and i got 16 and then i seen i had 32 pigeons  and i multiplied 2 and got i  64 and i add 16+64=80 and that's how i got 80 how i got 36 i add 32 +4 and i got 36.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691204,
      "currentSubmissionId": 805314
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f438"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-20T19:46:43.914Z"
    },
    "creator": {
      "creatorId": 237853,
      "username": "nClark13",
      "safeName": "Nathan C."
    },
    "longAnswer": "\u003cstrong\u003e\u003cspan style=\"color: rgb(0, 0, 255);\"\u003eI notice that they are asking me to find the amount of animals their are for pigeons and dogs.\u0026nbsp;\u003c/span\u003e\u003c/strong\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003elooking at my\u0026nbsp;\u003c/span\u003e\u003c/strong\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003eanswer it\u0026nbsp;\u003c/span\u003e\u003c/strong\u003e\u003cstrong\u003e\u003cspan style=\"color:#FF0000;\"\u003eseems reasonable because it works out with\u0026nbsp;the asked problem.\u003c/span\u003e\u003cspan style=\"color:#0000FF;\"\u003e i thought the problem was hard until i tried different numbers until i got the answer.\u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e In the problem i got stuck when the problem asked how many there are for dogs and pigeons. \u0026nbsp;\u003c/span\u003e\u003c/strong\u003e\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000ff;\"\u003e# of pigeons\u0026nbsp;\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e# of dogs\u003c/span\u003e\u0026nbsp;\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e#of pigeons legs\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e#of dog legs\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003etotal\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e24\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e12\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e48\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e24\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e72\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e30\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e6\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e60\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e12\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e72\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e35\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e1\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e70\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#ff0066;\"\u003e74\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e32\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e4\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e64\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e16\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cstrong\u003e\u003cspan style=\"color:#0000FF;\"\u003e80\u003c/span\u003e\u003c/strong\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\ncheck: \u0026nbsp;32 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; 64\u003cbr /\u003e\r\n\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;+4 \u0026nbsp; \u0026nbsp; \u0026nbsp; +16\u003cbr /\u003e\r\n\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; 36 \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;80",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805306,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "i think the right answer is 32 and 4 for heads",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691192,
      "currentSubmissionId": 805306
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f439"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-21T18:43:22.737Z"
    },
    "creator": {
      "creatorId": 237852,
      "username": "jThomas13",
      "safeName": "Jewell T."
    },
    "longAnswer": "\u003cspan style=\"color:#000000;\"\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003ei notice that she is currently hosting 36 heads.\u003c/span\u003e\u003cbr /\u003e\r\n\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003ei notice that she is currently hosting 80 feet.\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u0026nbsp;\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u003cspan style=\"color:#FF0000;\"\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003eif you do 4*4=16 mean theirs goes 16 of feet. what + 16 will = 80 witch 80 is the total number of feet. \u0026nbsp;so 64+16=80. so there for 64 of the feet are the pigeons and 16 of them are dog. well pigeons have 2 feet each so 64/2=32. so theirs 32 pigeons and 4*4=16. again \u0026nbsp;\u003c/span\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e16+64=80..80 is the total is the total number of feet.\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u003cspan style=\"color:#000000;\"\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e32*2=64 \u0026nbsp;....32 pigeons *2 =64 witch is 64 feet\u003c/span\u003e\u003cbr /\u003e\r\n\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e64+16=80\u0026nbsp;theirs in all\u0026nbsp;\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u0026nbsp;",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805218,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "i got 16 feet for the 4  dogs . i got 64 feet for the pigeons. so their 4 dogs 32 pigeons.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689566,
      "currentSubmissionId": 805218
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f43a"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-20T19:53:37.309Z"
    },
    "creator": {
      "creatorId": 237864,
      "username": "oThornberry13",
      "safeName": "Orion T."
    },
    "longAnswer": "I got the answer by taking\u0026nbsp;",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805301,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Xaio has 32 pigeons 4 dogs= 80 legs 32 heads",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691707,
      "currentSubmissionId": 805301
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f43b"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-20T19:54:10.703Z"
    },
    "creator": {
      "creatorId": 237865,
      "username": "dWilson13",
      "safeName": "Dallas W."
    },
    "longAnswer": "\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; I got 4 puppies and 32 pigeons and 80 legs\u0026nbsp;I Multiped my two answers and i got 80 legs . 32 pigeons and 4 puppies . I used guess and check . I thought this was a easy problem.",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805296,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "i came up by times there's answers 32 x 2 =64 ,4 x 4 = 16 , 64 x 16 = 80 .",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689624,
      "currentSubmissionId": 805811
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f43c"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-20T19:47:28.777Z"
    },
    "creator": {
      "creatorId": 237856,
      "username": "eGordon13",
      "safeName": "Erica G."
    },
    "longAnswer": "\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e\u003cem\u003e\u003cspan style=\"color:#FFA500;\"\u003ePidgins \u0026nbsp; \u003c/span\u003e\u0026nbsp; \u003cspan style=\"color:#8B4513;\"\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp;Dogs \u0026nbsp; \u003c/span\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u003cspan style=\"color:#FFA500;\"\u003ePidgin legs\u003c/span\u003e \u0026nbsp; \u003cspan style=\"color:#8B4513;\"\u003e\u0026nbsp; \u0026nbsp;Dog Legs\u003c/span\u003e \u0026nbsp; \u0026nbsp; \u003cspan style=\"color:#2F4F4F;\"\u003eTotal of legs\u003c/span\u003e\u003c/em\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e46\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e92\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e64\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e736\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e52\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e5\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e104\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e20\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e260\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e31\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e4\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e62\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e72\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#00FF00;\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#00FF00;\"\u003e4\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#00FF00;\"\u003e64\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#00FF00;\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#00FF00;\"\u003e80\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n32*4=64 64*16=80\u003cbr /\u003e\r\nI used guess \u0026amp; cheek for this problem of\u003cspan style=\"color:#FF8C00;\"\u003e feathers\u003c/span\u003e and \u003cspan style=\"color:#8B4513;\"\u003efur\u003c/span\u003e and this is what i came up with.\r\n\r\n\u003cdiv style=\"text-align: center;\"\u003e\u003cem\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003eI notice There should be Less Dogs Than Pidgins.\u003c/span\u003e\u003c/em\u003e\u003c/div\u003e\r\n\r\n\u003cdiv style=\"text-align: center;\"\u003e\u003cem\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003eI notice There Are More Pidgins than dogs .\u003c/span\u003e\u003c/em\u003e\u003c/div\u003e\r\n\r\n\u003cdiv style=\"text-align: center;\"\u003e\u003cem\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003eI wounder If \u0026nbsp;Xiao was Hosting Humans as well Because there are more animals Than one person \u0026gt;\u0026gt; Xiao.\u003c/span\u003e\u003c/em\u003e\u003c/div\u003e\r\n\r\n\u003cdiv style=\"text-align: center;\"\u003e\u003cem\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003eIf someone was having a issue with this problem of Feathers \u0026amp; Fur , I would tell them to draw or do a bar graph. It seems it always had help me .\u003c/span\u003e\u003c/em\u003e\u003c/div\u003e\r\n\r\n\u003cdiv style=\"text-align: center;\"\u003e\u003cem\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003eIn this problem of Feathers and Fur I had a issue with the adding up the problems , sometimes writing it out.\u003c/span\u003e\u003c/em\u003e\u003c/div\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805302,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "The answer of this problem of Feathers and Fur is , 32 Pidgins and 4 Dogs  .",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691184,
      "currentSubmissionId": 805302
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f43d"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-21T18:25:52.599Z"
    },
    "creator": {
      "creatorId": 238031,
      "username": "eRodriguez13",
      "safeName": "Erika R."
    },
    "longAnswer": "\u003cspan style=\"font-size:16px;\"\u003e\u003cspan style=\"color:#ff3399;\"\u003eI am Supposed to figure out how many dogs and how many pigeons there are, with the information \u0026quot;36 heads 80 feet\u0026quot;\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#FF0000;\"\u003e1-\u003c/span\u003e\u003cspan style=\"color:#00FF00;\"\u003e I notice\u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e that there would be more pigeons than dogs.\u003c/span\u003e\u003cspan style=\"color:#00ff99;\"\u003e\u0026nbsp;\u003c/span\u003e\u003cbr /\u003e\r\n\u003cspan style=\"color:#FF0000;\"\u003e2- \u003c/span\u003e\u003cspan style=\"color:#00FF00;\"\u003eI notice\u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e there\u0026#39;s two kind of animals.\u003c/span\u003e\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u003cspan style=\"color:#EE82EE;\"\u003eThis problem was:\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u003cspan style=\"color:#ff3366;\"\u003e-a little hard before I did the table.\u003cbr /\u003e\r\n- confusing before I figured out that there were more pigeons than dogs.\u003cbr /\u003e\r\n- Fun to do because I multiplied a lot, and multiplication to me is fun.\u003c/span\u003e\u003cbr /\u003e\r\n\u0026nbsp;\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e# of pigeons\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e# of dogs\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e# of pigeon feet\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e# of dog feet\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003eTotal feet\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000CD;\"\u003e25\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000CD;\"\u003e11\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000CD;\"\u003e50\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000CD;\"\u003e44\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e94\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e26\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e10\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e52\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e40\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e92\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e12\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e96\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e28\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e8\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e56\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#0000FF;\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e88\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e38\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e4\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e64\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e16\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FF00;\"\u003e80\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n\u003cspan style=\"color:#3399ff;\"\u003eCheck: 32 x 2= 64 --\u0026gt; 4 x 4= 16 --\u0026gt; 64 + 16= 80\u003c/span\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805778,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "I did all the work in my guess and check table and got the answer. There are 32 pigeons and 4 dogs, which is 36 heads and 80 feet.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689551,
      "currentSubmissionId": 805778
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f43e"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-20T19:50:26.168Z"
    },
    "creator": {
      "creatorId": 238075,
      "username": "nWilson13",
      "safeName": "Nick W."
    },
    "longAnswer": "There are 4 dogs and they both have four legs \u0026nbsp;and then \u0026nbsp;i multiplied 4*4 and i got 16 and then i seen i had 32 pigeons left \u0026nbsp; and i know that pigeons have 2 legs so then i multiplied \u0026nbsp;32*2 and got i \u0026nbsp;64 and i add 16+64=80 and that\u0026#39;s how i got 80 how i got 36 i add 32 +4 and i got 36.\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003edogs 4=4 legs\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e4*4=16\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ePigeons 32=2\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e32*2=64\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003eheads\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e32+4=36\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805314,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Xiao has 4dogs  and 32 pigeons equal's  the 36 heads",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691204,
      "currentSubmissionId": 805314
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f43f"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-20T19:46:20.590Z"
    },
    "creator": {
      "creatorId": 237855,
      "username": "dGates13",
      "safeName": "Dylan G."
    },
    "longAnswer": "\u003cfont color=\"#f0fff0\"\u003e\u0026nbsp; \u0026nbsp;\u003c/font\u003e\u003cspan style=\"color:#000000;\"\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp;\u003c/span\u003e\u003cspan style=\"color:#FFD700;\"\u003e \u0026nbsp;\u003c/span\u003e\u003cspan style=\"color:#DAA520;\"\u003e I got the answer\u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e \u003c/span\u003e\u003cspan style=\"color:#008000;\"\u003e32 pigeons\u003c/span\u003e\u003cspan style=\"color:#DAA520;\"\u003e and\u003c/span\u003e\u003cspan style=\"color:#008000;\"\u003e 4 dogs\u003c/span\u003e\u003cspan style=\"color:#DAA520;\"\u003e by using the guess and check method and I first started \u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e18 dogs\u003c/span\u003e\u003cspan style=\"color:#DAA520;\"\u003e and \u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003e18 pigeons \u003c/span\u003e\u003cspan style=\"color:#DAA520;\"\u003efor my first answer but I realized that it didn\u0026#39;t match the legs and after a long series of guesing and checking I got my answer.\u003c/span\u003e\u003cspan style=\"color:#000000;\"\u003e \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u003c/span\u003e\u003cspan style=\"color:#008000;\"\u003eI notice that there is 36 heads and 80 legs \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u003c/span\u003e\u003cspan style=\"color:#FF0000;\"\u003eI notice that Xiao is a Chinese name \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u003c/span\u003e\u003cspan style=\"color:#800080;\"\u003eI wonder if there is less dogs than pigeons. \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u003c/span\u003e\u003cspan style=\"color:#B22222;\"\u003e\u0026nbsp;Check: 18 dogs+18 pigeons= 36=98 legs\u003c/span\u003e \u0026nbsp;\u003cspan style=\"color:#006400;\"\u003eCheck:32 pigeons+ 4 dogs= 36 heads 80 legs\u0026nbsp;\u003c/span\u003e\u0026nbsp; I got the answer from the text feathers and Fur \u0026nbsp; \u0026nbsp;\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u003cspan style=\"color:#FF0000;\"\u003eREFLECTION 1: I think that I did good by showing my answer and how I got to it\u003c/span\u003e \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u003cspan style=\"color:#008000;\"\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;REFLECTION 2: I also think that I got stuck at least four times but I got to it when I finally knew what I was doing with my work.\u003c/span\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;REFLECTION\u003cspan style=\"color:#0000CD;\"\u003e\u0026nbsp;3: I thought it was very easy at first then it got harder and harder and even more hard until Mrs. Wren told me what I was doing wrong.\u003c/span\u003e\u003cbr /\u003e\r\n\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u003cspan style=\"color:#FFFFFF;\"\u003easshole\u003c/span\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805294,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "I got the answer 32 pigeons and 4 dogs. By checking with the other answer 18 dogs and 18 pigeons but it didn't match the legs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691195,
      "currentSubmissionId": 805294
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f440"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-20T19:47:37.609Z"
    },
    "creator": {
      "creatorId": 239081,
      "username": "jSutherland13",
      "safeName": "John S."
    },
    "longAnswer": "there was 32 pigeons and 4 dogs in all which make 64 legs and 16 dogs legs.\u003cbr /\u003e\r\ni noticed that there was 4 dogs\u003cbr /\u003e\r\ni noticed there was 32 pigeons\u0026nbsp;\u003cbr /\u003e\r\ni noticed that there was 80 legs\u003cbr /\u003e\r\n\u003cbr /\u003e\r\ni wonder if there was just one set of animals like 36 dogs if that would work.\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003edogs\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003epigeons\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003edog legs\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003epigeons legs\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003elegs total\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e4\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e32\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e16\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e64\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e80\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e36\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e0\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e246\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e0\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e246\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805304,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "there was 32 pigeons and 4 dogs..",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691708,
      "currentSubmissionId": 805316
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f441"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-20T19:44:36.624Z"
    },
    "creator": {
      "creatorId": 237862,
      "username": "cNicholson13",
      "safeName": "Cole N."
    },
    "longAnswer": "\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e# of pigeons\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e#of pigeon legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e# of dogs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003e# of dogs legs\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ff00\"\u003eAll together\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e30\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e60\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e6\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e84\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e31\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e62\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e5\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e20\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e82\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e64\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e4\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #0000ff\"\u003e80\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"5\"\u003eI Got my awnser by timesing and dividing the heads and legs to get my awnser. I Thought trying a table would be an easyer way the other ways. The problem was a kinda hard but yet no really.\u003cbr /\u003e\r\n\u0009\u0009\u0009\u003cbr /\u003e\r\n\u0009\u0009\u0009I thought it was easy using adding and subtracting legs.\u003cbr /\u003e\r\n\u0009\u0009\u0009I thought it was better to use division in my awnser finding as well.\u003cbr /\u003e\r\n\u0009\u0009\u0009I think it was better when i got the number of animals right.\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805315,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Theres 32 pigeons and 4 dogs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691198,
      "currentSubmissionId": 805315
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f442"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-12-14T17:00:06.496Z"
    },
    "creator": {
      "creatorId": 238079,
      "username": "kLeavens",
      "safeName": "Kassie L."
    },
    "longAnswer": "\u003cspan style=\"color:#000000;\"\u003eThe problem \u0026quot;Feathers and Fur\u0026quot; was a bit confusing, and still is but i\u0026#39;m going to try my best to solve the problem.. So Xiao has 36 heads and 80 feet, all together she has 36 dogs and pigeons.\u003c/span\u003e Dogs have 4 legs, pigeons have 2, at first i tried to solve the problem but i forgot about the pigeons, that they only have 2 legs, so that very important to remember. I\u0026#39;m going to try examples...\u003cbr /\u003e\r\n2 * 32 = 64 Pigeons \u0026nbsp; \u0026nbsp;4 * 4 = 16 Dogs. \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; 64 + 16 = 80 Feet. I guest the number 32, at first i tried 32 dogs but it was not the right number, then i added 4 because we needed to get to 36, then i multiplied pigeon feet by 32 and multiplied dog feet by 4 and got 64 and 16 then i added them and got 80.",
    "pdSet": "Feather and Fur - Mary",
    "powId": 813107,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "The problem \"Feathers and Fur\" was a little tricky at first, but i am almost positive i have the answer...32 pigeons and 4 dogs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691205,
      "currentSubmissionId": 813107
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f443"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-21T18:43:16.320Z"
    },
    "creator": {
      "creatorId": 238074,
      "username": "jWhite13",
      "safeName": "Juslene W."
    },
    "longAnswer": "\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ccaption\u003eFeathers And Fur\u003c/caption\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ethe # number of pigeons\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DAA520;\"\u003e25\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DAA520;\"\u003e26\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DAA520;\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DAA520;\"\u003e44\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DAA520;\"\u003e94\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ethe # of dogs\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#ADD8E6;\"\u003e11\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#ADD8E6;\"\u003e10\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#ADD8E6;\"\u003e12\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#ADD8E6;\"\u003e40\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#ADD8E6;\"\u003e92\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ethe # of pigeon legs\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#008080;\"\u003e50\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#008080;\"\u003e52\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#008080;\"\u003e54\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#008080;\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#008080;\"\u003e96\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ethe # of dog legs\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DDA0DD;\"\u003e44\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DDA0DD;\"\u003e40\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DDA0DD;\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DDA0DD;\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DDA0DD;\"\u003e88\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003etotal of legs\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e92\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e96\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n\r\n\u003cdiv\u003e\u003cfont face=\"lucida sans unicode, lucida grande, sans-serif\"\u003ethere are more pigeons than dogs. \u0026nbsp;\u003cbr /\u003e\r\n1. I noticed that there are 36 heads and 80 feet.\u003cbr /\u003e\r\n2. I noticed she is a lover of eye-seeing dogs and homing pigeons\u0026nbsp;\u003c/font\u003e\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u0026nbsp;\u003c/div\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805779,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "the answer i got was 32 pigeons and 4 dogs. I did the table and that helped me out allot because i did the math and sorted it out and i decided to take it on the bottom and i figured it out.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691100,
      "currentSubmissionId": 805784
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f444"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-25T17:07:28.875Z"
    },
    "creator": {
      "creatorId": 238074,
      "username": "jWhite13",
      "safeName": "Juslene W."
    },
    "longAnswer": "\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ccaption\u003eFeathers And Fur\u003c/caption\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ethe # number of pigeons\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DAA520;\"\u003e25\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DAA520;\"\u003e26\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DAA520;\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DAA520;\"\u003e44\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DAA520;\"\u003e94\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ethe # of dogs\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#ADD8E6;\"\u003e11\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#ADD8E6;\"\u003e10\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#ADD8E6;\"\u003e12\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#ADD8E6;\"\u003e40\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#ADD8E6;\"\u003e92\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ethe # of pigeon legs\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#008080;\"\u003e50\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#008080;\"\u003e52\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#008080;\"\u003e54\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#008080;\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#008080;\"\u003e96\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003ethe # of dog legs\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DDA0DD;\"\u003e44\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DDA0DD;\"\u003e40\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DDA0DD;\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DDA0DD;\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#DDA0DD;\"\u003e88\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003etotal of legs\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e92\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e96\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#FF0000;\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n\r\n\u003cdiv\u003e\u003cfont face=\"lucida sans unicode, lucida grande, sans-serif\"\u003ethere are more pigeons than dogs. \u0026nbsp;\u003cbr /\u003e\r\n1. I noticed that there are 36 heads and 80 feet.\u003cbr /\u003e\r\n2. I noticed she is a lover of eye-seeing dogs and homing pigeons\u0026nbsp;\u003c/font\u003e\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u0026nbsp;\u003c/div\u003e",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805784,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "the answer i got was 32 pigeons and 4 dogs. I did the table and that helped me out allot because i did the math and sorted it out and i decided to take it on the bottom and i figured it out.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691100,
      "currentSubmissionId": 805784
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f445"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-20T19:51:39.445Z"
    },
    "creator": {
      "creatorId": 237859,
      "username": "cLuchsinger13",
      "safeName": "Carty L."
    },
    "longAnswer": "\u003cspan style=\"color:#A52A2A;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003e\u003cstrong\u003eIn the problem \u0026quot;Feathers and fur\u0026quot; Xiao said that she counted\u003cbr /\u003e\r\nthe heads and the legs, 36 heads and 80 legs and so in made a chart and went down the chart trying to solve the problem of how many dog and pigeons there \u0026#8203;are. So\u0026nbsp;finally i took 32 Pigeons and 4 dogs and then got 64 and then got 16 and then got the 80 legs.\u003c/strong\u003e\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u0026nbsp;\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ccaption\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003eF\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan style=\"color:#00FFFF;\"\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003eeathers \u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003ea\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan style=\"color:#00FFFF;\"\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003end\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003e\u0026nbsp;F\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003cspan style=\"color:#00FFFF;\"\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003eur\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/caption\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FFFF;\"\u003e:)\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003e\u003cspan style=\"font-size:24px;\"\u003e:)\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd rowspan=\"2\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#00FFFF;\"\u003e:)\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd rowspan=\"2\"\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003e\u003cspan style=\"font-size:24px;\"\u003e:)\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"2\" rowspan=\"2\"\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003eP\u003c/span\u003e\u003c/span\u003e\u003cspan style=\"color:#00FFFF;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003eigeons\u003c/span\u003e\u003c/span\u003e \u0026nbsp; \u0026nbsp;\u003c/span\u003e \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u003cspan style=\"color:#696969;\"\u003e\u0026nbsp;\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e 19\u0026nbsp;\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e18\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e32\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"2\"\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003eD\u003c/span\u003e\u003c/span\u003e\u003cspan style=\"color:#00FFFF;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003eogs \u0026nbsp; \u0026nbsp; \u003c/span\u003e\u003c/span\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp;\u003c/span\u003e \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e \u0026nbsp;17\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e18\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e4\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"2\"\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003e\u003cspan style=\"color:#696969;\"\u003eP\u003c/span\u003e\u003cspan style=\"color:#00FFFF;\"\u003eigeons\u003c/span\u003e\u003cspan style=\"color:#696969;\"\u003e\u0026nbsp;L\u003c/span\u003e\u003cspan style=\"color:#00FFFF;\"\u003eegs \u0026nbsp;\u003c/span\u003e\u003c/span\u003e \u003c/span\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e 38\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e\u003cspan style=\"color:#696969;\"\u003e36\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e64\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"2\"\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003eD\u003c/span\u003e\u003c/span\u003e\u003cspan style=\"color:#00FFFF;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003eogs \u003c/span\u003e\u003c/span\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003eL\u003c/span\u003e\u003c/span\u003e\u003cspan style=\"color:#00FFFF;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003eegs \u0026nbsp; \u0026nbsp; \u003c/span\u003e\u003c/span\u003e\u0026nbsp; \u003c/span\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e 68\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e72\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e16\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd colspan=\"2\"\u003e\u003cspan style=\"font-size:24px;\"\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003eA\u003c/span\u003e\u003c/span\u003e\u003cspan style=\"color:#00FFFF;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003ell \u003c/span\u003e\u003c/span\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003eL\u003c/span\u003e\u003c/span\u003e\u003cspan style=\"color:#00FFFF;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003eegs \u0026nbsp; \u0026nbsp;\u003c/span\u003e\u003c/span\u003e \u0026nbsp;\u003c/span\u003e \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e\u003cspan style=\"color:#696969;\"\u003e106\u0026nbsp;\u003c/span\u003e\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e108 \u0026nbsp; \u003c/span\u003e\u003c/span\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color:#696969;\"\u003e\u003cspan style=\"font-family:comic sans ms,cursive;\"\u003e80 \u0026nbsp; \u003c/span\u003e\u003c/span\u003e\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp;\u0026nbsp;\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n\u003cbr /\u003e\r\n\u003cspan style=\"color:#A52A2A;\"\u003e\u003cspan style=\"font-family:georgia,serif;\"\u003e\u003cstrong\u003eMy refletion is that when i started i wanted to give up so much that i was just playing around with number that i got 32 and 4 and then i said how about 32 pigeons and 4 dogs and then i started to mulitpy and then i did this.... 32*2=64 and 4*4=16 and 64+16=80 so i got my 80 legs and my heads by 32+4=36 so i got my 36 heads and my 80 legs.\u003cbr /\u003e\r\n\u0026nbsp;\u003cbr /\u003e\r\nMy reflection is that i would alway ask how do you get 80 legs out of 36 head and now that i solved it now i know that you can get 80 legs out of 36 heads.\u003cbr /\u003e\r\n\u003cbr /\u003e\r\nMy relfection\u0026#39;s is that when i got so close it seemed that i got farther away from the answer and now i don\u0026#39;t have that problem because i solved the problem\u0026nbsp;\u003cbr /\u003e\r\n\u0026nbsp;\u003c/strong\u003e\u003c/span\u003e\u003c/span\u003e\u003cbr /\u003e\r\n\u003cbr /\u003e\r\n\u0026nbsp;",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805303,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "Xiao has 32 Pigeons and 4 dogs.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691188,
      "currentSubmissionId": 805303
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f446"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-20T19:51:52.253Z"
    },
    "creator": {
      "creatorId": 239081,
      "username": "jSutherland13",
      "safeName": "John S."
    },
    "longAnswer": "*there was 32 pigeons and 4 dogs in all which make 64 legs and 16 dogs legs.\u003cbr /\u003e\r\ni noticed that there was 4 dogs\u003cbr /\u003e\r\ni noticed there was 32 pigeons\u0026nbsp;\u003cbr /\u003e\r\ni noticed that there was 80 leg\u003cbr /\u003e\r\n\u003cbr /\u003e\r\ni wonder if there was just one set of animals like 36 dogs if that would work.\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px;\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003edogs\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003epigeons\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003edog legs\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003epigeons legs\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003elegs total\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e4\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e32\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e16\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e64\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e80\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e36\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e0\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e246\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e0\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e246\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n\u0026nbsp;\u003cbr /\u003e\r\nif i were to hint my friend i would say \u0026quot;",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805316,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "there was 32 pigeons and 4 dogs..",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 691708,
      "currentSubmissionId": 805316
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f447"
    },
    "clazz": {
      "clazzId": 103670,
      "name": "Period 4 Math Literacy"
    },
    "createDate": {
      "$date": "2013-11-21T18:29:03.070Z"
    },
    "creator": {
      "creatorId": 238072,
      "username": "hZamboroski13",
      "safeName": "Hannah Z."
    },
    "longAnswer": "\u0026nbsp;\r\n\u003cdiv\u003e\u0026nbsp;\u003cspan style=\"color: #4b0082\"\u003e# of pigeons\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u003c/span\u003e\u003cspan style=\"color: #800080\"\u003e\u0026nbsp;# of dogs\u0026nbsp;\u003c/span\u003e\u003cspan style=\"color: #4b0082\"\u003e\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp;# of legs\u003c/span\u003e\u003cspan style=\"color: #0000ff\"\u003e\u0026nbsp;\u003c/span\u003e\u003cspan style=\"color: #4b0082\"\u003e\u0026nbsp;\u0026nbsp;\u003c/span\u003e\u003cspan style=\"color: #40e0d0\"\u003e # of feet\u0026nbsp;\u003c/span\u003e\u003cspan style=\"color: #4b0082\"\u003e\u0026nbsp;\u0026nbsp;\u0026nbsp;\u0026nbsp; \u003c/span\u003e\u003cspan style=\"color: #00ff00\"\u003eTotal\u003c/span\u003e\u003c/div\u003e\r\n\u0026nbsp;\r\n\r\n\u003ctable border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"width: 500px\"\u003e\r\n\u0009\u003ctbody\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e25\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e11\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e50\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e44\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e94\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e26\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e10\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e52\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e42\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e92\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e24\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e12\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e48\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e96\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e28\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e8\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e56\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #ff0000\"\u003e88\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u0009\u003ctr\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ffff\"\u003e32\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ffff\"\u003e4\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ffff\"\u003e64\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ffff\"\u003e16\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u0009\u003ctd\u003e\u003cspan style=\"color: #00ffff\"\u003e80\u003c/span\u003e\u003c/td\u003e\r\n\u0009\u0009\u003c/tr\u003e\r\n\u0009\u003c/tbody\u003e\r\n\u003c/table\u003e\r\n\u0026nbsp;Answer is in the color tourqoise. The wrong answer is in the color red.\u003cbr /\u003e\r\n\u003cbr /\u003e\r\nI found out that this problem was hard to solve because I had to find out how many pigoens legs and how many feet there are of dogs.",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805776,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "I figured out that there are 32 pigeons and 4 dogs which is 36 heads and 80 feet.",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689564,
      "currentSubmissionId": 805776
    }
  }, {
    "_id": {
      "$oid": "53daf47d729e9ef59ba7f448"
    },
    "clazz": {
      "clazzId": 103671,
      "name": "Period 5 Basic Math"
    },
    "createDate": {
      "$date": "2013-11-21T20:07:49.210Z"
    },
    "creator": {
      "creatorId": 237865,
      "username": "dWilson13",
      "safeName": "Dallas W."
    },
    "longAnswer": "\u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; \u0026nbsp; I got 4 puppies and 32 pigeons and 80 legs\u0026nbsp;I times my two answers and i got 80 legs . 32 pigeons and 4 puppies . I used guess and check . I thought this was a easy problem because i did great on \u0026nbsp;this amazing problem. I redid my work for the real answer and not goodbye answer and i got the right answer. In this problem , I got stuck when i was solving this \u0026nbsp;problem .\u0026nbsp;",
    "pdSet": "Feather and Fur - Mary",
    "powId": 805811,
    "publication": {
      "publicationId": 4308,
      "puzzle": {
        "puzzleId": 421,
        "title": "Feathers and Fur"
      }
    },
    "shortAnswer": "i came up by times there's answers 32 x 2 =64 ,4 x 4 = 16 , 64 x 16 = 80 .",
    "status": "SUBMITTED",
    "teacher": {},
    "thread": {
      "threadId": 689624,
      "currentSubmissionId": 805811
    }
  }
];

var PdsubmissionsSeeder = Seeder.extend({
  shouldRun: function () {
    return Pdsubmission.count().exec().then(count => count === 0);
  },
  run: function () {
    return Pdsubmission.create(data);
  }
});

module.exports = PdsubmissionsSeeder;
