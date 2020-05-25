import React, { useContext, useState, useEffect } from "react";
import {
  IonContent,
  IonIcon,
  IonPage,
  IonCard,
  IonImg,
  IonThumbnail,
  useIonViewWillLeave, useIonViewDidEnter, isPlatform, IonToast
} from "@ionic/react";
import "./Tab.css";
import { image } from "ionicons/icons";
import { Album } from "../interface/TypeInterface";
import { GalleryContext } from "../context/GalleryContext";
import Constant from "../Constant";
import { RouteComponentProps, useHistory } from "react-router";
import { Plugins } from "@capacitor/core";
import { AppMinimize } from "@ionic-native/app-minimize";
import { GlobalStateContext } from "../context/GlobalStateContext";
const { getStorageURL } = Constant;

const Tab3: React.FC<RouteComponentProps> = () => {
  const { push } = useHistory()
  useIonViewDidEnter(() => {
    // alert("Set")
    Plugins.App.addListener("backButton", () => {
      if (isPlatform("android")) {
        AppMinimize.minimize();
      } else {
        Plugins.App.exitApp();
      }
    });
  }, [])
  useIonViewWillLeave(() => {
    Plugins.App.removeAllListeners();
  }, [])
  const albumList = useContext(GalleryContext)!.albumList;
  const [toastMessage, showToastMessage] = useState<string>("");

  const { connectionStatus } = useContext(GlobalStateContext)!;

  // useEffect(() => {
  //   if (connectionStatus === false) {
  //     showToastMessage("No internet connection.")
  //   }
  // }, [connectionStatus]);
  useEffect(() => {
    if (toastMessage !== "") {
      setTimeout(() => {
        showToastMessage("");
      }, 2000);
    }
  }, [toastMessage]);
  return (
    <IonPage>
      <IonContent>
        <IonToast color="primary" message={toastMessage} isOpen={toastMessage !== ""} />
        <div className="page-container">
          <div className="header">
            <div className="tab-name-container">
              <div className="icon">
                <IonIcon icon={image} />
              </div>
              <div className="title">Gallery</div>
              <div className="actions">
                {/* <IonIcon icon={filter} />
                <IonIcon icon={search} /> */}
              </div>
            </div>
          </div>
          <div className="body">
            <div className="album-list">
              {albumList.map((album, index) => (
                // <IonRouterLink routerLink="/album" routerDirection="forward">
                <AlbumCard
                  album={album}
                  key={album.id}
                  onClick={() => {
                    if (connectionStatus) {

                      push("/app/album/" + album.id);
                    } else {
                      showToastMessage("No internet connection.")
                    }
                  }}
                />
                // </IonRouterLink>
              ))}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

const AlbumCard: React.FC<{
  album: Album;
  onClick: () => void;
}> = ({ album, onClick }) => {
  return (

    <div className="album-card-wrapper">
      <IonCard onClick={onClick} >
        {/* <img
        className="album-thumbnail"
        src={getStorageURL(album.id, album.thumbnail)}
        alt=""
      /> */}
        <div className="album-card">
          <div className="album-thumbnail">
            <IonThumbnail>
              <IonImg src={getStorageURL(album.id, "images/thumbs/thumb@256_" + album.thumbnail)} />
            </IonThumbnail>
          </div>
          <div className="album-meta">

            <div className="album-title">{album.title}</div>
            <div className="album-date">{`${new Date(album.date)
              .toDateString()
              .slice(4)}`}</div>
          </div>
        </div>
      </IonCard>
    </div>
  );
};

export default Tab3;
