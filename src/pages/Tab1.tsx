import React, { useContext, useEffect } from "react";
import { IonContent, IonPage, IonIcon } from "@ionic/react";
import "./Tab.css";
import { home, search, filter } from "ionicons/icons";
import { GlobalStateContext } from "../context/GlobalStateContext";
import Constant from "../Constant";
import { RouteComponentProps } from "react-router";
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
              {classAnnouncements?.map((announcemnent) => (
                <div
                  className="school-card"
                  key={announcemnent.id}
                  onClick={() => props.history.push("/newpage")}
                >
                  <div className="card-title">{announcemnent.subject}</div>
                  <div className="card-message">{announcemnent.message}</div>
                  <div className="author">
                    {timeSince(announcemnent.timeStamp)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
