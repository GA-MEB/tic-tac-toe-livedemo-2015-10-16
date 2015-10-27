
var renderMessage = function(text){
  $("#messages").text(text);
}

var renderBoard = function(board){ // assume board is an array of strings
  $(".board > div > span").each(function(index){
    $(this).text(board[index]);
  });
  renderMessage("");
};

$(document).ready(function(){
  // Setup
  $("#new-game").hide();

  // Click handlers
  $(".board > div").on('click', function(event){
    var index = $(".board > div").index(event.target);
    game.makeMove(index, game.currentPlayer(), function(){
      renderBoard(game.board);
      var winner = game.getWinner();
      if (winner === "X" || winner === "O") {
        renderMessage("The winner.... is " + winner + "!");
        $("#new-game").show();
      } else if (winner === "Tie") {
        renderMessage("It's a tie!");
        $("#new-game").show();
      }
    });
  });

  $("#auth").on('click', function(){
    session.login($("#email").val(), $("#password").val(), function(){
      game.createGame();
      $(".modal").hide();
    });
  });

  $("#load-game").on('click', function(){
    game.loadGame($("#game-id").val(), function(board){
      renderBoard(game.board);
    });
  });

  $("#new-game").on('click', function(){
    game.createGame(function(){
      renderBoard(game.board);
      $("#new-game").hide();
    });
  });

});
