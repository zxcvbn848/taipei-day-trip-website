let username;

// thankyouModels
let thankyouModels = {
   userData: null,
   orderData: null,
   signinCheck: function() {
      if (this.userData) {
         username = this.userData.name;   
      } else {
         parent.location.href = '/';
      }
   },
   fetchGetUserAPI: function() {
      const src = '/api/user';
      return fetch(src)
         .then(response => response.json())
         .then(result => {
            this.userData = result.data;
   
            this.signinCheck();
         });

   },
   queryStringDetermine: function(orderNumber, url) {
      if (!orderNumber || !url) {
         parent.location.href = '/';
         return;
      }
   },
   fetchGetOrderAPI: function() {
      const url = new URLSearchParams(window.location.search);
      const orderNumber = url.get('number');

      this.queryStringDetermine(orderNumber, url);
   
      const src = `/api/order/${orderNumber}`;
      return fetch(src)
         .then(response => response.json())
         .then(result => this.orderData = result.data);
   }
};

// thankyouViews
let thankyouViews = {
   removeAllChildNodes: function(parent) {
      while (parent.firstChild) {
         parent.removeChild(parent.firstChild);
      }
   },
   // show and deal with order element
   createDetermine: function() {
      const orderData = thankyouModels.orderData;
      const welcomeElement = document.getElementsByClassName('welcome')[0];
      const orderInformationElement = document.getElementsByClassName('order-information')[0];
      const spinner = document.getElementsByClassName('spinner')[0];

      orderInformationElement.removeChild(spinner);

      if (orderData == null) {
         welcomeElement.innerText = `${username}，您好：`;
      
         this.removeAllChildNodes(orderInformationElement);
   
         const noResultElement = document.createElement('div');
         const noResultContent = document.createTextNode('搜尋不到該訂單');
         noResultElement.appendChild(noResultContent);
         orderInformationElement.appendChild(noResultContent);
      } else if (orderData.status === 1) {
         welcomeElement.innerText = `${username}，您好：`;
      
         this.removeAllChildNodes(orderInformationElement);
   
         const orderNumberElement = document.createElement('div');
         orderNumberElement.classList.add('order-number');
         const orderNumber = orderData.number;
   
         const paymentElment = document.createElement('span');
   
         const paymentMessage = `(付款失敗)`;
         paymentElment.innerText = paymentMessage;
         paymentElment.style.color = '#FF9224';
   
         const orderNumberContent = document.createTextNode(`訂單編號：${orderNumber}`);
         orderNumberElement.appendChild(orderNumberContent);
         orderNumberElement.appendChild(paymentElment);
         orderInformationElement.appendChild(orderNumberElement);
      } else {
         this.createAPIElement(orderData);
      }
   },
   createAPIElement: function(orderData) {
      const orderInformationElement = document.getElementsByClassName('order-information')[0];
      for (let i = 0; i < orderInformationElement.children.length; i++) orderInformationElement.children[i].classList.remove('hidden');

      const welcomeElement = document.getElementsByClassName('welcome')[0];
      welcomeElement.innerText = `${username}，感謝您的購買！您的訂單資訊如下：`;
   
      const orderNumberElement = document.getElementsByClassName('order-number')[0];
      const attractionImageElement = document.getElementsByClassName('attraction-image')[0];
      const attractionNameElement = document.getElementsByClassName('name')[0];
      const dateElement = document.getElementsByClassName('date')[0];
      const timeElement = document.getElementsByClassName('time')[0];
      const feeElement = document.getElementsByClassName('fee')[0];
      const addressElement = document.getElementsByClassName('address')[0];
      const contactNameElement = document.getElementsByClassName('contact-name')[0];
      const contactEmailElement = document.getElementsByClassName('contact-email')[0];
      const contactPhoneElement = document.getElementsByClassName('contact-phone')[0];
         
      const orderNumber = orderData.number;
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
   
      const orderNumberContent = document.createTextNode(`訂單編號：${orderNumber}`);
      orderNumberElement.appendChild(orderNumberContent);
   
      const imageElement = document.createElement('img');
      imageElement.src = image;
      const loadingElement = document.createElement('div');
      loadingElement.innerText = 'Loading...';
      loadingElement.classList.add('loading');
      attractionImageElement.appendChild(loadingElement);
      attractionImageElement.appendChild(imageElement);

      imageElement.onload = function() {
         attractionImageElement.removeChild(loadingElement);
      };
   
      const nameContent = document.createTextNode(`台北一日遊：${attractionName}`);
      attractionNameElement.appendChild(nameContent);
   
      const dateContent = document.createTextNode(date);
      dateElement.appendChild(dateContent);
   
      const timeContent = document.createTextNode(actualTime);
      timeElement.appendChild(timeContent);
   
      let feeContent = document.createTextNode(`新台幣 ${price} 元`);
      feeElement.appendChild(feeContent);
   
      const addressContent = document.createTextNode(address);
      addressElement.appendChild(addressContent);
   
      const contactNameContent = document.createTextNode(contactName);
      contactNameElement.appendChild(contactNameContent);
   
      const contactEmailContent = document.createTextNode(contactEmail);
      contactEmailElement.appendChild(contactEmailContent);
   
      const contactPhoneContent = document.createTextNode(contactPhone);
      contactPhoneElement.appendChild(contactPhoneContent);
   },
   createLoadingElement: function() {
      const orderInformationElement = document.getElementsByClassName('order-information')[0];
      for (let i = 0; i < orderInformationElement.children.length; i++) orderInformationElement.children[i].classList.add('hidden');

      const spinner = document.createElement('div');
      spinner.classList.add('spinner');

      const spinnerText = document.createElement('div');
      spinnerText.classList.add('spinner-text');
      spinnerText.innerText = 'Loading';

      const spinnerSectorRed = document.createElement('div');
      spinnerSectorRed.classList.add('spinner-sector');
      spinnerSectorRed.classList.add('spinner-sector-red');

      const spinnerSectorBlue = document.createElement('div');
      spinnerSectorBlue.classList.add('spinner-sector');
      spinnerSectorBlue.classList.add('spinner-sector-blue');

      const spinnerSectorGreen = document.createElement('div');
      spinnerSectorGreen.classList.add('spinner-sector');
      spinnerSectorGreen.classList.add('spinner-sector-green');

      spinner.appendChild(spinnerText);
      spinner.appendChild(spinnerSectorRed);
      spinner.appendChild(spinnerSectorBlue);
      spinner.appendChild(spinnerSectorGreen);
      orderInformationElement.appendChild(spinner);
   }
};

// thankyouControllers
let thankyouControllers = {
   init: async function() {
      thankyouViews.createLoadingElement();
      
      await thankyouModels.fetchGetUserAPI()
         .then(() => thankyouModels.userData = null);

      thankyouModels.fetchGetOrderAPI()
         .then(() => thankyouViews.createDetermine())
         .then(() => thankyouModels.orderData = null)
         .catch(error => console.log(error));
   }
};

thankyouControllers.init();