import { Link } from "react-router-dom";
import IconSmall from "../../components/IconSmall";

export default function RenderClient2({
    clientobj = { name: "unknown", phoneno: "+251-" },
}) {
    clientobj = clientobj || { name: "unknown", phoneno: "+251-" };

    // if (load) return <div>Loading ...</div>;
    return (
        <span className="grid w-fit gap-1">
            <Link
                className=" py-2 px-1 flex items-center"
                to={`/nav/clients/${clientobj?.idclient}`}
            >
                <IconSmall className=" mr-1" src="/public/images/person2.png"></IconSmall>(
                {clientobj?.idclient}) {clientobj?.name}
            </Link>
            <a
                href={"tel:" + clientobj?.phoneno}
                className=" flex items-center gap-1 bg-white p-2 rounded-sm outline-1 outline outline-blue-600 "
            >
                <IconSmall src="/public/images/call.svg" alt="call" />
                {clientobj?.phoneno}
            </a>
        </span>
    );
}
