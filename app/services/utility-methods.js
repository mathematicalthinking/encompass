/*global _:false */
import Service from '@ember/service';







export default Service.extend({
  isNullOrUndefined(val) {
    return _.isNull(val) || _.isUndefined(val);
  },

  isNonEmptyArray(val) {
    return _.isArray(val) && !_.isEmpty(val);
  },

  isNonEmptyString(val) {
    return _.isString(val) && val.length > 0;
  },
  // not array or function
  isNonEmptyObject(val) {
    return _.isObject(val) && !_.isArray(val) && !_.isFunction(val) && !_.isEmpty(val);
  },
  isValidMongoId(val) {
    let checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    return checkForHexRegExp.test(val);
  },
  getBelongsToId(record, relationshipName) {
    if (!this.isNonEmptyObject(record) || !this.isNonEmptyString(relationshipName)) {
      return null;
    }

    let hasEachRelationship = 'eachRelationship' in record;
    if (!hasEachRelationship) {
      return null;
    }

    let hasRequestedRelationship = false;

    record.eachRelationship((name, descriptor) => {
      if (name === relationshipName) {
        hasRequestedRelationship = true;
      }
    });
    if (!hasRequestedRelationship) {
      return null;
    }

    let ref = record.belongsTo(relationshipName);

    if (ref) {
      return ref.id();
    }

    return null;
  },
  getHasManyIds(record, relationshipName) {
    if (!this.isNonEmptyObject(record) || !this.isNonEmptyString(relationshipName)) {
      return [];
    }
    let hasEachRelationship = 'eachRelationship' in record;
    if (!hasEachRelationship) {
      return [];
    }

    let hasRequestedRelationship = false;

    record.eachRelationship((name, descriptor) => {
      if (name === relationshipName) {
        hasRequestedRelationship = true;
      }
    });
    if (!hasRequestedRelationship) {
      return [];
    }

    let ref = record.hasMany(relationshipName);
    if (ref) {
      return ref.ids();
    }
    return [];
  },
  filterByBelongsToId(records, relationshipName, targetId) {
    if (!records || !relationshipName || !targetId) {
      return [];
    }

    return records.filter((record) => {
      if (!record) {
        return false;
      }
      let id = this.getBelongsToId(record, relationshipName);

      return id === targetId;
    });
  },

  findByBelongsToId(records, relationshipName, targetId) {
    if (!records || !relationshipName || !targetId) {
      return;
    }

    return records.find((record) => {
      if (!record) {
        return false;
      }
      let id = this.getBelongsToId(record, relationshipName);

      return id === targetId;
    });
  },

  extractHoursMinsSecondsFromMs(ms) {
    // takes ms as Number and returns [hours, mins, seconds]
    // seconds are rounded down
    if (!ms > 0) {
      return [0, 0, 0];
    }
    let fullHours = ms * (0.001) * (1 / 60) * (1 / 60);

    let hourStr = fullHours.toString();
    let decimalIx = hourStr.indexOf('.');

    if (decimalIx === -1) {
      // integer
      return [fullHours, 0, 0];
    }

    let minStr = hourStr.slice(decimalIx);
    let fullMinutes = Number(minStr) * 60;

    let fullMinStr = fullMinutes.toString();
    decimalIx = fullMinStr.indexOf('.');

    if (decimalIx === -1) {
      // integer minutes
      return [Math.floor(fullHours), fullMinutes, 0];
    }

    let fullSeconds = Number(fullMinStr.slice(decimalIx));

    return [Math.floor(fullHours), Math.floor(fullMinutes), Math.floor(fullSeconds * 60)];

  },
  extractMsFromTimeString(timeString) {
    // expect format of hh:mm:ss
    if (typeof timeString !== 'string') {
      return null;
    }

    let split = timeString.split(':');

    if (split.length !== 3) {
      return null;
    }

    let hours = parseInt(split[0], 10);
    let minutes = parseInt(split[1], 10);
    let seconds = parseInt(split[2], 10);

    if (hours >= 0 && minutes >= 0 && seconds >= 0) {
      return (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);
    }

    return null;

  },
  getTimeStringFromMs(ms) {
    let [hours, minutes, seconds] = this.extractHoursMinsSecondsFromMs(ms);
    let displayHours = hours < 10 ? `0${hours}` : `${hours}`;
    let displayMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    let displaySeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${displayHours}:${displayMinutes}:${displaySeconds}`;

  },
});