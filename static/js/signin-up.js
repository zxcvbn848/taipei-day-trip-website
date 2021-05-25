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
         .then(result => {
            this.signinState = result;
         });
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
         .then(result => {
            this.signupState = result;
         });
   }
};

// signinUpViews
let signinUpViews = {
   toggleNavbarList: function() {
      navbarLinks.classList.toggle('active');
      overlayForNavbar.classList.toggle('active');
   },
   openModal: function(modal) {
      if (modal == null) return
      modal.classList.add('active');
      overlay.classList.add('active');
   },
   closeModal: function(modal) {
      if (modal == null) return
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
   }
};

// signinUpControllers
let signinUpControllers = {
   // Signup Authentication
   signupCheck: function() {
      const passwordElement = document.getElementById('signupPassword');

      /* 資料驗證，待進行 */
      if (passwordElement.value.length < 4) {
         return;
      }
      /* 加密，待進行 */
      
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
      const passwordElement = document.getElementById('signinPassword');

      /* 資料驗證，待進行 */
      if (passwordElement.value.length < 4) {
         return;
      }
   
      /* 加密，待進行 */
      
      signinUpModels.fetchPatchUserAPI()
         .then(() => {
            signinUpViews.signinSuccessDetermine();
         })
         .then(() => {
            signinUpModels.signinState = null;
         })
         .catch(error => console.log(error));
   }
};

// Toggle Navbar-list 
toggleButton.addEventListener('click', e => {
   e.preventDefault();

   signinUpViews.toggleNavbarList();
});

overlayForNavbar.addEventListener('click', () => {
   signinUpViews.toggleNavbarList();
});

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
   modals.forEach(modal => {
      signinUpViews.closeModal(modal);
   });
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

// TBD
/* signout */
function signout() {
   const yes = confirm('確定要登出嗎？');

   signoutDetermine(yes);
}

function signoutDetermine(yes) {
   if (yes) {
      const src = '/api/user';
      fetchDeleteUserAPI(src);
   } else {
      return;
   }
}

function fetchDeleteUserAPI(src) {
   fetch(src, {
      method: 'DELETE'
   })
      .then(response => response.json())
      .then(result => {
         const signoutSuccess = result['ok'];
         const signoutFailed = result['error'];
         
         signoutSuccessDetermine(signoutSuccess, signoutFailed, result);
      })
      .catch(err => console.log('錯誤', err));   
}

function signoutSuccessDetermine(signoutSuccess, signoutFailed, result) {
   if (signoutSuccess) {
      location.reload(); 
   }
   if (signoutFailed) {
      alert(result['message']);
   }
}

signoutButton.addEventListener('click', signout);