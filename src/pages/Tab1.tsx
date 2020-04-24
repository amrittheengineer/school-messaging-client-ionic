import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab1.css";
import { home, search, filter } from "ionicons/icons";

const Tab1: React.FC = () => {
  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader> */}
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
              <div className="school-card">
                <div className="card-title">Science</div>
                <div className="card-message">
                  Tomorrow you have a test on Quantum Physics
                </div>
                <div className="author">2 hrs ago</div>
              </div>
              <div className="school-card">
                <div className="card-title">Science</div>
                <div className="card-message">
                  Tomorrow you have a test on Quantum Physics Tomorrow you have
                  a test on Quantum Physics Tomorrow you have a test on Quantum
                  Physics Tomorrow you have a test on Quantum Physics Tomorrow
                  you have a test on Quantum Physics
                </div>
                <div className="author">2 hrs ago</div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
