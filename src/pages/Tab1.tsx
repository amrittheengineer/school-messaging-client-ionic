import React, { useContext, useEffect } from "react";
import { IonContent, IonPage, IonIcon, IonRefresher, IonRefresherContent, isPlatform } from "@ionic/react";
import "./Tab.css";
import { home, search, filter } from "ionicons/icons";
import { GlobalStateContext } from "../context/GlobalStateContext";
import Constant from "../Constant";
import { RouteComponentProps } from "react-router";
import { ClassAnnouncement, Announcement } from "../interface/TypeInterface";
import { useSpring, animated } from "react-spring";
import { EmptyComponent, Loading } from "../components/EmptyComponent";
import { AppMinimize } from '@ionic-native/app-minimize';
import { Plugins } from "@capacitor/core";


import FlatList from "flatlist-react";
const { timeSince } = Constant;

const Tab1: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  useEffect(() => {
    Plugins.App.addListener("backButton", () => {
      if (isPlatform("android")) {
        AppMinimize.minimize();
      }
    });
    // Application.requestPermissions ? Application.requestPermissions().then()
    // console.log(action)
    // return () => {
    //   Plugins.App.removeAllListeners();
    // };
  }, []);
  const { classAnnouncements, refreshClassAnnouncements, loadMoreClassAnnouncements, hasMoreClassAnnouncements, classAnnouncementsLoading } = useContext(GlobalStateContext)!;
  return (
    <IonPage >
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={(event) => {
          refreshClassAnnouncements();
          event.detail.complete();
        }}

        >
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <div className="page-container">
          <div className="header">
            <div className="tab-name-container">
              <div className="icon">
                <IonIcon icon={home} />
              </div>
              <div className="title">Announcements</div>
              <div className="actions">
              </div>
            </div>
          </div>
          <div className="body">
            <div className="announcement-list">
              <FlatList
                list={classAnnouncements ? classAnnouncements : []}
                renderItem={(announcemnent: ClassAnnouncement, index: number) => (
                  <AnnouncementCard
                    item={announcemnent}
                    key={index}
                    index={index}
                  />
                )}
                hasMoreItems={hasMoreClassAnnouncements}
                paginationLoadingIndicator={<Loading />}
                paginationLoadingIndicatorPosition="center"
                loadMoreItems={() => loadMoreClassAnnouncements()}
                renderWhenEmpty={() => {
                  if (classAnnouncementsLoading) return <Loading />;
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
    <div className="school-card">
      <div className="card-title">{item.subject}</div>
      <div className="card-message">{item.message}</div>
      <div className="author">{`${timeSince(item.timeStamp)}`}</div>
    </div>
  );
};

export default Tab1;
