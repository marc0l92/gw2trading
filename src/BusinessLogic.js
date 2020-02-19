import GW2Api from './GW2Api';

// function computeMinimumQuantity(productListings, ingredientsListings, recipeIngredients) {
//     let minQuantity = productListings.buys[0].quantity;
//     for (let key in recipeIngredients) {
//         let itemId = recipeIngredients[key].item_id;
//         let ingredientMinQuantity = Math.floor(ingredientsListings[itemId].seller[0].quantity / recipeIngredients[key].quantity);
//         if (ingredientMinQuantity < minQuantity) {
//             minQuantity = ingredientMinQuantity;
//         }
//     }
//     return minQuantity;
// }

function getTotalAmount(buySellListings, quantity) {
    let amount = 0;
    let i = 0;
    while (quantity > 0 || i < buySellListings.length) {
        let n = Math.min(quantity, buySellListings[i].quantity);
        amount += buySellListings[i].unit_price * n;
        quantity -= n;
        i++;
    }
    return amount;
}

export default {
    async computeProfitableProductQuantity(productId, recipeId) {
        // Get product and ingredients listings data
        let productListings = (await GW2Api.getCommerceListings(productId)).buys;
        console.log("11", productListings);
        let recipeIngredients = (await GW2Api.getRecipe(recipeId)).ingredients;
        console.log("22", recipeIngredients);
        let ingredientsListings = {};

        for (let key in recipeIngredients) {
            let itemId = recipeIngredients[key].item_id;
            ingredientsListings[itemId] = (await GW2Api.getCommerceListings(itemId)).sells;
        }
        console.log("33", ingredientsListings);

        // Compute profitable quantity
        let quantity = 0;
        let profit = 1;
        while (profit > 0) {
            quantity++;
            let income = getTotalAmount(productListings, quantity);
            let expenses = 0;
            for (let key in recipeIngredients) {
                let itemId = recipeIngredients[key].item_id;
                expenses += getTotalAmount(ingredientsListings[itemId], quantity * recipeIngredients[key].quantity);
            }
        }
        return quantity - 1;
    }
}