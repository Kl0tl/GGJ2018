class Maze {

      constructor( _width, _height ){
        this.width = _width;
        this.height = _height;

        this.startPos = { x: 0, y:0 };
        this.cell = [];

        this.grid = [];

        this.direction = ["N","S","E","W"];

        this.dirValue = {
            "N": [1,0,0,0],
            "S": [0,1,0,0],
            "E": [0,0,1,0],
            "W": [0,0,0,1]
        };

        this.dataDir = {
            "N": {x:0, y:-1},
            "S": {x:0, y:1},
            "E": {x:1, y:0},
            "W": {x:-1, y:0}
        };

        this.opposite = {
            "N": "S",
            "S": "N",
            "E": "W",
        "W": "E"
        };

      }

      create(){
            for(var i = 0; i < this.height; i++){
                  this.grid[i] = [];
              for(var j = 0; j < this.width; j++){
                  this.grid[i][j] = null;
              }
            }

            this.cell.push( this.startPos );

            var t = 0;
            while(this.cell.length > 0){
                  var index = this.cell.length -1;
              var currentCell = this.cell[index];

              var dir = this.direction.sort(function(){ return Math.random() < .5; });

              for(var i = 0; i < dir.length; i++){
                var pickDir = dir[i];
                var nx = currentCell.x + this.dataDir[pickDir].x;
                var ny = currentCell.y + this.dataDir[pickDir].y;

                if(nx >= 0 && nx < this.width && ny >= 0 && ny < this.height && !this.grid[ny][nx]){
                  if(this.grid[currentCell.y][currentCell.x]){
                        this.grid[currentCell.y][currentCell.x] = this.grid[currentCell.y][currentCell.x].map(
                          (function(e,i){
                              return !!e + this.dirValue[pickDir][i];
                          }).bind(this)
                        );
                  }else{
                        this.grid[currentCell.y][currentCell.x] = this.dirValue[pickDir];
                  }

                  this.grid[ny][nx] = this.dirValue[ this.opposite[ pickDir ] ];
                  this.cell.push({x:nx, y:ny});
                  index = null;
                  break;
                }
              }

              if(index != null) {
                  this.cell.splice(index, 1);
              }
            }
      }

      render( parentNode ){
        parentNode.innerHTML = "";
        parentNode.style.width = this.width * 10 + "px";
        parentNode.style.height = this.height * 10 + "px"
        var m = 0;
        for(var x = 0; x < this.grid.length; x++){
          for(var y = 0; y < this.grid[x].length; y++){
            var d = document.createElement('div');
            if(this.grid[x][y]){
             // if(sx == x && sy == y) d.style.backgroundColor = "#0F0";
             // if(ex == x && ey == y) d.style.backgroundColor = "#F00";
             if(!this.grid[x][y][0]) d.style.borderTop = "1px solid black";
             if(!this.grid[x][y][1]) d.style.borderBottom = "1px solid black";
             if(!this.grid[x][y][2]) d.style.borderRight = "1px solid black";
             if(!this.grid[x][y][3]) d.style.borderLeft = "1px solid black";
             d.id = "_"+x+"_"+y;
              parentNode.appendChild(d);
           }
         }
      }
    }
}