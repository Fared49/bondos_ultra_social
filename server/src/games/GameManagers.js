// TicTacToe Game Manager
export class TicTacToeGame {
  constructor(roomId, players) {
    this.roomId = roomId;
    this.players = players; // [player1Id, player2Id]
    this.board = Array(9).fill(null);
    this.currentPlayer = 0;
    this.winner = null;
    this.status = 'active'; // active, finished
    this.moves = [];
  }

  makeMove(playerId, position) {
    if (this.winner || this.status === 'finished') return { error: 'Game already finished' };
    if (this.players[this.currentPlayer] !== playerId) return { error: 'Not your turn' };
    if (this.board[position] !== null) return { error: 'Position taken' };

    const symbol = this.currentPlayer === 0 ? 'X' : 'O';
    this.board[position] = symbol;
    this.moves.push({ position, symbol, player: playerId });

    const win = this.checkWin();
    if (win) {
      this.winner = playerId;
      this.status = 'finished';
      return { state: this.board, winner: playerId, status: 'finished' };
    }

    if (this.moves.length === 9) {
      this.status = 'finished';
      return { state: this.board, winner: null, status: 'draw' };
    }

    this.currentPlayer = 1 - this.currentPlayer;
    return { state: this.board, currentPlayer: this.players[this.currentPlayer], status: 'active' };
  }

  checkWin() {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let line of lines) {
      if (this.board[line[0]] && this.board[line[0]] === this.board[line[1]] && this.board[line[0]] === this.board[line[2]]) {
        return true;
      }
    }
    return false;
  }

  getState() {
    return { board: this.board, currentPlayer: this.players[this.currentPlayer], winner: this.winner, status: this.status };
  }
}

// Snakes & Ladders Game
export class SnakesAndLaddersGame {
  constructor(roomId, players) {
    this.roomId = roomId;
    this.players = players.map(p => ({ id: p, position: 0 }));
    this.currentPlayerIndex = 0;
    this.winner = null;
    this.status = 'active';
  }

  rollDice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  movePlayer(playerId) {
    const playerIdx = this.players.findIndex(p => p.id === playerId);
    if (playerIdx !== this.currentPlayerIndex) return { error: 'Not your turn' };

    const dice = this.rollDice();
    const newPos = this.players[playerIdx].position + dice;

    if (newPos > 100) {
      return { positions: this.players.map(p => p.position), currentPlayer: this.players[this.currentPlayerIndex].id, status: 'active' };
    }

    this.players[playerIdx].position = this.applySnakesLadders(newPos);

    if (this.players[playerIdx].position === 100) {
      this.winner = playerId;
      this.status = 'finished';
      return { positions: this.players.map(p => p.position), winner: playerId, status: 'finished' };
    }

    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    return { positions: this.players.map(p => p.position), currentPlayer: this.players[this.currentPlayerIndex].id, status: 'active', dice };
  }

  applySnakesLadders(pos) {
    const snakes = { 99: 80, 92: 71, 87: 24, 62: 18, 56: 53, 49: 11 };
    const ladders = { 2: 38, 7: 14, 15: 26, 21: 42, 28: 84, 36: 44, 51: 67, 72: 91, 80: 99 };
    return snakes[pos] || ladders[pos] || pos;
  }

  getState() {
    return { positions: this.players.map(p => p.position), currentPlayer: this.players[this.currentPlayerIndex].id, winner: this.winner, status: this.status };
  }
}

// Simple Card Game
export class CardGame {
  constructor(roomId, players) {
    this.roomId = roomId;
    this.players = players.map(p => ({ id: p, hand: [], score: 0 }));
    this.deck = this.createDeck();
    this.table = [];
    this.currentPlayerIndex = 0;
    this.status = 'active';
    this.drawInitialHands();
  }

  createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let deck = [];
    for (let suit of suits) {
      for (let rank of ranks) {
        deck.push({ suit, rank });
      }
    }
    return deck.sort(() => Math.random() - 0.5);
  }

  drawInitialHands() {
    for (let player of this.players) {
      for (let i = 0; i < 5; i++) {
        if (this.deck.length > 0) player.hand.push(this.deck.pop());
      }
    }
  }

  playCard(playerId, cardIndex) {
    const playerIdx = this.players.findIndex(p => p.id === playerId);
    if (playerIdx !== this.currentPlayerIndex) return { error: 'Not your turn' };

    const card = this.players[playerIdx].hand[cardIndex];
    if (!card) return { error: 'Invalid card' };

    this.table.push(card);
    this.players[playerIdx].hand.splice(cardIndex, 1);

    if (this.players[playerIdx].hand.length === 0 && this.deck.length === 0) {
      this.status = 'finished';
      return { status: 'finished', winner: playerId };
    }

    if (this.deck.length > 0) this.players[playerIdx].hand.push(this.deck.pop());
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

    return { status: 'active', currentPlayer: this.players[this.currentPlayerIndex].id };
  }

  getState() {
    return {
      players: this.players.map(p => ({ id: p.id, handSize: p.hand.length, score: p.score })),
      table: this.table,
      currentPlayer: this.players[this.currentPlayerIndex].id,
      status: this.status,
    };
  }
}

// Guessing Game
export class GuessingGame {
  constructor(roomId, players, category = 'movie') {
    this.roomId = roomId;
    this.players = players.map(p => ({ id: p, guessed: false }));
    this.category = category;
    this.secret = this.getRandomSecret();
    this.guesser = players[0];
    this.describer = players[1];
    this.guesses = [];
    this.correctGuess = null;
    this.status = 'describing';
  }

  getRandomSecret() {
    const moviesTitles = ['Inception', 'Matrix', 'Avatar', 'Interstellar', 'Titanic'];
    const personDescriptions = ['A funny person who makes jokes', 'A serious scientist', 'A famous actor'];
    const secrets = this.category === 'movie' ? moviesTitles : personDescriptions;
    return secrets[Math.floor(Math.random() * secrets.length)];
  }

  submitGuess(playerId, guess) {
    if (playerId !== this.guesser) return { error: 'Only guesser can submit guesses' };
    this.guesses.push(guess);

    if (guess.toLowerCase() === this.secret.toLowerCase()) {
      this.correctGuess = guess;
      this.status = 'finished';
      return { correct: true, secret: this.secret, winner: this.guesser };
    }

    if (this.guesses.length >= 5) {
      this.status = 'finished';
      return { correct: false, secret: this.secret, status: 'finished' };
    }

    return { correct: false, guesses: this.guesses, status: 'describing' };
  }

  getState() {
    return {
      guesser: this.guesser,
      guesses: this.guesses,
      correctGuess: this.correctGuess,
      status: this.status,
    };
  }
}
