class Maze {

      constructor({ audio, assets, width, height, cellSize }){
        this.width = width;
        this.height = height;
        this.audio = audio;
        this.assets = assets;
        this.startPos = { x: Math.random() * width | 0, y: Math.random() * height | 0 };
        this.cellSize = cellSize;

        this.direction = ["N","S","E","W"];

        this.exit = {
          position: { x: 0, y: 0 },
        };

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

        this.deadEnds = [];

        this.opposite = {
            "N": "S",
            "S": "N",
            "E": "W",
            "W": "E"
        };

      }

      create(){
            this.cell = [];
            this.grid = [];

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

            for(var x = 0; x < this.grid.length; x++){
              for(var y = 0; y < this.grid[x].length; y++){
                if( this.grid[x][y].reduce( (a,b) => a+b ) === 3 ){
                  this.deadEnds.push( { x, y } );
                }
              }
            }

            var pickFarthestIndex = this.pickFarthestDeadend();

            if( pickFarthestIndex < 0 ){
              this.create();
            }else{
              this.exit.isExit = true;
              this.exit.position = this.deadEnds[ pickFarthestIndex ];
              this.exit.source = this.audio.createBufferSource();
              this.exit.volume = this.audio.createGain();
              this.exit.panner = new BinauralFIR({audioContext: this.audio});
      				this.exit.panner.HRTFDataset = hrtfs;
      				this.exit.source.connect(this.exit.volume);
      				this.exit.volume.connect(this.exit.panner.input);
      				this.exit.panner.connect(this.audio.destination);
      				this.exit.source.loop = true;
              this.exit.source.buffer = this.assets['./sounds/exit.wav'];
            }
      }

      pickFarthestDeadend(){
        var indexFarthest = -1;
        var vecLen = 0;

        for( var i = 0; i < this.deadEnds.length; i++ ){
          var v = this.deadEnds[i];
          var nx = v.x - this.startPos.x;
          var ny = v.y - this.startPos.y;
          var currLen = nx * nx + ny * ny;

          if( vecLen < currLen ){
            vecLen = currLen;
            indexFarthest = i;
          }
        }

        return indexFarthest;
      }

      render( parentNode ){
        parentNode.innerHTML = "";
        parentNode.style.width = this.width * this.cellSize + "px";
        parentNode.style.height = this.height * this.cellSize + "px";

        for(var x = 0; x < this.grid.length; x++){
          for(var y = 0; y < this.grid[x].length; y++){
            var d = document.createElement('div');
            d.classList.add('maze-cell');
            d.style.width = this.cellSize + "px";
            d.style.height = this.cellSize + "px";
            if(this.grid[x][y]){
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
