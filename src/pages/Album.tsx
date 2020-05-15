import React, { useContext, useEffect, useState, useRef } from "react";
import {
  IonPage,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonContent,
  IonRouterLink,
  IonRouterOutlet,
  IonSlide,
  IonSlides,
  IonSpinner,
  IonButton,
  IonIcon,
  IonImg,
  IonLoading,
  IonVirtualScroll,
} from "@ionic/react";

// import { useFilesystem, base64FromPath } from '@ionic/react-hooks/filesystem';
// import { NativePageTransitions } from "@ionic-native/native-page-transitions";
import { RouteComponentProps, Route, Redirect } from "react-router";
import { GalleryContext } from "../context/GalleryContext";
import { Plugins } from "@capacitor/core";
import { Video } from "../interface/TypeInterface";
import FlatList from "flatlist-react";
import { playCircle } from "ionicons/icons";
import { useSpring, animated } from "react-spring";
import { GlobalStateContext } from "../context/GlobalStateContext";
import { Capacitor } from '@capacitor/core'
import { EmptyComponent, Loading } from "../components/EmptyComponent";

const Application = Plugins.App;
const { LocalNotifications } = Plugins;

const { convertFileSrc } = Capacitor;
// const { writeFile } = useFilesystem();

const Album: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
  history,
}) => {
  const context = useContext(GalleryContext);

  const [selected, setSelected] = useState<string>("photos");
  const [downloading, setDownloading] = useState<string>("");

  useEffect(() => {
    Application.removeAllListeners();

    context?.setCurrentAlbum((previousAlbum) => {
      if (previousAlbum === match.params.id) {
        return previousAlbum;
      } else {
        context?.resetStorageRef();
        return match.params.id;
      }
    });

    // setTimeout(() => {
    //   setsel("videos");
    // }, 5000);

    // console.log(match.params.id);

    return () => {
      Application.addListener("backButton", () => {
        Application.exitApp();
      });
    };
  }, []);

  const slideOpts = {
    speed: 400,
    initialSlide: 0,
  };

  return (
    <IonPage>
      <IonToolbar>
        <IonSegment
          onIonChange={(e) => {
            // history.createHref("/view/videos")
            // setPhotoMode(false);
            setSelected(e.detail.value!);
          }}
          value={selected}
        >
          <IonSegmentButton value="photos">
            {/* <IonRouterLink routerDirection="none" routerLink="/view/photos"> */}
            Photos
            {/* </IonRouterLink> */}
          </IonSegmentButton>
          <IonSegmentButton value="videos">
            {/* <IonRouterLink routerDirection="none" routerLink="/view/videos"> */}
            Videos
            {/* </IonRouterLink> */}
          </IonSegmentButton>
        </IonSegment>
      </IonToolbar>
      <IonContent>
        <IonLoading isOpen={downloading !== ""} message={downloading} />
        {/* <IonReactRouter>
        <Route path="/view/photos" component={Photos} exact={true} />
        <Route path="/view/videos" component={Videos} exact={true} />
        <Route
          path="/album/:id"
          render={() => <Redirect to="/view/photos" />}
          exact={true}
        />
      </IonReactRouter> */}
        {selected === "photos" ? (
          // context?.albumPhotos.map((image, ind) => {

          //   return (
          //     <div key={`${ind}`} onClick={() => {
          //       history.push("/app/image-gallery/" + ind);
          //     }} className="image-thumbnail-container">
          //       <IonImg src={image.url} className="image-thumbnail" />
          //     </div>
          //   );
          // })
          <FlatList
            list={context ? context.albumPhotos : []}
            renderItem={(image, ind) => {
              return (
                <div key={`${ind}`} onClick={() => {
                  history.push("/app/image-gallery/" + ind);
                }} className="image-thumbnail-container">
                  <IonImg src={image.url} className="image-thumbnail" />
                </div>
              );
            }}
            renderWhenEmpty={() => {
              if (context?.hasMorePhotos) return <Loading />;
              else return <EmptyComponent />;
            }}
            // pagination={true}
            hasMoreItems={context?.hasMorePhotos}
            loadMoreItems={() => {
              context?.loadImageFromStorage(match.params.id);
            }}
          />
        ) : (
            <FlatList
              list={context ? context.albumVideos : []}
              renderItem={(video, ind) => {
                return (
                  <VideoCard
                    video={video}
                    delay={ind}
                    key={ind}
                    onClick={() => {
                      history.push("/app/video-player/?url=" + encodeURIComponent(video.url));
                    }}
                    downloadVideo={() => {
                      setDownloading("Downloading " + video.name);
                      // window.location = video.url;

                      context?.downloadFile(video.url, video.name, video.type).then(v => {
                        // alert("Video Downloaded");
                        setDownloading("");
                        LocalNotifications.schedule({
                          notifications: [
                            {
                              title: "Download Completed!",
                              body: "Open Gallery to view the video.",
                              id: 2
                            },
                          ],
                        })
                      }).catch((_) => {
                        setDownloading("");
                      })
                      // var link = document.createElement("a");
                      // if (link.download !== undefined) {
                      //   link.setAttribute("href", video.url);
                      //   link.setAttribute("target", "_blank");
                      //   link.setAttribute("title", video.name);
                      //   // link.style.visibility = 'hidden';
                      //   link.style.visibility = 'hidden';
                      //   document.body.appendChild(link);
                      //   link.click();
                      //   document.body.removeChild(link);
                      // }
                      // let fileEntry = await context!.downloadFile(video.url, video.name).catch(err => ({ toURL: () => "Download failed." }));
                      // alert(fileEntry.toURL());
                    }}
                  />
                );
                // return <p key={`${ind}`}>{url}</p>;
              }}
              renderWhenEmpty={() => {
                if (context?.hasMoreVideos) return <Loading />;
                else return <EmptyComponent />;
              }}
              // pagination={true}
              hasMoreItems={context?.hasMoreVideos}
              loadMoreItems={() => {
                // console.log("Called API");
                context?.loadVideoFromStorage(match.params.id);
              }}
            />
          )}
      </IonContent>
    </IonPage>
  );
};


const VideoCard: React.FC<{
  video: Video;
  delay: number;
  onClick: () => void;
  downloadVideo: () => void;
}> = ({ video, delay, onClick, downloadVideo }) => {
  const downloadElement = useRef<HTMLAnchorElement | null>(null);
  const props = useSpring({
    from: { transform: "scale(0.95)", opacity: 0 },
    to: { transform: "scale(1)", opacity: 1 },
    delay: delay * 200,
  });
  return (
    <animated.div style={props} className="video-card">
      <IonIcon className="play-icon" icon={playCircle} />
      <div className="video-meta">
        <div className="video-title">{video.name.split(".")[0]}</div>
        <div className="video-date">{`${new Date(video.timeStamp)
          .toDateString()
          .slice(4)}`}</div>
        <div className="video-action-buttons">
          <IonButton onClick={onClick}>
            Play
          </IonButton>
          <IonButton fill="outline" onClick={() => {
            // downloadElement.current!.click();
            downloadVideo();
          }}>
            Download
          </IonButton>
          <a href={video.url} title={video.name} download={video.name} target="_self" ref={downloadElement}></a>
        </div>
      </div>
    </animated.div>
  );
};



export default Album;
