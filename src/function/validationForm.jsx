import validation from "validator";
const validation_form = (info) => {
  //   console.log(info);
  let errorArray = new Array(4).fill(false);
  //   console.log("--------------------------------------------------");
  if (validation.isEmpty(info.name, { ignore_whitespace: false })) {
    console.log("storeName : ", info.storeName);
    // console.log(
    //   "validation : ",
    //   validation.isEmpty(info.name, { ignore_whitespace: false })
    // );
    errorArray[0] = true;
  }

  //   console.log("--------------------------------------------------");
  if (validation.isEmpty(info.option, { ignore_whitespace: false })) {
    console.log("option : ", info.option);
    // console.log(
    //   "validation : ",
    //   validation.isEmpty(info.option, { ignore_whitespace: false })
    // );
    errorArray[1] = true;
  }

  //   console.log("--------------------------------------------------");
  if (
    !info.switch &&
    validation.isEmpty(info.country_code, { ignore_whitespace: false })
  ) {
    console.log("country_code : ", info.country_code);
    // console.log(
    //   "validation : ",
    //   !info.switch &&
    //     validation.isEmpty(info.country_code, { ignore_whitespace: false })
    // );
    errorArray[2] = true;
  }

  //   console.log("--------------------------------------------------");
  if (validation.isEmpty(info.content) || info.content === "<p><br></p>") {
    console.log("content : ", info.content);
    // console.log(
    //   "validation : ",
    //   validation.isEmpty(info.content),
    //   info.content === "<p><br></p>"
    // );
    errorArray[3] = true;
  }

  //   console.log("--------------------------------------------------");
  //   console.log(errorArray);
  return errorArray;
};
export default validation_form;
