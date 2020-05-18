import React, { useState, useContext } from 'react';
import { GalleryContext } from '../context/GalleryContext'
import { RouteComponentProps, useHistory } from 'react-router';
import { IonPage, IonContent, IonLoading, IonSlides, IonSlide, IonIcon, IonImg } from '@ionic/react'
import { Toast } from '@capacitor/core';
import { downloadOutline } from 'ionicons/icons';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Carousel, { Modal, ModalGateway } from 'react-images';




const Gallery: React.FC<RouteComponentProps<{ index: string }>> = ({ match }) => {
    const albumPhotos = useContext(GalleryContext)!.albumPhotos;
    const downloadFile = useContext(GalleryContext)!.downloadFile;
    const slideOpts = {
        initialSlide: parseInt(match.params.index) || 0,
        speed: 400
    };

    const { goBack } = useHistory();

    const [downloading, setDownloading] = useState<string>("");


    return (
        <IonPage id="gallery">
            <IonContent className="gallery-page">
                <IonLoading isOpen={downloading !== ""} message={downloading} />
                <ModalGateway>
                    <Modal closeOnBackdropClick={false} onClose={() => {
                        console.log("Go back called");
                        goBack();
                    }}>
                        <Carousel currentIndex={parseInt(match.params.index)} views={albumPhotos.map(({ url }) => ({ source: { regular: url, download: url, fullscreen: url, thumbnail: url } }))} />
                    </Modal>
                </ModalGateway>
            </IonContent>
        </IonPage>
    )
}

export default Gallery;