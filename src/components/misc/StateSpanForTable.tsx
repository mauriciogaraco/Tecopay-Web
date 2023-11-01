import React from "react";

interface StateSpanProp {
  currentState: boolean;
  greenState: string;
  redState: string;
}

const StateSpanForTable = ({ currentState, greenState, redState }:StateSpanProp) => {
  return currentState ? (
    <span className="py-1 px-2 rounded-full bg-green-200 text-green-700 font-semibold text-center">
      {greenState}
    </span>
  ) : (
    <span className="py-1 px-2 rounded-full bg-red-200 text-red-700 font-semibold text-center">
      {redState}
    </span>
  );
};

export default StateSpanForTable;
