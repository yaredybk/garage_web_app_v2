export default function FoldedSection({
    children,
    className = "",
    title = "more details",
    color = "gray",
    open=false,
    ...props
}) {
    return (
        <details
            open={open}
            className={
                "rounded-md overflow-hidden outline outline-1 outline-gray-700    " +
                className
            }
            {...props}
        >
            <summary
                className={`bg-${color}-800 py-1  cursor-pointer text-white font-bold  pl-3 `}
            >
                {title}
            </summary>
            <div className="w-full grid  overflow-auto">{children}</div>
        </details>
    );
}
