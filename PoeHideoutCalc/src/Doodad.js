import React from 'react';

function Doodad(props) {
  return (
    <div>
      {props.doodadName}
      {':\t\t'}
      {props.doodadReq - props.doodadCount}
    </div>
  );
}

export default Doodad;
