# coinify-psp-lib
Coinify Client-side PSP Library


Coinify psp library
=============

This library is the first step of creating a custom payment page when integrating with Coinify's trading services allowing you to:

1. Save a card for later usage through custom form.
1. Create custom form to input (and optionally register) card data when paying for a trade with card.
1. Create custom form to input card data and saving a card for payments.
1. Handling the following aspects of paying with a card input through custom form or saved card.
  1.1. Showing 3D Secure authentication pages.
  1.1. Authentication flow.
1. Showing hosted payment frame for Coinify partner's integrating with older card payment solutions.


Installation
-----------

Insert the following script into your project a common place is to insert it into the head of your index file.

<script src="https://cdnjs.cloudflare.com/libs/coinify-psp-lib/1.0.0/coinify-psp-lib.min.js" type="text/javascript"></script>

Examples - Store card
-----------

Coinify.saveCard

Description

Parses and builds the data for a credit card into a format that the PSP can understand. 

Take note that method is generic in the sense that if we later want to implement support for other PSP’s handle how the card data is applied we can do it with this method.  We need this to be able to abstract the way the card data is processed by the PSP ensuring that we can introduce additional PSP’s in the future while not having to change the front-end implementation.

Arguments

“Save card payload”
A “Save card payload” - the payload needed by the psp to save the card.

“PSP Type”
The type of PSP.

Returns

The object with the id of the saved card.

Error handling
-----------

All response objects returned from the library contains an error paramter. If the error parameter is not null, it means that the 

Save Card
-----------

Coinify.saveCard

Description

Parses and builds the data for a credit card into a format that the PSP can understand. 

Take note that method is generic in the sense that if we later want to implement support for other PSP’s handle how the card data is applied we can do it with this method.  We need this to be able to abstract the way the card data is processed by the PSP ensuring that we can introduce additional PSP’s in the future while not having to change the front-end implementation.

Arguments

“Save card payload”
A “Save card payload” - the payload needed by the psp to save the card.

“PSP Type”
The type of PSP.

Returns

The object with the id of the saved card.

{
  {
    UpoId; 
  }
  error: null
  }
}


Example - How to save a card for future usages.
-----------

const userInputCardDataFromCustomForm = {
  cardNumber: "1111 2222 3333 4444",
  cardHolderName: "John Doe",
  expireMonth: "1",
  expireYear: "2020",
  CVV: "123"
};
Coinify.saveCard( { cardData: userInputCardDataFromCustomForm } ).then( (response) => {
  … the card has not been saved if response doesnt contain an error: see error handling ...
} );


Example - Pay with a card using a custom form and saving the card.
-----------

```javascript
const tradeInfo = {
  ... payload useable to save card ...
};
const userInputCardDataFromCustomForm = {
  cardNumber: "1111 2222 3333 4444",
  cardHolderName: "John Doe",
  expireMonth: "1",
  expireYear: "2020",
  CVV: "123"
};
Coinify.saveCard( { cardData: userInputCardDataFromCustomForm } ).then( (response) => {
  … the card has not been saved if response doesnt contain an error: see error handling ...
  tradeInfo.transferIn.details.upoId = response.upoId;
  tradeInfo.transferIn.details.sessionToken = response.sessionToken;
  http.post( "/trades", tradeInfo ).then( response => {
    const details = response.transferIn.details;
    Coinify.openPaymentUrl( details.redirectUrl, details.is3DS, details.provider ).then( response => {
      … the payment url shown in the iframe returns...
   } );
  } );
} );
```

Example - Pay with a card using a custom form without saving the card.
-----------

```javascript
const tradeInfo = {
  ... payload useable to save card ...
};
const userInputCardDataFromCustomForm = {
  cardNumber: "1111 2222 3333 4444",
  cardHolderName: "John Doe",
  expireMonth: "1",
  expireYear: "2020",
  CVV: "123"
};
Coinify.getTempoaryCardToken( { cardData: userInputCardDataFromCustomForm } ).then( (response) => {
  … the card has not been registered for temporary usage if response doesnt contain an error: see error handling ...
  tradeInfo.transferIn.details.ccTempToken = response.ccTempToken;
  tradeInfo.transferIn.details.sessionToken = response.sessionToken;
  http.post( "/trades", tradeInfo ).then( response => {
    const details = response.transferIn.details;
    Coinify.openPaymentUrl( details.redirectUrl, details.is3DS, details.provider ).then( response => {
      … the payment url shown in the iframe returns...
   } );
  } );
} );
```

Example - Use the client-side API to show 
-----------

```javascript
const tradeInfo = {
  ... payload useable to save card ...
};
const userInputCardDataFromCustomForm = {
  cardNumber: "1111 2222 3333 4444",
  cardHolderName: "John Doe",
  expireMonth: "1",
  expireYear: "2020",
  CVV: "123"
};
Coinify.getTempoaryCardToken( { cardData: userInputCardDataFromCustomForm } ).then( (response) => {
  … the card has not been registered for temporary usage if response doesnt contain an error: see error handling ...
  tradeInfo.transferIn.details.ccTempToken = response.ccTempToken;
  tradeInfo.transferIn.details.sessionToken = response.sessionToken;
  http.post( "/trades", tradeInfo ).then( response => {
    const details = response.transferIn.details;
    Coinify.openPaymentUrl( details.redirectUrl, details.is3DS, details.provider ).then( response => {
      … the payment url shown in the iframe returns...
   } );
  } );
} );
```







