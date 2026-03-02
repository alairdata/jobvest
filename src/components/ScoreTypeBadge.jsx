const ScoreTypeBadge = ({ type }) => {
  const isStrength = type === "strength";
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold font-mono tracking-[0.3px] border ${
        isStrength
          ? "bg-amber-100 text-amber-800 border-amber-200"
          : "bg-blue-100 text-blue-800 border-blue-200"
      }`}
    >
      <span>{isStrength ? "👤" : "🤖"}</span>
      {isStrength ? "HUMAN-FOCUSED" : "MACHINE-FOCUSED"}
    </div>
  );
};

export default ScoreTypeBadge;
