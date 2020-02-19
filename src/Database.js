import Dexie from 'dexie';
import GW2Api from './GW2Api';
import VendorsPrice from "./data/VendorsPrice.json"
const db = new Dexie('database');

db.version(1).stores({
    items: '&id',
    recipes: '&id',
    recipesWithOutput: '&id',
    commerceListings: '&id',
});

const LISTING_EXPIRATION_TIME = 5 * 60 * 1000;
const VENDOR_QUANTITY = 99999


export default {
    async getItem(id) {
        // Search in the DB
        let items = await db.items.where("id").equals(id).toArray();
        if (items.length > 0) {
            return items[0];
        }

        // Download from the API
        let item = await GW2Api.getItem(id);
        await db.items.put(item);

        return item;
    },

    async getRecipe(id) {
        // Search in the DB
        let recipes = await db.recipes.where("id").equals(id).toArray();
        if (recipes.length > 0) {
            return recipes[0];
        }

        // Download from the API
        let recipe = await GW2Api.getRecipe(id);
        await db.recipes.put(recipe);

        return recipe;
    },

    async getRecipesWithOutput(id) {
        // Search in the DB
        let recipesWithOutput = await db.recipesWithOutput.where("id").equals(id).toArray();
        if (recipesWithOutput.length > 0) {
            return recipesWithOutput[0].value;
        }

        // Download from the API
        let recipeWithOutput = await GW2Api.getRecipesWithOutput(id);
        await db.recipesWithOutput.put({ id: id, value: recipeWithOutput });

        return recipeWithOutput;
    },

    async getCommerceListings(id) {
        // Search in the DB
        let commerceListingsArray = await db.commerceListings.where("id").equals(id).toArray();
        if (commerceListingsArray.length > 0 &&
            (commerceListingsArray[0].timestamp === -1 || commerceListingsArray[0].timestamp + LISTING_EXPIRATION_TIME > Date.now())) {
            return commerceListingsArray[0];
        }

        // Check vendors
        if (id in VendorsPrice) {
            let vendorListings = {
                id: id,
                sells: [{
                    unit_price: VendorsPrice[id].price,
                    quantity: VENDOR_QUANTITY
                }],
                timestamp: -1,
            };
            await db.commerceListings.put(vendorListings);
            return vendorListings;
        }

        // Download from the API
        let commerceListings = await GW2Api.getCommerceListings(id);
        await db.commerceListings.put(Object.assign(commerceListings, { timestamp: Date.now() }));

        return commerceListings;
    },
}
