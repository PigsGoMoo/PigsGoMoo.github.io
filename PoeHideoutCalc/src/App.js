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
    this.reset = this.reset.bind(this);
    this.update = this.update.bind(this);
  }

  update() {
    // reset the state first, then put back hideoutData and new decorData
    // in two steps instead of just one
    this.setState(
      (state) => {
        return {
          hideoutData: null,
          decorData: null,
          hideoutFile: state.hideoutData,
          decorList: null,
        };
      },
      () => {
        this.setState((state) => {
          // new state
          return {
            hideoutData: state.hideoutFile,
            decorData: state.decorUpdate,
            hideoutFile: null,
            decorUpdate: null,
          };
        });
      }
    );
  }

  reset() {
    this.setState({
      hideoutData: null,
      decorData: null,
      hideoutFile: null,
      decorList: null,
    });
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
      <div id='outer-container'>
        <div>
          <button onClick={this.reset}>Upload another</button>
        </div>
        <div className='separator'>
          <form onSubmit={this.update}>
            <label htmlFor='decorUpdate'>Update your decor list:</label>
            <input
              type='file'
              id='decorUpdate'
              name='filename'
              onChange={this.onFileChange}
            />
            <input type='submit' />
          </form>
        </div>
        <Calc
          hideoutData={this.state.hideoutData}
          decorData={this.state.decorData}
        />
      </div>
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
