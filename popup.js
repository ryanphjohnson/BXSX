var buy = false;
var winningTab = null;

function startBuying() {
    buy = true;
    chrome.storage.local.set ({'BXSX': true});
    displayStatus();

    chrome.tabs.query({currentWindow: true}, function(tabs) {
        tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, 'buy');
        });
    });
}

function stopBuying() {
    buy = false;
    chrome.storage.local.set ({'BXSX': false});
    document.getElementById('status').innerHTML = "NOT BUYING";
}

function displayStatus() {
    if (buy) {
        document.getElementById('status').innerHTML = "BUYING";
    } else {
        document.getElementById('status').innerHTML = winningTab ? "TAB " + winningTab + " has it!" : "NOT BUYING";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get ('BXSX', function (val) {
        buy = val.BXSX;
        displayStatus();
    });
    document.getElementById('Start-Buying').addEventListener('click', startBuying);
    document.getElementById('Stop-Buying').addEventListener('click', stopBuying);
    chrome.runtime.onMessage.addListener(function (message, sender) {
        if (message == 'pageload') {
            if (buy) {
                chrome.tabs.sendMessage(sender.tab.id, 'buy');
            }
        }
        if (message == 'winner') {
            //buy = false; // Just in case, lets keep trying the other sites until we're through checkout
            document.getElementById('status').innerHTML = "TAB " + sender.tab.index + " has it!";
        }
    });

    chrome.tabs.query({currentWindow: true}, function(tabs) {
        tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, 'load');
        });
    });
});