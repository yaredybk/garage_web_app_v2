export default function IconLock({
    className="",
    locked,
    ...props
}) {
    let class1 = locked ? " h-6  w-auto  m-0 bg-green-300 ":" h-6  w-auto  m-0  ";
    return (
        <img
            className={class1 + className}
            src={locked ? "/public/images/lock_FILL0_wght400_GRAD0_opsz24.svg":"/public/images/lock_open_FILL0_wght400_GRAD0_opsz24.svg"}
            {...props}
        />
    );
}
