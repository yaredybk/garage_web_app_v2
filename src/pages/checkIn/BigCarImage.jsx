import { useEffect, useState } from "react";
import "./checkin.css";
import "./positionx.css";
import "./positiony.css";
import { useEffectStateArrayData } from "../../hooks/EffectStateArrayData";
import xaxios from "../../utils/xaxios";
import BasicTable from "../../components/tables/BasicTable";
import InputContainer from "../../components/input/InputContainer";
import BreakLine from "../../components/BreakLine";

let px, py, hx, hy;
export default function BigCarImage({
    carTypein = "sedan",
    onClickUp = () => null,
    editMode = false,
    tableOnly = false,
}) {
    const [pointList, setPointList] = useState([]);
    const [carType, setCarType] = useState(carTypein);
    const [positionTmp, setPositionTmp] = useState({
        percentX: 1,
        percentY: 1,
        id: null,
        name: null,
    });
    const { list1, refetchData } = useEffectStateArrayData(
        "/api/getlist/carbody"
    );

    useEffect(() => {
        setCarType(carTypein);
    }, [carTypein]);
    useEffect(() => {
        if (!editMode) return;
        var carimagecon = document.getElementById("carimagecon");
        var overflowcon = document.getElementById("overflowcon");
        const mousemovelis = carimagecon.addEventListener(
            "mousemove",
            handleMouseMove
        );
        hy = carimagecon.offsetHeight;
        hx = carimagecon.offsetWidth;
        return () => {
            if (editMode)
                carimagecon.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);
    useEffect(() => {
        let newdata = [];
        if (list1)
            list1.forEach((element) => {
                if (
                    element[carType] &&
                    element[carType] != "0:0" &&
                    element[carType] != ""
                ) {
                    let pp = element[carType].split(":");
                    let xx = pp[0];
                    let yy = pp[1];
                    if (xx && yy) {
                        newdata.push({
                            percentX: xx,
                            percentY: yy,
                            ...element,
                        });
                    }
                }
            });
        setPointList(newdata);
        // console.log(newdata);
        return () => {};
    }, [list1]);
    function handleMouseMove(event) {
        px = event.clientX - carimagecon.offsetLeft + overflowcon.scrollLeft;
        py = event.clientY - carimagecon.offsetTop;
        // var coordinates = "X coordinates: " + x + ", Y coordinates: " + y;
        // console.log(coordinates);
    }
    function handleMouseClick() {
        let tmpx = Math.round((px / hx) * 100);
        let tmpy = Math.round((py / hy) * 100);
        setPositionTmp({ ...positionTmp, percentX: tmpx, percentY: tmpy });
    }
    function handleTableRowClick(id = null) {
        if (!id) return alert("invalid id");
        if (!editMode) {
            // some logic
            onClickUp(id);

            return;
        }
        // console.log(po);
        const namet = list1?.find((obj) => obj?.id === id);
        let name2 = namet ? namet?.bodyname : null;
        setPositionTmp({ ...positionTmp, id, name: name2 });
    }
    return (
        <div className="flex flex-wrap max-sm:grid">
            {editMode && (
                <>
                    <div className="flex gap-2 m-2">
                        <InputContainer
                            htmlFor="newbodypart"
                            title="New Body Part"
                        >
                            <input
                                type="text"
                                name="newbodypart"
                                id="newbodypart"
                            />
                        </InputContainer>
                        <button className="btn-blue">submit</button>
                    </div>
                    <BreakLine />
                    <div className="movebuttons flex flex-wrap max-w-fit gap-2 p-1">
                        <b>MOVE:</b>
                        <button
                            onClick={() =>
                                setPositionTmp({
                                    ...positionTmp,
                                    percentX: positionTmp.percentX - 1,
                                })
                            }
                            className=" my-auto"
                        >
                            left
                        </button>
                        <button
                            className=" my-auto"
                            onClick={() =>
                                setPositionTmp({
                                    ...positionTmp,
                                    percentX: positionTmp.percentX + 1,
                                })
                            }
                        >
                            right
                        </button>
                        <button
                            onClick={() =>
                                setPositionTmp({
                                    ...positionTmp,
                                    percentY: positionTmp.percentY - 1,
                                })
                            }
                        >
                            up
                        </button>
                        <button
                            onClick={() =>
                                setPositionTmp({
                                    ...positionTmp,
                                    percentY: positionTmp.percentY + 1,
                                })
                            }
                        >
                            down
                        </button>
                        <button
                            className=" bg-green-400"
                            onClick={() => {
                                xaxios
                                    .post("/api/update/carbodypoints", {
                                        where: { id: positionTmp.id },
                                        bodyname: positionTmp.name,
                                        [carType]: `${positionTmp.percentX}:${positionTmp.percentY}`,
                                    })
                                    .then((res) => {
                                        // window.location.reload();
                                        refetchData();
                                    })
                                    .catch((err) => {
                                        window.alert(
                                            "err",
                                            JSON.stringify(err)
                                        );
                                    });
                            }}
                        >
                            update
                        </button>
                    </div>
                    <div className=" text-center text-lg bg-red-500 ">
                        {positionTmp?.name ? (
                            <span>
                                <b>"{positionTmp?.name}"</b> ::select a position
                                and click update
                            </span>
                        ) : (
                            <b>select a body part from table below !</b>
                        )}
                    </div>
                </>
            )}
            {!tableOnly && (
                <div id="overflowcon" className="grid overflow-auto p-2">
                    <div
                        id="carimagecon"
                        className="border-4  border-cyan-300 border-solid m-0 p-0 bg-blue-500 h-fit flex w-fit relative "
                        // onMouseMove={(e) => console.log}
                    >
                        <RenderPointsOnImage
                            pointList={pointList}
                            handleTableRowClick={handleTableRowClick}
                        />
                        {editMode && (
                            <span
                                className={` point myleft_${positionTmp.percentX} mytop_${positionTmp.percentY}  absolute  grid place-items-center   `}
                            >
                                <span className="  bg-red-500 h-3 w-3 outline-3 outline outline-green-500 outline-offset-4 absolute rounded-full  z-20 "></span>
                            </span>
                        )}
                        <img
                            onClick={handleMouseClick}
                            id="thecarimage"
                            className="carpartselector "
                            src="/public/cars/sedan-full-outline2.png"
                            alt="sedan car outline"
                        />
                    </div>
                </div>
            )}

            <BasicTable
                data={list1}
                // onRowClickIndex={handleTableRowClick}
                rowObjectUP={(rowObj)=>{
                    handleTableRowClick(rowObj.id)
                }}
                // colIndex={0}
            />
        </div>
    );
}
export function RenderPointsOnImage({
    pointList,
    handleTableRowClick = () => null,
}) {
    return (
        pointList &&
        pointList.map((obj, ind) => (
            <span
                key={"point" + ind}
                className={` point myleft_${obj.percentX} mytop_${obj.percentY}  absolute  grid place-items-center   `}
            >
                <button
                    title={obj?.bodyname}
                    onClick={() => {
                        handleTableRowClick(obj?.id);
                    }}
                    className=" cursor-pointer p-0 m-0  bg-blue-600 bg-opacity-70 text-white font-bold aspect-square absolute rounded-full w-7 h-7 grid place-items-center "
                >
                    {obj?.id}
                </button>
            </span>
        ))
    );
}
