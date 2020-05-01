import React from 'react';

const EmptyComponent: React.FC = () => {
    return (
        <div className="album-progress-container">
            <div className="album-progress">
                <img
                    className="progress-image"
                    src={require("../images/nothing.svg")}
                />
                <div>Nothing Here</div>
            </div>
        </div>
    );
};

export default EmptyComponent;