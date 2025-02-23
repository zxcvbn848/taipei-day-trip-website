let username;

let memberModels = {
   userData: null,
   orderDataArray: null,
   signinCheck: function() {
      const welcomeElement = document.getElementsByClassName('welcome')[0];
   
      if (this.userData) {
         username = this.userData.name;
         welcomeElement.innerText = `${username}，您的歷史訂單如下：`;
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
   fetchGetOrdersAPI: function() {
      const src = '/api/orders';
      return fetch(src)
         .then(response => response.json())
         .then(result => this.orderDataArray = result.data);
   }
};

let memberViews = {
   removeAllChildNodes: function(parent) {
      while (parent.firstChild) {
         parent.removeChild(parent.firstChild);
      }
   },
   // Show and deal with orders element
   createOrdersDetermine: function() {
      const orderDataArray = memberModels.orderDataArray;

      const ordersListElement = document.querySelector('.orders-list');
      const spinner = document.getElementsByClassName('spinner')[0];

      ordersListElement.removeChild(spinner);

      if (orderDataArray == null) {  
         const noResultElement = document.createElement('div');
         noResultElement.classList.add('no-result');
         const noResultContent = document.createTextNode('您尚未有任何行程');
         noResultElement.appendChild(noResultContent);
         ordersListElement.appendChild(noResultElement);
      } else {
         const ordersListUlElement = document.createElement('ul');
         ordersListElement.appendChild(ordersListUlElement);
   
         for (let orderData of orderDataArray) {
            const orderLiElement = document.createElement('li');
            const orderAElement = document.createElement('a');
            
            orderLiElement.appendChild(orderAElement);
            ordersListUlElement.appendChild(orderLiElement);
            
            this.createAPIElement(orderData, orderAElement);
         }
      }
   },
   createAPIElement: function(orderData, orderAElement) {
      const orderNumber = orderData.number;
      const attractionName = orderData.attr_name;
      const paymentStatus = orderData.status;
   
      const paymentElment = document.createElement('span');
   
      let paymentMessage;
      if (paymentStatus === 0) {
         paymentMessage = '付款成功';
         paymentElment.style.color = '#00A600';
      }
      if (paymentStatus === 1) {
         paymentMessage = '付款失敗';
         paymentElment.style.color = '#FF9224';
      }
   
      paymentElment.innerText = `(${paymentMessage})`;
   
      const orderContent = document.createTextNode(`${attractionName} (${orderNumber})`);
      orderAElement.appendChild(orderContent);
      orderAElement.appendChild(paymentElment);
      
      orderAElement.href = `/thankyou?number=${orderNumber}`;
   },
   createLoadingElement: function() {
      const ordersListElement = document.getElementsByClassName('orders-list')[0];

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
      ordersListElement.appendChild(spinner);
   }
};

let memberControllers = {
   init: async function() {
      memberViews.createLoadingElement();

      await this.showUserData();
      this.showOrders();
   },
   showUserData: function() {
      memberModels.fetchGetUserAPI()
         .then(() => memberModels.userData = null)
         .catch(error => console.log(error));
   },
   showOrders: function() {
      memberModels.fetchGetOrdersAPI()
         .then(() => memberViews.createOrdersDetermine())
         .then(() => memberModels.orderDataArray = null)
         .catch(error => console.log(error));
   }
};

memberControllers.init();