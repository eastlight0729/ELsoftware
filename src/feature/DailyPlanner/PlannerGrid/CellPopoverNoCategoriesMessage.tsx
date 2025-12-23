import React from "react";

export const NoCategoriesMessage: React.FC = () => {
  return (
    <div className="text-slate-400 text-sm p-4 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 mx-1">
      No categories yet.
      <br />
      Add one below!
    </div>
  );
};
