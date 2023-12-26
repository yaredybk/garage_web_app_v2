export default function ContactMe() {
    return (
        <div className="contactme place-items-center">
            <div>
                <p className="m-0">Designed and deployed by </p>
                <p className="m-0">
                    <b>Yared Bekuru</b>
                </p>
                <p className="m-0">
                    <a href={`tel:+251933060604`}>
                        <>
                            <img
                                className="b-image h-6 inline"
                                src="/public/images/phone.png"
                                alt="call"
                            />
                            <span> +251933060604</span>
                        </>
                    </a>
                </p>
            </div>
        </div>
    );
}
