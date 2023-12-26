export default function FoldedSectionFlex({
    children,
    title = "more details",
    ...props
}) {
    return (
        <details className="rounded-md overflow-hidden   border-2 border-gray-700 ">
            <summary className="bg-gray-700 print:bg-gray-200  cursor-pointer print:text-black text-white font-bold py-1 px-3 ">
                {title}
            </summary>
            <div className="w-full flex flex-wrap  overflow-auto">
                {children}
            </div>
        </details>
    );
}
