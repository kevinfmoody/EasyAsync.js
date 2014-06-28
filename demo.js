var log = function(string) {
  document.getElementsByTagName('body')[0].innerHTML += '<div>' + string + '</div>';
};

var simulatedNetworkCall = function(cb) {
  setTimeout(cb, 500 + Math.random() * 1000);
};

var apple = function() {
  EasyAsync.after(['pear'], function() {
    var finishApple = EasyAsync.start('apple');

    log('Eating apple. Pear should be eaten.');
    
    simulatedNetworkCall(function() {
      log('1 of 1 apple eaten.');
      finishApple();
    });
  });
};

var banana = function() {
  var finishBanana = EasyAsync.start('banana');

  log('Eating banana.');

  simulatedNetworkCall(function() {
    log('1 of 1 banana eaten.');
    finishBanana();
  });
};

var pear = function() {
  EasyAsync.after(['banana', 'peaches', 'strawberries'], function() {
    var finishPear = EasyAsync.start('pear');

    log('Eating pear. Banana, peaches, and strawberries should be eaten.');

    simulatedNetworkCall(function() {
      log('1 of 1 pear eaten.');
      finishPear();
    });
  });
};

var peaches = function() {
  var finishPeach = EasyAsync.start('peaches', 2);

  var counter = 0;
  log('Eating peaches.');

  simulatedNetworkCall(function() {
    log(++counter + ' of 2 peaches eaten.');
    finishPeach();
  });

  simulatedNetworkCall(function() {
    log(++counter + ' of 2 peaches eaten.');
    finishPeach();
  });
};

var oranges = function() {
  EasyAsync.after(['strawberries'], function() {
    var finishOrange = EasyAsync.start('oranges', 3);

    var counter = 0;
    log('Eating oranges. Strawberries should be eaten.');

    simulatedNetworkCall(function() {
      log(++counter + ' of 3 oranges eaten.');
      finishOrange();

      simulatedNetworkCall(function() {
        log(++counter + ' of 3 oranges eaten.');
        finishOrange();
      });
    });

    simulatedNetworkCall(function() {
      log(++counter + ' of 3 oranges eaten.');
      finishOrange();
    });
  });
};

var strawberries = function() {
  var finishStrawberry = EasyAsync.start('strawberries', 4);

  var counter = 0;
  log('Eating strawberries.');

  simulatedNetworkCall(function() {
    log(++counter + ' of 4 strawberries eaten.');
    finishStrawberry();

    simulatedNetworkCall(function() {
      log(++counter + ' of 4 strawberries eaten.');
      finishStrawberry();
    });
  });

  simulatedNetworkCall(function() {
    log(++counter + ' of 4 strawberries eaten.');
    finishStrawberry();

    simulatedNetworkCall(function() {
      log(++counter + ' of 4 strawberries eaten.');
      finishStrawberry();
    });
  });
};

(function() {

  apple();
  banana();
  pear();
  peaches();
  oranges();
  strawberries();

})();