import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class InputStateService extends Service {
  @tracked states = {}; // Main options per id
  @tracked subStates = {}; // Sub-options per id and option value
  @tracked listState = {}; // List state per id

  // Create main options for a given id
  createStates(id, options) {
    const selectedOption = options.find((opt) => opt.default) || options[0];
    const newOptions = {
      options,
      selectedOption,
    };

    this.states = { ...this.states, [id]: newOptions };
  }

  // Create sub-options for a given id and option value, with the persist option
  createSubStates(id, optionValue, subOptions, config, buildSubFilter) {
    if (!this.states[id]) {
      throw new Error(`No options found for id: ${id}`);
    }

    // Validate that the selected main option exists
    if (!this.states[id].options.some((opt) => opt.value === optionValue)) {
      throw new Error(`No subOption found for value: ${optionValue}`);
    }

    // Construct new subState
    const newSubState = {
      subOptions,
      config,
      selections: subOptions
        .filter((subOpt) => subOpt.default)
        .map((subOpt) => subOpt.value),
      buildSubFilter,
    };

    // Update the tracked `subStates` property once
    this.subStates = {
      ...this.subStates,
      [`${id}_${optionValue}`]: newSubState,
    };
  }

  // Get all options for a given id
  getOptions(id) {
    return this.states[id]?.options || [];
  }

  // Get value array for the options
  getOptionValues(id) {
    return this.getOptions(id).map((option) => option.value);
  }

  getSelection(id) {
    return this.states[id]?.selectedOption || null;
  }

  getSelectionValue(id) {
    return this.getSelection(id)?.value || null;
  }

  // Get sub-options for the currently selected main option (taking listState and persist into account)
  getSubOptions(id) {
    const currentState = this.states[id];
    if (!currentState || !currentState.selectedOption) {
      return [];
    }

    const subState =
      this.subStates[`${id}_${currentState.selectedOption.value}`];
    if (!subState) return [];

    const { listBased } = subState.config;
    const currentListState = this.listState[id] || [];

    // If list-based and no list state, return an empty array
    if (listBased && currentListState.length === 0) {
      return [];
    }

    return subState.subOptions || [];
  }

  // Get value array for the sub-options of the currently selected main option
  getSubOptionValues(id) {
    return this.getSubOptions(id).map((subOpt) => subOpt.value);
  }

  getSubSelections(id) {
    const subState = this.subStates[`${id}_${this.getSelectionValue(id)}`];
    return subState ? subState.selections : [];
  }

  // Set the current selection for the main option and handle persist for sub-options
  setSelection(id, value) {
    const state = this.states[id];
    if (!state) {
      throw new Error(`No main options found for id: ${id}`);
    }

    const selectedOption = state.options.find((opt) => opt.value === value);
    if (!selectedOption) {
      throw new Error(`Option with value ${value} not found for id: ${id}`);
    }

    // Update sub-state (persist logic)
    const subState = this.subStates[`${id}_${selectedOption.value}`];
    let updatedSubState;
    if (subState && subState.config && !subState.config.persist) {
      updatedSubState = {
        ...subState,
        selections: subState.subOptions
          .filter((subOpt) => subOpt.default)
          .map((subOpt) => subOpt.value),
      };
    }

    this.states = { ...this.states, [id]: { ...state, selectedOption } };

    // Reset list state for the new selection,
    this.listState = { ...this.listState, [id]: [] };

    if (updatedSubState) {
      this.subStates = {
        ...this.subStates,
        [`${id}_${selectedOption.value}`]: updatedSubState,
      };
    }
  }

  // Get current list state for a given id
  getListState(id) {
    return this.listState[id] || [];
  }

  // Set the list state for a given id
  setListState(id, listState) {
    // Use a new array for list state and update in a single step
    this.listState = { ...this.listState, [id]: listState };
  }

  // Set sub-option selection for a given id and option value
  // value is going to be true or false
  // if multiSelect is true, we will add or remove the value from the selections array (add if value is true, remove otherwise)
  // if multiSelect is false, we will set the selections array to the new value if true, or empty if false
  setSubSelection(id, optionValue, value) {
    const selectedValue = this.getSelectionValue(id);
    const subState = this.subStates[`${id}_${selectedValue}`];
    if (!subState) {
      throw new Error(
        `No sub-options found for id: ${id}, option: ${selectedValue}}`
      );
    }

    const { multiSelect } = subState.config;
    let newSelections;
    if (multiSelect) {
      newSelections = value
        ? [...subState.selections, optionValue]
        : subState.selections.filter((val) => val !== optionValue);
    } else {
      newSelections = value ? [optionValue] : [];
    }

    this.subStates = {
      ...this.subStates,
      [`${id}_${selectedValue}`]: { ...subState, selections: newSelections },
    };
  }

  // Clear all selections and states
  clear() {
    this.states = {};
    this.subStates = {};
    this.listState = {};
  }

  getFilter(id) {
    let filter = {};

    // Get the main state for the given id
    const state = this.states[id];
    if (!state) {
      throw new Error(`No main options found for id: ${id}`);
    }

    // Get the currently selected main option
    const selectedMainOption = state.selectedOption;
    if (selectedMainOption && selectedMainOption.buildFilter) {
      // Call the buildFilter function for the selected main option
      const mainFilter = selectedMainOption.buildFilter(selectedMainOption); // Use the selected option object
      filter = { ...filter, ...mainFilter }; // Spread into filter
    }

    // Get substate and build sub-filter if applicable
    const selectedValue = this.getSelectionValue(id);
    const subState = this.subStates[`${id}_${selectedValue}`];
    if (subState && subState.buildSubFilter) {
      // Call the buildSubFilter function with the substate selections
      const subFilter = subState.buildSubFilter(subState.selections); // Use selected values
      filter = { ...filter, ...subFilter }; // Spread into filter
    }

    return filter;
  }
}
