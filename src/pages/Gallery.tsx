import React, { useState, useContext, useRef, useEffect } from 'react';
import { GalleryContext } from '../context/GalleryContext'
import { RouteComponentProps } from 'react-router';
import { IonPage, IonContent, IonLoading, IonSlides, IonIcon, IonToast } from '@ionic/react'
import { downloadOutline, arrowBack } from 'ionicons/icons';
import GalleryImage from '../components/GalleryImage';
// import { Loading } from '../components/EmptyComponent';



const Gallery: React.FC<RouteComponentProps<{ index: string }>> = ({ match, history }) => {
    const albumPhotos = useContext(GalleryContext)!.albumPhotos;
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
    }, [toastMessage])


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
                            downloadFile(photo.url, photo.name, photo.type).then(() => {
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
                                        <GalleryImage url={photo.url} key={photo.name} />
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


export default Gallery;