import React from 'react';

const EnergyDiagnostic = ({ dpeLetter, gesLetter }) => {
  const dpeColors = {
    A: 'bg-green-500',
    B: 'bg-lime-500',
    C: 'bg-yellow-500',
    D: 'bg-orange-500',
    E: 'bg-red-500',
    F: 'bg-red-700',
    G: 'bg-red-900',
  };

  const gesColors = {
    A: 'bg-blue-700',
    B: 'bg-blue-500',
    C: 'bg-blue-300',
    D: 'bg-indigo-300',
    E: 'bg-indigo-500',
    F: 'bg-indigo-700',
    G: 'bg-indigo-950',
  };

  const renderColoredTile = (letterToGenerate, propertyLetter, colorsList) => {
    const isFilled = propertyLetter.toUpperCase() === letterToGenerate.toUpperCase();
    const color = colorsList[letterToGenerate];
    return (
      <div
        key={letterToGenerate}
        className={`w-12 flex items-center justify-center text-white ${color} ${isFilled ? 'h-12 rounded-3xl border border-white' : 'h-2'}`}
      >
        {isFilled ? letterToGenerate : ''}
      </div>
    );
  };

  const renderDiagnostic = (propertyLetter, colorsList) => {
    return (
      <div className="flex items-center mt-5">
        {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((letterToGenerate) =>
          renderColoredTile(letterToGenerate, propertyLetter, colorsList)
        )}
      </div>
    );
  };

  return (
    <div className="p-4 flex justify-items items-center">
      <div className="m-5">
        <span className="text-lg font-bold">DPE:</span>
        {renderDiagnostic(dpeLetter, dpeColors)}
      </div>
      <div className="m-5">
        <span className="text-lg font-bold">GES:</span>
        {renderDiagnostic(gesLetter, gesColors)}
      </div>
    </div>
  );
};

export default EnergyDiagnostic;