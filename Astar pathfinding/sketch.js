function removeFromArray(arr,elt) {
  for(var i=arr.length-1;i>= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}
function heuristic(a, b) {
  var d = dist(a.x, a.y, b.x, b.y);
  d *=1.0
  return d;
} 
var cols = 70;
var rows = 70;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var w, h;
var path=[];

function Cell(i,j){
  this.x = i;
  this.y = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;
  if(random(1)<.3){
    this.wall=true
  }
  this.show = function(r,g,b) {
  
    if (this.wall) {
      fill(0);
      noStroke();
    }
    else{
      fill(r,g,b)
      stroke(0);
    }
    rect(this.x * w, this.y * h, w - 1, h - 1);

  }
  
  this.addNeighbors = function(grid){
    var x = this.x;
    var y = this.y;
    // adjacent
    if (x < cols - 1) {
      this.neighbors.push(grid[x + 1][y]);
    }
    if (x > 0) {
      this.neighbors.push(grid[x - 1][y]);
    }
    if (y < rows - 1) {
      this.neighbors.push(grid[x][y + 1]);
    }
    if (y > 0) {
      this.neighbors.push(grid[x][y - 1]);
    }
    if (x > 0 && y > 0) {
      this.neighbors.push(grid[x - 1][y - 1]);
    }
    if (x < cols - 1 && y > 0) {
      this.neighbors.push(grid[x + 1][y - 1]);
    }
    if (x > 0 && y < rows - 1) {
      this.neighbors.push(grid[x - 1][y + 1]);
    }
    if (x < cols - 1 && y < rows - 1) {
      this.neighbors.push(grid[x + 1][y + 1]);
    }
  }
}




print(grid)
function setup() { 
  createCanvas(600, 600);
  console.log('A*');
  w = width / cols;
  h = height / rows;
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j);
    }
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }
  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  openSet.push(start);
}

function draw() {

  if (openSet.length > 0) {

    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }
    
    // Going through all cells in the openSet to determine the lowest score
    var current = openSet[winner];

    if (current === end) {
      noLoop();
      console.log('done');
    }

    removeFromArray(openSet, current);
    closedSet.push(current);
    // openSet.remove(current);
    var neighbors = current.neighbors;
    for (var i = 0; i < neighbors.length; i++) {
      // Go through the list of neighbors and check if they are in the closedSet
      var neighbor = neighbors[i];

      if (!closedSet.includes(neighbor) && !neighbor.wall){
        var tempG = current.g + heuristic(neighbor, current);

        // The algorithm could have walked to an alrady found point in a less efficient way
        // Currently the issue is that the neighbor isn't in openset 
        // console.log(neighbor,i,' has been visited');
        // At the beggining, all cells should be in the openset
        var newPath = false;
        if (openSet.includes(neighbor)) { 
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        }
        else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }
        
        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        } 
      }
    }
  }
  else {
    console.log('Done');
    noLoop();
    return;
  }
  background(255);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }

  for( var i = 0; i < closedSet.length; i++) {
    closedSet[i].show(255,0,0);
  }

  for (var i = 0; i < openSet.length; i++) {  
    openSet[i].show(0,255,0);
  }


  // Find the path
    path = [];
    var temp = current;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }

    for (var i = 0; i < path.length; i++) {
      path[i].show(color(0, 0, 255));
    }
  
  

}

