import { Link } from "react-router-dom";

export default function RenderClient2({
    clientobj = { name: "unknown", phoneno: "+251-" },
}) {
    clientobj = clientobj || { name: "unknown", phoneno: "+251-" };

    // if (load) return <div>Loading ...</div>;
    return (
        <span className="grid w-fit gap-1">
            <Link
                className=" py-2 px-1"
                to={`/nav/client/${clientobj?.idclient}`}
            >
                ({clientobj?.idclient}) {clientobj?.name}
            </Link>
            <a
                href={"tel:" + clientobj?.phoneno}
                className=" bg-white px-1 rounded-sm outline-1 outline outline-blue-600 "
            >
                {clientobj?.phoneno}
            </a>
        </span>
    );
}
