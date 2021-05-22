/* user name */
function getUser() {
   const src = '/api/user';
   fetch(src)
      .then(response => response.json())
      .then(result => {
         const userData = result.data;

         const welcomeElement = document.getElementsByClassName('welcome')[0];

         if (userData) {
            welcomeElement.innerText = `${userData.name}，感謝您的購買！您的訂單資訊如下：`;

            const localStorageData = JSON.parse(window.localStorage.getItem('data'));
            localStorageDetermine(localStorageData, userData);
         } else {
            parent.location.href = '/';
         }
      })
      .catch(error => console.log(error));
}

function localStorageDetermine(localStorageData, userData) {
   if (!localStorageData) {
      const welcomeElement = document.getElementsByClassName('welcome')[0];
      welcomeElement.innerText = `您好，${userData.name}，目前沒有任何行程`;

      const orderInformationElement = document.getElementsByClassName('order-information')[0];

      removeAllChildNodes(orderInformationElement);
   }
}

getUser();

function getOrder() {
   const localStorageData = JSON.parse(window.localStorage.getItem('data'));

   if (!localStorageData) return;

   const src = `/api/order/${localStorageData.number}`;
   fetch(src)
      .then(response => response.json())
      .then(result => {
         const orderData = result.data;

         createDetermine(orderData);
      })
      .catch(error => console.log(error));
}

function createDetermine(orderData) {
   if (orderData == null) {
      const orderInformationElement = document.getElementsByClassName('order-information')[0];

      removeAllChildNodes(orderInformationElement);

      const noResultElement = document.createElement('div');
      const noResultContent = document.createTextNode('目前沒有任何行程');
      noResultElement.appendChild(noResultContent);
      orderInformationElement.appendChild(noResultContent);
   } else {
      createAPIElement(orderData);
   }
}

function createAPIElement(orderData) {
   const attractionImageElement = document.getElementsByClassName('attraction-image')[0];
   const attractionNameElement = document.getElementsByClassName('name')[0];
   const dateElement = document.getElementsByClassName('date')[0];
   const timeElement = document.getElementsByClassName('time')[0];
   const feeElement = document.getElementsByClassName('fee')[0];
   const addressElement = document.getElementsByClassName('address')[0];
   const contactNameElement = document.getElementsByClassName('contact-name')[0];
   const contactEmailElement = document.getElementsByClassName('contact-email')[0];
   const contactPhoneElement = document.getElementsByClassName('contact-phone')[0];
      
   const price = orderData.price;

   const attractionName = orderData.trip.attraction.name;
   const address = orderData.trip.attraction.address;
   const image = orderData.trip.attraction.image;

   const date = orderData.trip.date;
   const time = orderData.trip.time;

   const contactName = orderData.contact.name;
   const contactEmail = orderData.contact.email;
   const contactPhone = orderData.contact.phone;

   let actualTime;
   if (time === 'morning') {
      actualTime = '早上 9 點到下午 4 點';
   }
   if (time === 'afternoon') {
      actualTime = '下午 2 點到晚上 9 點';
   }

   let imageElement = document.createElement('img');
   imageElement.src = image;
   attractionImageElement.appendChild(imageElement);

   let nameContent = document.createTextNode(`台北一日遊：${attractionName}`);
   attractionNameElement.appendChild(nameContent);

   let dateContent = document.createTextNode(date);
   dateElement.appendChild(dateContent);

   let timeContent = document.createTextNode(actualTime);
   timeElement.appendChild(timeContent);

   let feeContent = document.createTextNode(`新台幣 ${price} 元`);
   feeElement.appendChild(feeContent);

   let addressContent = document.createTextNode(address);
   addressElement.appendChild(addressContent);

   let contactNameContent = document.createTextNode(contactName);
   contactNameElement.appendChild(contactNameContent);

   let contactEmailContent = document.createTextNode(contactEmail);
   contactEmailElement.appendChild(contactEmailContent);

   let contactPhoneContent = document.createTextNode(contactPhone);
   contactPhoneElement.appendChild(contactPhoneContent);
}

function removeAllChildNodes(parent) {
   while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
   }
}

getOrder();