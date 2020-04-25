import React, { useContext, useEffect } from "react";
import { IonContent, IonIcon, IonPage } from "@ionic/react";
import "./Tab.css";
import { image, filter, search } from "ionicons/icons";
import { Album } from "../interface/TypeInterface";
import { animated, useSpring } from "react-spring";
import { GalleryContext } from "../context/GalleryContext";
import Constant from "../Constant";
import { RouteComponentProps } from "react-router";
const { getStorageURL } = Constant;

const Tab3: React.FC<RouteComponentProps> = ({ history }) => {
  const albumList = useContext(GalleryContext)!.albumList;
  const setCurremtAlbum = useContext(GalleryContext)!.setCurrentAlbum;
  useEffect(() => {
    console.log("albumList.length", albumList);
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
                <AlbumCard
                  album={album}
                  onClick={() => {
                    setCurremtAlbum(album);
                    history.push("/album");
                  }}
                  key={album.id}
                  delay={index}
                />
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
      <img
        className="album-thumbnail"
        src={getStorageURL(album.id, album.thumbnail)}
        alt=""
      />
      <div className="album-title">{album.title}</div>
      <div className="album-date">{`${new Date(album.date)
        .toDateString()
        .slice(4)}`}</div>
    </animated.div>
  );
};

export default Tab3;
