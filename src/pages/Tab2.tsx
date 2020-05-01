import React, { useContext } from "react";
import { IonContent, IonPage, IonIcon, IonCard, IonThumbnail, IonImg, IonItem } from "@ionic/react";
import "./Tab.css";
import { chatbubbleEllipses, search, filter } from "ionicons/icons";
import { GlobalStateContext } from "../context/GlobalStateContext";
import Constant from "../Constant";
import { RouteComponentProps } from "react-router";
import { Announcement } from "../interface/TypeInterface";
import { useSpring, animated } from "react-spring";
import FlatList from "flatlist-react";
import EmptyComponent from "../components/EmptyComponent";

const { timeSince } = Constant;

const Tab1: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const announcements = useContext(GlobalStateContext)?.announcements;
  return (
    <IonPage>
      <IonContent>
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
                renderItem={(announcemnent, index) => (
                  <PostCard
                    item={announcemnent}
                    key={index}
                    index={index}
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
}> = ({ item, index }) => {
  const props = useSpring({
    from: { transform: "scale(0.95)", opacity: 0 },
    to: { transform: "scale(1)", opacity: 1 },
    delay: (typeof index === "string" ? parseInt(index) : index) * 200,
  });
  return (
    <animated.div style={props} className="school-card">
      <div className="card-title">{"Admin"}</div>
      <div className="card-message">{item.message}</div>
      {
        item.url.length && item.url.map(url => {
          return (
            <IonCard onClick={() => {
              window.open(url.url, "_system");
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
