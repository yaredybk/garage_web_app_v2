import ButtonSubmit from "./ButtonSubmit";

export default function ButtonAddCar({...props}) {
    return (
        <ButtonSubmit
            title="add new car"
            className="bg-blue-200"
            {...props}
        >
            <img
                src="/public/images/plus.svg"
                className=" -my-2   h-12  rounded-full"
            />
            <img
                src="/public/images/car_icon2.png"
                className=" -my-2  h-12 rounded-full"
            />
        </ButtonSubmit>
    );
}
