$( document ).ready(function() {
  //Wait until cat data and country data is loaded.
  (async() => {

    while(catData.data === null && countryData.data === null)
        await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("fetch successfully!");
  })();

  if ('content' in document.createElement('template'))
  {
    const gridContent = document.getElementById('cat-preview-grid');
    for(const cat of catData.data)
    {
      const template = document.querySelector('#cat-preview-template');
      const clone = template.content.cloneNode(true);

      let cat_image = clone.querySelector('#cat-image');
      cat_image.src = cat.image === undefined ? '/resources/img/pageLogo.png' : cat.image.url;
      

      let cat_name = clone.querySelector('#cat-name');
      cat_name.innerText = cat.name;

      let cat_flag = clone.querySelector('#cat-flag');
      let imgSrc = countryData.data.find(x=> x.alpha2Code === cat.country_code)?.flag;
      cat_flag.src = imgSrc === null ? '' : imgSrc;

      let cat_country = clone.querySelector('#cat-country');
      cat_country.innerText = cat.origin;

      let cat_description = clone.querySelector('#cat-description');
      cat_description.innerText = cat.description;

      let cat_temperament = clone.querySelector('#cat-temperament')
      cat_temperament.innerText = cat.temperament

      gridContent.appendChild(clone);
    }
  }
  else{
    console.error("Current Browser is not supporting Template!");
  }
});

const catData = {
  url:'https://api.thecatapi.com/v1/breeds',
  key:'catdata_v1',
  data: null
};

const countryData = {
  url:'https://restcountries.com/v2/all',
  key:'countrydata_v2',
  data: null
};

const tryFetchDataFromURL = async (objData) => {
  try{
    console.log('%c Fetching Data...', 'color:red')
    const response = await fetch(objData.url);
    const data = await response.json();
    // console.table(data);

    setLocalData(objData,JSON.stringify(data));
    
    console.log('%c Success','color:green')
  }
  catch(err)
  {
    console.error(err);
  }
}

function setLocalData(objData, newData)
{
  objData.data = newData;
  window.localStorage.setItem(objData.key, newData);
}

function getLocalData(key){
  if(window.localStorage.getItem(key) !== null)
  {
    return window.localStorage.getItem(key);
  }
  return null;
}

function FetchData(objData)
{
  objData.data = JSON.parse(getLocalData(objData.key));
  
  if(objData.data === null)
  {
    tryFetchDataFromURL(objData);
  }
}
console.log("fetching for data...");
FetchData(catData);
FetchData(countryData);

