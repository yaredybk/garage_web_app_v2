import BoxColor_v1 from "./BoxColor_v1";
import CardInfoLink2_v1 from "./CardInfoLink2_v1";
import CardPlateNo_v1 from "./CardPlateNo_v1";
import NoItems from "./NoItems";
import "./pagelist.css";
export default function PageList_v1({
    list,
    info = {
        h1: "name",
        h12: "",
        pre: "V",
        h2: "idcar",
        h3: "make",
        h32: "model",
        h4: "created",
    },
    openurl = "",
    id = "",
    pagetype = "cars",
    display = "icon",
    onClick,
}) {
    if (!list?.length) return <NoItems />;

    const pagerender = {
        person: list?.map((obj, ind) => (
            <CardInfoLink2_v1
                info={{
                    h1: obj[info.h1],
                    h12: obj[info.h12],
                    pre: info.pre,
                    h2: obj[info.h2],
                    h3: obj[info.h3],
                    h32: obj[info.h32],
                    h4: obj[info.h4],
                }}
                key={obj[info.h2]}
                imgProp={{
                    className: " h-16",
                    src: "/public/images/person2.png",
                }}
                fmid={<CardPlateNo_v1 plate={obj} />}
                fleft={<BoxColor_v1 color={obj.color} />}
                onClick={() => {
                    onClick && onClick(obj);
                }}
                to={obj[id] && openurl && `${openurl}${obj[id]}`}
            />
        )),
    };
    return display == "icon" ? (
        <div className="pagelist v1">
            {pagerender[pagetype] ||
                list?.map((obj, ind) => (
                    <CardInfoLink2_v1
                        info={{
                            h1: obj[info.h1],
                            h12: obj[info.h12],
                            pre: info.pre,
                            h2: obj[info.h2],
                            h3: obj[info.h3],
                            h32: obj[info.h32],
                            h4: obj[info.h4],
                        }}
                        key={obj[info.h2]}
                        imgProp={{
                            link: `/files/image/cars/${obj.make}/${obj.model}.webp`,
                        }}
                        fmid={<CardPlateNo_v1 plate={obj} />}
                        fleft={<BoxColor_v1 color={obj.color} />}
                        onClick={() => {
                            onClick && onClick(obj);
                        }}
                        to={obj[id] && openurl && `${openurl}${obj[id]}`}
                    />
                ))}
        </div>
    ) : (
        <table>
            {list?.map((obj, ind) => (
                <tr
                    info={{
                        h1: obj[info.h1],
                        pre: info.pre,
                        h2: obj[info.h2],
                        h3: obj[info.h3],
                        h4: obj[info.h4],
                    }}
                    key={obj[info.h2]}
                    imgProp={{
                        link: `/files/image/cars/${obj.make}/${obj.model}.webp`,
                    }}
                    fmid={<CardPlateNo_v1 plate={obj} />}
                    fleft={<BoxColor_v1 color={obj.color} />}
                    to={`${openurl}${obj[id]}`}
                />
            ))}
        </table>
    );
}
