import React, { useContext, useEffect, ReactComponentElement } from "react";
import { IonContent, IonPage, IonIcon } from "@ionic/react";
import "./Tab.css";
import { home, search, filter } from "ionicons/icons";
import { GlobalStateContext } from "../context/GlobalStateContext";
import Constant from "../Constant";
import { RouteComponentProps } from "react-router";
import { Announcement, ClassAnnouncement } from "../interface/TypeInterface";
import { useSpring, animated } from "react-spring";

const { timeSince } = Constant;

interface Props {
  history: RouteComponentProps;
}

const Tab1: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const classAnnouncements = useContext(GlobalStateContext)?.classAnnouncements;
  useEffect(() => {
    console.log(classAnnouncements?.length);
  }, [classAnnouncements]);
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
                <IonIcon icon={filter} />
                <IonIcon icon={search} />
              </div>
            </div>
          </div>
          <div className="body">
            <div className="announcement-list">
              {classAnnouncements?.map(
                (announcemnent: ClassAnnouncement, index: number) => (
                  // <div className="school-card" key={""}>
                  //   <div className="card-title">{""}</div>
                  //   <div className="card-message">{"announcemnent.message"}</div>
                  //   <div className="author">{timeSince(0)}</div>
                  // </div>
                  <AnnouncementCard
                    announcement={announcemnent}
                    key={announcemnent.id}
                    delay={index}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

const AnnouncementCard: React.FC<{
  announcement: ClassAnnouncement;
  delay: number;
}> = ({ announcement, delay }) => {
  const props = useSpring({
    from: { transform: "scale(0.95)", opacity: 0 },
    to: { transform: "scale(1)", opacity: 1 },
    delay: delay * 200,
  });
  return (
    <animated.div style={props} className="school-card">
      <div className="card-title">{announcement.subject}</div>
      <div className="card-message">{announcement.message}</div>
      <div className="author">{`${timeSince(announcement.timeStamp)}`}</div>
    </animated.div>
  );
};

export default Tab1;
