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

  args = args || {};

  var tagging = this,
    _tags = [],
    _notes = [],
    _tagIdPrefix = args.idPrefix || 'img-tag-',
    _tagListIdPrefix = args.listIdPrefix || 'tag-list-',
    _tagNoteIdSuffix = '-note',
    _selectionBoxId = args.selectionBoxId || 'sel-box',
    _cancelButtonId = args.cancelButtonId || 'cancel-sel',
    _confirmButtonId = args.confirmButtonId || 'confirm-sel',
    _tagListContainer = args.tagsListContainer || '',
    _scrollableContainer = args.scrollableContainer || 'al_submission',
    _offY = 0, _offX = 0, _prevX = 0, _prevY = 0,
    _resizeHandleWidth = args.resizeHandleWidth ? parseInt(args.resizeHandleWidth, 10) : 10,
    _minHeight = args.minHeight ? parseInt(args.minHeight, 10) : 40,
    _minWidth = args.minWidth ? parseInt(args.minWidth, 10) : 40,
    _maxHeight = args.maxHeight ? parseInt(args.maxHeight, 10) : 400,
    _maxWidth = args.maxWidth ? parseInt(args.maxWidth, 10) : 400,
    _backgroundColor = args.backgroundColor || 'rgba(0, 0, 0, 0.0)',
    _border = args.border || '3px solid #3476CE',
    _taggingContainerBorder = args.taggingContainerBorder || '2px solid #008b00',
    _selectionBorder = args.selectionBorder || '2px dashed #696969',
    _currentlyResizingOrPlacing = false,
    _currentlyEditing = -1,
    _currentlyMakingSelection = false,
    _currentlyConfirmingSelection = false,
    _currentlySavingTag = false,
    _allowNotes = false,
    _disabled = false,
    _onSave = function() { /* empty until a function is provided */ },
    targetImages,
    taggingContainer,
    containerX,
    containerY,
    prevCoords,

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
      // window.event tends to be undefined in firefox
      // is this line necessary if we are always passing in event?
      event = event || window.event;

    if (event.target.id !== _tagIdPrefix + tmpId) {
      if (_currentlyResizingOrPlacing) {
        window.removeEventListener('mousemove', _mouseMove, true);
        window.removeEventListener('touchmove', _mouseMove , true);
        _currentlyResizingOrPlacing = false;
        return;
      }
    } else {
      _currentlyResizingOrPlacing = false;
    }

    window.removeEventListener('mouseup', _stopEditing, false);
    window.removeEventListener('touchend', _stopEditing, false);

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

  function _textKeyPress(event) {
    var charCode;

    event = event || window.event;
    charCode = event.keyCode || event.which;
    charCode = parseInt(charCode, 10);

    if (charCode === ENTER) {
      _stopEditing(event);
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
    if (_currentlyMakingSelection) {
      _currentlyEditing = false;
    }
    _currentlyConfirmingSelection = false;
    tagging.eventCreateTag(event);
  }

  function _handleMouseMove(event) {
    event.preventDefault();
    if (_currentlyMakingSelection) {
      tagging.createSelectionBox(event);
    }
    event.stopPropagation();
  }

  function _handleMouseUp(event) {
    if (!_currentlyMakingSelection) {
      return;
    }
    if (_currentlyMakingSelection) {
      _currentlyMakingSelection = false;
      _currentlyConfirmingSelection = true;
      window.removeEventListener('mouseup', _handleMouseUp, false);
      window.removeEventListener('mousemove', _handleMouseMove, false);

      window.removeEventListener('touchend', _handleMouseUp, false);
      window.removeEventListener('touchmove', _handleMouseMove, false);

      tagging.selectionOrigin = null;
      tagging.confirmSelectionArea(event);
    }
  }

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

  function _removeElsFromDom(els) {
    if (!Array.isArray(els)) {
      return;
    }
    els.forEach((el) => {
      var elm = document.getElementById(el);

      if (elm !== null) {
        elm.remove();
      }
    });
    _currentlyConfirmingSelection = false;
  }
  function _cancelSelection() {
    _removeElsFromDom([_selectionBoxId, _confirmButtonId, _cancelButtonId]);
  }
  function _styleAsInt(el, attr) {
    if (!el) {
      return;
    }
    var str = el.style[attr];
    var pxIx = str.indexOf('px');
    var numOnly = str.slice(0, pxIx);
    return Number(numOnly);
}
  function _confirmSelectionInputs(box, targetImage, visibleImage, scrollableContainer) {
    var confirm = document.createElement('button');
    var cancel = document.createElement('button');
    confirm.className = "primary-button ";
    cancel.className="primary-button cancel-button ";
    var boxLeft = _styleAsInt(box, 'left');
    var boxTop = _styleAsInt(box, 'top');
    var boxHeight = _styleAsInt(box, 'height');
    var boxWidth = _styleAsInt(box, 'width');
    // var boxBottom = boxTop + boxHeight;
    // var boxRight = boxLeft + boxWidth;
    var boxBorderWidth = _styleAsInt(box, 'borderWidth');
    var buttonsWidth = 44;
    var buttonsHeight = 21;
    var buttons = [confirm, cancel];



    confirm.style.left = boxLeft + boxWidth + 2 * boxBorderWidth - buttonsWidth + 'px';
    confirm.style.top = boxTop + boxHeight + 2 *  boxBorderWidth + 'px';

    cancel.style.left = boxLeft + 'px';
    cancel.style.top = boxTop + boxHeight  + 2 * boxBorderWidth + 'px';

    let diff;

    // ensure buttons are not on top of each other if tagging is small
    if (boxWidth < 2 * buttonsWidth) {
      diff = 2 * buttonsWidth - boxWidth;
      confirm.style.left =  _styleAsInt(confirm, 'left') + diff / 2 - 2 * boxBorderWidth + 'px';
      cancel.style.left = _styleAsInt(cancel, 'left') - diff / 2 + 'px';
    }

    var [imgX, imgY] = _findPosition(targetImage);
    var imgBottom = imgY + targetImage.height;
    var overflow = imgBottom - visibleImage.bottomEdge;

    // if (!selBoxRect.bottom > buttonsHeight) {
    //   // buttons will not be visible; scroll
    // }
    // scroll if buttons not visible
    // if (boxBottom + buttonsHeight + imgY - overflow  > visibleImage.bottomEdge) {
    //   console.log('buttons not visible, scrolling');
    //   diff = boxBottom + buttonsHeight - visibleImage.bottomEdge;
    //   document.getElementById(scrollableContainer).scrollTop -= diff;
    // }

    buttons.forEach((button) => {
      button.style.position = 'absolute';
      button.style.width = buttonsWidth + 'px';
      button.style.height = buttonsHeight + 'px';
      button.type = 'button';
      button.style.textAlign = 'center';
      button.style.fontSize =  0.5 + 'em';
      button.style.fontWeight = 'bold';
      button.style.padding = 0;

      //button.style.margin = 'auto';
    });
    confirm.setAttribute('id', _confirmButtonId);
    confirm.innerText = 'Save';

    cancel.setAttribute('id', _cancelButtonId);
    cancel.innerText = 'Cancel';

    return [confirm, cancel];
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

  function _getVisibleImageBoundaries(event, scrollDiv, img) {
    var container = document.getElementById(scrollDiv);

    var [containerX, containerY] = _findPosition(container);
    var root = document.documentElement;

    var scrollRangeY = container.scrollHeight - container.clientHeight;
    var overflowBottom = scrollRangeY - Math.floor(container.scrollTop);
    var overflowTop = Math.floor(container.scrollTop);

    var scrollRangeX = root.scrollWidth - root.clientWidth;
    var overflowLeft = Math.floor(root.scrollLeft);
    var overflowRight = scrollRangeX - Math.floor(root.scrollLeft);

    var [imgX, imgY] = _findPosition(img);
    var imgScrollPosition = _findScrollPosition(img);

    var diffBottom = (containerY + container.scrollHeight) - (imgY + img.scrollHeight);
    var diffTop = imgY + _styleAsInt(img, 'borderWidth') - containerY;
    var diffLeft = imgX;
    var diffRight = root.scrollWidth - imgX - img.width;

    var imgOverflowLeft;
    var imgOverflowRight;
    var imgOverflowTop;
    var imgOverflowBottom;

    if (overflowLeft <= diffLeft) {
      imgOverflowLeft = 0;
    } else {
      imgOverflowLeft = overflowLeft - diffLeft;
    }

    if (overflowRight <= diffRight) {
      imgOverflowRight = 0;
    } else {
      imgOverflowRight = overflowRight - diffRight;
    }

    if (overflowTop <= diffTop) {
      imgOverflowTop = 0;
    } else {
      imgOverflowTop = overflowTop - diffTop;
    }

    if (overflowBottom <= diffBottom) {
      imgOverflowBottom = 0;
    } else {
      imgOverflowBottom = overflowBottom - diffBottom;
    }
    return {
      topEdge: imgY + imgOverflowTop,
      bottomEdge: imgY + img.clientHeight - imgOverflowBottom,
      leftEdge : imgX + imgOverflowLeft,
      rightEdge:  imgX + img.width - imgOverflowRight
    };
  }

  /**
   * Private function _imageTrueCoords()
   * Returns the x and y coordinates of an image within its parent
   * taking into account scroll position of all ancestors
   */
  function _imageTrueCoords(image) {
    var imageCoords = _findPosition(image),
      containerCoords = _findPosition(taggingContainer),
      scrollCoords = _findScrollPosition(image),
      imageLeft = imageCoords[0] - containerCoords[0],
      imageTop = imageCoords[1] - containerCoords[1],
      coords = {left: imageLeft, top: imageTop};
    return coords;
  }

  this.confirmSelectionArea = function(event) {
    var selectionBox;
    var targetImage;
    event = event || window.event;

    selectionBox = document.getElementById(_selectionBoxId);

    if (selectionBox === null) {
      _currentlyConfirmingSelection = false;
      return;
    }

    var selectionWidth = _styleAsInt(selectionBox, 'width');
    var selectionHeight = _styleAsInt(selectionBox, 'height');

    if (selectionHeight <= 1 || selectionWidth <= 1) {
      _currentlyConfirmingSelection = false;
      _removeElsFromDom([_selectionBoxId, _confirmButtonId, _cancelButtonId]);
      return;
    }
    targetImage = tagging.currentTargetImage;
    // if (targetImages.indexOf(event.target) >= 0) {
    //   targetImage = event.target;
    // } else if (event.target.id === _selectionBoxId) {
    //   targetImage = event.target.previousElementSibling.firstElementChild;
    // } else {
    //   targetImage = selectionBox.previousElementSibling.firstElementChild;
    // }

    var visibleImage = _getVisibleImageBoundaries(event, _scrollableContainer, targetImage);

    var buttons = _confirmSelectionInputs(selectionBox, targetImage, visibleImage, _scrollableContainer);

    var confirm = buttons[0];
    var cancel = buttons[1];

    confirm.addEventListener('click', function() {
      var id = tagging.getId();
      var imageCoords = _imageTrueCoords(targetImage);
      var relativeCoords = [_styleAsInt(selectionBox, 'left') - imageCoords.left, _styleAsInt(selectionBox, 'top') - imageCoords.top];
      tagging.createTag(id, targetImage.id, relativeCoords, selectionBox);
      _removeElsFromDom([_selectionBoxId, _confirmButtonId, _cancelButtonId]);
    });
    cancel.addEventListener('click', _cancelSelection);

    taggingContainer.appendChild(confirm);
    taggingContainer.appendChild(cancel);
  };

  function _initiateSelection(event) {
    event.preventDefault();
    if (_disabled || _currentlyMakingSelection || _currentlyConfirmingSelection || _currentlyEditing !== -1) {
      return;
    }
    _currentlyMakingSelection = true;
    window.addEventListener('mouseup', _handleMouseUp, false);
    window.addEventListener('mousemove', _handleMouseMove, false);

    window.addEventListener('touchend', _handleMouseUp, false);
    window.addEventListener('touchmove', _handleMouseMove, false);

    tagging.currentTargetImage = event.target;
    tagging.createSelectionBox(event);

    event.stopPropagation();
  }


  // TODO: Refactor into smaller, reusable functions
  function _scrollIfNeeded(event, scrollDiv, img, selection, dragDirection) {
    var container = document.getElementById(scrollDiv);

    var [containerX, containerY] = _findPosition(container);
    var [imgX, imgY] = _findPosition(img);

    let diffLeft = imgX - containerX;
    let diffTop = imgY - containerY;

    let diffRight = container.scrollWidth - img.width - diffLeft;
    let diffBottom = container.scrollHeight - diffTop - img.height;

    var [selectionLeft, selectionTop] = _findPosition(selection);
    var selectionBottom = selectionTop + _styleAsInt(selection, 'height');
    var selectionRight = selectionLeft + _styleAsInt(selection, 'width');

    var {down, up, right, left} = dragDirection;
    var scrollRangeY = container.scrollHeight - container.clientHeight;
    var overflowBottom = scrollRangeY - Math.floor(container.scrollTop);
    var overflowTop = Math.floor(container.scrollTop);

    var scrollRangeX = container.scrollWidth - container.clientWidth;
    var overflowLeft = Math.floor(container.scrollLeft);
    var overflowRight = scrollRangeX - Math.floor(container.scrollLeft);

    // var imgScrollPosition = _findScrollPosition(img);

    var imgOverflowLeft;
    var imgOverflowRight;
    var imgOverflowTop;
    var imgOverflowBottom;

    if (overflowLeft <= diffLeft) {
      imgOverflowLeft = 0;
    } else {
      imgOverflowLeft = overflowLeft - diffLeft;
    }

    if (overflowRight <= diffRight) {
      imgOverflowRight = 0;
    } else {
      imgOverflowRight = overflowRight - diffRight;
    }

    if (overflowTop <= diffTop) {
      imgOverflowTop = 0;
    } else {
      imgOverflowTop = overflowTop - diffTop;
    }

    if (overflowBottom <= diffBottom) {
      imgOverflowBottom = 0;
    } else {
      imgOverflowBottom = overflowBottom - diffBottom;
    }

    var topOfVisibleImage = imgY + imgOverflowTop;
    var bottomOfVisibleImage = imgY + img.clientHeight - imgOverflowBottom;
    var leftEdgeVisibleImage = imgX + imgOverflowLeft;
    var rightEdgeVisibleImage = imgX + img.width - imgOverflowRight;

    // if (up && imgOverflowTop > 0) {
    //   if (dragOrientation.x === -1) {
    //     if (selectionTop <= topOfVisibleImage + 25) {
    //       container.scrollTop = container.scrollTop - 10;
    //     }
    //   } else if (dragOrientation.x === 1) {
    //     if (selectionBottom <= topOfVisibleImage + 25) {
    //       container.scrollTop = container.scrollTop - 10;
    //     }
    //   }
    // }
    if ( up && imgOverflowTop > 0 && selectionTop <= topOfVisibleImage + 25) {
      container.scrollTop -= 10;
    }

    if (down && imgOverflowBottom > 0 && selectionBottom >= bottomOfVisibleImage - 25) {
      container.scrollTop += 10;
    }

    if (left && imgOverflowLeft > 0 && selectionLeft <= leftEdgeVisibleImage + 25) {
      container.scrollLeft -= 10;
    }
    if (right && imgOverflowRight > 0 && selectionRight >= rightEdgeVisibleImage - 25) {
      container.scrollLeft += 10;
    }
  }

  this.createSelectionBox = function(event) {
    var box;
    var prevCords;
    var eventCoords;
    var targetImage;
    var height;
    var width;
    var imageCoords;
    var isInitial;


    var isDraggingDown;
    var isDraggingRight;
    var isDraggingLeft;
    var isDraggingUp;

    var dragDirection = {
      down: null,
      up: null,
      right: null,
      left: null
    };

    var dragOrientation = {
      x: 1,
      y: 1
    };

    event = event || window.event;
    targetImage = tagging.currentTargetImage;

    if (targetImages.indexOf(targetImage) < 0 && event.target.id !==_selectionBoxId) {
      return;
    }
    eventCoords = _getCoordinates(event, targetImage);
    // // coordinates relative to clickedImage
    // if (targetImages.indexOf(event.target) >= 0) {
    //   //targetImage = event.target;
    //   eventCoords = tagging.getCoordinates(event);
    // } else if (event.target.id === _selectionBoxId) {
    //   //targetImage = event.target.previousElementSibling.firstElementChild;
    //   eventCoords = _getCoordinates(event, targetImage);
    // }
    // only allow selections inside image borders
    if (eventCoords[0] < 0 || eventCoords[1] < 0) {
      return;
    }

    if (eventCoords[0] > targetImage.clientWidth || eventCoords[1] > targetImage.clientHeight) {
      return;
    }

    box = document.getElementById(_selectionBoxId);

    if (box === null) { // no selection in progress
      isInitial = true;
      tagging.prevCoords = eventCoords;
      tagging.selectionOrigin = eventCoords;
      box = document.createElement('div');
      box.setAttribute('id', _selectionBoxId);

      box.style.position = 'absolute';
      box.style.overflow = 'hidden';
      box.style.background = 'rgba(0, 0, 0, 0)';
      box.style.border = _selectionBorder;
    } else {
      dragDirection.down = eventCoords[1] > tagging.prevCoords[1];
      dragDirection.up = eventCoords[1] < tagging.prevCoords[1];
      dragDirection.right = eventCoords[0] > tagging.prevCoords[0];
      dragDirection.left = eventCoords[0] < tagging.prevCoords[0];

      if (tagging.selectionOrigin[1] > eventCoords[1]) {
          dragOrientation.y = -1;
        }

      if (tagging.selectionOrigin[0] > eventCoords[0]) {
        dragOrientation.x = -1;
      }
      _scrollIfNeeded(event, _scrollableContainer, targetImage, box, dragDirection);
    }
    width = Math.abs(eventCoords[0] - tagging.selectionOrigin[0]);
    height = Math.abs(eventCoords[1] - tagging.selectionOrigin[1]);

    imageCoords = _imageTrueCoords(targetImage);

    if (eventCoords[0] < tagging.selectionOrigin[0]) {
      box.style.left = tagging.selectionOrigin[0] + imageCoords.left - width + 'px';
    } else {
      box.style.left = tagging.selectionOrigin[0] + imageCoords.left + 'px';
    }

    if (eventCoords[1] < tagging.selectionOrigin[1]) {
      box.style.top = tagging.selectionOrigin[1] + imageCoords.top - height + 'px';
    } else {
      box.style.top = tagging.selectionOrigin[1] + imageCoords.top + 'px';
    }

    box.style.height = height + 'px';
    box.style.width = width + 'px';

    // only append box if this is the initial click that triggered selection
    if (isInitial) {
      taggingContainer.appendChild(box);
    }
    tagging.prevCoords = eventCoords;
  };


  // set up the event handlers immediately
  (function() {

    function addEventListener(img) {
      if (!img.id) {
        return;
      }
      targetImages[targetImages.length] = img;
      img.addEventListener('mousedown', _initiateSelection, false);
      img.addEventListener('touchstart', _initiateSelection, false);
    }

    var images, i;
    targetImages = [];

    if (args.targetContainer) {
      taggingContainer = document.getElementById(args.targetContainer);
      images = taggingContainer.getElementsByTagName('img');
      for (i = 0; i < images.length; i++) {
        addEventListener(images[i]);
        images[i].setAttribute('draggable', false);
        images[i].style.border = _taggingContainerBorder;
      }
    }
  }());

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
    var sc = _findScrollPosition(image);
    if (event.pageX || event.pageY) {
      posX = event.pageX;
      posY = event.pageY;
    } else if (event.clientX || event.clientY) {
      posX = event.clientX + document.documentElement.scrollLeft;
      posY = event.clientY + document.documentElement.scrollTop;
    }
    posX -= imgX;
    posY = posY - imgY + sc[1];

    return [posX, posY];
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
        tagWidth -= (imageLeft - tagLeft);
      }
      tagLeft = imageLeft;
      changed = true;
    }
    if (tagTop < imageTop) {
      if (resizing) {
        tagHeight -= (imageTop - tagTop);
      }
      tagTop = imageTop;
      changed = true;
    }

    if (tagRight > imageRight) {
      if (tagLeft === imageLeft) {
        tagWidth = image.clientWidth;
      } else if (resizing) {
        tagWidth -= (tagRight - imageRight);
      } else if (!resizing) {
        tagLeft -= (tagRight - imageRight);
      }
      changed = true;
    }
    if (tagBottom > imageBottom) {
      if (tagTop === imageTop) {
        tagHeight = image.clientHeight;
      } else if (resizing) {
        tagHeight -= (tagBottom - imageBottom);
      } else if (!resizing) {
        tagTop -= (tagBottom - imageBottom);
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
      diff -= (newHeight - _minHeight);
      newHeight = _minHeight;
    } else if (newHeight > _maxHeight) {
      diff -= (newHeight - _maxHeight);
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
      diff -= (newHeight - _minHeight);
      newHeight = _minHeight;
    } else if (newHeight > _maxHeight) {
      diff -= (newHeight - _maxHeight);
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
      diff -= (newWidth - _minWidth);
      newWidth = _minWidth;
    } else if (newWidth > _maxWidth) {
      diff -= (newWidth - _maxWidth);
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
      diff -= (newWidth - _minWidth);
      newWidth = _minWidth;
    } else if (newWidth > _maxWidth) {
      diff -= (newWidth - _maxWidth);
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
    window.addEventListener('touchmove', _mouseMove, true);


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
    window.removeEventListener('touchmove', _mouseMove, true);

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

    if (tagInfo.relativeCoords) {
      imageCoords = _imageTrueCoords(_getImageFor(tag));
      tagLeft = parseInt(tagInfo.coords.left, 10) + imageCoords.left;
      tagTop = parseInt(tagInfo.coords.top, 10) + imageCoords.top;
    } else {
      // for old tags
      imageCoords = _imageTrueCoords(_getImageFor(tag));
      tagLeft = parseInt(tagInfo.coords.left, 10);
      tagTop = parseInt(tagInfo.coords.top, 10);
    }


    let image = _getImageFor(tag);
    let imageHeight = image.height;
    let imageWidth = image.width;

    let naturalHeight = image.naturalHeight;
    let naturalWidth = image.naturalWidth;

    let widthPct;
    let heightPct;

    let tagLeftPct;
    let tagTopPct;

    let doUpdateOldTag = false;

    if (tagInfo.relativeSize) {
      widthPct = tagInfo.relativeSize.widthPct;
      heightPct = tagInfo.relativeSize.heightPct;
    } else {
      doUpdateOldTag = true;
      // for old tags
      let baseWidth = naturalWidth || imageWidth;
      let baseHeight = naturalHeight || imageHeight;

      widthPct = tagWidth / baseWidth;
      heightPct = tagHeight / baseHeight;

      tagInfo.relativeSize = {};

      tagInfo.relativeSize.widthPct = widthPct;
      tagInfo.relativeSize.heightPct = heightPct;
    }

    if (tagInfo.relativeCoords) {
      tagLeftPct = tagInfo.relativeCoords.tagLeftPct;
      tagTopPct = tagInfo.relativeCoords.tagTopPct;
    } else {
      doUpdateOldTag = true;
      // for old tags
      let baseWidth = naturalWidth || imageWidth;
      let baseHeight = naturalHeight || imageHeight;

      tagLeftPct = tagLeft / baseWidth;
      tagTopPct = tagTop / baseHeight;

      tagInfo.relativeCoords = {};

      tagInfo.relativeCoords.tagLeftPct = tagLeftPct;
      tagInfo.relativeCoords.tagTopPct = tagTopPct;
    }

    if (doUpdateOldTag) {
      _onSave(tagInfo.id, true);
    }
    let adjustedTagWidth = Math.floor(widthPct * imageWidth);
    let adjustedTagHeight = Math.floor(heightPct * imageHeight);

    let adjustedTagLeft = Math.floor(tagLeftPct * imageWidth + imageCoords.left);
    let adjustedTagTop = Math.floor(tagTopPct * imageHeight + imageCoords.top);

    styles = {
      position: 'absolute',
      overflow: 'hidden',
      border: _border,
      background: _backgroundColor,
      top: adjustedTagTop + 'px',
      left: adjustedTagLeft + 'px',
      height: adjustedTagHeight + 'px',
      width: adjustedTagWidth + 'px'
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
        top: (adjustedTagTop + adjustedTagHeight + borderWidth) + 'px',
        left: adjustedTagLeft + 'px',
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
      if (tag.parentNode) {
        tag.parentNode.removeChild(tag);
      } else {
        tag.remove();
      }

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

  this.eventCreateNewTag = function(event) {

  };

  /**
   * Public function createTag()
   * Creates a new tag element and places it in the DOM
   * and adds its information to the list
   */
  this.createTag = function(id, imageId, coords, selection) {
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
    let imageWidth = parseInt(image.width, 10);
    let imageHeight = parseInt(image.height, 10);

    let imageSrc = image.getAttribute('src');

    // Center the tag around the mouse
    tagWidth = _styleAsInt(selection, 'width');
    tagHeight = _styleAsInt(selection, 'height');
    tagLeft = parseInt(coords[0], 10);
    tagTop = parseInt(coords[1], 10);

    let widthPct = tagWidth / imageWidth;
    let heightPct = tagHeight / imageHeight;

    let tagLeftPct = tagLeft / imageWidth;
    let tagTopPct = tagTop / imageHeight;

    newTag = {
        id: id,
        parent: imageId,
        coords: { left: tagLeft, top: tagTop },
        relativeCoords: { tagLeftPct, tagTopPct },
        size: { width: tagWidth, height: tagHeight },
        relativeSize: { widthPct, heightPct },
        note: 'Click here to add text',
        comments: [],
        isDirty: true,
        imageSrc,
      };
    _tags[id] = newTag;
    // tagging.editTag(id);

    newTag.isDirty = true; // guarantee the new tag gets saved

    _onSave(newTag.id);
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

    if (event.target.nodeName.toLowerCase() !== 'img' && event.target.id !== _selectionBoxId) {
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
      targetImages[i].removeEventListener('touchstart', _createTagOnEvent, false);

    }
  };
};

window.ImageTagging = ImageTagging;
}());
