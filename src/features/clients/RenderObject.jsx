/**
 *
 * @param {object} obj input object to render
 * @returns render object key and value pair
 */

export default function RenderObject({ obj = null }) {
    return obj ? (
        <table className="basic-table  box-border  border-gray-400 m-1  ">
            <tbody>
                {obj &&
                    Object.keys(obj).map(
                        (val, ind) =>
                            val != "checkin" && (
                                <tr
                                    className=" odd:bg-lime-100 even:bg-lime-200 hover:bg-red-400 overflow-hidden text-left border p-2   border-black  "
                                    key={"info" + ind}
                                >
                                    <td className="  border-r-4 border-gray-400">
                                        <label className="px-1  ">{val}</label>
                                        {/* <span className=" flex-grow h-4  border-b-4 border-black   border-dotted"></span> */}
                                    </td>
                                    <td className=" overflow-hidden pl-2 ">
                                        {JSON.stringify(obj[val])}
                                    </td>
                                </tr>
                            )
                    )}
            </tbody>
        </table>
    ) : (
        <span>No Object Provided</span>
    );
}
