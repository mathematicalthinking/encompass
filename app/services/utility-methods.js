import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class UtilityService extends Service {
  @service currentUser;

  isNullOrUndefined(val) {
    return val === null || val === undefined;
  }

  isNonEmptyArray(val) {
    return Array.isArray(val) && val.length > 0;
  }

  isNonEmptyString(val) {
    return typeof val === 'string' && val.length > 0;
  }

  // Check if value is a non-empty object (excluding arrays and functions)
  isNonEmptyObject(val) {
    return (
      val &&
      typeof val === 'object' &&
      !Array.isArray(val) &&
      val !== null &&
      Object.keys(val).length > 0
    );
  }

  isValidMongoId(val) {
    const checkForHexRegExp = /^[0-9a-fA-F]{24}$/;
    return checkForHexRegExp.test(val);
  }

  // Get the ID of a belongs-to relationship
  getBelongsToId(record, relationshipName) {
    if (
      !this.isNonEmptyObject(record) ||
      !this.isNonEmptyString(relationshipName)
    ) {
      return null;
    }

    if (!('eachRelationship' in record)) {
      return null;
    }

    let hasRequestedRelationship = false;

    record.eachRelationship((name) => {
      if (name === relationshipName) {
        hasRequestedRelationship = true;
      }
    });

    if (!hasRequestedRelationship) {
      return null;
    }

    const ref = record.belongsTo(relationshipName);
    if (ref) {
      return ref.id();
    }

    return null;
  }

  // Get the IDs of a has-many relationship
  getHasManyIds(record, relationshipName) {
    if (
      !this.isNonEmptyObject(record) ||
      !this.isNonEmptyString(relationshipName)
    ) {
      return [];
    }

    if (!('eachRelationship' in record)) {
      return [];
    }

    let hasRequestedRelationship = false;

    record.eachRelationship((name) => {
      if (name === relationshipName) {
        hasRequestedRelationship = true;
      }
    });

    if (!hasRequestedRelationship) {
      return [];
    }

    const ref = record.hasMany(relationshipName);
    if (ref) {
      return ref.ids();
    }

    return [];
  }

  // Filter records by belongs-to relationship ID
  filterByBelongsToId(records, relationshipName, targetId) {
    if (
      !Array.isArray(records) ||
      !this.isNonEmptyString(relationshipName) ||
      !targetId
    ) {
      return [];
    }

    return records.filter((record) => {
      if (!record) {
        return false;
      }
      const id = this.getBelongsToId(record, relationshipName);
      return id === targetId;
    });
  }

  // Find a record by belongs-to relationship ID
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
  }

  extractHoursMinsSecondsFromMs(ms) {
    if (!(ms > 0)) {
      return [0, 0, 0];
    }

    const fullHours = Math.floor(ms / (1000 * 60 * 60));
    const fullMinutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const fullSeconds = Math.floor((ms % (1000 * 60)) / 1000);

    return [fullHours, fullMinutes, fullSeconds];
  }

  // Extract milliseconds from a time string in the format "HH:MM:SS"
  extractMsFromTimeString(timeString) {
    if (typeof timeString !== 'string') {
      return null;
    }

    const split = timeString.split(':');
    if (split.length !== 3) {
      return null;
    }

    const hours = parseInt(split[0], 10);
    const minutes = parseInt(split[1], 10);
    const seconds = parseInt(split[2], 10);

    if (hours >= 0 && minutes >= 0 && seconds >= 0) {
      return hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
    }

    return null;
  }

  // Get a time string in the format "HH:MM:SS" from milliseconds
  getTimeStringFromMs(ms) {
    const [hours, minutes, seconds] = this.extractHoursMinsSecondsFromMs(ms);
    const displayHours = hours < 10 ? `0${hours}` : `${hours}`;
    const displayMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const displaySeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${displayHours}:${displayMinutes}:${displaySeconds}`;
  }
}
