import React, { useContext, useState } from "react";
import { IonContent, IonPage, IonIcon, IonCard, IonThumbnail, IonImg, IonItem, IonLoading } from "@ionic/react";
import "./Tab.css";
import { chatbubbleEllipses, search } from "ionicons/icons";
import { GlobalStateContext } from "../context/GlobalStateContext";
import Constant from "../Constant";
import { RouteComponentProps } from "react-router";
import { Announcement } from "../interface/TypeInterface";
import { useSpring, animated } from "react-spring";
import FlatList from "flatlist-react";
import EmptyComponent from "../components/EmptyComponent";
import { Toast } from "@capacitor/core";

const { timeSince, getStorageURL } = Constant;

const Tab1: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  const announcements = useContext(GlobalStateContext)?.announcements;
  const setCurrentPost = useContext(GlobalStateContext)!.setCurrentPost;
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <IonPage>
      <IonContent>
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
                <IonIcon icon={search} />
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
                renderWhenEmpty={() => <EmptyComponent />}
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
                  <IonImg src={getStorageURL("announcements/" + item.id, photo)} />
                </IonThumbnail>
              </div>
            )
          })
        }
      </div>
      {
        item.url?.length && item.url?.map((url, index) => {
          return (
            <IonCard key={index} onClick={() => {
              if (
                url.url &&
                (url.url?.indexOf("youtube.com/watch") !== -1 ||
                  url.url?.indexOf("youtu.be/") !== -1)
              ) {

                setLoading(true);
                loadResourceURL(url.url).then(resourceUrl => {
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

                window.open(url.url, "_system");
              }
            }}>
              <div className="url-card">

                <div className="url-thumbnail">
                  <IonThumbnail>
                    <IonImg src={url.thumbnail} />
                  </IonThumbnail>
                </div>
                <div className="url-meta">
                  <IonItem>
                    <div style={{ wordBreak: "break-all" }}>

                      {url.title ? url.title : url.url}
                    </div>

                  </IonItem>
                </div>
              </div>
            </IonCard>
          )
        })
      }

      <div className="author">{`${timeSince(item.timeStamp)}`}</div>
    </animated.div>
  );
};

export default Tab1;
