export default function BreakLine({ children }) {
    return (
        <div className=" flex-shrink-0 flex-grow w-full col-span-full border-solid border-0 border-y-2 my-1           border-slate-300">
            {children}
        </div>
    );
}
