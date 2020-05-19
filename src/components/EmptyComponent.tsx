import React from 'react';
import { IonSpinner } from '@ionic/react';

export const EmptyComponent: React.FC = () => {
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

export const Loading: React.FC = () => {
    return (
        <div className="album-progress-container">
            <div className="album-progress">
                <IonSpinner />
                <div>Loading</div>
            </div>
        </div>
    );
};
export const LoadingDark: React.FC = () => {
    return (
        <div className="album-progress-container">
            <div className="album-progress">
                <IonSpinner className="spinner-color-white" />
                <div style={{ color: "#fff" }}>Loading</div>
            </div>
        </div>
    )
}
export const Error: React.FC = () => {
    return (
        <div className="album-progress-container">
            <div className="album-progress">
                <div style={{ color: "#fff" }}>Something went wrong.</div>
            </div>
        </div>
    )
}