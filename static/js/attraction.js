// Get attractionId from href
const currentUrl = location.href;
const currentUrlArray = currentUrl.split('/')

const id = currentUrlArray[currentUrlArray.length - 1];

// Attraction Element
const attractionImageElement = document.getElementsByClassName('attraction-image')[0];
const nameElement = document.getElementsByClassName('name')[0];
const categoryMrtElement = document.getElementsByClassName('category-mrt')[0];
const descriptionElement = document.getElementsByClassName('description')[0];
const addressElement = document.getElementsByClassName('address')[0];
const transportElement = document.getElementsByClassName('transport')[0];
const circleAreaElement = document.getElementsByClassName('circle-area')[0];

// Put attractionId into input
const idInput = document.getElementById('idInput');
idInput.value = id;

// halfDay Element
const halfDayInput = document.querySelectorAll('[name=halfDay]');
const feeNumberElement = document.getElementsByClassName('fee-number')[0];

// carousel arrow Element
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');

// Go /booking form
const form = document.getElementById('form');

// attractionModels
let attractionModels = {
   attrSrc: null,
   attractionData: null,
   userData: null,
   bookingState: null,
   srcDetermine: function() {
      if (id >= 1) {
         this.attrSrc =  `/api/attraction/${id}`;
         return;
      } 
   },
   fetchGetAttrAPI: function() {
      attrSrc = this.attrSrc;
      return fetch(attrSrc)
         .then(response => response.json())
         .then((result) => this.attractionData = result.data);
   },
   fetchGetUserAPI: function() {
      const getUserSrc = '/api/user';

      return fetch(getUserSrc)
         .then(response => response.json())
         .then(result => this.userData = result.data);  
   },
   fetchPostBookingAPI: function() {
      const id = document.getElementById('idInput').value;
      const date = document.getElementById('date').value;
      if (!this.dateConfirm(date)) return;

      const time = document.querySelector('input[name=halfDay]:checked').value;
      const price = document.getElementById('priceInput').value;

      const postBookingSrc = '/api/booking';
   
      return fetch(postBookingSrc, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               "attrationId": id,
               "date": date,
               "time": time,
               "price": price
            })
         })
         .then(response => response.json())
         .then(result => this.bookingState = result);
   },
   dateConfirm: function(dateValue) {
      dateArray = dateValue.split('-').map(date => parseInt(date));

      const today = new Date();
      const dateSelected = new Date(dateArray[0], dateArray[1], dateArray[2]);

      if (dateSelected < today) return false;
      return true;
   }
};

// attractionViews
let attractionViews = {
   removeAllChildNodes: function(parent) {
      while (parent.firstChild) {
         parent.removeChild(parent.firstChild);
      }
   },
   openModal: function(modal) {
      if (modal == null) return;
      modal.classList.add('active');
      overlay.classList.add('active');
   },
   // halfDay change
   priceShow: function() {
      let halfDayChecked = document.querySelector('[name=halfDay]:checked');
      if (halfDayChecked.value === 'morning') {
         feeNumberElement.innerText = 2000;
      } else if (halfDayChecked.value === 'afternoon') {
         feeNumberElement.innerText = 2500;
      }
   
      const priceInput = document.getElementById('priceInput');
      priceInput.value = feeNumberElement.innerText;
   },
   // create attraction-related element
   showNullSrc: function() {
      const attrSrc = attractionModels.attrSrc;
      if (attrSrc == null) {
         const attractionIntroductionElement = document.getElementsByClassName('attraction-introduction')[0];
         const sectionElement = document.getElementsByTagName('section')[0];
         const hrElement = document.getElementsByTagName('hr')[0];
   
         this.removeAllChildNodes(attractionIntroductionElement);
         this.removeAllChildNodes(sectionElement);
         hrElement.remove();
   
         return;
      }
   },
   createDetermine: function() {
      const attractionData = attractionModels.attractionData;

      if (attractionData == null) {
         const attractionIntroductionElement = document.getElementsByClassName('attraction-introduction')[0];
         const sectionElement = document.getElementsByTagName('section')[0];
         const hrElement = document.getElementsByTagName('hr')[0];
         
         this.removeAllChildNodes(attractionIntroductionElement);
         this.removeAllChildNodes(sectionElement);
         hrElement.remove();

         return;
      } else {
         this.createAPIElement(attractionData);
   
         this.carousel();
      }
   },
   createAPIElement: function(attractionData) {
      let images = attractionData.images;
      let name = attractionData.name;
      let mrt = attractionData.mrt;
      if (!mrt) {
         mrt = '無';
      }
      let category = attractionData.category;
      let description = attractionData.description;
      let address = attractionData.address;
      let transport = attractionData.transport;
      if (!transport) {
         transport = '無';
      }

      this.removeAllChildNodes(attractionImageElement);
      this.removeAllChildNodes(nameElement);
      this.removeAllChildNodes(categoryMrtElement);
      this.removeAllChildNodes(descriptionElement);
      this.removeAllChildNodes(addressElement);
      this.removeAllChildNodes(transportElement);
   
      for (let image of images) {
         let imageElement = document.createElement('img');
         imageElement.src = image;
   
         let circleElement = document.createElement('div');
         circleElement.classList.add('circle');
   
         attractionImageElement.appendChild(imageElement);
         circleAreaElement.append(circleElement);
      }
   
      let nameContent = document.createTextNode(name);
      nameElement.appendChild(nameContent);
   
      let categoryMrtContent = document.createTextNode(`${category} at ${mrt}`);
      categoryMrtElement.appendChild(categoryMrtContent);
   
      let descriptionContent = document.createTextNode(description);
      descriptionElement.appendChild(descriptionContent);
   
      let addressContent = document.createTextNode(address);
      addressElement.appendChild(addressContent);
   
      let transportContent = document.createTextNode(transport);
      transportElement.appendChild(transportContent);
   },
   // carousel
   carousel: function() {
      const imageElementArray = Array.from(attractionImageElement.querySelectorAll('img'));
      const circleElementArray = Array.from(circleAreaElement.querySelectorAll('.circle'));
      
      let initialImageElement = imageElementArray[0];
      initialImageElement.classList.add('active');
   
      let initialCircleElement = circleElementArray[0];
      initialCircleElement.classList.add('active');
   },
   lastImage: function() {
      const imageElementArray = Array.from(attractionImageElement.querySelectorAll('img'));
      const circleElementArray = Array.from(circleAreaElement.querySelectorAll('.circle'));

      const currentImageElement = attractionImageElement.getElementsByClassName('active')[0];
      const currentCircleElement = circleAreaElement.getElementsByClassName('active')[0];

      let lastImageElement = imageElementArray[imageElementArray.indexOf(currentImageElement) - 1];
      let lastCircleElement = circleElementArray[circleElementArray.indexOf(currentCircleElement) - 1];
   
      if (imageElementArray.indexOf(currentImageElement) - 1 < 0) lastImageElement = imageElementArray[imageElementArray.length - 1];
      if (circleElementArray.indexOf(currentCircleElement) - 1 < 0) lastCircleElement = circleElementArray[circleElementArray.length - 1];
      
      currentImageElement.classList.remove('active');
      lastImageElement.classList.add('active');
   
      currentCircleElement.classList.remove('active');
      lastCircleElement.classList.add('active');
   },
   nextImage: function() {
      const imageElementArray = Array.from(attractionImageElement.querySelectorAll('img'));
      const circleElementArray = Array.from(circleAreaElement.querySelectorAll('.circle'));

      const currentImageElement = attractionImageElement.getElementsByClassName('active')[0];
      const currentCircleElement = circleAreaElement.getElementsByClassName('active')[0];

      let nextImageElement = imageElementArray[imageElementArray.indexOf(currentImageElement) + 1];
      let nextCircleElement = circleElementArray[circleElementArray.indexOf(currentCircleElement) + 1];
   
      if (imageElementArray.indexOf(currentImageElement) + 1 >= imageElementArray.length) nextImageElement = imageElementArray[0];
      if (circleElementArray.indexOf(currentCircleElement) + 1 >= circleElementArray.length) nextCircleElement = circleElementArray[0];
      
      currentImageElement.classList.remove('active');
      nextImageElement.classList.add('active');
   
      currentCircleElement.classList.remove('active');
      nextCircleElement.classList.add('active');
   },
   // signin check before going /booking
   signinOrNot: function() {
      const userData = attractionModels.userData;

      if (userData) {
         return;
      } else {
         const openModalButtons = document.querySelectorAll('[data-modal-target]');
   
         openModalButtons.forEach(button => {
            const modal = document.querySelector(button.dataset.modalTarget); 
            this.openModal(modal);
         });
      }
   },
   // final check before going /booking
   bookingDetermine: function() {
      const bookingSuccess = attractionModels.bookingState['ok'];
      const bookingFalied = attractionModels.bookingState['error'];

      if (bookingSuccess) {
         parent.location.href = '/booking';
      }
      if (bookingFalied) {
         alert(attractionModels.bookingState.message);
         return;
      }
   }
};

// attractionControllers
let attractionControllers = {
   init: function() {
      this.showAttraction();
      this.minToday();
   },
   // show attraction-related informantion
   showAttraction: function() {
      attractionModels.srcDetermine();

      attractionViews.showNullSrc();

      attractionModels.fetchGetAttrAPI()
         .then(() => {
            attractionViews.createDetermine();
         })
         .then(() => {
            attractionModels.attractionData = null;
         })
         .catch(error => console.log(error));
   },
   // form of going /booking 
   goBooking: function() {
      attractionModels.fetchGetUserAPI()
         .then(() => {
            attractionViews.signinOrNot();
         })
         .then(() => {
            attractionModels.userData = null;
         })
         .catch(error => console.log(error));

      attractionModels.fetchPostBookingAPI()
         .then(() => {
            attractionViews.bookingDetermine();
         })
         .then(() => {
            attractionModels.bookingState = null;
         })
         .catch(error => console.log(error));
   },
   /* input date: min today */
   minToday: function() {
      let totay = new Date();
      let dd = totay.getDate();
      let mm = totay.getMonth() + 1;
      const yyyy = totay.getFullYear();
   
      if (dd < 10) {
         dd = `0${dd}`;
      }
      if (mm < 10) {
         mm = `0${mm}`;
      }
   
      today = `${yyyy}-${mm}-${dd}`;
      document.getElementById('date').setAttribute('min', today);
   }
};

attractionControllers.init();

// Event of halfDay Change
// If no halfDayInput bug, TBD
halfDayInput.forEach(halfDay => halfDay.addEventListener('change', attractionViews.priceShow));

attractionViews.priceShow();

leftArrow.addEventListener('click', attractionViews.lastImage);
rightArrow.addEventListener('click', attractionViews.nextImage);

/* Go Booking Page */

form.addEventListener('submit', e => {
   e.preventDefault();

   attractionControllers.goBooking();
})