import './Loader.scss'; 

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="loader"></div>
            <span className="loading-text">Loading...</span>
        </div>
    );
};

export default Loader;