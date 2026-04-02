type PollOptionInputsProps = {
  options: string[];
  onAddOption: () => void;
  onOptionChange: (index: number, value: string) => void;
  onRemoveOption: (index: number) => void;
};

export function PollOptionInputs({
  options,
  onAddOption,
  onOptionChange,
  onRemoveOption,
}: PollOptionInputsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm font-medium text-slate-700">Options</label>
        <button
          type="button"
          onClick={onAddOption}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
        >
          Add option
        </button>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              value={option}
              onChange={(event) => onOptionChange(index, event.target.value)}
              placeholder={`Option ${index + 1}`}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              required
            />
            {options.length > 2 ? (
              <button
                type="button"
                onClick={() => onRemoveOption(index)}
                className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
              >
                Remove
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
