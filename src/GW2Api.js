import Axios from "axios"

const BASE_URL = 'https://api.guildwars2.com/v2';
const itemsCache = {};
const recipesCache = {};
const recipeSearchesCache = {};
const commerceListingsCache = {};

function errorHandler(error) {
    console.log(error);
};


export default {
    getItem(id) {
        if (!(id in itemsCache)) {
            itemsCache[id] = new Promise((resolve) => {
                Axios.get(BASE_URL + '/items/' + id).then(response => {
                    console.log(response);
                    if (response && response.status === 200) {
                        resolve(response.data);
                    }
                }).catch(errorHandler);
            });
        }
        return itemsCache[id];
    },

    getRecipe(id) {
        if (!(id in recipesCache)) {
            recipesCache[id] = new Promise((resolve) => {
                Axios.get(BASE_URL + '/recipes/' + id).then(response => {
                    console.log(response);
                    if (response && response.status === 200) {
                        resolve(response.data);
                    }
                }).catch(errorHandler);
            });
        }
        return recipesCache[id];
    },

    searchRecipe(id) {
        if (!(id in recipeSearchesCache)) {
            recipeSearchesCache[id] = new Promise((resolve) => {
                Axios.get(BASE_URL + '/recipes/search?output=' + id).then(response => {
                    console.log(response);
                    if (response && response.status === 200) {
                        resolve(response.data);
                    }
                }).catch(errorHandler);
            });
        }
        return recipeSearchesCache[id];
    },

    getCommerceListings(id) {
        if (!(id in commerceListingsCache)) {
            commerceListingsCache[id] = new Promise((resolve) => {
                Axios.get(BASE_URL + '/commerce/listings/' + id).then(response => {
                    console.log(response);
                    if (response && response.status === 200) {
                        resolve(response.data);
                    }
                }).catch(errorHandler);
            });
        }
        return commerceListingsCache[id];
    }
}