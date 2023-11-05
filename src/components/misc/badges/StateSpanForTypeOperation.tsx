import React from "react";

interface StateSpanProp {
  currentState: string;
  value: string | number;
}

const StateSpanForTypeOperation = ({ currentState, value }:StateSpanProp) => {
  return currentState === 'debit' ? (
    <span className="py-1 px-2 rounded-full bg-green-200 text-green-700 font-semibold text-center">
      {value}
    </span>
  ) : (
    <span className="py-1 px-2 rounded-full bg-red-200 text-red-700 font-semibold text-center">
      {value}
    </span>
  );
};

export default StateSpanForTypeOperation;
