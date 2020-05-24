import React, { useContext, useState, useEffect, } from "react";
import { IonContent, IonPage, IonIcon, IonCard, IonThumbnail, IonImg, IonItem, IonLoading, IonRefresher, IonRefresherContent, useIonViewWillLeave, useIonViewWillEnter, isPlatform, useIonViewDidEnter } from "@ionic/react";
import "./Tab.css";
import { chatbubbleEllipses } from "ionicons/icons";
import { GlobalStateContext } from "../context/GlobalStateContext";
import Constant from "../Constant";
import { RouteComponentProps } from "react-router";
import { Announcement } from "../interface/TypeInterface";
import FlatList from "flatlist-react";
import { EmptyComponent, Loading } from "../components/EmptyComponent";
import { Plugins } from "@capacitor/core";
import { AppMinimize } from "@ionic-native/app-minimize";
import { Toast } from "@capacitor/core";
import linkIcon from '../images/link.svg';


const { timeSince, getStorageURL } = Constant;

const Tab2: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  // useEffect(() => {
  //   Plugins.App.addListener("backButton", () => {
  //     if (isPlatform("android")) {
  //       AppMinimize.minimize();
  //     }
  //   });
  //   // Application.requestPermissions ? Application.requestPermissions().then()
  //   // console.log(action)
  //   // return () => {
  //   //   Plugins.App.removeAllListeners();
  //   // };
  // }, []);
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
  const { announcements, setCurrentPost, hasMoreAnnouncements, loadMoreAnnouncements, announcementsLoading, refreshAnnouncements } = useContext(GlobalStateContext)!;
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <IonPage >
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={(event) => {
          refreshAnnouncements();
          // alert(Object.keys(event.detail))
          event.detail.complete();
        }}

        >
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonLoading message="Loading" isOpen={loading} />
        <div className="page-container">
          <div className="header">
            <div className="tab-name-container">
              <div className="icon">
                <IonIcon icon={chatbubbleEllipses} />
              </div>
              <div className="title">Posts</div>
              <div className="actions">
                {/* <IonIcon
                  icon={filter}
                  onClick={() => {
                    if (setAnnouncements && Announcements) {
                      setAnnouncements([
                        ...Announcements,
                        ...Announcements,
                      ]);
                    }
                  }}
                /> */}
                {/* <IonIcon icon={search} /> */}
              </div>
            </div>
          </div>
          <div className="body">
            <div className="announcement-list">
              <FlatList
                list={announcements ? announcements : []}
                renderItem={(announcement: Announcement, index: number) => (
                  <PostCard
                    item={announcement}
                    key={index}
                    setLoading={(load: boolean) => {
                      setLoading(load);
                    }}
                    openVideoPlayer={
                      (url) => {
                        history.push("/app/video-player?url=" + encodeURI(url));
                      }
                    }
                    openPostImage={
                      (index: number) => {
                        setCurrentPost(announcement.photos ? announcement.photos.map((photo: string) => getStorageURL(`announcements/${announcement.id}`, photo)) : []);
                        history.push("/app/post-images-gallery/" + index);
                      }
                    }
                  />
                )}
                hasMoreItems={hasMoreAnnouncements}
                paginationLoadingIndicator={<Loading />}
                paginationLoadingIndicatorPosition="center"
                loadMoreItems={() => loadMoreAnnouncements()}
                renderWhenEmpty={() => {
                  if (announcementsLoading) return <Loading />;
                  else return <EmptyComponent />;
                }}
              />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

const PostCard: React.FC<{
  item: Announcement;
  setLoading: (load: boolean) => void;
  openVideoPlayer: (url: string) => void;
  openPostImage: (index: number) => void;
}> = React.memo(({ item, setLoading, openVideoPlayer, openPostImage }) => {
  return (
    <div className="school-card">
      <div className="card-title">{"Admin"}</div>
      <div className="card-message">{item.message}</div>
      <div className="post-image-card-list">
        {
          item.photos?.slice(0, 2).map((photo, index) => {
            return (
              <div className="post-image-card" key={index} onClick={() => {
                openPostImage(index)
              }}>
                <IonThumbnail className="post-image-thumbnail" >
                  <img src={getStorageURL("announcements/" + item.id, "thumbs/thumb@256_" + photo)} />
                </IonThumbnail>
              </div>
            )
          })
        }
      </div>
      {
        item.url?.map((url, index) => <URLCard url={url} key={index} setLoading={setLoading} openVideoPlayer={openVideoPlayer} />)
      }
      <div className="author">{`${timeSince(item.timeStamp)}`}</div>
    </div>
  );
});

const URLCard: React.FC<{
  url: string,
  setLoading: (load: boolean) => void,
  openVideoPlayer: (url: string) => void;

}> = React.memo(({ url, setLoading, openVideoPlayer }) => {
  const isYoutube: boolean = (url?.indexOf("youtube.com/watch") !== -1 ||
    url?.indexOf("youtu.be/") !== -1);

  const [link, setLink] = useState<string>(url);
  const [thumbnail, setThumbnail] = useState<string>("");
  const loadResourceURL = useContext(GlobalStateContext)!.loadResourceURL;

  useEffect(() => {
    if (isYoutube) {
      fetch(
        `https://cors-bypasss.herokuapp.com/https://www.youtube.com/oembed?url=${url}&format=json`,
        {
          mode: "cors",
        }
      )
        .then((res) => {
          // console.log(res);
          return res.json();
        })
        .then((res) => {
          // console.log(res);

          setLink(res.title);
          setThumbnail(res.thumbnail_url);
        })
        .catch((_) => {

        });
    }
  }, [])

  return (
    <IonCard onClick={() => {
      if (isYoutube) {
        setLoading(true);
        loadResourceURL(url).then(resourceUrl => {
          setLoading(false);
          openVideoPlayer(resourceUrl[0].url);
        }).catch((err) => {
          // alert(err);
          setLoading(false);
          Toast.show({
            text: "Sorry, try again later",
            duration: "short",
          })
        })
      } else {
        window.open(url, "_system");
      }
    }}>
      <div className="url-card">

        <div className="url-thumbnail">
          <IonThumbnail>
            <IonImg src={thumbnail || linkIcon} />
          </IonThumbnail>
          {/* {
            thumbnail ?
              :
              <IonIcon className="hyperlink-icon" icon={linkOutline} />
          } */}
        </div>
        <div className="url-meta">
          <IonItem>
            <div style={{ wordBreak: "break-all" }}>
              {link}
            </div>

          </IonItem>
        </div>
      </div>
    </IonCard>
  )
})

export default Tab2;
