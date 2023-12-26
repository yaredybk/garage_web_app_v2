export default function BasicDataList({ list, id = "basicdatalist" }) {
    if (!list) return null;

    return (
        <datalist id={id}>
            {list?.map((val, ind) => (
                <option key={val} value={val}></option>
            ))}
        </datalist>
    );
}
