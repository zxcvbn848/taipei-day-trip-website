
const form = document.getElementById('searchform');

form.addEventListener('submit', (e) => {
   e.preventDefault();
   search();
});

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup', e => {
   if (e.code == 'Enter') {
      e.preventDefault();
      document.getElementById('searchButton').click();
   }
})

const imageUrlArray = [];
const titleArray = [];
const mrtArray = [];
const categoryArray = [];

let page = 0;
const pageInterval = 12;

const elasticIp = '54.204.148.128';

let count = 0;

load();

function load() {
   const src = `http://${elasticIp}:3000/api/attractions?page=${page}`;
   fetch(src)
      .then((response) => {
         return response.json(); 
      })
      .then((result) => {
         let attractionData = result.data;
         let nextPage = result.nextPage;
         
         const mainElement = document.getElementsByClassName('main')[0];

         for (let i = count; i < count + pageInterval; i++) {
            let attractionElement = document.createElement('div');
            attractionElement.classList.add('attraction');
            mainElement.appendChild(attractionElement);

            let title = attractionData[i].name;
            titleArray.push(title);

            let imageUrl = attractionData[i].images_url;
            imageUrlArray.push(imageUrl);

            let boxImage = document.createElement('div');
            boxImage.className = 'box-image';
            let imgTag = document.createElement('img');
            imgTag.src = imageUrlArray[i];
            
            boxImage.appendChild(imgTag);
            attractionElement.appendChild(boxImage);
   
            let boxText = document.createElement('div');
            boxText.className = 'box-text';
            let textContent = document.createTextNode(titleArray[i]);
            
            boxText.appendChild(textContent);
            attractionElement.appendChild(boxText);
         }
         count += pageInterval;

         page = nextPage;
         if (!page) return;

         let boxes = document.getElementsByClassName('box');
         content.appendChild(boxes);
      });
}


   
// function search() {
//    let keyword = document.getElementsByName('keyword')[0].value;
//    const src = `http://127.0.0.1:3000/api/attractions?page=${page}&keyword=${keyword}`;
//    fetch(src)
//       .then((response) => {
//          return response.json(); 
//       })
//       .then((result) => {
//          let attracionElement = document.getElementsByClassName('attraction')[0];
//          let attractionData = result.data;            
         
//          for (let i = count; i < count + countInterval; i++) {
//                let box = document.createElement('div');
//                box.className = 'box';
//                content.appendChild(box);

//                let title = scenicArea[i].stitle;
//                titleArray.push(title);

//                let imageUrl = 'http://' + scenicArea[i].file.split('http://')[1];
//                imageUrlArray.push(imageUrl);
   
//                let boxImage = document.createElement('div');
//                boxImage.className = 'box-image';
//                let imgTag = document.createElement('img');
//                imgTag.src = imageUrlArray[i];
               
//                boxImage.appendChild(imgTag);
//                box.appendChild(boxImage);
      
//                let boxText = document.createElement('div');
//                boxText.className = 'box-text';
//                let textContent = document.createTextNode(titleArray[i]);
               
//                boxText.appendChild(textContent);
//                box.appendChild(boxText);
//          }
//          count += 8;

//          let boxes = document.getElementsByClassName('box');
//          content.appendChild(boxes);
//       });
//    }