import html from '../index.html';
import styles from '../css/style.css';

import React from 'react';
import ReactDOM from 'react-dom';

class Counter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {count: props.initialCount};
		this.tick = this.tick.bind(this);
		window.setInterval(this.tick, 1000);
	}

	tick() {
		this.setState({count: this.state.count + this.props.increment});
	}

	render() {
		return <div className="Counter">Counter ({this.props.increment}): {this.state.count}</div>;
	}
}
Counter.propTypes = {initialCount: React.PropTypes.number, increment: React.PropTypes.number}

ReactDOM.render((
<Counter initialCount={-90} increment={1}></Counter>
), document.getElementById('root'));