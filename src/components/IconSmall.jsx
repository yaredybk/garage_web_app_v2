export default function IconSmall({
    src = "",
    alt = "img",
    className = "",
    ...props
}) {
    return (
        <img
            className={" h-6  w-auto  m-0 p-0 " + className}
            src={src}
            alt={alt}
            {...props}
        />
    );
}
