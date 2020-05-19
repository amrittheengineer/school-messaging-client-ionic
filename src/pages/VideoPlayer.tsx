import React, { useState, useRef, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { IonPage, IonContent, useIonViewWillLeave, } from '@ionic/react'
import { Plugins } from "@capacitor/core";
const Application = Plugins.App;

const VideoPlayer: React.FC<RouteComponentProps> = ({
    location,
    history
}) => {
    const [url, setUrl] = useState<string>("")
    const videoElement = useRef<HTMLVideoElement | null>(null);
    useEffect(() => {
        const urlSplit = location.search.split("?url=");
        try {
            setUrl(decodeURIComponent(urlSplit[1]));
        } catch (err) {
            history.goBack();
        }
    }, []);

    useIonViewWillLeave(() => {
        if (videoElement.current) {
            videoElement.current.pause();
            // history.goBack();
        }
    }, [])
    return (

        <IonPage>
            <IonContent fullscreen={true}>
                <div className="video-player">
                    {url && <video
                        className="album-video-player"
                        controls
                        autoPlay
                        src={url}
                        ref={videoElement}
                        controlsList="nodownload"
                        disablePictureInPicture
                    // onPlay={e => {
                    //     console.log(videoElement.current);

                    //     let videoPlayer: HTMLVideoElement = videoElement.current!;

                    //     if (videoPlayer.requestFullscreen) videoPlayer.requestFullscreen()

                    // }}
                    />}
                </div>
            </IonContent>
        </IonPage>
    );
};
export default VideoPlayer;