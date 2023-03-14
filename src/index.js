import './css/styles.css';

import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const fetchCountryInput = document.querySelector('input#search-box');
const countryInfoDiv = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

const resetMarkup = el => (el.innerHTML = '');

countryList.style.listStyleType = 'none';

fetchCountryInput.addEventListener(
  'input',
  debounce(checkCountryName, DEBOUNCE_DELAY)
);

function checkCountryName() {
  const countryName = fetchCountryInput.value;
  if (!countryName.trim()) {
    resetMarkup(countryList);
    resetMarkup(countryInfoDiv);
    return;
  }
  fetchCountries(countryName.trim())
    .then(response => {
      refactorFetchCountries(response);
    })
    .catch(error => error);
}

function refactorFetchCountries(response) {
  if (response.length > 10) {
    resetMarkup(countryList);
    resetMarkup(countryInfoDiv);
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (response.length == 1) {
    renderCountryDiv(response);
  } else {
    renderCountryList(response);
  }
}

function renderCountryDiv(country) {
  resetMarkup(countryList);
  const markup = `<h2><img width="96" height="63" src='${
    country[0].flags.svg
  }' alt="${country[0].name.official} flag" />${country[0].name.official}</h2>
    <p><b>Capital: </b>${country[0].capital}</p>
    <p><b>Population: </b>${country[0].population}</p>
    <p><b>Languages: </b>${Object.values(country[0].languages)}</p>`;
  countryInfoDiv.innerHTML = markup;

  const countryDivHeader = document.querySelector('h2');
  const countryDivDescription = document.querySelectorAll('div > p');

  countryDivHeader.style.display = 'flex';
  countryDivHeader.style.alignItems = 'center';
  countryDivHeader.style.gap = '20px';
  countryDivHeader.style.fontSize = '30px';
  countryDivDescription.forEach(el => {
    el.style.fontSize = '20px';
  });
}

function renderCountryList(countries) {
  resetMarkup(countryInfoDiv);
  const markup = countries
    .map(country => {
      return `<li>
        <img src='${country.flags.svg}' alt="${country.name.official} flag" width="64" height="42"/><p>${country.name.official}</p>
            </li>`;
    })
    .join('');
  countryList.innerHTML = markup;

  const countryListItem = document.querySelectorAll('li');
  const countryListCountryName = document.querySelectorAll('li > p');

  countryListItem.forEach(el => {
    el.style.display = 'flex';
    el.style.gap = '20px';
    el.style.alignItems = 'center';
  });
  countryListCountryName.forEach(el => {
    el.style.fontSize = '20px';
  });
}
