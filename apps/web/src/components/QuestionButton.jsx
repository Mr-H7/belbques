
import React from 'react';

function QuestionButton({ children, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl text-right font-medium transition-all duration-200 ${
        selected
          ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02]'
          : 'bg-card/50 text-card-foreground hover:bg-card/80 hover:shadow-md'
      } active:scale-[0.98]`}
    >
      {children}
    </button>
  );
}

export default QuestionButton;
