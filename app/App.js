import React from 'react';
import styles from './App.css';
import test from './test.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {test: 'foo'};
  }
  render() {
    return (
      <div className={styles.app}>
        bar
      </div>
    );
  }
}
