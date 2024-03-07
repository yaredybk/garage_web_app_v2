import IconSmall from "../components/IconSmall";
import "./renderpagination.css"
export function RenderPagination({
    maxpages = 0,
    pageno = 0,
    setCurrent = () => null,
}) {
    let list = [...Array(pageno)];
    let list2 = [...Array(maxpages - pageno)];
    return maxpages ? (
        <div className="pagination">
            <button onClick={() => setCurrent(0)}>
                <IconSmall src="/public/images/arrowdoubleup.svg" alt="start" />
            </button>
            <div className="sub a">
                <button
                    className={pageno == 0 ? "active" :""}
                    onClick={() => setCurrent(0)}
                >
                    0
                </button>
                {list.map((val, ind) => (
                    <button
                        className={pageno == ind + 1 ? "active" :""}
                        onClick={() => setCurrent(ind + 1)}
                        key={ind + 1}
                    >
                        {val}
                        {ind + 1}
                    </button>
                ))}
            </div>
            <div className="sub b">
                {list2.map((val, ind) => {
                    let val2 = pageno + ind + 1;
                    return (
                        <button
                            className={pageno == val2 ? "active" :""}
                            onClick={() => setCurrent(val2)}
                            key={val2}
                        >
                            {val}
                            {val2}
                        </button>
                    );
                })}
            </div>
            <button onClick={() => setCurrent(maxpages)}>
                <IconSmall src="/public/images/arrowdobledown.svg" alt="end" />
            </button>
        </div>
    ) : (
        <div className="pagination">
            <span></span>
            <span>No more pages</span>
            <span></span>
            <span></span>
        </div>
    );
}
