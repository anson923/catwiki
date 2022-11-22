const url = 'https://api.thecatapi.com/v1/breeds';

const fetchCountryData = async () => {
  try{
    console.log('%c Fetching Data...', 'color:red')
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    console.log('%c Success','color:green')
  }
  catch(err)
  {
    console.error(err);
  }
}

fetchCountryData();