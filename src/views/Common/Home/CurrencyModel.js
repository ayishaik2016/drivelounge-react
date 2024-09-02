import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Modal, Row } from "antd";

import { getLocaleMessages } from "redux/helper";
import currencyactions from "./../../../redux/currency/actions";

const CurrencyModel = (props) => {
  const dispatch = useDispatch();

  const { currencies } = useSelector(
    (state) => state.Currency
  );

  useEffect(() => {
    dispatch({
      type: currencyactions.GET_CURRENCIES_LIST,
      payload: false,
    });
  }, []);

  const { modelControl, modelSubmitFun, modelClose, modelTitle = "" } = props;
  const dummyApi = {
    top: [
      { id: 1, title: "Australian Dollars", code: "AUD" },
      { id: 2, title: "Canadian Dollars", code: "CAD" },
      { id: 3, title: "Euros", code: "€" },
      { id: 4, title: "British Pounds", code: "£" },
      { id: 5, title: "US Dollars", code: "US$" },
    ],
    all: [
      { id: 1, title: "Australian Dollars", code: "AUD" },
      { id: 6, title: "UAE Dirham", code: "AED" },
      { id: 7, title: "Armenian Dram", code: "AMD" },
      { id: 8, title: "Netherlands Antillean Guilder", code: "ANG" },
      { id: 9, title: "Bulgarian Lev", code: "BGN" },
      { id: 10, title: "Bahraini Dinar", code: "BHD" },
      { id: 11, title: "Bruneian Dollar", code: "BND" },
      { id: 12, title: "Bolivian Boliviano", code: "BOB" },
      { id: 13, title: "Bahamian Dollar", code: "BSD" },
      { id: 14, title: "Botswana Pula", code: "BWP" },
      { id: 15, title: "Belize Dolla", code: "BZD" },
      { id: 16, title: "Belize Dolla", code: "BZD" },
    ],
  };

  return (
    <Modal
      title={modelTitle}
      visible={modelControl}
      onCancel={modelClose}
      centered
      footer={false}
      className="modal-customize-12"
    >
      {/* <p>{getLocaleMessages("top_currencies")}</p>
      <div className="flex-currency">
        {dummyApi.top.map((currency) => (
          <div>
            <Button
              className={"currencyChngBtn"}
              onClick={() => modelSubmitFun(currency.code)}
            >
              <p className="small-title">{currency.title}</p>
              <p>{currency.code}</p>
            </Button>
          </div>
        ))}
      </div> */}
      <p>{getLocaleMessages("all_currencies")}</p>
      <div className="flex-currency">
        {currencies.map((currency) => (
          <div>
            <Button
              className={"currencyChngBtn"}
              onClick={() => modelSubmitFun(currency.code)}
            >
              <p className="small-title">{currency.name}</p>
              <p>{currency.code}</p>
            </Button>
          </div>
        ))}
      </div>
    </Modal>
  );
};
export default CurrencyModel;
