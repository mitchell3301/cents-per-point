async function getTab() {
  let queryOptions = { active: true, currentWindow: true };
  let tabs = [];

  while (tabs.length == 0) {
    tabs = await chrome.tabs.query(queryOptions);
  }
  console.log(tabs);
  return tabs[0].url;
}

function modDate(dateString) {
  let dict = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  return dict[dateString];
}

// HANDLE
chrome.webRequest.onBeforeSendHeaders.addListener(
  async function (details) {
    if (
      (details.url.startsWith(
        "https://jbrest.jetblue.com/lfs-rwb/outboundLFS"
      ) ||
        details.url.startsWith(
          "https://jbrest.jetblue.com/lfs-rwb/inboundLFS" // make sure it's request we want
        )) &&
      details.requestHeaders.find(({ name, value }) => {
        // make sure it's not the request that we make inorganically later in script
        return name === "sec-ch-ua";
      })
    ) {
      let fetchUrl = details.url.substring(0, 45);
      chrome.storage.session.set({ fetchUrl }).then(async (result) => {
        chrome.storage.session.get(["fetchUrl"], (result) => {
          console.log("Set name: " + result.fetchUrl);
        });
      });

      if (
        details.url.startsWith("https://jbrest.jetblue.com/lfs-rwb/inboundLFS")
      ) {
        makeInorganicRequest();
      }
      //       // let tabUrl = null;

      //       // while (tabUrl == null) {
      //       //   tabUrl = await getTab();
      //       // }
      //       // let fetchUrl = details.url.substring(0, 45);
      //       // console.log(fetchUrl);
      //       // await new Promise((res) => {
      //       //   // HOPEFULLY TEMP SOLUTION
      //       //   setTimeout(() => {
      //       //     res();
      //       //   }, 1000);
      //       // });
      //       // let currentDepartDate = await chrome.storage.session.get([
      //       //   "currentDepartDate",
      //       // ]);
      //       // let originalDepartDate = await chrome.storage.session.get([
      //       //   "originalDepartDate",
      //       // ]);
      //       // let currentReturnDate = await chrome.storage.session.get([
      //       //   "currentReturnDate",
      //       // ]);
      //       // let originalReturnDate = chrome.storage.session.get([
      //       //   "originalReturnDate",
      //       // ]);
      //       // console.log(currentDepartDate);
      //       // Handle what req headers we want
      //       // console.log(details.requestHeaders);
      //       // let headers = details.requestHeaders.filter((header) =>
      //       //   header.name.startsWith("X-1It")
      //       // );
      //       // //console.log(headers);
      //       // let h = headers.reduce((acc, curr) => {
      //       //   acc[curr.name] = curr.value;
      //       //   return acc;
      //       // }, {});
      //       // console.log(h);
      //       // await chrome.storage.session.set({
      //       //   h,
      //       // });
      //       // .then(async (result) => {
      //       //   chrome.storage.session.get(["h"], (result) => {
      //       //     console.log("Retrieved name: " + result.h);
      //       //   });
      //       // });
      //       //   // Set parameters to fetch(s) -----------------------------------------------------------------
      //       //   let tripType = "oneWay";
      //       //   let from = tabUrl.split("from=")[1].substring(0, 3);
      //       //   let to = tabUrl.split("to=")[1].substring(0, 3);
      //       //   let depart = "2024-05-01";
      //       //   let isMultiCity = "false";
      //       //   let adults = "1";
      //       //   let children = "0";
      //       //   let infants = "0";
      //       //   let sharedMarket = "false";
      //       //   let roundTripFaresFlag = "false";
      //       //   let cabin = "economy";
      //       //   let refundable = "false";
      //       //   // Make cash request
      //       // let h = headers.reduce((acc, curr) => {
      //       //   acc[curr.name] = curr.value;
      //       //   return acc;
      //       // }, {});
      //       //   currentDepartDate = currentDepartDate.currentDepartDate;
      //       //   originalDepartDate = originalDepartDate.originalDepartDate;
      //       //   currentReturnDate = currentReturnDate.currentReturnDate;
      //       //   originalReturnDate = originalReturnDate.originalReturnDate;
      //       //   let departDateToReplace = currentDepartDate;
      //       //   let returnDateToReplace = currentReturnDate;
      //       //   if (!currentDepartDate.includes("-")) {
      //       //     // Handle leading zero
      //       //     let day = null;
      //       //     if (currentDepartDate.split(" ")[2].length == 1) {
      //       //       // if day is between 1 and 9
      //       //       day = "0" + currentDepartDate.split(" ")[2];
      //       //     } else {
      //       //       day = currentDepartDate.split(" ")[2];
      //       //     }
      //       //     departDateToReplace = `2024-${modDate(
      //       //       currentDepartDate.split(" ")[1]
      //       //     )}-${day}`;
      //       //   }
      //       //   if (originalReturnDate) {
      //       //     if (!currentReturnDate.includes("-")) {
      //       //       // Handle leading zero
      //       //       let day = null;
      //       //       if (currentReturnDate.split(" ")[2].length == 1) {
      //       //         // if day is between 1 and 9
      //       //         day = "0" + currentReturnDate.split(" ")[2];
      //       //       } else {
      //       //         day = currentReturnDate.split(" ")[2];
      //       //       }
      //       //       returnDateToReplace = `2024-${modDate(
      //       //         currentReturnDate.split(" ")[1]
      //       //       )}-${day}`;
      //       //     }
      //       //   }
      //       //   let cash = null;
      //       //   let points = null;
      //       //   if (fetchUrl.includes("outbound")) {
      //       //     cash = await fetch("https://jbrest.jetblue.com/lfs-rwb/outboundLFS", {
      //       //       headers: {
      //       //         accept: "application/json",
      //       //         "api-version": "v3",
      //       //         "application-channel": "Desktop_Web",
      //       //         "booking-application-type": "NGB",
      //       //         "content-type": "application/json",
      //       //         ...h,
      //       //       },
      //       //       referrer: tabUrl
      //       //         .replace("usePoints=true", "usePoints=false")
      //       //         .replace(originalDepartDate, departDateToReplace)
      //       //         .replace(originalReturnDate, ""),
      //       //       referrerPolicy: "no-referrer-when-downgrade",
      //       //       body:
      //       //         `{"tripType":"` +
      //       //         `${tripType}` +
      //       //         `","from":"` +
      //       //         `${from}` +
      //       //         `","to":"` +
      //       //         `${to}` +
      //       //         `","depart":"` +
      //       //         `${departDateToReplace.replace("depart=", "")}` +
      //       //         `","cabin":"` +
      //       //         `${cabin}` +
      //       //         `","refundable":` +
      //       //         `${refundable}` +
      //       //         `,"dates":{"before":"3","after":"3"},"pax":{"ADT":1,"CHD":0,"INF":0,"UNN":0},"redempoint":false,"pointsBreakup":{"option":"","value":0},"isMultiCity":false,"isDomestic":true}`,
      //       //       method: "POST",
      //       //       mode: "cors",
      //       //       credentials: "omit",
      //       //     })
      //       //       .then((response) => response.text())
      //       //       .catch((error) => console.log("error", error));
      //       //     // Make points req
      //       //     points = await fetch("https://jbrest.jetblue.com/lfs-rwb/outboundLFS", {
      //       //       headers: {
      //       //         accept: "application/json",
      //       //         "api-version": "v3",
      //       //         "application-channel": "Desktop_Web",
      //       //         "booking-application-type": "NGB",
      //       //         "content-type": "application/json",
      //       //         ...h,
      //       //       },
      //       //       referrer: tabUrl
      //       //         .replace(originalDepartDate, departDateToReplace)
      //       //         .replace(originalReturnDate, ""),
      //       //       referrerPolicy: "no-referrer-when-downgrade",
      //       //       body:
      //       //         `{"tripType":"` +
      //       //         `${tripType}` +
      //       //         `","from":"` +
      //       //         `${from}` +
      //       //         `","to":"` +
      //       //         `${to}` +
      //       //         `","depart":"` +
      //       //         `${departDateToReplace.replace("depart=", "")}` +
      //       //         `","cabin":"` +
      //       //         `${cabin}` +
      //       //         `","refundable":` +
      //       //         `${refundable}` +
      //       //         `,"dates":{"before":"3","after":"3"},"pax":{"ADT":1,"CHD":0,"INF":0,"UNN":0},"redempoint":true,"pointsBreakup":{"option":"","value":0},"isMultiCity":false,"isDomestic":true}`,
      //       //       method: "POST",
      //       //       mode: "cors",
      //       //       credentials: "omit",
      //       //     })
      //       //       .then((response) => response.text())
      //       //       .catch((error) => console.log("error", error));
      //       //   } else {
      //       //     cash = await fetch("https://jbrest.jetblue.com/lfs-rwb/outboundLFS", {
      //       //       headers: {
      //       //         accept: "application/json",
      //       //         "api-version": "v3",
      //       //         "application-channel": "Desktop_Web",
      //       //         "booking-application-type": "NGB",
      //       //         "content-type": "application/json",
      //       //         ...h,
      //       //       },
      //       //       referrer: tabUrl
      //       //         .replace("usePoints=true", "usePoints=false")
      //       //         .replace(originalDepartDate, returnDateToReplace)
      //       //         .replace(originalReturnDate, ""),
      //       //       referrerPolicy: "no-referrer-when-downgrade",
      //       //       body:
      //       //         `{"tripType":"` +
      //       //         `","from":"` +
      //       //         `${to}` +
      //       //         `","to":"` +
      //       //         `${from}` +
      //       //         `","depart":"` +
      //       //         `${returnDateToReplace.replace("return=", "")}` +
      //       //         // `","return":"` +
      //       //         // `${returnDateToReplace.replace("return=", "")}` +
      //       //         `","cabin":"` +
      //       //         `${cabin}` +
      //       //         `","refundable":` +
      //       //         `${refundable}` +
      //       //         `,"dates":{"before":"3","after":"3"},"pax":{"ADT":1,"CHD":0,"INF":0,"UNN":0},"redempoint":false,"pointsBreakup":{"option":"","value":0},"isMultiCity":false,"isDomestic":true}`,
      //       //       method: "POST",
      //       //       mode: "cors",
      //       //       credentials: "omit",
      //       //     })
      //       //       .then((response) => response.text())
      //       //       .catch((error) => console.log("error", error));
      //       //     // Make points req
      //       //     points = await fetch("https://jbrest.jetblue.com/lfs-rwb/outboundLFS", {
      //       //       headers: {
      //       //         accept: "application/json",
      //       //         "api-version": "v3",
      //       //         "application-channel": "Desktop_Web",
      //       //         "booking-application-type": "NGB",
      //       //         "content-type": "application/json",
      //       //         ...h,
      //       //       },
      //       //       referrer: tabUrl
      //       //         .replace(originalDepartDate, returnDateToReplace)
      //       //         .replace("return=", "depart="),
      //       //       referrerPolicy: "no-referrer-when-downgrade",
      //       //       body:
      //       //         `{"tripType":"` +
      //       //         `${tripType}` +
      //       //         `","from":"` +
      //       //         `${to}` +
      //       //         `","to":"` +
      //       //         `${from}` +
      //       //         `","depart":"` +
      //       //         `${returnDateToReplace.replace("return=", "")}` +
      //       //         `","cabin":"` +
      //       //         `${cabin}` +
      //       //         `","refundable":` +
      //       //         `${refundable}` +
      //       //         `,"dates":{"before":"3","after":"3"},"pax":{"ADT":1,"CHD":0,"INF":0,"UNN":0},"redempoint":true,"pointsBreakup":{"option":"","value":0},"isMultiCity":false,"isDomestic":true}`,
      //       //       method: "POST",
      //       //       mode: "cors",
      //       //       credentials: "omit",
      //       //     })
      //       //       .then((response) => response.text())
      //       //       .catch((error) => console.log("error", error));
      //       //   }
      //       //   console.log(cash);
      //       //   console.log(points);
      //       //   chrome.storage.session.set({ cash });
      //       //   // .then(async (result) => {
      //       //   //   chrome.storage.session.get(["cash"], (result) => {
      //       //   //     console.log("Retrieved name: " + result.cash);
      //       //   //   });
      //       //   // });
      //       //   chrome.storage.session.set({ points });
      //       //   // .then(async (result) => {
      //       //   //   chrome.storage.session.get(["points"], (result) => {
      //       //   //     console.log("Retrieved name: " + result.points);
      //       //   //   }
      //       //   //   );
      //       //   // });
    } else if (
      details.url.startsWith(
        "https://www.hilton.com/graphql/customer?appName=dx_shop_search_app&operationName=shopMultiPropAvail&originalOpName=shopMultiPropAvailPoints&bl=en"
      ) &&
      details.requestHeaders.find(({ name, value }) => {
        return name === "Sec-Fetch-Dest";
      })
    ) {
      /**
       * Only run if value not currently set in session storage
       */
      chrome.storage.session.get(["fetched"], async (res) => {
        console.log(res);
        if (typeof res.fetched === "undefined") {
          console.log("Value not set in session storage currently.");
          let hiltonHeaders = details.requestHeaders.reduce((acc, curr) => {
            acc[curr.name] = curr.value;
            return acc;
          }, {});

          delete hiltonHeaders["Sec-Fetch-Dest"]; // need to differentiate between organic and inorganic

          console.log(hiltonHeaders);

          chrome.storage.session.set({ hiltonHeaders }).then(async (result) => {
            await chrome.storage.session.get(["hiltonHeaders"], (result) => {
              console.log(
                "Retrieved name: " + JSON.stringify(result.hiltonHeaders)
              );
            });
          });

          // let tab = await getTab();

          /**
           * Get values for body from url
           */

          // let departureDate = tab.split("departureDate=")[1].substring(10);
          // let arrivalDate = tab.split("arrivalDate=")[1].substring(10);

          // console.log("Depart: " + departureDate);
          // console.log("Arrival: " + arrivalDate);

          // console.log("Using url: " + tab);
          // let fetched = await fetch(details.url, {
          //   headers: h,
          //   referrer: "https://www.hilton.com/en/search/",
          //   referrerPolicy: "no-referrer-when-downgrade",
          //   body: `{"query":"query shopMultiPropAvail($ctyhocns: [String!], $language: String!, $input: ShopMultiPropAvailQueryInput!) {\\n  shopMultiPropAvail(input: $input, language: $language, ctyhocns: $ctyhocns) {\\n    ageBasedPricing\\n    ctyhocn\\n    currencyCode\\n    statusCode\\n    statusMessage\\n    lengthOfStay\\n    notifications {\\n      subType\\n      text\\n      type\\n    }\\n    summary {\\n      hhonors {\\n        dailyRmPointsRate\\n        dailyRmPointsRateFmt\\n        rateChangeIndicator\\n        ratePlan {\\n          ratePlanName @toUpperCase\\n        }\\n      }\\n      lowest {\\n        cmaTotalPriceIndicator\\n        feeTransparencyIndicator\\n        rateAmountFmt(strategy: trunc, decimal: 0)\\n        rateAmount(currencyCode: \\"USD\\")\\n        ratePlanCode\\n        rateChangeIndicator\\n        ratePlan {\\n          attributes\\n          ratePlanName @toUpperCase\\n          specialRateType\\n          confidentialRates\\n        }\\n        amountAfterTax(currencyCode: \\"USD\\")\\n        amountAfterTaxFmt(decimal: 0, strategy: trunc)\\n      }\\n      status {\\n        type\\n      }\\n    }\\n  }\\n}","operationName":"shopMultiPropAvail","variables":{"input":{"guestId":0,"guestLocationCountry":"US","arrivalDate":${arrivalDate},"departureDate":${departureDate},"numAdults":1,"numChildren":0,"numRooms":1,"childAges":[],"ratePlanCodes":[],"rateCategoryTokens":[],"specialRates":{"aaa":false,"aarp":false,"corporateId":"","governmentMilitary":false,"groupCode":"","hhonors":true,"pnd":"","offerId":null,"promoCode":"","senior":false,"smb":false,"travelAgent":false,"teamMember":false,"familyAndFriends":false,"owner":false,"ownerHGV":false}},"ctyhocns":["FLLFHGI","FLLACHT","FLLARHW","MIAWEHX","MIAWAHT","FLLANHX","FLLAPHX","MIAMADT","MIANTDT","MIAHSHX","MIADLHX","MIAAIGI","MIAAHHH","MIADAHH","MIAAAHT","MIAWTHW","MIABLHW","MIABNRU","FLLMMHX","FLLSWGI"],"language":"en"}}`,
          //   method: "POST",
          //   mode: "cors",
          //   credentials: "include",
          // }).then((response) => response.json());
          // console.log(fetched);
          // points = [];
          // cash = [];
          // for (let i = 0; i < 21; i++) {
          //   points.push(
          //     fetched.data.showMultiPropAvail[i].summary.hhonors
          //       .dailyRmPointRate
          //   );

          //   fetched = fetched.map((e) => e.showMultiPropAvail);
          // }
          // console.log(points)

          // chrome.storage.session.set({ fetched }).then(async (result) => {
          //   chrome.storage.session.get(["fetched"], (result) => {
          //     console.log("Retrieved name: " + result.fetched);
          //   });
          // });
        }
      });
    }
  },
  { urls: ["https://*.jetblue.com/*", "https://*.hilton.com/*/*"] },
  ["requestHeaders"]
);

async function makeInorganicRequest() {
  // let headers = [];

  // while (headers.length < 1) {
  //   headers = await chrome.storage.session.get(["h"]);
  //   headers = headers.headers;
  //   //console.log(headers);
  // }
  // // console.log(headers);
  // headers = headers.headers;

  // console.log(headers);

  console.log("making inorganic");

  let tabUrl = null;
  while (tabUrl == null) {
    tabUrl = await getTab();
  }

  let url = null;
  while (url === null) {
    url = await chrome.storage.session.get(["fetchUrl"]);
    //console.log(url);
  }
  //let fetchUrl = tabUrl.substring(0, 45);
  url = url.fetchUrl;
  console.log(url);

  // Set parameters to fetch(s) -----------------------------------------------------------------
  let tripType = "oneWay";
  let from = tabUrl.split("from=")[1].substring(0, 3);
  let to = tabUrl.split("to=")[1].substring(0, 3);
  let depart = "2024-05-01";
  let isMultiCity = "false";
  let adults = "1";
  let children = "0";
  let infants = "0";
  let sharedMarket = "false";
  let roundTripFaresFlag = "false";

  let cabin = "economy";
  let refundable = "false";

  // Make cash request

  // let h = headers.reduce((acc, curr) => {
  //   acc[curr.name] = curr.value;
  //   return acc;
  // }, {});

  let currentDepartDate = await chrome.storage.session.get([
    "currentDepartDate",
  ]);

  let originalDepartDate = await chrome.storage.session.get([
    "originalDepartDate",
  ]);

  let currentReturnDate = await chrome.storage.session.get([
    "currentReturnDate",
  ]);

  let originalReturnDate = await chrome.storage.session.get([
    "originalReturnDate",
  ]);

  console.log(currentDepartDate);
  console.log(currentReturnDate);
  console.log(originalDepartDate);
  console.log(originalReturnDate);

  currentDepartDate = currentDepartDate.currentDepartDate;
  originalDepartDate = originalDepartDate.originalDepartDate;

  currentReturnDate = currentReturnDate.currentReturnDate;
  originalReturnDate = originalReturnDate.originalReturnDate;

  let departDateToReplace = currentDepartDate;
  let returnDateToReplace = currentReturnDate;

  if (!currentDepartDate.includes("-")) {
    // Handle leading zero
    let day = null;
    if (currentDepartDate.split(" ")[2].length == 1) {
      // if day is between 1 and 9
      day = "0" + currentDepartDate.split(" ")[2];
    } else {
      day = currentDepartDate.split(" ")[2];
    }

    departDateToReplace = `2024-${modDate(
      currentDepartDate.split(" ")[1]
    )}-${day}`;
  }

  if (originalReturnDate) {
    if (!currentReturnDate.includes("-")) {
      // Handle leading zero
      let day = null;
      if (currentReturnDate.split(" ")[2].length == 1) {
        // if day is between 1 and 9
        day = "0" + currentReturnDate.split(" ")[2];
      } else {
        day = currentReturnDate.split(" ")[2];
      }

      returnDateToReplace = `2024-${modDate(
        currentReturnDate.split(" ")[1]
      )}-${day}`;
    }
  }

  let cash = null;
  let points = null;

  // let returnOrDepart = document.querySelector(
  //   "#flight-details .ng-star-inserted"
  // ).innerText;

  if (url.includes("outbound")) {
    cash = await fetch("https://jbrest.jetblue.com/lfs-rwb/outboundLFS", {
      headers: {
        accept: "application/json",
        "api-version": "v3",
        "application-channel": "Desktop_Web",
        "booking-application-type": "NGB",
        "content-type": "application/json",
        //...h,
      },
      referrer: tabUrl
        .replace("usePoints=true", "usePoints=false")
        .replace(originalDepartDate, departDateToReplace)
        .replace(originalReturnDate, ""),
      referrerPolicy: "no-referrer-when-downgrade",
      body:
        `{"tripType":"` +
        `${tripType}` +
        `","from":"` +
        `${from}` +
        `","to":"` +
        `${to}` +
        `","depart":"` +
        `${departDateToReplace.replace("depart=", "")}` +
        `","cabin":"` +
        `${cabin}` +
        `","refundable":` +
        `${refundable}` +
        `,"dates":{"before":"3","after":"3"},"pax":{"ADT":1,"CHD":0,"INF":0,"UNN":0},"redempoint":false,"pointsBreakup":{"option":"","value":0},"isMultiCity":false,"isDomestic":true}`,
      method: "POST",
      mode: "cors",
      credentials: "omit",
    })
      .then((response) => response.text())
      .catch((error) => console.log("error", error));

    // Make points req
    points = await fetch("https://jbrest.jetblue.com/lfs-rwb/outboundLFS", {
      headers: {
        accept: "application/json",
        "api-version": "v3",
        "application-channel": "Desktop_Web",
        "booking-application-type": "NGB",
        "content-type": "application/json",
        //...h,
      },
      referrer: tabUrl
        .replace(originalDepartDate, departDateToReplace)
        .replace(originalReturnDate, ""),
      referrerPolicy: "no-referrer-when-downgrade",
      body:
        `{"tripType":"` +
        `${tripType}` +
        `","from":"` +
        `${from}` +
        `","to":"` +
        `${to}` +
        `","depart":"` +
        `${departDateToReplace.replace("depart=", "")}` +
        `","cabin":"` +
        `${cabin}` +
        `","refundable":` +
        `${refundable}` +
        `,"dates":{"before":"3","after":"3"},"pax":{"ADT":1,"CHD":0,"INF":0,"UNN":0},"redempoint":true,"pointsBreakup":{"option":"","value":0},"isMultiCity":false,"isDomestic":true}`,
      method: "POST",
      mode: "cors",
      credentials: "omit",
    })
      .then((response) => response.text())
      .catch((error) => console.log("error", error));
  } else {
    cash = await fetch("https://jbrest.jetblue.com/lfs-rwb/outboundLFS", {
      headers: {
        accept: "application/json",
        "api-version": "v3",
        "application-channel": "Desktop_Web",
        "booking-application-type": "NGB",
        "content-type": "application/json",
        // ...h,
      },
      referrer: tabUrl
        .replace("usePoints=true", "usePoints=false")
        .replace(originalDepartDate, returnDateToReplace)
        .replace(originalReturnDate, ""),
      referrerPolicy: "no-referrer-when-downgrade",
      body:
        `{"tripType":"` +
        `","from":"` +
        `${to}` +
        `","to":"` +
        `${from}` +
        `","depart":"` +
        `${returnDateToReplace.replace("return=", "")}` +
        // `","return":"` +
        // `${returnDateToReplace.replace("return=", "")}` +
        `","cabin":"` +
        `${cabin}` +
        `","refundable":` +
        `${refundable}` +
        `,"dates":{"before":"3","after":"3"},"pax":{"ADT":1,"CHD":0,"INF":0,"UNN":0},"redempoint":false,"pointsBreakup":{"option":"","value":0},"isMultiCity":false,"isDomestic":true}`,
      method: "POST",
      mode: "cors",
      credentials: "omit",
    })
      .then((response) => response.text())
      .catch((error) => console.log("error", error));

    // Make points req
    points = await fetch("https://jbrest.jetblue.com/lfs-rwb/outboundLFS", {
      headers: {
        accept: "application/json",
        "api-version": "v3",
        "application-channel": "Desktop_Web",
        "booking-application-type": "NGB",
        "content-type": "application/json",
        //...h,
      },
      referrer: tabUrl
        .replace(originalDepartDate, returnDateToReplace)
        .replace("return=", "depart="),
      referrerPolicy: "no-referrer-when-downgrade",
      body:
        `{"tripType":"` +
        `${tripType}` +
        `","from":"` +
        `${to}` +
        `","to":"` +
        `${from}` +
        `","depart":"` +
        `${returnDateToReplace.replace("return=", "")}` +
        `","cabin":"` +
        `${cabin}` +
        `","refundable":` +
        `${refundable}` +
        `,"dates":{"before":"3","after":"3"},"pax":{"ADT":1,"CHD":0,"INF":0,"UNN":0},"redempoint":true,"pointsBreakup":{"option":"","value":0},"isMultiCity":false,"isDomestic":true}`,
      method: "POST",
      mode: "cors",
      credentials: "omit",
    })
      .then((response) => response.text())
      .catch((error) => console.log("error", error));
  }

  console.log(cash);
  console.log(points);
  chrome.storage.session.set({ cash });
  // .then(async (result) => {
  //   chrome.storage.session.get(["cash"], (result) => {
  //     console.log("Retrieved name: " + result.cash);
  //   });
  // });
  chrome.storage.session.set({ points });
  // .then(async (result) => {
  //   chrome.storage.session.get(["points"], (result) => {
  //     console.log("Retrieved name: " + result.points);
  //   }
  //   );
  // });
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  for (const [key, value] of Object.entries(changes)) {
    if (key == "currentDepartDate") {
      console.log("CHANGING");
      makeInorganicRequest();
    }
  }
});
