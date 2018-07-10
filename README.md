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

Registers a card with the PSP and returns a token for long term or short term usage.

The mehod can return a savedCard or tempoary token depending in context the method is used.

After the card is registered it's data will be represented by a token. For short term registered cards the token will be


Key      | Type       | Description        |
---------|------------|--------------------|
`saveCard`  | String    | can be true of false
`cardData.cardNumber`     | String     | The card number.
`cardData.cardHolderName`     | String     | First name and last name.
`cardData.expireMonth`     | String     | the expire month in format 01..02.. 11, 12.
`cardData.expireYear`  | String    | The expire year in the format 2020 ( not 20 ).
`cardData.CVV`  | String    | Card's CVV code.

Example of argument filled in when saving a card for long term usage.
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

Example of argument filled in when saving a card for short term usage.
```
{
  cardData: { ... valid card data ... },
  saveCard: false
}
```

Returns

Example of card object returned for long term saved card.

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

Example of card object returned for short term saved card.

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
Coinify.registerCard( { cardData: userInputCardDataFromCustomForm, saveCard: true } ).then( (response) => {
  … the card has not been saved if response doesnt contain an error: see error handling ...
  tradeInfo.transferIn.details.upoId = response.upoId;
  tradeInfo.transferIn.details.sessionToken = response.sessionToken;
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
  ... payload useable to save card ...
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
  tradeInfo.transferIn.details.ccTempToken = response.ccTempToken;
  tradeInfo.transferIn.details.sessionToken = response.sessionToken;
  http.post( "/trades", tradeInfo ).then( response => {
    const details = response.transferIn.details;
    Coinify.handleTradePaymentInfo( details ).then( response => {
     … the payment url shown in the iframe returns...
   } );
  } );
} );
```









