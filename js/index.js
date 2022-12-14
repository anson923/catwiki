$( document ).ready(function() {
  //Wait until cat data and country data is loaded.
  (async() => {
    EnableLoadingAnim();
    while(catData.data === null || countryData.data === null)
        await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("fetch successfully!");

    ResetFilter();

    const tempData = Object.create(catData);
    tempData.data = filterCatData(catData.data);
  
    InsertCatPreivews(tempData);
    InsertFilterCountry();
  })();
});

//#region functions
function InitFilter()
{
  const filter = {
    country: "All",
    name: ""
  };

  return filter;
}

function ResetFilter()
{
  catFilter = InitFilter();
}

function filterCatData(cat_data){
  let filterData = Object.create(cat_data);
  
  if(catFilter.name !== "")
  {
    const regEx = new RegExp(catFilter.name,'gi');
    filterData = filterData.filter(x=> x.name.match(regEx));
  }
  else
  {
    filterData = Object.create(catData.data);
  }

  if(catFilter.country !== 'All')
  {
    filterData = filterData.filter(x=> x.country_code === catFilter.country);
  }

  return filterData;
}

function clearAllCatPreview()
{
  const gridContent = document.getElementById('cat-preview-grid');

  gridContent.innerHTML = '';
}

function FilterCatName(inputText)
{
  EnableLoadingAnim();
  catFilter.name = inputText;
  clearAllCatPreview();

  let tempData = Object.create(catData);
  tempData.data = filterCatData(catData.data);

  InsertCatPreivews(tempData);
}

function FilterCountry(dropdown)
{
  EnableLoadingAnim();
  catFilter.country = dropdown.value;
  clearAllCatPreview();
  const tempData = Object.create(catData);
  tempData.data = filterCatData(catData.data);
  
  InsertCatPreivews(tempData);
}

function InsertFilterCountry() {
  if('content' in document.createElement('template'))
  {
    const dropdownList = document.getElementById("dropdown-country");
    for(const country of countryData.data)
    {
      if(catData.data.some(x=> x.country_code === country.alpha2Code))
      {
        const element = document.createElement('option');
        element.setAttribute('value',country.alpha2Code);
        element.innerText = country.name;
  
        dropdownList.appendChild(element);
      }
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
    if(cat_data.data.length === 0){
      console.log("No match");
      DisableLoadingAnim();
      return;
    } 
    
    for(const cat of cat_data.data)
    {
      const template = document.querySelector('#cat-preview-template');
      const clone = template.content.cloneNode(true);

      let cat_image = clone.querySelector('#cat-image');
      cat_image.src = cat.image === undefined ? 'resources/img/pageLogo.png' : cat.image.url;
      
      let cat_name = clone.querySelector('#cat-name');
      cat_name.innerText = cat.name;

      let cat_flag = clone.querySelector('#cat-flag');
      // Handle Singapore in API data incorrect
      if(cat.country_code == 'SP')
      {
        cat.country_code = 'SG';
      }
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
  DisableLoadingAnim();
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
  DisableLoadingAnim();
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

function SetDetailPage(cat)
{
  if(cat === null || cat === undefined)
  {
    console.warn("Cannot find cat data");
    return;
  }
  EnableLoadingAnim();
  $('html, body').animate({ scrollTop: 0 }, 'fast');
  const contentGrid = document.querySelector('#content');
  if(contentGrid) contentGrid.classList.add('hide');

  const cat_detail_section = document.querySelector('#cat-detail');

  const template = document.querySelector('#cat-detail-template');
  const clone = template.content.cloneNode(true);

  let cat_image = clone.querySelector('#cat-detail-image');
  cat_image.src = cat.image === undefined ? 'resources/img/pageLogo.png' : cat.image.url;
      
  let cat_name = clone.querySelector('#cd-name');
  cat_name.innerText = cat.name;

  let cat_flag = clone.querySelector('#cd-flag');
  // Handle Singapore in API data incorrect
  if(cat.country_code == 'SP')
  {
    cat.country_code = 'SG';
  }
  let imgSrc = countryData.data.find(x=> x.alpha2Code === cat.country_code)?.flag;
  cat_flag.src = imgSrc === null ? '' : imgSrc;

  let cat_country = clone.querySelector('#cd-country');
  cat_country.innerText = cat.origin;

  let cat_weight = clone.querySelector('#cd-weight');
  cat_weight.innerText = cat.weight.metric + " kg";

  let cat_lifespan = clone.querySelector('#cd-lifespan');
  cat_lifespan.innerText = cat.life_span + " years";

  let cat_description = clone.querySelector('#cd-description');
  cat_description.innerText = cat.description;

  let cat_temperament = clone.querySelector('#cd-temperament');
  cat_temperament.innerText = cat.temperament;

  let cat_wiki_btn = clone.querySelector('#cd-wiki');
  cat_wiki_btn.onclick = () => {
    window.open(cat.wikipedia_url, '_blank');
  };

  // Cat Levels
  const rankSection = clone.querySelector('#cat-detail-levels');

  rankSection.appendChild(createCatRankDiv(cat.affection_level,'Affection Level'));
  rankSection.appendChild(createCatRankDiv(cat.adaptability,'Adaptability'));
  rankSection.appendChild(createCatRankDiv(cat.energy_level,'Energy level'));
  
  rankSection.appendChild(createCatRankDiv(cat.child_friendly,'Child Friendly'));
  rankSection.appendChild(createCatRankDiv(cat.dog_friendly,'Dog Friendly'));
  rankSection.appendChild(createCatRankDiv(cat.grooming,'Gromming'));
  rankSection.appendChild(createCatRankDiv(cat.health_issues,'Health Issue'));
  rankSection.appendChild(createCatRankDiv(cat.intelligence,'Intelligence'));

  rankSection.appendChild(createCatRankDiv(cat.rare,'Rarity'));
  rankSection.appendChild(createCatRankDiv(cat.short_legs,'Short Leg'));
  rankSection.appendChild(createCatRankDiv(cat.social_needs,'Social Needs'));
  rankSection.appendChild(createCatRankDiv(cat.stranger_friendly,'Stranger Friendly'));
  rankSection.appendChild(createCatRankDiv(cat.indoor,'Indoor'));
  
  cat_detail_section.appendChild(clone);
  DisableLoadingAnim();
}

function createCatRankDiv(value,text)
{
  const rankValue = document.createElement('div');
  rankValue.classList.add('cat-detail-rank');
  rankValue.innerText = `${text}: ${value}`;
  return rankValue;
}


function OnClickLearnMore(cat_preview)
{
  const cat_id = cat_preview.querySelector('#cat-name').innerText;
  SetDetailPage(catData.data.find(x=> x.name === cat_id));
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