export default function IconSmall({
    src = "",
    alt = "img",
    height = "20px",
    className = "",
    ...props
}) {
    return (
        <img
            height={height}
            className={"  w-auto  m-0 p-0 " + className}
            src={src}
            alt={alt}
            {...props}
        />
    );
}
