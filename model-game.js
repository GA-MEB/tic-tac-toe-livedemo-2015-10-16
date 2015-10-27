var game = {
  gameId: null,
  board: ['','','','','','','','',''],
  gameOver: false,
  countBoard: function(str){
    return game.board.filter(function(el){return el === str}).length;
  },
  currentPlayer: function(){
    return game.countBoard("X") > game.countBoard("O")? "O" : "X";
  },
  resetBoard: function(){
    board = ['','','','','','','','',''];
  },
  getListOfGames: function(){
    tttapi.listGames(session.token, function(err, data){
      if (err) {console.error(err);}
      console.log(data);
    });
  },
  loadGame: function(gameId, cb){
    tttapi.showGame(gameId, session.token, function(err, data){
      if (err) { console.error(err); }
      game.board = data.game.cells;
      game.gameId = data.game.id;
      game.gameOver = data.game.over;
      cb();
    });
  },
  createGame: function(cb){
    tttapi.createGame(session.token, function(err, data){
      if (err) { console.error(err); }
      console.log(data);
      game.board = data.game.cells;
      game.gameId = data.game.id;
      game.gameOver = data.game.over;
      if(cb) {cb();}
    });
  },
  makeMove: function(index, player, cb){
    if (game.board[index] !== '' || game.gameOver) {return;}
    game.board[index] = player;
    if (game.getWinner() !== null) { game.gameOver = true; }
    var moveData = {
      "game": {
        "cell": {
          "index": index,
          "value": player
        },
        "over": game.gameOver
      }
    };
    tttapi.markCell(game.gameId, moveData, session.token, function(err, data){
      cb();
    });
  },

  /// GAME LOGIC
  getWinner: function(){
    if (game.isWinner("X")) { return "X"; }
    if (game.isWinner("O")) { return "O"; }
    if (game.noMovesLeft()) { return "Tie";}
    return null;
  },
  noMovesLeft: function(){
    return game.countBoard('') === 0;
  },
  isWinner: function(player){
    return game.areAllEqualTo(player, 0, 1, 2) ||
           game.areAllEqualTo(player, 3, 4, 5) ||
           game.areAllEqualTo(player, 6, 7, 8) ||
           game.areAllEqualTo(player, 0, 3, 6) ||
           game.areAllEqualTo(player, 1, 4, 7) ||
           game.areAllEqualTo(player, 2, 5, 8) ||
           game.areAllEqualTo(player, 0, 4, 8) ||
           game.areAllEqualTo(player, 2, 4, 6);
  },
  areAllEqualTo: function(player, indexOne, indexTwo, indexThree){
    var board = game.board;
    return (board[indexOne] === player) &&
           (board[indexTwo] === player) &&
           (board[indexThree] === player);
  }
};
