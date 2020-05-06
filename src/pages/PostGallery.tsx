import React, { useState, useContext, useEffect, useRef } from 'react';
import { GalleryContext } from '../context/GalleryContext'
import { GlobalStateContext } from '../context/GlobalStateContext'

import { RouteComponentProps } from 'react-router';
import { IonPage, IonContent, IonLoading, IonSlides, IonSlide, IonIcon, IonImg } from '@ionic/react'
import { Toast } from '@capacitor/core';
import { downloadOutline } from 'ionicons/icons';
import { Plugins } from "@capacitor/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
const Application = Plugins.App;


const PostGallery: React.FC<RouteComponentProps<{ index: string }>> = ({ match }) => {
    // const imageRef = useRef<HTMLIonImgElement | null>(null);
    const albumPhotos = useContext(GlobalStateContext)!.currentPost;
    const downloadFile = useContext(GalleryContext)!.downloadFile;
    const slideOpts = {
        initialSlide: parseInt(match.params.index) || 0,
        speed: 400
    };
    const [downloading, setDownloading] = useState<string>("");
    useEffect(() => {
        // pz.enable()

        Application.removeAllListeners();
        return () => {
            // pz.disable();
            Application.addListener("backButton", () => {
                Application.exitApp();
            });
        };
    }, []);


    return (
        <IonPage>
            <IonContent className="gallery-page">
                <IonLoading isOpen={downloading !== ""} message={downloading} />
                <IonSlides className="gallery-slides" options={slideOpts}>
                    {
                        albumPhotos.map((photo, index) => {
                            return (

                                <IonSlide key={index} className="image-slide">
                                    <TransformWrapper options={{ centerContent: true }}  >
                                        <div className="gallery-image-container">
                                            <div className="image-actions">

                                                <IonIcon icon={downloadOutline} onClick={() => {
                                                    setDownloading("Downloading");
                                                    downloadFile(photo, `${Date.now()}.png`, "image/png").then(() => {
                                                        setDownloading("");
                                                        Toast.show({ text: "Downloaded.", duration: "short" });

                                                    }).catch(err => {
                                                        Toast.show({ text: "Error in downloading.", duration: "short" });
                                                        setDownloading("");
                                                    })
                                                }} className="download-icon" />
                                            </div>
                                            <div className="gallery-image-holder">
                                                <div className="gallery-transform">

                                                    <TransformComponent>
                                                        <IonImg className="gallery-image" src={photo} />
                                                    </TransformComponent>
                                                </div>
                                            </div>
                                        </div>
                                    </TransformWrapper>
                                </IonSlide>
                            )
                        })
                    }
                </IonSlides>
            </IonContent>
        </IonPage>
    )
}

export default PostGallery;