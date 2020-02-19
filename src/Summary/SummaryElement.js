import React, { Component } from 'react';
import DB from '../Database';

export default class SummaryElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.item,
            name: ''
        };
    }

    componentDidMount() {
        DB.getItem(this.state.id).then((data) => {
            this.setState({
                name: data.name
            });
        });
    }

    render() {
        const { id, name } = this.state;
        const className = "list-group-item list-group-item-action" + (this.props.isActive ? ' active' : '');
        const description = name ? name : '#' + id
        return (
            <button type="button" onClick={() => this.props.changeActive(id)} className={className} title={id}>{description}</button>
        );
    }

}
