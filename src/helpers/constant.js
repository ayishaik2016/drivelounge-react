export const formProps = {
  hideRequiredMark: true,
  colon: false,
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export const Formatcurrency = (currnecy) => {
  if (currnecy !== null && currnecy !== undefined) {
    return currnecy.toLocaleString("en", {
      useGrouping: true,
      minimumFractionDigits: 2,
    });
  } else {
    return "";
  }
};

export const DEFAULT_CURRENCY = "SAR";
