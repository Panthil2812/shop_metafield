import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { DeleteMajor, EditMajor, ViewMajor } from "@shopify/polaris-icons";
import "./main.css";
import Countries from "../function/countries";
import {
  Card,
  Spinner,
  Page,
  Layout,
  Modal,
  TextContainer,
  Stack,
  Button,
  Frame,
  Heading,
  EmptyState,
  Filters,
  Toast,
  ResourceItem,
  Icon,
  ResourceList,
  Banner,
  TextField,
  TextStyle,
  Pagination,
} from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  Get_All_Shop_Metafields,
  Del_Country_Metafield,
} from "../function/allFunction";
const Dashboard = (props) => {
  const navigate = useNavigate();
  const Location = useLocation();
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
  });
  const [pagePerData, setPagePerData] = useState(10);
  const [toastFlag, settoastFlag] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [getLoader, setGetLoader] = useState(true);

  const toggleToastFlag = () => {
    settoastFlag((toastFlag) => !toastFlag);
  };
  const toastMarkup = toastFlag ? (
    <Toast content={toastMessage} onDismiss={toggleToastFlag} duration={2000} />
  ) : null;

  const resourceName = {
    singular: "Country Content",
    plural: "Country Content",
  };
  const enableThemeAppExtension = () => {
    const URL = `https://${window.shop}/admin/themes/current/editor?context=apps&activateAppId03c5b64c-6fb7-4d66-9436-f69cf5a4546c/floating-embed`;
    window.open(URL, "_blank");
  };
  useEffect(async () => {
    const response = await Get_All_Shop_Metafields(app);
    if (response) {
      setDisplayData(response);
      setTotalPage(Math.ceil(response.length / pagePerData));
      setItem(response);
    }
    setGetLoader(false);
    if (Location?.state) {
      setToastMessage(
        Location.state.page ? "Successfully Edited" : "Successfully Added"
      );
      settoastFlag(true);
      Location.state = null;
    }
    setMloadingFlag(false);
    setPage(1);
  }, [deleteActive]);

  useEffect(async () => {
    if (totalPage > page) {
      setHasPage({ ...hasPage, next: true });
    }
    let startIndex = (page - 1) * pagePerData;
    let endIndex = (page - 1) * pagePerData + pagePerData;
    // console.log("DATA : ", item);
    // console.log("page :", startIndex, endIndex);
    setcurrentpageDate(item?.slice(startIndex, endIndex));
  }, [page, item]);

  useEffect(async () => {
    const temp = displayData.filter(
      (e) =>
        e.Name?.toLowerCase().includes(queryValue?.toLowerCase()) ||
        e.fullCountry?.toLowerCase().includes(queryValue?.toLowerCase())
    );
    setItem(temp);
    setPage(1);
    setTotalPage(temp.length / pagePerData);
  }, [queryValue]);
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
        // console.log("total page : ", totalPage);

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
    window.open("https://" + window.shop + "?c_code=" + country, "_blank");
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
              try {
                setloadingFlag(true);
                const res = await Del_Country_Metafield(app, actionData);

                setloadingFlag(false);
                setDeleteActive(false);
                setPage(1);
                setQueryValue("");
                setToastMessage("Successfully Deleted");
                settoastFlag(true);
              } catch (error) {}
            },
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
              <p>Are you sure you want to delete this dynamic content?</p>
            </TextContainer>
          </Modal.Section>
        </Modal>
      </div>
    );
  };
  const items = currentpageData;
  return (
    <Frame>
      <Page>
        <Layout>
          <Layout.Section>
            <Banner
              title='Click on "Manage Widget" To Enable/Disable The App'
              action={{
                content: "Manage Widget",
                onAction: () => {
                  enableThemeAppExtension();
                },
              }}
              secondaryAction={{
                content: "More Info",
                onAction: () => {
                  props.handleTabChange(1);
                },
              }}
              // secondaryAction={{ content: 'Learn more' }}
              status="info"
            ></Banner>
          </Layout.Section>
          <Layout.Section>
            <div className="addcontentbutton">
              <Link to="/addcontent" className="text_decoration">
                <Button primary>Add Content</Button>
              </Link>
            </div>
          </Layout.Section>
          <Layout.Section>
            {getLoader ? (
              <div className="loading">
                <Spinner />
              </div>
            ) : (
              <Card>
                {displayData.length === 0 ? (
                  <>
                    <EmptyState
                      heading="Manage your dynamic content country wise"
                      action={{
                        content: "Add Content",
                        onAction: () => {
                          navigate("/addcontent");
                        },
                      }}
                      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                    >
                      <p>
                        Click on "Add Content" button to create your first
                        dynamic content
                      </p>
                    </EmptyState>
                  </>
                ) : (
                  <>
                    <ResourceList
                      resourceName={resourceName}
                      items={items}
                      renderItem={renderItem}
                      filterControl={filterControl}
                      // showHeader={true}
                      // loading={mloadingFlag}
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
                  </>
                )}
              </Card>
            )}
          </Layout.Section>
          {deleteModel()}
        </Layout>
        {toastMarkup}
      </Page>
    </Frame>
  );
  function renderItem(item, _, index) {
    const {
      id,
      Name,
      Country,
      fullCountry,
      Display,
      Content,
      metafield_key,
      BackgroundColor,
    } = item;

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
              <div className="header_text">{fullCountry}</div>
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
                    handleRirectAndShowContent(country_code);
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
                      metafield_key: metafield_key,
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
