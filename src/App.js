import React, { Component } from 'react';
import Summary from './Summary/Summary';
import ItemDetails from './Details/ItemDetails';

// Read local storage
let analyzed_items = [12178, 12192, 12209, 62885, 73034];
if (localStorage["analyzed_items"]) {
  analyzed_items = localStorage["analyzed_items"].split(',');
} else {
  localStorage["analyzed_items"] = analyzed_items.join(',');
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: analyzed_items[0]
    };
  }

  changeActive = (item) => {
    this.setState({
      activeItem: item
    });
  }

  render() {
    const { activeItem } = this.state;
    return (
      <div className="App">
        <nav className="navbar navbar-light bg-light">
          <a className="navbar-brand" href="/">GW2 Trading</a>
        </nav>

        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-3 overflow-auto">
              <Summary items={analyzed_items} activeItem={activeItem} changeActive={this.changeActive} />
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
