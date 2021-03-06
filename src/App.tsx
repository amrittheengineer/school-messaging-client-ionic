import React, { useEffect, useState, useContext } from "react";
import { Route } from "react-router-dom";
import { RouteComponentProps, useHistory } from "react-router";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToast,
} from "@ionic/react";
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
import { GlobalStateContext } from "./context/GlobalStateContext";
const App: React.FC<RouteComponentProps> = ({ location }) => {
  // const history = useHistory();
  useEffect(() => {

  }, []);




  const { replace } = useHistory();
  return (
    <IonTabs>

      <IonRouterOutlet>
        <Route path="/app/tab1" component={Tab1} exact={true} />
        <Route path="/app/tab2" component={Tab2} exact={true} />
        <Route path="/app/gallery" component={Tab3} exact={true} />

        {/* <Route
                path="/app"
                render={() => <Redirect to="/app/tab2" />}
                exact={true}
              /> */}
        {/* <Route
                path="/"
                render={() => <Redirect to="/app/tab2" />}
                exact={true}
              /> */}

      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton
          selected={"tab1" === location.pathname.split("/app/")[1]}
          tab="tab1"
          // selected={true}
          onClick={() => {
            replace("/app/tab1")
          }}
        // href="/app/tab1"
        >
          <IonIcon icon={home} />
          <IonLabel>Announcements</IonLabel>
        </IonTabButton>
        <IonTabButton
          selected={"tab2" === location.pathname.split("/app/")[1]}
          tab="tab2"
          onClick={() => {
            replace("/app/tab2")
          }}
        // href="/app/tab2"
        >
          <IonIcon icon={chatbubbleEllipses} />
          <IonLabel>Posts</IonLabel>
        </IonTabButton>
        <IonTabButton
          selected={"gallery" === location.pathname.split("/app/")[1]}
          tab="gallery"
          onClick={() => {
            replace("/app/gallery")
          }}
        // href="/app/gallery"
        >
          <IonIcon icon={image} />
          <IonLabel>Gallery</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
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
