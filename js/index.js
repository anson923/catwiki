const catUrl = 'https://api.thecatapi.com/v1/breeds';
const flagUrl = 'https://restcountries.com/v2/all';

const fetchCountryData = async () => {
  try{
    console.log('%c Fetching Data...', 'color:red')
    const response = await fetch(url);
    const data = await response.json();
    console.table(data[0]);
    console.log('%c Success','color:green')
  }
  catch(err)
  {
    console.error(err);
  }
}

 //fetchCountryData();