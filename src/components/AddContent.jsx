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
  Button,
} from "@shopify/polaris";
import Switch from "react-switch";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ReactFlagsSelect from "react-flags-select";
import "./main.css";
import axios from "axios";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../App";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { addMetafieldData } from "../function/allFunction";
const editorOptions = {
  imageUrlInput: false,
  buttonList: [
    ["undo", "redo"],
    ["font", "fontSize", "formatBlock"],
    ["bold", "underline", "italic", "strike", "subscript", "superscript"],
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
  const navigate = useNavigate();
  const Location = useLocation();
  // console.log("asdfghfefgegdefdegdgdsgdfgbdgdgdfdfgdsgdg    :", );

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
  const [loadingFlag, setloadingFlag] = useState(false);
  const [storeName, setStoreName] = useState(
    Location.state ? Location.state.Name : ""
  );
  const [option, setOption] = useState(
    Location.state
      ? Location.state.Display === "Header"
        ? "0"
        : Location.state.Display === "Footer"
        ? "1"
        : "2"
      : "10"
  );
  const [country, setCountry] = useState(
    Location.state ? Location.state.Country : null
  );
  const [content, setContent] = useState({
    contents: Location.state ? Location.state.Content : "",
    getValue: "",
  });
  const [switchFlag, setSwitchFlag] = useState(
    Location.state ? (Location.state.Country ? false : true) : false
  );
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
    if (option === "Select display content" || option === "10") {
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
      option !== "10" &&
      ((!switchFlag && country !== null) || switchFlag) &&
      (content.getValue !== "" || content.getValue !== "<p><br></p>")
    );
  };

  const myfunction = () => {
    console.log(content);
    document.getElementById("panthil").innerHTML = content.getValue;
  };
  const saveContent = async () => {
    setloadingFlag(true);
    // myfunction();
    validationContent();
    if (errorValidtion()) {
      console.log("form validation is true");
      const info = {
        name: storeName,
        option: parseInt(option),
        cFlag: switchFlag,
        country_code: country,
        backgroundcolor: "",
        content: content.getValue,
      };
      // console.log("data : ", data);
      const response = await addMetafieldData(app, info);
      console.log("res", response);
      setloadingFlag(false);
      navigate("/");
      //  return Promise.resolve(response);
    }
  };
  const onclickSaveMethod = () => {
    saveContent;
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
        {/* <Button
          primary
          onClick={() => {
            window.location.replace("/");
          }}
        >
          ADD CONTENT
        </Button> */}
        {/* <Link to="/" className="text_decoration"> */}
        <PageActions
          primaryAction={{
            // url: completed ? "/" : "",
            content: "Save",
            loading: loadingFlag,
            onAction: saveContent,
          }}
        />
        {/* </Link> */}
      </Page>
    </AppProvider>
  );
};

export default AddContent;
