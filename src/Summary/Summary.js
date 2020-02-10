import React, { Component } from 'react';
import SummaryElement from './SummaryElement';

export default class Summary extends Component {
    render() {
        return (
            <ul className="list-group">
                {this.props.items.map(item => {
                    const isActive = (item === this.props.activeItem)
                    return (
                        <SummaryElement key={item} item={item} changeActive={this.props.changeActive} isActive={isActive} />
                    );
                })}
            </ul>
        );
    }
}
