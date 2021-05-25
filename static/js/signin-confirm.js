const signinButton = document.getElementById('signinButton');
const signoutButton = document.getElementById('signoutButton');
const memberLink = document.getElementById('member-link');

// signinConfirmModels
let signinConfirmModels = {
   userData: null,
   // fetch /api/user with GET
   signinFetchAPI: function() {
      const src = '/api/user';
      return fetch(src)
         .then(response => response.json())
         .then(result => {
            const userData = result.data;

            this.userData = userData;
         });
   }
};

// signinConfirmViews
let signinConfirmViews = {
   // Signin check for navbar display
   signinDetermine: function() {
      const userData = signinConfirmModels.userData;

      if (userData) {
         signinButton.classList.add('hidden');
         signoutButton.classList.remove('hidden');
         memberLink.classList.remove('hidden');
      } else {
         signinButton.classList.remove('hidden');
         signoutButton.classList.add('hidden');
         memberLink.classList.add('hidden');
      }
   },
   // Signin check fo going /booking
   goBookingDetermine: function() {
      const userData = signinConfirmModels.userData;

      if (userData) {
         parent.location.href = '/booking';
      } else {
         const openModalButtons = document.querySelectorAll('[data-modal-target]');
   
         openModalButtons.forEach(button => {
            const modal = document.querySelector(button.dataset.modalTarget); 
            this.openModal(modal);
         });
   
         navbarLinks.classList.remove('active');
         overlayForNavbar.classList.remove('active');
      }
   },
   openModal: function(modal) {
      if (modal == null) return
      modal.classList.add('active');
      overlay.classList.add('active');
   }
};

// signinConfirmControllers
let signinConfirmControllers = {
   // Signin check for navbar display
   signinConfirm: function() {
      signinConfirmModels.signinFetchAPI()
         .then(() => {
            signinConfirmViews.signinDetermine();
         })
         .then(() => {
            signinConfirmModels.userData = null;
         })
         .catch(error => console.log(error));
   },
   // Signin check fo going /booking
   signinPopup: function() {
      signinConfirmModels.signinFetchAPI()
         .then(() => {
            signinConfirmViews.goBookingDetermine();
         })
         .catch(error => console.log(error));
   }
};

signinConfirmControllers.signinConfirm();

/* For /booking authentication */
const bookingLink = document.getElementById('booking-link');
bookingLink.addEventListener('click', e => {
   e.preventDefault();

   signinConfirmControllers.signinPopup();
})
