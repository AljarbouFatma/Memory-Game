/*
 * Create a list that holds all of your cards
 */
let cardName = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube', 'anchor', 'anchor', 'paper-plane-o', 'paper-plane-o', 'bolt', 'bolt', 'bomb', 'bomb', 'diamond', 'diamond'],
	openCard = [],
	match = 0,
	moves = 0,
  // Useful selectors shortened
	$deck = $('.deck'),
	$scorePanel = $('#score-panel'),
	$moveNum = $('.moves'),
	$ratingStars = $('.fa-star'),
	$restart = $('.restart'),
	delay = 420,
	currentTimer,
	second = 0,
	$timer = $('.timer'),
	totalCard = cardName.length / 2,
	rank3stars = 12,
	rank2stars = 20,
	rank1stars = 30;
// Shuffle function from http://stackoverflow.com/a/2450976
//shuffle the list of cards using the provided "shuffle" method below
function shuffle(array) {
	let currentIndex = array.length, temporaryValue, randomIndex;
// While there remain elements to shuffle...
	while (0 !== currentIndex) {
    // Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
    // And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

// Initial Game to start
function initGame() {
	let cards = shuffle(cardName);
	$deck.empty();
  // The game starts with no matching cards and zero moves
	match = 0;
	moves = 0;
	$moveNum.text('0');
	$ratingStars.removeClass('fa-star-o').addClass('fa-star');
	for (let i = 0; i < cards.length; i++) {
		$deck.append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))
	}
  //set up the event listener for a card. If a card is clicked:
	addCardListener();

	resetTimer(currentTimer);
	second = 0;
	$timer.text(`${second}`)
	initTime();
};

// Set rating stars and final Score
function setRating(moves) {
	let rating = 3;
	if (moves > rank3stars && moves < rank2stars) {
		$ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
		rating = 2;
	} else if (moves > rank2stars && moves < rank1stars) {
		$ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
		rating = 1;
	} else if (moves > rank1stars) {
		$ratingStars.eq(0).removeClass('fa-star').addClass('fa-star-o');
		rating = 0;
	}
	return { score: rating };
};

// End  this Game
function endGame(moves, score) {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Congratulations!',
		text: 'With ' + moves + ' Moves and ' + score + ' Stars in ' + second + ' Seconds.',
		type: 'success',
		confirmButtonColor: '#02ccba',
		confirmButtonText: 'Play again!'
	}).then(function (isConfirm) {
		if (isConfirm) {
			initGame();
		}
	})
}

// Restart this Game
$restart.bind('click', function () {
      location.reload();
  });

  // This function allows each card to be validated that is an equal match to another card that is clicked on to stay open.
  // If cards do not match, both cards are flipped back over.
let addCardListener = function () {

	// to Card flip
	$deck.find('.card').bind('click', function () {
		let $this = $(this)

		if ($this.hasClass('show') || $this.hasClass('match')) { return true; }

		let card = $this.context.innerHTML;
		$this.addClass('open show');
		openCard.push(card);

		// Compare with openCard card
    //if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
		if (openCard.length > 1) {
			if (card === openCard[0]) {
				$deck.find('.open').addClass('match animated rubberBand');
				setTimeout(function () {
					$deck.find('.open').removeClass('open show animated rubberBand');
				});
        match++;
			}
      // if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
      else {
				$deck.find('.open').addClass('notmatch animated wobble');
				setTimeout(function () {
					$deck.find('.open').removeClass(' open show notmatch animated wobble');
				}, delay / 3);
			}
			openCard = [];
			moves++;
			setRating(moves);
			$moveNum.html(moves);
		}

		// End Game if match all cards
		if (totalCard === match) {
			setRating(moves);
			let score = setRating(moves).score;
			setTimeout(function () {
				endGame(moves, score);
			}, 500);
		}
	});
}

// Initiates the timer as soon as the game is loaded
function initTime() {
	currentTimer = setInterval(function () {
		$timer.text(`${second}`)
		second = second + 1
	}, 1000);
}
// Resets the timer when the game ends or is restarted
function resetTimer(timer) {
	if (timer) {
		clearInterval(timer);
	}
}

initGame();
