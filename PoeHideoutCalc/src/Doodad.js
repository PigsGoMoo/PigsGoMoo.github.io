import React from 'react';

function Doodad(props) {
  const {
    doodadName,
    doodadReq,
    doodadCount,
    decorSeller,
    decorSellerLv,
    decorCost,
  } = props;

  const doodadRemain = doodadReq - doodadCount;
  const costRemain = decorCost * doodadRemain;
  const costTotal = decorCost * doodadReq;
  // Name - Seller - Level - Cost - Amt Have - Amt Need - Amt Remain - Remaining Cost - Total Cost
  return (
    <tr className={doodadReq - doodadCount === 0 ? 'green' : ''}>
      <th className='table-name'>{doodadName}</th>
      <th className='table-seller'>{decorSeller}</th>
      <th className='table-level'>{decorSellerLv}</th>
      <th className='table-cost'>{decorCost}</th>
      <th className='table-have'>{doodadCount}</th>
      <th className='table-need'>{doodadReq}</th>
      <th className='table-remain'>{doodadRemain}</th>
      <th className='table-cost-remain'>{costRemain}</th>
      <th className='table-cost-total'>{costTotal}</th>
    </tr>
  );
}

export default Doodad;
