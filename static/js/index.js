
// display attractions
let page = 0;

let keyword = '';

// search form
const searchform = document.getElementById('searchform');

searchform.addEventListener('submit', (e) => {
   e.preventDefault();

   const mainElement = document.getElementsByClassName('main')[0];

   removeAllChildNodes(mainElement);

   page = 0;

   search();
});

let isFetching = false;

search();

function search() {
   isFetching = true;

   let keyword = document.getElementsByName('keyword')[0].value;
   let src = '';
   if (page != null && keyword) {
      src = `api/attractions?page=${page}&keyword=${keyword}`;
   } else if (page != null) {
      src = `api/attractions?page=${page}`;
   } else {
         return;
   }
   fetch(src)
      .then(response => response.json())
      .then((result) => {
         let attractionDataArray = result.data;
         let nextPage = result.nextPage;
         
         const mainElement = document.getElementsByClassName('main')[0];

         if (attractionDataArray == null) {
            let titleElement = document.createElement('div');
            titleElement.classList.add('no-result');
            const noResultConetent = document.createTextNode('沒有結果');
         
            titleElement.appendChild(noResultConetent);

            mainElement.appendChild(titleElement);
         } else {
               for (let attractionData of attractionDataArray) {
                  let attractionElement = document.createElement('div');
                  attractionElement.classList.add('attraction');
                  mainElement.appendChild(attractionElement);
               
                  let image = attractionData.images[0];
                  let title = attractionData.name;
                  let mrt = attractionData.mrt;
                  if (mrt == null) {
                     mrt = '無';
                  }
                  let category = attractionData.category;

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

                  mainElement.append(attractionElement);            
               }
            } 
         page = nextPage;
      })
      .then(() => {
            isFetching = false;
         }
      )
      .catch(error => console.log(error));
}

function removeAllChildNodes(parent) {
   while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
   }
}   

// Infinite Scroll
window.addEventListener('scroll', debounce(infiniteScroll));

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

function infiniteScroll() {
   if (page == null) return;
   if (window.scrollY + window.innerHeight >= (document.body.scrollHeight - 200)) {
      if (!isFetching) {
         search();
      }
   }
}

// const titleKwargs = {
//    className: 'title',
//    name: title,
//    parentElement: attractionElement
// };

// function createTextElement(kwargs) {
//    let titleElement = document.createElement('div');
//    titleElement.classList.add(kwargs.className);
//    let titleContent = document.createTextNode(kwargs.dataArray[i]);
   
//    titleElement.appendChild(titleContent);
//    kwargs.parentElement.appendChild(titleElement);
// }
