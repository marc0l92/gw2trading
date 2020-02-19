import React, { Component } from 'react';
import GW2Api from '../GW2Api';
import BL from '../BusinessLogic';
import RecipeDetails from './RecipeDetails';

export default class ItemDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.item,
            data: null,
            recipes: []
        };
    }

    componentDidMount() {
        this.retrieveDetails();
    }

    render() {
        if (this.state.data && this.state.listings) {
            const { name, id, type } = this.state.data;
            const bestInstantSell = this.state.listings.buys[0]
            return (
                <div>
                    <h2>{name}</h2>
                    <div className="row">
                        <div className="col-sm-3"><label>Id:</label> {id}</div>
                        <div className="col-sm-3"><label>Type:</label> {type}</div>
                        <div className="col-sm-3"><label>Best Instant Sell:</label> {bestInstantSell.unit_price}$ x {bestInstantSell.quantity}</div>
                    </div>
                    <h3>Recipes</h3>
                    {this.state.recipes.map(recipe => <RecipeDetails key={recipe.id} recipe={recipe} />)}
                </div>
            );
        } else {
            return (<div>
                <h2>Loading #{this.props.item}...</h2>
            </div>);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.item !== this.props.item) {
            this.retrieveDetails();
        }
    }

    retrieveDetails() {
        GW2Api.getItem(this.props.item).then((data) => {
            this.setState({
                data: data
            });
        });
        GW2Api.getCommerceListings(this.props.item).then((data) => {
            this.setState({
                listings: data
            });
        });
        this.setState({
            recipes: []
        }, () => {
            GW2Api.searchRecipe(this.props.item).then((recipes) => {
                for (let key in recipes) {
                    GW2Api.getRecipe(recipes[key]).then((recipe) => {
                        // console.log(recipe);
                        this.setState(prevState =>
                            Object.assign({}, prevState, {
                                recipes: [...prevState.recipes, recipe]
                            })
                        );
                    });
                    BL.computeProfitableProductQuantity(this.props.item, recipes[key]).then(result => {
                        console.log("result", result);
                    });
                }
            });
        });
    }
}
