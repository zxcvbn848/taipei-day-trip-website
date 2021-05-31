// For navbar toggle button
const toggleButton = document.getElementsByClassName('toggle-button')[0];
const navbarLinks = document.getElementsByClassName('navbar-links')[0];

const overlayForNavbar = document.getElementById('overlay-for-navbar');

// For Popup
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const goSignupButton = document.querySelector('#goSignup');
const goSigninButton = document.querySelector('#goSignin');

const overlay = document.getElementById('overlay');

// signinUpModels
let signinUpModels = {
   signinState: null,
   signupState: null,
   signoutState: null,
   // Data Authentication
   dataAuth: function(element) {
      const emailPattern = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]{2,6}$/;
      const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/;
      
      if (element.nameElement) {
         if (element.passwordElement.value.length < 4 ?? element.emailElement.value.length === 0 ?? element.nameElement.value.length === 0) {
            return false;
         }   
      }

      if (element.passwordElement.value.length < 4 ?? element.emailElement.value.length === 0) {
         return false;
      }

      const patternBoolean = emailPattern.test(element.emailElement.value) && passwordPattern.test(element.passwordElement.value);
      
      return patternBoolean;
   },   
   fetchPatchUserAPI: function() {
      const emailElememt = document.getElementById('signinEmail');
      const passwordElement = document.getElementById('signinPassword');

      const src = '/api/user';
      return fetch(src, {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               "email": emailElememt.value,
               "password": passwordElement.value
            })
         })
         .then(response => response.json())
         .then(result => this.signinState = result);
   },
   fetchPostUserAPI: function() {
      const nameElement = document.getElementById('signupName');
      const emailElememt = document.getElementById('signupEmail');
      const passwordElement = document.getElementById('signupPassword');
      
      const src = '/api/user';
      return fetch(src, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               "name": nameElement.value,
               "email": emailElememt.value,
               "password": passwordElement.value
            })
         })
         .then(response => response.json())
         .then(result => this.signupState = result);
   },
   // Signout
   fetchDeleteUserAPI: function() {
      const src = '/api/user';
      return fetch(src, {
            method: 'DELETE'
         })
         .then(response => response.json())
         .then(result => this.signoutState = result);
   }
};

// signinUpViews
let signinUpViews = {
   toggleNavbarList: function() {
      navbarLinks.classList.toggle('active');
      overlayForNavbar.classList.toggle('active');
   },
   openModal: function(modal) {
      if (modal == null) return;
      modal.classList.add('active');
      overlay.classList.add('active');
   },
   closeModal: function(modal) {
      if (modal == null) return;
      modal.classList.remove('active');
      overlay.classList.remove('active');
   },
   // Signin success or not
   signinSuccessDetermine: function() {
      const signinSuccess = signinUpModels.signinState['ok'];
      const signinFailed = signinUpModels.signinState['error'];
      
      const emailElememt = document.getElementById('signinEmail');
      const passwordElement = document.getElementById('signinPassword');
   
      const signinMessageElement = document.getElementById('signinMessage');
      signinMessageElement.innerText = '';
      signinMessageElement.classList.remove('show');
   
      if (signinSuccess) {
         signinMessageElement.innerText = '';
         signinMessageElement.classList.remove('show');
   
         location.reload();
         
         closeModalButtons.forEach(button => {
            const modal = button.closest('.modal'); 
            signinUpViews.closeModal(modal);
         });
            
         emailElememt.value = '';
         emailElememt.innerText = '';
         passwordElement.value = '';
         passwordElement.innerText = '';
      }
   
      if (signinFailed) {
         signinMessageElement.innerText = signinUpModels.signinState['message'];
         signinMessageElement.classList.add('show');
   
         emailElememt.value = '';
         emailElememt.innerText = '';
         passwordElement.value = '';
         passwordElement.innerText = '';
      }
   },
   // Signin success or not
   signupSuccessDetermine: function() {
      const signupSuccess = signinUpModels.signupState['ok'];
      const signupFailed = signinUpModels.signupState['error'];

      const nameElement = document.getElementById('signupName');
      const emailElememt = document.getElementById('signupEmail');
      const passwordElement = document.getElementById('signupPassword');
   
      const signupMessageElement = document.getElementById('signupMessage');
      signupMessageElement.innerText = '';
      signupMessageElement.classList.remove('show');
      
      if (signupSuccess) {
         signupMessageElement.classList.add('show');
         signupMessageElement.innerText = '註冊成功';
         signupMessageElement.style.color = 'green';
   
         nameElement.value = '';
         nameElement.innerText = '';
         emailElememt.value = '';
         emailElememt.innerText = '';
         passwordElement.value = '';
         passwordElement.innerText = '';
      }
   
      if (signupFailed) {
         signupMessageElement.innerText = signinUpModels.signupState['message'];
         signupMessageElement.classList.add('show');
         signupMessageElement.style.color = 'red';
   
         nameElement.value = '';
         nameElement.innerText = '';
         emailElememt.value = '';
         emailElememt.innerText = '';
         passwordElement.value = '';
         passwordElement.innerText = '';
      }
   },
   // Signout 
   signoutSuccessDetermine: function() {
      const signoutSuccess = signinUpModels.signoutState['ok'];
      const signoutFailed = signinUpModels.signoutState['error'];

      if (signoutSuccess) location.reload();
      if (signoutFailed) alert(result['message']);
   }
};

// signinUpControllers
let signinUpControllers = {
   // Signup Authentication
   signupCheck: function() {
      /* hash, TBD */

      const nameElement = document.getElementById('signupName');
      const emailElement = document.getElementById('signupEmail');
      const passwordElement = document.getElementById('signupPassword');

      const signupElements = {
         nameElement,
         emailElement,
         passwordElement
      }
      
      const dataAuth = signinUpModels.dataAuth(signupElements);
      if (!dataAuth) {
         alert('資料格式錯誤');
         return;
      }

      signinUpModels.fetchPostUserAPI()
         .then(() => {
            signinUpViews.signupSuccessDetermine();
         })
         .then(() => {
            signinUpModels.signupState = null;
         })
         .catch(error => console.log(error));
   },
   // Signin Authentication
   signinCheck: function() {
      /* hash, TBD */

      const emailElement = document.getElementById('signinEmail');
      const passwordElement = document.getElementById('signinPassword');

      const signinElements = {
         emailElement,
         passwordElement
      }

      const dataAuth = signinUpModels.dataAuth(signinElements);
      if (!dataAuth) {
         alert('資料格式錯誤');
         return;
      }

      signinUpModels.fetchPatchUserAPI()
         .then(() => {
            signinUpViews.signinSuccessDetermine();
         })
         .then(() => {
            signinUpModels.signinState = null;
         })
         .catch(error => console.log(error));
   },
   // Signout
   signoutCheck: function() {
      const yes = confirm('確定要登出嗎？');
      
      if (yes) {
         signinUpControllers.signout();
      } else {
         return;
      }
   },
   signout: function() {
      signinUpModels.fetchDeleteUserAPI()
      .then(() => signinUpViews.signoutSuccessDetermine())
      .then(() => signinUpModels.signoutState = null)
      .catch(error => console.log(error));
   }
};

// Toggle Navbar-list 
toggleButton.addEventListener('click', e => {
   e.preventDefault();

   signinUpViews.toggleNavbarList();
});

overlayForNavbar.addEventListener('click', () => signinUpViews.toggleNavbarList());

// Popup Modal
openModalButtons.forEach(button => {
   button.addEventListener('click', () => {
   // button.dataset.modalTarget = data-modal-target in HTML <button>
      const modal = document.querySelector(button.dataset.modalTarget); 
      signinUpViews.openModal(modal);

      navbarLinks.classList.remove('active');
      overlayForNavbar.classList.remove('active');
   });
});

closeModalButtons.forEach(button => {
   button.addEventListener('click', () => {
      const modal = button.closest('.modal'); 
      signinUpViews.closeModal(modal);
   });
});


overlay.addEventListener('click', () => {
   const modals = document.querySelectorAll('.modal.active');
   modals.forEach(modal => signinUpViews.closeModal(modal));
});

goSignupButton.addEventListener('click', () => {
   const signinModal = document.getElementById('modalSignin');
   const signupModal = document.getElementById('modalSignup');

   signinUpViews.closeModal(signinModal);
   signinUpViews.openModal(signupModal);
});

goSigninButton.addEventListener('click', () => {
   const signinModal = document.getElementById('modalSignin');
   const signupModal = document.getElementById('modalSignup');

   signinUpViews.closeModal(signupModal);
   signinUpViews.openModal(signinModal);
});

// For signin & signup Authentication
const signupForm = document.getElementById('signupForm');
const signinForm = document.getElementById('signinForm');

signupForm.addEventListener('submit', e => {
   e.preventDefault();

   signinUpControllers.signupCheck();
});

signinForm.addEventListener('submit', e => {
   e.preventDefault();

   signinUpControllers.signinCheck();
});

/* signout */

signoutButton.addEventListener('click', signinUpControllers.signoutCheck);