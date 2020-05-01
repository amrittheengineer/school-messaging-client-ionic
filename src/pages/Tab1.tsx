import React, { useContext } from "react";
import { IonContent, IonPage, IonIcon } from "@ionic/react";
import "./Tab.css";
import { home, search, filter } from "ionicons/icons";
import { GlobalStateContext } from "../context/GlobalStateContext";
import Constant from "../Constant";
import { RouteComponentProps } from "react-router";
import { ClassAnnouncement } from "../interface/TypeInterface";
import { useSpring, animated } from "react-spring";
import EmptyComponent from "../components/EmptyComponent";

import FlatList from "flatlist-react";
const { timeSince } = Constant;

const Tab1: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const classAnnouncements = useContext(GlobalStateContext)?.classAnnouncements;
  const setClassAnnouncements = useContext(GlobalStateContext)
    ?.setClassAnnouncements;
  return (
    <IonPage>
      <IonContent>
        <div className="page-container">
          <div className="header">
            <div className="tab-name-container">
              <div className="icon">
                <IonIcon icon={home} />
              </div>
              <div className="title">Announcements</div>
              <div className="actions">
                <IonIcon
                  icon={filter}
                  onClick={() => {
                    if (setClassAnnouncements && classAnnouncements) {
                      setClassAnnouncements([
                        ...classAnnouncements,
                        ...classAnnouncements,
                      ]);
                    }
                  }}
                />
                <IonIcon icon={search} />
              </div>
            </div>
          </div>
          <div className="body">
            <div className="announcement-list">
              <FlatList
                list={classAnnouncements ? classAnnouncements : []}
                renderItem={(announcemnent, index) => (
                  // <div className="school-card" key={""}>
                  //   <div className="card-title">{""}</div>
                  //   <div className="card-message">{"announcemnent.message"}</div>
                  //   <div className="author">{timeSince(0)}</div>
                  // </div>
                  <AnnouncementCard
                    item={announcemnent}
                    key={index}
                    index={index}
                  />
                )}
                renderWhenEmpty={() => <EmptyComponent />}
              />
              {/* {classAnnouncements?.map(
                (announcemnent: ClassAnnouncement, index: number) => (
                  // <div className="school-card" key={""}>
                  //   <div className="card-title">{""}</div>
                  //   <div className="card-message">{"announcemnent.message"}</div>
                  //   <div className="author">{timeSince(0)}</div>
                  // </div>
                  <AnnouncementCard
                    item={announcemnent}
                    key={index}
                    index={index}
                  />
                )
              )} */}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

const AnnouncementCard: React.FC<{
  item: ClassAnnouncement;
  index: number;
}> = ({ item, index }) => {
  const props = useSpring({
    from: { transform: "scale(0.95)", opacity: 0 },
    to: { transform: "scale(1)", opacity: 1 },
    delay: (typeof index === "string" ? parseInt(index) : index) * 200,
  });
  return (
    <animated.div style={props} className="school-card">
      <div className="card-title">{item.subject}</div>
      <div className="card-message">{item.message}</div>
      <div className="author">{`${timeSince(item.timeStamp)}`}</div>
    </animated.div>
  );
};

export default Tab1;
