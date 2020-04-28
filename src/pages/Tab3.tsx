import React, { useContext, useEffect } from "react";
import {
  IonContent,
  IonIcon,
  IonPage,
  IonRouterOutlet,
  IonRouterLink,
} from "@ionic/react";
import "./Tab.css";
import { image, filter, search } from "ionicons/icons";
import { Album } from "../interface/TypeInterface";
import { animated, useSpring } from "react-spring";
import { GalleryContext } from "../context/GalleryContext";
import Constant from "../Constant";
import { RouteComponentProps, Route } from "react-router";
import { useHistory } from "react-router";
const { getStorageURL } = Constant;

const Tab3: React.FC<RouteComponentProps> = ({ history }) => {
  const albumList = useContext(GalleryContext)!.albumList;
  const setCurremtAlbum = useContext(GalleryContext)!.setCurrentAlbum;
  const resetStorageRef = useContext(GalleryContext)!.resetStorageRef;
  useEffect(() => {
    console.log(history.action);
  }, [albumList]);

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
                <IonIcon icon={filter} />
                <IonIcon icon={search} />
              </div>
            </div>
          </div>
          <div className="body">
            <div className="album-list">
              {albumList.map((album, index) => (
                // <IonRouterLink routerLink="/album" routerDirection="forward">
                <AlbumCard
                  album={album}
                  onClick={() => {
                    setCurremtAlbum((previousState) => {
                      if (previousState && previousState.id === album.id) {
                        return previousState;
                      } else {
                        resetStorageRef();
                        console.log("Reset Album");

                        return album;
                      }
                    });
                    // console.log(album.id);

                    history.push(
                      "/album/" + album.id
                      // {},
                      // { animate: true, animation: "forward" }
                    );
                  }}
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
  onClick: () => void;
}> = ({ album, delay, onClick }) => {
  const props = useSpring({
    from: { transform: "scale(0.95)", opacity: 0 },
    to: { transform: "scale(1)", opacity: 1 },
    delay: delay * 200,
  });
  return (
    <animated.div style={props} onClick={onClick} className="album-card">
      {/* <img
        className="album-thumbnail"
        src={getStorageURL(album.id, album.thumbnail)}
        alt=""
      /> */}
      <div className="album-title">{album.title}</div>
      <div className="album-date">{`${new Date(album.date)
        .toDateString()
        .slice(4)}`}</div>
    </animated.div>
  );
};

export default Tab3;
