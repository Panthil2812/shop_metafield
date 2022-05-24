import React, { useCallback, useState } from "react";
import {
  AppProvider,
  Page,
  Card,
  hsbToHex,
  Select,
  Frame,
  FormLayout,
  Toast,
  TextField,
  PageActions,
  InlineError,
  Stack,
  Popover,
  Button,
  rgbToHsb,
  ColorPicker,
} from "@shopify/polaris";
import Toggle from "react-toggle";
import hexRgb from "hex-rgb";
import "react-toggle/style.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ReactFlagsSelect from "react-flags-select";
import "./main.css";
import { useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../App";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { Add_Content_Metafield } from "../function/allFunction";
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
    // { label: "Select display content", value: "10" },
    { label: "Header", value: "0" },
    { label: "Footer", value: "1" },
    { label: "Product page", value: "2" },
  ];
  const [color, setColor] = useState(
    Location.state
      ? rgbToHsb(hexRgb(Location?.state?.BackgroundColor))
      : {
          hue: 1,
          brightness: 1,
          saturation: 0,
        }
  );
  // rgbToHsb(hexRgb(Location?.state?.BackgroundColor))
  // console.log("color: ", hsbToHex(color));
  const [showPicker, setShowPicker] = useState(false);
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
      : ""
  );
  const [country, setCountry] = useState(
    Location.state ? Location.state.Country : null
  );
  const [content, setContent] = useState({
    contents: Location.state ? Location.state.Content : "",
    getValue: "",
  });
  const [switchFlag, setSwitchFlag] = useState(
    Location.state
      ? Location.state.Country != "Default"
        ? false
        : true
      : false
  );
  const [errorMessage, setErrorMessage] = useState({
    store: false,
    option: false,
    country: false,
    content: false,
  });
  const activator = (
    <Button
      onClick={() => {
        setShowPicker(!showPicker);
      }}
      disclosure
    >
      <div className="color-picker-btn">
        <div className="color-showbx" style={{ background: hsbToHex(color) }} />
        <p>{hsbToHex(color)}</p>
      </div>
    </Button>
  );
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
      !errorMessage.store &&
      !errorMessage.option &&
      !errorMessage.country &&
      !errorMessage.content
    );
  };
  const myfunction = () => {
    // console.log(content);
    document.getElementById("panthil").innerHTML = content.getValue;
  };
  const saveContent = async () => {
    setloadingFlag(true);
    // myfunction();
    validationContent();
    if (errorValidtion()) {
      // console.log("form validation is true");
      const info = {
        name: storeName,
        option: parseInt(option),
        country_code: switchFlag ? "Default" : country,
        backgroundcolor: hsbToHex(color),
        content: content.getValue.replaceAll('"', "'"),
      };
      // console.log(info);
      let response = await Add_Content_Metafield(app, info);
      const pageFlag = Location.state ? 1 : 0;
      navigate("/", {
        state: { page: pageFlag },
      });
    }
    setloadingFlag(false);
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
        primaryAction={{
          content: "Save",
          loading: loadingFlag,
          onAction: saveContent,
        }}
      >
        <div className="mb">
          <Card sectioned>
            <FormLayout>
              <div className="form-label">
                <p>Name</p>
                <TextField
                  value={storeName}
                  onChange={(value) => {
                    setStoreName(value);
                  }}
                  autoComplete="off"
                />
                <InlineError
                  message={errorMessage.store ? "Name is required" : ""}
                  fieldID="myFieldID"
                />
              </div>

              <div className="second-form-container">
                <div className="select-container">
                  <p>Display Content</p>
                  <Select
                    options={options}
                    placeholder={"Select display content"}
                    onChange={(value) => {
                      setOption(value);
                      // console.log(value);
                    }}
                    value={option}
                  />
                </div>
                <div className="color-picker">
                  <p>Background Color</p>
                  <Popover
                    active={showPicker}
                    autofocusTarget="first-node"
                    activator={activator}
                    onClose={() => {
                      setShowPicker(false);
                    }}
                  >
                    <ColorPicker onChange={setColor} color={color} />
                  </Popover>
                </div>
              </div>
              <InlineError
                message={errorMessage.option ? "Select Option is required" : ""}
                fieldID="myFieldID"
              />
              <div className="flex">
                <div className="react-country-switch">
                  <p>Default Country</p>
                  <Toggle
                    onChange={(e) => {
                      setCountry(null);
                      setSwitchFlag(e.target.checked);
                      // console.log("nextChecked : ", e.target.checked);
                    }}
                    checked={switchFlag}
                    icons={false}
                    className="react-switch"
                  />
                </div>
                <ReactFlagsSelect
                  // placeholder="Write something awesome"
                  selected={country}
                  searchable={true}
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
                message={
                  errorMessage.country ? "Select Country is required" : ""
                }
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
                  // console.log(value);
                  setContent((content) => ({
                    ...content,
                    getValue: value,
                  }));
                }}
              />
            </div>
            <div
              id="panthil"
              style={{
                backgroundColor: hsbToHex(color),
              }}
            ></div>
            <InlineError
              message={errorMessage.content ? "Content is required" : ""}
              fieldID="myFieldID"
            />
          </Card>
        </div>
        {/* <PageActions
          primaryAction={{
            content: "Save",
            loading: loadingFlag,
            onAction: saveContent,
          }}
        /> */}
      </Page>
    </AppProvider>
  );
};

export default AddContent;
