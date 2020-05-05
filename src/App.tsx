import React, { useEffect, useState, useContext, useRef } from "react";
import { Redirect, Route } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import {
  IonLoading,
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
  IonImg,
  IonApp
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { home, image, chatbubbleEllipses, downloadOutline } from "ionicons/icons";
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
  GlobalStateContext
} from "./context/GlobalStateContext";
import { GalleryContext } from "./context/GalleryContext";
import { GalleryContextProvider } from "./context/GalleryContext";
import { Plugins } from "@capacitor/core";
import Album from './pages/Album';
import Gallery from './pages/Gallery';
import PostGallery from './pages/PostGallery';
import VideoPlayer from './pages/VideoPlayer';

import Auth from "./pages/Auth";

const Application = Plugins.App;
const { LocalNotifications } = Plugins;

const App: React.FC = () => {
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
      <IonContent>
        <IonReactRouter>
          <IonTabs
            onIonTabsDidChange={(event) => {
              setCurrentTab(event.detail.tab);
            }}
          >
            <IonRouterOutlet>
              <Route path="/app/tab1" component={Tab1} />
              <Route path="/app/tab2" component={Tab2} />
              <Route path="/app/gallery" component={Tab3} />

              <Route
                path="/app"
                render={() => <Redirect to="/app/tab2" />}
                exact={true}
              />
              <Route path="/app/album/:id" component={Album} />
              <Route
                path="/app/video-player"
                component={VideoPlayer}
                exact={true}
              />
              <Route
                path="/app/image-gallery/:index"
                component={Gallery}
                exact={true}
              />
              <Route
                path="/app/post-images-gallery/:index"
                component={PostGallery}
                exact={true}
              />


            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton
                // disabled={currentTab === "tab1"}
                tab="tab1"
                href="/app/tab1"
              >
                <IonIcon icon={home} />
                <IonLabel>Announcements</IonLabel>
              </IonTabButton>
              <IonTabButton
                // disabled={currentTab === "tab2"}
                tab="tab2"
                href="/app/tab2"
              >
                <IonIcon icon={chatbubbleEllipses} />
                <IonLabel>Posts</IonLabel>
              </IonTabButton>
              <IonTabButton
                // disabled={currentTab === "gallery"}
                tab="gallery"
                href="/app/gallery"
              >
                <IonIcon icon={image} />
                <IonLabel>Gallery</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonContent>
    </IonPage>
  );
};



// const VideoPlayer: React.FC<RouteComponentProps> = ({
//   location,
//   history
// }) => {
//   const [url, setUrl] = useState<string>("")
//   const videoElement = useRef<HTMLVideoElement | null>(null);
//   useEffect(() => {
//     Application.removeAllListeners();
//     const urlSplit = location.search.split("?url=");
//     try {
//       setUrl(decodeURIComponent(urlSplit[1]));
//     } catch (err) {
//       history.goBack();
//     }

//     return () => { };
//   }, []);
//   return (

//     <IonPage>
//       <IonContent fullscreen={true}>
//         <div className="video-player">
//           {url && <video
//             className="album-video-player"
//             controls
//             src={url}
//             ref={videoElement}
//             controlsList="nodownload"
//             disablePictureInPicture
//             onPlay={e => {
//               console.log(videoElement.current);

//               let videoPlayer: HTMLVideoElement = videoElement.current!;

//               if (videoPlayer.requestFullscreen) videoPlayer.requestFullscreen()

//             }}
//           />}
//         </div>
//       </IonContent>
//     </IonPage>
//   );
// };
// const PostGallery: React.FC<RouteComponentProps<{ index: string }>> = ({ match }) => {
//   const albumPhotos = useContext(GlobalStateContext)!.currentPost;
//   const downloadFile = useContext(GalleryContext)!.downloadFile;
//   const slideOpts = {
//     initialSlide: parseInt(match.params.index) || 0,
//     speed: 400
//   };
//   const [downloading, setDownloading] = useState<string>("");
//   useEffect(() => {
//     Application.removeAllListeners();
//     return () => {
//       Application.addListener("backButton", () => {
//         Application.exitApp();
//       });
//     };
//   }, []);


//   return (
//     <IonPage>
//       <IonContent className="gallery-page">
//         <IonLoading isOpen={downloading !== ""} message={downloading} />
//         <IonSlides className="gallery-slides" options={slideOpts}>
//           {
//             albumPhotos.map((photo, index) => {
//               return (
//                 <IonSlide key={index} className="image-slide">

//                   <div className="gallery-image-container">
//                     <div className="image-actions">

//                       <IonIcon icon={downloadOutline} onClick={() => {
//                         setDownloading("Downloading");
//                         downloadFile(photo, `${Date.now()}.png`, "image/png").then(() => {
//                           setDownloading("");
//                           LocalNotifications.schedule({
//                             notifications: [
//                               {
//                                 title: "Download Completed!",
//                                 body: `Open Gallery to view the image.`,
//                                 id: 1
//                               },
//                             ],
//                           })
//                         }).catch(err => {
//                           setDownloading("");
//                         })
//                       }} className="download-icon" />
//                     </div>
//                     <IonImg className="gallery-image" src={photo} />
//                   </div>
//                 </IonSlide>
//               )
//             })
//           }
//         </IonSlides>
//       </IonContent>
//     </IonPage>
//   )
// }
// const Gallery: React.FC<RouteComponentProps<{ index: string }>> = ({ match }) => {
//   const albumPhotos = useContext(GalleryContext)!.albumPhotos;
//   const downloadFile = useContext(GalleryContext)!.downloadFile;
//   const slideOpts = {
//     initialSlide: parseInt(match.params.index) || 0,
//     speed: 400
//   };

//   const [downloading, setDownloading] = useState<string>("");


//   return (
//     <IonPage>
//       <IonContent className="gallery-page">
//         <IonLoading isOpen={downloading !== ""} message={downloading} />

//         <IonSlides className="gallery-slides" options={slideOpts}>
//           {
//             albumPhotos.map((photo, index) => {
//               return (
//                 <IonSlide key={index} className="image-slide">

//                   <div className="gallery-image-container">
//                     <div className="image-actions">

//                       <IonIcon icon={downloadOutline} onClick={() => {
//                         setDownloading("Downloading");
//                         downloadFile(photo.url, photo.name, photo.type).then(() => {
//                           setDownloading("");
//                           LocalNotifications.schedule({
//                             notifications: [
//                               {
//                                 title: "Download Completed!",
//                                 body: `Open Gallery to view the image.`,
//                                 id: 1
//                               },
//                             ],
//                           })
//                         }).catch(err => {
//                           setDownloading("");
//                         })
//                       }} className="download-icon" />
//                     </div>
//                     <IonImg className="gallery-image" src={photo.url} />
//                   </div>
//                 </IonSlide>
//               )
//             })
//           }
//         </IonSlides>
//       </IonContent>
//     </IonPage>
//   )
// }
export default App;
