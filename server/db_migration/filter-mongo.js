/*
 * We are using mongoose-data-seed to seed our test database
 * When you export data to json from Mongo it looks like the data listed below
 * Seed data cannot have the "$oid" or "$date" as an object
 * The function below updates the mongo export format to proper seeding format.
 */

let data = [{
  "_id": {
    "$oid": "53e11942b48b12793f000a5f"
  },
  "comments": [],
  "coordinates": "node-6 0 0 node-11 0 1",
  "createDate": {
    "$date": "2014-08-05T17:49:54.306Z"
  },
  "createdBy": {
    "$oid": "53d9a577729e9ef59ba7f118"
  },
  "isTrashed": false,
  "submission": {
    "$oid": "53e1156db48b12793f000430"
  },
  "taggings": [{
    "$oid": "53e1194bb48b12793f000a62"
  }],
  "text": "looking at my answer it seems reasonable because it works out with the asked problem. ",
  "workspace": {
    "$oid": "53e1156db48b12793f000442"
  }
}, {
  "_id": {
    "$oid": "53e11b38b48b12793f000ab7"
  },
  "comments": [],
  "coordinates": "node-17 0 0 node-19 0 173",
  "createDate": {
    "$date": "2014-08-05T17:58:16.595Z"
  },
  "createdBy": {
    "$oid": "53d9a577729e9ef59ba7f118"
  },
  "isTrashed": false,
  "submission": {
    "$oid": "53e1156db48b12793f000437"
  },
  "taggings": [{
    "$oid": "53e11b5eb48b12793f000abb"
  }],
  "text": "I notice that there is 36 heads and 80 legs                                                          I notice that Xiao is a Chinese name                                                                    I wonder if there is less dogs than pigeons.                                                                                                                                 ",
  "workspace": {
    "$oid": "53e1156db48b12793f000442"
  }
}];

const udpateIds = function (dat) {
  let copy = dat.slice();
  copy.forEach((obj) => {
    for (let key of Object.keys(obj)) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        if (obj[key].$oid) {
          obj[key] = obj[key].$oid
        } else if (obj[key].$date) {
          obj[key] = obj[key].$date;
        }
      } else if (Array.isArray(obj[key])) {
       obj[key] = obj[key].map((el) => {
         if (typeof el === 'object') {
           return el.$oid;
         } else {
           return el;
         }
       })
      } else {
        if (key === "shortAnswer" || key === "longAnswer") {
          obj[key] = escape(obj[key]);
        }
      }
    }
  })
  return copy;
}

let output = udpateIds(data);

console.log(output);
