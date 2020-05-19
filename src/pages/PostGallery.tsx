import React, { useState, useContext, useEffect, useRef } from 'react';
import { GalleryContext } from '../context/GalleryContext'
import { GlobalStateContext } from '../context/GlobalStateContext'

import { RouteComponentProps } from 'react-router';
import { IonPage, IonContent, IonLoading, IonSlides, IonIcon, IonToast, isPlatform } from '@ionic/react'
import { downloadOutline, arrowBack } from 'ionicons/icons';
import { Plugins } from "@capacitor/core";
import { AppMinimize } from '@ionic-native/app-minimize';
import GalleryImage from '../components/GalleryImage';
const Application = Plugins.App;


const PostGallery: React.FC<RouteComponentProps<{ index: string }>> = ({ match, history }) => {
    // const imageRef = useRef<HTMLIonImgElement | null>(null);
    const albumPhotos = useContext(GlobalStateContext)!.currentPost;
    const downloadFile = useContext(GalleryContext)!.downloadFile;
    const slideOpts = {
        initialSlide: parseInt(match.params.index) || 0,
        speed: 400
    };

    const [downloading, setDownloading] = useState<boolean>(false);

    const slidesRef = useRef<HTMLIonSlidesElement | null>(null);

    const currentPhotoIndex = useRef<number>(parseInt(match.params.index));

    const [toastMessage, showToast] = useState<string>("");

    useEffect(() => {
        if (toastMessage) {
            setTimeout(() => {
                showToast("");
            }, 2000);
        }
    }, [toastMessage]);

    useEffect(() => {
        Application.removeAllListeners();

        return () => {
            Application.addListener("backButton", () => {
                if (isPlatform("android")) {
                    AppMinimize.minimize();
                }
            });
        }
    }, []);


    return (
        <IonPage>
            <IonContent>
                <IonLoading isOpen={downloading} message="Downloading" />
                <IonToast message={toastMessage} isOpen={toastMessage !== ""} />
                <div className="gallery-page">
                    <div className="image-actions">
                        <IonIcon icon={arrowBack} onClick={() => {
                            history.goBack()
                        }} className="back-icon" />
                        <IonIcon icon={downloadOutline} onClick={() => {
                            setDownloading(true);
                            const photo = albumPhotos[currentPhotoIndex.current];
                            downloadFile(photo, `${Date.now()}.png`, "image/png").then(() => {
                                setDownloading(false);
                                showToast("Downloaded");
                            }).catch(_err => {
                                setDownloading(false);
                            })
                        }} className="download-icon" />
                    </div>
                    <div className="slides-container">

                        <IonSlides onIonSlideDidChange={() => {
                            slidesRef.current!.getActiveIndex().then(index => {
                                currentPhotoIndex.current = index;
                            }).catch(_ => { })
                        }} ref={slidesRef} className="gallery-slides" options={slideOpts}>
                            {
                                albumPhotos.map((photo) => {
                                    return (
                                        <GalleryImage url={photo} key={photo} />
                                    )
                                })
                            }
                        </IonSlides>
                    </div>

                </div>
            </IonContent>
        </IonPage>
    )
}

export default PostGallery;