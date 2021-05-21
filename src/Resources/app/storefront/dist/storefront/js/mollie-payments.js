(window.webpackJsonp=window.webpackJsonp||[]).push([["mollie-payments"],{eYm7:function(e,t,n){"use strict";n.r(t);n("wcNg");var o=n("FGIj");function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t,n,o,r,i,a){try{var c=e[i](a),u=c.value}catch(e){return void n(e)}c.done?t(u):Promise.resolve(u).then(o,r)}function a(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function c(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function u(e){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function l(e,t){return(l=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var s,p,d,f=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),c(this,u(t).apply(this,arguments))}var n,o,r,s,p;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&l(e,t)}(t,e),n=t,(o=[{key:"init",value:function(){var e=this,t=null,n=document.querySelector(this.getSelectors().mollieController);n&&n.remove(),null!=this.options.shopUrl&&"/"===this.options.shopUrl.substr(-1)&&(this.options.shopUrl=this.options.shopUrl.substr(0,this.options.shopUrl.length-1));var o=document.querySelector(this.getSelectors().cardHolder),r=document.querySelector(this.getSelectors().componentsContainer),i=document.querySelector(this.getSelectors().paymentForm),a=document.querySelectorAll(this.getSelectors().radioInputs),c=document.querySelector(this.getSelectors().submitButton);r&&o&&(t=Mollie(this.options.profileId,{locale:this.options.locale,testmode:this.options.testMode})),this.createComponentsInputs(t,[this.getInputFields().cardHolder,this.getInputFields().cardNumber,this.getInputFields().expiryDate,this.getInputFields().verificationCode]),a.forEach((function(t){t.addEventListener("change",(function(){e.showComponents()}))})),c.addEventListener("click",(function(n){n.preventDefault(),e.submitForm(n,t,i)}))}},{key:"getSelectors",value:function(){return{cardHolder:"#cardHolder",componentsContainer:"div.mollie-components-credit-card",creditCardRadioInput:'#confirmPaymentForm input[type="radio"].creditcard',mollieController:"div.mollie-components-controller",paymentForm:"#confirmPaymentForm",radioInputs:'#confirmPaymentForm input[type="radio"]',submitButton:'#confirmPaymentForm button[type="submit"]'}}},{key:"getDefaultProperties",value:function(){return{styles:{base:{backgroundColor:"#fff",fontSize:"14px",padding:"10px 10px","::placeholder":{color:"rgba(68, 68, 68, 0.2)"}},valid:{color:"#090"},invalid:{backgroundColor:"#fff1f3"}}}}},{key:"getInputFields",value:function(){return{cardHolder:{name:"cardHolder",id:"#cardHolder",errors:"cardHolderError"},cardNumber:{name:"cardNumber",id:"#cardNumber",errors:"cardNumberError"},expiryDate:{name:"expiryDate",id:"#expiryDate",errors:"expiryDateError"},verificationCode:{name:"verificationCode",id:"#verificationCode",errors:"verificationCodeError"}}}},{key:"showComponents",value:function(){var e=document.querySelector(this.getSelectors().creditCardRadioInput),t=document.querySelector(this.getSelectors().componentsContainer);t&&(void 0===e||!1===e.checked?t.classList.add("d-none"):t.classList.remove("d-none"))}},{key:"createComponentsInputs",value:function(e,t){var n=this;t.forEach((function(t,o,r){var i=e.createComponent(t.name,n.getDefaultProperties());i.mount(t.id),r[o][t.name]=i,i.addEventListener("change",(function(e){var n=document.getElementById("".concat(t.name)),o=document.getElementById("".concat(t.errors));e.error&&e.touched?(n.classList.add("error"),o.textContent=e.error):(n.classList.remove("error"),o.textContent="")})),i.addEventListener("focus",(function(){n.setFocus("".concat(t.id),!0)})),i.addEventListener("blur",(function(){n.setFocus("".concat(t.id),!1)}))}))}},{key:"setFocus",value:function(e,t){document.querySelector(e).classList.toggle("is-focused",t)}},{key:"disableForm",value:function(){var e=document.querySelector(this.getSelectors().submitButton);e&&(e.disabled=!0)}},{key:"enableForm",value:function(){var e=document.querySelector(this.getSelectors().submitButton);e&&(e.disabled=!1)}},{key:"submitForm",value:(s=regeneratorRuntime.mark((function e(t,n,o){var r,i,a,c,u,l;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),this.disableForm(),null!=(r=document.querySelector(this.getSelectors().creditCardRadioInput))&&!1!==r.checked||!o||o.submit(),!r||!0!==r.checked){e.next=17;break}return(i=document.getElementById("".concat(this.getInputFields().verificationCode.errors))).textContent="",e.next=9,n.createToken();case 9:if(a=e.sent,c=a.token,!(u=a.error)){e.next=16;break}return this.enableForm(),i.textContent=u.message,e.abrupt("return");case 16:u||(l=this.options.shopUrl+"/mollie/components/store-card-token/"+this.options.customerId+"/"+c)&&o&&fetch(l,{headers:{"Content-Type":"application/json; charset=utf-8"}}).then((function(){document.getElementById("cardToken").setAttribute("value",c),o.submit()})).catch(o.submit());case 17:case"end":return e.stop()}}),e,this)})),p=function(){var e=this,t=arguments;return new Promise((function(n,o){var r=s.apply(e,t);function a(e){i(r,n,o,a,c,"next",e)}function c(e){i(r,n,o,a,c,"throw",e)}a(void 0)}))},function(e,t,n){return p.apply(this,arguments)})}])&&a(n.prototype,o),r&&a(n,r),t}(o.a);d={customerId:null,locale:null,profileId:null,shopUrl:null,testMode:!0},(p="options")in(s=f)?Object.defineProperty(s,p,{value:d,enumerable:!0,configurable:!0,writable:!0}):s[p]=d;var m=n("gHbT");function y(e){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function h(e,t,n,o,r,i,a){try{var c=e[i](a),u=c.value}catch(e){return void n(e)}c.done?t(u):Promise.resolve(u).then(o,r)}function v(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function b(e,t){return!t||"object"!==y(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function g(e){return(g=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function S(e,t){return(S=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var _=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),b(this,g(t).apply(this,arguments))}var n,o,r,i,a;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&S(e,t)}(t,e),n=t,(o=[{key:"init",value:function(){try{this._paymentForm=m.a.querySelector(document,this.getSelectors().paymentForm),this._confirmForm=m.a.querySelector(document,this.getSelectors().confirmForm)}catch(e){return}this._cleanUpExistingElement(),this._fixShopUrl(),this._initializeComponentInstance(),this._registerEvents()}},{key:"_cleanUpExistingElement",value:function(){var e=document.querySelector(this.getSelectors().mollieController);e&&e.remove()}},{key:"_fixShopUrl",value:function(){null!=this.options.shopUrl&&"/"===this.options.shopUrl.substr(-1)&&(this.options.shopUrl=this.options.shopUrl.substr(0,this.options.shopUrl.length-1))}},{key:"_initializeComponentInstance",value:function(){this._componentsObject=null;var e=document.querySelector(this.getSelectors().cardHolder);document.querySelector(this.getSelectors().componentsContainer)&&e&&(this._componentsObject=Mollie(this.options.profileId,{locale:this.options.locale,testmode:this.options.testMode})),this.createComponentsInputs()}},{key:"_registerEvents",value:function(){this._confirmForm.addEventListener("submit",this.submitForm.bind(this))}},{key:"getSelectors",value:function(){return{cardHolder:"#cardHolder",componentsContainer:"div.mollie-components-credit-card",creditCardRadioInput:'#changePaymentForm input[type="radio"]',mollieController:"div.mollie-components-controller",paymentForm:"#changePaymentForm",confirmForm:"#confirmOrderForm"}}},{key:"getDefaultProperties",value:function(){return{styles:{base:{backgroundColor:"#fff",fontSize:"14px",padding:"10px 10px","::placeholder":{color:"rgba(68, 68, 68, 0.2)"}},valid:{color:"#090"},invalid:{backgroundColor:"#fff1f3"}}}}},{key:"getInputFields",value:function(){return{cardHolder:{name:"cardHolder",id:"#cardHolder",errors:"cardHolderError"},cardNumber:{name:"cardNumber",id:"#cardNumber",errors:"cardNumberError"},expiryDate:{name:"expiryDate",id:"#expiryDate",errors:"expiryDateError"},verificationCode:{name:"verificationCode",id:"#verificationCode",errors:"verificationCodeError"}}}},{key:"createComponentsInputs",value:function(){var e=this,t=this;[this.getInputFields().cardHolder,this.getInputFields().cardNumber,this.getInputFields().expiryDate,this.getInputFields().verificationCode].forEach((function(n,o,r){var i=e._componentsObject.createComponent(n.name,t.getDefaultProperties());i.mount(n.id),r[o][n.name]=i,i.addEventListener("change",(function(e){var t=document.getElementById("".concat(n.name)),o=document.getElementById("".concat(n.errors));e.error&&e.touched?(t.classList.add("error"),o.textContent=e.error):(t.classList.remove("error"),o.textContent="")})),i.addEventListener("focus",(function(){t.setFocus("".concat(n.id),!0)})),i.addEventListener("blur",(function(){t.setFocus("".concat(n.id),!1)}))}))}},{key:"setFocus",value:function(e,t){document.querySelector(e).classList.toggle("is-focused",t)}},{key:"submitForm",value:(i=regeneratorRuntime.mark((function e(t){var n,o,r,i,a,c,u=this;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),null!=(n=document.querySelector("".concat(this.getSelectors().creditCardRadioInput,'[value="').concat(this.options.paymentId,'"]')))&&!1!==n.checked||!this._confirmForm||this._confirmForm.submit(),!n||!0!==n.checked){e.next=15;break}return(o=document.getElementById("".concat(this.getInputFields().verificationCode.errors))).textContent="",e.next=8,this._componentsObject.createToken();case 8:if(r=e.sent,i=r.token,!(a=r.error)){e.next=14;break}return o.textContent=a.message,e.abrupt("return");case 14:a||(c=this.options.shopUrl+"/mollie/components/store-card-token/"+this.options.customerId+"/"+i)&&this._confirmForm&&fetch(c,{headers:{"Content-Type":"application/json; charset=utf-8"}}).then((function(){document.getElementById("cardToken").setAttribute("value",i),u._confirmForm.submit()})).catch((function(){u._confirmForm.submit()}));case 15:case"end":return e.stop()}}),e,this)})),a=function(){var e=this,t=arguments;return new Promise((function(n,o){var r=i.apply(e,t);function a(e){h(r,n,o,a,c,"next",e)}function c(e){h(r,n,o,a,c,"throw",e)}a(void 0)}))},function(e){return a.apply(this,arguments)})}])&&v(n.prototype,o),r&&v(n,r),t}(o.a);function k(e){return(k="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function w(e,t,n,o,r,i,a){try{var c=e[i](a),u=c.value}catch(e){return void n(e)}c.done?t(u):Promise.resolve(u).then(o,r)}function P(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function C(e,t){return!t||"object"!==k(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function E(e){return(E=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function A(e,t){return(A=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}!function(e,t,n){t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(_,"options",{paymentId:null,customerId:null,locale:null,profileId:null,shopUrl:null,testMode:!0});var O=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),C(this,E(t).apply(this,arguments))}var n,o,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&A(e,t)}(t,e),n=t,(o=[{key:"init",value:function(){var e=document.querySelector("div.mollie-ideal-issuer");if(null!=e){var t=e.getAttribute("data-shop-url"),n=document.querySelector("#iDealIssuer");"/"===t.substr(-1)&&(t=t.substr(0,t.length-1));var o=e.getAttribute("data-customer-id"),r=document.querySelector("#confirmPaymentForm"),i=document.querySelector('#confirmPaymentForm button[type="submit"]'),a=document.querySelectorAll('#confirmPaymentForm input[type="radio"]'),c=document.querySelector('#confirmPaymentForm input[type="radio"].ideal'),u=function(){void 0===c||!1===c.checked?e.classList.add("d-none"):e.classList.remove("d-none")};u(),a.forEach((function(e){e.addEventListener("change",(function(){u()}))})),r.addEventListener("submit",function(){var e,a=(e=regeneratorRuntime.mark((function e(a){var u;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a.preventDefault(),null!==i&&(i.disabled=!0),setTimeout((function(){r.submit()}),2e3),null!=c&&!1!==c.checked&&null!=n||r.submit(),null!=c&&!0===c.checked&&null!=n&&(u=t+"/mollie/ideal/store-issuer/"+o+"/"+n.value,fetch(u,{headers:{"Content-Type":"application/json; charset=utf-8"}}).then(r.submit()).catch(r.submit()));case 5:case"end":return e.stop()}}),e)})),function(){var t=this,n=arguments;return new Promise((function(o,r){var i=e.apply(t,n);function a(e){w(i,o,r,a,c,"next",e)}function c(e){w(i,o,r,a,c,"throw",e)}a(void 0)}))});return function(e){return a.apply(this,arguments)}}())}}}])&&P(n.prototype,o),r&&P(n,r),t}(o.a),I=n("k8s9");function F(e){return(F="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function j(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function T(e){return(T=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function x(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function q(e,t){return(q=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var M=function(e){function t(){var e,n,o,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var i=arguments.length,a=new Array(i),c=0;c<i;c++)a[c]=arguments[c];return o=this,n=!(r=(e=T(t)).call.apply(e,[this].concat(a)))||"object"!==F(r)&&"function"!=typeof r?x(o):r,function(e,t,n){t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}(x(n),"_data",{form:null,selectedProduct:null,shippingContact:null,shippingMethodId:null,cartAmount:0,cartToken:"",csrfTokenAuthorize:"",csrfTokenShippingMethods:"",currency:"",shippingAmount:0}),n}var n,o,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&q(e,t)}(t,e),n=t,(o=[{key:"init",value:function(){var e=this;e._client=new I.a(window.accessKey,window.contextToken),window.ApplePaySession&&"https:"===location.protocol&&this.isApplePayAvailable().then((function(t){void 0!==t.available&&!0===t.available&&e.enableApplePayButtons()}))}},{key:"totalAmount",value:function(){return this._data.cartAmount+this._data.shippingAmount}},{key:"isApplePayAvailable",value:function(){return new Promise((function(e,t){fetch("/mollie/apple-pay/available").then((function(e){return e.json()})).then((function(t){return e(t)})).catch((function(e){t()}))}))}},{key:"enableApplePayButtons",value:function(){var e=this,t=document.querySelectorAll(".js-apple-pay");t.length&&t.forEach((function(t){t.classList.remove("d-none"),t.addEventListener("click",(function(n){n.preventDefault(),e.clearNotification(),e._data.form=t.parentNode;var o=e._data.form.querySelectorAll('#mollie-apd-csrf input[name="_mollie_csrf_token"]');o.length>1&&(e._data.csrfTokenAuthorize=o[0].value,e._data.csrfTokenShippingMethods=o[1].value);var r=e._data.form.querySelector('input[name="id"]').value,i=e._data.form.querySelector('input[name="name"]').value,a=e._data.form.querySelector('input[name="price"]').value,c=e._data.form.querySelector('input[name="countryCode"]').value,u=e._data.form.querySelector('input[name="currency"]').value,l=e.getProductPrice(r);e._data.cartAmount=a,e._data.currency=u,e.createPaymentRequest("product",c,u,i),l.then((function(t){e._data.selectedProduct=t.data,e._data.cartAmount=e._data.selectedProduct.price}))}))}))}},{key:"createPaymentRequest",value:function(e,t,n,o){var r=this,i={countryCode:t,currencyCode:n,supportedNetworks:["amex","maestro","masterCard","visa","vPay"],merchantCapabilities:["supports3DS"],requiredShippingContactFields:["name","postalAddress","phone","email"],total:{label:o,amount:this._data.cartAmount}},a=new ApplePaySession(3,i);a.onvalidatemerchant=function(e){r.performValidation(e.validationURL).then((function(e){try{a.completeMerchantValidation(e)}catch(e){r.displayNotification(e.message,a)}})).catch((function(e){r.displayNotification(e,a)}))},a.onshippingcontactselected=function(e){r._data.shippingContact=e.shippingContact,void 0!==r._data.shippingContact.countryCode&&(t=r._data.shippingContact.countryCode);var n=ApplePaySession.STATUS_SUCCESS;r.getShippingMethods(t).then((function(e){if(void 0!==e.error&&null!==e.error)r.displayNotification(e.error,a);else{e.length&&(r._data.shippingMethodId=e[0].identifier,r._data.shippingAmount=e[0].amount);var t={type:"final",label:"Total amount",amount:r.totalAmount()},o=[{type:"final",label:"Subtotal",amount:r._data.cartAmount},{type:"final",label:"Shipping costs",amount:r._data.shippingAmount}];r.getShippingAmount().then((function(e){r._data.cartToken=e.cartToken,r._data.shippingMethodId=e.shippingMethod.id,r._data.shippingAmount=e.totalPrice})).catch((function(e){r.displayNotification(e,a)}));try{a.completeShippingContactSelection(n,e,t,o)}catch(e){r.displayNotification(e.message,a)}}})).catch((function(e){r.displayNotification(e,a)}))},a.onshippingmethodselected=function(e){r._data.shippingMethodId=e.shippingMethod.identifier,r.getShippingAmount().then((function(e){r._data.cartToken=e.cartToken,r._data.shippingAmount=e.totalPrice;var t=ApplePaySession.STATUS_SUCCESS,n={type:"final",label:"Total amount",amount:r.totalAmount()},o=[{type:"final",label:"Subtotal",amount:r._data.cartAmount},{type:"final",label:"Shipping costs",amount:r._data.shippingAmount}];try{a.completeShippingMethodSelection(t,n,o)}catch(e){r.displayNotification(e.message,a)}})).catch((function(e){r.displayNotification(e,a)}))},a.onpaymentmethodselected=function(){var e={type:"final",label:"Total amount",amount:r.totalAmount()},t=[{type:"final",label:"Subtotal",amount:r._data.cartAmount},{type:"final",label:"Shipping costs",amount:r._data.shippingAmount}];try{a.completePaymentMethodSelection(e,t)}catch(e){r.displayNotification(e.message,a)}},a.onpaymentauthorized=function(e){r.sendPaymentToken(e.payment).then((function(e){var t,n;if(void 0!==e.errors&&null!==e.errors&&e.errors.length>0){t=ApplePaySession.STATUS_FAILURE;var o="";e.errors.forEach((function(e){o+=e+"<br />"})),r.displayNotification(o,a)}else void 0!==e.redirectUrl&&null!==e.redirectUrl&&""!==e.redirectUrl&&(t=ApplePaySession.STATUS_SUCCESS,n=e.redirectUrl);try{a.completePayment(t)}catch(e){r.displayNotification(e.message,a)}n&&(document.location=n)})).catch((function(e){r.displayNotification(e,a)}))},a.oncancel=function(){},a.begin()}},{key:"performValidation",value:function(e){return new Promise((function(t,n){fetch("/mollie/apple-pay/validate?validationUrl="+e).then((function(e){return e.json()})).then((function(e){return t(e)})).catch((function(e){n()}))}))}},{key:"sendPaymentToken",value:function(e){var t=this,n={paymentToken:JSON.stringify(e.token),shippingContact:JSON.stringify(e.shippingContact),currency:t._data.currency,customer:t._data.shippingContact,productId:t._data.selectedProduct.id,shippingMethodId:t._data.shippingMethodId,cartAmount:t._data.cartAmount,cartToken:t._data.cartToken,shippingAmount:t._data.shippingAmount,totalAmount:t.totalAmount(),_csrf_token:t._data.csrfTokenAuthorize};return new Promise((function(e){t._client.post("/mollie/apple-pay/authorize",JSON.stringify(n),(function(t){return e(JSON.parse(t))}))}))}},{key:"getProductPrice",value:function(e){return new Promise((function(t,n){fetch("/mollie/apple-pay/product/"+e+"/price").then((function(e){return e.json()})).then((function(e){return t(e)})).catch((function(e){n()}))}))}},{key:"getShippingAmount",value:function(){var e=this;return new Promise((function(t,n){fetch("/mollie/apple-pay/shipping-costs/"+e._data.shippingMethodId+"/"+e._data.selectedProduct.id).then((function(e){return e.json()})).then((function(e){return t(e)})).catch((function(e){n()}))}))}},{key:"getShippingMethods",value:function(e){var t=this,n={countryCode:e,_csrf_token:t._data.csrfTokenShippingMethods};return new Promise((function(e){t._client.post("/mollie/apple-pay/shipping-methods",JSON.stringify(n),(function(t){return e(JSON.parse(t))}))}))}},{key:"displayNotification",value:function(e,t,n){var o=document.querySelector("div.flashbags.container");if(null==n&&(n="danger"),void 0!==o){var r='<div role="alert" class="alert alert-'.concat(n,'"><div class="alert-content-container"><div class="alert-content">').concat(e,"</div></div></div>");o.innerHTML=r,window.scrollTo(0,0)}}},{key:"clearNotification",value:function(){var e=document.querySelector("div.flashbags.container");void 0!==e&&(e.innerHTML="")}}])&&j(n.prototype,o),r&&j(n,r),t}(o.a);function N(e){return(N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function U(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function L(e,t){return!t||"object"!==N(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function D(e){return(D=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function R(e,t){return(R=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var H=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),L(this,D(t).apply(this,arguments))}var n,o,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&R(e,t)}(t,e),n=t,(o=[{key:"getClosest",value:function(e,t){for(Element.prototype.matches||(Element.prototype.matches=Element.prototype.matchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector||Element.prototype.oMatchesSelector||Element.prototype.webkitMatchesSelector||function(e){for(var t=(this.document||this.ownerDocument).querySelectorAll(e),n=t.length;--n>=0&&t.item(n)!==this;);return n>-1});e&&e!==document;e=e.parentNode)if(e.matches(t))return e;return null}},{key:"init",value:function(){var e=document.querySelector(".payment-method-input.applepay"),t=this.getClosest(e,".payment-method");t&&t.classList&&(window.ApplePaySession&&window.ApplePaySession.canMakePayments()||t.classList.add("d-none"))}}])&&U(n.prototype,o),r&&U(n,r),t}(o.a),B=window.PluginManager;B.register("MollieIDealIssuer",O),B.register("MollieApplePayDirect",M),B.register("MollieApplePayPaymentMethod",H),B.register("MollieCreditCardComponents",f,"#mollie_components_credit_card"),B.register("MollieCreditCardComponentsSw64",_,"#mollie_components_credit_card_sw64")}},[["eYm7","runtime","vendor-node","vendor-shared"]]]);