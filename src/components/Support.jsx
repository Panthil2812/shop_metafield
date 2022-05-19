import React from "react";

const Support = () => {
  return <div>Support</div>;
};

export default Support;
// import { useEffect, useState } from "react";

// import {
//   Avatar,
//   Badge,
//   Button,
//   ButtonGroup,
//   CalloutCard,
//   Card,
//   Checkbox,
//   ColorPicker,
//   DataTable,
//   DropZone,
//   Form,
//   FormLayout,
//   Frame,
//   hsbToHex,
//   Icon,
//   Layout,
//   Page,
//   PageActions,
//   Popover,
//   rgbToHsb,
//   Select,
//   TextField,
//   Toast,
// } from "@shopify/polaris";
// import hexRgb from "hex-rgb";
// import axios from "axios";
// import trophyImgUrl from "../assets/home-trophy.png";
// import "./home.css";
// import { DeleteMinor, EditMinor } from "@shopify/polaris-icons";
// import { getSessionToken } from "@shopify/app-bridge-utils";
// import { useAppBridge } from "@shopify/app-bridge-react";
// import { userLoggedInFetch } from "../App";

// const options = [
//   {
//     label: "Blank",
//     value: "blank",
//   },
// ];
// export function HomePage() {
//   const app = useAppBridge();
//   const fetch = userLoggedInFetch(app);

//   const [data, setData] = useState([]);
//   const [selectedId, setSelectedId] = useState("");
//   const [isEdit, setIsEdit] = useState(false);
//   const [uploadType, setUploadType] = useState("");
//  const [color, setColor] = useState({
//     hue: 120,
//     brightness: 1,
//     saturation: 1,
//   });
//   const [image, setImage] = useState("");
//   const [showPicker, setShowPicker] = useState(false);
//   const [heading, setHeading] = useState("");
//   const [message, setMessage] = useState("");
//   const [buttonText, setButtonText] = useState("");
//   const [passwordText, setPasswordText] = useState("");
//   const [confirmPasswordText, setConfirmPasswordText] = useState("");
//   const [removeBranding, setRemoveBranding] = useState(false);
//   const [moveActivation, setMoveActivation] = useState(false);
//   const [toastOpen, setToastOpen] = useState(false);
//   const [toastText, setToastText] = useState("");
// const activator = (
//   <Button
//     onClick={() => {
//       setShowPicker(!showPicker);
//     }}
//     disclosure
//   >
//     <div className="color-picker-btn">
//       <div className="color-showbx" style={{ background: hsbToHex(color) }} />
//       <p>{hsbToHex(color)}</p>
//     </div>
//   </Button>
// );

//   let formattedRows = data?.map((x) => {
//     return [
//       x?._id,
//       <Avatar source={`/upoads/${x?.image}`} />,
//       x?.heading,
//       x?.message,
//       x?.buttonText,
//       x?.buttonColor,
//       x?.passwordText,
//       String(x?.removeBranding),
//       String(x?.moveActivationSection),
//       <Button
//         plain
//         onClick={() => {
//           editClickApperence(x);
//         }}
//       >
//         <Icon source={EditMinor} color="base" />
//       </Button>,
//       <Button
//         plain
//         onClick={() => {
//           deleteApperence(x?._id);
//         }}
//       >
//         <Icon source={DeleteMinor} color="base" />
//       </Button>,
//     ];
//   });

//   const ToastMarkUp = toastOpen && (
//     <Toast
//       content={toastText}
//       onDismiss={() => {
//         setToastOpen(false);
//         setToastText("");
//       }}
//     />
//   );

//   return (
//     <Page
//       fullWidth
//       title="Apperence"
//       breadcrumbs={[{ content: "Products", url: "#" }]}
//     >
//       <Frame>
//         {ToastMarkUp}

//         <CalloutCard
//           title="Preview your Activation/Password Message"
//           illustration={trophyImgUrl}
//           primaryAction={{
//             content: "Preview",
//             url: "https://www.shopify.com",
//           }}
//         >
//           <p>
//             Below you can update your activation message with a custom heading
//             text, images and password from style
//           </p>
//         </CalloutCard>

//         {/ CUSTOMIZE YOUR MESSAGE /}
//         <div className="customize-msg-block">
//           <Layout>
//             <Layout.AnnotatedSection
//               title="Customize your text"
//               description={
//                 <>
//                   <p>
//                     Edit your acount activation message here. This will display
//                     on the order confirmation page.
//                   </p>
//                   <Badge status="success">Active</Badge>
//                 </>
//               }
//             >
//               <Card>
//                 <Card.Section>
//                   <Form>
//                     <FormLayout>
//                       <div className="layout-container">
//                         <FormLayout.Group>
//                           <div>
//                             <p>Upload image</p>
//                             <div className="dropzone-cover">
//                               <DropZone onDrop={mediaUploadHandler}>
//                                 <DropZone.FileUpload />
//                               </DropZone>
//                             </div>
//                           </div>

//                           <Select
//                             label="Or choose an animated icon"
//                             options={options}
//                             onChange={setUploadType}
//                             value={uploadType}
//                           />
//                         </FormLayout.Group>
//                       </div>

//                       {/ HEADING /}
//                       <TextField
//                         label="Heading"
//                         placeholder="Heading"
//                         onChange={setHeading}
//                         value={heading}
//                       />

//                       {/ MESSAGE /}
//                       <TextField
//                         label="Message"
//                         placeholder="Message"
//                         onChange={setMessage}
//                         value={message}
//                       />

//                       <FormLayout.Group>
//                         <TextField
//                           label="Button Text"
//                           placeholder="Button Text"
//                           onChange={setButtonText}
//                           value={buttonText}
//                         />

//                         <div className="color-picker">
//                           <p>Button color</p>
//                           <Popover
//                             active={showPicker}
//                             autofocusTarget="first-node"
//                             activator={activator}
//                             onClose={() => {
//                               setShowPicker(false);
//                             }}
//                           >
//                             <ColorPicker onChange={setColor} color={color} />
//                           </Popover>
//                         </div>
//                       </FormLayout.Group>

//                       <FormLayout.Group>
//                         <TextField
//                           label="Password Text"
//                           placeholder="Password Text"
//                           onChange={setPasswordText}
//                           value={passwordText}
//                         />

//                         <TextField
//                           label="Confirm Password Text"
//                           placeholder="Confirm Password Text"
//                           onChange={setConfirmPasswordText}
//                           value={confirmPasswordText}
//                         />
//                       </FormLayout.Group>

//                       <Checkbox
//                         label="Remove Branding"
//                         checked={removeBranding}
//                         onChange={() => {
//                           setRemoveBranding(!removeBranding);
//                         }}
//                       />

//                       <Checkbox
//                         label="Move Activation section to very top of order confirmation page"
//                         checked={moveActivation}
//                         onChange={() => {
//                           setMoveActivation(!moveActivation);
//                         }}
//                       />
//                     </FormLayout>
//                   </Form>
//                 </Card.Section>
//               </Card>
//             </Layout.AnnotatedSection>

//             {/ CONDITIONAL LOGIC /}
//             <Layout.AnnotatedSection
//               title="Conditional Logic"
//               description={
//                 <>
//                   <p>
//                     only show account activation section if the following
//                     products/collections are included in the order.
//                   </p>
//                   <Badge status="success">Active</Badge>
//                 </>
//               }
//             >
//               <Card>
//                 <Card.Section>
//                   <p>Choose Products (leave blank to show always)</p>

//                   <div className="choose-products-actions">
//                     <ButtonGroup>
//                       <Button>Choose Products</Button>
//                       <Button>Choose Collection</Button>
//                     </ButtonGroup>
//                   </div>
//                 </Card.Section>
//               </Card>
//             </Layout.AnnotatedSection>
//           </Layout>
//         </div>

//         <PageActions
//           primaryAction={{
//             content: isEdit ? "Update" : "Save",
//             onClick: isEdit ? updateApperence : submitHandler,
//           }}
//         />

//         <Card>
//           <DataTable
//             columnContentTypes={[
//               "text",
//               "numeric",
//               "text",
//               "text",
//               "text",
//               "text",
//               "text",
//               "text",
//               "text",
//               "numeric",
//               "numeric",
//             ]}
//             headings={[
//               "ID",
//               "Image",
//               "Heading",
//               "Message",
//               "Button Text",
//               "Button Color",
//               "Password Text",
//               "Remove Branding",
//               "Move Activation",
//               "Edit",
//               "Delete",
//             ]}
//             rows={formattedRows}
//           />
//         </Card>
//       </Frame>
//     </Page>
//   );
// }
