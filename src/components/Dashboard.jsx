import React, { useCallback, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DeleteMajor, EditMajor, ViewMajor } from "@shopify/polaris-icons";
import ReactFlagsSelect from "react-flags-select";
import { getallMetaField } from "../function/allFunction";
import "./main.css";
import Countries from "../function/countries";
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
  const navigate = useNavigate();
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
    singular: "Country Content",
    plural: "Country Content",
  };
  useEffect(async () => {
    const response = await getallMetaField(app);
    setDisplayData(JSON.parse(response));
    const jdata = JSON.parse(response);
    // console.log("response ", jdata.country_content, typeof jdata);
  }, []);

  const formatterData = () => {
    const fData = [];
    if (displayData) {
      // console.log("fdu");
      const d_data = displayData.default;
      d_data.map((data, index) => {
        if (data) {
          // console.log(key, data, index);
          fData.push({
            id: (Math.random() + 1).toString(36).substring(7),
            Name: data[0],
            Country: "",
            Display: index ? (index === 1 ? "Footer" : "Products") : "Header",
            Content: data[1],
            BackgroundColor: data[2],
          });
        }
      });

      const c_data = displayData.country_content;
      Object.keys(c_data).map((key) => {
        // console.log("key : ", key);

        // console.log("value : ", c_data[key]);
        c_data[key].map((data, index) => {
          if (data) {
            // console.log(key, data, index);
            fData.push({
              id: (Math.random() + 1).toString(36).substring(7),
              Name: data[0],
              Country: key,
              Display: index ? (index === 1 ? "Footer" : "Products") : "Header",
              Content: data[1],
              BackgroundColor: data[2],
            });
          }
        });
      });
      // displayData.map((data) => {
      //   console.log(data);
      // });
    }
    return fData;
  };
  const items = formatterData();

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
    const { id, Name, Country, Display, Content, BackgroundColor } = item;

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
              <div className="header_text">
                {Country ? Countries[Country] : "Default"}
              </div>
              <div className="header_text">{Display}</div>
              <div className="flex_sb">
                <div
                  onClick={() => {
                    // alert("EditMajor");
                    // console.log("name", Name);
                    // console.log("Country", Country);
                    // console.log("Display", Display);
                    // console.log("Content", Content);
                    // console.log(
                    //   "BackgroundColor",
                    //   BackgroundColor ? "true" : "false"
                    // );
                    navigate("/addcontent", {
                      state: {
                        Name: Name,
                        Country: Country,
                        Display: Display,
                        Content: Content,
                        BackgroundColor: BackgroundColor,
                      },
                    });
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
