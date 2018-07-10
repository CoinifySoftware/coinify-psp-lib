# coinify-psp-lib
Coinify Client-side PSP Library


Coinify psp library
=============

This library is the first step of creating a custom payment page when integrating with Coinify's trading services allowing you to:

1. Save a card for later usage through custom form.
1. Create custom form to input (and optionally register) card data when paying for a trade with card.
1. Create custom form to input card data and saving a card for payments.
1. Handling the Authentication aspects (3D Secure) of paying with a card input through custom form or saved card.
1. Showing hosted payment frame for Coinify partner's integrating with older card payment solutions.

Installation
-----------

By NPM;

npm i coinify-psp-lib --save

Or as script tag;

Insert the following script into your project a common place is to insert it into the head of your index file.

```
<script src="https://cdnjs.cloudflare.com/libs/coinify-psp-lib/1.0.0/coinify-psp-lib.min.js" type="text/javascript"></script>
```

Error handling
-----------

All response objects returned from the library contains an error paramter. If the error parameter is not null, it means that the 

Example of object returned when no error has occured. 
```json-doc
{
  "error": null,
  "errorCode": null,
  ... other object attributes ...
}
```

Example of object returned when an error has occured. 
```json-doc
{
  "error": "Unknown error has happened when trying to pay",
  "errorCode": "01",
  ... other object attributes ...
}
```

Register Card
-----------

```Coinify.registerCard( ... )```

Registers a card with the PSP for later payment. The functionality is used to tokenize a card using a custom form.

A card can be registered for two types of usage;

1. Token used to pay for specific trade without saving card for later usage.
2. Persistant card token which can be used to repeatantly pay for trades. When the card is saved the card appears in the card list.

Key      | Type       | Description        |
---------|------------|--------------------|
`saveCard`  | String    | can be true of false
`cardData.cardNumber`     | String     | The card number.
`cardData.cardHolderName`     | String     | First name and last name.
`cardData.expireMonth`     | String     | the expire month in format 01..02.. 11, 12.
`cardData.expireYear`  | String    | The expire year in the format 2020 ( not 20 ).
`cardData.CVV`  | String    | Card's CVV code.

Example of argument filled in when registering a card for payment and saving it for future uses.
```
{
  cardData: {
    cardNumber: "xxxx xxxx xxxx xxxx",
    cardHolderName: "firstName lastName",
    expireMonth: "01",
    expireYear: "2020",
    CVV: "123"
  },
  saveCard: true
}
```

Example of argument filled in when registering a card for payment through without saving it - the card can be used to pay a single time but will not appear in the list of saved cards.
```
{
  cardData: { ... valid card data ... },
  saveCard: false
}
```

Returns

Example of card object returned for card registered for future purchases.

```json-doc
{
  "externalId": "2820723",
  "lastFour": "0014",
  "nameOnCard":"John Doe",
  "bin":"401200",
  "expiryDate":"0120",
  "cardBrand":"visa",
  "sessionToken": "xxxx-xxxx-xxxx-xxxx",
  "error": null
}
```

Example of card object returned for card registered for a single purchase.

```json-doc
{
  "ccCardToken": "xxxx-xxxx-xxxx-xxxx",
  "sessionToken": "xxxx-xxxx-xxxx-xxxx",
  "error": null 
}
```

handleTradePaymentInfo - Open payment url
-----------

```Coinify.handleTradePaymentInfo( ... )```

As part of paying for a trade we retrive a payment url, this is handled through the method called handleTradePaymentInfo.
s
The payment url can represent the following; 

 - 3D Secure authentication page. - Used when paying using a 3d secure card.
 - Hosted payment page. - Used when paying using when a hosted payment page is returned to handle the payment.

In either case the ```handleTradePaymentInfo`` method is used to open the types of url's in either a popup or a container and gracefully handle the return callback from the page. It internally handles the payment info ( url's ) by communicating with the Payment provider, the 3d secure authentiation page and the Coinify trade service.

Arguments

The arguments returned when creating a trade through ```POST: /trades``` is just passed on to handleTradePaymentInfo.

Key      | Type       | Description        |
---------|------------|--------------------|
`data.url`     | String     | The url to either the 3d secure authentication page or the hosted payment page.
`data.urlType`     | String     | 3dsecure | hosted-payment-page.
`data.container`     | HtmlElement     | ( Optional ) This is the optional container that we want to embed the payment frame. If undefined the payment frame will be shown as a overlay.

Returns

```json-doc
{
  error: null | 'error message'
}
```


setCardAsTradePaymentOption
-----------

```Coinify.setCardAsTradePaymentOption( tradeCreationArguments, card )```

Sets a saved card as choosen payment method to the arguments passed when creating a trade object through ```POST: /trades``` 

Arguments

Key      | Type       | Description        |
---------|------------|--------------------|
`tradeCreationArguments`     | Object     | The object passed to ```POST: /trades``` 
`card`     | Object     | Card object representing the selected card we wish to pay with ( see public api for GET: /cards end-point )

Example - How to save a card for future usages.
-----------

```javascript
const userInputCardDataFromCustomForm = {
  cardNumber: "1111 2222 3333 4444",
  cardHolderName: "John Doe",
  expireMonth: "1",
  expireYear: "2020",
  CVV: "123"
};
Coinify.registerCard( { cardData: userInputCardDataFromCustomForm, saveCard: true } ).then( (response) => {
  … the card has not been saved if response doesnt contain an error: see error handling ...
} );
```

Example - Pay with a saved card.
-----------

1. First, the app must retrive the list of saved cards throug the cards api. See public API documentation for info on the end-point.

```javascript
http.get( "/cards").then( _cardList => {
  this.cardList = _cardList;
  this.presentCardOptionsInDropdown( _cardList );
} );
```

2. Secondly, the app should let the user choose which card he/she wants to pay with.

```javascript
function onCardSelectedInDropdown( card ) {
  this.selectedCard = card; // the local variable represents the card needed for payment later on.
}
```

3. Lastly, when the user clicks "pay" the application will have to create a trade with  requested quote and the selected
card as payment method. We do that by invoking ```Coinify.setCardAsTradePaymentOption``` on the details and passing on the

```javascript
const tradeInfo = {
  ... payload with info used to create a trade ...
};
Coinify.setCardAsTradePaymentOption( tradeInfo, this.selectedCard ); // After this we have now made sure that the tradeInfo object contains teh selected card/payment details required to pay with the selected card.
http.post( "/trades", tradeInfo ).then( response => {
  const details = response.transferIn.details;
  Coinify.handleTradePaymentInfo( details ).then( response => {
    … the payment url shown in the iframe returns...
 } );
} );
```


Example - Pay with a card using a custom form and saving the card.
-----------

```javascript
const tradeInfo = {
  ... payload with info used to create a trade ...
};
const userInputCardDataFromCustomForm = {
  cardNumber: "1111 2222 3333 4444",
  cardHolderName: "John Doe",
  expireMonth: "1",
  expireYear: "2020",
  CVV: "123"
};
Coinify.registerCard( { cardData: userInputCardDataFromCustomForm, saveCard: true } ).then( (response) => {
  … the card has not been saved if response doesnt contain an error: see error handling ...
  Coinify.setCardAsTradePaymentOption( tradeInfo, response ); // After this we have now made sure that the tradeInfo object contains teh selected card/payment details required to pay with the selected card.
  http.post( "/trades", tradeInfo ).then( response => {
    const details = response.transferIn.details;
    Coinify.handleTradePaymentInfo( details ).then( response => {
      … the payment url shown in the iframe returns...
   } );
  } );
} );
```

Example - Pay with a card using a custom form without saving the card.
-----------

```javascript
const tradeInfo = {
  ... payload with info used to create a trade ...
};
const userInputCardDataFromCustomForm = {
  cardNumber: "1111 2222 3333 4444",
  cardHolderName: "John Doe",
  expireMonth: "1",
  expireYear: "2020",
  CVV: "123"
};
Coinify.registerCard( { cardData: userInputCardDataFromCustomForm, saveCard: false } ).then( (response) => {
  … the card has not been registered for temporary usage if response doesnt contain an error: see error handling ...
  Coinify.setCardAsTradePaymentOption( tradeInfo, response ); // After this we have now made sure that the tradeInfo object contains teh selected card/payment details required to pay with the selected card.
  http.post( "/trades", tradeInfo ).then( response => {
    const details = response.transferIn.details;
    Coinify.handleTradePaymentInfo( details ).then( response => {
     … the payment url shown in the iframe returns...
   } );
  } );
} );
```









