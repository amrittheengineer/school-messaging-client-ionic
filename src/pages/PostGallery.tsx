import React, { useState, useContext, useEffect } from 'react';
import { GalleryContext } from '../context/GalleryContext'
import { GlobalStateContext } from '../context/GlobalStateContext'

import { RouteComponentProps } from 'react-router';
import { IonPage, IonContent, IonLoading, IonSlides, IonSlide, IonIcon, IonImg } from '@ionic/react'
import { Toast } from '@capacitor/core';
import { downloadOutline } from 'ionicons/icons';
import { Plugins } from "@capacitor/core";
const Application = Plugins.App;



const PostGallery: React.FC<RouteComponentProps<{ index: string }>> = ({ match }) => {
    const albumPhotos = useContext(GlobalStateContext)!.currentPost;
    const downloadFile = useContext(GalleryContext)!.downloadFile;
    const slideOpts = {
        initialSlide: parseInt(match.params.index) || 0,
        speed: 400
    };
    const [downloading, setDownloading] = useState<string>("");
    useEffect(() => {
        Application.removeAllListeners();
        return () => {
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
                                        <IonImg className="gallery-image" src={photo} />
                                    </div>
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