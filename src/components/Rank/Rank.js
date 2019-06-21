import React from 'react';

// Rank component -  to display number of entry for the current user that has been doing so far
const Rank = ({name, entries}) => {
  return(
    <div>
      <div className='white f3'>
        {`${name}, your current entry count is...`}
      </div>
      <div className='white f1'>
        {`${entries}`}
      </div>
    </div>
  );
}

export default Rank;