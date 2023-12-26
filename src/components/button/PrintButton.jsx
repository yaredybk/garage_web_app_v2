export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className=" bg-orange-500 p-2 px-8 m-1 font-bold "
        >
            Print
        </button>
    );
}
