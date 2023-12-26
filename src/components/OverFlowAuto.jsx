export default function OverFlowAuto({ children, className = "" }) {
    return (
        <div className={className + "overflow-auto max-w-full  "}>
            {children}
        </div>
    );
}
