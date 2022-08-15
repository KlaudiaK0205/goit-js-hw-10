import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import {fetchCountries} from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const countryInput = document.querySelector('input');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener('input',debounce(searchCountry, DEBOUNCE_DELAY));

function clearSearch() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}

function searchCountry(event) {
    const findCountry = event.target.value.trim();
        if (!findCountry) {
        clearSearch();

        return;
    }

fetchCountries(findCountry)
    .then(country => {
        if (country.length > 10) {
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            clearSearch();

        return;

        } else if (country.length === 1) {
            clearSearch(countryList.innerHTML);
            renderCountryInfo(country);
        } else if ((country.length >= 2) && (country.length <= 10)){
            clearSearch(countryInfo.innerHTML);
            renderCountryList(country);
        }
    })

    .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        clearSearch();
    
    return error;
    });
}

function renderCountryList(country) {
    const markup = country
        .map(({ name, flags }) => {
        return `<li><img src="${flags.svg}" alt="${name.official}" width="100" height="60">${name.official}</li>`;
        })
        .join('');
    countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
    const markup = country
        .map(({ name, capital, population, flags, languages }) => {
        return `<h1><img src="${flags.svg}" alt="${
            name.official
        }" width="100" height="60">${name.official}</h1>
        <p><span>Capital: </span>${capital}</p>
        <p><span>Population:</span> ${population}</p>
        <p><span>Languages:</span> ${Object.values(languages)}</p>`;
    })
    .join('');
    countryInfo.innerHTML = markup;
}

// DONE