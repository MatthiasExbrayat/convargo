'use strict';

//list of truckers
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const truckers = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'les-routiers-bretons',
  'pricePerKm': 0.05,
  'pricePerVolume': 5
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'geodis',
  'pricePerKm': 0.1,
  'pricePerVolume': 8.5
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'xpo',
  'pricePerKm': 0.10,
  'pricePerVolume': 10
}];

//list of current shippings
//useful for ALL steps
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const deliveries = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'shipper': 'bio-gourmet',
  'truckerId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'distance': 100,
  'volume': 4,
  'options': {
    'deductibleReduction': false,
    'additionalCharge': 0
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'shipper': 'librairie-lu-cie',
  'truckerId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'distance': 650,
  'volume': 12,
  'options': {
    'deductibleReduction': true,
    'additionalCharge': 0
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'shipper': 'otacos',
  'truckerId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'distance': 1250,
  'volume': 30,
  'options': {
    'deductibleReduction': true,
    'additionalCharge': 0
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'deliveryId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}];

console.log(truckers);
console.log(deliveries);
console.log(actors);

//------STEP 5------
//Pay the actors
function calculateDeliveriesPrices() {
  deliveries.forEach(function(delivery) {

    //Object to hold the delivery's trucker
    var deliveryTrucker;

    //I find the delivery's trucker and hold it in the precedent variable
    truckers.forEach(function(trucker) {
      if(trucker.id == delivery.truckerId){
        deliveryTrucker = trucker;
      }
    });

    //Variable to contain the reduction for the price per volume
    var reduction = 0;

    //According to the volume I update the reduction
    if(delivery.volume > 25){
      reduction = (deliveryTrucker.pricePerVolume / 100) * 50;
    }else if(delivery.volume > 10){
      reduction = (deliveryTrucker.pricePerVolume / 100) * 30;
    }else if(delivery.volume > 5){
      reduction = (deliveryTrucker.pricePerVolume / 100) * 50;
    }

    //I calculate the price for the current delivery
    var distancePrice = delivery.distance * deliveryTrucker.pricePerKm;
    var volumePrice = delivery.volume * (deliveryTrucker.pricePerVolume - reduction);
    var price = distancePrice + volumePrice;

    //I update the price in the current delivery object
    delivery.price = price;

    //I calculate the total of commissions
    var totalCommission = (delivery.price / 100) * 30;

    //I update the commissions in the current delivery object
    delivery.commission.insurance = totalCommission/2;
    delivery.commission.treasury = Math.ceil(delivery.distance/500);
    delivery.commission.convargo = totalCommission - (delivery.commission.insurance + delivery.commission.treasury);

    //I calculate the deductible reduction if the option is choose by the shipper
    //In each delivery object I added a field "additionalCharge" in the field "options" to contain the calculated additional charge
     if(delivery.options.deductibleReduction){
      var additionalCharge = delivery.volume;
      delivery.options.additionalCharge = additionalCharge;
      //The delivery. price doesn't change because the additional charge is contained in the field created before
    }

    //Set the debit or credit for each actor of the delivery
    //I found the payment object corresponding to the current delivery
    var deliveryActors;

    actors.forEach(function(actorsOfTheDelivery) {
      if(actorsOfTheDelivery.deliveryId == delivery.id){
        deliveryActors = actorsOfTheDelivery.payment;
      }
    });

    //Now I update the amount for each actor
    deliveryActors[0].amount = delivery.price + delivery.options.additionalCharge;
    deliveryActors[1].amount = delivery.price - (delivery.commission.insurance + delivery.commission.treasury + delivery.commission.convargo);
    deliveryActors[2].amount = delivery.commission.treasury;
    deliveryActors[3].amount = delivery.commission.insurance;
    deliveryActors[4].amount = delivery.commission.convargo + delivery.options.additionalCharge;

    //I show the credit and debit prices in the browser console
    console.log("Step 5 - Pay the actors");
    console.log(" Delivery ID : " + delivery.id);
    console.log(" Delivery Price (without additionals charges): " + delivery.price);
    console.log(" Delivery additionals charges: " + delivery.options.additionalCharge);
    console.log(" Debit shipper (including additionals charges) : " + deliveryActors[0].amount);
    console.log(" Credit trucker : " + deliveryActors[1].amount);
    console.log(" Credit treasury : " + deliveryActors[2].amount);
    console.log(" Credit insurance : " + deliveryActors[3].amount);
    console.log(" Credit convargo (including additionals charges) : " + deliveryActors[4].amount);
  });
}

//Use the function to calculate all prices and commissions
calculateDeliveriesPrices();