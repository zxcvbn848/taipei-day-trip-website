
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

let page = 0;
const pageInterval = 12;

const elasticIp = '54.204.148.128';
const hostIp = '127.0.0.1';

function load() {
   let src = `http://${hostIp}:3000/api/attractions?page=${page}`;
   fetch(src, {
      mode: 'no-cors'
   })
      .then(response => response.json())
      .then((result) => {
         let attractionData = result.data;
         let nextPage = result.nextPage;
         
         const mainElement = document.getElementsByClassName('main')[0];
         console.log(mainElement.firstChild);

         removeAllChildNodes(mainElement);

         for (let i = 0; i < pageInterval; i++) {
            let attractionElement = document.createElement('div');
            attractionElement.classList.add('attraction');
            mainElement.appendChild(attractionElement);
            
            let image = attractionData[i].images[0];
            let title = attractionData[i].name;
            let mrt = attractionData[i].mrt;
            let category = attractionData[i].category;

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
         page = nextPage;
      });
}

load();

function removeAllChildNodes(parent) {
   while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
   }
}



// function createTextElement(kwargs) {
//    let titleElement = document.createElement('div');
//    titleElement.classList.add(kwargs.className);
//    let titleContent = document.createTextNode(kwargs.dataArray[i]);
   
//    titleElement.appendChild(titleContent);
//    this.attractionElement.appendChild(titleElement);
// }

   
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