var page = "";
var div = "";
var collectionDiv = "";
var ShopifyAnalytics;
var shop_name = "";
// const shopMeta = JSON.stringify(
//   `{{ shop.metafields.appmixo_dynamic.appmixo_1 }}` || "{ }"
// );
// const jj = JSON.parse(shopMeta);
// console.log("shopMeta panthil : ", jj.country_content);

// const shopMeta = JSON.parse(`{{ shop.metafields.my_fields.cb_meta | json }}` || "{ }")

fetchCountryData = async function () {
  fetch("https://appmixo.in/cdn-cgi/trace", {
    method: "GET",
    redirect: "follow",
  })
    .then((response) => response.text())
    .then((result) => {
      const loc = result.split("\n").reduce((obj, ele) => {
        let arr = ele.split("=");
        return { ...obj, [arr[0]]: arr[1] };
      }, {}).loc;
      // console.log("location : ", loc);
      document.cookie = `location=${loc}`;
    })
    .catch((error) => console.log("error", error));
};
getCountryCode = async = () => {
  return document.cookie.split(";").reduce((obj, ele) => {
    let arr = ele.split("=");
    return { ...obj, [arr[0]]: arr[1] };
  }, {}).location;
};
dynamicContent = async function () {
  // document.cookie = "name=JashKPatel; SameSite=None; Secure";

  if (typeof window.ShopifyAnalytics != "undefined") {
    ShopifyAnalytics = window.ShopifyAnalytics;
  } else {
    await new Promise((resolve) =>
      setTimeout(() => {
        ShopifyAnalytics = window.ShopifyAnalytics;
        resolve();
      }, 1000)
    );
  }

  if (typeof window.Shopify != "undefined") {
    shop_name = Shopify.shop;
  } else {
    await new Promise((resolve) =>
      setTimeout(() => {
        shop_name = Shopify.shop;
        resolve();
      }, 1000)
    );
  }

  fetchCountryData();
  const country_code = getCountryCode();
  console.log("Country Code : ", country_code);

  if (document.querySelectorAll(".dynamic_header_Drop")[0]) {
    document.querySelector(".dynamic_header_Drop").innerHTML = "hello_header";
  }

  if (document.querySelectorAll(".dynamic_footer_Drop")[0]) {
    document.querySelector(".dynamic_footer_Drop").innerHTML = "hello_footer";
  }
};

dynamicContent();
