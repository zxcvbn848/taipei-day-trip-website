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
   fetchAPI: function(src) {
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

      if (dataArray == null) {
         const titleElement = this.createNoResultElement();
   
         mainElement.appendChild(titleElement);
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
      let image = data.images[0];
      let title = data.name;
      
      let mrt = data.mrt;
      if (mrt == null) mrt = '無';

      let category = data.category;
      let id = data.id;
   
      attractionElement.href = `/attraction/${id}`;
   
      let attractionImage = document.createElement('div');
      attractionImage.classList.add('attraction-image');
      let imgElement = document.createElement('img');
      imgElement.src = image;
   
      attractionImage.appendChild(imgElement);
      attractionElement.appendChild(attractionImage);
   
      let titleElement = document.createElement('div');
      titleElement.classList.add('title');
      let titleContent = document.createTextNode(title);
   
      titleElement.appendChild(titleContent);
      attractionElement.appendChild(titleElement);            
   
      let mrtElement = document.createElement('div');
      mrtElement.classList.add('mrt');
      let mrtContent = document.createTextNode(mrt);
   
      mrtElement.appendChild(mrtContent);
      attractionElement.appendChild(mrtElement);            
   
      let categoryElement = document.createElement('div');
      categoryElement.classList.add('category');
      let categoryContent = document.createTextNode(category);
   
      categoryElement.appendChild(categoryContent);
      attractionElement.appendChild(categoryElement);    
   },
   createNoResultElement: function() {
      let titleElement = document.createElement('div');
      titleElement.classList.add('no-result');
      const noResultConetent = document.createTextNode('沒有結果');
   
      titleElement.appendChild(noResultConetent);
   
      return titleElement;
   }
};

// indexControllers
let indexControllers = {
   search: function() {
      isFetching = true;
   
      let keyword = document.getElementsByName('keyword')[0].value;
   
      const src = indexModels.srcDetermine(page, keyword);
      if (!src) return;
   
      indexModels.fetchAPI(src)
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