const Spinner = () => {
    return (
        <div
            className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"
            role="status"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;