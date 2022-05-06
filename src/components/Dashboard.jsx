import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { DeleteMajor, EditMajor, ViewMajor } from "@shopify/polaris-icons";
import ReactFlagsSelect from "react-flags-select";
import "./main.css";
import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Button,
  Heading,
  Avatar,
  Filters,
  ResourceItem,
  Icon,
  ResourceList,
  TextField,
  TextStyle,
} from "@shopify/polaris";

const Dashboard = () => {
  const [appOption, setAppOption] = React.useState(true);
  const appEDoption = () => {
    // alert(appOption);
    setAppOption(!appOption);
  };
  const [queryValue, setQueryValue] = useState(null);
  const [selected, setSelected] = useState("");

  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleClearAll = useCallback(() => {
    handleQueryValueRemove();
  }, [handleQueryValueRemove]);

  const resourceName = {
    singular: "customer",
    plural: "customers",
  };

  const items = [
    {
      id: 101,
      Url: "customers/341",
      Name: "Mae Jemison",
      Country: "China",
      Display: "Header",
      Content: "HTML text editor",
    },
    {
      id: 102,
      Url: "customers/341",
      Name: "James Mary",
      Country: "India",
      Display: "Product page",
      Content: "HTML text editor",
    },
    {
      id: 103,
      Url: "customers/341",
      Name: "John Linda",
      Country: "	United States",
      Display: "Header",
      Content: "HTML text editor",
    },
    {
      id: 104,
      Url: "customers/341",
      Name: "Daniel Lisa",
      Country: "	Indonesia",
      Display: "Product page",
      Content: "HTML text editor",
    },
    {
      id: 105,
      Url: "customers/341",
      Name: "Christopher Nancy",
      Country: "Bangladesh",
      Display: "Footer",
      Content: "HTML text editor",
    },
    {
      id: 106,
      Url: "customers/341",
      Name: "Anthony Margaret",
      Country: "Russia",
      Display: "Header",
      Content: "HTML text editor",
    },
    {
      id: 107,
      Url: "customers/341",
      Name: "George Amanda",
      Country: "Japan",
      Display: "Footer",
      Content: "HTML text editor",
    },
    {
      id: 108,
      Url: "customers/341",
      Name: "Amanda Deborah",
      Country: "Germany",
      Display: "Header",
      Content: "HTML text editor",
    },
    {
      id: 109,
      Url: "customers/341",
      Name: "Kenneth Sharon",
      Country: "United Kingdom",
      Display: "Footer",
      Content: "HTML text editor",
    },
    {
      id: 110,
      Url: "customers/341",
      Name: "Gary Shirley",
      Country: "South Africa",
      Display: "Product page",
      Content: "HTML text editor",
    },
  ];
  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={[]}
      onQueryChange={setQueryValue}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
    >
      <div className="pl5">
        <ReactFlagsSelect
          selected={selected}
          onSelect={(code) => setSelected(code)}
          selectedSize={12}
          fullWidth={false}
        />
      </div>
    </Filters>
  );
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <Stack.Item fill>
                <TextContainer spacing="loose">
                  <Heading>Nice work on building a Shopify app 🎉</Heading>
                </TextContainer>
              </Stack.Item>
              <Stack.Item>
                <Button primary onClick={appEDoption}>
                  {appOption ? "Enabled" : "Disabled"}
                </Button>
              </Stack.Item>
            </Stack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <div className="addcontentbutton">
            <Link to="/addcontent" className="text_decoration">
              <Button primary>ADD CONTENT</Button>
            </Link>
          </div>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <ResourceList
              resourceName={resourceName}
              items={items}
              renderItem={renderItem}
              filterControl={filterControl}
              // showHeader={true}
              loading={false}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
  function renderItem(item) {
    const { id, url, Name, Country, Display, Content } = item;
    const media = <Avatar customer size="medium" name={Name} />;

    return (
      <ResourceItem id={id}>
        <h3>
          <div className="flex_sb s16">
            <p>{Name}</p>
            <p>{Country}</p>
            <p>{Display}</p>
            <p>{Content}</p>
            <div className="flex_sb">
              <div
                className="m5"
                onClick={() => {
                  alert("EditMajor");
                }}
              >
                <Icon source={EditMajor} color="primary" />
              </div>
              <div
                className="m5"
                onClick={() => {
                  alert("ViewMajor");
                }}
              >
                <Icon source={ViewMajor} color="warning" />
              </div>
              <div
                className="m5"
                onClick={() => {
                  alert("DeleteMajor");
                }}
              >
                <Icon source={DeleteMajor} color="critical" />
              </div>
            </div>
            {/* <div>{location}</div> */}
          </div>
        </h3>
      </ResourceItem>
    );
  }
};
export default Dashboard;
