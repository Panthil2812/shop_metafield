import React from "react";
import {
  Banner,
  Page,
  Button,
  Tabs,
  Toast,
  Modal,
  TextContainer,
  Layout,
  Card,
  FormLayout,
} from "@shopify/polaris";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
export default function Support() {
  return (
    <Page fullWidth={false}>
      <Layout>
        <Layout.Section>
          <Card
            title="Support"
            primaryFooterAction={{
              content: "Contact Us",
              onAction: () =>
                window.open("mailto:hello@appmixo.com", "__blank"),
            }}
          >
            <p className="support-card">
              If you want to ask any questions or need any help contact us.
            </p>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card title="Theme app extension Enable/Disable" sectioned>
            <p>Go to our App dashboard and click on "Manage Widget"</p>
          </Card>
        </Layout.Section>

        {/* <Layout.AnnotatedSection
                    id="storeDetails"
                    title="1. Theme Customize"
                    description="Open theme Customize through  ( Online Store -> Themes -> Customize)"
                >
                    <Card sectioned>
                        <img src="https://esteregg.s3.us-east-2.amazonaws.com/images/2022/January/7/Screenshot_3.png" width="100%" 
                            onClick={() => { window.open("https://esteregg.s3.us-east-2.amazonaws.com/images/2022/January/7/Screenshot_3.png") }}>
                        </img>
                    </Card>
                </Layout.AnnotatedSection>

                <Layout.AnnotatedSection
                    id="storeDetails"
                    title="2. Theme settings"
                    description="Click on left bottom corner block 'Theme settings' "
                >
                    <Card sectioned>
                        <img src="https://esteregg.s3.us-east-2.amazonaws.com/images/2022/January/7/Screenshot_4.png" width="100%" 
                            onClick={() => { window.open("https://esteregg.s3.us-east-2.amazonaws.com/images/2022/January/7/Screenshot_4.png") }}>
                        </img>
                    </Card>
                </Layout.AnnotatedSection> */}

        <Layout.AnnotatedSection
          id="storeDetails"
          title="1. App embeds"
          description="On Theme settings -> App embeds, check Country wise Content widget with toggle button. Move toggle to right to Turn on the extension"
        >
          <Card sectioned>
            <img
              src={img1}
              width="100%"
              onClick={() => {
                window.open(img1);
              }}
            />
          </Card>
        </Layout.AnnotatedSection>

        <Layout.AnnotatedSection
          id="storeDetails"
          title="2. Enable App"
          description="Click on Save to enable the widget"
        >
          <Card sectioned>
            <img
              src={img2}
              width="100%"
              onClick={() => {
                window.open(img2);
              }}
            />
          </Card>
        </Layout.AnnotatedSection>

        <Layout.AnnotatedSection
          id="storeDetails"
          title="3. Disable App"
          description="On Theme settings -> App embeds, check Country wise Content widget with toggle button. Move toggle to left to Turn off the extension and click on Save button"
        >
          <Card sectioned>
            <img
              src={img3}
              width="100%"
              onClick={() => {
                window.open(img3);
              }}
            />
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  );
}
