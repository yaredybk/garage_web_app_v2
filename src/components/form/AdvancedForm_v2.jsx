import InputContainer from "../input/InputContainer";
import BasicForm from "./BasicForm";
import ButtonSubmit from "../button/ButtonSubmit";

/**
 *
 * @param {fields} param0
 * [{readOnly:"bool",
 * title:"text",
 * type:"string",
 * required:"bool",
 * defaultValue:"any"}]
 * @returns
 */
export default function AdvancedForm_v2({
    children,
    fields = [
        {
            readOnly: false,
            name: "no title",
            type: "test",
            required: false,
            defaultValue: "",
            pattern: "",
        },
    ],
    /* {
     *     name: "no title",
     *     children
     * }
     */
    customfields = undefined,
    title = "form",
    className = "",
    onSubmit = null,
    onChange = null,
    removeEmpty = false,
    formClass = "",
    action = "Submit",
    ...props
}) {
    let hasrequired = false;
    return fields && Array.isArray(fields) ? (
        <BasicForm
            title={title}
            onSubmit={onSubmit}
            onChange={onChange}
            removeEmpty={removeEmpty}
            formClass={formClass}
            className={className}
            {...props}
        >
            {fields?.map((obj, ind) => (
                <div className="flex p-1 gap-1" key={ind}>
                    <label
                        className=" flex-1 max-w-[6rem]  bg-black text-white -ml-6 p-2 px-3"
                        htmlFor={obj.name}
                    >
                        {obj.name}
                    </label>
                    <input {...obj} id={obj.id || obj.name||`field${ind}` } name={obj.name || `field${ind}`} />
                </div>
            ))}
            {customfields?.map((obj, ind) => (
                <div className="flex p-1 gap-1" key={ind}>
                    <label
                        className=" flex-1 max-w-[6rem]  bg-black text-white -ml-6 p-2 px-3"
                        htmlFor={obj.name}
                    >
                        {obj.name}
                    </label>
                    {obj.children}
                </div>
            ))}
            {children}
            <ButtonSubmit>{action}</ButtonSubmit>
        </BasicForm>
    ) : (
        <span>Invalid form data</span>
    );
}
