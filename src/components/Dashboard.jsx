import React, { useCallback, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DeleteMajor, EditMajor, ViewMajor } from "@shopify/polaris-icons";
import ReactFlagsSelect, { Ma } from "react-flags-select";
import { getallMetaField, deleteMetaField } from "../function/allFunction";
import "./main.css";
import Countries from "../function/countries";
import {
  Card,
  Page,
  Layout,
  Modal,
  TextContainer,
  Stack,
  Button,
  Heading,
  Filters,
  ResourceItem,
  Icon,
  ResourceList,
  Banner,
  TextField,
  TextStyle,
  Pagination,
} from "@shopify/polaris";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [displayData, setDisplayData] = useState([]);
  const app = useAppBridge();
  const [appOption, setAppOption] = useState(true);
  const appEDoption = () => {
    // alert(appOption);
    setAppOption(!appOption);
  };
  const [hasPage, setHasPage] = useState({
    next: false,
    prev: false,
  });
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const [item, setItem] = useState([]);
  const [currentpageData, setcurrentpageDate] = useState([]);
  const [loadingFlag, setloadingFlag] = useState(false);
  const [mloadingFlag, setMloadingFlag] = useState(true);
  const [deleteActive, setDeleteActive] = useState(false);
  const [queryValue, setQueryValue] = useState(null);
  const [actionData, setActionData] = useState({
    Name: "",
    Country: "",
    Display: "",
    Content: "",
    BackgroundColor: "",
  });
  const [pagePerData, setPagePerData] = useState(10);
  const resourceName = {
    singular: "Country Content",
    plural: "Country Content",
  };
  const formatterData = (info) => {
    const fData = [];
    if (info) {
      const d_data = info.default;
      d_data.map((data, index) => {
        if (data) {
          fData.push({
            id: (Math.random() + 1).toString(36).substring(7),
            Name: data[0],
            Country: "",
            fullCountry: "Default",
            Display: index ? (index === 1 ? "Footer" : "Products") : "Header",
            Content: data[1],
            BackgroundColor: data[2],
          });
        }
      });

      const c_data = info.country_content;
      Object.keys(c_data).map((key) => {
        c_data[key].map((data, index) => {
          if (data) {
            fData.push({
              id: (Math.random() + 1).toString(36).substring(7),
              Name: data[0],
              Country: key,
              fullCountry: Countries[key],
              Display: index ? (index === 1 ? "Footer" : "Products") : "Header",
              Content: data[1],
              BackgroundColor: data[2],
            });
          }
        });
      });
    }
    return fData;
  };
  const enableThemeAppExtension = () => {
    const URL = `https://${window.shop}/admin/themes/current/editor?context=apps&activateAppId03c5b64c-6fb7-4d66-9436-f69cf5a4546c/floating-embed`;
    window.open(URL, "_blank");
  };
  useEffect(async () => {
    const response = await getallMetaField(app);
    const info = formatterData(JSON.parse(response));
    setDisplayData(info);
    setTotalPage(Math.ceil(info.length / pagePerData));
    setItem(info);
    setMloadingFlag(false);
  }, [deleteActive]);

  useEffect(async () => {
    if (totalPage > page) {
      setHasPage({ ...hasPage, next: true });
    }
    let startIndex = (page - 1) * pagePerData;
    let endIndex = (page - 1) * pagePerData + pagePerData;
    console.log("page :", startIndex, endIndex);
    setcurrentpageDate(item.slice(startIndex, endIndex));
  }, [totalPage, page, item, deleteActive]);

  useEffect(async () => {
    const temp = displayData.filter(
      (e) =>
        e.Name.toLowerCase().includes(queryValue.toLowerCase()) ||
        e.fullCountry.toLowerCase().includes(queryValue.toLowerCase())
    );
    setItem(temp);
    setPage(1);
    // setTotalPage(temp.length / pagePerData);
  }, [queryValue, deleteActive]);
  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={[]}
      onQueryChange={setQueryValue}
      onQueryClear={() => {
        setQueryValue("");
      }}
      // onClearAll={handleClearAll}
    >
      {/* <div className="pl5">
        <Button primary onClick={() => {}}>
          Filter
        </Button>
      </div> */}
    </Filters>
  );
  const handleChangePage = (has) => {
    if (totalPage != 0) {
      if (has === 0) {
        //Previous
        const cs = page - 1;
        if (cs === 0) {
          setHasPage({ ...hasPage, prev: false });
        }
        if (cs === 1) {
          setHasPage({ ...hasPage, prev: false });
          setPage(1);
        } else {
          setHasPage({ ...hasPage, prev: true });
          setPage(cs);
        }
      } else {
        //Next
        console.log("total page : ", totalPage);
        const ca = page + 1;
        if (ca === totalPage) {
          setHasPage({ next: false, prev: true });
          setPage(totalPage);
        } else {
          setHasPage({ prev: true, next: true });
          setPage(ca);
        }
      }
    }
  };
  const handleRirectAndShowContent = (country) => {
    console.log("Country CODE :", country);
    window.open("https://" + window.shop, "_blank");
    redirectPoint.document.write("<div>Panthil</div>");
  };
  const deleteModel = () => {
    return (
      <div>
        <Modal
          instant
          open={deleteActive}
          onClose={() => {
            setDeleteActive(false);
          }}
          title="Confirmation"
          primaryAction={{
            content: "Delete",
            loading: loadingFlag,
            destructive: true,
            onAction: async () => {
              // if (actionData.Name) {
              setloadingFlag(true);
              const res = await deleteMetaField(app, actionData);
              setloadingFlag(false);
              setDeleteActive(false);
              setPage(1);
              setQueryValue("");
            },
            // },
          }}
          secondaryActions={[
            {
              content: "Close",
              onAction: () => {
                setDeleteActive(false);
              },
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <p>Are you sure you want to delete this content?</p>
            </TextContainer>
          </Modal.Section>
        </Modal>
      </div>
    );
  };
  const items = currentpageData;
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          {/* <Card sectioned>
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
          </Card> */}
          <Banner
            title='Click on "Manage Widget" To Enable/Disable The App'
            action={{
              content: "Manage Widget",
              onAction: () => {
                enableThemeAppExtension();
              },
            }}
            // secondaryAction={{ content: 'Learn more' }}
            status="info"
          ></Banner>
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
              loading={mloadingFlag}
            />
            <br />
            <div className="pagination">
              <Pagination
                label={page}
                hasPrevious={hasPage.prev}
                onPrevious={() => {
                  handleChangePage(0);
                }}
                hasNext={hasPage.next}
                onNext={() => {
                  handleChangePage(1);
                }}
              />
              <br />
            </div>
          </Card>
        </Layout.Section>
        {deleteModel()}
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
                <div
                  onClick={() => {
                    const country_code = Country ? Country : "Default";
                    // console.log("country : ", Country);
                    window.open(
                      "https://" + window.shop + "?c_code=" + country_code,
                      "_blank"
                    );
                    redirectPoint.document.write("<div>Panthil</div>");
                  }}
                >
                  <Icon source={ViewMajor} color="warning" />
                </div>
                <div
                  onClick={() => {
                    setActionData({
                      Country: Country,
                      Display:
                        Display === "Header" ? 0 : Display === "Footer" ? 1 : 2,
                      Content: Content,
                      BackgroundColor: BackgroundColor,
                    });
                    setDeleteActive(true);
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
