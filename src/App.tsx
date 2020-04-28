import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import { useHistory } from "react-router";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { home, image, chatbubbleEllipses } from "ionicons/icons";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { GlobalStateContextProvider } from "./context/GlobalStateContext";
import { GalleryContextProvider } from "./context/GalleryContext";
import Album from "./pages/Album";
import { Plugins } from "@capacitor/core";

const Application = Plugins.App;
const Toast = Plugins.Toast;

const App: React.FC = () => {
  useEffect(() => {
    Application.addListener("backButton", (event) => {
      Application.exitApp();
    });

    return () => {
      Application.removeAllListeners();
    };
  }, []);

  const [currentTab, setCurrentTab] = useState<string>("");

  return (
    <GlobalStateContextProvider>
      <GalleryContextProvider>
        <IonApp>
          <IonReactRouter>
            <IonTabs
              onIonTabsDidChange={(event) => {
                setCurrentTab(event.detail.tab);
              }}
            >
              <IonRouterOutlet>
                <Route path="/tab1" component={Tab1} exact={true} />
                <Route path="/tab2" component={Tab2} exact={true} />
                <Route path="/gallery" component={Tab3} />
                <Route path="/album/:id" component={Album} exact={true} />
                <Route
                  path="/"
                  render={() => <Redirect to="/tab1" />}
                  exact={true}
                />
              </IonRouterOutlet>
              <IonTabBar slot="bottom">
                <IonTabButton
                  disabled={currentTab === "tab1"}
                  tab="tab1"
                  href="/tab1"
                >
                  <IonIcon icon={home} />
                  <IonLabel>Announcements</IonLabel>
                </IonTabButton>
                <IonTabButton
                  disabled={currentTab === "tab2"}
                  tab="tab2"
                  href="/tab2"
                >
                  <IonIcon icon={chatbubbleEllipses} />
                  <IonLabel>Posts</IonLabel>
                </IonTabButton>
                <IonTabButton
                  disabled={currentTab === "gallery"}
                  tab="gallery"
                  href="/gallery"
                >
                  <IonIcon icon={image} />
                  <IonLabel>Gallery</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
        </IonApp>
      </GalleryContextProvider>
    </GlobalStateContextProvider>
  );
};

export default App;
