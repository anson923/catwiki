$( document ).ready(function() {
  //Wait until cat data and country data is loaded.
  (async() => {
    EnableLoadingAnim();
    while(catData.data === null || countryData.data === null)
        await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("fetch successfully!");
    DisableLoadingAnim();

    ResetFilter();
    InsertCatPreivews(filterCatData(catData));
    InsertFilterCountry();
    
  })();
});

//#region functions
function InitFilter()
{
  const filter = {
    country: [],
    name: ""
  };

  return filter;
}

function ResetFilter()
{
  catFilter = InitFilter();
}

function filterCatData(cat_data){
  const filterData = cat_data;
  if(catFilter.name !== "")
  {

  }
  if(catFilter.country.length > 0)
  {

  }

  return filterData;
}

function InsertFilterCountry() {
  if('content' in document.createElement('template'))
  {
    const dropdownList = document.getElementById("dropdown-country");
    for(const country of countryData.data)
    {
      const element = document.createElement('option');
      element.setAttribute('value',country.name);
      element.innerText = country.name;

      dropdownList.appendChild(element);
    }
  }
  else
  {
    console.error("Current Browser is not supporting Template!");
  }
}

function InsertCatPreivews(cat_data){
  if ('content' in document.createElement('template')){

    const gridContent = document.getElementById('cat-preview-grid');
    for(const cat of cat_data.data)
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
}

function setLocalData(objData, newData)
{
  objData.data = newData;
  window.localStorage.setItem(objData.key, JSON.stringify(newData));
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

const tryFetchDataFromURL = async (objData) => {
  try{
    console.log('%c Fetching Data...', 'color:red')
    const response = await fetch(objData.url);
    if(response.ok){
      const data = await response.json();

      setLocalData(objData,data);
    }
    else{
      throw new Error("responed not ok", {cause: response});
    }
    console.log('%c Fetch data successful!','color:green')
  }
  catch(err)
  {
    console.error(err);
  }
}

function EnableLoadingAnim()
{
  const loadingTemplate = document.querySelector('#loading-template');
  const loadingDiv = document.querySelector('#loading-block');
  const loadingClone = loadingTemplate.content.cloneNode(true);
  loadingDiv.appendChild(loadingClone);
}

function DisableLoadingAnim() {
  const loadingIcon = document.getElementById('loading-anim');
  const loadingDiv = document.querySelector('#loading-block');
  if(loadingIcon && loadingDiv) {
    loadingDiv.removeChild(loadingIcon);
  }
}
//#endregion

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

let catFilter = InitFilter();

console.log("fetching for data...");
FetchData(catData);
FetchData(countryData);

