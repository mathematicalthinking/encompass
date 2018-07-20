var Seeder = require('mongoose-data-seed').Seeder;
var Pdsubmission = require('../server/datasource/schemas').Submission;

var data = [
   {
    _id: "53daf47d729e9ef59ba7f403",
    clazz:  {
      clazzId: 103673,
      name: "Period 7 Algebra Prep"
    },
    createDate: "2013-05-23T15:02:36.453Z",
    creator:  {
      creatorId: 216977,
      safeName: "Neo M.",
      username: "neoM11"
    },
    longAnswer: "%5B%3B.%5D",
    pdSet: "Feather and Fur - Mary",
    powId: 765330,
    publication:  {
      publicationId: 198,
    },
    shortAnswer: "%3Bp%5B%5B",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 765334,
      threadId: 655449
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f404",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-15T18:39:13.771Z",
    creator:  {
      creatorId: 238031,
      safeName: "Erika R.",
      username: "eRodriguez13"
    },
    longAnswer: "%3Cspan%20style%3D%22font-size%3A16px%3B%22%3E%3Cspan%20style%3D%22color%3A%23ff3399%3B%22%3EI%20am%20Supposed%20to%20figure%20out%20how%20many%20dogs%20and%20how%20many%20pigeons%20there%20are%2C%20with%20the%20information%20%26quot%3B36%20heads%2080%20feet%26quot%3B%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E1-%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%20I%20notice%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%20that%20there%20would%20be%20more%20pigeons%20than%20dogs.%3C/span%3E%3Cspan%20style%3D%22color%3A%2300ff99%3B%22%3E%26nbsp%3B%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E2-%20%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3EI%20notice%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%20there%26%2339%3Bs%20two%20kind%20of%20animals.%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22color%3A%23EE82EE%3B%22%3EThis%20problem%20was%3A%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22color%3A%23ff3366%3B%22%3E-a%20little%20hard%20before%20I%20did%20the%20table.%3Cbr%20/%3E%0D%0A-%20confusing%20before%20I%20figured%20out%20that%20there%20were%20more%20pigeons%20than%20dogs.%3Cbr%20/%3E%0D%0A-%20Fun%20to%20do%20because%20I%20multiplied%20a%20lot%2C%20and%20multiplication%20to%20me%20is%20fun.%3C/span%3E%3Cbr%20/%3E%0D%0A%26nbsp%3B%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%23%20of%20pigeons%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%23%20of%20dogs%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%23%20of%20pigeon%20feet%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%23%20of%20dog%20feet%3C/td%3E%0D%0A%09%09%09%3Ctd%3ETotal%20feet%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000CD%3B%22%3E25%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000CD%3B%22%3E11%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000CD%3B%22%3E50%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000CD%3B%22%3E44%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E94%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E26%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E10%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E52%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E40%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E92%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E12%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E96%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E28%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E8%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E56%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E88%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E38%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E4%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E64%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E16%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E80%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 802836,
    publication:  {
      publicationId: 4308,

    },
    shortAnswer: "I%20did%20all%20the%20work%20in%20my%20guess%20and%20check%20table%20and%20got%20the%20answer.%20There%20are%2032%20pigeons%20and%204%20dogs%2C%20which%20is%2036%20heads%20and%2080%20feet.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805778,
      threadId: 689551
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f405",
    clazz:  {
      clazzId: 103673,
      name: "Period 7 Algebra Prep"
    },
    createDate: "2013-05-23T15:17:57.634Z",
    creator:  {
      creatorId: 216977,
      safeName: "Neo M.",
      username: "neoM11"
    },
    longAnswer: "It%20took%20me%20quite%20a%20while%20but%20i%20got%20the%20answer%3A%2032%20pigeons%20and%204%20dogs%2C%20but%20that%20was%20like%20my%20200th%20answer.%20at%20first%20i%20put%208%20dogs%20and%2017%20pigeons%20as%20a%20guess%20and%20i%20got%20168%20feet.%20then%20i%20guessed%20a%20little%20lower%2010%20piegons%20and%202%20dogs%20and%20got%2088%20feet.%20then%20i%20put%20in%2012%20dogs%20and%209%20pigeons%20and%20got%20114%20feet.%20after%20a%20lot%20more%20guesses%20i%20got%2032%20pigeons%20and%204%20dogs%20then%20i%20did%20%26nbsp%3Bthe%20answer%20check%20to%20see%20if%20i%20was%20right%20and%20it%20was.",
    pdSet: "Feather and Fur - Mary",
    powId: 765334,
    publication:  {
      publicationId: 198,
    },
    shortAnswer: "the%20problem%20%22feathers%20and%20fur%22%20from%20the%20%22Math%20forum%22%20asks%20you%20how%20many%20pigeons%20and%20dogs%20xiao%20has%20but%20you%20have%20to%20figure%20out%20how%20many%20heads%20and%20feet%20there%20are.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 765334,
      threadId: 655449
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f406",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-15T18:38:31.704Z",
    creator:  {
      creatorId: 237851,
      safeName: "Michael I.",
      username: "mIverson13"
    },
    longAnswer: "%3Cdiv%20style%3D%22margin-left%3A%2040px%3B%22%3E%3Cspan%20style%3D%22font-size%3A16px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FFFF%3B%22%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3Ei%20got%20my%20answer%20by%20going%209%20dogs+27%20pigons%20%3D36%20and%20then%2027*2%3D40%20pigion%20heads%20and%20then%209*4%3D40%20dog%20heads%20%26nbsp%3B%26nbsp%3B%3C/span%3E%3C/span%3E%3C/span%3E%3Cspan%20style%3D%22font-family%3A%20%27comic%20sans%20ms%27%2C%20cursive%3B%20color%3A%20rgb%280%2C%20255%2C%20255%29%3B%20line-height%3A%201.6em%3B%22%3E40+40%3D80%20that%20mean%2040%20heads%20and%2040%20heads.%26nbsp%3Bi%20find%20that%20the%20math%20forum%20problem%20is%20was%20%3C/span%3E%3Cspan%20style%3D%22font-family%3A%20%27comic%20sans%20ms%27%2C%20cursive%3B%20color%3A%20rgb%280%2C%20255%2C%20255%29%3B%20line-height%3A%201.6em%3B%22%3Edifficalte%3C/span%3E%3Cspan%20style%3D%22font-family%3A%20%27comic%20sans%20ms%27%2C%20cursive%3B%20color%3A%20rgb%280%2C%20255%2C%20255%29%3B%20line-height%3A%201.6em%3B%22%3E%26nbsp%3Bat%20times%20and%20had%20to%20do%20because%20you%20had%20to%20take%20a%20bunch%20of%20numbers%20and%20try%20to%20get%2036%20and%20make%2080%20heads%20it%20was%20complecated%20i%20hade%20to%20take%20alot%20of%20time%20to%20get%20this%20proplem.%26nbsp%3B%3C/span%3E%3C/div%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 802844,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "the%20answer%20is%209%20dogs%20and%2027%20pigeons",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 804643,
      threadId: 689559
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f407",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-15T18:30:14.007Z",
    creator:  {
      creatorId: 238028,
      safeName: "Joey M.",
      username: "jMurphy13"
    },
    longAnswer: "%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3Ei%20notice%20two%20things%26nbsp%3B1.%2080%20feet%20and%26nbsp%3B2.%2036%20heads%20so%20i%20use%20product%20and%20sum%20to%20get%20the%20answer%20but%20i%20came%20close%20enough%20to%20get%2036%20heads%20but%20i%20got%2080%20feet%20down%20i%20will%20never%20get%2036%20heads%3C/span%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 802845,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "16x2%3D16%20than%204x16%3D64+16%3D80%20feet%20and%2016+16%3D32%20heads.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805217,
      threadId: 689560
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f408",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-15T18:31:46.274Z",
    creator:  {
      creatorId: 237848,
      safeName: "Mysten P.",
      username: "mPrice13"
    },
    longAnswer: "%3Cp%3E%26nbsp%3BYou%20know%20that%20Xiao%20has%2036%20heads%2C%20and%2080%20feet.%20so%20a%20dog%20has%204%20paws%2C%20and%20pigeons%20have%20two%20feet.%20so%20what%20i%20did%20was%20guessed%20a%20random%26nbsp%3Bnumber.%3Cbr%20/%3E%0D%0Ahonestly%20i%20guessed%20the%20wright%20one%20the%20first%20time.%20i%20thought%20that%20is%20birds%20have%202%26nbsp%3Blegs%20and%202%20multiplied%20by%2010%20is%2020.%20that%20i%20noticed%20that%20dogs%20have%204%20legs%2C%20and%20four%20times%2015%20is%2060.%20Than%20i%20added%20sixty%20and%20twenty%20together%20and%20got%2080.%3Cbr%20/%3E%0D%0ASo%20you%20take%2060%20and%20divide%20it%20by%20four.%20you%20divide%20it%20by%20four%20because%20each%20dog%20has%204%20legs%2C%20and%20when%20you%20divide%20thst%20by%20four%20you%20get%20how%20many%20dogs%20there%26nbsp%3Bare.%20So%20do%20the%20same%20thing%20for%20birds%2C%20you%20take%2020%20and%20divide%20it%20by%20two.%2020%20divided%20by%20two%20is%20ten.%20So%20thats%20how%20i%20got%20the%20ancer.%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%26nbsp%3B%3C/p%3E%0D%0A%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%26nbsp%3B",
    pdSet: "Feather and Fur - Mary",
    powId: 802847,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "Xiao%20has%20fifteen%20dogs%2C%20and%20ten%20pigeons.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 804632,
      threadId: 689562
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f409",
    clazz:  {
      clazzId: 103673,
      name: "Period 7 Algebra Prep"
    },
    createDate: "2013-11-15T18:35:15.195Z",
    creator:  {
      creatorId: 238030,
      safeName: "Micah N.",
      username: "mNishoff13"
    },
    longAnswer: "1.%20I%20noticed%20there%20are%2036%20heads%20meaning%20there%20are%2036%20animals%20in%20all.%3Cbr%20/%3E%0D%0A2.%20I%20noticed%20there%20are%2080%20feet%20total.%3Cbr%20/%3E%0D%0A3.%20%26nbsp%3BPigeons%20all%20have%202%20legs%20so%20every%20number%20I%20guess%20has%20to%20be%20multiplied%20by%202%3Cbr%20/%3E%0D%0A4.%20Dogs%20have%204%20legs%2C%20so%20I%20have%20to%20multiply%20all%20the%20guessing%20numbers%20I%20get%20by%204%3Cbr%20/%3E%0D%0A5.%20If%20I%20were%20to%20guess%208%20dogs%2C%20the%20pigeons%20have%20to%20add%20up%20to%20equal%2036%20so%20what%20I%20do%20is%20%26quot%3BReverse%26quot%3B%20by%20doing%2036%20-%208%20%3D%2028%20So%20there%20will%20have%20to%20be%2028%20pigeons%20to%20add%20up%20to%2036.%3Cbr%20/%3E%0D%0A%26nbsp%3B%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3EDogs%3C/td%3E%0D%0A%09%09%09%3Ctd%3ETimes%3C/td%3E%0D%0A%09%09%09%3Ctd%3EGuess%20wand%20check%20the%20answer%3C/td%3E%0D%0A%09%09%09%3Ctd%3EPigeons%3C/td%3E%0D%0A%09%09%09%3Ctd%3ETimes%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E8%3C/td%3E%0D%0A%09%09%09%3Ctd%3Ex%204%3C/td%3E%0D%0A%09%09%09%3Ctd%3E32%20+%2056%20%3D%2088%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Wrong%29%3C/td%3E%0D%0A%09%09%09%3Ctd%3E28%3C/td%3E%0D%0A%09%09%09%3Ctd%3Ex%202%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E7%3C/td%3E%0D%0A%09%09%09%3Ctd%3Ex%204%3C/td%3E%0D%0A%09%09%09%3Ctd%3E28%20+%2058%20%3D%2086%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Wrong%29%3C/td%3E%0D%0A%09%09%09%3Ctd%3E29%3C/td%3E%0D%0A%09%09%09%3Ctd%3Ex%202%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E6%3C/td%3E%0D%0A%09%09%09%3Ctd%3Ex%204%3C/td%3E%0D%0A%09%09%09%3Ctd%3E24%20+%2060%20%3D%2084%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Wrong%29%3C/td%3E%0D%0A%09%09%09%3Ctd%3E30%3C/td%3E%0D%0A%09%09%09%3Ctd%3Ex%202%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E5%3C/td%3E%0D%0A%09%09%09%3Ctd%3Ex%204%3C/td%3E%0D%0A%09%09%09%3Ctd%3E20%20+%2062%20%3D%2082%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Wrong%29%3C/td%3E%0D%0A%09%09%09%3Ctd%3E31%3C/td%3E%0D%0A%09%09%09%3Ctd%3Ex%202%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E4%3C/td%3E%0D%0A%09%09%09%3Ctd%3Ex%204%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%0D%0A%09%09%09%3Cp%3E16%20+%2064%20%3D%2080%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Correct%29%3C/p%3E%0D%0A%09%09%09%3C/td%3E%0D%0A%09%09%09%3Ctd%3E32%3C/td%3E%0D%0A%09%09%09%3Ctd%3Ex%202%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0AAfter%20I%20did%20this%20table%20I%20got%20my%20answer.",
    pdSet: "Feather and Fur - Mary",
    powId: 802846,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "Xiao%20has%20a%20total%20of%204%20dogs%20and%2032%20pigeons.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805206,
      threadId: 689561
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f40a",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-15T18:35:59.350Z",
    creator:  {
      creatorId: 237929,
      safeName: "Crystal W.",
      username: "cWilliams13"
    },
    longAnswer: "%3Cb%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3EI%3C/span%3E%26nbsp%3B%3Cspan%20style%3D%22color%3A%230066cc%3B%22%3Etook%2080%20feet%20and%20added%2036%20heads%20and%20i%20got%20116%20heads%20and%20feet%20all%20together.%3C/span%3E%3C/b%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 802851,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "An%20elderly%20women%20likes%20to%20take%20care%20of%20homing%20pigeons%20and%20seeing-eye%20dogs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 804631,
      threadId: 689565
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f40b",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-19T18:39:07.367Z",
    creator:  {
      creatorId: 238072,
      safeName: "Hannah Z.",
      username: "hZamboroski13"
    },
    longAnswer: "%26nbsp%3B%0D%0A%3Cdiv%3E%26nbsp%3B%3Cspan%20style%3D%22color%3A%20%234b0082%22%3E%23%20of%20pigeons%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%20%23800080%22%3E%26nbsp%3B%23%20of%20dogs%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%20%234b0082%22%3E%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%23%20of%20legs%3C/span%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%20%234b0082%22%3E%26nbsp%3B%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%20%2340e0d0%22%3E%20%23%20of%20feet%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%20%234b0082%22%3E%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%20%3C/span%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3ETotal%3C/span%3E%3C/div%3E%0D%0A%26nbsp%3B%0D%0A%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23008080%22%3E25%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ffd700%22%3E11%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E50%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23afeeee%22%3E44%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ee82ee%22%3E94%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23006400%22%3E26%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E10%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23800080%22%3E52%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E42%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23008080%22%3E92%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ffd700%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff6699%22%3E12%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ffa07a%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%238b4513%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff8c00%22%3E96%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23dda0dd%22%3E28%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E8%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2340e0d0%22%3E56%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%232f4f4f%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ee82ee%22%3E88%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%234b0082%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ee82ee%22%3E4%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23008000%22%3E64%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23800080%22%3E80%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 802849,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "I%20figured%20out%20that%20there%20are%2032%20pigeons%20and%204%20dogs%20which%20is%2036%20heads%20and%2080%20feet.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805776,
      threadId: 689564
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f40c",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-15T18:40:42.905Z",
    creator:  {
      creatorId: 237851,
      safeName: "Michael I.",
      username: "mIverson13"
    },
    longAnswer: "%3Cdiv%20style%3D%22margin-left%3A%2040px%3B%22%3E%3Cspan%20style%3D%22font-size%3A16px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FFFF%3B%22%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3Ei%20got%20my%20answer%20by%20going%204%20dogs+%2032%26nbsp%3Bpigons%20%3D36%20and%20then%2032*2%3D68%20pigion%20heads%20and%20then%204*4%3D16%20dog%20heads%20%3C/span%3E%3C/span%3E%3C/span%3E%3Cspan%20style%3D%22font-family%3A%20%27comic%20sans%20ms%27%2C%20cursive%3B%20color%3A%20rgb%280%2C%20255%2C%20255%29%3B%20line-height%3A%201.6em%3B%22%3E40+40%3D80%20that%20mean%2040%20heads%20and%2040%20heads.%26nbsp%3Bi%20find%20that%20the%20math%20forum%20problem%20is%20was%20%3C/span%3E%3Cspan%20style%3D%22font-family%3A%20%27comic%20sans%20ms%27%2C%20cursive%3B%20color%3A%20rgb%280%2C%20255%2C%20255%29%3B%20line-height%3A%201.6em%3B%22%3Edifficalte%3C/span%3E%3Cspan%20style%3D%22font-family%3A%20%27comic%20sans%20ms%27%2C%20cursive%3B%20color%3A%20rgb%280%2C%20255%2C%20255%29%3B%20line-height%3A%201.6em%3B%22%3E%26nbsp%3Bat%20times%20and%20had%20to%20do%20because%20you%20had%20to%20take%20a%20bunch%20of%20numbers%20and%20try%20to%20get%2036%20and%20make%2080%20heads%20it%20was%20complecated%20i%20hade%20to%20take%20alot%20of%20time%20to%20get%20this%20proplem.%26nbsp%3B%3C/span%3E%3C/div%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 802880,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "the%20answer%20is%204%20dogs%20and%2032%20pigeons",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 804643,
      threadId: 689559
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f40d",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-19T17:39:37.584Z",
    creator:  {
      creatorId: 238074,
      safeName: "Juslene W.",
      username: "jWhite13"
    },
    longAnswer: "%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E4+4%3D8%3C/td%3E%0D%0A%09%09%09%3Ctd%3E16+16%3D%2032%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B4+4%3D8%3C/td%3E%0D%0A%09%09%09%3Ctd%3E16+16%3D32%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E4+4%3D8%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B8%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E4+4%3D8%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%2072%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E4+4%3D8%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804564,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "the%20answer%20i%20got%20was%20%20%20%20%20%20%20%20%20%20%20%20and%20%20%20%20%20%20%20%20%20%20%20because%20i%20took%20%20%20%20and",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805784,
      threadId: 691100
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f40e",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-19T18:38:59.868Z",
    creator:  {
      creatorId: 237852,
      safeName: "Jewell T.",
      username: "jThomas13"
    },
    longAnswer: "i%20notice%20that%20she%20is%20currently%20hosting%2036%20heads.%3Cbr%20/%3E%0D%0Ai%20notice%20that%20she%20is%20currently%20hosting%2080%20feet.%3Cbr%20/%3E%0D%0A%26nbsp%3B%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0Aif%20you%20do%204*4%3D16%20mean%20theirs%2016%20feet.%3Cbr%20/%3E%0D%0A32*2%3D64%20%26nbsp%3B....32%20pigeons%20*2%20%3D64%20witch%20is%2064%20feet%3Cbr%20/%3E%0D%0A64+16%3D80%3Cbr%20/%3E%0D%0Atheirs%20in%20all%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%26nbsp%3B",
    pdSet: "Feather and Fur - Mary",
    powId: 802852,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "i%20got%2016%20feet%20for%20the%204%20%20dogs%20.%20i%20got%2064%20feet%20for%20the%20pigeons.%20so%20their%204%20dogs%2032%20pigeons.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805218,
      threadId: 689566
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f40f",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-19T20:09:17.378Z",
    creator:  {
      creatorId: 237865,
      safeName: "Dallas W.",
      username: "dWilson13"
    },
    longAnswer: "I%20came%20up%20by%20times%20there%26%2339%3Bs%20answers%2032%20x%202%20%3D64%20%2C%204%20x%204%20%3D%2016%20%2C%2064%20x%2016%20%3D%2080.%20i%20got%204%20puppies%20and%2032%20pigeons%20and%2080%20legs",
    pdSet: "Feather and Fur - Mary",
    powId: 802913,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "I%20Multiped%20my%20two%20answers%20and%20i%20got%2080%20legs%20.%2032%20pigeons%20and%204%20puppies%20.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805811,
      threadId: 689624
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f410",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-19T18:35:07.887Z",
    creator:  {
      creatorId: 237851,
      safeName: "Michael I.",
      username: "mIverson13"
    },
    longAnswer: "%26nbsp%3B%0D%0A%3Cdiv%20style%3D%22margin-left%3A%2040px%3B%22%3E%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3Enumbers%20of%20pigieons%26nbsp%3B%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3Enumbers%20of%20dogs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3Enumber%20of%20bird%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3Enumber%20of%20dog%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3Etottle%20%23%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E12%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E96%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E25%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E11%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E50%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E44%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E94%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E26%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E10%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E52%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E40%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E92%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E27%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E9%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E54%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E36%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E90%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E28%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E8%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E56%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E88%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E29%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E7%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E58%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E28%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E86%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E30%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E6%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E60%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E84%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E31%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E5%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E62%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E20%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E82%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E4%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E64%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E80%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A%3Cfont%20color%3D%22%2300ffff%22%20face%3D%22comic%20sans%20ms%2C%20cursive%22%3Ei%20got%20my%20anser%20by%20doing%20a%20gess%20and%20check%20table%20and%20just%20went%20from%2024%20bid%20and%2012%20dogs%20and%20all%20the%20way%20tell%2032%20birds%20and%204%20dogs%20and%20this%20math%20forum%20problem%20was%20hard%20to%20get%20but%20easy%20and%20it%20had%202%20patterns%20one%20when%20count%20down%20by%202%20and%20count%20down%20by%204%20so%20all%20together%20the%20anser%20is%2032%20bird%20and%204%20dogs.%3C/font%3E%3C/div%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804628,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "so%20Xaio%204%20dogs%20and%2032%20pigeons.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 804643,
      threadId: 689559
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f411",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-19T18:18:23.444Z",
    creator:  {
      creatorId: 238031,
      safeName: "Erika R.",
      username: "eRodriguez13"
    },
    longAnswer: "%3Cspan%20style%3D%22font-size%3A16px%3B%22%3E%3Cspan%20style%3D%22color%3A%23ff3399%3B%22%3EI%20am%20Supposed%20to%20figure%20out%20how%20many%20dogs%20and%20how%20many%20pigeons%20there%20are%2C%20with%20the%20information%20%26quot%3B36%20heads%2080%20feet%26quot%3B%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E1-%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%20I%20notice%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%20that%20there%20would%20be%20more%20pigeons%20than%20dogs.%3C/span%3E%3Cspan%20style%3D%22color%3A%2300ff99%3B%22%3E%26nbsp%3B%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E2-%20%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3EI%20notice%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%20there%26%2339%3Bs%20two%20kind%20of%20animals.%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22color%3A%23EE82EE%3B%22%3EThis%20problem%20was%3A%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22color%3A%23ff3366%3B%22%3E-a%20little%20hard%20before%20I%20did%20the%20table.%3Cbr%20/%3E%0D%0A-%20confusing%20before%20I%20figured%20out%20that%20there%20were%20more%20pigeons%20than%20dogs.%3Cbr%20/%3E%0D%0A-%20Fun%20to%20do%20because%20I%20multiplied%20a%20lot%2C%20and%20multiplication%20to%20me%20is%20fun.%3C/span%3E%3Cbr%20/%3E%0D%0A%26nbsp%3B%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%23%20of%20pigeons%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%23%20of%20dogs%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%23%20of%20pigeon%20feet%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%23%20of%20dog%20feet%3C/td%3E%0D%0A%09%09%09%3Ctd%3ETotal%20feet%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000CD%3B%22%3E25%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000CD%3B%22%3E11%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000CD%3B%22%3E50%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000CD%3B%22%3E44%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E94%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E26%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E10%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E52%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E40%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E92%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E12%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E96%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E28%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E8%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E56%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E88%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E38%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E4%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E64%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E16%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E80%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804630,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "I%20did%20all%20the%20work%20in%20my%20guess%20and%20check%20table%20and%20got%20the%20answer.%20There%20are%2032%20pigeons%20and%204%20dogs%2C%20which%20is%2036%20heads%20and%2080%20feet.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805778,
      threadId: 689551
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f412",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2014-02-03T21:45:33.731Z",
    creator:  {
      creatorId: 238017,
      safeName: "Patrick C.",
      username: "pChapman13"
    },
    longAnswer: "%26nbsp%3B%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23008000%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23008000%22%3E20%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23008000%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23008000%22%3E80%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23008000%22%3E112%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E22%3C/td%3E%0D%0A%09%09%09%3Ctd%3E14%3C/td%3E%0D%0A%09%09%09%3Ctd%3E44%3C/td%3E%0D%0A%09%09%09%3Ctd%3E56%3C/td%3E%0D%0A%09%09%09%3Ctd%3E100%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E5%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E21%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E20%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E42%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E64%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ffff%22%3E30%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ffff%22%3E6%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ffff%22%3E60%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ffff%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ffff%22%3E84%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E4%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E64%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E80%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A%26nbsp%3BI%20got%20the%20answer%2032%20pigeons%20and%204%20dogs.%20I%20notice%20that%20I%20got%20my%20answer%20on%20my%20fifth%20try.%20I%20highlighted%20my%20answer%20of%20the%20color%20dark%20blue.",
    pdSet: "Feather and Fur - Mary",
    powId: 804625,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "My%20answer%20is%2032%20pigeons%20and%204%20dogs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 804625,
      threadId: 691136
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f413",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-19T18:28:52.180Z",
    creator:  {
      creatorId: 238028,
      safeName: "Joey M.",
      username: "jMurphy13"
    },
    longAnswer: "%26nbsp%3B%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20583px%3B%20height%3A%20522px%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%0D%0A%09%09%09%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%22%3E%0D%0A%09%09%09%09%3Ctbody%3E%0D%0A%09%09%09%09%09%3Ctr%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Ehow%20many%20birds%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Ehow%20many%20dogs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Ebirds%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Edogs%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Etotal%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%3C/tr%3E%0D%0A%09%09%09%09%09%3Ctr%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E22%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E14%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E44%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E56%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E90%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%3C/tr%3E%0D%0A%09%09%09%09%09%3Ctr%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E4%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E64%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E80%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%3C/tr%3E%0D%0A%09%09%09%09%09%3Ctr%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%3C/tr%3E%0D%0A%09%09%09%09%09%3Ctr%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%3C/tr%3E%0D%0A%09%09%09%09%3C/tbody%3E%0D%0A%09%09%09%3C/table%3E%0D%0A%09%09%09%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804627,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "I%20came%20to%20realise%20something%20was%20up%20and%20i%20came%20up%20the%20answer%20for%2032%20pigeons%20and%204%20dogs%20i%20use%20radom%20numbers%20their%20was%20more%20birds%20than%20dogs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805217,
      threadId: 689560
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f414",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-19T18:41:57.292Z",
    creator:  {
      creatorId: 238074,
      safeName: "Juslene W.",
      username: "jWhite13"
    },
    longAnswer: "%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ccaption%3EFeathers%20And%20Fur%3C/caption%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Ethe%20%23%20number%20of%20pigeons%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E25%3C/td%3E%0D%0A%09%09%09%3Ctd%3E26%3C/td%3E%0D%0A%09%09%09%3Ctd%3E24%3C/td%3E%0D%0A%09%09%09%3Ctd%3E44%3C/td%3E%0D%0A%09%09%09%3Ctd%3E94%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Ethe%20%23%20of%20dogs%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E11%3C/td%3E%0D%0A%09%09%09%3Ctd%3E10%3C/td%3E%0D%0A%09%09%09%3Ctd%3E12%3C/td%3E%0D%0A%09%09%09%3Ctd%3E40%3C/td%3E%0D%0A%09%09%09%3Ctd%3E92%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Ethe%20%23%20of%20pigeon%20legs%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E50%3C/td%3E%0D%0A%09%09%09%3Ctd%3E52%3C/td%3E%0D%0A%09%09%09%3Ctd%3E54%3C/td%3E%0D%0A%09%09%09%3Ctd%3E48%3C/td%3E%0D%0A%09%09%09%3Ctd%3E96%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Ethe%20%23%20of%20dog%20legs%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E44%3C/td%3E%0D%0A%09%09%09%3Ctd%3E40%3C/td%3E%0D%0A%09%09%09%3Ctd%3E48%3C/td%3E%0D%0A%09%09%09%3Ctd%3E32%3C/td%3E%0D%0A%09%09%09%3Ctd%3E88%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Etotal%20of%20legs%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E94%3C/td%3E%0D%0A%09%09%09%3Ctd%3E92%3C/td%3E%0D%0A%09%09%09%3Ctd%3E96%3C/td%3E%0D%0A%09%09%09%3Ctd%3E16%3C/td%3E%0D%0A%09%09%09%3Ctd%3E80%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A%0D%0A%3Cdiv%3E%3Cfont%20face%3D%22lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3Ethere%20are%20more%20pigeons%20than%20dogs.%26nbsp%3B%3C/font%3E%3C/div%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804629,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "the%20answer%20i%20got%20was%2032%20pigeons%20and%204%20dogs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805784,
      threadId: 691100
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f415",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-19T18:25:21.257Z",
    creator:  {
      creatorId: 237848,
      safeName: "Mysten P.",
      username: "mPrice13"
    },
    longAnswer: "%3Cp%3E%26nbsp%3BYou%20know%20that%20Xiao%20has%2036%20heads%2C%20and%2080%20feet.%20so%20a%20dog%20has%204%20paws%2C%20and%20pigeons%20have%20two%20feet.%20so%20what%20i%20did%20was%20guessed%20a%20random%26nbsp%3Bnumber.%3Cbr%20/%3E%0D%0Ahonestly%20i%20guessed%20the%20wright%20one%20the%20first%20time.%20i%20thought%20that%20is%20birds%20have%202%26nbsp%3Blegs%20and%202%20multiplied%20by%2010%20is%2020.%20that%20i%20noticed%20that%20dogs%20have%204%20legs%2C%20and%20four%20times%2015%20is%2060.%20Than%20i%20added%20sixty%20and%20twenty%20together%20and%20got%2080.%3Cbr%20/%3E%0D%0ASo%20you%20take%2060%20and%20divide%20it%20by%20four.%20you%20divide%20it%20by%20four%20because%20each%20dog%20has%204%20legs%2C%20and%20when%20you%20divide%20thst%20by%20four%20you%20get%20how%20many%20dogs%20there%26nbsp%3Bare.%20So%20do%20the%20same%20thing%20for%20birds%2C%20you%20take%2020%20and%20divide%20it%20by%20two.%2020%20divided%20by%20two%20is%20ten.%20So%20that%26%2339%3Bs%20how%20i%20got%20the%20answer.%3Cbr%20/%3E%0D%0AI%20just%20remembered%26nbsp%3Bthat%26nbsp%3Bt%20there%20are%2036%20heads%2C%20and%20if%20i%20have%2015%20added%20by%2010%20id%20only%2035.%20i%26nbsp%3Bneeded%2036.%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%26nbsp%3B%3C/p%3E%0D%0A%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%26nbsp%3B",
    pdSet: "Feather and Fur - Mary",
    powId: 804632,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "Xiao%20has%20fifteen%20dogs%2C%20and%20ten%20pigeons.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 804632,
      threadId: 689562
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f416",
    clazz:  {
      clazzId: 103673,
      name: "Period 7 Algebra Prep"
    },
    createDate: "2013-11-19T18:27:05.507Z",
    creator:  {
      creatorId: 238030,
      safeName: "Micah N.",
      username: "mNishoff13"
    },
    longAnswer: "1.%20I%20noticed%20there%20are%2036%20heads%20meaning%20there%20are%2036%20animals%20in%20all.%3Cbr%20/%3E%0D%0A2.%20I%20noticed%20there%20are%2080%20feet%20total.%3Cbr%20/%3E%0D%0A3.%20Pigeons%20all%20have%202%20legs%20so%20every%20number%20I%20guess%20has%20to%20be%20multiplied%20by%202%3Cbr%20/%3E%0D%0A4.%20Dogs%20have%204%20legs%20so%20I%20have%20to%20multiply%20all%20the%20guessing%20numbers%20I%20get%20by%204%3Cbr%20/%3E%0D%0A5.%20If%20I%20were%20to%20guess%208%20dogs%2C%20the%20pigeons%20have%20to%20add%20up%20to%20equal%2036%20so%20what%20I%20do%20is%20%26quot%3BReverse%26quot%3B%20by%20doing%2036%20-%208%20%3D%2028%20So%20there%20will%20have%20to%20be%2028%20pigeons%20to%20add%20up%20to%2036.%3Cbr%20/%3E%0D%0A%26nbsp%3B%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%234B0082%3B%22%3EDogs%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%234B0082%3B%22%3ETimes%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%234B0082%3B%22%3E%26nbsp%3B%20%26nbsp%3BGuess%20wand%20check%20the%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20answer%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%234B0082%3B%22%3EPigeons%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%234B0082%3B%22%3ETimes%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%208%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%204%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B32%20+%2056%20%3D%2088%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Wrong%29%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%2028%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%202%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%207%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%204%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B28%20+%2058%20%3D%2086%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Wrong%29%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%2029%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%202%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%206%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%204%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B24%20+%2060%20%3D%2084%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Wrong%29%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%2030%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%202%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%205%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%204%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B20%20+%2062%20%3D%2082%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Wrong%29%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%2031%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%202%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%26nbsp%3B%20%26nbsp%3B%204%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%204%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%0D%0A%09%09%09%3Cp%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%26nbsp%3B16%20+%2064%20%3D%2080%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Correct%29%3C/span%3E%3C/strong%3E%3C/p%3E%0D%0A%09%09%09%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%26nbsp%3B%20%26nbsp%3B%2032%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%202%3C/span%3E%3C/strong%3E%3Cbr%20/%3E%0D%0A%09%09%09%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0AAfter%20I%20did%20this%20table%20I%20got%20my%20answer%20to%20the%20problem.",
    pdSet: "Feather and Fur - Mary",
    powId: 804633,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "Xiao%20has%20a%20total%20of%204%20dogs%20and%2032%20pigeons.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805206,
      threadId: 689561
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f417",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-19T18:38:45.126Z",
    creator:  {
      creatorId: 237929,
      safeName: "Crystal W.",
      username: "cWilliams13"
    },
    longAnswer: "%3Cspan%20style%3D%22color%3A%23EE82EE%3B%22%3EI%20took%20%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF8C00%3B%22%3E80%20heads%3C/span%3E%3Cspan%20style%3D%22color%3A%23EE82EE%3B%22%3E%20and%20%3C/span%3E%3Cspan%20style%3D%22color%3A%23FFA07A%3B%22%3E36%20feet%3C/span%3E%3Cspan%20style%3D%22color%3A%23EE82EE%3B%22%3E%20and%20i%20added%20them%20and%20got%20%3C/span%3E%3Cspan%20style%3D%22color%3A%23AFEEEE%3B%22%3E116%20heads%20and%20feet%20altogether.%26nbsp%3B%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3EI%20notice%20that%20she%20is%20currently%20feeding%2080%20heads.%26nbsp%3B%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22color%3A%2300FFFF%3B%22%3EI%20notice%20that%20she%20is%20currently%20hosting%2036%20feet.%3C/span%3E%3Cbr%20/%3E%0D%0A%26nbsp%3B",
    pdSet: "Feather and Fur - Mary",
    powId: 804631,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "An%20elderly%20women%20is%20currently%20hosting%20and%20feeding%20homing%20pigeons%20and%20seeing-eye%20dogs%20because%20she%20likes%20to%20take%20care%20of%20those%20kind%20of%20animals.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 804631,
      threadId: 689565
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f418",
    clazz:  {
      clazzId: 103673,
      name: "Period 7 Algebra Prep"
    },
    createDate: "2013-11-19T19:10:38.323Z",
    creator:  {
      creatorId: 238030,
      safeName: "Micah N.",
      username: "mNishoff13"
    },
    longAnswer: "1.%20I%20noticed%20there%20are%2036%20heads%20meaning%20there%20are%2036%20animals%20in%20all.%3Cbr%20/%3E%0D%0A2.%20I%20noticed%20there%20are%2080%20feet%20total.%3Cbr%20/%3E%0D%0A3.%20Pigeons%20all%20have%202%20legs%20so%20every%20number%20I%20guess%20has%20to%20be%20multiplied%20by%202%3Cbr%20/%3E%0D%0A4.%20Dogs%20have%204%20legs%20so%20I%20have%20to%20multiply%20all%20the%20guessing%20numbers%20I%20get%20by%204%3Cbr%20/%3E%0D%0A5.%20If%20I%20were%20to%20guess%208%20dogs%2C%20the%20pigeons%20have%20to%20add%20up%20to%20equal%2036%20so%20what%20I%20do%20is%20%26quot%3BReverse%26quot%3B%20by%20doing%2036%20-%208%20%3D%2028%20So%20there%20will%20have%20to%20be%2028%20pigeons%20to%20add%20up%20to%2036.%3Cbr%20/%3E%0D%0A%26nbsp%3B%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%234B0082%3B%22%3EDogs%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%234B0082%3B%22%3ETimes%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%234B0082%3B%22%3E%26nbsp%3B%20%26nbsp%3BGuess%20wand%20check%20the%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20answer%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%234B0082%3B%22%3EPigeons%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%234B0082%3B%22%3ETimes%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%208%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%204%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B32%20+%2056%20%3D%2088%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Wrong%29%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%2028%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%202%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%207%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%204%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B28%20+%2058%20%3D%2086%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Wrong%29%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%2029%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%202%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%206%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%204%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B24%20+%2060%20%3D%2084%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Wrong%29%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%2030%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%202%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%205%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%204%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B20%20+%2062%20%3D%2082%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Wrong%29%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%2031%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%202%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%26nbsp%3B%20%26nbsp%3B%204%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%204%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%0D%0A%09%09%09%3Cp%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%26nbsp%3B16%20+%2064%20%3D%2080%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Correct%29%3C/span%3E%3C/strong%3E%3C/p%3E%0D%0A%09%09%09%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%26nbsp%3B%20%26nbsp%3B%2032%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%202%3C/span%3E%3C/strong%3E%3Cbr%20/%3E%0D%0A%09%09%09%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0AAfter%20I%20did%20this%20table%20I%20got%20my%20answer%20to%20the%20problem.",
    pdSet: "Feather and Fur - Mary",
    powId: 804641,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "Xiao%20has%20a%20total%20of%204%20dogs%20and%2032%20pigeons.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805206,
      threadId: 689561
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f419",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-19T18:35:21.587Z",
    creator:  {
      creatorId: 237851,
      safeName: "Michael I.",
      username: "mIverson13"
    },
    longAnswer: "%26nbsp%3B%0D%0A%3Cdiv%20style%3D%22margin-left%3A%2040px%3B%22%3E%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3Enumbers%20of%20pigieons%26nbsp%3B%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3Enumbers%20of%20dogs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3Enumber%20of%20bird%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3Enumber%20of%20dog%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3Etottle%20%23%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E12%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E96%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E25%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E11%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E50%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E44%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E94%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E26%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E10%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E52%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E40%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E92%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E27%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E9%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E54%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E36%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E90%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E28%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E8%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E56%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E88%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E29%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E7%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E58%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E28%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E86%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E30%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E6%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E60%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E84%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E31%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E5%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E62%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E20%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E82%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E4%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E64%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E80%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A%3Cfont%20color%3D%22%2300ffff%22%20face%3D%22comic%20sans%20ms%2C%20cursive%22%3Ei%20got%20my%20anser%20by%20doing%20a%20gess%20and%20check%20table%20and%20just%20went%20from%2024%20bid%20and%2012%20dogs%20and%20all%20the%20way%20tell%2032%20birds%20and%204%20dogs%20and%20this%20math%20forum%20problem%20was%20hard%20to%20get%20but%20easy%20and%20it%20had%202%20patterns%20one%20when%20count%20down%20by%202%20and%20count%20down%20by%204%20so%20all%20together%20the%20anser%20is%2032%20bird%20and%204%20dogs.%3C/font%3E%3C/div%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804643,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "so%20Xaio%204%20dogs%20and%2032%20pigeons.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 804643,
      threadId: 689559
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f41a",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-21T18:41:56.002Z",
    creator:  {
      creatorId: 238019,
      safeName: "Raven D.",
      username: "rDunham13"
    },
    longAnswer: "I%20notisted%20it%20is%20ascking%20me%20how%20many%20animals%20thar%20are%20in%20all%20and%20I%20also%20notist%20thare%20are%20%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E36%20hade%3C/span%3E%20and%3Cspan%20style%3D%22color%3A%20%23ff0099%22%3E%2080%20feet%3Cfont%20color%3D%22%23333333%22%3E%26nbsp%3BI%20have%20found%20the%3C/font%3E%3C/span%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E%20%3C/span%3E%3Cspan%20style%3D%22color%3A%20%23cc33ff%22%3EIVF%3C/span%3E%20the%3Cspan%20style%3D%22color%3A%20%2340e0d0%22%3E%26nbsp%3B%3C/span%3EFeather%20and%20fer%26nbsp%3Bqeshtin%26nbsp%3Bis%20asking%20how%20many%20dogs%20and%20pigeons%20thar%20are.%26nbsp%3B%26nbsp%3B%20%3Cspan%20style%3D%22color%3A%20%234b0082%22%3E36-80%3D44%20%3C/span%3E%3Cspan%20style%3D%22color%3A%20%23ff33ff%22%3E36+44%3D80%26nbsp%3B%3C/span%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804638,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "first%20I%20subtracked36%20and%2080%20and%20I%20got%2044%20then%20I%20added%2036%20to%2044%20and%20I%20got%2080",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 804638,
      threadId: 691138
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f41b",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-19T18:20:05.221Z",
    creator:  {
      creatorId: 238031,
      safeName: "Erika R.",
      username: "eRodriguez13"
    },
    longAnswer: "%3Cspan%20style%3D%22font-size%3A16px%3B%22%3E%3Cspan%20style%3D%22color%3A%23ff3399%3B%22%3EI%20am%20Supposed%20to%20figure%20out%20how%20many%20dogs%20and%20how%20many%20pigeons%20there%20are%2C%20with%20the%20information%20%26quot%3B36%20heads%2080%20feet%26quot%3B%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E1-%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%20I%20notice%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%20that%20there%20would%20be%20more%20pigeons%20than%20dogs.%3C/span%3E%3Cspan%20style%3D%22color%3A%2300ff99%3B%22%3E%26nbsp%3B%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E2-%20%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3EI%20notice%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%20there%26%2339%3Bs%20two%20kind%20of%20animals.%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22color%3A%23EE82EE%3B%22%3EThis%20problem%20was%3A%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22color%3A%23ff3366%3B%22%3E-a%20little%20hard%20before%20I%20did%20the%20table.%3Cbr%20/%3E%0D%0A-%20confusing%20before%20I%20figured%20out%20that%20there%20were%20more%20pigeons%20than%20dogs.%3Cbr%20/%3E%0D%0A-%20Fun%20to%20do%20because%20I%20multiplied%20a%20lot%2C%20and%20multiplication%20to%20me%20is%20fun.%3C/span%3E%3Cbr%20/%3E%0D%0A%26nbsp%3B%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%23%20of%20pigeons%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%23%20of%20dogs%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%23%20of%20pigeon%20feet%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%23%20of%20dog%20feet%3C/td%3E%0D%0A%09%09%09%3Ctd%3ETotal%20feet%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000CD%3B%22%3E25%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000CD%3B%22%3E11%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000CD%3B%22%3E50%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000CD%3B%22%3E44%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E94%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E26%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E10%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E52%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E40%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E92%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E12%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E96%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E28%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E8%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E56%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E88%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E38%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E4%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E64%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E16%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E80%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804634,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "I%20did%20all%20the%20work%20in%20my%20guess%20and%20check%20table%20and%20got%20the%20answer.%20There%20are%2032%20pigeons%20and%204%20dogs%2C%20which%20is%2036%20heads%20and%2080%20feet.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805778,
      threadId: 689551
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f41c",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-19T19:49:25.231Z",
    creator:  {
      creatorId: 237859,
      safeName: "Carty L.",
      username: "cLuchsinger13"
    },
    longAnswer: "In%20the%20problem%20%26quot%3BFeathers%20and%20fur%26quot%3B%20Xiao%20said%20that%20she%20counted%20the%20heads%20and%20the%20legs%2C%2036%20heads%20and%2080%20legs%20and%20so%20in%20made%20a%20chart%20and%20went%20down%20the%20chart%20trying%20to%20solve%20the%20problem%20of%20how%20many%20dog%20and%20pigeons%20there%20are.So%26nbsp%3Bfinally%20i%20took%2032%20Pigeons%20and%204%20dogs%20and%20then%20got%2064%20and%20then%20got%2016%20and%20then%20got%20the%2080%20legs",
    pdSet: "Feather and Fur - Mary",
    powId: 804708,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "Xiao%20has%2032%20Pigeons%20and%204%20dogs.%20are.So",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805303,
      threadId: 691188
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f41d",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-19T19:54:12.180Z",
    creator:  {
      creatorId: 237854,
      safeName: "Dorothy D.",
      username: "dDedmon13"
    },
    longAnswer: "%3Cp%3EI%20got%20the%20answer%20by%20%3Cem%3Emultiplying%3C/em%3E%2032%20and%202%20wich%20equals%2064%2C%20and%26nbsp%3Bthen%20%3Cem%3Emultiplying%3C/em%3E%204%20and%204%20which%20equaled%2016%2C%20and%20then%20%3Cem%3Eadding%20%3C/em%3E64%20and%2016%20wich%20then%20equaled%2080.%3C/p%3E%0D%0A%0D%0A%3Cp%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3ECheck%20For%20Answer%3C/span%3E%3Cbr%20/%3E%0D%0A%26nbsp%3B32*2%3D64%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%204*4%3D16%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%2064+16%3D80%3C/p%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804710,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "xiao%20came%20up%20with%2080%20dogs%20and%20pigeons%20all%20together.%20To%20get%20the%20answer%20she%20did%20some%20addition%20and%20multiplication.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 804729,
      threadId: 691190
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f41e",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-19T20:02:12.923Z",
    creator:  {
      creatorId: 237860,
      safeName: "Richelle M.",
      username: "rMathis13"
    },
    longAnswer: "%3Cspan%20style%3D%22font-family%3A%20courier%20new%2C%20courier%2C%20monospace%22%3EThe%20problem%20is%20asking%20me%20how%20many%20pigeons%20and%20dogs%20are%20there.%20I%26nbsp%3Bnoitce%20that%26nbsp%3Btheres%2036%20heads%2C%20and%2080%20feet.%26nbsp%3BAlso%20pigeons%20have%202%20feet%20and%20dogs%20have%204%20feet.%3C/span%3E%26nbsp%3B%0D%0A%3Cdiv%20style%3D%22text-align%3A%20center%22%3E%3Cspan%20style%3D%22color%3A%20%23000080%22%3EFeather%20and%20Fur%21%3C/span%3E%26nbsp%3B%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23ff3333%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%22%3E%23%20of%20pigeons%3C/span%3E%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23ff3333%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%22%3E%23%20of%20pigeons%20legs%3C/span%3E%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23ff3333%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%22%3E%23%20of%20Dogs%3C/span%3E%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23ff3333%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%22%3E%23%20of%20Dog%20legs%3C/span%3E%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23ff3333%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%22%3ETOTAL%3C/span%3E%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E30%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E60%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E6%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E24%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E84%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E31%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E62%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E5%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E20%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E82%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E32%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E64%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E4%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E16%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E80%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A%0D%0A%3Cdiv%20style%3D%22text-align%3A%20left%22%3E%3Cspan%20style%3D%22color%3A%20%23663399%22%3E%3Cspan%20style%3D%22font-family%3A%20comic%20sans%20ms%2C%20cursive%22%3ECheck-%26nbsp%3B%20pigeons%2032%20x%202%3D64%2C%20Dogs%204%20x%204%3D16.%26nbsp%3BI%20added%2064%20and%2016.%20it%20equals%2080.%20Theres%2032%20Pigeons%20and%204%20Dogs.%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%26nbsp%3B%3C/div%3E%0D%0A%3C/div%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804707,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "Xiao%20has%2032%20Pigeons%20and%204%20Dogs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 804732,
      threadId: 691187
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f41f",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-20T19:53:30.500Z",
    creator:  {
      creatorId: 237863,
      safeName: "Dixie R.",
      username: "dRyan13"
    },
    longAnswer: "%3Cp%3E%3Cspan%20style%3D%22font-family%3A%20arial%2C%20helvetica%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3EIn%20feathers%20and%20fur%20they%20are%20aks%20how%20many%26nbsp%3Bdogs%20and%20pigeon%26nbsp%3Bare%20there.%26nbsp%3BFith%20you%20timeth%26nbsp%3B32%20and%202%20with%26nbsp%3Byou%20get%26nbsp%3B64%20than%20you%20timeth%204%20and%26nbsp%3B4%20with%20is%2016.%20than%26nbsp%3Byou%20add%2064%20and%2016%20with%20is%2080.%3C/span%3E%3C/span%3E%3C/p%3E%0D%0A%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%22%3E%0D%0A%09%3Ccaption%3E%0D%0A%09%3Cdiv%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Efeathers%20and%20fur%3C/span%3E%3C/div%3E%0D%0A%09%3C/caption%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Epigeoms%2032%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E32%20*%202%20%3D%3C/td%3E%0D%0A%09%09%09%3Ctd%3E64%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Edogs%26nbsp%3B%204%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E4*4%20%3D%3C/td%3E%0D%0A%09%09%09%3Ctd%3E16%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Epigeoms%20legs%202%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E64%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Edogs%20legs%204%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E16%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Elegs%20in%20all%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E80%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804709,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "Xiao%2C32%20pigeons%20and%204%20dogs",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 804709,
      threadId: 691189
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f420",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-19T20:01:50.261Z",
    creator:  {
      creatorId: 237857,
      safeName: "Tyler K.",
      username: "tKorst13"
    },
    longAnswer: "%3Cspan%20style%3D%22font-family%3A%20arial%2C%20helvetica%2C%20sans-serif%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%22%3EThere%20is%2036%20heads%20and%2080%20feet%20but%20i%20have%20finally%20got%20my%20answer.%20If%20you%20add%3Cbr%20/%3E%0D%0A64+16%20it%20%3D%2080%20feet.%20I%20also%20no%20that%20there%20are%2032%20pigions%20and%20only%204%20dogs%20so%3Cbr%20/%3E%0D%0Athat%20makes%2036%20heads%20and%2080%20feet.%20So%20my%20answer%20is%20%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E32%20pigions%3C/span%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E%20and%204%20dogs%20%3C/span%3E%3Cbr%20/%3E%0D%0Athat%20gives%2036%20heads%20and%2080%20feet.%20I%20aslo%20think%20that%20the%20answer%20was%20kind%20of%20hard%20becase%20it%20did%20not%20make%20sense%20at%20first.%20When%20it%20said%20there%20was%2036%20heads%20i%20didnt%20no%20it%20was%20talking%20about%2036%20animals.%20%3C/span%3E%3C/span%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804717,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "If%20you%20add%2064+16%3D80%20that%20is%20for%20feet%20and%20there%20is%2036%20%0D%0Aheads%20so%2036%20animals.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805293,
      threadId: 691197
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f421",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-19T20:09:13.100Z",
    creator:  {
      creatorId: 237856,
      safeName: "Erica G.",
      username: "eGordon13"
    },
    longAnswer: "%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E%3Cem%3E%3Cspan%20style%3D%22color%3A%23FFA500%3B%22%3EPidgins%20%26nbsp%3B%20%3C/span%3E%26nbsp%3B%20%3Cspan%20style%3D%22color%3A%238B4513%3B%22%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3BDogs%20%26nbsp%3B%20%3C/span%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%3Cspan%20style%3D%22color%3A%23FFA500%3B%22%3EPidgin%20legs%3C/span%3E%20%26nbsp%3B%20%3Cspan%20style%3D%22color%3A%238B4513%3B%22%3E%26nbsp%3B%20%26nbsp%3BDog%20Legs%3C/span%3E%20%26nbsp%3B%20%26nbsp%3B%20%3Cspan%20style%3D%22color%3A%232F4F4F%3B%22%3ETotal%20of%20legs%3C/span%3E%3C/em%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E46%3C/td%3E%0D%0A%09%09%09%3Ctd%3E16%3C/td%3E%0D%0A%09%09%09%3Ctd%3E92%3C/td%3E%0D%0A%09%09%09%3Ctd%3E64%3C/td%3E%0D%0A%09%09%09%3Ctd%3E736%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E52%3C/td%3E%0D%0A%09%09%09%3Ctd%3E5%3C/td%3E%0D%0A%09%09%09%3Ctd%3E104%3C/td%3E%0D%0A%09%09%09%3Ctd%3E20%3C/td%3E%0D%0A%09%09%09%3Ctd%3E260%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E31%3C/td%3E%0D%0A%09%09%09%3Ctd%3E4%3C/td%3E%0D%0A%09%09%09%3Ctd%3E62%3C/td%3E%0D%0A%09%09%09%3Ctd%3E16%3C/td%3E%0D%0A%09%09%09%3Ctd%3E72%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E4%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E64%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E80%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A32/4%3D80%2064+16%3D80%3Cbr%20/%3E%0D%0AFirst%20Of%20all%20Don%26%2339%3Bt%20know%20if%20i%20Added%20those%20up%20right%20I%20used%20the%20Guessing%20%26amp%3B%20cheek%20Method%20.%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0AI%20notice%20There%20should%20be%20Less%20Dogs%20Than%20Pidgins.%3Cbr%20/%3E%0D%0AI%20notice%20There%20Are%20More%20Pidgins%20than%20dogs%20.%3Cbr%20/%3E%0D%0AI%20wounder%20If%20%26nbsp%3BXiao%20was%20Hosting%20Humans%20as%20well%20Because%20there%20are%20more%20animals%20Than%20one%20person%20%26gt%3B%26gt%3B%20Xiao.",
    pdSet: "Feather and Fur - Mary",
    powId: 804704,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "The%20answer%20of%20this%20problem%20of%20Feathers%20and%20Fur%20is%20%2C%2032%20Pidgins%20and%204%20Dogs%20%20.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805302,
      threadId: 691184
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f422",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-19T20:00:25.417Z",
    creator:  {
      creatorId: 238075,
      safeName: "Nick W.",
      username: "nWilson13"
    },
    longAnswer: "dogs%3Cspan%20style%3D%22color%3A%23000080%3B%22%3E%3A4*4%3D16%3C/span%3E%0D%0A%3Chr%20/%3E%0D%0A%3Chr%20/%3E%3Cbr%20/%3E%0D%0APigeons%3A%2032*2%3D64%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0Aheads%3A%2064+16%3D80%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%26nbsp%3B",
    pdSet: "Feather and Fur - Mary",
    powId: 804724,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "i%20got%2080%20heads%20and%2036%20feet.%20There%20are%204%20legs%20for%20both%20dogs%20and%20i%20multiplied%204*4%3D16%20and%20the%20pigeons%20i%20multiplied%2032*%20%202%3D64%20and%20then%20i%20add%2016+64%3D80%20and%20that%27s%20my%20work",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805314,
      threadId: 691204
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f423",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-19T20:11:46.147Z",
    creator:  {
      creatorId: 237855,
      safeName: "Dylan G.",
      username: "dGates13"
    },
    longAnswer: "%3Cfont%20color%3D%22%23f0fff0%22%3E%26nbsp%3B%20%26nbsp%3B%3C/font%3E%3Cspan%20style%3D%22color%3A%23000000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%23FFD700%3B%22%3E%20%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E%20I%20got%20the%20answer%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%20%3C/span%3E%3Cspan%20style%3D%22color%3A%23008000%3B%22%3E32%20pigeons%3C/span%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E%20and%3C/span%3E%3Cspan%20style%3D%22color%3A%23008000%3B%22%3E%204%20dogs%3C/span%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E%20by%20using%20the%20guess%20and%20check%20method%20and%20I%20first%20started%20%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E18%20dogs%3C/span%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E%20and%20%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E18%20pigeons%20%3C/span%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3Efor%20my%20first%20answer%20but%20I%20realized%20that%20it%20didn%26%2339%3Bt%20match%20the%20legs%20and%20after%20a%20long%20series%20of%20guesing%20and%20checking%20I%20got%20my%20answer.%3C/span%3E%3Cspan%20style%3D%22color%3A%23000000%3B%22%3E%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%23008000%3B%22%3EI%20notice%20that%20there%20is%2036%20heads%20and%2080%20legs%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3EI%20notice%20that%20Xiao%20is%20a%20Chinese%20name%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%23800080%3B%22%3EI%20wonder%20if%20there%20is%20less%20dogs%20than%20pigeons.%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%3C/span%3E%3Cspan%20style%3D%22color%3A%23B22222%3B%22%3E%26nbsp%3BCheck%3A%2018%20dogs+18%20pigeons%3D%2036%3D98%20legs%3C/span%3E%20%26nbsp%3B%3Cspan%20style%3D%22color%3A%23006400%3B%22%3ECheck%3A32%20pigeons+%204%20dogs%3D%2036%20heads%2080%20legs%26nbsp%3B%3C/span%3E%26nbsp%3B%20I%20got%20the%20answer%20from%20the%20text%20feathers%20and%20Fur%20%26nbsp%3B%20%26nbsp%3B%3Cspan%20style%3D%22color%3A%23800080%3B%22%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%3C/span%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804715,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "I%20got%20the%20answer%2032%20pigeons%20and%204%20dogs.%20By%20checking%20with%20the%20other%20answer%2018%20dogs%20and%2018%20pigeons%20but%20it%20didn%27t%20match%20the%20legs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805294,
      threadId: 691195
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f424",
    clazz:  {
      clazzId: 103673,
      name: "Period 7 Algebra Prep"
    },
    createDate: "2013-11-20T19:54:04.179Z",
    creator:  {
      creatorId: 238079,
      safeName: "Kassie L.",
      username: "kLeavens"
    },
    longAnswer: "%3Cspan%20style%3D%22color%3A%23000000%3B%22%3EThe%20problem%20%26quot%3BFeathers%20and%20Fur%26quot%3B%20was%20a%20bit%20confusing%2C%20and%20still%20is%20but%20i%26%2339%3Bm%20going%20to%20try%20my%20best%20to%20solve%20the%20problem..%20So%20Xiao%20has%2036%20heads%20and%2080%20feet%2C%20all%20together%20she%20has%2036%20dogs%20and%20pigeons.%3C/span%3E%20Dogs%20have%204%20legs%2C%20pigeons%20have%202%2C%20at%20first%20i%20tried%20to%20solve%20the%20problem%20but%20i%20forgot%20about%20the%20pigeons%2C%20that%20they%20only%20have%202%20legs%2C%20so%20that%20very%20important%20to%20remember.%20I%26%2339%3Bm%20going%20to%20try%20examples...%3Cbr%20/%3E%0D%0A2%20*%2032%20%3D%2064%20Pigeons%20%26nbsp%3B%20%26nbsp%3B4%20*%204%20%3D%2016%20Dogs.%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%2064%20+%2016%20%3D%2080%20Feet.%20I%20guest%20the%20number%2032%2C%20at%20first%20i%20tried%2032%20dogs%20but%20it%20was%20not%20the%20right%20number%2C%20then%20i%20added%204%20because%20we%20needed%20to%20get%20to%2036%2C%20then%20i%20multiplied%20pigeon%20feet%20by%2032%20and%20multiplied%20dog%20feet%20by%204%20and%20got%2064%20and%2016%20then%20i%20added%20them%20and%20got%2080.",
    pdSet: "Feather and Fur - Mary",
    powId: 804726,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "The%20problem%20%22Feathers%20and%20Fur%22%20was%20a%20little%20tricky%20at%20first%2C%20but%20i%20am%20almost%20positive%20i%20have%20the%20answer...32%20pigeons%20and%204%20dogs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 813107,
      threadId: 691205
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f425",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-19T20:07:01.078Z",
    creator:  {
      creatorId: 237862,
      safeName: "Cole N.",
      username: "cNicholson13"
    },
    longAnswer: "%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E%23%20of%20pigeons%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E%23of%20pigeon%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E%23%20of%20dogs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E%23%20of%20dogs%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3EAll%20together%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E30%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E60%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E6%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E84%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E31%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E62%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E5%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E20%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E82%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E64%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E4%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E80%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%225%22%3EI%20Got%20my%20awnser%20by%20timesing%20and%20dividing%20the%20heads%20and%20legs%20to%20get%20my%20awnser.%20I%20Thought%20trying%20a%20table%20would%20be%20an%20easyer%20way%20the%20other%20ways.%20The%20problem%20was%20a%20kinda%20hard%20but%20yet%20no%20really.%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804718,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "Theres%2032%20pigeons%20and%204%20dogs",
    status: "SUBMITTED",

    thread:  {
      currentSubmissionId: 805315,
      threadId: 691198
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f426",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-19T20:08:58.582Z",
    creator:  {
      creatorId: 237853,
      safeName: "Nathan C.",
      username: "nClark13"
    },
    longAnswer: "i%20notice%20that%20they%20are%20asking%20me%20to%20find%20the%20amount%20of%20animals%20their%20are%20for%20pigeons%20and%20dogs.%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000ff%3B%22%3E%23%20of%20pigeons%26nbsp%3B%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E%23%20of%20dogs%3C/span%3E%26nbsp%3B%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E%23of%20pigeons%20legs%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E%23of%20dog%20legs%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3Etotal%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E24%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E12%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E48%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E24%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E72%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E30%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E6%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E60%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E12%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E72%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E35%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E1%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E70%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E4%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E74%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E32%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E4%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E64%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E16%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E80%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0Acheck%3A%20%26nbsp%3B32%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%2064%3Cbr%20/%3E%0D%0A%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B+4%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20+16%3Cbr%20/%3E%0D%0A%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%2036%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B80",
    pdSet: "Feather and Fur - Mary",
    powId: 804712,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "i%20think%20the%20right%20answer%20is%2032%20and%204%20for%20heads",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805306,
      threadId: 691192
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f427",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-19T20:07:36.154Z",
    creator:  {
      creatorId: 237859,
      safeName: "Carty L.",
      username: "cLuchsinger13"
    },
    longAnswer: "%3Cspan%20style%3D%22color%3A%23A52A2A%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3E%3Cstrong%3EIn%20the%20problem%20%26quot%3BFeathers%20and%20fur%26quot%3B%20Xiao%20said%20that%20she%20counted%3Cbr%20/%3E%0D%0Athe%20heads%20and%20the%20legs%2C%2036%20heads%20and%2080%20legs%20and%20so%20in%20made%20a%20chart%20and%20went%20down%20the%20chart%20trying%20to%20solve%20the%20problem%20of%20how%20many%20dog%20and%20pigeons%20there%20%26%238203%3Bare.%20So%26nbsp%3Bfinally%20i%20took%2032%20Pigeons%20and%204%20dogs%20and%20then%20got%2064%20and%20then%20got%2016%20and%20then%20got%20the%2080%20legs.%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0AMy%20refletion%20is%20that%20when%20i%20started%20i%20wanted%20to%20give%20up%20so%20much%20that%20i%20was%20just%20playing%20around%20with%20number%20that%20i%20got%2032%20and%204%20and%20then%20i%20said%20how%20about%2032%20pigeons%20and%204%20dogs%20and%20then%20i%20started%20to%20mulitpy%20and%20then%20i%20did%20this....%2032*2%3D64%20and%204*4%3D16%20and%2064+16%3D80%20so%20i%20got%20my%2080%20legs%20and%20my%20heads%20by%2032+4%3D36%20so%20i%20got%20my%2036%20heads%20and%20my%2080%20legs.%20%26nbsp%3B%3Cbr%20/%3E%0D%0A%26nbsp%3B%3C/strong%3E%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%26nbsp%3B",
    pdSet: "Feather and Fur - Mary",
    powId: 804728,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "Xiao%20has%2032%20Pigeons%20and%204%20dogs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805303,
      threadId: 691188
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f428",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-19T20:12:38.285Z",
    creator:  {
      creatorId: 237857,
      safeName: "Tyler K.",
      username: "tKorst13"
    },
    longAnswer: "%3Cspan%20style%3D%22font-family%3A%20arial%2C%20helvetica%2C%20sans-serif%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%22%3EThere%20is%2036%20heads%20and%2080%20feet%20but%20i%20have%20finally%20got%20my%20answer.%20If%20you%20add%3Cbr%20/%3E%0D%0A64+16%20it%20%3D%2080%20feet.%20I%20also%20no%20that%20there%20are%2032%20pigions%20and%20only%204%20dogs%20so%3Cbr%20/%3E%0D%0Athat%20makes%2036%20heads%20and%2080%20feet.%20So%20my%20answer%20is%20%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E32%20pigions%3C/span%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E%20and%204%20dogs%20%3C/span%3E%3Cbr%20/%3E%0D%0Athat%20gives%2036%20heads%20and%2080%20feet.%20I%20aslo%20think%20that%20the%20answer%20was%20kind%20of%20hard%20becase%20it%20did%20not%20make%20sense%20at%20first.%20When%20it%20said%20there%20was%2036%20heads%20i%20didnt%20no%20it%20was%20talking%20about%2036%20animals.%20I%20think%20it%20was%20easyer%20when%20we%20made%20a%20table%20on%20the%20big%20piece%20of%20paper%20that%20we%20used.%20I%20also%20thought%20that%20it%20was%20easyer%20when%20we%20got%20with%20a%20partner%20so%20we%20could%20both%20talk%20over%20the%20answer%20with%20each%20other.%3C/span%3E%3C/span%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804734,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "If%20you%20add%2064+16%3D80%20that%20is%20for%20feet%20and%20there%20is%2036%20%0D%0Aheads%20so%2036%20animals.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805293,
      threadId: 691197
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f429",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-21T19:50:35.255Z",
    creator:  {
      creatorId: 237861,
      safeName: "Ray M.",
      username: "rMyrepowell13"
    },
    longAnswer: "%3Cdiv%20style%3D%22margin-left%3A%2080px%3B%22%3E%26nbsp%3B%3C/div%3E%0D%0A%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Cthead%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Cth%20scope%3D%22col%22%20style%3D%22text-align%3A%20left%3B%22%3Edog%3C/th%3E%0D%0A%09%09%09%3Cth%20scope%3D%22col%22%3Edog%20legs%3C/th%3E%0D%0A%09%09%09%3Cth%20scope%3D%22col%22%3Epigeons%3C/th%3E%0D%0A%09%09%09%3Cth%20colspan%3D%222%22%20scope%3D%22col%22%3Epigeon%20legs%3C/th%3E%0D%0A%09%09%09%3Cth%20scope%3D%22col%22%3Etotal%3C/th%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/thead%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E18%3C/td%3E%0D%0A%09%09%09%3Ctd%3E72%3C/td%3E%0D%0A%09%09%09%3Ctd%3E18%3C/td%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%222%22%3E36%3C/td%3E%0D%0A%09%09%09%3Ctd%3E108%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E16%3C/td%3E%0D%0A%09%09%09%3Ctd%3E64%3C/td%3E%0D%0A%09%09%09%3Ctd%3E20%3C/td%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%222%22%3E40%3C/td%3E%0D%0A%09%09%09%3Ctd%3E104%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E11%3C/td%3E%0D%0A%09%09%09%3Ctd%3E44%3C/td%3E%0D%0A%09%09%09%3Ctd%3E25%3C/td%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%222%22%3E50%3C/td%3E%0D%0A%09%09%09%3Ctd%3E61%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E12%3C/td%3E%0D%0A%09%09%09%3Ctd%3E48%3C/td%3E%0D%0A%09%09%09%3Ctd%3E26%3C/td%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%222%22%3E52%3C/td%3E%0D%0A%09%09%09%3Ctd%3E100%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E13%3C/td%3E%0D%0A%09%09%09%3Ctd%3E52%3C/td%3E%0D%0A%09%09%09%3Ctd%3E27%3C/td%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%222%22%3E54%3C/td%3E%0D%0A%09%09%09%3Ctd%3E106%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E14%3C/td%3E%0D%0A%09%09%09%3Ctd%3E56%3C/td%3E%0D%0A%09%09%09%3Ctd%3E28%3C/td%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%222%22%3E56%3C/td%3E%0D%0A%09%09%09%3Ctd%3E112%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E10%3C/td%3E%0D%0A%09%09%09%3Ctd%3E40%3C/td%3E%0D%0A%09%09%09%3Ctd%3E24%3C/td%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%222%22%3E48%3C/td%3E%0D%0A%09%09%09%3Ctd%3E80%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E9%3C/td%3E%0D%0A%09%09%09%3Ctd%3E36%3C/td%3E%0D%0A%09%09%09%3Ctd%3E20%3C/td%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%222%22%3E40%3C/td%3E%0D%0A%09%09%09%3Ctd%3E76%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E8%3C/td%3E%0D%0A%09%09%09%3Ctd%3E32%3C/td%3E%0D%0A%09%09%09%3Ctd%3E18%3C/td%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%222%22%3E36%3C/td%3E%0D%0A%09%09%09%3Ctd%3E68%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E10%3C/td%3E%0D%0A%09%09%09%3Ctd%3E40%3C/td%3E%0D%0A%09%09%09%3Ctd%3E26%3C/td%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%222%22%3E43%3C/td%3E%0D%0A%09%09%09%3Ctd%3E83%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E4%3C/td%3E%0D%0A%09%09%09%3Ctd%3E16%3C/td%3E%0D%0A%09%09%09%3Ctd%3E32%3C/td%3E%0D%0A%09%09%09%3Ctd%3E64%3C/td%3E%0D%0A%09%09%09%3Ctd%3E80%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%226%22%3E%0D%0A%09%09%09%3Cdiv%3E%26nbsp%3B%3C/div%3E%0D%0A%09%09%09%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%226%22%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%226%22%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%226%22%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%226%22%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804727,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "The%20answer%20is%204%20dogs%20and%2032%20pigeons.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 804727,
      threadId: 691206
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f42a",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-19T19:53:49.382Z",
    creator:  {
      creatorId: 237859,
      safeName: "Carty L.",
      username: "cLuchsinger13"
    },
    longAnswer: "%3Cspan%20style%3D%22color%3A%23A52A2A%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3E%3Cem%3E%3Cstrong%3EIn%20the%20problem%20%26quot%3BFeathers%20and%20fur%26quot%3B%20Xiao%20said%20that%20she%20counted%3Cbr%20/%3E%0D%0Athe%20heads%20and%20the%20legs%2C%2036%20heads%20and%2080%20legs%20and%20so%20in%20made%20a%20chart%20and%20went%20down%20the%20chart%20trying%20to%20solve%20the%20problem%20of%20how%20many%20dog%20and%20pigeons%20there%20%26%238203%3Bare.%20So%26nbsp%3Bfinally%20i%20took%2032%20Pigeons%20and%204%20dogs%20and%20then%20got%2064%20and%20then%20got%2016%20and%20then%20got%20the%2080%20legs.%3C/strong%3E%3C/em%3E%3C/span%3E%3C/span%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804725,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "Xiao%20has%2032%20Pigeons%20and%204%20dogs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805303,
      threadId: 691188
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f42b",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-19T20:09:06.645Z",
    creator:  {
      creatorId: 237862,
      safeName: "Cole N.",
      username: "cNicholson13"
    },
    longAnswer: "%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E%23%20of%20pigeons%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E%23of%20pigeon%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E%23%20of%20dogs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E%23%20of%20dogs%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3EAll%20together%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E30%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E60%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E6%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E84%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E31%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E62%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E5%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E20%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E82%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E64%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E4%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E80%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%225%22%3EI%20Got%20my%20awnser%20by%20timesing%20and%20dividing%20the%20heads%20and%20legs%20to%20get%20my%20awnser.%20I%20Thought%20trying%20a%20table%20would%20be%20an%20easyer%20way%20the%20other%20ways.%20The%20problem%20was%20a%20kinda%20hard%20but%20yet%20no%20really.%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804736,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "Theres%2032%20pigeons%20and%204%20dogs",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805315,
      threadId: 691198
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f42c",
    clazz:  {
      clazzId: 103673,
      name: "Period 7 Algebra Prep"
    },
    createDate: "2013-11-20T18:24:02.429Z",
    creator:  {
      creatorId: 238030,
      safeName: "Micah N.",
      username: "mNishoff13"
    },
    longAnswer: "1.%20I%20noticed%20there%20are%2036%20heads%20meaning%20there%20are%2036%20animals%20in%20all.%3Cbr%20/%3E%0D%0A2.%20I%20noticed%20there%20are%2080%20feet%20total.%3Cbr%20/%3E%0D%0A3.%20Pigeons%20all%20have%202%20legs%20so%20every%20number%20I%20guess%20has%20to%20be%20multiplied%20by%202%3Cbr%20/%3E%0D%0A4.%20Dogs%20have%204%20legs%20so%20I%20have%20to%20multiply%20all%20the%20guessing%20numbers%20I%20get%20by%204%3Cbr%20/%3E%0D%0A5.%20If%20I%20were%20to%20guess%208%20dogs%2C%20the%20pigeons%20have%20to%20add%20up%20to%20equal%2036%20so%20what%20I%20do%20is%20%26quot%3BReverse%26quot%3B%20by%20doing%2036%20-%208%20%3D%2028%20So%20there%20will%20have%20to%20be%2028%20pigeons%20to%20add%20up%20to%2036.%3Cbr%20/%3E%0D%0A%26nbsp%3B%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%234B0082%3B%22%3EDogs%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%234B0082%3B%22%3ETimes%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%234B0082%3B%22%3E%26nbsp%3B%20%26nbsp%3BGuess%20wand%20check%20the%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20answer%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%234B0082%3B%22%3EPigeons%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%234B0082%3B%22%3ETimes%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%208%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%204%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B32%20+%2056%20%3D%2088%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Wrong%29%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%2028%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%202%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%207%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%204%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B28%20+%2058%20%3D%2086%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Wrong%29%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%2029%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%202%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%206%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%204%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B24%20+%2060%20%3D%2084%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Wrong%29%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%2030%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%202%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%205%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%204%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B20%20+%2062%20%3D%2082%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Wrong%29%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%2031%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%202%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%26nbsp%3B%20%26nbsp%3B%204%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%204%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%0D%0A%09%09%09%3Cp%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%26nbsp%3B16%20+%2064%20%3D%2080%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%28Correct%29%3C/span%3E%3C/strong%3E%3C/p%3E%0D%0A%09%09%09%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%26nbsp%3B%20%26nbsp%3B%2032%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%26nbsp%3B%20%26nbsp%3Bx%202%3C/span%3E%3C/strong%3E%3Cbr%20/%3E%0D%0A%09%09%09%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0AWhat%20I%20Reflected%20on%3A%3Cbr%20/%3E%0D%0A1.%20After%20I%20did%20this%20table%20I%20learned%20many%20new%20ways%20for%26nbsp%3Bstrategies.%3Cbr%20/%3E%0D%0A2.%20When%20My%20friend%20needed%20help%2C%20I%20told%20me%20them%20my%26nbsp%3Bstrategy%20of%20%26quot%3B%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3Eguess%20and%20check%3C/span%3E%26quot%3B%20and%20it%20helped%20them%20a%20lot.%26nbsp%3B%3Cbr%20/%3E%0D%0A3.%20%3Cspan%20style%3D%22color%3A%23FF8C00%3B%22%3EWhen%20learning%20new%26nbsp%3Bstrategies%20I%20got%20this%20one%20from%20the%20teacher%3C/span%3E%3A%20%28%20%3Cspan%20style%3D%22color%3A%23000080%3B%22%3EWhat%20she%20did%20was%20she%20put%20up%2036%20heads%20for%20the%20animals%20like%20so%3C/span%3E%20%29%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20o%20%28%20%3Cspan%20style%3D%22color%3A%23000080%3B%22%3EThen%20started%20adding%20the%20legs%20for%20the%20pigeons%3C/span%3E%20%28%20%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3EThe%20dots%20are%20legs%3C/span%3E%20%29%20%29%20.O.%20%26nbsp%3B%20.O.%20%26nbsp%3B%20.O.%20%28%20%3Cspan%20style%3D%22color%3A%23000080%3B%22%3ESo%20on%20till%2032%20heads%20had%202%20legs%20each.%20Which%20all%20added%20up%20to%2064%20legs%3C/span%3E.%20%26nbsp%3B%28%20%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3Epigeons%3C/span%3E%20%29%3Cspan%20style%3D%22color%3A%23000080%3B%22%3E%20Than%20she%20seen%20that%20there%20were%204%20heads%20left%20but%20if%20she%20added%204%20more%20pigeons%20she%20would%20have%2072%20legs%20and%20she%20needs%2080%20legs%20total%2C%20So%20instead%20she%20added%204%20dogs%20which%20all%20have%204%20legs%3C/span%3E.%20%28%20%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3Ea%20total%20of%2016%20legs%3C/span%3E%20%29%20%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3EWhich%20is%2016%20+%2064%20%3D%2080.%20She%20got%2080%20legs%20with%2036%20heads%2C%20she%20completed%20the%20question%20with%204%20dogs%20and%2032%20pigeons%3C/span%3E%3Cspan%20style%3D%22color%3A%23000000%3B%22%3E.%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%26nbsp%3B",
    pdSet: "Feather and Fur - Mary",
    powId: 805206,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "Xiao%20has%20a%20total%20of%204%20dogs%20and%2032%20pigeons.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805206,
      threadId: 689561
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f42d",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-19T20:07:03.705Z",
    creator:  {
      creatorId: 237860,
      safeName: "Richelle M.",
      username: "rMathis13"
    },
    longAnswer: "%3Cspan%20style%3D%22font-family%3A%20courier%20new%2C%20courier%2C%20monospace%22%3EThe%20problem%20is%20asking%20me%20how%20many%20pigeons%20and%20dogs%20are%20there.%20I%26nbsp%3Bnoitce%20that%26nbsp%3Btheres%2036%20heads%2C%20and%2080%20feet.%26nbsp%3BAlso%20pigeons%20have%202%20feet%20and%20dogs%20have%204%20feet.%3C/span%3E%0D%0A%3Cdiv%20style%3D%22text-align%3A%20center%22%3E%3Cspan%20style%3D%22color%3A%20%23000080%22%3EFeathers%20and%20Fur%21%3C/span%3E%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23ff3333%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%22%3E%23%20of%20pigeons%3C/span%3E%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23ff3333%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%22%3E%23%20of%20pigeons%20legs%3C/span%3E%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23ff3333%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%22%3E%23%20of%20Dogs%3C/span%3E%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23ff3333%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%22%3E%23%20of%20Dog%20legs%3C/span%3E%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23ff3333%22%3E%3Cspan%20style%3D%22font-size%3A%2016px%22%3ETOTAL%3C/span%3E%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E30%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E60%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E6%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E24%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E84%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E31%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E62%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E5%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E20%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E82%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E32%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E64%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E4%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E16%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3E%3Cspan%20style%3D%22color%3A%20%23cc0099%22%3E80%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A%0D%0A%3Cdiv%20style%3D%22text-align%3A%20left%22%3E%3Cspan%20style%3D%22color%3A%20%23663399%22%3E%3Cspan%20style%3D%22font-family%3A%20comic%20sans%20ms%2C%20cursive%22%3ECheck-%26nbsp%3B%20pigeons%2032%20x%202%3D64%2C%20Dogs%204%20x%204%3D16.%26nbsp%3BI%20added%2064%20and%2016.%20it%20equals%2080.%20Theres%2032%20Pigeons%20and%204%20Dogs.%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%26nbsp%3B%3C/div%3E%0D%0A%3C/div%3E%0D%0Athis%20problem%20was%20easy%20beacuse%20I%20solved%20the%20problem%20befor%26nbsp%3BI%20went%20to%20the%20computer.",
    pdSet: "Feather and Fur - Mary",
    powId: 804732,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "Xiao%20has%2032%20Pigeons%20and%204%20Dogs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 804732,
      threadId: 691187
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f42e",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-19T20:17:15.088Z",
    creator:  {
      creatorId: 237859,
      safeName: "Carty L.",
      username: "cLuchsinger13"
    },
    longAnswer: "%3Cspan%20style%3D%22color%3A%23A52A2A%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3E%3Cstrong%3EIn%20the%20problem%20%26quot%3BFeathers%20and%20fur%26quot%3B%20Xiao%20said%20that%20she%20counted%3Cbr%20/%3E%0D%0Athe%20heads%20and%20the%20legs%2C%2036%20heads%20and%2080%20legs%20and%20so%20in%20made%20a%20chart%20and%20went%20down%20the%20chart%20trying%20to%20solve%20the%20problem%20of%20how%20many%20dog%20and%20pigeons%20there%20%26%238203%3Bare.%20So%26nbsp%3Bfinally%20i%20took%2032%20Pigeons%20and%204%20dogs%20and%20then%20got%2064%20and%20then%20got%2016%20and%20then%20got%20the%2080%20legs.%3C/strong%3E%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%26nbsp%3B%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ccaption%3EFeathers%20and%20fur%3C/caption%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Epigeons%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%2019%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E18%3C/td%3E%0D%0A%09%09%09%3Ctd%3E32%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Edogs%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B17%3C/td%3E%0D%0A%09%09%09%3Ctd%3E18%3C/td%3E%0D%0A%09%09%09%3Ctd%3E4%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Epigeons%20legs%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%2038%3C/td%3E%0D%0A%09%09%09%3Ctd%3E36%3C/td%3E%0D%0A%09%09%09%3Ctd%3E64%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Edogs%20legs%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%2068%3C/td%3E%0D%0A%09%09%09%3Ctd%3E72%3C/td%3E%0D%0A%09%09%09%3Ctd%3E16%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Eall%20legs%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20106%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E108%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E80%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22color%3A%23A52A2A%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3E%3Cstrong%3EMy%20refletion%20is%20that%20when%20i%20started%20i%20wanted%20to%20give%20up%20so%20much%20that%20i%20was%20just%20playing%20around%20with%20number%20that%20i%20got%2032%20and%204%20and%20then%20i%20said%20how%20about%2032%20pigeons%20and%204%20dogs%20and%20then%20i%20started%20to%20mulitpy%20and%20then%20i%20did%20this....%2032*2%3D64%20and%204*4%3D16%20and%2064+16%3D80%20so%20i%20got%20my%2080%20legs%20and%20my%20heads%20by%2032+4%3D36%20so%20i%20got%20my%2036%20heads%20and%20my%2080%20legs.%20%26nbsp%3B%3Cbr%20/%3E%0D%0A%26nbsp%3B%3C/strong%3E%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%26nbsp%3B",
    pdSet: "Feather and Fur - Mary",
    powId: 804735,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "Xiao%20has%2032%20Pigeons%20and%204%20dogs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805303,
      threadId: 691188
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f42f",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-20T19:47:34.673Z",
    creator:  {
      creatorId: 237854,
      safeName: "Dorothy D.",
      username: "dDedmon13"
    },
    longAnswer: "%3Cp%3E%3Cspan%20style%3D%22font-family%3A%20comic%20sans%20ms%2C%20cursive%22%3EI%20got%20the%20answer%20by%20%3Cem%3Emultiplying%3C/em%3E%2032%20and%202%20wich%20equals%2064%2C%20and%26nbsp%3Bthen%20%3Cem%3Emultiplying%3C/em%3E%204%20and%204%20which%20equaled%2016%2C%20and%20then%20%3Cem%3Eadding%20%3C/em%3E64%20and%2016%20wich%20then%20equaled%2080%20feet.%3C/span%3E%3C/p%3E%0D%0A%0D%0A%3Cp%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E%3Cspan%20style%3D%22font-family%3A%20comic%20sans%20ms%2C%20cursive%22%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3ECheck%20For%20Answer%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%26nbsp%3B32*2%3D64%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%204*4%3D16%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%2064+16%3D80%26nbsp%3B%20%26nbsp%3B80-16%3D64%3C/span%3E%3C/p%3E%0D%0A%0D%0A%3Cp%3E%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22font-family%3A%20comic%20sans%20ms%2C%20cursive%22%3E%26nbsp%3BI%20think%20that%20this%20problem%20was%20a%20little%20hard%20to%20find%20the%20answer%20to%20because%20it%20took%20a%20lot%20of%20number%20guessing%2C%20and%20a%20lot%20of%20multiplying%2Cadding%2Cand%26nbsp%3Bdividing.%3Cbr%20/%3E%0D%0AIf%20someone%20needed%20a%20hint%26nbsp%3Bon%20this%20problem%20i%20would%20tell%20them%20to%20draw%20a%20picture%20out%20for%20it.%3C/span%3E%3C/p%3E%0D%0A%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20comic%20sans%20ms%2C%20cursive%22%3E%23%20of%20pigeons%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20comic%20sans%20ms%2C%20cursive%22%3E%23%20of%20dogs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20comic%20sans%20ms%2C%20cursive%22%3E%23%20of%20pigeion%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20comic%20sans%20ms%2C%20cursive%22%3E%23%20of%20dog%20legs%20%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20comic%20sans%20ms%2C%20cursive%22%3Etotal%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E25%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E11%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E50%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E44%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E94%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E26%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E10%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E52%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E40%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E92%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E12%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E96%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E28%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E8%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E56%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E88%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E%3Cspan%20style%3D%22color%3A%20%230000cd%22%3E32%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E%3Cspan%20style%3D%22color%3A%20%230000cd%22%3E4%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E%3Cspan%20style%3D%22color%3A%20%230000cd%22%3E64%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E%3Cspan%20style%3D%22color%3A%20%230000cd%22%3E16%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3A%20georgia%2C%20serif%22%3E%3Cspan%20style%3D%22color%3A%20%230000cd%22%3E80%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 804729,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "I%20came%20up%20with%2064%20dogs%20and%20pigeions%20all%20together.%20There%20are%2032%20pigeions%20and%204%20dogs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 804729,
      threadId: 691190
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f430",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-20T19:32:36.631Z",
    creator:  {
      creatorId: 237855,
      safeName: "Dylan G.",
      username: "dGates13"
    },
    longAnswer: "%3Cfont%20color%3D%22%23f0fff0%22%3E%26nbsp%3B%20%26nbsp%3B%3C/font%3E%3Cspan%20style%3D%22color%3A%23000000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%23FFD700%3B%22%3E%20%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E%20I%20got%20the%20answer%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%20%3C/span%3E%3Cspan%20style%3D%22color%3A%23008000%3B%22%3E32%20pigeons%3C/span%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E%20and%3C/span%3E%3Cspan%20style%3D%22color%3A%23008000%3B%22%3E%204%20dogs%3C/span%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E%20by%20using%20the%20guess%20and%20check%20method%20and%20I%20first%20started%20%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E18%20dogs%3C/span%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E%20and%20%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E18%20pigeons%20%3C/span%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3Efor%20my%20first%20answer%20but%20I%20realized%20that%20it%20didn%26%2339%3Bt%20match%20the%20legs%20and%20after%20a%20long%20series%20of%20guesing%20and%20checking%20I%20got%20my%20answer.%3C/span%3E%3Cspan%20style%3D%22color%3A%23000000%3B%22%3E%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%23008000%3B%22%3EI%20notice%20that%20there%20is%2036%20heads%20and%2080%20legs%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3EI%20notice%20that%20Xiao%20is%20a%20Chinese%20name%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%23800080%3B%22%3EI%20wonder%20if%20there%20is%20less%20dogs%20than%20pigeons.%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%3C/span%3E%3Cspan%20style%3D%22color%3A%23B22222%3B%22%3E%26nbsp%3BCheck%3A%2018%20dogs+18%20pigeons%3D%2036%3D98%20legs%3C/span%3E%20%26nbsp%3B%3Cspan%20style%3D%22color%3A%23006400%3B%22%3ECheck%3A32%20pigeons+%204%20dogs%3D%2036%20heads%2080%20legs%26nbsp%3B%3C/span%3E%26nbsp%3B%20I%20got%20the%20answer%20from%20the%20text%20feathers%20and%20Fur%20%26nbsp%3B%20%26nbsp%3B%3Cspan%20style%3D%22color%3A%23800080%3B%22%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%26nbsp%3B%3C/span%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 805290,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "I%20got%20the%20answer%2032%20pigeons%20and%204%20dogs.%20By%20checking%20with%20the%20other%20answer%2018%20dogs%20and%2018%20pigeons%20but%20it%20didn%27t%20match%20the%20legs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805294,
      threadId: 691195
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f431",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-20T18:18:20.459Z",
    creator:  {
      creatorId: 238028,
      safeName: "Joey M.",
      username: "jMurphy13"
    },
    longAnswer: "%26nbsp%3Bafter%2036%20heads%20and%2080%20feet%20right%20from%20the%20start%20to%20use%20product%20then%20sum.%20because%20of%20that%20first%20guess%20i%20needed%20more%20birds%20then%20dogs.%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20583px%3B%20height%3A%20522px%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%0D%0A%09%09%09%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%22%3E%0D%0A%09%09%09%09%3Ctbody%3E%0D%0A%09%09%09%09%09%3Ctr%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Ehow%20many%20birds%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Ehow%20many%20dogs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Ebirds%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Edogs%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Etotal%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%3C/tr%3E%0D%0A%09%09%09%09%09%3Ctr%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E22%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E14%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E44%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E56%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E90%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%3C/tr%3E%0D%0A%09%09%09%09%09%3Ctr%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E4%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E64%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E80%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%3C/tr%3E%0D%0A%09%09%09%09%09%3Ctr%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%3C/tr%3E%0D%0A%09%09%09%09%09%3Ctr%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%3C/tr%3E%0D%0A%09%09%09%09%3C/tbody%3E%0D%0A%09%09%09%3C/table%3E%0D%0A%09%09%09%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 805217,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "I%20came%20to%20realise%20something%20was%20up%20and%20i%20came%20up%20the%20answer%20for%2032%20pigeons%20and%204%20dogs%20i%20use%20radom%20numbers%20their%20was%20more%20birds%20than%20dogs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805217,
      threadId: 689560
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f432",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-20T18:14:13.818Z",
    creator:  {
      creatorId: 238028,
      safeName: "Joey M.",
      username: "jMurphy13"
    },
    longAnswer: "%26nbsp%3B%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20583px%3B%20height%3A%20522px%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%0D%0A%09%09%09%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%22%3E%0D%0A%09%09%09%09%3Ctbody%3E%0D%0A%09%09%09%09%09%3Ctr%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Ehow%20many%20birds%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Ehow%20many%20dogs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Ebirds%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Edogs%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3Etotal%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%3C/tr%3E%0D%0A%09%09%09%09%09%3Ctr%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E22%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E14%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E44%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E56%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E90%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%3C/tr%3E%0D%0A%09%09%09%09%09%3Ctr%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E4%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E64%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E80%3C/span%3E%3C/td%3E%0D%0A%09%09%09%09%09%3C/tr%3E%0D%0A%09%09%09%09%09%3Ctr%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%3C/tr%3E%0D%0A%09%09%09%09%09%3Ctr%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%09%09%3C/tr%3E%0D%0A%09%09%09%09%3C/tbody%3E%0D%0A%09%09%09%3C/table%3E%0D%0A%09%09%09%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 805213,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "I%20came%20to%20realise%20something%20was%20up%20and%20i%20came%20up%20the%20answer%20for%2032%20pigeons%20and%204%20dogs%20i%20use%20radom%20numbers%20their%20was%20more%20birds%20than%20dogs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805217,
      threadId: 689560
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f433",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-20T17:15:21.460Z",
    creator:  {
      creatorId: 238074,
      safeName: "Juslene W.",
      username: "jWhite13"
    },
    longAnswer: "%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ccaption%3EFeathers%20And%20Fur%3C/caption%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Ethe%20%23%20number%20of%20pigeons%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E25%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E26%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E44%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E94%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Ethe%20%23%20of%20dogs%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23ADD8E6%3B%22%3E11%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23ADD8E6%3B%22%3E10%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23ADD8E6%3B%22%3E12%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23ADD8E6%3B%22%3E40%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23ADD8E6%3B%22%3E92%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Ethe%20%23%20of%20pigeon%20legs%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23008080%3B%22%3E50%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23008080%3B%22%3E52%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23008080%3B%22%3E54%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23008080%3B%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23008080%3B%22%3E96%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Ethe%20%23%20of%20dog%20legs%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DDA0DD%3B%22%3E44%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DDA0DD%3B%22%3E40%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DDA0DD%3B%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DDA0DD%3B%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DDA0DD%3B%22%3E88%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Etotal%20of%20legs%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E92%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E96%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A%0D%0A%3Cdiv%3E%3Cfont%20face%3D%22lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3Ethere%20are%20more%20pigeons%20than%20dogs.%20%26nbsp%3B%3Cbr%20/%3E%0D%0A1.%20I%20noticed%20that%20there%20are%2036%20heads%20and%2080%20feet.%3Cbr%20/%3E%0D%0A2.%20I%20noticed%20she%20is%20a%20lover%20of%20eye-seeing%20dogs%20and%20homing%20pigeons%26nbsp%3B%3C/font%3E%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%26nbsp%3B%3C/div%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 805169,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "the%20answer%20i%20got%20was%2032%20pigeons%20and%204%20dogs.%20I%20did%20the%20table%20and%20that%20helped%20me%20out%20allot%20because%20i%20did%20the%20math%20and%20sorted%20it%20out%20and%20i%20decided%20to%20take%20it%20on%20the%20bottom%20and%20i%20figured%20it%20out.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805784,
      threadId: 691100
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f434",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-20T19:42:33.452Z",
    creator:  {
      creatorId: 237862,
      safeName: "Cole N.",
      username: "cNicholson13"
    },
    longAnswer: "%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E%23%20of%20pigeons%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E%23of%20pigeon%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E%23%20of%20dogs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E%23%20of%20dogs%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3EAll%20together%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E30%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E60%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E6%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E84%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E31%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E62%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E5%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E20%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E82%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E64%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E4%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E80%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%225%22%3EI%20Got%20my%20awnser%20by%20timesing%20and%20dividing%20the%20heads%20and%20legs%20to%20get%20my%20awnser.%20I%20Thought%20trying%20a%20table%20would%20be%20an%20easyer%20way%20the%20other%20ways.%20The%20problem%20was%20a%20kinda%20hard%20but%20yet%20no%20really.%3Cbr%20/%3E%0D%0A%09%09%09%3Cbr%20/%3E%0D%0A%09%09%09I%20thought%20it%20was%20easy%20using%20adding%20and%20subtracting%20legs.%3Cbr%20/%3E%0D%0A%09%09%09I%20thought%20it%20was%20better%20to%20use%20division%20in%20my%20awnser%20finding%20as%20well.%3Cbr%20/%3E%0D%0A%09%09%09I%20think%20it%20was%20better%20when%20i%20got%20the%20number%20of%20animals%20right.%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 805298,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "Theres%2032%20pigeons%20and%204%20dogs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805315,
      threadId: 691198
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f435",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-20T19:34:02.740Z",
    creator:  {
      creatorId: 237856,
      safeName: "Erica G.",
      username: "eGordon13"
    },
    longAnswer: "%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E%3Cem%3E%3Cspan%20style%3D%22color%3A%23FFA500%3B%22%3EPidgins%20%26nbsp%3B%20%3C/span%3E%26nbsp%3B%20%3Cspan%20style%3D%22color%3A%238B4513%3B%22%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3BDogs%20%26nbsp%3B%20%3C/span%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%3Cspan%20style%3D%22color%3A%23FFA500%3B%22%3EPidgin%20legs%3C/span%3E%20%26nbsp%3B%20%3Cspan%20style%3D%22color%3A%238B4513%3B%22%3E%26nbsp%3B%20%26nbsp%3BDog%20Legs%3C/span%3E%20%26nbsp%3B%20%26nbsp%3B%20%3Cspan%20style%3D%22color%3A%232F4F4F%3B%22%3ETotal%20of%20legs%3C/span%3E%3C/em%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E46%3C/td%3E%0D%0A%09%09%09%3Ctd%3E16%3C/td%3E%0D%0A%09%09%09%3Ctd%3E92%3C/td%3E%0D%0A%09%09%09%3Ctd%3E64%3C/td%3E%0D%0A%09%09%09%3Ctd%3E736%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E52%3C/td%3E%0D%0A%09%09%09%3Ctd%3E5%3C/td%3E%0D%0A%09%09%09%3Ctd%3E104%3C/td%3E%0D%0A%09%09%09%3Ctd%3E20%3C/td%3E%0D%0A%09%09%09%3Ctd%3E260%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E31%3C/td%3E%0D%0A%09%09%09%3Ctd%3E4%3C/td%3E%0D%0A%09%09%09%3Ctd%3E62%3C/td%3E%0D%0A%09%09%09%3Ctd%3E16%3C/td%3E%0D%0A%09%09%09%3Ctd%3E72%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E4%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E64%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E80%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A32/4%3D80%2064+16%3D80%3Cbr%20/%3E%0D%0AI%20used%20guess%20%26amp%3B%20cheek%20for%20this%20problem%20of%3Cspan%20style%3D%22color%3A%23FF8C00%3B%22%3E%20feathers%3C/span%3E%20and%20%3Cspan%20style%3D%22color%3A%238B4513%3B%22%3Efur%3C/span%3E%20and%20this%20is%20what%20i%20came%20up%20with.%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0AI%20notice%20There%20should%20be%20Less%20Dogs%20Than%20Pidgins.%3Cbr%20/%3E%0D%0AI%20notice%20There%20Are%20More%20Pidgins%20than%20dogs%20.%3Cbr%20/%3E%0D%0AI%20wounder%20If%20%26nbsp%3BXiao%20was%20Hosting%20Humans%20as%20well%20Because%20there%20are%20more%20animals%20Than%20one%20person%20%26gt%3B%26gt%3B%20Xiao.",
    pdSet: "Feather and Fur - Mary",
    powId: 805289,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "The%20answer%20of%20this%20problem%20of%20Feathers%20and%20Fur%20is%20%2C%2032%20Pidgins%20and%204%20Dogs%20%20.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805302,
      threadId: 691184
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f436",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-20T19:53:55.209Z",
    creator:  {
      creatorId: 237857,
      safeName: "Tyler K.",
      username: "tKorst13"
    },
    longAnswer: "My%20answer%20that%20i%20got%20is%3Cspan%20style%3D%22color%3A%20%23ffd700%22%3E%20%3C/span%3E%3Cspan%20style%3D%22color%3A%20%23a52a2a%22%3E32%3C/span%3E%3Cspan%20style%3D%22color%3A%20%23ffd700%22%3E%20%3C/span%3Epigions%20and%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E%204%3C/span%3E%20dogs.%20That%20would%20get%20%3Cspan%20style%3D%22color%3A%20%23008000%22%3E16%3C/span%3E%20legs%20for%20dogs%20and%2064%20pigion%20legs.%20How%20i%20got%2080%20feet%20was%2064+16%20which%20%3D%2080%20feet.%20My%20answer%20is%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E%2032%20%3C/span%3Epigions%20and%3Cspan%20style%3D%22color%3A%20%23a52a2a%22%3E%204%3C/span%3E%20dogs.%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E%20I%20kinda%20thought%20the%20answer%20was%20hard%20until%20we%20talked%20over%20it%20with%20are%20partners.%20The%20part%20i%20got%20stuck%20on%20the%20problem%20to%20add%20up%20to%20get%2080%20feet.%20I%26nbsp%3B%20was%20Looking%20at%20my%20answer%20it%20seems%20reasonable%20because%20we%20kept%20on%20trying%20to%20add%20up%20to%2080%20feet.%20%3C/span%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 805293,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "My%20answer%20is%2032%20pigions%20and%204%20dogs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805293,
      threadId: 691197
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f437",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-20T19:41:43.241Z",
    creator:  {
      creatorId: 238075,
      safeName: "Nick W.",
      username: "nWilson13"
    },
    longAnswer: "%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Edogs%204%3D4%20legs%3C/td%3E%0D%0A%09%09%09%3Ctd%3E4*4%3D16%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3EPigeons%2032%3D2%3C/td%3E%0D%0A%09%09%09%3Ctd%3E32*2%3D64%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Eheads%3C/td%3E%0D%0A%09%09%09%3Ctd%3E32+4%3D36%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 805291,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "There%20are%202%20dogs%20and%20they%20both%20have%20four%20legs%20%20and%20the%20i%20multiplied%204*4%20and%20i%20got%2016%20and%20then%20i%20seen%20i%20had%2032%20pigeons%20%20and%20i%20multiplied%202%20and%20got%20i%20%2064%20and%20i%20add%2016+64%3D80%20and%20that%27s%20how%20i%20got%2080%20how%20i%20got%2036%20i%20add%2032%20+4%20and%20i%20got%2036.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805314,
      threadId: 691204
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f438",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-20T19:46:43.914Z",
    creator:  {
      creatorId: 237853,
      safeName: "Nathan C.",
      username: "nClark13"
    },
    longAnswer: "%3Cstrong%3E%3Cspan%20style%3D%22color%3A%20rgb%280%2C%200%2C%20255%29%3B%22%3EI%20notice%20that%20they%20are%20asking%20me%20to%20find%20the%20amount%20of%20animals%20their%20are%20for%20pigeons%20and%20dogs.%26nbsp%3B%3C/span%3E%3C/strong%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3Elooking%20at%20my%26nbsp%3B%3C/span%3E%3C/strong%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3Eanswer%20it%26nbsp%3B%3C/span%3E%3C/strong%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3Eseems%20reasonable%20because%20it%20works%20out%20with%26nbsp%3Bthe%20asked%20problem.%3C/span%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E%20i%20thought%20the%20problem%20was%20hard%20until%20i%20tried%20different%20numbers%20until%20i%20got%20the%20answer.%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%20In%20the%20problem%20i%20got%20stuck%20when%20the%20problem%20asked%20how%20many%20there%20are%20for%20dogs%20and%20pigeons.%20%26nbsp%3B%3C/span%3E%3C/strong%3E%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000ff%3B%22%3E%23%20of%20pigeons%26nbsp%3B%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E%23%20of%20dogs%3C/span%3E%26nbsp%3B%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E%23of%20pigeons%20legs%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E%23of%20dog%20legs%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3Etotal%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E24%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E12%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E48%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E24%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E72%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E30%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E6%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E60%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E12%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E72%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E35%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E1%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E70%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E4%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%23ff0066%3B%22%3E74%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E32%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E4%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E64%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E16%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cstrong%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E80%3C/span%3E%3C/strong%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0Acheck%3A%20%26nbsp%3B32%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%2064%3Cbr%20/%3E%0D%0A%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B+4%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20+16%3Cbr%20/%3E%0D%0A%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%2036%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B80",
    pdSet: "Feather and Fur - Mary",
    powId: 805306,
    publication:  {
      publicationId: 4308,
    },
    shortAnswer: "i%20think%20the%20right%20answer%20is%2032%20and%204%20for%20heads",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805306,
      threadId: 691192
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f439",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-21T18:43:22.737Z",
    creator:  {
      creatorId: 237852,
      safeName: "Jewell T.",
      username: "jThomas13"
    },
    longAnswer: "%3Cspan%20style%3D%22color%3A%23000000%3B%22%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3Ei%20notice%20that%20she%20is%20currently%20hosting%2036%20heads.%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3Ei%20notice%20that%20she%20is%20currently%20hosting%2080%20feet.%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%26nbsp%3B%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3Eif%20you%20do%204*4%3D16%20mean%20theirs%20goes%2016%20of%20feet.%20what%20+%2016%20will%20%3D%2080%20witch%2080%20is%20the%20total%20number%20of%20feet.%20%26nbsp%3Bso%2064+16%3D80.%20so%20there%20for%2064%20of%20the%20feet%20are%20the%20pigeons%20and%2016%20of%20them%20are%20dog.%20well%20pigeons%20have%202%20feet%20each%20so%2064/2%3D32.%20so%20theirs%2032%20pigeons%20and%204*4%3D16.%20again%20%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E16+64%3D80..80%20is%20the%20total%20is%20the%20total%20number%20of%20feet.%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22color%3A%23000000%3B%22%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E32*2%3D64%20%26nbsp%3B....32%20pigeons%20*2%20%3D64%20witch%20is%2064%20feet%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E64+16%3D80%26nbsp%3Btheirs%20in%20all%26nbsp%3B%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%26nbsp%3B",
    pdSet: "Feather and Fur - Mary",
    powId: 805218,
    publication:  {
      publicationId: 4308
    },
    shortAnswer: "i%20got%2016%20feet%20for%20the%204%20%20dogs%20.%20i%20got%2064%20feet%20for%20the%20pigeons.%20so%20their%204%20dogs%2032%20pigeons.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805218,
      threadId: 689566
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f43a",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-20T19:53:37.309Z",
    creator:  {
      creatorId: 237864,
      safeName: "Orion T.",
      username: "oThornberry13"
    },
    longAnswer: "I%20got%20the%20answer%20by%20taking%26nbsp%3B",
    pdSet: "Feather and Fur - Mary",
    powId: 805301,
    publication:  {
      publicationId: 4308,
    },
    shortAnswer: "Xaio%20has%2032%20pigeons%204%20dogs%3D%2080%20legs%2032%20heads",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805301,
      threadId: 691707
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f43b",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-20T19:54:10.703Z",
    creator:  {
      creatorId: 237865,
      safeName: "Dallas W.",
      username: "dWilson13"
    },
    longAnswer: "%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20I%20got%204%20puppies%20and%2032%20pigeons%20and%2080%20legs%26nbsp%3BI%20Multiped%20my%20two%20answers%20and%20i%20got%2080%20legs%20.%2032%20pigeons%20and%204%20puppies%20.%20I%20used%20guess%20and%20check%20.%20I%20thought%20this%20was%20a%20easy%20problem.",
    pdSet: "Feather and Fur - Mary",
    powId: 805296,
    publication:  {
      publicationId: 4308,
    },
    shortAnswer: "i%20came%20up%20by%20times%20there%27s%20answers%2032%20x%202%20%3D64%20%2C4%20x%204%20%3D%2016%20%2C%2064%20x%2016%20%3D%2080%20.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805811,
      threadId: 689624
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f43c",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-20T19:47:28.777Z",
    creator:  {
      creatorId: 237856,
      safeName: "Erica G.",
      username: "eGordon13"
    },
    longAnswer: "%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E%3Cem%3E%3Cspan%20style%3D%22color%3A%23FFA500%3B%22%3EPidgins%20%26nbsp%3B%20%3C/span%3E%26nbsp%3B%20%3Cspan%20style%3D%22color%3A%238B4513%3B%22%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3BDogs%20%26nbsp%3B%20%3C/span%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%3Cspan%20style%3D%22color%3A%23FFA500%3B%22%3EPidgin%20legs%3C/span%3E%20%26nbsp%3B%20%3Cspan%20style%3D%22color%3A%238B4513%3B%22%3E%26nbsp%3B%20%26nbsp%3BDog%20Legs%3C/span%3E%20%26nbsp%3B%20%26nbsp%3B%20%3Cspan%20style%3D%22color%3A%232F4F4F%3B%22%3ETotal%20of%20legs%3C/span%3E%3C/em%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E46%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E92%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E64%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E736%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E52%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E5%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E104%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E20%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E260%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E31%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E4%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E62%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E72%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E4%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E64%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E80%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A32*4%3D64%2064*16%3D80%3Cbr%20/%3E%0D%0AI%20used%20guess%20%26amp%3B%20cheek%20for%20this%20problem%20of%3Cspan%20style%3D%22color%3A%23FF8C00%3B%22%3E%20feathers%3C/span%3E%20and%20%3Cspan%20style%3D%22color%3A%238B4513%3B%22%3Efur%3C/span%3E%20and%20this%20is%20what%20i%20came%20up%20with.%0D%0A%0D%0A%3Cdiv%20style%3D%22text-align%3A%20center%3B%22%3E%3Cem%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3EI%20notice%20There%20should%20be%20Less%20Dogs%20Than%20Pidgins.%3C/span%3E%3C/em%3E%3C/div%3E%0D%0A%0D%0A%3Cdiv%20style%3D%22text-align%3A%20center%3B%22%3E%3Cem%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3EI%20notice%20There%20Are%20More%20Pidgins%20than%20dogs%20.%3C/span%3E%3C/em%3E%3C/div%3E%0D%0A%0D%0A%3Cdiv%20style%3D%22text-align%3A%20center%3B%22%3E%3Cem%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3EI%20wounder%20If%20%26nbsp%3BXiao%20was%20Hosting%20Humans%20as%20well%20Because%20there%20are%20more%20animals%20Than%20one%20person%20%26gt%3B%26gt%3B%20Xiao.%3C/span%3E%3C/em%3E%3C/div%3E%0D%0A%0D%0A%3Cdiv%20style%3D%22text-align%3A%20center%3B%22%3E%3Cem%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3EIf%20someone%20was%20having%20a%20issue%20with%20this%20problem%20of%20Feathers%20%26amp%3B%20Fur%20%2C%20I%20would%20tell%20them%20to%20draw%20or%20do%20a%20bar%20graph.%20It%20seems%20it%20always%20had%20help%20me%20.%3C/span%3E%3C/em%3E%3C/div%3E%0D%0A%0D%0A%3Cdiv%20style%3D%22text-align%3A%20center%3B%22%3E%3Cem%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3EIn%20this%20problem%20of%20Feathers%20and%20Fur%20I%20had%20a%20issue%20with%20the%20adding%20up%20the%20problems%20%2C%20sometimes%20writing%20it%20out.%3C/span%3E%3C/em%3E%3C/div%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 805302,
    publication:  {
      publicationId: 4308,
    },
    shortAnswer: "The%20answer%20of%20this%20problem%20of%20Feathers%20and%20Fur%20is%20%2C%2032%20Pidgins%20and%204%20Dogs%20%20.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805302,
      threadId: 691184
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f43d",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-21T18:25:52.599Z",
    creator:  {
      creatorId: 238031,
      safeName: "Erika R.",
      username: "eRodriguez13"
    },
    longAnswer: "%3Cspan%20style%3D%22font-size%3A16px%3B%22%3E%3Cspan%20style%3D%22color%3A%23ff3399%3B%22%3EI%20am%20Supposed%20to%20figure%20out%20how%20many%20dogs%20and%20how%20many%20pigeons%20there%20are%2C%20with%20the%20information%20%26quot%3B36%20heads%2080%20feet%26quot%3B%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E1-%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E%20I%20notice%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%20that%20there%20would%20be%20more%20pigeons%20than%20dogs.%3C/span%3E%3Cspan%20style%3D%22color%3A%2300ff99%3B%22%3E%26nbsp%3B%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E2-%20%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3EI%20notice%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%20there%26%2339%3Bs%20two%20kind%20of%20animals.%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22color%3A%23EE82EE%3B%22%3EThis%20problem%20was%3A%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22color%3A%23ff3366%3B%22%3E-a%20little%20hard%20before%20I%20did%20the%20table.%3Cbr%20/%3E%0D%0A-%20confusing%20before%20I%20figured%20out%20that%20there%20were%20more%20pigeons%20than%20dogs.%3Cbr%20/%3E%0D%0A-%20Fun%20to%20do%20because%20I%20multiplied%20a%20lot%2C%20and%20multiplication%20to%20me%20is%20fun.%3C/span%3E%3Cbr%20/%3E%0D%0A%26nbsp%3B%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%23%20of%20pigeons%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%23%20of%20dogs%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%23%20of%20pigeon%20feet%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%23%20of%20dog%20feet%3C/td%3E%0D%0A%09%09%09%3Ctd%3ETotal%20feet%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000CD%3B%22%3E25%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000CD%3B%22%3E11%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000CD%3B%22%3E50%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000CD%3B%22%3E44%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E94%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E26%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E10%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E52%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E40%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E92%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E12%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E96%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E28%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E8%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E56%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%230000FF%3B%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E88%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E38%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E4%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E64%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E16%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FF00%3B%22%3E80%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A%3Cspan%20style%3D%22color%3A%233399ff%3B%22%3ECheck%3A%2032%20x%202%3D%2064%20--%26gt%3B%204%20x%204%3D%2016%20--%26gt%3B%2064%20+%2016%3D%2080%3C/span%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 805778,
    publication:  {
      publicationId: 4308,
    },
    shortAnswer: "I%20did%20all%20the%20work%20in%20my%20guess%20and%20check%20table%20and%20got%20the%20answer.%20There%20are%2032%20pigeons%20and%204%20dogs%2C%20which%20is%2036%20heads%20and%2080%20feet.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805778,
      threadId: 689551
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f43e",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-20T19:50:26.168Z",
    creator:  {
      creatorId: 238075,
      safeName: "Nick W.",
      username: "nWilson13"
    },
    longAnswer: "There%20are%204%20dogs%20and%20they%20both%20have%20four%20legs%20%26nbsp%3Band%20then%20%26nbsp%3Bi%20multiplied%204*4%20and%20i%20got%2016%20and%20then%20i%20seen%20i%20had%2032%20pigeons%20left%20%26nbsp%3B%20and%20i%20know%20that%20pigeons%20have%202%20legs%20so%20then%20i%20multiplied%20%26nbsp%3B32*2%20and%20got%20i%20%26nbsp%3B64%20and%20i%20add%2016+64%3D80%20and%20that%26%2339%3Bs%20how%20i%20got%2080%20how%20i%20got%2036%20i%20add%2032%20+4%20and%20i%20got%2036.%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Edogs%204%3D4%20legs%3C/td%3E%0D%0A%09%09%09%3Ctd%3E4*4%3D16%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3EPigeons%2032%3D2%3C/td%3E%0D%0A%09%09%09%3Ctd%3E32*2%3D64%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Eheads%3C/td%3E%0D%0A%09%09%09%3Ctd%3E32+4%3D36%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 805314,
    publication:  {
      publicationId: 4308,
    },
    shortAnswer: "Xiao%20has%204dogs%20%20and%2032%20pigeons%20equal%27s%20%20the%2036%20heads",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805314,
      threadId: 691204
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f43f",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-20T19:46:20.590Z",
    creator:  {
      creatorId: 237855,
      safeName: "Dylan G.",
      username: "dGates13"
    },
    longAnswer: "%3Cfont%20color%3D%22%23f0fff0%22%3E%26nbsp%3B%20%26nbsp%3B%3C/font%3E%3Cspan%20style%3D%22color%3A%23000000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%23FFD700%3B%22%3E%20%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E%20I%20got%20the%20answer%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E%20%3C/span%3E%3Cspan%20style%3D%22color%3A%23008000%3B%22%3E32%20pigeons%3C/span%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E%20and%3C/span%3E%3Cspan%20style%3D%22color%3A%23008000%3B%22%3E%204%20dogs%3C/span%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E%20by%20using%20the%20guess%20and%20check%20method%20and%20I%20first%20started%20%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E18%20dogs%3C/span%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E%20and%20%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E18%20pigeons%20%3C/span%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3Efor%20my%20first%20answer%20but%20I%20realized%20that%20it%20didn%26%2339%3Bt%20match%20the%20legs%20and%20after%20a%20long%20series%20of%20guesing%20and%20checking%20I%20got%20my%20answer.%3C/span%3E%3Cspan%20style%3D%22color%3A%23000000%3B%22%3E%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%23008000%3B%22%3EI%20notice%20that%20there%20is%2036%20heads%20and%2080%20legs%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3EI%20notice%20that%20Xiao%20is%20a%20Chinese%20name%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%23800080%3B%22%3EI%20wonder%20if%20there%20is%20less%20dogs%20than%20pigeons.%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%3C/span%3E%3Cspan%20style%3D%22color%3A%23B22222%3B%22%3E%26nbsp%3BCheck%3A%2018%20dogs+18%20pigeons%3D%2036%3D98%20legs%3C/span%3E%20%26nbsp%3B%3Cspan%20style%3D%22color%3A%23006400%3B%22%3ECheck%3A32%20pigeons+%204%20dogs%3D%2036%20heads%2080%20legs%26nbsp%3B%3C/span%3E%26nbsp%3B%20I%20got%20the%20answer%20from%20the%20text%20feathers%20and%20Fur%20%26nbsp%3B%20%26nbsp%3B%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3EREFLECTION%201%3A%20I%20think%20that%20I%20did%20good%20by%20showing%20my%20answer%20and%20how%20I%20got%20to%20it%3C/span%3E%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3Cspan%20style%3D%22color%3A%23008000%3B%22%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3BREFLECTION%202%3A%20I%20also%20think%20that%20I%20got%20stuck%20at%20least%20four%20times%20but%20I%20got%20to%20it%20when%20I%20finally%20knew%20what%20I%20was%20doing%20with%20my%20work.%3C/span%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3BREFLECTION%3Cspan%20style%3D%22color%3A%230000CD%3B%22%3E%26nbsp%3B3%3A%20I%20thought%20it%20was%20very%20easy%20at%20first%20then%20it%20got%20harder%20and%20harder%20and%20even%20more%20hard%20until%20Mrs.%20Wren%20told%20me%20what%20I%20was%20doing%20wrong.%3C/span%3E%3Cbr%20/%3E%0D%0A%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3Cspan%20style%3D%22color%3A%23FFFFFF%3B%22%3Easshole%3C/span%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 805294,
    publication:  {
      publicationId: 4308,
    },
    shortAnswer: "I%20got%20the%20answer%2032%20pigeons%20and%204%20dogs.%20By%20checking%20with%20the%20other%20answer%2018%20dogs%20and%2018%20pigeons%20but%20it%20didn%27t%20match%20the%20legs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805294,
      threadId: 691195
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f440",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-20T19:47:37.609Z",
    creator:  {
      creatorId: 239081,
      safeName: "John S.",
      username: "jSutherland13"
    },
    longAnswer: "there%20was%2032%20pigeons%20and%204%20dogs%20in%20all%20which%20make%2064%20legs%20and%2016%20dogs%20legs.%3Cbr%20/%3E%0D%0Ai%20noticed%20that%20there%20was%204%20dogs%3Cbr%20/%3E%0D%0Ai%20noticed%20there%20was%2032%20pigeons%26nbsp%3B%3Cbr%20/%3E%0D%0Ai%20noticed%20that%20there%20was%2080%20legs%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0Ai%20wonder%20if%20there%20was%20just%20one%20set%20of%20animals%20like%2036%20dogs%20if%20that%20would%20work.%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Edogs%3C/td%3E%0D%0A%09%09%09%3Ctd%3Epigeons%3C/td%3E%0D%0A%09%09%09%3Ctd%3Edog%20legs%3C/td%3E%0D%0A%09%09%09%3Ctd%3Epigeons%20legs%3C/td%3E%0D%0A%09%09%09%3Ctd%3Elegs%20total%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E4%3C/td%3E%0D%0A%09%09%09%3Ctd%3E32%3C/td%3E%0D%0A%09%09%09%3Ctd%3E16%3C/td%3E%0D%0A%09%09%09%3Ctd%3E64%3C/td%3E%0D%0A%09%09%09%3Ctd%3E80%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E36%3C/td%3E%0D%0A%09%09%09%3Ctd%3E0%3C/td%3E%0D%0A%09%09%09%3Ctd%3E246%3C/td%3E%0D%0A%09%09%09%3Ctd%3E0%3C/td%3E%0D%0A%09%09%09%3Ctd%3E246%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 805304,
    publication:  {
      publicationId: 4308,
    },
    shortAnswer: "there%20was%2032%20pigeons%20and%204%20dogs..",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805316,
      threadId: 691708
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f441",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-20T19:44:36.624Z",
    creator:  {
      creatorId: 237862,
      safeName: "Cole N.",
      username: "cNicholson13"
    },
    longAnswer: "%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E%23%20of%20pigeons%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E%23of%20pigeon%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E%23%20of%20dogs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3E%23%20of%20dogs%20legs%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3EAll%20together%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E30%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E60%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E6%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E84%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E31%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E62%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E5%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E20%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E82%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E64%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E4%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E80%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%225%22%3EI%20Got%20my%20awnser%20by%20timesing%20and%20dividing%20the%20heads%20and%20legs%20to%20get%20my%20awnser.%20I%20Thought%20trying%20a%20table%20would%20be%20an%20easyer%20way%20the%20other%20ways.%20The%20problem%20was%20a%20kinda%20hard%20but%20yet%20no%20really.%3Cbr%20/%3E%0D%0A%09%09%09%3Cbr%20/%3E%0D%0A%09%09%09I%20thought%20it%20was%20easy%20using%20adding%20and%20subtracting%20legs.%3Cbr%20/%3E%0D%0A%09%09%09I%20thought%20it%20was%20better%20to%20use%20division%20in%20my%20awnser%20finding%20as%20well.%3Cbr%20/%3E%0D%0A%09%09%09I%20think%20it%20was%20better%20when%20i%20got%20the%20number%20of%20animals%20right.%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 805315,
    publication:  {
      publicationId: 4308,


    },
    shortAnswer: "Theres%2032%20pigeons%20and%204%20dogs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805315,
      threadId: 691198
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f442",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-12-14T17:00:06.496Z",
    creator:  {
      creatorId: 238079,
      safeName: "Kassie L.",
      username: "kLeavens"
    },
    longAnswer: "%3Cspan%20style%3D%22color%3A%23000000%3B%22%3EThe%20problem%20%26quot%3BFeathers%20and%20Fur%26quot%3B%20was%20a%20bit%20confusing%2C%20and%20still%20is%20but%20i%26%2339%3Bm%20going%20to%20try%20my%20best%20to%20solve%20the%20problem..%20So%20Xiao%20has%2036%20heads%20and%2080%20feet%2C%20all%20together%20she%20has%2036%20dogs%20and%20pigeons.%3C/span%3E%20Dogs%20have%204%20legs%2C%20pigeons%20have%202%2C%20at%20first%20i%20tried%20to%20solve%20the%20problem%20but%20i%20forgot%20about%20the%20pigeons%2C%20that%20they%20only%20have%202%20legs%2C%20so%20that%20very%20important%20to%20remember.%20I%26%2339%3Bm%20going%20to%20try%20examples...%3Cbr%20/%3E%0D%0A2%20*%2032%20%3D%2064%20Pigeons%20%26nbsp%3B%20%26nbsp%3B4%20*%204%20%3D%2016%20Dogs.%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%2064%20+%2016%20%3D%2080%20Feet.%20I%20guest%20the%20number%2032%2C%20at%20first%20i%20tried%2032%20dogs%20but%20it%20was%20not%20the%20right%20number%2C%20then%20i%20added%204%20because%20we%20needed%20to%20get%20to%2036%2C%20then%20i%20multiplied%20pigeon%20feet%20by%2032%20and%20multiplied%20dog%20feet%20by%204%20and%20got%2064%20and%2016%20then%20i%20added%20them%20and%20got%2080.",
    pdSet: "Feather and Fur - Mary",
    powId: 813107,
    publication:  {
      publicationId: 4308,
    },
    shortAnswer: "The%20problem%20%22Feathers%20and%20Fur%22%20was%20a%20little%20tricky%20at%20first%2C%20but%20i%20am%20almost%20positive%20i%20have%20the%20answer...32%20pigeons%20and%204%20dogs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 813107,
      threadId: 691205
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f443",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-21T18:43:16.320Z",
    creator:  {
      creatorId: 238074,
      safeName: "Juslene W.",
      username: "jWhite13"
    },
    longAnswer: "%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ccaption%3EFeathers%20And%20Fur%3C/caption%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Ethe%20%23%20number%20of%20pigeons%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E25%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E26%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E44%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E94%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Ethe%20%23%20of%20dogs%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23ADD8E6%3B%22%3E11%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23ADD8E6%3B%22%3E10%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23ADD8E6%3B%22%3E12%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23ADD8E6%3B%22%3E40%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23ADD8E6%3B%22%3E92%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Ethe%20%23%20of%20pigeon%20legs%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23008080%3B%22%3E50%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23008080%3B%22%3E52%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23008080%3B%22%3E54%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23008080%3B%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23008080%3B%22%3E96%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Ethe%20%23%20of%20dog%20legs%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DDA0DD%3B%22%3E44%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DDA0DD%3B%22%3E40%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DDA0DD%3B%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DDA0DD%3B%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DDA0DD%3B%22%3E88%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Etotal%20of%20legs%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E92%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E96%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A%0D%0A%3Cdiv%3E%3Cfont%20face%3D%22lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3Ethere%20are%20more%20pigeons%20than%20dogs.%20%26nbsp%3B%3Cbr%20/%3E%0D%0A1.%20I%20noticed%20that%20there%20are%2036%20heads%20and%2080%20feet.%3Cbr%20/%3E%0D%0A2.%20I%20noticed%20she%20is%20a%20lover%20of%20eye-seeing%20dogs%20and%20homing%20pigeons%26nbsp%3B%3C/font%3E%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%26nbsp%3B%3C/div%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 805779,
    publication:  {
      publicationId: 4308,
    },
    shortAnswer: "the%20answer%20i%20got%20was%2032%20pigeons%20and%204%20dogs.%20I%20did%20the%20table%20and%20that%20helped%20me%20out%20allot%20because%20i%20did%20the%20math%20and%20sorted%20it%20out%20and%20i%20decided%20to%20take%20it%20on%20the%20bottom%20and%20i%20figured%20it%20out.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805784,
      threadId: 691100
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f444",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-25T17:07:28.875Z",
    creator:  {
      creatorId: 238074,
      safeName: "Juslene W.",
      username: "jWhite13"
    },
    longAnswer: "%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ccaption%3EFeathers%20And%20Fur%3C/caption%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Ethe%20%23%20number%20of%20pigeons%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E25%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E26%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E44%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DAA520%3B%22%3E94%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Ethe%20%23%20of%20dogs%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23ADD8E6%3B%22%3E11%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23ADD8E6%3B%22%3E10%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23ADD8E6%3B%22%3E12%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23ADD8E6%3B%22%3E40%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23ADD8E6%3B%22%3E92%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Ethe%20%23%20of%20pigeon%20legs%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23008080%3B%22%3E50%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23008080%3B%22%3E52%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23008080%3B%22%3E54%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23008080%3B%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23008080%3B%22%3E96%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Ethe%20%23%20of%20dog%20legs%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DDA0DD%3B%22%3E44%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DDA0DD%3B%22%3E40%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DDA0DD%3B%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DDA0DD%3B%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23DDA0DD%3B%22%3E88%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Etotal%20of%20legs%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E92%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E96%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23FF0000%3B%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A%0D%0A%3Cdiv%3E%3Cfont%20face%3D%22lucida%20sans%20unicode%2C%20lucida%20grande%2C%20sans-serif%22%3Ethere%20are%20more%20pigeons%20than%20dogs.%20%26nbsp%3B%3Cbr%20/%3E%0D%0A1.%20I%20noticed%20that%20there%20are%2036%20heads%20and%2080%20feet.%3Cbr%20/%3E%0D%0A2.%20I%20noticed%20she%20is%20a%20lover%20of%20eye-seeing%20dogs%20and%20homing%20pigeons%26nbsp%3B%3C/font%3E%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%26nbsp%3B%3C/div%3E",
    pdSet: "Feather and Fur - Mary",
    powId: 805784,
    publication:  {
      publicationId: 4308,
    },
    shortAnswer: "the%20answer%20i%20got%20was%2032%20pigeons%20and%204%20dogs.%20I%20did%20the%20table%20and%20that%20helped%20me%20out%20allot%20because%20i%20did%20the%20math%20and%20sorted%20it%20out%20and%20i%20decided%20to%20take%20it%20on%20the%20bottom%20and%20i%20figured%20it%20out.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805784,
      threadId: 691100
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f445",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-20T19:51:39.445Z",
    creator:  {
      creatorId: 237859,
      safeName: "Carty L.",
      username: "cLuchsinger13"
    },
    longAnswer: "%3Cspan%20style%3D%22color%3A%23A52A2A%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3E%3Cstrong%3EIn%20the%20problem%20%26quot%3BFeathers%20and%20fur%26quot%3B%20Xiao%20said%20that%20she%20counted%3Cbr%20/%3E%0D%0Athe%20heads%20and%20the%20legs%2C%2036%20heads%20and%2080%20legs%20and%20so%20in%20made%20a%20chart%20and%20went%20down%20the%20chart%20trying%20to%20solve%20the%20problem%20of%20how%20many%20dog%20and%20pigeons%20there%20%26%238203%3Bare.%20So%26nbsp%3Bfinally%20i%20took%2032%20Pigeons%20and%204%20dogs%20and%20then%20got%2064%20and%20then%20got%2016%20and%20then%20got%20the%2080%20legs.%3C/strong%3E%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%26nbsp%3B%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ccaption%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3EF%3C/span%3E%3C/span%3E%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FFFF%3B%22%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3Eeathers%20%3C/span%3E%3C/span%3E%3C/span%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3Ea%3C/span%3E%3C/span%3E%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FFFF%3B%22%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3End%3C/span%3E%3C/span%3E%3C/span%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3E%26nbsp%3BF%3C/span%3E%3C/span%3E%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FFFF%3B%22%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3Eur%3C/span%3E%3C/span%3E%3C/span%3E%3C/caption%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FFFF%3B%22%3E%3A%29%3C/span%3E%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3A%29%3C/span%3E%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%20rowspan%3D%222%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%2300FFFF%3B%22%3E%3A%29%3C/span%3E%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%20rowspan%3D%222%22%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3A%29%3C/span%3E%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%222%22%20rowspan%3D%222%22%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3EP%3C/span%3E%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FFFF%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3Eigeons%3C/span%3E%3C/span%3E%20%26nbsp%3B%20%26nbsp%3B%3C/span%3E%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%26nbsp%3B%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E%2019%26nbsp%3B%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E18%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E32%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%222%22%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3ED%3C/span%3E%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FFFF%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3Eogs%20%26nbsp%3B%20%26nbsp%3B%20%3C/span%3E%3C/span%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3C/span%3E%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E%20%26nbsp%3B17%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E18%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E4%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%222%22%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3EP%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FFFF%3B%22%3Eigeons%3C/span%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%26nbsp%3BL%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FFFF%3B%22%3Eegs%20%26nbsp%3B%3C/span%3E%3C/span%3E%20%3C/span%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E%2038%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E36%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E64%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%222%22%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3ED%3C/span%3E%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FFFF%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3Eogs%20%3C/span%3E%3C/span%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3EL%3C/span%3E%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FFFF%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3Eegs%20%26nbsp%3B%20%26nbsp%3B%20%3C/span%3E%3C/span%3E%26nbsp%3B%20%3C/span%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E%2068%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E72%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E16%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%20colspan%3D%222%22%3E%3Cspan%20style%3D%22font-size%3A24px%3B%22%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3EA%3C/span%3E%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FFFF%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3Ell%20%3C/span%3E%3C/span%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3EL%3C/span%3E%3C/span%3E%3Cspan%20style%3D%22color%3A%2300FFFF%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3Eegs%20%26nbsp%3B%20%26nbsp%3B%3C/span%3E%3C/span%3E%20%26nbsp%3B%3C/span%3E%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E106%26nbsp%3B%3C/span%3E%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E108%20%26nbsp%3B%20%3C/span%3E%3C/span%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%26nbsp%3B%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%23696969%3B%22%3E%3Cspan%20style%3D%22font-family%3Acomic%20sans%20ms%2Ccursive%3B%22%3E80%20%26nbsp%3B%20%3C/span%3E%3C/span%3E%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%26nbsp%3B%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A%3Cbr%20/%3E%0D%0A%3Cspan%20style%3D%22color%3A%23A52A2A%3B%22%3E%3Cspan%20style%3D%22font-family%3Ageorgia%2Cserif%3B%22%3E%3Cstrong%3EMy%20refletion%20is%20that%20when%20i%20started%20i%20wanted%20to%20give%20up%20so%20much%20that%20i%20was%20just%20playing%20around%20with%20number%20that%20i%20got%2032%20and%204%20and%20then%20i%20said%20how%20about%2032%20pigeons%20and%204%20dogs%20and%20then%20i%20started%20to%20mulitpy%20and%20then%20i%20did%20this....%2032*2%3D64%20and%204*4%3D16%20and%2064+16%3D80%20so%20i%20got%20my%2080%20legs%20and%20my%20heads%20by%2032+4%3D36%20so%20i%20got%20my%2036%20heads%20and%20my%2080%20legs.%3Cbr%20/%3E%0D%0A%26nbsp%3B%3Cbr%20/%3E%0D%0AMy%20reflection%20is%20that%20i%20would%20alway%20ask%20how%20do%20you%20get%2080%20legs%20out%20of%2036%20head%20and%20now%20that%20i%20solved%20it%20now%20i%20know%20that%20you%20can%20get%2080%20legs%20out%20of%2036%20heads.%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0AMy%20relfection%26%2339%3Bs%20is%20that%20when%20i%20got%20so%20close%20it%20seemed%20that%20i%20got%20farther%20away%20from%20the%20answer%20and%20now%20i%20don%26%2339%3Bt%20have%20that%20problem%20because%20i%20solved%20the%20problem%26nbsp%3B%3Cbr%20/%3E%0D%0A%26nbsp%3B%3C/strong%3E%3C/span%3E%3C/span%3E%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0A%26nbsp%3B",
    pdSet: "Feather and Fur - Mary",
    powId: 805303,
    publication:  {
      publicationId: 4308,
    },
    shortAnswer: "Xiao%20has%2032%20Pigeons%20and%204%20dogs.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805303,
      threadId: 691188
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f446",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-20T19:51:52.253Z",
    creator:  {
      creatorId: 239081,
      safeName: "John S.",
      username: "jSutherland13"
    },
    longAnswer: "*there%20was%2032%20pigeons%20and%204%20dogs%20in%20all%20which%20make%2064%20legs%20and%2016%20dogs%20legs.%3Cbr%20/%3E%0D%0Ai%20noticed%20that%20there%20was%204%20dogs%3Cbr%20/%3E%0D%0Ai%20noticed%20there%20was%2032%20pigeons%26nbsp%3B%3Cbr%20/%3E%0D%0Ai%20noticed%20that%20there%20was%2080%20leg%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0Ai%20wonder%20if%20there%20was%20just%20one%20set%20of%20animals%20like%2036%20dogs%20if%20that%20would%20work.%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%3B%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3Edogs%3C/td%3E%0D%0A%09%09%09%3Ctd%3Epigeons%3C/td%3E%0D%0A%09%09%09%3Ctd%3Edog%20legs%3C/td%3E%0D%0A%09%09%09%3Ctd%3Epigeons%20legs%3C/td%3E%0D%0A%09%09%09%3Ctd%3Elegs%20total%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E4%3C/td%3E%0D%0A%09%09%09%3Ctd%3E32%3C/td%3E%0D%0A%09%09%09%3Ctd%3E16%3C/td%3E%0D%0A%09%09%09%3Ctd%3E64%3C/td%3E%0D%0A%09%09%09%3Ctd%3E80%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E36%3C/td%3E%0D%0A%09%09%09%3Ctd%3E0%3C/td%3E%0D%0A%09%09%09%3Ctd%3E246%3C/td%3E%0D%0A%09%09%09%3Ctd%3E0%3C/td%3E%0D%0A%09%09%09%3Ctd%3E246%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A%26nbsp%3B%3Cbr%20/%3E%0D%0Aif%20i%20were%20to%20hint%20my%20friend%20i%20would%20say%20%26quot%3B",
    pdSet: "Feather and Fur - Mary",
    powId: 805316,
    publication:  {
      publicationId: 4308,
    },
    shortAnswer: "there%20was%2032%20pigeons%20and%204%20dogs..",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805316,
      threadId: 691708
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f447",
    clazz:  {
      clazzId: 103670,
      name: "Period 4 Math Literacy"
    },
    createDate: "2013-11-21T18:29:03.070Z",
    creator:  {
      creatorId: 238072,
      safeName: "Hannah Z.",
      username: "hZamboroski13"
    },
    longAnswer: "%26nbsp%3B%0D%0A%3Cdiv%3E%26nbsp%3B%3Cspan%20style%3D%22color%3A%20%234b0082%22%3E%23%20of%20pigeons%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%20%23800080%22%3E%26nbsp%3B%23%20of%20dogs%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%20%234b0082%22%3E%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%23%20of%20legs%3C/span%3E%3Cspan%20style%3D%22color%3A%20%230000ff%22%3E%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%20%234b0082%22%3E%26nbsp%3B%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%20%2340e0d0%22%3E%20%23%20of%20feet%26nbsp%3B%3C/span%3E%3Cspan%20style%3D%22color%3A%20%234b0082%22%3E%26nbsp%3B%26nbsp%3B%26nbsp%3B%26nbsp%3B%20%3C/span%3E%3Cspan%20style%3D%22color%3A%20%2300ff00%22%3ETotal%3C/span%3E%3C/div%3E%0D%0A%26nbsp%3B%0D%0A%0D%0A%3Ctable%20border%3D%220%22%20cellpadding%3D%221%22%20cellspacing%3D%221%22%20style%3D%22width%3A%20500px%22%3E%0D%0A%09%3Ctbody%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E25%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E11%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E50%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E44%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E94%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E26%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E10%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E52%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E42%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E92%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E24%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E12%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E48%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E96%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E28%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E8%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E56%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%23ff0000%22%3E88%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%09%3Ctr%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ffff%22%3E32%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ffff%22%3E4%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ffff%22%3E64%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ffff%22%3E16%3C/span%3E%3C/td%3E%0D%0A%09%09%09%3Ctd%3E%3Cspan%20style%3D%22color%3A%20%2300ffff%22%3E80%3C/span%3E%3C/td%3E%0D%0A%09%09%3C/tr%3E%0D%0A%09%3C/tbody%3E%0D%0A%3C/table%3E%0D%0A%26nbsp%3BAnswer%20is%20in%20the%20color%20tourqoise.%20The%20wrong%20answer%20is%20in%20the%20color%20red.%3Cbr%20/%3E%0D%0A%3Cbr%20/%3E%0D%0AI%20found%20out%20that%20this%20problem%20was%20hard%20to%20solve%20because%20I%20had%20to%20find%20out%20how%20many%20pigoens%20legs%20and%20how%20many%20feet%20there%20are%20of%20dogs.",
    pdSet: "Feather and Fur - Mary",
    powId: 805776,
    publication:  {
      publicationId: 4308,
    },
    shortAnswer: "I%20figured%20out%20that%20there%20are%2032%20pigeons%20and%204%20dogs%20which%20is%2036%20heads%20and%2080%20feet.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805776,
      threadId: 689564
    }
  },
   {
    _id: "53daf47d729e9ef59ba7f448",
    clazz:  {
      clazzId: 103671,
      name: "Period 5 Basic Math"
    },
    createDate: "2013-11-21T20:07:49.210Z",
    creator:  {
      creatorId: 237865,
      safeName: "Dallas W.",
      username: "dWilson13"
    },
    longAnswer: "%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20%26nbsp%3B%20I%20got%204%20puppies%20and%2032%20pigeons%20and%2080%20legs%26nbsp%3BI%20times%20my%20two%20answers%20and%20i%20got%2080%20legs%20.%2032%20pigeons%20and%204%20puppies%20.%20I%20used%20guess%20and%20check%20.%20I%20thought%20this%20was%20a%20easy%20problem%20because%20i%20did%20great%20on%20%26nbsp%3Bthis%20amazing%20problem.%20I%20redid%20my%20work%20for%20the%20real%20answer%20and%20not%20goodbye%20answer%20and%20i%20got%20the%20right%20answer.%20In%20this%20problem%20%2C%20I%20got%20stuck%20when%20i%20was%20solving%20this%20%26nbsp%3Bproblem%20.%26nbsp%3B",
    pdSet: "Feather and Fur - Mary",
    powId: 805811,
    publication:  {
      publicationId: 4308,
    },
    shortAnswer: "i%20came%20up%20by%20times%20there%27s%20answers%2032%20x%202%20%3D64%20%2C4%20x%204%20%3D%2016%20%2C%2064%20x%2016%20%3D%2080%20.",
    status: "SUBMITTED",
    thread:  {
      currentSubmissionId: 805811,
      threadId: 689624
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