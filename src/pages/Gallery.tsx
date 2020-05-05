import React, { useState, useContext } from 'react';
import { GalleryContext } from '../context/GalleryContext'
import { RouteComponentProps } from 'react-router';
import { IonPage, IonContent, IonLoading, IonSlides, IonSlide, IonIcon, IonImg } from '@ionic/react'
import { Toast } from '@capacitor/core';
import { downloadOutline } from 'ionicons/icons';


const Gallery: React.FC<RouteComponentProps<{ index: string }>> = ({ match }) => {
    const albumPhotos = useContext(GalleryContext)!.albumPhotos;
    const downloadFile = useContext(GalleryContext)!.downloadFile;
    const slideOpts = {
        initialSlide: parseInt(match.params.index) || 0,
        speed: 400
    };

    const [downloading, setDownloading] = useState<string>("");


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
                                                downloadFile(photo.url, photo.name, photo.type).then(() => {
                                                    setDownloading("");
                                                    Toast.show({ text: "Downloaded.", duration: "short" });
                                                    // LocalNotifications.schedule({
                                                    //   notifications: [
                                                    //     {
                                                    //       title: "Download Completed!",
                                                    //       body: `Open Gallery to view the image.`,
                                                    //       id: 1
                                                    //     },
                                                    //   ],
                                                    // })
                                                }).catch(err => {
                                                    setDownloading("");
                                                })
                                            }} className="download-icon" />
                                        </div>
                                        <IonImg className="gallery-image" src={photo.url} />
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

export default Gallery;