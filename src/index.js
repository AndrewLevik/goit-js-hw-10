import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

input.addEventListener(
  'input',
  debounce(event => {
    const trimmedValue = input.value.trim();
    cleanHTML();
    if (trimmedValue !== '') {
      fetchCountries(trimmedValue).then(foundData => {
        if (foundData.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (foundData.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        } else if (foundData.length >= 2 && foundData.length <= 10) {
          renedrCountryList(foundData);
        } else if (foundData.length === 1) {
          renderOneCountry(foundData);
        }
      });
    }
  }, DEBOUNCE_DELAY)
);

function renedrCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li> <img src="${country.flags.svg}" 
      alt="Flag of ${country.name.official}" width="30" hight="30"> 
      <b>${country.name.official}</b> </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderOneCountry(countries) {
      const markup = countries
        .map(country => {
          return `<li>
      <img src="${country.flags.svg}" 
      alt="Flag of ${country.name.official}" width="60" hight="30">
         <b><font size = 26px>${country.name.official}</font></b>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)}</p>
                </li>`;
        })
        .join('');
      countryList.innerHTML = markup;
}

function cleanHTML() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
