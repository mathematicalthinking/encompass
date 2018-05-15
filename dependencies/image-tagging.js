(function() {
/**
 * Usage:
 *  Declare a new ImageTagging object
 *    ie. `var imageTagging = new ImageTagging();`
 *
 *  To set the default values for properties such as
 *  the tags' id prefix, border, background color, etc.
 *  pass an object to the constructor with properties:
 *    `idPrefix`, `resizeHandleWidth`, `minHeight`,
 *    `maxHeight`, `minWidth`, `maxWidth`, `border`,
 *    `backgroundColor`, `tagsListContainer`
 *    ie. `new ImageTagging({ minHeight: 20, maxHeight: 40 });
 *  Any of these which are not declared will use the
 *  default values already supplied. Note that all
 *  dimensions use by ImageTagging are in pixels.
 *
 *  To target specific images, add the property:
 *    `targetContainer`
 *  whose value is the id of the container to which
 *  image tags can be applied. If this property is not
 *  used, every image with an id in the page before the
 *  ImageTagging object is created will be a target.
 *    ie. `new ImageTagging({ targetContainer: 'image-div' });
 *
 *  The background color and border can be set at any time
 *  using `setBorder()` and `setBackgroundColor()`, passing
 *  the new value as a parameter. Calling these functions
 *  with a second parameter set to `true` will apply the
 *  changes to any existing tags in the page.
 *
 *  The `tagsListContainer` property is used to output a
 *  list of notes about the existing tags which, when
 *  the mouse is placed over them, will cause the tag
 *  to appear on the image. Moving the mouse away from
 *  the list will cause the tags to be hidden again. By
 *  clicking on a note in the list, the corresponding
 *  tag will become editable until anywhere else on the
 *  window is clicked.
 */
var ImageTagging = function(args) {
  'use strict';

  args = args || {};

  var tagging = this,
    _tags = [],
    _notes = [],
    _tagIdPrefix = args.idPrefix || 'img-tag-',
    _tagListIdPrefix = args.listIdPrefix || 'tag-list-',
    _tagNoteIdSuffix = '-note',
    _tagListContainer = args.tagsListContainer || '',
    _offY = 0, _offX = 0, _prevX = 0, _prevY = 0,
    _resizeHandleWidth = args.resizeHandleWidth ? parseInt(args.resizeHandleWidth, 10) : 10,
    _minHeight = args.minHeight ? parseInt(args.minHeight, 10) : 40,
    _minWidth = args.minWidth ? parseInt(args.minWidth, 10) : 40,
    _maxHeight = args.maxHeight ? parseInt(args.maxHeight, 10) : 400,
    _maxWidth = args.maxWidth ? parseInt(args.maxWidth, 10) : 400,
    _backgroundColor = args.backgroundColor || 'rgba(0, 0, 0, 0.0)',
    _border = args.border || '3px solid #3476CE',
    _currentlyResizingOrPlacing = false,
    _currentlyEditing = -1,
    _allowNotes = true,
    _disabled = false,
    _onSave = function() { /* empty until a function is provided */ },
    targetImages,
    taggingContainer,
    containerX,
    containerY,

NoteInput = function() {
  var input = this,
    _text,
    _maxWidth = 400,
    _textMaxWidth = _maxWidth,
    _textIsFocused = false,

    TEXT_NODE = 3,
    ENTER = 13;

  function _getTextNode() {
    var i;

    for (i = 0; i < _text.childNodes.length; i++) {
      if (_text.childNodes[i].nodeType === TEXT_NODE) {
        return _text.childNodes[i];
      }
    }
    return '';
  }

  function _textKeyPress(event) {
    var charCode;

    event = event || window.event;
    charCode = event.keyCode || event.which;
    charCode = parseInt(charCode, 10);

    if (charCode === ENTER) {
      _stopEditing();
    }

    return false;
  }

  function _textMouseUp(event) {
    event.stopPropagation();

    if (!_textIsFocused) {
      _textIsFocused = true;
      _text.addEventListener('keypress', _textKeyPress, false);
      _text.focus();
      _text.style.outline = 'none';
    }
  }

  this.init = function(id, styles, text, onEnterKey) {
    var style;

    _text = document.createElement('div');
    _text.id = id;
    for (style in styles) {
      if (styles.hasOwnProperty(style)) {
        _text.style[style] = styles[style];
      }
    }

    _text.style.whiteSpace = 'pre-wrap';
    _text.style.wordWrap = 'break-word';
    _text.appendChild(document.createTextNode(''));
    taggingContainer.appendChild(_text);
    input.setValue(text);
  };

  this.placeAt = function(left, top) {
    _text.style.left = parseInt(left, 10) + 'px';
    _text.style.top = parseInt(top, 10) + 'px';
  };

  this.setBorder = function(border) {
    _text.style.border = border;
  };

  this.allowEdit = function() {
    _text.tabIndex = -1;
    _text.contentEditable = true;
    _text.addEventListener('mouseup', _textMouseUp, false);
  };

  this.preventEdit = function() {
    _text.tabIndex = 0;
    _textIsFocused = false;
    _text.contentEditable = false;
    _text.removeEventListener('mouseup', _textMouseUp, false);
  };

  this.getValue = function() {
    return _getTextNode().nodeValue;
  };

  this.setValue = function(text) {
    var textNode = _getTextNode();
    if (text === '') {
      textNode.nodeValue = 'a';
      _text.style.minHeight = parseInt(_text.clientHeight, 10) + 'px';
    } else {
      _text.style.minHeight = null;
    }
    textNode.nodeValue = text;
  };

  this.getLength = function() {
    return _getTextNode().nodeValue.length;
  };

  this.destroy = function() {
    _text.parentNode.removeChild(_text);
  };
};

  function _createTagOnEvent(event) {
    tagging.eventCreateTag(event);
  }

  // set up the event handlers immediately
  (function() {
    var images, i;
    targetImages = [];
    if (args.targetContainer) {
      taggingContainer = document.getElementById(args.targetContainer);
      images = taggingContainer.getElementsByTagName('img');
      for (i = 0; i < images.length; i++) {
        addEventListener(images[i]);
      }
    }

    function addEventListener(img) {
      if (!img.id) {
        return;
      }
      targetImages[targetImages.length] = img;
      img.addEventListener('mousedown', _createTagOnEvent, false);
    }
  }());

  /**
   * Private function _findPosition()
   * Returns the x and y coordinates of a node within the page
   */
  function _findPosition(node) {
    var posX = 0, posY = 0;
    if (node.offsetParent) {
      while (node.offsetParent) {
        posX += node.offsetLeft;
        posY += node.offsetTop;
        node = node.offsetParent;
      }
    } else if (node.x) {
      posX = node.x;
      posY = node.y;
    }
    return [ posX, posY ];
  }

  /**
   * Private function _findScrollPosition()
   * Returns the scroll offset of the node
   */
  function _findScrollPosition(node) {
    var scrollX = node.scrollLeft,
      scrollY = node.scrollTop;
    while (node.parentElement) {
      node = node.parentElement;
      if (node === document.body) {
        break;
      }
      scrollX += node.scrollLeft;
      scrollY += node.scrollTop;
    }
    scrollX += document.documentElement.scrollLeft;
    scrollY += document.documentElement.scrollTop;
    return [ scrollX, scrollY ];
  }

  /**
   * Private function _getCoordinates()
   * Returns the x and y coordinates of a click event within an image
   * Coordinates are relative to the position of the image
   */
  function _getCoordinates(event, image) {
    var posX = 0, posY = 0,
      pos = _findPosition(image),
      imgX = pos[0], imgY = pos[1];

    if (!event) {
      event = window.event;
    }
    if (event.pageX || event.pageY) {
      posX = event.pageX;
      posY = event.pageY;
    } else if (event.clientX || event.clientY) {
      posX = event.clientX + document.documentElement.scrollLeft;
      posY = event.clientY + document.documentElement.scrollTop;
    }
    posX = posX - imgX;
    posY = posY - imgY;

    return [posX, posY];
  }

  /**
   * Private function _imageTrueCoords()
   * Returns the x and y coordinates of an image within its parent
   * taking into account scroll position of all ancestors
   */
  function _imageTrueCoords(image) {
    var imageCoords = _findPosition(image),
      containerCoords = _findPosition(taggingContainer),
      scrollCoords = _findScrollPosition(taggingContainer),
      imageLeft = imageCoords[0] - containerCoords[0] - scrollCoords[0],
      imageTop = imageCoords[1] - containerCoords[1] - scrollCoords[0],
      coords = {left: imageLeft, top: imageTop};
    return coords;
  }

  /**
   * Private function _getTagId()
   * Returns the internal id of the tag associated with a tag element
   */
  function _getTagId(tagElement) {
    return parseInt(tagElement.id.replace(_tagIdPrefix, ''), 10);
  }

  /**
   * Private function _saveTag()
   * Records the given tag element's coordinates, dimensions, and notes
   */
  function _saveTag(tagElement) {
    var id = _getTagId(tagElement),
      tagInfo = _tags[id],
      imageCoords = _imageTrueCoords(document.getElementById(tagInfo.parent));

    if (!tagInfo) {
      return;
    }

    // shift the tag coordinates to be relative to the image
    tagInfo.coords.left = parseInt(tagElement.style.left, 10) - imageCoords.left;
    tagInfo.coords.top = parseInt(tagElement.style.top, 10) - imageCoords.top;
    tagInfo.size.width = parseInt(tagElement.style.width, 10);
    tagInfo.size.height = parseInt(tagElement.style.height, 10);

    if (tagInfo.isDirty) {
      _onSave(tagInfo.id);
    }
  }

  /**
   * Private function _getImageFor()
   * Returns the image element to which the given tag is associated
   */
  function _getImageFor(tag) {
    var id = _getTagId(tag);

    return document.getElementById(_tags[id].parent);
  }

  /**
   * Private function _enforceImageBoundaries()
   * Makes sure a tag is completely within an image, shifting or resizing if necessary
   */
  function _enforceImageBoundaries(image, tag, resizing) {
    var imageCoords = _imageTrueCoords(image),
      imageLeft = imageCoords.left,
      imageTop = imageCoords.top,
      imageRight = imageLeft + image.clientWidth,
      imageBottom = imageTop + image.clientHeight,
      tagWidth = parseInt(tag.style.width, 10),
      tagHeight = parseInt(tag.style.height, 10),
      tagLeft = parseInt(tag.style.left, 10),
      tagTop = parseInt(tag.style.top, 10),
      tagRight = tagLeft + tagWidth,
      tagBottom = tagTop + tagHeight,
      borderWidth = parseInt(tag.style.borderWidth, 10),
      changed = false,
      tagId = _getTagId(tag);
      resizing = resizing !== undefined ? resizing : false;

    if (tagLeft < imageLeft) {
      if (resizing) {
        tagWidth = tagWidth - (imageLeft - tagLeft);
      }
      tagLeft = imageLeft;
      changed = true;
    }
    if (tagTop < imageTop) {
      if (resizing) {
        tagHeight = tagHeight - (imageTop - tagTop);
      }
      tagTop = imageTop;
      changed = true;
    }

    if (tagRight > imageRight) {
      if (tagLeft === imageLeft) {
        tagWidth = image.clientWidth;
      } else if (resizing) {
        tagWidth = tagWidth - (tagRight - imageRight);
      } else if (!resizing) {
        tagLeft = tagLeft - (tagRight - imageRight);
      }
      changed = true;
    }
    if (tagBottom > imageBottom) {
      if (tagTop === imageTop) {
        tagHeight = image.clientHeight;
      } else if (resizing) {
        tagHeight = tagHeight - (tagBottom - imageBottom);
      } else if (!resizing) {
        tagTop = tagTop - (tagBottom - imageBottom);
      }
      changed = true;
    }

    tag.style.width = tagWidth + 'px';
    tag.style.height = tagHeight + 'px';
    tag.style.left = tagLeft + 'px';
    tag.style.top = tagTop + 'px';

    if (_allowNotes) {
      _notes[tagId].placeAt(tagLeft, (tagTop + tagHeight + borderWidth));
    }

    return changed;
  }

  /**
   * Private function _stopEditing()
   * Causes the active tag to no longer be able to be changed
   */
  function _stopEditing(event) {
    if (_currentlyEditing === -1) {
      return;
    }

    var tmpId = _currentlyEditing,
      tagListItem,
      note;
    event = event || window.event;

    if (event.target.id !== _tagIdPrefix + tmpId) {
      if (_currentlyResizingOrPlacing) {
        window.removeEventListener('mousemove', _mouseMove, true);
        _currentlyResizingOrPlacing = false;
        return;
      }
    } else {
      _currentlyResizingOrPlacing = false;
    }

    window.removeEventListener('mouseup', _stopEditing, false);
    _currentlyEditing = -1;

    if (_allowNotes) {
      note = _notes[tmpId];

      if (_tagListContainer) {
        tagListItem = document.getElementById(_tagListIdPrefix + tmpId);
        // make sure we set the text, not the innerHTML, to prevent any code being injected
        tagListItem.childNodes[0].nodeValue = note.getValue();
      }
      _tags[tmpId].note = note.getValue();
      note.preventEdit();
    }

    tagging.removeTag(tmpId);
  }

  /**
   * Private function _drag()
   * Move the active tag to follow the dragged mouse pointer
   */
  function _drag(e) {
    var tag = e.target,
      eventY = e.clientY - containerY,
      eventX = e.clientX - containerX,
      oldTop = tag.style.top,
      oldLeft = tag.style.left;

    tag.style.top = (eventY - _offY) + 'px';
    tag.style.left = (eventX - _offX) + 'px';

    if (oldTop !== tag.style.top || oldLeft !== tag.style.left) {
      tagging.setDirty(tag);
    }

    _enforceImageBoundaries(_getImageFor(tag), tag, false);
  }

  /**
   * Private function _resize_n()
   * Increase or decrease the active tag's height by shifting the
   * position of its top border
   */
  function _resize_n(e) {
    var tag = e.target,
      diff = (_prevY - e.clientY),
      eventY = e.clientY - containerY,
      height = parseInt(tag.style.height, 10),
      top = parseInt(tag.style.top, 10),
      newHeight;

    if (height === _maxHeight && (diff > 0 || eventY < top)) {
      return;
    }
    if (height === _minHeight && (diff < 0 || eventY > top + _resizeHandleWidth)) {
      return;
    }

    newHeight = height + diff;
    if (newHeight < _minHeight) {
      diff = diff - (newHeight - _minHeight);
      newHeight = _minHeight;
    } else if (newHeight > _maxHeight) {
      diff = diff - (newHeight - _maxHeight);
      newHeight = _maxHeight;
    }

    if (newHeight !== height || (top - diff) !== top) {
      tagging.setDirty(tag);
      tag.style.height = newHeight + 'px';
      tag.style.top = (top - diff) + 'px';
      if (!_enforceImageBoundaries(_getImageFor(tag), tag, true)) {
        _prevY = e.clientY;
        _offY = eventY - (top - diff);
      }
    }
  }

  /**
   * Private function _resize_s()
   * Increase or decrease the active tag's height by shifting the
   * position of its bottom border
   */
  function _resize_s(e) {
    var tag = e.target,
      diff = (_prevY - e.clientY),
      eventY = e.clientY - containerY,
      height = parseInt(tag.style.height, 10),
      top = parseInt(tag.style.top, 10),
      bottom = top + height,
      newHeight;

    if (height === _maxHeight && (diff < 0 || eventY > bottom)) {
      return;
    }
    if (height === _minHeight && (diff > 0 || eventY < bottom - _resizeHandleWidth)) {
      return;
    }

    newHeight = height - diff;
    if (newHeight < _minHeight) {
      diff = diff - (newHeight - _minHeight);
      newHeight = _minHeight;
    } else if (newHeight > _maxHeight) {
      diff = diff - (newHeight - _maxHeight);
      newHeight = _maxHeight;
    }

    if (height !== newHeight) {
      tagging.setDirty(tag);
      tag.style.height = newHeight + 'px';
      if (!_enforceImageBoundaries(_getImageFor(tag), tag, true)) {
        _offY = eventY - top;
        _prevY = e.clientY;
      }
    }
  }

  /**
   * Private function _resize_e()
   * Increase or decrease the active tag's width by shifting the
   * position of its right border
   */
  function _resize_e(e) {
    var tag = e.target,
      diff = (_prevX - e.clientX),
      eventX = e.clientX - containerX,
      width = parseInt(tag.style.width, 10),
      left = parseInt(tag.style.left, 10),
      right = left + width,
      newWidth;

    if (width === _maxWidth && (diff < 0 || eventX > right)) {
      return;
    }
    if (width === _minWidth && (diff > 0 || eventX < right - _resizeHandleWidth)) {
      return;
    }

    newWidth = width - diff;
    if (newWidth < _minWidth) {
      diff = diff - (newWidth - _minWidth);
      newWidth = _minWidth;
    } else if (newWidth > _maxWidth) {
      diff = diff - (newWidth - _maxWidth);
      newWidth = _maxWidth;
    }

    if (width !== newWidth) {
      tagging.setDirty(tag);
      tag.style.width = newWidth + 'px';
      if (!_enforceImageBoundaries(_getImageFor(tag), tag, true)) {
        _offX = eventX - left;
        _prevX = e.clientX;
      }
    }
  }

  /**
   * Private function _resize_w()
   * Increase or decrease the active tag's width by shifting the
   * position of its left border
   */
  function _resize_w(e) {
    var tag = e.target,
      diff = (_prevX - e.clientX),
      eventX = e.clientX - containerX,
      width = parseInt(tag.style.width, 10),
      left = parseInt(tag.style.left, 10),
      newWidth;

    if (width === _maxWidth && (diff > 0 || eventX < left)) {
      return;
    }
    if (width === _minWidth && (diff < 0 || eventX > left + _resizeHandleWidth)) {
      return;
    }

    newWidth = width + diff;
    if (newWidth < _minWidth) {
      diff = diff - (newWidth - _minWidth);
      newWidth = _minWidth;
    } else if (newWidth > _maxWidth) {
      diff = diff - (newWidth - _maxWidth);
      newWidth = _maxWidth;
    }

    if (width !== newWidth || left !== (left - diff)) {
      tagging.setDirty(tag);
      tag.style.width = newWidth + 'px';
      tag.style.left = (left - diff) + 'px';
      if (!_enforceImageBoundaries(_getImageFor(tag), tag, true)) {
        _offX = eventX - (left - diff);
        _prevX = e.clientX;
      }
    }
  }

  /**
   * Private function _resize_nw()
   * Increase or decrease the active tag's width and/or height
   * by shifting the positions of its left and top borders
   */
  function _resize_nw(e) {
    _resize_n(e);
    _resize_w(e);
  }

  /**
   * Private function _resize_ne()
   * Increase or decrease the active tag's width and/or height
   * by shifting the positions of its right and top borders
   */
  function _resize_ne(e) {
    _resize_n(e);
    _resize_e(e);
  }

  /**
   * Private function _resize_se()
   * Increase or decrease the active tag's width and/or height
   * by shifting the positions of its right and bottom borders
   */
  function _resize_se(e) {
    _resize_s(e);
    _resize_e(e);
  }

  /**
   * Private function _resize_sw()
   * Increase or decrease the active tag's width and/or height
   * by shifting the positions of its left and bottom borders
   */
  function _resize_sw(e) {
    _resize_s(e);
    _resize_w(e);
  }

  /**
   * Private function _setCursor()
   * Set the active tag's cursor style based on the cursor's position within the tag
   */
  function _setCursor(event) {
    var tag, offsetY, offsetX, height, width, coords, scroll;

    event = event || window.event;
    tag = event.target;

    coords = _findPosition(tag);
    scroll = _findScrollPosition(taggingContainer);

    offsetY = event.clientY - (coords[1] - scroll[1]);
    offsetX = event.clientX - (coords[0] - scroll[0]);
    height = parseInt(tag.style.height, 10);
    width = parseInt(tag.style.width, 10);

    if (offsetY <= _resizeHandleWidth && offsetX <= _resizeHandleWidth) {
      tag.style.cursor = 'nw-resize';
    } else if (offsetY >= (height - 5) && offsetX <= _resizeHandleWidth) {
      tag.style.cursor = 'sw-resize';
    } else if (offsetY <= _resizeHandleWidth && offsetX >= (width - _resizeHandleWidth)) {
      tag.style.cursor = 'ne-resize';
    } else if (offsetY >= (height - _resizeHandleWidth) && offsetX >= (width - _resizeHandleWidth)) {
      tag.style.cursor = 'se-resize';
    } else if (offsetY <= _resizeHandleWidth) {
      tag.style.cursor = 'n-resize';
    } else if (offsetY >= (height - _resizeHandleWidth)) {
      tag.style.cursor = 's-resize';
    } else if (offsetX <= _resizeHandleWidth) {
      tag.style.cursor = 'w-resize';
    } else if (offsetX >= (width - _resizeHandleWidth)) {
      tag.style.cursor = 'e-resize';
    } else {
      tag.style.cursor = 'move';
    }
    event.stopPropagation();
  }

  /**
   * Private function _mouseMove()
   * Performs the correct action based on where the mouse is within the active tag
   */
  function _mouseMove(event) {
    var tag, height, width, containerCoords, scroll;

    event = event || window.event;
    tag = event.target;
    height = parseInt(tag.style.height, 10);
    width = parseInt(tag.style.width, 10);

    if (tag.id !== _tagIdPrefix + _currentlyEditing) {
      return;
    }

    containerCoords =  _findPosition(taggingContainer);
    scroll = _findScrollPosition(taggingContainer);
    containerX = containerCoords[0] - scroll[0];
    containerY = containerCoords[1] - scroll[1];

    if (_offY <= _resizeHandleWidth && _offX <= _resizeHandleWidth) {
      _resize_nw(event);
    } else if (_offY >= (height - _resizeHandleWidth) && _offX <= _resizeHandleWidth) {
      _resize_sw(event);
    } else if (_offY <= _resizeHandleWidth && _offX >= (width - _resizeHandleWidth)) {
      _resize_ne(event);
    } else if (_offY >= (height - _resizeHandleWidth) && _offX >= (width - _resizeHandleWidth)) {
      _resize_se(event);
    } else if (_offY <= _resizeHandleWidth) {
      _resize_n(event);
    } else if (_offY >= (height - _resizeHandleWidth)) {
      _resize_s(event);
    } else if (_offX <= _resizeHandleWidth) {
      _resize_w(event);
    } else if (_offX >= (width - _resizeHandleWidth)) {
      _resize_e(event);
    } else {
      _drag(event);
    }

    event.stopPropagation();
  }

  /**
   * Private function _mouseDown()
   * Initializes the editing process for the clicked tag
   */
  function _mouseDown(event) {
    var tag, coords, scroll;

    event = event || window.event;
    tag = event.target;

    coords = _findPosition(tag);
    scroll = _findScrollPosition(taggingContainer);
    _offY = event.clientY - (coords[1] - scroll[1]);
    _offX = event.clientX - (coords[0] - scroll[0]);

    _prevX = event.clientX;
    _prevY = event.clientY;

    _currentlyResizingOrPlacing = true;

    window.addEventListener('mousemove', _mouseMove, true);

    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Private function _mouseUp()
   * Completes the editing process for the active tag
   * Saves the tag if it has been modified
   */
  function _mouseUp(event) {
    event = event || window.event;

    _currentlyResizingOrPlacing = false;

    window.removeEventListener('mousemove', _mouseMove, true);
    event.stopPropagation();
  }

  /**
   * Public function setDirty()
   * Marks the given tag as needing to be saved
   */
  this.setDirty = function(tagElement) {
    var tag = tagging.getTag(_getTagId(tagElement));
    if (tag) {
      tag.isDirty = true;
    }
  };

  /**
   * Public function setBackgroundColor()
   * Sets the background color for any tags created in the future
   * and existing tags if `applyToExisting` is true
   */
  this.setBackgroundColor = function(backgroundColor, applyToExisting) {
    var i;

    applyToExisting = applyToExisting !== undefined ? applyToExisting : false;
    _backgroundColor = backgroundColor;
    if (applyToExisting) {
      for (i = 0; i < _tags.length; i++) {
        if (_tags[i] !== null) {
          document.getElementById(_tagIdPrefix + i).style.background = backgroundColor;
        }
      }
    }
    return tagging;
  };

  /**
   * Public function setBorder()
   * Sets the border for any tags created in the future
   * and existing tags if `applyToExisting` is true
   */
  this.setBorder = function(border, applyToExisting) {
    var i;

    applyToExisting = applyToExisting !== undefined ? applyToExisting : false;
    _border = border;
    if (applyToExisting) {
      for (i = 0; i < _tags.length; i++) {
        if (_tags[i] !== null) {
          document.getElementById(_tagIdPrefix + i).style.border = border;
        }
      }
      for (i = 0; i < _notes.length; i++) {
        if (_notes[i] !== null && _notes[i].setBorder) {
          _notes[i].setBorder(border);
        }
      }
    }
    return tagging;
  };

  /**
   * Public function getId()
   * Returns the next available tag id
   */
  this.getId = function() {
    return _tags.length;
  };

  this.loadTags = function(tags) {
    _tags = tags;
  };

  this.onSave = function(func) {
    if (typeof func !== 'function') {
      return;
    }
    _onSave = func;
  };

  /**
   * Public function showTag()
   * Creates a new tag element for `id` and places it in the DOM
   * This tag element does not get any event handlers because
   * it is meant for display purposes only
   * To create a tag with event handlers, use the editTag function
   */
  this.showTag = function(id) {
    var tag, note, tagInfo, tagWidth, tagHeight, tagLeft, tagTop,
      imageCoords, styles, style, borderWidth;

    id = parseInt(id, 10);
    if (id >= _tags.length) {
      return tagging;
    }
    if (_tags[id] === null) {
      return tagging;
    }
    if (_currentlyEditing >= 0) {
      return tagging;
    }

    tagging.removeTag(id);

    tag = document.createElement('div');
    tag.id = _tagIdPrefix + id;

    tagInfo = _tags[id];
    tagInfo.isDirty = false;
    tagWidth = parseInt(tagInfo.size.width, 10);
    tagHeight = parseInt(tagInfo.size.height, 10);

    // shift the tag to match the image's actual coordinates
    imageCoords = _imageTrueCoords(_getImageFor(tag));
    tagLeft = parseInt(tagInfo.coords.left, 10) + imageCoords.left;
    tagTop = parseInt(tagInfo.coords.top, 10) + imageCoords.top;

    styles = {
      position: 'absolute',
      overflow: 'hidden',
      border: _border,
      background: _backgroundColor,
      top: tagTop + 'px',
      left: tagLeft + 'px',
      height: tagHeight + 'px',
      width: tagWidth + 'px'
    };
    for (style in styles) {
      if (styles.hasOwnProperty(style)) {
        tag.style[style] = styles[style];
      }
    }
    taggingContainer.appendChild(tag);

    if (_allowNotes) {
      borderWidth = parseInt(tag.style.borderWidth, 10);
      styles = {
        position: 'absolute',
        border: _border,
        background: 'white',
        top: (tagTop + tagHeight + borderWidth) + 'px',
        left: tagLeft + 'px',
        minWidth: _minWidth + 'px',
        maxWidth: _maxWidth + 'px',
        paddingLeft: '3px',
        paddingRight: '3px'
      };

      note = new NoteInput();
      note.init(_tagIdPrefix + id + _tagNoteIdSuffix, styles, _tags[id].note, _stopEditing);
      _notes[id] = note;
    }

    return tagging;
  };

  /**
   * Public function showAllTags()
   * Display all the currently saved tags
   */
  this.showAllTags = function() {
    var i;
    for (i = 0; i < _tags.length; i++) {
      tagging.showTag(i);
    }
  };

  /**
   * Public function editTag()
   * Creates a new tag element for `id` and places it in the DOM
   * This tag element gets all the normal event handlers
   */
  this.editTag = function(id) {
    var tmpId, tag, note, container, image, item;

    id = parseInt(id, 10);
    if (_currentlyEditing >= 0) {
      tmpId = _currentlyEditing;
      _currentlyEditing = -1;
      tagging.removeTag(tmpId);
      if (tmpId === id) {
        return tagging;
      }
    }

    tagging.showTag(id);

    tag = document.getElementById(_tagIdPrefix + id);
    tag.addEventListener('mousedown', _mouseDown, true);
    tag.addEventListener('mouseup', _mouseUp, true);
    tag.addEventListener('mousemove', _setCursor, true);
    window.addEventListener('mouseup', _stopEditing, false);
    _currentlyEditing = id;

    if (_allowNotes) {
      note = _notes[id];
      note.allowEdit();
    }

    image = document.getElementById(_tags[id].parent);
    _enforceImageBoundaries(image, tag, false);

    if (_tagListContainer) {
      container = document.getElementById(_tagListContainer);
      if (container) {
        item = document.getElementById(_tagListIdPrefix + id);
        if (item) {
          if (_tags[id].note) {
            // set the nodeValue instead of the innerHTML to prevent code being injected
            item.childNodes[0].nodeValue = _tags[id].note;
          } else {
            item.childNodes[0].nodeValue = '[img tag ' + id + ']';
          }
        } else {
          item = document.createElement('div');
          item.id = _tagListIdPrefix + id;
          item.addEventListener('mouseover', function() { tagging.showTag(id); }, true);
          item.addEventListener('mouseout', function() { tagging.removeTag(id); }, true);
          item.addEventListener('click', function() { tagging.editTag(id); }, true);
          if (_tags[id].note) {
            item.appendChild(document.createTextNode(_tags[id].note));
          } else {
            item.appendChild(document.createTextNode('[img tag ' + id + ']'));
          }
          container.appendChild(item);
        }
      }
    }

    return tagging;
  };

  /**
   * Public function removeTag()
   * Removes the tag element from the DOM if it's there
   * unless that tag is being edited
   */
  this.removeTag = function(id) {
    var tag, note;
    id = parseInt(id, 10);

    if (_currentlyEditing === id) {
      return tagging;
    }

    tag = document.getElementById(_tagIdPrefix + id);
    if (tag) {
      _saveTag(tag);
      tag.parentNode.removeChild(tag);
    }

    note = _notes[id];
    if (note) {
      note.destroy();
      _notes[id] = null;
    }

    return tagging;
  };

  /**
   * Public function removeAllTags()
   * Removes all tag elements from the DOM, even if editing
   */
  this.removeAllTags = function() {
    var i;

    if (_currentlyEditing !== -1) {
      _saveTag(document.getElementById(_tagIdPrefix + _currentlyEditing));
      _currentlyEditing = -1;
    }

    for (i = 0; i < _tags.length; i++) {
      tagging.removeTag(i);
    }
  };

  /**
   * Public function deleteTag()
   * Destroys the tag's information in the list
   * and removes the tag element from the DOM
   */
  this.deleteTag = function(id) {
    id = parseInt(id, 10);
    tagging.removeTag(id);
    _tags[id] = null;

    if (_notes[id]) {
      _notes[id].destroy();
      _notes[id] = null;
    }
    return tagging;
  };

  /**
   * Public function eventCreateTag()
   * Creates a new tag if the given event was a click on a taggable image
   */
  this.eventCreateTag = function(event) {
    event = event || window.event;

    if (targetImages.indexOf(event.target) < 0) {
      return;
    }

    var coords = tagging.getCoordinates(event),
      id = tagging.getId();

    tagging.createTag(id, event.target.id, coords);
    event.stopPropagation();
  };

  /**
   * Public function createTag()
   * Creates a new tag element and places it in the DOM
   * and adds its information to the list
   */
  this.createTag = function(id, imageId, coords) {
    var image, tagWidth, tagHeight, tagLeft, tagTop, newTag;

    if (_disabled) {
      return tagging;
    }

    id = parseInt(id, 10);
    if (id < _tags.length) {
      return tagging;
    }

    image = document.getElementById(imageId);
    if (!image || image.nodeName.toLowerCase() !== 'img') {
      return tagging;
    }

    // Center the tag around the mouse
    tagWidth = _minWidth;
    tagHeight = _minHeight;
    tagLeft = parseInt(coords[0], 10) - (tagWidth / 2);
    tagTop = parseInt(coords[1], 10) - (tagHeight / 2);

    newTag = {
        id: id,
        parent: imageId,
        coords: { left: tagLeft, top: tagTop },
        size: { width: tagWidth, height: tagHeight },
        note: 'Click here to add text',
        comments: [],
        isDirty: true
      };

    _tags[id] = newTag;
    tagging.editTag(id);

    newTag.isDirty = true; // guarantee the new tag gets saved

    return tagging;
  };

  /**
   * Public function getTag()
   * Returns the tag information associated with the given id
   */
  this.getTag = function(id) {
    var i;
    for (i = 0; i < _tags.length; i++) {
      if (_tags[i] && _tags[i].id === id) {
        return _tags[i];
      }
    }
    return null;
  };

  /**
   * Public function getCoordinates()
   * Returns the coordinates of a click event relative to the clicked image
   */
  this.getCoordinates = function(event) {
    var clickPosition;

    if (event.target.nodeName.toLowerCase() !== 'img') {
      return null;
    }
    clickPosition = _getCoordinates(event, event.target);

    return clickPosition;
  };

  /**
   * Public function enable()
   * Enable creation and editing of tags
   */
  this.enable = function() {
    _disabled = false;
  };

  /**
   * Public function disable()
   * Disable creation and editing of tags
   */
  this.disable = function() {
    _disabled = true;
  };

  /**
   * Public function enableNotes()
   * Enable addition and editing of tag notes
   */
  this.enableNotes = function() {
    _allowNotes = true;
  };

  /**
   * Public function disableNotes()
   * Disable addition and editing of tag notes
   */
  this.disableNotes = function() {
    _allowNotes = false;
  };

  /**
   * Public function destroy()
   * Remove all traces of this object having been on the page
   */
  this.destroy = function() {
    var i;
    tagging.removeAllTags();
    for (i = 0; i < targetImages.length; i++) {
      targetImages[i].removeEventListener('mousedown', _createTagOnEvent, false);
    }
  };
};

window.ImageTagging = ImageTagging;
}());
