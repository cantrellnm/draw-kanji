$(document).on('turbolinks:load', drawSetup);
$(document).ajaxComplete(drawSetup);

async function drawSetup() {
  var canvas, ctx, points, svgPaths, svgData, svg, correctPathPoints, svgPathPoints;
  
  canvas = document.getElementById('draw');
  if (canvas) {
    ctx = canvas.getContext('2d');
    points = [];
    svgPaths = [];
    svgData = function() {
      return '<svg xmlns="http://www.w3.org/2000/svg">'+
      '<g style="fill:none;stroke:#000000;stroke-width:'+canvas.width/40+'stroke-linecap:round;stroke-linejoin:round;">'+
      svgPaths.join('\n')+
      '</g></svg>';
    };
    svg = new Image();
    correctPathPoints = svgToPoints(document.querySelector('#kanjivg svg'));
    svgPathPoints = [];
    ctx.lineWidth = canvas.width/40;
    ctx.strokeStyle = '#777';
    ctx.lineCap = 'round';
    
    resizeCanvas();
    await updateSvg();
    drawCanvas();
    
    toggleGrid();
    toggleNumbers();
    
    $(window).resize(resizeCanvas);
  
    $(document).on('mousedown touchstart', '#draw', startLine);
    $(document).on('mouseup mouseleave touchend touchcancel', '#draw', endLine);
    // $(document).on('click', '#save', openSvg);
    $(document).on('change', '#grid', toggleGrid);
    $(document).on('change', '#stroke-numbers', toggleNumbers);
    $(document).on('click', '#clear', clearAll);
    $(document).on('click', '#undo', undoLine);
    $(document).on('click', '#again, #next', finishAction);
    $(document).on('keyup', keyEvent);
  }
  
  function resizeCanvas() {
    canvas.setAttribute('width', $('#draw').css('width'));
    canvas.setAttribute('height', $('#draw').css('height'));
    ctx.lineCap = 'round';
    drawCanvas();
  }

  // OPTIONS
  function toggleGrid() {
    if ($('#grid').is(':checked')) {
      $('#kanjivg').addClass('grid');
    } else {
      $('#kanjivg').removeClass('grid');
    }
    drawCanvas();
  }
  function toggleNumbers() {
    if ($('#stroke-numbers').is(':checked')) {
      $('#kanjivg text').show();
    } else {
      $('#kanjivg text').hide();
    }
  }
  
  // USER ACTIONS ON CANVAS
  function startLine(e) {
    e.preventDefault();
    canvas.addEventListener('mousemove', drawLine, false);
    canvas.addEventListener('touchmove', drawLine, false);
  }
  //drawing line
  function drawLine(e) {
    e.preventDefault();
    var rect = canvas.getBoundingClientRect()
        x = (e.type === 'mousemove')? e.clientX : e.targetTouches[0].clientX,
        y = (e.type === 'mousemove')? e.clientY : e.targetTouches[0].clientY;
    points.push({
      x: x - rect.left,
      y: y - rect.top
    });
    pointsToCanvas();
  }
  function pointsToCanvas() {
    var i;
    if (points.length < 3) { return; }
    drawCanvas();
    // http://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas
    // move to the first point
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (i=1; i<points.length-2; i++) {
      var xc = (points[i].x + points[i+1].x) / 2;
      var yc = (points[i].y + points[i+1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    // curve through the last two points
    ctx.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x,points[i+1].y);
    ctx.stroke();
  }
  //finish drawing line
  function endLine() {
    if (points.length > 0) {
      canvas.removeEventListener('mousemove', drawLine, false);
      canvas.removeEventListener('touchmove', drawLine, false);
      pointsToSvg();
      if (svgPaths.length > 0 && svgPathPoints.length === correctPathPoints.length) {
        finishKanji();
      }
    }
  }
  async function pointsToSvg() {
    var pathIndex, i, d = 'M';
    if (points.length === 0) { return; }
    
    // first point
    d += points[0].x +','+ points[0].y;
    for (i = 1; i < points.length - 2; i++) {
      var xc = (points[i].x + points[i + 1].x) / 2;
      var yc = (points[i].y + points[i + 1].y) / 2;
      d += ' Q'+points[i].x+','+points[i].y+', '+xc+','+yc;
    }
    // curve through the last two points
    d += ' Q'+points[i].x+','+points[i].y+', '+points[i+1].x+','+points[i+1].y;
    
    svgPaths.push('<path stroke-linecap="round" stroke-width="'+canvas.width/40+'" d="'+d+'" />');
    await updateSvg();
    svgPathPoints = svgToPoints(parseSvg());
    
    //check if correct
    pathIndex = svgPaths.length-1;
    if (!correctPathPoints[pathIndex] || !comparePath(pathIndex)) {
      svgPaths[pathIndex] = '<path style="stroke:red;" stroke-linecap="round" stroke-width="'+canvas.width/40+'" d="'+d+'" />';
      await updateSvg();
    }
    
    points = [];
    drawCanvas();
  }
  //undo or clear
  async function undoLine() {
    svgPaths.pop();
    svgPathPoints.pop();
    await updateSvg();
    drawCanvas();
  }
  async function clearAll() {
    svgPaths = [];
    svgPathPoints = [];
    await updateSvg();
    drawCanvas();
  }
  //key down
  function keyEvent(e) {
    e = e || window.event;
    //ctrl+z
    if (canvas && (e.which == 90 || e.keyCode == 90) && e.ctrlKey) {
      undoLine();
    }
    //ctrl+x
    if (canvas && (e.which == 88 || e.keyCode == 88) && e.ctrlKey) {
      clearAll();
    }
    //esc
    if ($('#draw-finish').is(':visible') && (e.which == 27 || e.keyCode == 27)) {
      $('#again').click();
    }
    //right arrow
    if (canvas && (e.which == 39 || e.keyCode == 39)) {
      $('#next').click();
    }
  }
  //finish drawing
  function finishKanji() {
    var result = (svgPaths.filter(function(p) { return p.match(/stroke:red/); }).length > 0) ? 
      '<span style="color:red;">Hmm. Not quite there.</span>' :
      'You did it! Nice.';
    $('#result').html(result);
    $('#draw-finish').show();
  }
  function finishAction(e) {
    $('#draw-finish').hide();
    clearAll();
    if (e.target.id === 'next') {
      $('#filter-form input[type="submit"]').click();
    }
  }
  
  // UPDATE/SAVE CANVAS
  function updateSvg() {
    return new Promise((resolve) => {
      svg.onload = () => resolve();
      svg.src = 'data:image/svg+xml;base64,'+window.btoa(svgData());
    });
  }
  // function openSvg() {
  //   // var imgURI = canvas.toDataURL('image/svg');
  //   var imgURI = 'data:image/svg+xml;base64,'+window.btoa(svgData());
  //   var evt = new MouseEvent('click', {
  //     view: window,
  //     bubbles: false,
  //     cancelable: true
  //   });
  //   var a = document.createElement('a');
  //   a.setAttribute('download', 'doodle.svg');
  //   a.setAttribute('href', imgURI);
  //   a.setAttribute('target', '_blank');
  //   a.dispatchEvent(evt);
  // }
  
  // DRAW GRID AND SVG ON CANVAS
  function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if ($('#grid').is(':checked')) {
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      drawGrid();
    }
    ctx.lineWidth = canvas.width/40;
    ctx.strokeStyle = '#777';
    drawSvg();
  }
  function drawGrid() {
    ctx.beginPath();
    ctx.moveTo(canvas.width/2 - 1, 0);
    ctx.lineTo(canvas.width/2 - 1, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, canvas.height/2 - 1);
    ctx.lineTo(canvas.width, canvas.height/2 - 1);
    ctx.stroke();
  }
  function drawSvg() {
    ctx.drawImage(svg, 0, 0);
  }
  
  // PARSE/COMPARE PATHS
  function svgToPoints(svgEle) {
    var svgPoints = [];
    Array.prototype.slice.call(svgEle.querySelectorAll('path')).forEach(function(p) {
      svgPoints.push(findSvgPoints(p, svgEle));
    });
    return svgPoints;
  }
  function parseSvg() {
    return new DOMParser().parseFromString(svgData(), "image/svg+xml");
  }
  function findSvgPoints(path, svgEle) {
    var length = path.getTotalLength(),
        numPoints = 10,
        svgPoints = [],
        svgWidth = (svgEle.viewBox)? svgEle.viewBox.baseVal.width : canvas.width,
        svgHeight = (svgEle.viewBox)? svgEle.viewBox.baseVal.height : canvas.height;
    for (var i=0; i<numPoints; i++) {
      svgPoints.push(path.getPointAtLength(i * length/numPoints));
    }
    svgPoints = svgPoints.map(function(p) {
      return {x: 100*p.x/svgWidth, y: 100*p.y/svgHeight};
    });
    return svgPoints;
  }
  function comparePath(i) {
    var p1 = svgPathPoints[i],
        p2 = correctPathPoints[i],
        dev = 10, // 10 percent deviation from correct is allowed
        similar = true;
    for (var i=0; i<p1.length; i++) {
      if (p1[i].x < p2[i].x - dev || p1[i].x > p2[i].x + dev
         || p1[i].y < p2[i].y - dev || p1[i].y > p2[i].y + dev) {
        similar = false;
        break;
      }
    }
    return similar;
  }
}