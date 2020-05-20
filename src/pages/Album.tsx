import React, { useContext, useEffect, useState, useRef } from "react";
import {
  IonPage,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonImg,
  IonLoading,
  IonHeader,
  IonBackButton,
} from "@ionic/react";

// import { useFilesystem, base64FromPath } from '@ionic/react-hooks/filesystem';
// import { NativePageTransitions } from "@ionic-native/native-page-transitions";
import { RouteComponentProps, useHistory } from "react-router";
import { GalleryContext } from "../context/GalleryContext";
import { Plugins } from "@capacitor/core";
import { Video } from "../interface/TypeInterface";
import FlatList from "flatlist-react";
import { playCircle, arrowBack } from "ionicons/icons";
import { EmptyComponent, Loading } from "../components/EmptyComponent";
const Application = Plugins.App;
const { LocalNotifications } = Plugins;
// const { writeFile } = useFilesystem();

const Album: React.FC<RouteComponentProps<{ id: string }>> = (({ match }) => {
  const context = useContext(GalleryContext);

  const [selected, setSelected] = useState<string>("photos");
  const [downloading, setDownloading] = useState<string>("");
  useEffect(() => {
    context?.setCurrentAlbum((previousAlbum) => {
      if (previousAlbum === match.params.id) {
        return previousAlbum;
      } else {
        context?.resetStorageRef();
        return match.params.id;
      }
    });

    // Application.removeAllListeners();

    // return () => {
    //   Application.addListener("backButton", () => {
    //     if (isPlatform("android")) {
    //       AppMinimize.minimize();
    //     }
    //   });
    // }

  }, []);
  const history = useHistory();


  // const unBlock = useRef<any>(null);

  // useEffect(() => {
  // history.listen((newLocation, action) => {
  //   if (action === "POP") {
  //     // console.log(action);

  //     if (imageIndex !== -1) {
  //       //   // Clone location object and push it to history
  //       //   history.goBack();
  //       console.log("Going to push");

  //       // history.block(true)
  //       history.push({
  //         pathname: history.location.pathname,
  //         search: history.location.search
  //       });
  //     }
  //     // else {
  //     //   // If a "POP" action event occurs, 
  //     //   // Send user back to the originating location

  //     //   history.push({
  //     //     pathname: newLocation.pathname,
  //     //     search: newLocation.search
  //     //   });

  //     //   // history.go(1);
  //     // }
  //   }
  // });
  // }

  //   , [imageIndex]);



  return (
    <IonPage id="album">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton icon={arrowBack} />
          </IonButtons>
        </IonToolbar>
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

      </IonHeader>

      <IonContent>

        <IonLoading isOpen={downloading !== ""} message={downloading} />

        {/* <ModalGateway>
          {imageIndex !== -1 ? (
            <Modal onClose={() => setImageIndex(-1)}>
              <Carousel currentIndex={imageIndex} views={context ? context.albumPhotos.map(({ url }) => ({ source: { regular: url, download: url } })) : []} />
            </Modal>
          ) : null}
        </ModalGateway> */}

        {/* <Prompt when={imageIndex !== -1} /> */}

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
            renderItem={(image: { url: string }, ind: number) => {
              return (
                <div key={`${ind}`} onClick={() => {
                  // setImageIndex(ind);
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
              renderItem={(video: Video, ind: number) => {
                return (
                  <VideoCard
                    video={video}
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
});


const VideoCard: React.FC<{
  video: Video;
  onClick: () => void;
  downloadVideo: () => void;
}> = ({ video, onClick, downloadVideo }) => {
  const downloadElement = useRef<HTMLAnchorElement | null>(null);
  return (
    <div className="video-card">
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
          <a href={video.url} title={video.name} download={video.name} target="_self" ref={downloadElement}>{""}</a>
        </div>
      </div>
    </div>
  );
};



export default (Album);
