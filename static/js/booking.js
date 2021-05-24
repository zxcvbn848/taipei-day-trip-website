let userId;

/* user name */
function getUser() {
   const src = '/api/user';
   fetch(src)
      .then(response => response.json())
      .then(result => {
         const userData = result.data;

         createUserElement(userData);
      })
      .catch(error => console.log(error));
}

function createUserElement(userData) {
   const welcomeElement = document.getElementsByClassName('welcome')[0];
   const nameElement = document.getElementById('name');
   const emailElememt = document.getElementById('email');

   if (userData) {
      welcomeElement.innerText = `您好，${userData.name}，待預訂的行程如下：`;

      nameElement.value = userData.name;
      nameElement.innerText = userData.name;

      emailElememt.value = userData.email;
      emailElememt.innerText = userData.email;

      userId = userData.id;
   } else {
/*             
      const bookingElement = document.getElementsByClassName('booking')[0];

      removeAllChildNodes(bookingElement);
*/
      parent.location.href = '/';
   }
}

getUser();

/* attraction information */
const attractionImageElement = document.getElementsByClassName('attraction-image')[0];
const attractionNameElement = document.getElementsByClassName('name')[0];
const dateElement = document.getElementsByClassName('date')[0];
const timeElement = document.getElementsByClassName('time')[0];
const feeElement = document.getElementsByClassName('fee')[0];
const addressElement = document.getElementsByClassName('address')[0];

showBooking();

function showBooking() {
   const src = '/api/booking';
   if (!src) {
      return;
   }
   fetchAPI(src);
}

function removeAllChildNodes(parent) {
   while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
   }
}

function fetchAPI(src) {
   fetch(src)
      .then(response => response.json())
      .then(result => {
         const bookingData = result.data;

         createDetermine(bookingData);
      })
      .catch(error => console.log(error));
}

function createDetermine(bookingData) {
   if (bookingData == null) {
      const bookingElement = document.getElementsByClassName('booking')[0];

      removeAllChildNodes(bookingElement);

      const noResultElement = document.createElement('div');
      noResultElement.classList.add('no-result');
      const noResultContent = document.createTextNode('目前沒有任何待預訂的行程');
      noResultElement.appendChild(noResultContent);
      bookingElement.appendChild(noResultElement);
   } else {
      createAPIElement(bookingData);
   }
}


function createAPIElement(bookingData) {
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

/* delete icon */
const deleteIcons = document.getElementsByClassName('delete-icon');

Array.from(deleteIcons).forEach(deleteIcon => {
   deleteIcon.addEventListener('click', deleteBooking);
});

function deleteBooking() {
   const yes = confirm('您確定要刪除嗎');

   if (yes) {
      this.parentElement.remove();

      const src = '/api/booking';
      fetchDeleteBookingAPI(src);
   } else {
      return;
   }
}

function fetchDeleteBookingAPI(src) {
   fetch(src, {
      method: 'DELETE',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         "userId": userId,
      })
   })
      .then(response => response.json())
      .then(result => {
         const deleteSuccess = result['ok'];
         const deleteFailed = result['error'];

         deleteBookingDetermine(deleteSuccess, deleteFailed);
      })
      .catch(err => console.log('錯誤', err));
}

function deleteBookingDetermine(deleteSuccess, deleteFailed) {
   if (deleteSuccess) {
      location.reload();
   }
   if (deleteFailed) {
      alert(result['message']);
   }
}

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
   if (yes) {
      getPrime();
   }
   return;
});

function getPrime() {
   // 取得 TapPay Fields 的 status
   const tappayStatus = TPDirect.card.getTappayFieldsStatus();

   // 確認是否可以 getPrime
   if (tappayStatus.canGetPrime === false) {
      console.log('can not get prime');
      return;
   }
   
   // Get prime
   TPDirect.card.getPrime(result => {
      if (result.status !== 0) {
         console.log('get prime error ' + result.msg);
         return;
      }
      // console.log('get prime success, prime: ' + result.card.prime);
      const prime = result.card.prime;
      goOrder(prime);
   });
}

function refreshOrder() {
   const src = '/api/booking';
   fetch(src, {
      method: 'DELETE',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         "userId": userId,
      })
   })
      .then(response => response.json())
      .then(result => {
         const deleteSuccess = result['ok'];
         const deleteFailed = result['error'];

         if (deleteSuccess) {
            return;
         }
         if (deleteFailed) {
            alert(result['message']);
         }
      })
      .catch(err => console.log('錯誤', err));
}

function goOrder(prime) {
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
   fetch(src, {
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
      .then(result => {
         const orderData = result.data;
         const orderFailed = result.error;
         
         if (orderData.payment.status === 0) {            
            refreshOrder();
            
            alert(orderData.payment.message);
            parent.location.href = `/thankyou?number=${orderData.number}`;

            return;
         } else {
            alert(orderData.payment.message);
            location.reload();
         }

         if (orderFailed) {
            alert(result.message);
            location.reload();
         }
      })
      .catch(err => console.log('錯誤', err));   
}