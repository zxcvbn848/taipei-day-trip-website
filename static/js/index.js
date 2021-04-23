
const form = document.getElementById('form');
form.addEventListener('submit', (e) => {
   e.preventDefault();
})


let titleArray = [];
let imageUrlArray = [];

let count = 0;
let countInterval = 12;

let page = 0;

let src = `http://127.0.0.1:3000/api/attractions?page=${page}`;

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup', e => {
   if (e.code == 'Enter') {
      e.preventDefault();
      document.getElementById('searchButton').click();
   }
})

// function search() {
//    fetch(src)
//       .then(function(response) {
//          return response.json(); 
//       })
//       .then(function(result) {

//          let content = document.getElementsByClassName('content')[0];
         
//          let scenicArea = result.result.results;            
         
//          for (let j = count; j < count + countInterval; j++) {
//                let box = document.createElement('div');
//                box.className = 'box';
//                content.appendChild(box);

//                let title = scenicArea[j].stitle;
//                titleArray.push(title);

//                let imageUrl = 'http://' + scenicArea[j].file.split('http://')[1];
//                imageUrlArray.push(imageUrl);
   
//                let boxImage = document.createElement('div');
//                boxImage.className = 'box-image';
//                let imgTag = document.createElement('img');
//                imgTag.src = imageUrlArray[j];
               
//                boxImage.appendChild(imgTag);
//                box.appendChild(boxImage);
      
//                let boxText = document.createElement('div');
//                boxText.className = 'box-text';
//                let textContent = document.createTextNode(titleArray[j]);
               
//                boxText.appendChild(textContent);
//                box.appendChild(boxText);
//          }
//          count += 8;

//          let boxes = document.getElementsByClassName('box');
//          content.appendChild(boxes);
//       });
//    }