import React, { useState, useContext, useEffect, useRef } from 'react';
import { GalleryContext } from '../context/GalleryContext'
import { GlobalStateContext } from '../context/GlobalStateContext'

import { RouteComponentProps, useHistory } from 'react-router';
import { IonPage, IonContent, IonLoading, IonSlides, IonSlide, IonIcon, IonImg, isPlatform } from '@ionic/react'
import { Toast } from '@capacitor/core';
import { downloadOutline } from 'ionicons/icons';
import { Plugins } from "@capacitor/core";
import { AppMinimize } from '@ionic-native/app-minimize';
import Carousel, { Modal, ModalGateway } from 'react-images';

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
            Application.addListener("backButton", () => {
                if (isPlatform("android")) {
                    AppMinimize.minimize();
                }
            });
        }
    }, []);

    const { goBack } = useHistory();



    return (
        <IonPage id="post-gallery">
            <IonContent className="gallery-page">
                <IonLoading isOpen={downloading !== ""} message={downloading} />
                <ModalGateway>
                    <Modal closeOnBackdropClick={false} onClose={() => {
                        // console.log("Go back called");
                        goBack();
                    }}>
                        <Carousel currentIndex={parseInt(match.params.index)} views={albumPhotos.map((url) => ({ source: { regular: url, download: url, fullscreen: url, thumbnail: url } }))} />
                    </Modal>
                </ModalGateway>
            </IonContent>
        </IonPage>
    )
}

export default PostGallery;