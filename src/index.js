import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

var debounce = require('lodash.debounce');

const searchBox = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

function createCountriesList(countries) {
  let countriesListElement = '';
  for (let country of countries) {
    countriesListElement += `
    <li class="country-listed">
    <img src="${country.flags.svg}"/>
    <span>${country.name.common.trim()}</span>
    </li>
    `;
  }
  return countriesListElement;
}

function createCountryInfo(country) {
  let name = document.createElement('span');
  name.innerHTML = country.name.common;
  name.classList.add('country-name');

  let capital = document.createElement('p');
  if (country.capital.length < 2) {
    capital.innerHTML = `<span>Capital: </span>${country.capital[0]}`;
  } else {
    capital.innerHTML = `<span>Capitals: </span>${country.capital.join(', ')}`;
  }
  let population = document.createElement('p');
  population.innerHTML = `<span>Population: </span> ${country.population}`;
  let languages = document.createElement('p');
  languages.innerHTML = '<span>Languages: </span>';
  languages.innerHTML += Object.values(country.languages).join(', ');

  let countryFlag = document.createElement('img');
  countryFlag.src = country.flags.svg;
  countryInfo.appendChild(countryFlag);
  countryInfo.appendChild(name);
  countryInfo.appendChild(capital);
  countryInfo.appendChild(population);
  countryInfo.appendChild(languages);
}

searchBox.addEventListener(
  'input',
  debounce(async e => {
    countriesList.innerHTML = '';
    try {
      if (e.target.value.length < 1) return;
      const countriesFound = await fetchCountries(e.target.value.trim());

      if (countriesFound.length > 10) {
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (countriesFound.length > 1) {
        countriesList.insertAdjacentHTML(
          'afterbegin',
          createCountriesList(countriesFound)
        );
        let countryListed = document.querySelectorAll('.country-listed');
        for (let country of countryListed) {
          country.addEventListener('click', event => {
            e.target.value = event.target.innerText;
            searchBox.dispatchEvent(new Event('input', { bubbles: true }));
          });
        }
      } else {
        countryInfo.innerHTML = '';
        createCountryInfo(countriesFound[0]);
      }
    } catch (error) {
      Notiflix.Notify.failure('Oops, there is no country with that name.');
      console.error(error);
    }
  }, DEBOUNCE_DELAY)
);
