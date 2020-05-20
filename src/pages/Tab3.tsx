import React, { useContext } from "react";
import {
  IonContent,
  IonIcon,
  IonPage,
  IonCard,
  IonImg,
  IonThumbnail,
  useIonViewWillLeave, useIonViewDidEnter, isPlatform
} from "@ionic/react";
import "./Tab.css";
import { image } from "ionicons/icons";
import { Album } from "../interface/TypeInterface";
import { GalleryContext } from "../context/GalleryContext";
import Constant from "../Constant";
import { RouteComponentProps } from "react-router";
import { Plugins } from "@capacitor/core";
import { AppMinimize } from "@ionic-native/app-minimize";
const { getStorageURL } = Constant;

const Tab3: React.FC<RouteComponentProps> = () => {
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

  return (
    <IonPage>
      <IonContent>
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
                  delay={index}
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
  delay: number;
}> = ({ album }) => {
  return (

    <div className="album-card-wrapper">
      <IonCard routerLink={"/app/album/" + album.id} routerDirection="forward" >
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
