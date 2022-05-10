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

import { Link } from "react-router-dom";
import ReactFlagsSelect from "react-flags-select";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import "react-quill/dist/quill.snow.css";
import "./main.css";
const AddContent = () => {
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
  const [content, setContent] = useState("");
  const [switchFlag, setSwitchFlag] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    store: "",
    option: "",
    country: "",
    content: "",
  });
  const validationContent = () => {
    if (storeName === "") {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        store: "Store name is required",
      }));
    } else {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        store: "",
      }));
    }
    if (option === "Select display content") {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        option: "Select Option is required",
      }));
    } else {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        option: "",
      }));
    }
    if (!switchFlag) {
      if (selected === null) {
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          country: "Select Country is required",
        }));
      } else {
        setErrorMessage((errorMessage) => ({
          ...errorMessage,
          country: "",
        }));
      }
    } else {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        country: "",
      }));
    }
    if (content === "" || content === "<p><br></p>") {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        content: "Content is required",
      }));
    } else {
      setErrorMessage((errorMessage) => ({
        ...errorMessage,
        content: "",
      }));
    }
  };
  const errorDisplayCheck = () => {
    return (
      errorMessage.store === "" &&
      errorMessage.option === "" &&
      errorMessage.country === "" &&
      errorMessage.content === ""
    );
  };
  const saveContent = () => {
    validationContent();
    if (errorDisplayCheck) {
      alert("panthil");
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
            <InlineError message={errorMessage.store} fieldID="myFieldID" />
            <Select
              options={options}
              onChange={(value) => {
                setOption(value);
                // console.log(value);
              }}
              value={option}
            />
            <InlineError message={errorMessage.option} fieldID="myFieldID" />
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
                  console.log(code);
                  setSelected(code);
                }}
                disabled={switchFlag}
                selectedSize={12}
                className="react-flages-select"
              />
            </div>
            <InlineError message={errorMessage.country} fieldID="myFieldID" />
          </FormLayout>
          <div className="text-editor">
            <EditorToolbar />
            <ReactQuill
              theme="snow"
              value={content}
              onChange={(value) => {
                console.log("panthil : ", value);
                setContent(value);
              }}
              placeholder={"Write something awesome..."}
              modules={modules}
              formats={formats}
            />
          </div>
          <InlineError message={errorMessage.content} fieldID="myFieldID" />
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
