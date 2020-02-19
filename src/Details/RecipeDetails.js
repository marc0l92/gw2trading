import React, { Component } from 'react';
import DB from '../Database';
import BL from '../BusinessLogic';
import { printAmount } from '../Partials/UIUtilities';

export default class RecipeDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ingredientsDetails: {},
            ingredientsListings: {},
            quantity: 'NA',
            profit: 'NA'
        };
    }

    componentDidMount() {
        this.props.recipe.ingredients.map(ingredient => {
            DB.getItem(ingredient.item_id).then((data) => {
                this.setState(prevState => {
                    const state = Object.assign({}, prevState);
                    state.ingredientsDetails[data.id] = data;
                    return state;
                });
            });
            DB.getCommerceListings(ingredient.item_id).then((data) => {
                this.setState(prevState => {
                    const state = Object.assign({}, prevState);
                    state.ingredientsListings[data.id] = data;
                    return state;
                });
            });
            return ingredient; // Useless
        });
        BL.computeProfitableProductQuantity(this.props.recipe).then(({ quantity, profit }) => {
            this.setState({
                quantity: quantity,
                profit: profit
            });
        });
    }

    render() {
        const { disciplines, ingredients } = this.props.recipe;
        const { ingredientsDetails, ingredientsListings, quantity, profit } = this.state;
        return (<div>
            <div className="row">
                <div className="col-sm"><label>Disciplines:</label> {disciplines.join(', ')}</div>
                <div className="col-sm"><label>Quantity:</label> {quantity}</div>
                <div className="col-sm"><label>Profit:</label> {printAmount(profit)}</div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Count</th>
                        <th>BestInstantBuy</th>
                    </tr>
                </thead>
                <tbody>
                    {ingredients.map(ingredient => {
                        const { item_id } = ingredient;
                        const details = ingredientsDetails[item_id];
                        const listings = ingredientsListings[item_id];
                        let bestInstantBuy = <td>-</td>;
                        if (listings) {
                            bestInstantBuy = <td>{printAmount(listings.sells[0].unit_price)} x {listings.sells[0].quantity}</td>
                        }
                        return (<tr key={item_id}>
                            <td>{item_id}</td>
                            <td>{details ? details.name : '-'}</td>
                            <td>{ingredient.count}</td>
                            {bestInstantBuy}
                        </tr>)
                    })}
                </tbody>
            </table>
        </div>)
    }
}
