let username;

/* user name */
function getUser() {
   const src = '/api/user';
   fetch(src)
      .then(response => response.json())
      .then(result => {
         const userData = result.data;

         const welcomeElement = document.getElementsByClassName('welcome')[0];

         if (userData) {
            username = userData.name;
            welcomeElement.innerText = `${username}，您的歷史訂單如下：`;
         } else {
            parent.location.href = '/';
         }
      })
      .catch(error => console.log(error));
}

getUser();

/* get orders */
function getOrders() {
   const src = '/api/orders';
   fetch(src)
      .then(response => response.json())
      .then(result => {
         orderDataArray = result.data;

         createOrdersDetermine(orderDataArray);
      })
      .catch(error => console.log(error));
}

function removeAllChildNodes(parent) {
   while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
   }
}

function createOrdersDetermine(orderDataArray) {
   const ordersListElement = document.querySelector('.orders-list');

   removeAllChildNodes(ordersListElement);

   if (orderDataArray == null) {
      const welcomeElement = document.getElementsByClassName('welcome')[0];
      welcomeElement.innerText = `${username}，您好：`

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
         
         createAPIElement(orderData, orderAElement);
      }
   }
}

function createAPIElement(orderData, orderAElement) {
   const orderNumber = orderData.number;
   const attractionName = orderData.attr_name;

   const orderContent = document.createTextNode(`${attractionName} (${orderNumber})`);
   orderAElement.appendChild(orderContent);
   
   orderAElement.href = `/thankyou?number=${orderNumber}`;
}

getOrders();