import React, { useState, useEffect } from 'react';
import Doodad from './Doodad';

function Calc(props) {
  const [hideoutInfo, setHideoutInfo] = useState();
  const [doodads, setDoodads] = useState([]);
  const [decorList, setDecorList] = useState();
  const [filesProcessed, setProcess] = useState(0);
  const hideoutData = new FileReader();
  const decorData = new FileReader();

  useEffect(() => {
    console.log(`Reading hideout data`);
    hideoutData.readAsText(props.hideoutData);
    console.log(`Reading decor data`);
    decorData.readAsText(props.decorData);
  }, [props.hideoutData, props.decorData]);

  console.log(`Hideout data: `);
  console.log(hideoutInfo);
  console.log(`Decor data: `);
  console.log(decorList);
  console.log(`Array of doodads`);
  console.log(doodads);
  console.log(`Files processed: ${filesProcessed}`);

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
    <ul>
      {doodads.map((item) => (
        <Doodad
          key={hideoutInfo[item]['hash']}
          doodadName={item}
          doodadReq={hideoutInfo[item]['count']}
          doodadCount={decorList[item] ? decorList[item]['count'] : 0}
        />
      ))}
    </ul>
  ) : (
    <div>This works</div>
  );
}

export default Calc;
