let userId;

// attration-related information element
const attractionImageElement = document.getElementsByClassName('attraction-image')[0];
const attractionNameElement = document.getElementsByClassName('name')[0];
const dateElement = document.getElementsByClassName('date')[0];
const timeElement = document.getElementsByClassName('time')[0];
const feeElement = document.getElementsByClassName('fee')[0];
const addressElement = document.getElementsByClassName('address')[0];

// bookingModels
let bookingModels = {
   userData: null,
   bookingData: null,
   deleteBookingState: null,
   orderData: null,
   // get userData
   fetchGetUserAPI: function() {
      const src = '/api/user';
      return fetch(src)
         .then(response => response.json())
         .then(result => this.userData = result.data);
   },
   // get bookingData
   fetchGetBookingAPI: function() {
      const src = '/api/booking';

      return fetch(src)
         .then(response => response.json())
         .then(result => this.bookingData = result.data);
   },
   fetchDeleteBookingAPI: function() {
      const src = '/api/booking';

      return fetch(src, {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               "userId": userId,
            })
         })
         .then(response => response.json())
         .then(result => this.deleteBookingState = result);
   },
   // get Prime
   getPrime: function() {
      return new Promise((resolve, reject) => {
         TPDirect.card.getPrime(result => {
            if (result.status !== 0) {
               console.log('get prime error ' + result.msg);
               return;
            }
            // console.log('get prime success, prime: ' + result.card.prime);
            resolve(result.card.prime);
         });
      }) 
   },
   fetchPostOrderAPI: async function() {
      const prime = await bookingModels.getPrime();

      const priceInput = document.getElementById('total-price');

      const attractionIdInput = document.getElementById('attraction-id');
      const attractionNameInput = document.getElementById('attraction-name');
      const addressInput = document.getElementById('address');
      const imageInput = document.getElementById('attraction-image');
   
      const dateInput = document.getElementById('date');
      const timeInput = document.getElementById('time');
   
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const phoneNumberInput = document.getElementById('phone-number');
   
      const src = '/api/orders';
      return fetch(src, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            "prime": prime,
            "order": {
               "price": priceInput.value,
               "trip": {
                  "attraction": {
                     "id": attractionIdInput.value,
                     "name": attractionNameInput.value,
                     "address": addressInput.value,
                     "image": imageInput.value
                  },
                  "date": dateInput.value,
                  "time": timeInput.value
               },
               "contact": {
                  "name": nameInput.value,
                  "email": emailInput.value,
                  "phone": phoneNumberInput.value
               }
            }
         })
      })
         .then(response => response.json())
         .then(result => this.orderData = result);
   }
};

// bookingViews
let bookingViews = {
   removeAllChildNodes: function(parent) {
      while (parent.firstChild) {
         parent.removeChild(parent.firstChild);
      }
   },
   // show and deal with User element
   createUserElement: function() {
      const welcomeElement = document.getElementsByClassName('welcome')[0];
      const nameElement = document.getElementById('name');
      const emailElememt = document.getElementById('email');

      const userData = bookingModels.userData;
   
      if (userData) {
         welcomeElement.innerText = `您好，${userData.name}，待預訂的行程如下：`;
   
         nameElement.value = userData.name;
         nameElement.innerText = userData.name;
   
         emailElememt.value = userData.email;
         emailElememt.innerText = userData.email;
   
         userId = userData.id;
      } else {
         parent.location.href = '/';
      }
   },
   // show and deal with booking element
   createDetermine: function() {
      const bookingData = bookingModels.bookingData;

      if (bookingData == null) {
         const bookingElement = document.getElementsByClassName('booking')[0];
   
         this.removeAllChildNodes(bookingElement);
   
         const noResultElement = document.createElement('div');
         noResultElement.classList.add('no-result');
         const noResultContent = document.createTextNode('目前沒有任何待預訂的行程');
         noResultElement.appendChild(noResultContent);
         bookingElement.appendChild(noResultElement);
      } else {
         this.createAPIElement(bookingData);
      }
   },
   createAPIElement: function(bookingData) {
      const id = bookingData.attraction.id;
      const image = bookingData.attraction.image;
      const name = bookingData.attraction.name;
      const date = bookingData.date;
      const time = bookingData.time;
      let actualTime;
      if (time === 'morning') {
         actualTime = '早上 9 點到下午 4 點';
      }
      if (time === 'afternoon') {
         actualTime = '下午 2 點到晚上 9 點';
      }
      const price = bookingData.price;
      const address = bookingData.attraction.address;
   
      document.getElementById('attraction-id').value = id;
   
      let imageElement = document.createElement('img');
      imageElement.src = image;
      attractionImageElement.appendChild(imageElement);
      document.getElementById('attraction-image').value = image;
   
      let nameContent = document.createTextNode(`台北一日遊：${name}`);
      attractionNameElement.appendChild(nameContent);
      document.getElementById('attraction-name').value = name;
   
      let dateContent = document.createTextNode(date);
      dateElement.appendChild(dateContent);
      document.getElementById('date').value = date;
   
      let timeContent = document.createTextNode(actualTime);
      timeElement.appendChild(timeContent);
      document.getElementById('time').value = time;
   
      let feeContent = document.createTextNode(`新台幣 ${price} 元`);
      feeElement.appendChild(feeContent);
   
      let addressContent = document.createTextNode(address);
      addressElement.appendChild(addressContent);
      document.getElementById('address').value = address;
   
      const totalPriceElement = document.getElementsByClassName('total-price')[0];
      totalPriceElement.innerText = `總價：新台幣 ${price} 元`;
      document.getElementById('total-price').value = price;
   }
};

// bookingControllers
/* Remember to change variables to null !!! */
let bookingControllers = {
   init: function() {
      this.showUserData();
      this.showBooking();
   },
   // show and deal with User Data
   showUserData: function() {
      bookingModels.fetchGetUserAPI()
         .then(() => bookingViews.createUserElement())
         .catch(error => console.log(error));
   },
   // show and deal with Booking Data
   showBooking: function() {
      bookingModels.fetchGetBookingAPI()
         .then(() => bookingViews.createDetermine())
         .then(() => {
            bookingModels.userData = null;
            bookingModels.bookingData = null;
         })
         .catch(error => console.log(error));
   },
   // Check before deleting booking 
   deleteBookingCheck: function() {
      const yes = confirm('您確定要刪除嗎');

      if (yes) {
         this.parentElement.remove();

         bookingControllers.deleteBooking();
      }
      return;
   },
   // delete booking
   deleteBooking: function() {
      bookingModels.fetchDeleteBookingAPI()
         .then(() => this.deleteBookingDetermine())
         .then(() => bookingModels.deleteBookingState = null)
         .catch(error => console.log(error));
   },
   // deal with delete booking
   deleteBookingDetermine: function() {
      const deleteSuccess = bookingModels.deleteBookingState['ok'];
      const deleteFailed = bookingModels.deleteBookingState['error'];

      if (deleteSuccess) location.reload();
      
      if (deleteFailed) alert(bookingModels.deleteBookingState['message']);
   },
   // go Order
   goOrder: function() {
      // Get status of TapPay Fields
      const tappayStatus = TPDirect.card.getTappayFieldsStatus();

      this.getPrimeFailed(tappayStatus);
      
      bookingModels.fetchPostOrderAPI()
      // go post order api
         .then(() => this.orderSuccessDetermine())
         .then(() => bookingModels.orderData = null)
         .catch(error => console.log(error));
   },
   getPrimeFailed: function(tappayStatus) {
      // Confirm whether can getPrime or not
      if (tappayStatus.canGetPrime === false) {
         console.log('can not get prime');
         return;
      }      
   },
   orderSuccessDetermine: function() {
      const orderData = bookingModels.orderData.data;
      const orderFailed = bookingModels.orderData.error;
      
      if (orderData) {            
         this.refreshBooking();

         alert(orderData.payment.message);
         parent.location.href = `/thankyou?number=${orderData.number}`;

         return;
      }

      if (orderFailed) {
         alert(bookingModels.orderData.message);
         location.reload();
      }      
   },
   refreshBooking: function() {
      bookingModels.fetchDeleteBookingAPI()
         .then(() => this.refreshBookingDetermine())
         .then(() => bookingModels.deleteBookingState = null)
         .catch(error => console.log(error));
   },
   refreshBookingDetermine: function() {
      const deleteSuccess = bookingModels.deleteBookingState['ok'];
      const deleteFailed = bookingModels.deleteBookingState['error'];

      if (deleteSuccess) return;
      
      if (deleteFailed) alert(bookingModels.deleteBookingState['message']);
   }
};

bookingControllers.init();

/* delete icon */
const deleteIcons = document.getElementsByClassName('delete-icon');

Array.from(deleteIcons).forEach(deleteIcon => {
   deleteIcon.addEventListener('click', bookingControllers.deleteBookingCheck);
});

/* Tappay */
TPDirect.setupSDK(20254, 'app_OJvQf0k7VFRyQgrs8HQYLXgYTcPr1WF4HBarLQ9a0xlaHFG0FPF5GCruoSnW', 'sandbox');

TPDirect.card.setup({
   fields: {
      number: {
         element: '#card-number',
         placeholder: '**** **** **** ****'
      },
      expirationDate: {
         element: '#overdue-date',
         placeholder: 'MM / YY'
      },
      ccv: {
         element: '#verified-password',
         placeholder: 'CVV'
      }
   },
   styles: {
      'input.ccv': {
         'font-size': '16px'
      },
      'input.expiration-date': {
         'font-size': '16px'
      },
      'input.card-number': {
         'font-size': '16px'
      },
      ':focus': {
         'border': '2px ridge blue'
      },
      '.valid': {
         'color': 'green'
      },
      '.invalid': {
         'color': 'red'
      }
   }
});

TPDirect.card.onUpdate(update => {
   const orderButton = document.querySelector('#order-button');
   if (update.canGetPrime) {
      // Enable submit Button to get prime.
      orderButton.removeAttribute('disabled');
   } else {
      // Disable submit Button to get prime.
      orderButton.setAttribute('disabled', true);
   }
});

/* go /api/order */
const orderForm = document.getElementById('order-form');
orderForm.addEventListener('submit', e => {
   e.preventDefault();

   const yes = confirm('您確定要訂購此行程並付款嗎？');
   
   if (yes) bookingControllers.goOrder();

   return;
});
