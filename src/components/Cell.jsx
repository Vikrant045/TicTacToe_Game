
import React from 'react';
import '../styles/Cell.css'

const Cell = ({ value, onClick }) => {
  return (
    <div className={`cell ${value}`} onClick={onClick}>
      {value}
    </div>
  );
};

export default Cell;