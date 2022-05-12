import React, { useCallback, useState } from "react";
import {
  AppProvider,
  Page,
  Card,
  Select,
  FormLayout,
  TextField,
  PageActions,
  InlineError,
  Stack,
} from "@shopify/polaris";
import Switch from "react-switch";
import "react-quill/dist/quill.snow.css"; // ES6
import { Link } from "react-router-dom";
import ReactFlagsSelect from "react-flags-select";
import "./main.css";
import axios from "axios";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { gql, useMutation } from "@apollo/client";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { userLoggedInFetch } from "../App";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
const editorOptions = {
  imageUrlInput: false,
  buttonList: [
    ["undo", "redo"],
    ["font", "fontSize", "formatBlock"],
    [
      "paragraphStyle",
      "bold",
      "underline",
      "italic",
      "strike",
      "subscript",
      "superscript",
    ],
    ["fontColor", "hiliteColor", "textStyle"],
    ["removeFormat"],
    // '/', // Line break
    ["outdent", "indent"],
    ["align", "list", "lineHeight"],
    ["link"],
    ["fullScreen", "showBlocks", "codeView"],
  ],
};

const AddContent = () => {
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  const CustomLinkComponent = ({ children, url, ...rest }) => {
    return (
      <Link to={url} {...rest}>
        {children}
      </Link>
    );
  };
  const options = [
    { label: "Select display content", value: "10" },
    { label: "Header", value: "0" },
    { label: "Footer", value: "1" },
    { label: "Product page", value: "2" },
  ];
  const [storeName, setStoreName] = useState("");
  const [option, setOption] = useState("Select display content");
  const [country, setCountry] = useState(null);
  const [content, setContent] = useState({
    contents: "",
    getValue: "",
  });
  const [switchFlag, setSwitchFlag] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    store: false,
    option: false,
    country: false,
    content: false,
  });
  const validationContent = () => {
    // console.log("validationContent");

    if (storeName === "") {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        store: true,
      }));
    } else {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        store: false,
      }));
    }
    if (option === "Select display content") {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        option: true,
      }));
    } else {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        option: false,
      }));
    }
    if (!switchFlag) {
      if (country === null) {
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          country: true,
        }));
      } else {
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          country: false,
        }));
      }
    } else {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        country: false,
      }));
    }
    if (content.getValue === "" || content.getValue === "<p><br></p>") {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        content: true,
      }));
    } else {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        content: false,
      }));
    }
    // console.log("end");
    // return errorDisplayCheck();
  };
  const errorValidtion = () => {
    return (
      storeName !== "" &&
      option !== "Select display content" &&
      ((!switchFlag && country !== null) || switchFlag) &&
      (content.getValue !== "" || content.getValue !== "<p><br></p>")
    );
  };
  const createMetaField = async (app, info) => {
    const token = await getSessionToken(app);
    let defaultData = new Array(3).fill(null);
    let cArray = new Array(3).fill(null);
    let cJson = {};
    let c_content;
    if (info.cFlag) {
      //default
      c_content = cJson;
      defaultData[parseInt(info.option)] = [info.content, info.backgroundcolor];
    } else {
      //using country
      cArray[parseInt(info.option)] = [info.content, info.backgroundcolor];
      cJson[info.country_code] = cArray;
      // cJson[backgroundcolor] = info.backgroundcolor;
      c_content = cJson;
    }
    console.log("country array : ", cArray);
    console.log("country content JSON : ", c_content);

    const reqValue = {
      store_name: info.store_name,
      country_content: c_content,
      default: defaultData,
    };
    console.log("Final JSON Data: ", reqValue);

    await axios
      .post(
        "/create-metafield-shop",
        {
          value: reqValue,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        console.log("ufibvfvud");
        console.log(
          "res.................................................",
          res
        );
      })

      .catch((err) => {
        console.log("error", err);
      });
  };
  const updateMetaField = async (app, data, info) => {};
  const addMetafieldData = async (app, info) => {
    const token = await getSessionToken(app);
    axios
      .get("/get-metafield", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        const data = res.data.body.metafields;
        console.log("data : ", data.length);
        if (data.length === 0) {
          //not any metafield
          console.log("create metafield ..");
          createMetaField(app, info);
        } else {
          console.log("Update metafield ... ");
          updateMetaField(app, data, info);
          console.log("STRING Data :", data);
          // console.log("sdvuiozgbyuvrguqcnse uivn eugbyuksvbgnscbukv");
          // console.log(
          //   "JSON  Data :",
          //   JSON.parse(data[0].value).country_content
          // );
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };
  const myfunction = () => {
    console.log(content);
    document.getElementById("panthil").innerHTML = content.getValue;
  };
  const saveContent = async () => {
    myfunction();
    validationContent();
    if (errorValidtion()) {
      console.log("form validation is true");
      const info = {
        store_name: storeName,
        option: option,
        cFlag: switchFlag,
        country_code: country,
        backgroundcolor: "",
        content: content.getValue,
      };
      // console.log("data : ", data);
      addMetafieldData(app, info);
    }
  };
  return (
    <AppProvider
      linkComponent={CustomLinkComponent}
      i18n={{
        Polaris: {
          Page: {
            Header: {
              rollupButton: "Actions",
            },
          },
        },
      }}
    >
      <Page
        breadcrumbs={[{ content: "Products", url: "/" }]}
        title="Add New Country Content"
      >
        <Card sectioned>
          <FormLayout>
            <TextField
              label="Store name"
              value={storeName}
              onChange={(value) => {
                setStoreName(value);
              }}
              autoComplete="off"
            />
            <InlineError
              message={errorMessage.store ? "Store name is required" : ""}
              fieldID="myFieldID"
            />
            <Select
              options={options}
              onChange={(value) => {
                setOption(value);
                // console.log(value);
              }}
              value={option}
            />
            <InlineError
              message={errorMessage.option ? "Select Option is required" : ""}
              fieldID="myFieldID"
            />
            <div className="flex">
              <div className="react-country-switch">
                <p>Default Country</p>
                <Switch
                  onChange={(nextChecked) => {
                    setCountry(null);
                    setSwitchFlag(nextChecked);
                  }}
                  checked={switchFlag}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  className="react-switch"
                />
              </div>
              <ReactFlagsSelect
                // placeholder="Write something awesome"
                selected={country}
                onSelect={(code) => {
                  // console.log(code);

                  setCountry(code);
                }}
                disabled={switchFlag}
                selectedSize={12}
                className="react-flages-select"
              />
            </div>
            <InlineError
              message={errorMessage.country ? "Select Country is required" : ""}
              fieldID="myFieldID"
            />
          </FormLayout>
          <div className="text-editor">
            {/* <Editor contents={content.contents} getValue={content.getValue} /> */}
            <SunEditor
              // ref={refContainer}
              name="my-editor"
              enableToolbar={true}
              showToolbar={true}
              placeholder="Email body content here..."
              setOptions={editorOptions}
              // appendContents={contents}
              setContents={content.contents}
              height={220}
              onChange={(value) => {
                console.log(value);
                setContent((content) => ({
                  ...content,
                  getValue: value,
                }));
              }}
            />
          </div>
          <div id="panthil"></div>
          <InlineError
            message={errorMessage.content ? "Content is required" : ""}
            fieldID="myFieldID"
          />
        </Card>
        <PageActions
          primaryAction={{
            content: "Save",
            onAction: saveContent,
          }}
        />
      </Page>
    </AppProvider>
  );
};

export default AddContent;
