import React, { useCallback, useState } from "react";
import {
  AppProvider,
  Page,
  Card,
  Select,
  FormLayout,
  TextField,
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
  const [option, setOption] = useState("Select display content");

  const [selected, setSelected] = useState("");
  const [content, setContent] = useState({ value: null });
  const handleChange = (value) => {
    setContent({ value });
    console.log(value);
  };

  const [countryFlag, setCountryFlag] = useState(false);

  const handleToggle = (nextChecked) => {
    setCountryFlag(nextChecked);
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
        // primaryAction={{ content: "Save" }}
        // secondaryActions={[
        //   { content: "Duplicate", url: "#" },
        //   { content: "View on your store", url: "#" },
        // ]}
      >
        <Card sectioned>
          <FormLayout>
            <TextField
              label="Store name"
              onChange={() => {}}
              autoComplete="off"
            />
            <Select
              // label="Date range"
              options={options}
              onChange={(value) => {
                //   alert(options[e].label);
                setOption(value);
                console.log(value);
              }}
              value={option}
            />
            {/* <FormLayout.Group> */}
            <div
              style={{
                display: "flex",
                // justifyContent: "normal",
              }}
            >
              <div
                style={{
                  marginRight: "30px",
                  display: "flex",
                  padding: "3px",
                  // border: "2px solid #F0F0F0",
                  // justifyContent: "center",
                  // justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    // marginRight: "20px",
                    // marginLeft: "20px",
                    marginRight: "20px",
                    paddingTop: "3px",
                    paddingBottom: "2px",
                    fontSize: "16px",
                  }}
                >
                  Default Country{" "}
                </p>
                <Switch
                  onChange={handleToggle}
                  checked={countryFlag}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  className="react-switch"
                />
              </div>

              {!countryFlag === true ? (
                <ReactFlagsSelect
                  selected={selected}
                  onSelect={(code) => setSelected(code)}
                  selectedSize={12}
                  className="react-flages-select"
                />
              ) : (
                // <div style={{ pointerEvents: "none" }}>
                <ReactFlagsSelect
                  selected={selected}
                  onSelect={(code) => setSelected(code)}
                  selectedSize={12}
                  className="react-flages-disable-select"
                />
                // </div>
              )}
            </div>
            {/* </FormLayout.Group> */}
          </FormLayout>

          {/* <div>
            <Stack distribution="fill">
              
              <></>
            </Stack>
          </div> */}
          <div className="text-editor">
            <EditorToolbar />
            <ReactQuill
              theme="snow"
              value={content.value}
              onChange={handleChange}
              placeholder={"Write something awesome..."}
              modules={modules}
              formats={formats}
            />
          </div>
        </Card>
        <Page
          primaryAction={{
            content: "Save",
          }}
        />
      </Page>
    </AppProvider>
  );
};

export default AddContent;
