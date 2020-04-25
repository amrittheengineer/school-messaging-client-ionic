import React from "react";
import { IonContent, IonIcon, IonPage } from "@ionic/react";
import "./Tab.css";
import { image, filter, search } from "ionicons/icons";

const Tab3: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <div className="page-container">
          <div className="header">
            <div className="tab-name-container">
              <div className="icon">
                <IonIcon icon={image} />
              </div>
              <div className="title">Gallery</div>
              <div className="actions">
                <IonIcon icon={filter} />
                <IonIcon icon={search} />
              </div>
            </div>
          </div>
          <div className="body">
            <div className="album-list">
              {/* Single Album card */}
              <div className="album-card">
                <div className="card-title">Science</div>
                <div className="card-message">
                  Tomorrow you have a test on Quantum Physics
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

export default Tab3;
