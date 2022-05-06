import React, { useCallback, useState } from "react";
import {
  AppProvider,
  Page,
  Card,
  Select,
  FormLayout,
  TextField,
} from "@shopify/polaris";
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
            <FormLayout.Group>
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
              <ReactFlagsSelect
                selected={selected}
                onSelect={(code) => setSelected(code)}
                selectedSize={12}
              />
            </FormLayout.Group>
          </FormLayout>
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
