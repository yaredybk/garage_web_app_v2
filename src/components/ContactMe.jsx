import "./contactme.css"
import IconSmall from './IconSmall';
export default function ContactMe() {
    return (
        <div className="contactme pb-2 place-items-center sticky -bottom-24">
            <div className='grid gap-2'>
                <p className="m-0">Designed and deployed by </p>
                <p className="m-0 underline underline-offset-4">
                    <b>Yared Bekuru</b>
                </p>
                    <a role='button' href={`tel:+251933060604`}>
                            <IconSmall
                                className="b-image h-6 inline"
                                src="/public/images/phone.png"
                                alt="call"
                            />
                            <span> +251933060604</span>
                    </a>
            </div>
        </div>
    );
}
