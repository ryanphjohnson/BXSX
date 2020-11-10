var addToCartButtons = [];
var cartCounters = [];
var pageLoadTimeAllowance = 6000;

chrome.runtime.onMessage.addListener(function (message) {
	if (message == 'buy') {
		buy();
	} else if (message == 'load') {
		checkForWinner();
	} else if (message == 'reload') {
		reload();
	}

	return true;

	function buy() {
		addToCartButtons = document.querySelectorAll('.add-to-cart.btn.btn-primary, #add-to-cart-button-ubb, .btn.btn-primary.btn-wide');
		cartCounters = document.querySelectorAll('.minicart-quantity, #nav-cart-count, .nav-complex-title span');
		if (!addToCartButtons.length || !cartCounters.length) {
			reload();
		}
	
		addToCartButtons.forEach((btn) => {
			btn.click();
		});
	
		setTimeout(function() {
			checkForWinner();
		}, pageLoadTimeAllowance);
	}

	function checkForWinner() {
		var winner = false;
		cartCounters.forEach((cart) => {
			winner = parseInt(cart.innerText) > 0;

			if (winner) winning();
			else reload();
		});
	}
	
	function reload() {
		setTimeout(function() {
			location.reload();
		}, pageLoadTimeAllowance);
	}
	
	// Loud Noises
	function winning() {
		chrome.runtime.sendMessage(chrome.runtime.id, "winner");
	}
	
});

chrome.runtime.sendMessage(chrome.runtime.id, "pageload");
