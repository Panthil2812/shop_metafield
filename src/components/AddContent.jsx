import React, { useState } from "react";
import {
  AppProvider,
  Page,
  Card,
  hsbToHex,
  Select,
  FormLayout,
  TextField,
  InlineError,
  Popover,
  Button,
  rgbToHsb,
  ColorPicker,
} from "@shopify/polaris";
import Toggle from "react-toggle";
import hexRgb from "hex-rgb";
import "react-toggle/style.css";
import validation_form from "../function/validationForm.jsx";
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
    { label: "Products page", value: "2" },
  ];
  const [color, setColor] = useState(
    Location.state
      ? rgbToHsb(hexRgb(Location?.state?.BackgroundColor))
      : {
          hue: 0,
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
        : Location.state.Display === "Products page"
        ? "2"
        : ""
      : ""
  );
  const [country, setCountry] = useState(
    Location.state ? Location.state.Country : ""
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
  const [errorContent, setErrorContent] = useState(false);
  const [errorStore, setErrorStore] = useState(false);
  const [errorOption, setErrorOption] = useState(false);
  const [errorCountry, setErrorCountry] = useState(false);
  const [error, setError] = useState(false);
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
  const myfunction = () => {
    // console.log(content);
    document.getElementById("display_content").innerHTML = content.getValue;
  };
  const saveContent = async () => {
    setloadingFlag(true);
    const info = {
      name: storeName,
      option: option,
      switch: switchFlag,
      country_code: country,
      old_option: Location.state
        ? Location.state.Display === "Header"
          ? "0"
          : Location.state.Display === "Footer"
          ? "1"
          : Location.state.Display === "Products page"
          ? "2"
          : ""
        : "",
      old_country_code: Location.state ? Location.state.Country : "",
      backgroundcolor: hsbToHex(color),
      content: content.getValue.replaceAll('"', "'"),
    };
    const val_status = validation_form(info);
    setErrorStore(val_status[0]);
    setErrorOption(val_status[1]);
    setErrorCountry(val_status[2]);
    setErrorContent(val_status[3]);
    if (val_status[0] || val_status[1] || val_status[2] || val_status[3]) {
      // console.log("error");
    } else {
      // console.log("call api");
      info.country_code = switchFlag ? "Default" : country;
      info.option = parseInt(option);
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
                  message={errorStore ? "Name is required" : ""}
                  fieldID="myFieldID"
                />
              </div>

              <div className="second-form-container">
                <div className="select-container">
                  <p>Display Content At</p>
                  <Select
                    options={options}
                    placeholder={"Select display content"}
                    onChange={(value) => {
                      setOption(value);
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
                message={errorOption ? "Select Option is required" : ""}
                fieldID="myFieldID"
              />
              <div className="flex">
                <div className="react-country-switch">
                  <p>Default Country</p>
                  <Toggle
                    onChange={(e) => {
                      setCountry("");
                      setSwitchFlag(e.target.checked);
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
                message={errorCountry ? "Select Country is required" : ""}
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
                placeholder="Enter your dynamic content here"
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
              id="display_content"
              style={{
                backgroundColor: hsbToHex(color),
              }}
            ></div>
            <InlineError
              message={errorContent ? "Content is required" : ""}
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
