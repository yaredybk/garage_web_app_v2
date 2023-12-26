import React, { useEffect } from "react";
import BasicTable from "./BasicTable";
import { useEffectStateArrayData } from "../../hooks/EffectStateArrayData";

export default function TableWithUrl({
    url = null,
    onRowClickIndex = null,
    colIndex = null,
    rowObjectUP = null,
    // refetchData2 = refetchData,
}) {
    const { list1, refetchData } = useEffectStateArrayData(url);
    return (
        <BasicTable
            rowObjectUP={rowObjectUP}
            data={list1}
            onRowClickIndex={onRowClickIndex}
            colIndex={colIndex}
        />
    );
}
