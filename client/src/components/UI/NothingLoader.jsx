const NothingLoader = () => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            minHeight: '300px'
        }}>
            <div className="nothing-loader">
                <div className="nothing-dot"></div>
                <div className="nothing-dot"></div>
                <div className="nothing-dot"></div>
            </div>
        </div>
    );
};

export default NothingLoader;
