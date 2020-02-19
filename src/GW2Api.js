import Axios from "axios"

const BASE_URL = 'https://api.guildwars2.com/v2';

async function getJson(path) {
    let response = await Axios.get(BASE_URL + path);
    console.log(path, response);
    if (response && response.status === 200) {
        return response.data;
    }
    throw response;
}

export default {
    getItem(id) {
        return getJson('/items/' + id);
    },

    getRecipe(id) {
        return getJson('/recipes/' + id);
    },

    async getRecipesWithOutput(id) {
        return getJson('/recipes/search?output=' + id);
    },

    getCommerceListings(id) {
        return getJson('/commerce/listings/' + id);
    }
}