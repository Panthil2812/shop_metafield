import React, { useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DeleteMajor, EditMajor, ViewMajor } from "@shopify/polaris-icons";
import ReactFlagsSelect from "react-flags-select";
import { getallMetaField } from "../function/allFunction";
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
  Pagination,
} from "@shopify/polaris";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";

const Dashboard = () => {
  const [displayData, setDisplayData] = useState();
  const app = useAppBridge();
  const [appOption, setAppOption] = useState(true);
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
  useEffect(async () => {
    const response = await getallMetaField(app);
    console.log("response ", JSON.parse(response));
  }, []);
  const items = [
    {
      id: 101,
      Url: "customers/341",
      Name: "Mae Jemison",
      Country: <h1 style={{ fontSize: "20px" }}>customers/341</h1>,
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
      Content:
        "HTML text editor HTML text editor HTML text editor HTML text editor HTML text editor HTML text editor HTML text editor HTML text editor",
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

  const handleRirectAndShowContent = () => {
    window.open("https://" + window.shop, "_blank");
    // redirectPoint.document.write("<div>Panthil</div>");
  };
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
            <br />
            <div className="pagination">
              <Pagination
                hasPrevious
                onPrevious={() => {
                  console.log("Previous");
                }}
                hasNext
                onNext={() => {
                  console.log("Next");
                }}
              />
              <br />
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
  function renderItem(item, _, index) {
    const { id, Name, Country, Display, Content } = item;

    const firstItem =
      items && Array.isArray(items) && items.length && items.length !== 0
        ? items[0]
        : "";

    return (
      <>
        {(firstItem === item || firstItem === "") && (
          <div className="custome_header">
            <div className="header_text">
              <TextStyle variation="strong">Name</TextStyle>
            </div>
            <div className="header_text">
              <TextStyle variation="strong">Country</TextStyle>
            </div>
            <div className="header_text">
              <TextStyle variation="strong">Displayed At</TextStyle>
            </div>
            <div>
              <TextStyle variation="strong">Action</TextStyle>
            </div>
          </div>
        )}

        <ResourceItem id={id} sortOrder={index}>
          <>
            <div className="dynamic-details">
              {/* <div>{index + 1}</div> */}
              <div className="header_text">{Name}</div>
              <div className="header_text">{Country}</div>
              <div className="header_text">{Display}</div>
              <div className="flex_sb">
                <div
                  onClick={() => {
                    alert("EditMajor");
                  }}
                >
                  <Icon source={EditMajor} color="primary" />
                </div>
                <div onClick={handleRirectAndShowContent}>
                  <Icon source={ViewMajor} color="warning" />
                </div>
                <div
                  onClick={() => {
                    alert("DeleteMajor");
                  }}
                >
                  <Icon source={DeleteMajor} color="critical" />
                </div>
              </div>
            </div>
          </>
        </ResourceItem>
      </>
    );
  }
};
export default Dashboard;
