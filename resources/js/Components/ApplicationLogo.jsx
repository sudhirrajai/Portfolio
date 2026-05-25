export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            {...props}
            src="/favicon.png"
            alt="SR Logo"
            className={`object-contain rounded-xl ${className}`}
        />
    );
}
