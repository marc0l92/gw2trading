import React, { Component } from 'react';
import Summary from './Summary/Summary';
import ItemDetails from './Details/ItemDetails';

const ITEM_IDS = [12178, 12192, 12209];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: ITEM_IDS[0]
    };
  }

  changeActive = (item) => {
    this.setState({
      activeItem: item
    });
  }

  render() {
    const {activeItem} = this.state;
    return (
      <div className="App">
        <nav className="navbar navbar-light bg-light">
          <a className="navbar-brand" href="/">GW2 Trading</a>
        </nav>

        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-3 overflow-auto">
              <Summary items={ITEM_IDS} activeItem={activeItem} changeActive={this.changeActive} />
            </div>
            <div className="col-sm">
              <ItemDetails item={activeItem} />
            </div>
          </div>
        </div>
      </div>
    );

  }
}
