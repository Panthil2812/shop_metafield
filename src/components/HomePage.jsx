import React, { useCallback, useState } from "react";
import { Tabs, Page } from "@shopify/polaris";
// import { Dashboard } from "./Dashboard";
import Support from "./Support";
import Dashboard from "./Dashboard";
const HomePage = () => {
  const [selected, setSelected] = useState(0);

  const handleTabChange = (selectedTabIndex) => {
    setSelected(selectedTabIndex);
  };

  const tabs = [
    {
      id: 0,
      content: "Dashboard",
      accessibilityLabel: "All Dashboard",
      panelID: "all-dashboard-fitted-content-2",
    },
    {
      id: 1,
      content: "Support",
      panelID: "accepts-support-fitted-Ccontent-2",
    },
    // {
    //   id: 2,
    //   content: "Public Review",
    //   panelID: "accepts-publicreview-fitted-Ccontent-2",
    // },
  ];
  const tabFunction = (tab) => {
    if (tab === 0) {
      return <Dashboard handleTabChange={handleTabChange} />;
    } else if (tab === 1) {
      return <Support />;
    }
  };
  return (
    <>
      <Page>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted>
          {/* <Card.Section>{tabFunction(tabs[selected].id)}</Card.Section> */}
        </Tabs>
        {tabFunction(selected)}
      </Page>
    </>
  );
};
export default HomePage;
