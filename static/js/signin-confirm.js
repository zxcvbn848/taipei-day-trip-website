const signinButton = document.getElementById('signinButton');
const signoutButton = document.getElementById('signoutButton');
const memberLink = document.getElementById('member-link');

/* singin confirm */
function signinConfirm() {
   const src = '/api/user';
   fetch(src)
      .then(response => response.json())
      .then(result => {
         const userData = result.data;
         signinDetermine(userData);
      })
      .catch(error => console.log(error));
}

function signinDetermine(userData) {
   if (userData) {
      signinButton.classList.add('hidden');
      signoutButton.classList.remove('hidden');
      memberLink.classList.remove('hidden');
   } else {
      signinButton.classList.remove('hidden');
      signoutButton.classList.add('hidden');
      memberLink.classList.add('hidden');
   }
}

signinConfirm();

/* For /booking authentication */
const bookingLink = document.getElementById('booking-link');
bookingLink.addEventListener('click', e => {
   e.preventDefault();

   signinPopup();
})

function signinPopup() {
   const src = '/api/user';
   fetch(src)
   .then(response => response.json())
   .then(result => {
      const userData = result.data;
      goBookingDetermine(userData);
   })
   .catch(error => console.log(error));
}

function goBookingDetermine(userData) {
   if (userData) {
      parent.location.href = '/booking';
   } else {
      const openModalButtons = document.querySelectorAll('[data-modal-target]');

      openModalButtons.forEach(button => {
         const modal = document.querySelector(button.dataset.modalTarget); 
         openModal(modal);
      });
   }
}

function openModal(modal) {
   if (modal == null) return
   modal.classList.add('active');
   overlay.classList.add('active');
}
