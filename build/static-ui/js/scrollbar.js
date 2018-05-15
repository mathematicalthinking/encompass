var updateBackgroundPos = function() {
  var x = -1 * (hscroll.getPosition().x - 10);
  var y = -1 * (vscroll.getPosition().y - 10);
  container.style.backgroundPosition = x + 'px ' + y + 'px';
};

var stage = new Kinetic.Stage({
  container: 'container',
  width: 578,
  height: 363
});

var layer = new Kinetic.Layer();
var areas = new Kinetic.Group();
var scrollbars = new Kinetic.Group();
var container = stage.getContainer();

/*
 * horizontal scrollbars
 */

var hscrollArea = new Kinetic.Rect({
  x: 10,
  y: stage.getHeight() - 30,
  width: stage.getWidth() - 40,
  height: 20,
  fill: 'black',
  opacity: 0.3
});

var hscroll = new Kinetic.Rect({
  x: 10,
  y: stage.getHeight() - 30,
  width: 130,
  height: 20,
  fill: '#9f005b',
  draggable: true,
  dragBoundFunc: function(pos) {
    var newX = pos.x;
    if(newX < 10) {
      newX = 10;
    }
    else if(newX > stage.getWidth() - 160) {
      newX = stage.getWidth() - 160;
    }
    return {
      x: newX,
      y: this.getAbsolutePosition().y
    }
  },
  opacity: 0.9,
  stroke: 'black',
  strokeWidth: 1
});

/*
 * vertical scrollbars
 */

var vscrollArea = new Kinetic.Rect({
  x: stage.getWidth() - 30,
  y: 10,
  width: 20,
  height: stage.getHeight() - 40,
  fill: 'black',
  opacity: 0.3
});

var vscroll = new Kinetic.Rect({
  x: stage.getWidth() - 30,
  y: 10,
  width: 20,
  height: 70,
  fill: '#9f005b',
  draggable: true,
  dragBoundFunc: function(pos) {
    var newY = pos.y;
    if(newY < 10) {
      newY = 10;
    }
    else if(newY > stage.getHeight() - 100) {
      newY = stage.getHeight() - 100;
    }
    return {
      x: this.getAbsolutePosition().x,
      y: newY
    }
  },
  opacity: 0.9,
  stroke: 'black',
  strokeWidth: 1
});

/*
 * scrollbars
 */

scrollbars.on('mouseover', function() {
  document.body.style.cursor = 'pointer';
});
scrollbars.on('mouseout', function() {
  document.body.style.cursor = 'default';
});

hscroll.on('dragmove', updateBackgroundPos);
vscroll.on('dragmove', updateBackgroundPos);

areas.add(hscrollArea);
areas.add(vscrollArea);
scrollbars.add(hscroll);
scrollbars.add(vscroll);
layer.add(areas);
layer.add(scrollbars);
stage.add(layer);

