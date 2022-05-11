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
    { label: "Select display content", value: "0" },
    { label: "Header", value: "1" },
    { label: "Footer", value: "2" },
    { label: "Product page", value: "3" },
  ];
  const [storeName, setStoreName] = useState("");
  const [option, setOption] = useState("Select display content");
  const [selected, setSelected] = useState(null);
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
      if (selected === null) {
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
      ((!switchFlag && selected !== null) || switchFlag) &&
      (content.getValue !== "" || content.getValue !== "<p><br></p>")
    );
  };
  const fetchMetafield = async (app) => {
    const token = await getSessionToken(app);
    axios
      .post(
        "/create-metafield-shop",
        { data: "panthil" },
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
  React.useEffect(() => {}, [errorMessage]);
  const myfunction = () => {
    console.log(content);
    document.getElementById("panthil").innerHTML = content.getValue;
  };
  const saveContent = async () => {
    // myfunction();
    validationContent();
    if (errorValidtion()) {
      console.log("form validation is true");
      fetchMetafield(app);
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
                    setSelected(null);
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
                selected={selected}
                onSelect={(code) => {
                  // console.log(code);

                  setSelected(code);
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
