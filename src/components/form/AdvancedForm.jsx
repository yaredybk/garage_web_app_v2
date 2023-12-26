import InputContainer from "../input/InputContainer";
import BasicForm from "./BasicForm";
import ButtonSubmit from "./../button/ButtonSubmit";

// export default function BasicForm({
//     children,
//     title = "form",
//     className = "",
//     onSubmit = null,
//     onChange = null,
//     removeEmpty = false,
//     formClass = "",
// }) {
/**
 *
 * @param {fields} param0
 * [{readOnly:"bool",
 * title:"text",
 * type:"string",
 * equired:"bool",
 * defaultValue:"any"}]
 * @returns
 */
export default function AdvancedForm({
    fields,
    title = "form",
    className = "",
    onSubmit = null,
    onChange = null,
    removeEmpty = false,
    formClass = "",
    action = "Submit",
}) {
    return Array.isArray(fields) ? (
        <div>
            <BasicForm
                title={title}
                className={className}
                onSubmit={onSubmit}
                onChange={onChange}
                removeEmpty={removeEmpty}
                formClass={formClass}
            >
                {fields?.map((obj, ind) => (
                    <InputContainer htmlFor={obj.title} key={ind}>
                        {obj.type === "select" ? (
                            <select
                                name={obj.title}
                                id={obj.title}
                                defaultValue={obj?.defaultValue}
                            >
                                {obj.options?.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                readOnly={obj?.readOnly}
                                name={obj?.title}
                                id={obj?.title}
                                type={obj?.type}
                                required={obj.required}
                                defaultValue={obj?.defaultValue}
                            ></input>
                        )}
                    </InputContainer>
                ))}
                <ButtonSubmit>{action}</ButtonSubmit>
            </BasicForm>
        </div>
    ) : (
        <span>Invalid form data</span>
    );
}
