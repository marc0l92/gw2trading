import React, { Component } from 'react';
import GW2Api from '../GW2Api';

export default class RecipeDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ingredientsDetails: {},
            ingredientsListings: {}
        };
    }

    componentDidMount() {
        this.props.recipe.ingredients.map(ingredient => {
            GW2Api.getItem(ingredient.item_id).then((data) => {
                this.setState(prevState => {
                    const state = Object.assign({}, prevState);
                    state.ingredientsDetails[data.id] = data;
                    return state;
                });
            });
            GW2Api.getCommerceListings(ingredient.item_id).then((data) => {
                this.setState(prevState => {
                    const state = Object.assign({}, prevState);
                    state.ingredientsListings[data.id] = data;
                    return state;
                });
            });
            return ingredient; // Useless
        });
    }

    render() {
        const { disciplines, ingredients } = this.props.recipe;
        const { ingredientsDetails, ingredientsListings } = this.state;
        return (<div>
            <div className="row">
                <div className="col-sm"><label>Disciplines:</label> {disciplines}</div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>BestInstantBuy</th>
                    </tr>
                </thead>
                <tbody>
                    {ingredients.map(ingredient => {
                        const { item_id } = ingredient;
                        const details = ingredientsDetails[item_id];
                        const listings = ingredientsListings[item_id];
                        return (<tr key={item_id}>
                            <td>{item_id}</td>
                            <td>{details ? details.name : '-'}</td>
                            <td>{ingredient.count}</td>
                            <td>{listings ? listings.sells[0].unit_price + '$ x ' + listings.sells[0].quantity : '-'}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </div>)
    }
}
