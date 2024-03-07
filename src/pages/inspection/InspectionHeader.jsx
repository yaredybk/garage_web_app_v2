import RenderPlate3 from "../../components/RenderPlate3";
import "./Inspection.css";
import IconSmall from "./../../components/IconSmall";
export default function InspectionHeader({ carInfo }) {
    return (
        <header className="inspection_header pb-1 ">
            <div className="garage_info">
                <div className="grid place-items-center">
                    <img
                        className="w-[50mm]"
                        src="/public/logo/daniel_garage_logo_wide.png"
                        alt="Daniel Garage"
                    />
                    <div className=" flex items-center justify-center gap-1">
                        <IconSmall src="/public/images/call.svg" />
                        <span>
                        <em className=" text-xs ">
                            +2519 3140 4545
                        </em><br />
                        <em className=" text-xs ">
                            +2519 3140 4545
                        </em>
                        </span>
                    </div>
                </div>
                <div className="grid">
                    <h3>Vehicle maintenance and service center</h3>
                    <div className=" flex items-center gap-1">
                        <IconSmall src="/public/images/location.svg" />
                        <em className=" text-xs ">
                            chichinya, behind Niyala motors
                        </em>
                    </div>
                </div>
                <div className="flex col-span-full items-center justify-center font-bold border-2 mx-4 mb-0 border-solid ">
                    Inspection Result
                </div>
            </div>
            <div className="vehicle_info">
                <RenderPlate3 inspection plateobj={carInfo} />
                <div className="grid grid-rows-3">
                    {carInfo && ["Year", "Odo", "Seats"]
                        .filter((val) => Object.hasOwn(carInfo, val))
                        .map((val) => (
                            <div
                                key={val}
                                className="additional_info grid border-0 border-solid border-b-2 py-1 items-center place-items-center "
                            >
                                <span>{val}</span>
                                <b>{carInfo[val]}</b>
                            </div>
                        ))}
                </div>
            </div>
        </header>
    );
}
