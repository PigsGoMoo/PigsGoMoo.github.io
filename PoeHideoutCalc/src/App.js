import React from 'react';
import Calc from './Calc';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      hideoutData: null,
      decorData: null,
      hideoutFile: null,
      decorList: null,
    };
    this.onFileChange = this.onFileChange.bind(this);
    this.onFileUpload = this.onFileUpload.bind(this);
  }

  onFileChange(evt) {
    this.setState({ [evt.target.id]: evt.target.files[0] });
    // console.log(`State updated: `);
    // console.log(`File:`);
    // console.log(evt.target.files[0]);
  }

  onFileUpload(evt) {
    evt.preventDefault();
    if (!this.state.hideoutFile || !this.state.decorList) {
      console.log(`Please upload both files`);
    } else {
      console.log(`Both files uploaded.`);
      console.log(this.state.decorList);
      console.log(this.state.hideoutFile);
      this.setState((state) => {
        return {
          hideoutData: state.hideoutFile,
          decorData: state.decorList,
          hideoutFile: null,
          decorList: null,
        };
      });
    }
  }

  render() {
    return this.state.hideoutData ? (
      <Calc
        hideoutData={this.state.hideoutData}
        decorData={this.state.decorData}
      />
    ) : (
      <form onSubmit={this.onFileUpload}>
        <div className='formDiv'>
          <label htmlFor='hideoutFile'>Hideout data:</label>
          <input
            type='file'
            id='hideoutFile'
            name='filename'
            onChange={this.onFileChange}
          />
        </div>
        <div className='formDiv'>
          <label htmlFor='decorList'>Your decor data:</label>
          <input
            type='file'
            id='decorList'
            name='filename'
            onChange={this.onFileChange}
          />
        </div>
        <input type='submit' />
      </form>
    );
  }
}
