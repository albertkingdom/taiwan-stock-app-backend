var express = require("express");
var router = express.Router();
const axios = require("axios");
const dateFormat = require("dateformat");
//大盤指數
router.post("/stockIndex", async (req, res) => {
  //   console.log(req.body);
  const { date } = req.body;
  const response = await axios.get(
    `https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=${date}&type=IND`
  );
  //   console.log("response", response);
  const indexInfo = {
    index: response.data.data1[1],
    date: response.data.params.date,
  };
  res.json(indexInfo);
});

//個股股價
router.post("/stockprice", async (req, res) => {
  const { str } = req.body; //str:tse_2330.tw
  //   console.log(str);
  const response = await axios.get(
    `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${str}&json=1&delay=0`
  );
  //   console.log(response.data);

  res.json(response.data);
});

//熱門成交股
router.get("/hotstock", async (req, res) => {
  //取得日期"2020/12/13" -->"20201213",遇假日則找最近平日
  const getDate = () => {
    //if Saturday or Sunday, get Friday info instead
    if (new Date().getDay() === 6) {
      return new Date(Date.now() - 864e5);
    } else if (new Date().getDay() === 0) {
      return new Date(Date.now() - 2 * 864e5);
    }
    //Monday morning
    if (new Date().getDay() === 1 && new Date().getHours() < 14) {
      return new Date(Date.now() - 3 * 864e5);
    }
    //if today's info is not published,then get yesterday's info instead
    if (new Date().getHours() >= 14) {
      return new Date();
    } else {
      return new Date(Date.now() - 864e5);
    }
  };
  //格式化日期 e.g. 20201010
  const dateoutput = dateFormat(getDate(), "yyyymmdd");

  const url = `https://www.twse.com.tw/exchangeReport/MI_INDEX20?response=json&date=${dateoutput}`;
  const response = await axios.get(url);

  res.json({ hitoStocklist: response.data.data });
});

module.exports = router;
