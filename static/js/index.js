
// display attractions
let page = 0;

let keyword = '';

const elasticIp = '54.204.148.128';
const hostIp = '127.0.0.1';

// search form
const searchform = document.getElementById('searchform');

searchform.addEventListener('submit', (e) => {
   e.preventDefault();

   const mainElement = document.getElementsByClassName('main')[0];

   removeAllChildNodes(mainElement);

   page = 0;

   search();
});

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup', e => {
   if (e.code == 'Enter') {
      e.preventDefault();

      document.getElementById('searchButton').click();
      document.getElementById('searchButton').focus();
      document.getElementById('searchInput').blur();
   }
})

// Infinite Scroll
window.addEventListener('scroll', debounce(infiniteScroll));

function debounce(func, wait = 20, immediate = true) {
   let timeout;
   return function() {
      let context = this, args = arguments;
      let later = function() {
         timeout = null;
         if (!immediate) func.apply(context, args); // 不立即執行則是隔waitms後執行
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args); //立即執行後再隔20ms
   };
}

function infiniteScroll() {
   if (window.scrollY + window.innerHeight >= (document.body.scrollHeight - 54)) {
      search();
   }
}


search();

function search() {
   let keyword = document.getElementsByName('keyword')[0].value;
   let src = '';
   if (page != null && keyword) {
      src = `http://${hostIp}:3000/api/attractions?page=${page}&keyword=${keyword}`;
   } else if (page != null) {
      src = `http://${hostIp}:3000/api/attractions?page=${page}`;
   } else {
         return;
   }
   fetch(src)
      .then(response => response.json())
      .then((result) => {
         let attractionDataArray = result.data;
         let nextPage = result.nextPage;
         
         const mainElement = document.getElementsByClassName('main')[0];

         if (attractionDataArray) {
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
         } else {
            let titleElement = document.createElement('div');
            titleElement.classList.add('no-result');
            const noResultConetent = document.createTextNode('沒有結果');
            
            titleElement.appendChild(noResultConetent);

            mainElement.appendChild(titleElement);
         }
         page = nextPage;
      })
      .catch(error => console.log(error));
}

function removeAllChildNodes(parent) {
   while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
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