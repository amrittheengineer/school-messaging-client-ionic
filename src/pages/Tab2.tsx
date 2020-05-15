import React, { useContext, useState, useEffect, SetStateAction } from "react";
import { IonContent, IonPage, IonIcon, IonCard, IonThumbnail, IonImg, IonItem, IonLoading, IonRefresher, IonRefresherContent } from "@ionic/react";
import "./Tab.css";
import { chatbubbleEllipses, search, linkOutline, linkSharp } from "ionicons/icons";
import { GlobalStateContext } from "../context/GlobalStateContext";
import Constant from "../Constant";
import { RouteComponentProps } from "react-router";
import { Announcement } from "../interface/TypeInterface";
import { useSpring, animated } from "react-spring";
import FlatList from "flatlist-react";
import { EmptyComponent, Loading } from "../components/EmptyComponent";
import { Toast } from "@capacitor/core";
import linkIcon from '../images/link.svg';

const { timeSince, getStorageURL } = Constant;

const Tab2: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  const { announcements, setCurrentPost, hasMoreAnnouncements, loadMoreAnnouncements, announcementsLoading, resetAnnouncements } = useContext(GlobalStateContext)!;
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <IonPage>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={(event) => {
          resetAnnouncements();
          loadMoreAnnouncements();
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
                renderItem={(announcement, index) => (
                  <PostCard
                    item={announcement}
                    key={index}
                    index={index}
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
  index: number;
  setLoading: (load: boolean) => void;
  openVideoPlayer: (url: string) => void;
  openPostImage: (index: number) => void;
}> = ({ item, index, setLoading, openVideoPlayer, openPostImage }) => {
  const props = useSpring({
    from: { transform: "scale(0.95)", opacity: 0 },
    to: { transform: "scale(1)", opacity: 1 },
    delay: (typeof index === "string" ? parseInt(index) : index) * 200,
  });
  const loadResourceURL = useContext(GlobalStateContext)!.loadResourceURL;
  return (
    <animated.div style={props} className="school-card">
      <div className="card-title">{"Admin"}</div>
      <div className="card-message">{item.message}</div>
      <div className="post-image-card-list">
        {
          item.photos?.length && item.photos?.slice(0, 2).map((photo, index) => {
            return (
              <div className="post-image-card" key={index} onClick={() => {
                openPostImage(index)
              }}>
                <IonThumbnail className="post-image-thumbnail" >
                  <IonImg src={getStorageURL("announcements/" + item.id, "thumbs/thumb@256_" + photo)} />
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
    </animated.div>
  );
};

const URLCard: React.FC<{
  url: string,
  setLoading: (load: boolean) => void,
  openVideoPlayer: (url: string) => void;

}> = ({ url, setLoading, openVideoPlayer }) => {
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
          console.log({
            title: res.title,
            thumbnail: res.thumbnail_url,
          });

          setLink(res.title);
          setThumbnail(res.thumbnail_url);
        })
        .catch((err) => console.log(err));
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
          alert(err);
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
}

export default Tab2;
