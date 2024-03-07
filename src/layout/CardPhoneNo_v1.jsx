import { useContext } from "react";
import { GlobalState } from "../context/GlobalContext";
import IconSmall from "../components/IconSmall";

export default function CardPhoneNo_v1({ phoneno = "", fontSize = "" }) {
    const { list_region } = useContext(GlobalState);
    return (
        list_region && phoneno &&  (
            <span
                style={{ fontSize }}
                className=" flex items-center gap-1 bg-gray-500 bg-opacity-50 px-2 py-1 rounded-sm outline-1 outline outline-blue-600 "
            >
                <IconSmall src="/public/images/call.svg" alt="call" />
                {phoneno}
            </span>
        )
    );
}
