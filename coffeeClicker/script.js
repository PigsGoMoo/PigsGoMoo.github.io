/* eslint-disable no-alert */
// Buttons here
const saveGameButton = document.getElementById('save');
const resetGameButton = document.getElementById('resetGame');
const upgradeClicksButton = document.getElementById('upgrade_clicks');
const resetConfirmButton = document.getElementById('resetConfirm');
const resetDenyButton = document.getElementById('resetDeny');
const caffeineBoostButton = document.getElementById('caffeine_boost');
let boost = false;

// Initiate clickData object for click upgrades.
let clickData = {
  amount: 1,
  qty: 0,
  price: 200,
};

let caffeineBoostData = {
  price: 5000,
};
/**************
 *   SLICE 1
 **************/
// Functions start here

// Generic update UI functions

function updateUI(data) {
  renderProducers(data);
  updateCPSView(data.totalCPS);
  updateCoffeeView(data.coffee);
  // I don't think I need to add this part, but just in case.
  document.getElementById('per_click').innerText = clickData.amount;
  document.getElementById('click-upgrade').innerText = clickData.price;
}
function updateCoffeeView(coffeeQty) {
  // your code here
  const counterHTML = document.getElementById('coffee_counter');

  counterHTML.innerText = coffeeQty;
}

function clickCoffee(data) {
  // your code here
  if (boost) {
    data.coffee += clickData.amount * 2;
  } else {
    data.coffee += clickData.amount;
  }
  unlockProducers(data.producers, data.coffee);
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/
// Unlocking producers here
function unlockProducers(producers, coffeeCount) {
  // your code here
  producers.forEach((producer) => {
    const unlockPrice = producer.price / 2;
    if (coffeeCount >= unlockPrice) {
      producer.unlocked = true;
    }
  });
}

function unlockedProducerUpgrades(producers, coffeeCount) {
  producers.forEach((producer) => {
    const unlockPrice = producer.upgradePrice / 2;
    if (coffeeCount >= unlockPrice) {
      producer.upgradeUnlock = true;
    }
  });
}

function getUnlockedProducers(data) {
  // your code here
  let unlockedProducers = [];
  unlockProducers(data.producers, data.coffee);
  // May as well unlock upgrades here, too.
  unlockedProducerUpgrades(data.producers, data.coffee);
  data.producers.forEach((producer) => {
    if (producer.unlocked === true) {
      unlockedProducers.push(producer);
    }
  });
  return unlockedProducers;
}

function makeDisplayNameFromId(id) {
  // your code here
  // Golfing!
  return id // Take id
    .split('_') // split it into array by the underscore
    .map((word) => {
      // Capitalize first letter in each word of array + return
      return word[0].toUpperCase() + word.slice(1);
    })
    .join(' '); // rejoin the array with a space in between each word.
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
// Make the producer HTML here.
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  containerDiv.id = `${producer.id}`;
  const currentCost = producer.price;
  // TODO: Fix the buy button for the upgrade to make them better aligned.
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
    <button type="button" id="sel_${producer.id}">Sell</button>
  </div>
  <div class="producer-column" id="${producer.id}_end">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function makeProducerUpgradeDiv(producer) {
  // Not gonna lie, I modelled this after the function above.
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer-upgrade-column';
  const upgradeName = producer.upgrade;
  const upgradeCost = producer.upgradePrice;
  const upgradeAmt = producer.upgradeQty;
  // Reminder to myself to leave the button id with only 3 characters + underscore
  // so that it still works with the upgrade function we've already made.
  const html = `
    <div class="upgrade-name" align="center">${upgradeName}</div>
    <div class="upgrade-descrip">Doubles the Coffee/second output of ${makeDisplayNameFromId(
      producer.id
    )}</div>
    <div class="upgrade-price" align="center">Cost: ${upgradeCost} | Qty: ${upgradeAmt}</div>
    <div align="center"><button type="button" id="upG_${
      producer.id
    }">Buy</button></div>
  `;
  containerDiv.innerHTML = html;
  // Ok, well I modelled the top part after this. I need to find a way to append this
  // to previous div now...

  // Need to appendChild to the producer class before the last child because I
  // want this to occur in the middle.
  // So first, grab producer. I added an id to each of the boxes so we can add
  // upgrade to the right box.
  const parentNode = document.getElementById(`${producer.id}`);
  const refChild = document.getElementById(`${producer.id}_end`);
  parentNode.insertBefore(containerDiv, refChild);
}

function deleteAllChildNodes(parent) {
  // your code here
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
// Show them here.
function renderProducers(data) {
  // your code here
  // I pushed the unlock producers function into the
  // getUnlockedProducers function so that it would
  // unlock what needs to be unlocked first
  // before actually returning all unlocked producers. That's why it's not
  // called here.
  let unlocked = getUnlockedProducers(data);
  // unlocked *should* be an array of unlocked producers.
  // So I should just be able to .forEach and make a div for each of em.

  // First grab the parent to append the div to
  const producerParent = document.getElementById('producer_container');

  // Need to delete previous children so I don't append all of them again
  if (producerParent.childNodes.length > 0) {
    deleteAllChildNodes(producerParent);
  }

  // Then .forEach, make div then append to producerParent
  unlocked.forEach((producer) => {
    // makeProducerDiv(producer); // make the div
    producerParent.appendChild(makeProducerDiv(producer)); // Append div
    // After appending each, I can test to see if the upgrade is unlocked and
    // if it is, I can append it there, too. Probably...
    if (producer.upgradeUnlock) {
      makeProducerUpgradeDiv(producer);
    }
  });
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here
  let ans = [];
  data.producers.forEach((producer) => {
    if (producer.id === producerId) {
      // console.log(`Returning ${JSON.stringify(producer)}`);
      ans.push(producer);
    }
  });
  return ans[0];
}

function canAffordProducer(data, producerId) {
  // your code here
  const money = data.coffee;
  const price = getProducerById(data, producerId).price;
  if (money >= price) {
    return true;
  } else return false;
}

function updateCPSView(cps) {
  // your code here
  const cpsValue = document.getElementById('cps');
  cpsValue.innerText = cps;
}

function updatePrice(oldPrice) {
  // your code here
  return Math.floor(oldPrice * 1.25);
}
// Misc button functions here

// This function is to practice with the data attribute, timers + event loop
// order, and transitions

function caffeineBoost() {
  if (caffeineBoostButton.dataset.ready === 'true' && !boost) {
    // Check if can afford
    const money = data.coffee;
    if (money >= caffeineBoostData.price) {
      boost = true;
      // First, toggle UI
      const specialContainer = document.getElementById('special_container');
      specialContainer.style.display = 'none';
      const boostUI = document.getElementById('boosting-ui');
      boostUI.style.display = 'flex';
      // Subtract cost + update price
      const boostCostUI = document.getElementById('boost_cost');
      data.coffee -= caffeineBoostData.price;
      caffeineBoostData.price *= 5;
      boostCostUI.innerText = caffeineBoostData.price;
      updateUI(data);
      // Start countdown timer
      // Grab timer UI
      const countdownUI = document.getElementById('countdown');
      countdownUI.innerText = `10...`;
      // Make that countdown timer.
      // Won't work cuz timer is asynchronous...
      // Alternative to make 10 timers...but that seems inefficient..
      // ...unless I use a for loop to make the timers....
      for (let i = 1; i <= 9; i++) {
        const values = ['placeholder', 9, 8, 7, 6, 5, 4, 3, 2, 1];
        setTimeout(() => {
          countdownUI.innerText = `${values[i]}...`;
        }, 1000 * i);
        // So the first loop makes a timer of 1 second that will turn countdownUI to 9.
        // Second loop makes a timer of 2 seconds -> Turns UI to 8...

        // Not gonna lie, I was pretty proud of this idea.
      }
      // Add functionality -> Boost the total CPS!
      data.totalCPS *= 2;
      updateUI(data);
      // End the boost after 10 seconds
      setTimeout(() => {
        // Put on cooldown for 5 minutes
        // = 300000 ms
        caffeineBoostButton.dataset.ready = 'false';
        setTimeout(() => {
          caffeineBoostButton.dataset.ready = 'true';
        }, 300000);
        // These are just for purposes of the cooldown UI.
        // Dunno if I prefer the slow transition this way
        // Or just a red button until it's ready again...
        setTimeout(() => {
          caffeineBoostButton.dataset.ready = '1min';
        }, 240000);
        setTimeout(() => {
          caffeineBoostButton.dataset.ready = '2min';
        }, 180000);
        setTimeout(() => {
          caffeineBoostButton.dataset.ready = '3min';
        }, 120000);
        setTimeout(() => {
          caffeineBoostButton.dataset.ready = '4min';
        }, 60000);
        setTimeout(() => {
          caffeineBoostButton.dataset.ready = '5min';
        }, 1000);

        specialContainer.style.display = 'flex';
        boostUI.style.display = 'none';
        data.totalCPS /= 2;
        boost = false;
        updateUI(data);
      }, 10000);
    } else {
      alert(`You cannot afford this yet!`);
    }
  } else {
    // TODO: Make it show how much longer until cd is done?
    // BUG: Refreshing the page skips the cd entirely...cheaters.
    // BUG: Resetting the game doesn't reset cooldown...not that it matters
    // cuz you won't be able to get enough money in 5 minutes anyway.

    alert(
      `This skill isn't ready yet!\nThe button will slowly change back to its original color over the cooldown time and turn back to normal once cd is over.`
    );
  }
}

// Buy/Sell functions here
function attemptToBuyProducer(data, producerId) {
  // your code here
  if (canAffordProducer(data, producerId) === false) {
    return false;
  } else {
    // Set variable for the producer just bought
    const producerBought = getProducerById(data, producerId);
    // Increase amount of that producer by 1
    producerBought.qty++;
    const producerPrice = producerBought.price;
    // Subtract price of producer from our money
    data.coffee -= producerPrice;
    // Update price of producer after subtracting price from our money
    producerBought.price = updatePrice(producerPrice);
    // Update the CPS
    if (boost) {
      data.totalCPS += producerBought.cps * 2;
    } else {
      data.totalCPS += producerBought.cps;
    }
    // return true
    return true;
  }
}

function sellProducer(data, producerId) {
  // Set variable for producer just sold
  const producerSold = getProducerById(data, producerId);
  // Decrease amount of that producer by 1
  if (producerSold.qty > 0) {
    producerSold.qty--;
    // Get the last bought price.
    // Price should be 1.25x less than the current price.
    // This will probably cause rounding errors that will make
    // the price we set it to off by a value of +/- 1.
    // This means we can introduce a bug where you can get 1 coffee
    // (max 2) if we buy then sell then buy...but you still lose 50%, so not
    // worth anyway.
    const producerPrice = Math.floor(producerSold.price / 1.25);
    // Refund 50% - rounded down cuz I'm cheap
    data.coffee += Math.floor(producerPrice / 2);
    // Update price of producer after Refund
    producerSold.price = producerPrice;
    // Update CPS
    if (boost) {
      data.totalCPS -= producerSold.cps * 2;
    } else {
      data.totalCPS -= producerSold.cps;
    }
  } else {
    window.alert(
      `You don't have any ${makeDisplayNameFromId(producerId)} to sell!`
    );
  }
}

function upgradeClicks(data) {
  const money = data.coffee;
  if (money >= clickData.price) {
    // Subtract cost
    data.coffee -= clickData.price;
    // Upgrade amount per click
    clickData.amount += 1;
    // Update price
    clickData.price = updatePrice(clickData.price);
    // Update click UI
    updateUI(data);
  } else {
    alert(`You can't afford this upgrade!`);
  }
}

function upgradeProducer(data, producerId) {
  const producerUpgrade = getProducerById(data, producerId);
  const money = data.coffee;

  if (money >= producerUpgrade.upgradePrice) {
    // Increase Qty
    producerUpgrade.upgradeQty++;
    // Subtract cost from coffee
    data.coffee -= producerUpgrade.upgradePrice;
    // Recalculate total CPS. Do this by adding the value of the current cps add
    // multiply by the number of items you have already.
    if (boost) {
      data.totalCPS =
        data.totalCPS + producerUpgrade.cps * producerUpgrade.qty * 2;
    } else {
      data.totalCPS = data.totalCPS + producerUpgrade.cps * producerUpgrade.qty;
    }
    // Increase CPS by a factor of 2
    producerUpgrade.cps *= 2;
    // This can get fast quick, so price increase must increase as drastically
    // ...probably.
    producerUpgrade.upgradePrice = producerUpgrade.upgradePrice * 2;

    // Update UI
    updateUI(data);
  } else {
    alert(`You can't afford this upgrade!`);
  }
}

function buyButtonClick(event, data) {
  // your code here

  // Grab the target first. Idk why yet...
  const target = event.target;
  if (target.tagName.toLowerCase() === 'button') {
    // target.id gives you buy_producerId, so splice out the buy_
    const producerID = target.id.slice(4);
    // Toss this producer ID into the attemptToBuyProducer function
    if (target.id[0] === 'b') {
      // If buy button was pressed
      if (attemptToBuyProducer(data, producerID) === false) {
        window.alert(`Not enough coffee!`);
      } else {
        // TODO: Update UI but can't cuz test specs fail.
        renderProducers(data);
        updateCPSView(data.totalCPS);
        updateCoffeeView(data.coffee);
      }
    } else if (target.id[0] === 's') {
      // Here we put what happens if sell button was pressed
      sellProducer(data, producerID);
      // Update UI
      updateUI(data);
    } else if (target.id[0] === 'u') {
      upgradeProducer(data, producerID);
      // Update UI
      updateUI(data);
    }
  }
}

// Save/reset game functions here.

function resetGameConfirmation() {
  // Grab the main bodies
  const gamePage = document.getElementById('container_left');
  const resetPage = document.getElementById('reset-confirm');
  gamePage.style.display = 'none';
  resetPage.style.display = 'flex';
}

function returnToGame() {
  const gamePage = document.getElementById('container_left');
  const resetPage = document.getElementById('reset-confirm');
  gamePage.style.display = 'flex';
  resetPage.style.display = 'none';
}

function resetGame() {
  // Remove save file
  localStorage.removeItem('data');
  localStorage.removeItem('clickData');
  // reset the screen
  const gamePage = document.getElementById('container_left');
  const resetPage = document.getElementById('reset-confirm');
  resetPage.style.display = 'none';
  gamePage.style.display = 'flex';
  // reset the data to 0
  clickData = {
    amount: 1,
    qty: 0,
    price: 200,
  };
  caffeineBoostData = {
    price: 5000,
  };
  data = {
    coffee: 0,
    totalCPS: 0,
    producers: [
      {
        id: 'chemex',
        price: 10,
        unlocked: false,
        upgrade: 'Cleaner coffee machine',
        upgradePrice: 100,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 1,
        qty: 0,
      },
      {
        id: 'french_press',
        price: 50,
        unlocked: false,
        upgrade: 'Increased machine pressure',
        upgradePrice: 500,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 2,
        qty: 0,
      },
      {
        id: 'mr._coffee',
        price: 100,
        unlocked: false,
        upgrade: 'Use fresh mountain water',
        upgradePrice: 1000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 5,
        qty: 0,
      },
      {
        id: 'ten_cup_urn',
        price: 500,
        unlocked: false,
        upgrade: 'Upgraded coffee bean grinder',
        upgradePrice: 5000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 10,
        qty: 0,
      },
      {
        id: 'espresso_machine',
        price: 1000,
        unlocked: false,
        upgrade: 'Grind beans to order',
        upgradePrice: 10000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 20,
        qty: 0,
      },
      {
        id: 'ten_gallon_urn',
        price: 5000,
        unlocked: false,
        upgrade: 'Coffee made to order',
        upgradePrice: 50000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 50,
        qty: 0,
      },
      {
        id: 'coffeeshop',
        price: 10000,
        unlocked: false,
        upgrade: 'Extra shot of espresso',
        upgradePrice: 100000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 75,
        qty: 0,
      },
      {
        id: 'coffee_factory',
        price: 50000,
        unlocked: false,
        upgrade: 'Use freshest beans in existence',
        upgradePrice: 500000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 100,
        qty: 0,
      },
      {
        id: 'coffee_fountain',
        price: 100000,
        unlocked: false,
        upgrade: 'Genetically modified coffee beans',
        upgradePrice: 1000000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 200,
        qty: 0,
      },
      {
        id: 'coffee_river',
        price: 500000,
        unlocked: false,
        upgrade: 'Genetically modified water',
        upgradePrice: 5000000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 500,
        qty: 0,
      },
      {
        id: 'coffee_ocean',
        price: 1000000,
        unlocked: false,
        upgrade: 'Cat included with every purchase',
        upgradePrice: 10000000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 1000,
        qty: 0,
      },
      {
        id: 'coffee_planet',
        price: 5000000,
        unlocked: false,
        upgrade: 'Genetically modify everything about our coffee',
        upgradePrice: 50000000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 2000,
        qty: 0,
      },
    ],
  };

  console.log(`Game has been reset!`);
  // Update UI
  // I could probably put this Update UI thing into a function...
  updateUI(data);
  document.getElementById('per_click').innerText = clickData.amount;
  document.getElementById('click-upgrade').innerText = clickData.price;
  document.getElementById('boost_cost').innerText = caffeineBoostData.price;
}

function saveGame(data) {
  localStorage.setItem('data', JSON.stringify(data));
  // Need to stringify because data is an object and localStorage is
  // apparently saved as a string. So doing this will make it easier.
  // When loading, you need to JSON.parse to turn back into an object.
  // We will load the data where we set the data values below under start
  // your engines.
  localStorage.setItem('clickData', JSON.stringify(clickData));
  localStorage.setItem('caffeineBoostData', JSON.stringify(caffeineBoostData));

  console.log(`Data saved!`);
}

// Core gameplay functions
let counter = 0;
function tick(data) {
  // your code here
  data.coffee += data.totalCPS;
  // TODO: UpdateUI but won't pass test specs because there's no innerText
  // for the clickData in test specs.
  updateCoffeeView(data.coffee);
  unlockProducers(data.producers, data.coffee);
  renderProducers(data);

  if (counter > 30) {
    // Saves data every 30 seconds
    // Tossed into the tick function so we don't have to make our own timer :)
    counter = 0;
    saveGame(data);
  } else {
    counter++;
  }
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
let data = {};

// Get starting data from the window object
// (This comes from data.js)
// If there is a load file, load it. Otherwise, start new.
try {
  data = JSON.parse(localStorage.getItem('data'));
  clickData = JSON.parse(localStorage.getItem('clickData'));
  caffeineBoostData = JSON.parse(localStorage.getItem('caffeineBoostData'));
  document.getElementById('per_click').innerText = clickData.amount;
  document.getElementById('click-upgrade').innerText = clickData.price;
  document.getElementById('boost_cost').innerText = caffeineBoostData.price;
  updateUI(data);
  console.log(`Successfully loaded game!`);
} catch (err) {
  console.log(`No load file detected. Starting from scratch`);
  console.log(`Setting clickData`);
  clickData = {
    amount: 1,
    qty: 0,
    price: 200,
  };
  console.log(`Setting caffeineBoostData`);
  caffeineBoostData = {
    price: 5000,
  };
  console.log(`Setting main data`);
  data = {
    coffee: 0,
    totalCPS: 0,
    producers: [
      {
        id: 'chemex',
        price: 10,
        unlocked: false,
        upgrade: 'Cleaner coffee machine',
        upgradePrice: 100,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 1,
        qty: 0,
      },
      {
        id: 'french_press',
        price: 50,
        unlocked: false,
        upgrade: 'Increased machine pressure',
        upgradePrice: 500,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 2,
        qty: 0,
      },
      {
        id: 'mr._coffee',
        price: 100,
        unlocked: false,
        upgrade: 'Use fresh mountain water',
        upgradePrice: 1000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 5,
        qty: 0,
      },
      {
        id: 'ten_cup_urn',
        price: 500,
        unlocked: false,
        upgrade: 'Upgraded coffee bean grinder',
        upgradePrice: 5000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 10,
        qty: 0,
      },
      {
        id: 'espresso_machine',
        price: 1000,
        unlocked: false,
        upgrade: 'Grind beans to order',
        upgradePrice: 10000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 20,
        qty: 0,
      },
      {
        id: 'ten_gallon_urn',
        price: 5000,
        unlocked: false,
        upgrade: 'Coffee made to order',
        upgradePrice: 50000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 50,
        qty: 0,
      },
      {
        id: 'coffeeshop',
        price: 10000,
        unlocked: false,
        upgrade: 'Extra shot of espresso',
        upgradePrice: 100000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 75,
        qty: 0,
      },
      {
        id: 'coffee_factory',
        price: 50000,
        unlocked: false,
        upgrade: 'Use freshest beans in existence',
        upgradePrice: 500000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 100,
        qty: 0,
      },
      {
        id: 'coffee_fountain',
        price: 100000,
        unlocked: false,
        upgrade: 'Genetically modified coffee beans',
        upgradePrice: 1000000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 200,
        qty: 0,
      },
      {
        id: 'coffee_river',
        price: 500000,
        unlocked: false,
        upgrade: 'Genetically modified water',
        upgradePrice: 5000000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 500,
        qty: 0,
      },
      {
        id: 'coffee_ocean',
        price: 1000000,
        unlocked: false,
        upgrade: 'Cat included with every purchase',
        upgradePrice: 10000000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 1000,
        qty: 0,
      },
      {
        id: 'coffee_planet',
        price: 5000000,
        unlocked: false,
        upgrade: 'Genetically modify everything about our coffee',
        upgradePrice: 50000000,
        upgradeUnlock: false,
        upgradeQty: 0,
        cps: 2000,
        qty: 0,
      },
    ],
  };
}

// Hide the reset confirmation page initially
const resetPage = document.getElementById('reset-confirm');
resetPage.style.display = 'none';

// Hide the boosting ui initially
const boostUI = document.getElementById('boosting-ui');
boostUI.style.display = 'none';

// Add an event listener to the giant coffee emoji

// Event listeners here.
const bigCoffee = document.getElementById('big_coffee');
bigCoffee.addEventListener('click', () => clickCoffee(data));

// Add an event listener to the container that holds all of the producers
// Pass in the browser event and our data object to the event listener
const producerContainer = document.getElementById('producer_container');
producerContainer.addEventListener('click', (event) => {
  buyButtonClick(event, data);
});

resetDenyButton.addEventListener('click', returnToGame);

caffeineBoostButton.addEventListener('click', caffeineBoost);

saveGameButton.addEventListener('click', () => {
  saveGame(data);
  const saveMessage = document.getElementById('save_message');
  saveMessage.hidden = !saveMessage.hidden;
  setTimeout(() => {
    saveMessage.hidden = !saveMessage.hidden;
  }, 2000);
});
resetGameButton.addEventListener('click', resetGameConfirmation);

upgradeClicksButton.addEventListener('click', () => {
  upgradeClicks(data);
});

resetConfirmButton.addEventListener('click', resetGame);

// Call the tick function passing in the data object once per second
setInterval(() => tick(data), 1000);
