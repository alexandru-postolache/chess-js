var Chess = {
  letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  white: 'white',
  black: 'black',
  move: 'move',
  attack: 'attack',
  check: 'SAH!',
  checkMate: 'SAH-MAT!',
  checkId: '#check',
  lastTurn: 'black',
  firstTurn: 'white',
  isBlackKingInCheck: 0,
  isWhiteKingInCheck: 0,
  pinned: 'pinned',
  checked: 'checked',
  createBoard: function() {
    var table = "<table id='chessboard'></table>";
    var cellClass = '';
    $('body').append(table);
    table = $('#chessboard');
    for (i = 1; i <= 8; i++) {
      table.prepend('<tr id="row' + i + '"></tr>');
      for (j = 0; j <= 7; j++) {
        if ((i + j) % 2 == 0) {
          cellClass = "white";
        } else {
          cellClass = "black";
        }
        $('#chessboard tr#row' + i).append("<td id='" + Chess.letters[j] + i + "' class='" + cellClass + "'></td>");
      }
    }
    $('#chessboard').after("<div id='check'></div>");
  },
  initGame: function() {
    $('#chessboard').find('tr#row2 td').each(function() {
      $(this).html('<img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Chess_plt60.png">').data('piece', 'pawn').data('color', 'white').data('moved', 0);
    });
    $('#chessboard').find('tr#row7 td').each(function() {
      $(this).html('<img src="https://upload.wikimedia.org/wikipedia/commons/c/cd/Chess_pdt60.png">').data('piece', 'pawn').data('color', 'black').data('moved', 0);
    });
    $('#B1').html('<img src="https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg">').data('piece', 'knight').data('color', 'white');
    $('#G1').html('<img src="https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg">').data('piece', 'knight').data('color', 'white');
    $('#A1').html('<img src="https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg">').data('piece', 'rook').data('color', 'white');
    $('#H1').html('<img src="https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg">').data('piece', 'rook').data('color', 'white');
    $('#C1').html('<img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg">').data('piece', 'bishop').data('color', 'white');
    $('#F1').html('<img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg">').data('piece', 'bishop').data('color', 'white');
    $('#D1').html('<img src="https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg">').data('piece', 'queen').data('color', 'white');
    $('#E1').html('<img src="https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg">').data('piece', 'king').data('color', 'white');
    $('#A8').html('<img src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg">').data('piece', 'rook').data('color', 'black');
    $('#H8').html('<img src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg">').data('piece', 'rook').data('color', 'black');
    $('#B8').html('<img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg">').data('piece', 'knight').data('color', 'black');
    $('#G8').html('<img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg">').data('piece', 'knight').data('color', 'black');
    $('#C8').html('<img src="https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg">').data('piece', 'bishop').data('color', 'black');
    $('#F8').html('<img src="https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg">').data('piece', 'bishop').data('color', 'black');
    $('#D8').html('<img src="https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg">').data('piece', 'queen').data('color', 'black');
    $('#E8').html('<img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg">').data('piece', 'king').data('color', 'black');
    $('tr td img').draggable({
      revert: "invalid"
      //grid: [42, 42]
    });
  },
  play: function() {
    $('img').on("mousedown", function() {
      var id,row,column,color,selectedPiece,availablePosition,attackedCells,enemyKingPosition;
      id = $(this).parent().attr('id');
      row = id.substr(id.length - 1);
      column = id.substring(0,1);
      color = $(this).parent().data('color');
      selectedPiece = $('#' + id).data('piece');
      if(color != Chess.lastTurn) {
        if (selectedPiece != undefined && selectedPiece != '') {
          switch (selectedPiece) {
            case 'pawn':
              availablePosition = Chess.positionsForPawn(column,row,color,Chess.move);
              $(availablePosition).droppable({
                activeClass: "active",
                hoverClass: "hover",
                drop: function(event,ui) {
                    Chess.copyPieceToDestination(this,ui);
                    $('.ui-droppable').droppable("destroy");
                    Chess.verifyIfIsCheck(color,Chess.checked);
                    Chess.lastTurn = color;
                },
                deactivate: function(event,ui) {
                  $('.ui-droppable').droppable("destroy");
                }
              });
              break;
            case 'knight':
              availablePosition = Chess.positionsForKnight(column,row,color,Chess.move);
              $(availablePosition).droppable({
                  activeClass: "active",
                  hoverClass: "hover",
                  drop: function(event,ui) {
                      Chess.copyPieceToDestination(this,ui);
                      $('.ui-droppable').droppable("destroy");
                      Chess.verifyIfIsCheck(color,Chess.checked);
                      Chess.lastTurn = color;
                  },
                  deactivate: function(event,ui) {
                    $('.ui-droppable').droppable("destroy");
                  }
                });
              break;
            case 'bishop':
              availablePosition = Chess.positionsForBishop(column,row,color,Chess.move);
              $(availablePosition).droppable({
                activeClass: "active",
                hoverClass: "hover",
                drop: function(event,ui) {
                    Chess.copyPieceToDestination(this,ui);
                    $('.ui-droppable').droppable("destroy");
                    Chess.verifyIfIsCheck(color);
                    Chess.lastTurn = color;
                },
                deactivate: function(event,ui) {
                  $('.ui-droppable').droppable("destroy");
                }
              });
              break;
            case 'rook':
              availablePosition = Chess.positionsForRook(column,row,color,Chess.move);
              $(availablePosition).droppable({
                activeClass: "active",
                hoverClass: "hover",
                drop: function(event,ui) {
                    Chess.copyPieceToDestination(this,ui);
                    $('.ui-droppable').droppable("destroy");
                    Chess.verifyIfIsCheck(color,Chess.checked);
                    Chess.lastTurn = color;
                },
                deactivate: function(event,ui) {
                  $('.ui-droppable').droppable("destroy");
                }
              });
              break;
            case 'queen':
              availablePosition = Chess.positionsForQueen(column,row,color,Chess.move);
              $(availablePosition).droppable({
                activeClass: "active",
                hoverClass: "hover",
                drop: function(event,ui) {
                    Chess.copyPieceToDestination(this,ui);
                    $('.ui-droppable').droppable("destroy");
                    Chess.verifyIfIsCheck(color);
                    Chess.lastTurn = color;
                },
                deactivate: function(event,ui) {
                  $('.ui-droppable').droppable("destroy");
                }
              });
              break;
            case 'king':
              availablePosition = Chess.positionsForKing(column,row,color,Chess.move);
              $(availablePosition).droppable({
                activeClass: "active",
                hoverClass: "hover",
                drop: function(event,ui) {
                    Chess.copyPieceToDestination(this,ui);
                    $('.ui-droppable').droppable("destroy");
                    Chess.verifyIfIsCheck(color,Chess.checked);
                    Chess.lastTurn = color;
                },
                deactivate: function(event,ui) {
                  $('.ui-droppable').droppable("destroy");
                }
              });
              break;
          }
        }
      }
    });
  },
  positionsForKnight: function(column,row,color,scope) {
    if(scope == Chess.move) {
      console.log("COLUMN: " + column + ", ROW: " + row);
    }
    var availablePosition = [],distance2,distance1,columnNr,columnLetter,rowNr,columnNumber,i,j,k = 0;
    distance2 = [2,-2];
    distance1 = [1,-1];
    columnNr = Chess.letters.indexOf(column);
    columnLetter;
    rowNr,columnNumber;
    
    for(i = 0; i < distance2.length; i++ ) {
      for(j = 0; j < distance1.length; j++ ) {
        columnNumber = Number(columnNr) + distance2[i];
        rowNr = Number(row) + distance1[j];
        if(rowNr > 8 || rowNr < 1) {
          continue;
        }
        columnLetter = Chess.letters[columnNumber];
        
        if(columnLetter != undefined) {
          if(column != columnLetter && row != j) {
            if(scope == Chess.move) {
              if(Chess.isBlockedBySamePieceColor(columnLetter,rowNr,color)) {
                break;
              }
            }else { 
              if(Chess.isBlockedBySamePieceColor(columnLetter,rowNr,color)) {
                availablePosition[k] = columnLetter + rowNr;
                k++;
              }
            }
          }
          availablePosition[k] = columnLetter + rowNr;
          k++;
        }
      }
    }
    for(i = 0; i < distance2.length; i++ ) {
      for(j = 0; j < distance1.length; j++ ) {
        columnNumber = Number(columnNr) + distance1[i];
        rowNr = Number(row) + distance2[j];
        if(rowNr > 8 || rowNr < 1) {
          continue;
        }
        columnLetter = Chess.letters[columnNumber];
        if(columnLetter != undefined) {
          if(column != columnLetter && row != j) {
            if(scope == Chess.move) {
              if(Chess.isBlockedBySamePieceColor(columnLetter,rowNr,color)) {
                break;
              }
            }else { 
              if(Chess.isBlockedBySamePieceColor(columnLetter,rowNr,color)) {
                availablePosition[k] = columnLetter + rowNr;
                k++;
              }
            }
          }
          availablePosition[k] = columnLetter + rowNr;
          k++;
        }
      }
    }
      for(i = 0; i < availablePosition.length; i++) {
        availablePosition[i] = "#" + availablePosition[i];
      }
      availablePosition = availablePosition.join(",");

      if(scope == Chess.move) {
        availablePosition = availablePosition.split(',');
        pieceId = column + row;
        for(i = availablePosition.length - 1; i >= 0; i--) {
          isValidPosition = Chess.canMovePiece(availablePosition[i],pieceId,'knight',color);
          console.log("ESTE " + availablePosition[i] + " VALID POSITION: " + isValidPosition);
          if(!isValidPosition) {
            availablePosition.splice(i,1);
          } 
        }
        availablePosition = availablePosition.join(",");
      }

      return availablePosition;
  },
  positionsForBishop: function(column,row,color,scope,forQueen) {
    if(scope == Chess.move) {
      console.log("COLUMN: " + column + ", ROW: " + row);
    }
    var columnNumber,availablePosition = [],i,j,k = 0,piece;
    columnNumber = Chess.letters.indexOf(column);
    i = columnNumber;
      for(j = row; j <= 8; j++) {
        columnLetter = Chess.letters[i];
        if(column != columnLetter && row != j) {
          if(scope == Chess.move) {
            if(Chess.isBlockedBySamePieceColor(columnLetter,j,color)) {
              break;
            }
          }else {
            if(Chess.isBlockedBySamePieceColor(columnLetter,j,color)) {
              availablePosition[k] = columnLetter + j;
              k++;
              break;
            }
          }

          if(Chess.isBlockedByDifferentPieceColor(columnLetter,j,color)) {
            availablePosition[k] = columnLetter + j;
            k++;
            break;
          }
        }
        availablePosition[k] = columnLetter + j;
        k++;
        if(i < 7) {
          i++;
        }else {
          break;
        }
      }
    i = columnNumber;
      for(j = row; j <= 8; j++) {
        columnLetter = Chess.letters[i];
        if(column != columnLetter && row != j) {
          if(scope == Chess.move) {
            if(Chess.isBlockedBySamePieceColor(columnLetter,j,color)) {
              break;
            }
          }else {
            if(Chess.isBlockedBySamePieceColor(columnLetter,j,color)) {
              availablePosition[k] = columnLetter + j;
              k++;
              break;
            }
          }

          if(Chess.isBlockedByDifferentPieceColor(columnLetter,j,color)) {
            availablePosition[k] = columnLetter + j;
            k++;
            break;
          }
        }
        availablePosition[k] = columnLetter + j;
        k++;
        if(i >= 1) {
          i--;
        }else {
          break;
        }
      }
    i = columnNumber;
      for(j = row; j > 0; j--) {
        columnLetter = Chess.letters[i];
        if(column != columnLetter && row != j) {
          if(scope == Chess.move) {
            if(Chess.isBlockedBySamePieceColor(columnLetter,j,color)) {
              break;
            }
          }else {
            if(Chess.isBlockedBySamePieceColor(columnLetter,j,color)) {
              availablePosition[k] = columnLetter + j;
              k++;
              break;
            }
          }
          if(Chess.isBlockedByDifferentPieceColor(columnLetter,j,color)) {
            availablePosition[k] = columnLetter + j;
            k++;
            break;
          }
        }
        availablePosition[k] = columnLetter + j;
        k++;
        if(i >= 1) {
          i--;
        }else {
          break;
        }
      }
    i = columnNumber;
      for(j = row; j > 0; j--) {
        columnLetter = Chess.letters[i];
        if(column != columnLetter && row != j) {
          if(scope == Chess.move) {
            if(Chess.isBlockedBySamePieceColor(columnLetter,j,color)) {
              break;
            }
          }else {
            if(Chess.isBlockedBySamePieceColor(columnLetter,j,color)) {
              availablePosition[k] = columnLetter + j;
              k++;
              break;
            }
          }
          if(Chess.isBlockedByDifferentPieceColor(columnLetter,j,color)) {
            availablePosition[k] = columnLetter + j;
            k++;
            break;
          }
        }
        availablePosition[k] = columnLetter + j;
        k++;
        if(i < 7) {
          i++;
        }else {
          break;
        }
      }

    for(i = availablePosition.length - 1; i >= 0; i--) {
      if(availablePosition[i] == column+row) {
        availablePosition.splice(i, 1);
      }else {
        availablePosition[i] = "#" + availablePosition[i];
      }
    }
    availablePosition = availablePosition.join(",");

    if(scope == Chess.move) {
      if(forQueen === undefined) {
        piece = 'bishop';
      }else {
        piece = 'queen';
      }
      availablePosition = availablePosition.split(',');
      pieceId = column + row;
      for(i = availablePosition.length - 1; i >= 0; i--) {
        isValidPosition = Chess.canMovePiece(availablePosition[i],pieceId,piece,color);
        console.log("ESTE " + availablePosition[i] + " VALID POSITION: " + isValidPosition);
        if(!isValidPosition) {
          availablePosition.splice(i,1);
        } 
      }
      availablePosition = availablePosition.join(",");
    }

    return availablePosition;
  },
  positionsForRook: function(column,row,color,scope,forQueen) {
    if(scope == Chess.move) {
      console.log("COLUMN: " + column + ", ROW: " + row);
    }
    var columnNumber,i,j,k = 0,availablePosition = [];
    columnNumber = Chess.letters.indexOf(column);
    for(i = row; i <= 8; i++) {
      if(row != i) {
        if(scope == Chess.move) {
          if(Chess.isBlockedBySamePieceColor(column,i,color)) {
            break;
          }
        }else {
           if(Chess.isBlockedBySamePieceColor(column,i,color)) {
            availablePosition[k] = column + i;
            k++;
            break;
           }
        }
        if(Chess.isBlockedByDifferentPieceColor(column,i,color)) {
          availablePosition[k] = column + i;
          k++;
          break;
        }
      }
      availablePosition[k] = column + i;
      k++;
    }
    for(i = row; i > 0; i--) {
      if(row != i) {
        if(scope == Chess.move) {
          if(Chess.isBlockedBySamePieceColor(column,i,color)) {
            break;
          }
        }else {
           if(Chess.isBlockedBySamePieceColor(column,i,color)) {
            availablePosition[k] = column + i;
            k++;
            break;
           }
        }
        if(Chess.isBlockedByDifferentPieceColor(column,i,color)) {
          availablePosition[k] = column + i;
          k++;
          break;
        }
      }
      availablePosition[k] = column + i;
      k++;
    }
    for(i = columnNumber; i <= 7; i++) {
      columnLetter = Chess.letters[i];
      if(column != columnLetter) {
        if(scope == Chess.move) {
          if(Chess.isBlockedBySamePieceColor(columnLetter,row,color)) {
            break;
          }
        }else {
          if(Chess.isBlockedBySamePieceColor(columnLetter,row,color)) {
            availablePosition[k] = columnLetter + row;
            k++;
            break;
          }
        }
        if(Chess.isBlockedByDifferentPieceColor(columnLetter,row,color)) {
          availablePosition[k] = columnLetter + row;
          k++;
          break;
        }
      }
      availablePosition[k] = columnLetter + row;
      k++;
    }
    for(i = columnNumber; i >= 0; i--) {
      columnLetter = Chess.letters[i];
      if(column != columnLetter) {
        if(scope == Chess.move) {
          if(Chess.isBlockedBySamePieceColor(columnLetter,row,color)) {
            break;
          }
        }else {
          if(Chess.isBlockedBySamePieceColor(columnLetter,row,color)) {
            availablePosition[k] = columnLetter + row;
            k++;  
            break;
          }
        }

        if(Chess.isBlockedByDifferentPieceColor(columnLetter,row,color)) {
          availablePosition[k] = columnLetter + row;
          k++;
          break;
        }
      }
      availablePosition[k] = columnLetter + row;
      k++;
    }

    for(i = availablePosition.length - 1; i >= 0; i--) {
      if(availablePosition[i] == column+row) {
        availablePosition.splice(i, 1);
      }else {
        availablePosition[i] = "#" + availablePosition[i];
      }
    }
    availablePosition = availablePosition.join(",");

    if(scope == Chess.move) {
      if(forQueen === undefined) {
        piece = 'rook';
      }else {
        piece = 'queen';
      }
      availablePosition = availablePosition.split(',');
      pieceId = column + row;
      for(i = availablePosition.length - 1; i >= 0; i--) {
        isValidPosition = Chess.canMovePiece(availablePosition[i],pieceId,piece,color);
        console.log("ESTE " + availablePosition[i] + " VALID POSITION: " + isValidPosition);
        if(!isValidPosition) {
          availablePosition.splice(i,1);
        } 
      }
      availablePosition = availablePosition.join(",");
    }

    return availablePosition;
  },
  positionsForQueen: function(column,row,color,scope) {
    var forQueen = 1;
    var bishopPositions = Chess.positionsForBishop(column,row,color,scope,forQueen);
    var rookPositions = Chess.positionsForRook(column,row,color,scope,forQueen);
    var availablePosition;
    if(bishopPositions != '' && rookPositions != '') {
        availablePosition = bishopPositions + "," + rookPositions;
    }else if(bishopPositions != '' && rookPositions == '') {
        availablePosition = bishopPositions;
    }else if(bishopPositions == '' && rookPositions != '') {
        availablePosition = rookPositions;
    }else {
      availablePosition = '';
    }

    return availablePosition;
  },
  positionsForKing: function(column,row,color,scope) {
    if(scope == Chess.move) {
      console.log("COLUMN: " + column + ", ROW: " + row);
    }
    var columnNumber,i,j,k = 0,availablePosition = [],bottom,top,left,right;
    columnNumber = Chess.letters.indexOf(column);
    bottom = row - 1;
    if(bottom <= 0) {
      bottom++;
    }
    top = Number(row) + 1;
    if(top >= 9) {
      top--;
    }
    left = columnNumber - 1;
    if(left < 0) {
      left++;
    }
    right = columnNumber + 1;
    if(right >= 8) {
      right++;
    }
    for(i = bottom; i <= top; i++) {
      for(j = left; j <= right; j++) {
        columnLetter = Chess.letters[j];
        if(scope == Chess.move) {
          if(Chess.isBlockedBySamePieceColor(columnLetter,i,color)) {
            continue;
          }
        }else {
          if(Chess.isBlockedBySamePieceColor(columnLetter,i,color)) {
            availablePosition[k] = columnLetter + i;
            k++;
            continue;
          }
        }

        availablePosition[k] = columnLetter + i;
        k++;
      }
    }
    if(scope == Chess.move) {
      var attackedCells = Chess.verifyAttackedCellsByEnemy(color);
      attackedCells = attackedCells.split(',');
    }
    for(i = availablePosition.length - 1; i >= 0; i--) {
      if(availablePosition[i] == column+row) {
        availablePosition.splice(i, 1);
      }else {
        availablePosition[i] = "#" + availablePosition[i];
      }
    }
    if(scope == Chess.move) {
      for(i = availablePosition.length - 1; i >= 0; i--) {
        for(j = 0; j <= attackedCells.length - 1; j++) {
          if(availablePosition[i] == attackedCells[j]) {
            availablePosition.splice(i,1);
          }
        }
      }
    }
    availablePosition = availablePosition.join(",");
    return availablePosition;
  },
  positionsForPawn: function(column,row,color,scope) {
    if(scope == Chess.move) {
      console.log("COLUMN: " + column + " ROW: " + row);
    }
    row = Number(row);
    var availablePosition = [],sidesPosition = [], moved,i,k = 0,isValidPosition;
    moved = $('#' + column + row).data('moved');
    if(color == Chess.white) { // FOR WHITE PAWNS
      if (moved == 0) {
        for(i = row + 1; i <= row + 2; i++) {
          if(row != i) {
            if(Chess.isBlockedBySamePieceColor(column,i,color) || Chess.isBlockedByDifferentPieceColor(column,i,color)) {
              break;
            }
          }
          availablePosition[k] = column + i;
          k++;
        }  
      }else {
        i = row + 1;
          if(!Chess.isBlockedBySamePieceColor(column,i,color) && !Chess.isBlockedByDifferentPieceColor(column,i,color)) {
            availablePosition[k] = column + i;
            k++;
          }
      }
    }else { // FOR BLACK PAWNS
      if (moved == 0) {
        for(i = row - 1; i >= row - 2; i--) {
          if(row != i) {
            if(Chess.isBlockedBySamePieceColor(column,i,color) || Chess.isBlockedByDifferentPieceColor(column,i,color)) {
              break;
            }
          }
          availablePosition[k] = column + i;
          k++;
        }  
      }else {
        i = row - 1;
          if(!Chess.isBlockedBySamePieceColor(column,i,color) && !Chess.isBlockedByDifferentPieceColor(column,i,color)) {
            availablePosition[k] = column + i;
            k++;
          }
      }
    }
    
    sidesPosition = Chess.pawnPositionsForEnemiesOnSides(column,row,color);

    for(i = availablePosition.length - 1; i >= 0; i--) {
      availablePosition[i] = "#" + availablePosition[i];
    }
    availablePosition = availablePosition.join(",");
    if(sidesPosition != '') {
      if(availablePosition != '') {
        availablePosition = availablePosition + "," + sidesPosition;
      }else {
        availablePosition = sidesPosition;
      }
    }

    availablePosition = availablePosition.split(',');
    pieceId = column + row;
    for(i = availablePosition.length - 1; i >= 0; i--) {
      isValidPosition = Chess.canMovePiece(availablePosition[i],pieceId,'pawn',color);
      console.log("ESTE " + availablePosition[i] + " VALID POSITION: " + isValidPosition);
      if(!isValidPosition) {
        availablePosition.splice(i,1);
      } 
    }
    availablePosition = availablePosition.join(",");

    return availablePosition;
  },
  isBlockedBySamePieceColor: function(column,row,color) {
    var data = $('#' + column + row).data('color');
    if(data != undefined && data != '') {
      if(data == color) {
        return true;
      }else {
        return false;
      }
    }
  },
  isBlockedByDifferentPieceColor: function(column,row,color) {
    var data = $('#' + column + row).data('color');
    if(data != undefined && data != '') {
      if(data != color) {
        return true;
      }else {
        return false;
      }
    } 
  },
  copyPieceToDestination: function(destination,piece) {
    var parent = piece.draggable.parent();
    var data = parent.data();
    parent.removeData();
    $(destination).html(piece.draggable[0]).data(data);
    piece.draggable.css({"top":0,"left":0});
    $(destination).data('moved',1);
  },
  pawnPositionsForEnemiesOnSides: function(column,row,color) {
    row = Number(row);
    var toNextRow,availablePosition = [],k = 0,columnNumber,leftColumnNumber,leftColumnLetter,rightColumnNumber,rightColumnLetter,nextRow,upperLeftColor,upperRightColor;
    if(color == Chess.white) {
      toNextRow = 1;
    }else {
      toNextRow = -1;
    }
    columnNumber = Chess.letters.indexOf(column);
    leftColumnNumber = columnNumber - 1;
    leftColumnLetter = Chess.letters[leftColumnNumber];
    rightColumnNumber = columnNumber + 1;
    rightColumnLetter = Chess.letters[rightColumnNumber];
    nextRow = row + toNextRow;
    upperLeftColor = $('#' + leftColumnLetter + nextRow).data('color');
    upperRightColor = $('#' + rightColumnLetter + nextRow).data('color');
    if(upperLeftColor != undefined && upperLeftColor != '') {
      if(upperLeftColor != color) {
        availablePosition[k] = leftColumnLetter + nextRow;
        k++;
      }
    }
    if(upperRightColor != undefined && upperRightColor != '') {
      if(upperRightColor != color) {
        availablePosition[k] = rightColumnLetter + nextRow;
        k++;
      }
    }
    for(i = availablePosition.length - 1; i >= 0; i--) {
      availablePosition[i] = "#" + availablePosition[i];
    }
    availablePosition = availablePosition.join(",");
    return availablePosition;
  },
  cellsAttackedByPawn: function(column,row,color) {
    row = Number(row);
    var toNextRow,availablePosition = [],k = 0,columnNumber,leftColumnNumber,rightColumnNumber,rightColumnLetter,leftColumnLetter,nextRow;
    if(color == Chess.white) {
      toNextRow = 1;
    }else {
      toNextRow = -1;
    }
    columnNumber = Chess.letters.indexOf(column);
    leftColumnNumber = columnNumber - 1;
    leftColumnLetter = Chess.letters[leftColumnNumber];
    rightColumnNumber = columnNumber + 1;
    rightColumnLetter = Chess.letters[rightColumnNumber];
    nextRow = row + toNextRow;
    if(rightColumnNumber <=7 && (nextRow >= 1 && nextRow <= 8)) {
      availablePosition[k] = rightColumnLetter + nextRow;
      k++;
    }
    if(leftColumnNumber >= 0 && (nextRow >= 1 && nextRow <= 8)) {
      availablePosition[k] = leftColumnLetter + nextRow;
      k++;
    }

    for(i = 0; i <= availablePosition.length - 1; i++) {
      availablePosition[i] = "#" + availablePosition[i];
    }
    availablePosition = availablePosition.join(",");
    return availablePosition;
  },
  verifyAttackedCellsByEnemy: function(color) {
    var attackedCells = '',k = 0,otherColor,positions,id,column,row,piece;
    $('td').each(function() {
      otherColor = $(this).data('color');

      if(otherColor != undefined && otherColor != '') {
        if(color != otherColor) {
          //  console.log("SE VERIFICA PATRATELE ATACATE DE " + otherColor);
          id = $(this).attr('id');
          column = id.substring(0,1);
          row = id.substring(1,2);
          piece = $(this).data('piece');
          //console.log('PE POZITIA ' + column + row + " SE AFLA PIESA " + piece + " DE CULOARE " + otherColor);
          if(piece != 'pawn') {
            piece = Chess.helpers.capitalizeFirstLetter(piece);
            if((positions = Chess['positionsFor' + piece](column,row,otherColor,Chess.attack)) != '' && positions != ',') {
              attackedCells += positions;
              attackedCells += ',';
            }
          }
          if(piece == 'pawn') {
            attackedCells += Chess.cellsAttackedByPawn(column,row,otherColor);
            attackedCells += ',';
          }
        }
      }
    });
      attackedCells = attackedCells.substring(0,attackedCells.length - 1);
      return attackedCells;
  },
  getEnemyKingPosition: function(color) {
    var id,piece,otherColor;
    $('td').each(function(){
      piece = $(this).data('piece');
      if(piece == 'king') {
        otherColor = $(this).data('color');
        if(color != otherColor) {
          id = $(this).attr('id');
          id = "#" + id;
        }
      }
    });
    return id;
  },
  verifyIfIsCheck: function(color,scope) {
    var selectedPiece,id,column,row,attackedCells,enemyKingPosition,otherColor;
    if(color == Chess.white) {
      otherColor = Chess.black;
    }else if(color == Chess.black){
      otherColor = Chess.white;
    }
    attackedCells = Chess.verifyAttackedCellsByEnemy(otherColor);
    attackedCells = attackedCells.split(',');
    enemyKingPosition = Chess.getEnemyKingPosition(color);
    otherColor = Chess.helpers.capitalizeFirstLetter(otherColor);
    if(attackedCells.indexOf(enemyKingPosition) != -1) {
      if(scope != Chess.pinned) {
        $(Chess.checkId).html(Chess.check);
        Chess['is' + otherColor + 'KingInCheck'] = 1;
        return 1;
      }else {
        return 1;
      }
    }else {
      if(scope != Chess.pinned) {
        $(Chess.checkId).html('');
        Chess['is' + otherColor + 'KingInCheck'] = 0;
        return 0;
      }else {
        return 0;
      }
    }
  },
  canMovePiece: function(destinationId,pieceId,piece,color) {
    var destinationColumn,destinationRow,pieceColumn,pieceRow,canMove,isCheck,otherColor,takenPositionPiece,takenPositionColor;
    if(color == Chess.white) {
      otherColor = Chess.black;
    }else if(color == Chess.black){
      otherColor = Chess.white;
    }
    destinationColumn = destinationId.substring(1,2);
    destinationRow = destinationId.substring(2,3);
    pieceColumn = pieceId.substring(0,1);
    pieceRow = pieceId.substring(1,2);
    $('#' + pieceColumn  + pieceRow).data('piece','').data('color','');
    takenPositionPiece = $('#' + destinationColumn + destinationRow).data('piece');
    takenPositionColor = $('#' + destinationColumn + destinationRow).data('color')
    console.log(takenPositionColor +" " + takenPositionColor);
    $('#' + destinationColumn + destinationRow).data('piece',piece).data('color',color);
    isCheck = Chess.verifyIfIsCheck(otherColor,Chess.pinned)
    if(isCheck) {
      canMove = 0;
    }else {
      canMove = 1;
    }
    $('#' + pieceColumn + pieceRow).data('piece',piece).data('color',color);
    if(takenPositionColor != undefined) {
      $('#' + destinationColumn + destinationRow).data('color',takenPositionColor);
    }else {
      $('#' + destinationColumn + destinationRow).data('color','');
    }
    if(takenPositionPiece != undefined) {
       $('#' + destinationColumn + destinationRow).data('piece',takenPositionPiece);
    }else {
       $('#' + destinationColumn + destinationRow).data('piece','');
    }
    return canMove;
  },
  helpers: {
    capitalizeFirstLetter: function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }
}

Chess.createBoard();
Chess.initGame();
Chess.play();
