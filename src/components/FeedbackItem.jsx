import { sIcon } from "../utils/scoring";

const FeedbackItem = ({ item, isOpen, onToggle }) => {
  const st = sIcon(item.status);

  return (
    <div className="rounded-[10px] overflow-hidden" style={{ border: `1px solid ${st.border}` }}>
      <div
        onClick={onToggle}
        className="flex items-center gap-2.5 py-[11px] px-3.5 cursor-pointer"
        style={{ background: st.bg }}
      >
        <div
          className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-extrabold shrink-0"
          style={{ border: `2px solid ${st.color}`, color: st.color }}
        >
          {st.icon}
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-[#1a1a1a]">{item.section}</p>
          <p className="text-[10px] text-stone-500 mt-px">{item.msg}</p>
        </div>
        <span
          className="text-stone-400 text-sm transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          ›
        </span>
      </div>
      {isOpen && (
        <div
          className="py-3 pr-3.5 pl-[46px] bg-white"
          style={{ borderTop: `1px solid ${st.border}` }}
        >
          <p className="text-[11px] text-stone-600 leading-[1.7]">{item.details}</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackItem;
