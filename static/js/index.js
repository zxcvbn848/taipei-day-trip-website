// display attractions
let page = 0;

// Detect Fetching or not
let isFetching = false;

// indexModels
let indexModels = {
   attractionsDataArray: null,
   srcDetermine: function(page, keyword) {
      if (page != null && keyword) return `/api/attractions?page=${page}&keyword=${keyword}`;
      if (page != null) return `/api/attractions?page=${page}`;
      return null;
   },
   fetchGetAttrsAPI: function(src) {
      return fetch(src)
         .then(response => response.json())
         .then(result => {
            let attractionDataArray = result.data;
            let nextPage = result.nextPage;
            
            this.attractionsDataArray = attractionDataArray;

            page = nextPage;
         })
         .then(() => isFetching = false);
   }
};

// indexViews
let indexViews = {
   removeAllChildNodes: function(parent) {
      while (parent.firstChild) {
         parent.removeChild(parent.firstChild);
      }
   },
   // Create attraction links
   createDetermine: function() {
      const dataArray = indexModels.attractionsDataArray;
      const mainElement = document.getElementsByClassName('main')[0];
      const spinner = document.getElementsByClassName('spinner')[0];

      mainElement.removeChild(spinner);

      if (dataArray == null) {
         const noResultElement = this.createNoResultElement();
   
         mainElement.appendChild(noResultElement);
      } else {
         for (let data of dataArray) {
            let attractionElement = document.createElement('a');
            attractionElement.classList.add('attraction');
            mainElement.appendChild(attractionElement);
         
            this.createAPIElement(data, attractionElement);          
         }
      } 
   },
   createAPIElement: function(data, attractionElement) {
      const image = data.images[0];
      const title = data.name;
      
      let mrt = data.mrt;
      if (mrt == null) mrt = '無';

      const category = data.category;
      const id = data.id;
   
      attractionElement.href = `/attraction/${id}`;
   
      const attractionImage = document.createElement('div');
      attractionImage.classList.add('attraction-image');
      const imgElement = document.createElement('img');
      imgElement.src = image;
      const loadingElement = document.createElement('div');
      loadingElement.innerText = 'Loading...';
      loadingElement.classList.add('loading');

      attractionImage.appendChild(imgElement);
      attractionImage.appendChild(loadingElement);
      attractionElement.appendChild(attractionImage);

      imgElement.onload = function() {
         attractionImage.removeChild(loadingElement);
      };
   
      const titleElement = document.createElement('div');
      titleElement.classList.add('title');
      const titleContent = document.createTextNode(title);
   
      titleElement.appendChild(titleContent);
      attractionElement.appendChild(titleElement);            
   
      const mrtElement = document.createElement('div');
      mrtElement.classList.add('mrt');
      const mrtContent = document.createTextNode(mrt);
   
      mrtElement.appendChild(mrtContent);
      attractionElement.appendChild(mrtElement);            
   
      const categoryElement = document.createElement('div');
      categoryElement.classList.add('category');
      const categoryContent = document.createTextNode(category);
   
      categoryElement.appendChild(categoryContent);
      attractionElement.appendChild(categoryElement);    
   },
   createNoResultElement: function() {
      const noResultElement = document.createElement('div');
      noResultElement.classList.add('no-result');
      const noResultConetent = document.createTextNode('沒有結果');
   
      noResultElement.appendChild(noResultConetent);
   
      return noResultElement;
   },
   createLoadingElement: function() {
      const mainElement = document.getElementsByClassName('main')[0];

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
      mainElement.appendChild(spinner);
   }
};

// indexControllers
let indexControllers = {
   search: function() {
      indexViews.createLoadingElement();

      isFetching = true;
   
      let keyword = document.getElementsByName('keyword')[0].value;
   
      const src = indexModels.srcDetermine(page, keyword);
      if (!src) return;
   
      indexModels.fetchGetAttrsAPI(src)
         .then(() => indexViews.createDetermine())
         .then(() => indexModels.attractionsDataArray = null)
         .catch(error => console.log(error));
   },
   infiniteScroll: function() {
      if (page == null) return;
      if (window.scrollY + window.innerHeight >= (document.body.scrollHeight - 200)) {
         if (!isFetching) indexControllers.search();
      }
   }
};

// search form
const searchform = document.getElementById('searchform');

searchform.addEventListener('submit', e => {
   e.preventDefault();

   const mainElement = document.getElementsByClassName('main')[0];

   indexViews.removeAllChildNodes(mainElement);

   page = 0;

   indexControllers.search();
});

indexControllers.search();

// Infinite Scroll
window.addEventListener('scroll', debounce(indexControllers.infiniteScroll));

function debounce(func, wait = 100) {
   let timeout;
   return function() {
      const later = function() {
         clearTimeout(timeout);
         func();
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
   };
}