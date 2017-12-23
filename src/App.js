import React, { Component } from 'react';
import './App.css';
import { ISOUtil, ISOMsg } from 'jspos';
import AsciiPackager from './ISOPackager';



class App extends Component {


  state = {
    fields: []
  }

   toHexString = (byteArray) => {
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
  }
  unpack = () => {
    let msg = document.getElementById("isoText").value
    let unpackMsg = AsciiPackager.createISOMsg()
    let array = []
    unpackMsg.unpack(ISOUtil.str2bytes(msg))
    console.log(unpackMsg.fields)
    Object.keys(unpackMsg.fields).map(f => {
      if (parseInt(f) > 0) {
        if (  [52, 64,65,96,128].indexOf(parseInt(f)) !== -1 ) {
          return array.push({ "code": f, "value": this.toHexString(unpackMsg.fields[f].value).toUpperCase() , "description": AsciiPackager.getFieldDescription(unpackMsg, f),
                              "type": AsciiPackager.getFieldPackager(f).constructor.name , "lenght" : AsciiPackager.getFieldPackager(f).len} )
        } else {
          return array.push({ "code": f, "value": unpackMsg.fields[f].value, "description": AsciiPackager.getFieldDescription(unpackMsg, f),
                              "type": AsciiPackager.getFieldPackager(f).constructor.name , "lenght" : AsciiPackager.getFieldPackager(f).len})
        }
      }
    })
    this.setState({ "fields": array })
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1 className="App-header-text">ISO 8583 Visualiser</h1>
        </div>
        <div className="App-text-container">
          <textarea className="App-textarea" id="isoText"></textarea>
          <button className="App-button" onClick={this.unpack}>UNPACK</button>
        </div>
        <table className="App-table">
          <tbody>
            {
              this.state.fields.length > 0 &&
              <tr>
                <th>Bit Number</th>
                <th>Value</th>
                <th>Type</th>
                <th>Lenght</th>
                <th>Description</th>
              
                
              </tr>
            }
            {
              this.state.fields.map(item => (
                <tr key={item.code}>
                  <td>{item.code}</td>
                  <td>{item.value}</td>
                  <td>{item.type}</td>
                  <td>{item.lenght}</td>
                  <td>{item.description}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
