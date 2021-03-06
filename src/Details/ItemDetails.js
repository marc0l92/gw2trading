import React, { Component } from 'react';
import DB from '../Database';
import { printAmount } from '../Partials/UIUtilities';
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
            const { id, name, flags } = this.state.data;
            const bestInstantSell = this.state.listings.buys[0]
            return (
                <div>
                    <h2>{name}</h2>
                    <div className="row">
                        <div className="col-sm-3"><label>Id:</label> {id}</div>
                        <div className="col-sm-3"><label>Flags:</label> {flags.join(', ')}</div>
                        <div className="col-sm-3"><label>Best Instant Sell:</label> {printAmount(bestInstantSell.unit_price)} x {bestInstantSell.quantity}</div>
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
        DB.getItem(this.props.item).then((data) => {
            this.setState({
                data: data
            });
        });
        DB.getCommerceListings(this.props.item).then((data) => {
            this.setState({
                listings: data
            });
        });
        this.setState({
            recipes: []
        }, () => {
            DB.getRecipesWithOutput(this.props.item).then((recipes) => {
                for (let key in recipes) {
                    DB.getRecipe(recipes[key]).then((recipe) => {
                        // console.log(recipe);
                        this.setState(prevState =>
                            Object.assign({}, prevState, {
                                recipes: [...prevState.recipes, recipe]
                            })
                        );
                    });
                }
            });
        });
    }
}
