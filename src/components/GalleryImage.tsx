import React, { useState, useEffect } from 'react';
import { LoadingDark, Error } from '../components/EmptyComponent';
import { IonSlide } from '@ionic/react';

const GalleryImage: React.FC<{ url: string }> = ({ url }) => {
    const [image, setImage] = useState(<LoadingDark />)
    useEffect(() => {
        var controller = new AbortController();
        var signal = controller.signal;
        if (url) {
            fetch(url, { method: 'GET', signal })
                .then(res => {
                    if (res.status !== 200) {
                        return null;
                    } else {
                        return res.blob();
                    }
                })
                .then(res => {
                    if (res === null) {
                        setImage(<Error />)
                    } else {
                        const newImageUrl = URL.createObjectURL(res);
                        setImage(<img className="gallery-image" src={newImageUrl} />)
                        setTimeout(() => {
                            URL.revokeObjectURL(newImageUrl)
                        }, 300);
                    }
                })
                .catch(_ => setImage(<Error />))
        }
        return () => {
            controller.abort();
        }
    }, [])
    return (
        <IonSlide className="image-slide">
            {image}
        </IonSlide>
    )
}
export default GalleryImage;