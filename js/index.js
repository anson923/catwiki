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
    console.table(data);

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

FetchData(catData);
FetchData(countryData);