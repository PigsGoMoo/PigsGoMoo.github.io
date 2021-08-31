import React, { useState, useEffect } from 'react';
import Doodad from './Doodad';
import data from './hideoutData.json';

function Calc(props) {
  const [hideoutInfo, setHideoutInfo] = useState();
  const [doodads, setDoodads] = useState([]);
  const [decorList, setDecorList] = useState();
  const [filesProcessed, setProcess] = useState(0);
  const hideoutData = new FileReader();
  const decorData = new FileReader();

  useEffect(() => {
    hideoutData.readAsText(props.hideoutData);
    decorData.readAsText(props.decorData);
  }, [props.hideoutData, props.decorData]);

  function parseFile(file, setState) {
    // So there are two different formats for the .hideout file
    // If it's an older one, it's listed as lines of strings
    // But the newer ones are a large JSON object

    // The purpose of this is to make it gather the entire list of doodads.
    let doodad = false;

    if (setState === setHideoutInfo) {
      doodad = true;
    }

    const fileArr = file.split('\n');
    const res = {};
    let tracking = false;
    let hash = 0;
    let name = '';

    for (let i = 0; i < fileArr.length; i++) {
      const line = fileArr[i].trim();

      if (!tracking) {
        if (line === '"doodads": {') {
          tracking = true;
        }
      } else {
        // start tracking
        // If last character is open bracket, then we have our name
        if (line.slice(-1) === '{') {
          name = line.slice(-(line.length - 1), -4);
          // if second character is h, we've found hash
        } else if (line.length > 1 && line[1] === 'h') {
          const temp = line.split(':');
          hash = temp[1].slice(-(temp[1].length - 1), -1);

          if (res[name]) {
            if (res[name]['hash'] !== hash) {
              console.log(`Error: Hashes don't match for item ${name}`);
            }
            res[name]['count'] += 1;
          } else {
            res[name] = { hash, count: 1, name };
            if (doodad) {
              if (!res[name]) {
                setDoodads((oldArr) => [...oldArr, name]);
              }
            }
          }
        }
      }
    }

    if (!Object.keys(res).length) {
      parseOldFile(file, setState);
      return;
    }

    setState(res);
    setProcess((oldState) => oldState + 1);
  }

  function parseOldFile(file, setState) {
    const fileArr = file.split('\n');
    const res = {};

    // First 4 positions in the array are file info. Can slice or start
    // the loop at index 4. The last item in array is also invalid.
    // console.log(fileArr.slice(4));
    // Loop through and for each item, separate them
    // Item format will be
    // "Item Name = { Hash=numbers, X=numbers, Y=numbers, Rot=numbers, Flip=number, Var=number }"

    for (let i = 4; i < fileArr.length - 1; i++) {
      let doodad = false;

      if (setState === setHideoutInfo) {
        doodad = true;
      }

      const item = fileArr[i].split('{');
      const key = item[0].slice(-item[0].length, -3);
      const val = '{' + item[1];
      // console.log(`Key: ${key}, value: ${val}`);
      // Now gotta parse the val to be an actual object.
      // Can do that by simply replacing = with :
      const parsedVal = val.replaceAll('Hash=', '"hash" :');

      const finalVal = JSON.parse(
        parsedVal.slice(0, parsedVal.indexOf(',')) + '}'
      );
      // console.log(finalVal);
      if (res[key]) {
        if (finalVal.hash !== res[key].hash) {
          console.log(`Error: Hashes don't match for item ${key}`);
        }
        res[key]['count'] += 1;
      } else {
        res[key] = { ...finalVal, count: 1, name: key };
        if (doodad) {
          setDoodads((oldArr) => [...oldArr, key]);
        }
      }
    }
    // console.log(`Final result:`);
    // console.log(res);
    setState(res);
    setProcess((oldState) => oldState + 1);
  }

  hideoutData.onloadend = function () {
    parseFile(hideoutData.result, setHideoutInfo);
  };

  decorData.onloadend = function () {
    parseFile(decorData.result, setDecorList);
  };

  return filesProcessed === 2 ? (
    <div id='table-container'>
      <table>
        <thead>
          <tr>
            <th className='table-name header'>Doodad Name</th>
            <th className='table-seller header'>Seller</th>
            <th className='table-level header'>Req Level</th>
            <th className='table-cost header'>Cost</th>
            <th className='table-have header'>Have</th>
            <th className='table-need header'>Need</th>
            <th className='table-remain header'>Remaining</th>
            <th className='table-cost-remain header'>Remaining Cost</th>
            <th className='table-cost-total header'>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {doodads.map((item) => (
            <Doodad
              key={hideoutInfo[item]['hash']}
              doodadName={item}
              doodadReq={hideoutInfo[item]['count']}
              doodadCount={decorList[item] ? decorList[item]['count'] : 0}
              decorSeller={data[item] ? data[item]['Master'] : 'Unknown'}
              decorSellerLv={data[item] ? data[item]['Level'] : '0'}
              decorCost={data[item] ? data[item]['Cost'] : '0'}
            />
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div>Processing files...</div>
  );
}

export default Calc;
