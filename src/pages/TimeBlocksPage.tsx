import React from 'react';

import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';

const TimeBlocksPage = () => {


  return (
    <div className="page-container">
      <Header 
        title="Time Blocks" 
        showBackButton={true}
      />
      
 

      <BottomNav />
    </div>
  );
};

export default TimeBlocksPage;