import DB from './Database';

function computeMaxQuantity(productListings, ingredientsListings, recipeIngredients) {
    let maxQuantity = getMaxQuantity(productListings);
    for (let key in recipeIngredients) {
        let itemId = recipeIngredients[key].item_id;
        let ingredientMaxQuantity = Math.floor(getMaxQuantity(ingredientsListings[itemId]) / recipeIngredients[key].count);
        if (ingredientMaxQuantity < maxQuantity) {
            maxQuantity = ingredientMaxQuantity;
        }
    }
    return maxQuantity;
}

function getMaxQuantity(buySellListings) {
    let quantity = 0;
    for (let key in buySellListings) {
        quantity += buySellListings[key].quantity;
    }
    return quantity;
}

function getTotalAmount(buySellListings, quantity) {
    let amount = 0;
    let i = 0;
    while (quantity > 0 && i < buySellListings.length) {
        let n = Math.min(quantity, buySellListings[i].quantity);
        amount += buySellListings[i].unit_price * n;
        quantity -= n;
        i++;
    }
    return amount;
}

export default {
    async computeProfitableProductQuantity(recipe) {
        // Get product and ingredients listings data
        let recipeIngredients = recipe.ingredients;
        let productListings = (await DB.getCommerceListings(recipe.output_item_id)).buys;
        let ingredientsListings = {};

        for (let key in recipeIngredients) {
            let itemId = recipeIngredients[key].item_id;
            ingredientsListings[itemId] = (await DB.getCommerceListings(itemId)).sells;
        }

        // Compute max quantity
        let maxQuantity = computeMaxQuantity(productListings, ingredientsListings, recipeIngredients);

        // Compute profitable quantity
        let quantity = 0;
        let profit = 0.5;
        let prevProfit = 0;
        while (profit > prevProfit && quantity < maxQuantity) {
            quantity++;
            let income = getTotalAmount(productListings, quantity);
            let expenses = 0;
            for (let key in recipeIngredients) {
                let itemId = recipeIngredients[key].item_id;
                expenses += getTotalAmount(ingredientsListings[itemId], quantity * recipeIngredients[key].count);
            }
            prevProfit = profit;
            profit = income - expenses;
        }
        return { quantity: quantity - 1, profit: quantity > 1 ? profit : 0 };
    }
}