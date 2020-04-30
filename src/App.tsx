import React, { useEffect, useState, useContext, useRef } from "react";
import { Redirect, Route } from "react-router-dom";
import { useHistory, RouteComponentProps } from "react-router";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonPage,
  IonContent,
  IonSlide,
  IonSlides,
  IonImg
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { home, image, chatbubbleEllipses } from "ionicons/icons";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import {
  GlobalStateContextProvider,
  GlobalStateContext,
} from "./context/GlobalStateContext";
import { GalleryContext } from "./context/GalleryContext";
import * as qs from 'querystring';
import { GalleryContextProvider } from "./context/GalleryContext";
import Album from "./pages/Album";
import { Plugins } from "@capacitor/core";
import "./pages/Tab.css";

const Application = Plugins.App;
const VideoPlayer: React.FC<RouteComponentProps> = ({
  location,
  history
}) => {
  const [url, setUrl] = useState<string>("")
  const videoElement = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    Application.removeAllListeners();
    const urlSplit = location.search.split("?url=");
    try {
      setUrl(decodeURIComponent(urlSplit[1]));
    } catch (err) {
      history.goBack();
    }

    return () => { };
  }, []);
  return (

    <IonPage>
      <IonContent fullscreen={true}>
        <div className="video-player">
          {url && <video
            className="album-video-player"
            controls
            src={url}
            ref={videoElement}
            controlsList="nodownload"
            disablePictureInPicture
            onPlay={e => {
              console.log(videoElement.current);

              let videoPlayer: HTMLVideoElement = videoElement.current!;

              if (videoPlayer.requestFullscreen) videoPlayer.requestFullscreen()

            }}
          />}
        </div>
      </IonContent>
    </IonPage>
  );
};
const Gallery: React.FC<RouteComponentProps<{ index: string }>> = ({ match }) => {
  const albumPhotos = useContext(GalleryContext)!.albumPhotos
  const slideOpts = {
    initialSlide: parseInt(match.params.index) || 0,
    speed: 400
  };

  return (
    <IonPage>
      <IonContent fullscreen={true}>
        <div className="gallery-holder">

          <IonSlides options={slideOpts}>
            {
              albumPhotos.map((photo, index) => {
                return (
                  <IonSlide key={index} className="image-slide">
                    <div className="gallery-image-container">
                      <IonImg className="gallery-image" src={photo.url} />
                    </div>
                  </IonSlide>
                )
              })
            }
          </IonSlides>
        </div>
      </IonContent>
    </IonPage>
  )
}
const AppCore: React.FC = () => {
  useEffect(() => {
    Application.addListener("backButton", (event) => {
      Application.exitApp();
    });

    return () => {
      Application.removeAllListeners();
    };
  }, []);

  const [currentTab, setCurrentTab] = useState<string>("");


  return (
    <IonPage>
      <IonReactRouter>
        <IonTabs
          onIonTabsDidChange={(event) => {
            setCurrentTab(event.detail.tab);
          }}
        >
          <IonRouterOutlet>
            <Route path="/tab1" component={Tab1} exact={true} />
            <Route path="/tab2" component={Tab2} exact={true} />
            <Route path="/gallery" component={Tab3} />
            <Route path="/album/:id" component={Album} exact={true} />
            <Route
              path="/video-player"
              component={VideoPlayer}
              exact={true}
            />
            <Route
              path="/image-gallery/:index"
              component={Gallery}
              exact={true}
            />
            <Route
              path="/"
              render={() => <Redirect to="/tab2" />}
              exact={true}
            />


          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton
              disabled={currentTab === "tab1"}
              tab="tab1"
              href="/tab1"
            >
              <IonIcon icon={home} />
              <IonLabel>Announcements</IonLabel>
            </IonTabButton>
            <IonTabButton
              disabled={currentTab === "tab2"}
              tab="tab2"
              href="/tab2"
            >
              <IonIcon icon={chatbubbleEllipses} />
              <IonLabel>Posts</IonLabel>
            </IonTabButton>
            <IonTabButton
              disabled={currentTab === "gallery"}
              tab="gallery"
              href="/gallery"
            >
              <IonIcon icon={image} />
              <IonLabel>Gallery</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonPage>
  );
};

const App: React.FC = () => {
  return (
    <GlobalStateContextProvider>
      <GalleryContextProvider>
        <AppCore />
      </GalleryContextProvider>
    </GlobalStateContextProvider>
  );
};

export default App;
