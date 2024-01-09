// chrome.storage.local.setAccessLevel({
//   accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS",
// });

async function getTab() {
  let queryOptions = { active: true, currentWindow: true };
  let tabs = await chrome.tabs.query(queryOptions);
  return tabs[0].url;
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  async function (details) {
    if (
      details.url.startsWith(
        "https://jbrest.jetblue.com/lfs-rwb/outboundLFS"
      ) &&
      details.requestHeaders.find(({ name, value }) => {
        // make sure it's not the request that we make inorganically
        return name === "sec-ch-ua";
      })
    ) {
      // Handle what req headers we want
      let headers = details.requestHeaders.filter((header) =>
        header.name.startsWith("X-1It")
      );

      // Set parameters to fetch(s) -----------------------------------------------------------------
      let tripType = "oneWay";
      let from = "JFK";
      let to = "TPA";
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

      let h = headers.reduce((acc, curr) => {
        acc[curr.name] = curr.value;
        return acc;
      }, {});

      console.log(h);

      const cash = await fetch(
        "https://jbrest.jetblue.com/lfs-rwb/outboundLFS",
        {
          headers: {
            accept: "application/json",
            "api-version": "v3",
            "application-channel": "Desktop_Web",
            "booking-application-type": "NGB",
            "content-type": "application/json",
            ...h,
          },
          referrer:
            `https://www.jetblue.com/booking/flights?from=` +
            `${from}` +
            `&to=` +
            `${to}` +
            `&depart=` +
            `${depart}` +
            `&isMultiCity=` +
            `${isMultiCity}` +
            `&noOfRoute=1&lang=en&adults=` +
            `${adults}` +
            `&children=` +
            `${children}` +
            `&infants=` +
            `${infants}` +
            `&sharedMarket=` +
            `${sharedMarket}` +
            `&roundTripFaresFlag=` +
            `${roundTripFaresFlag}` +
            `&usePoints=` +
            `false`, // KEEP FALSE, THIS IS CASH REQ NOT POINS
          referrerPolicy: "no-referrer-when-downgrade",
          body:
            `{"tripType":"` +
            `${tripType}` +
            `","from":"` +
            `${from}` +
            `","to":"` +
            `${to}` +
            `","depart":"` +
            `${depart}` +
            `","cabin":"` +
            `${cabin}` +
            `","refundable":` +
            `${refundable}` +
            `,"dates":{"before":"3","after":"3"},"pax":{"ADT":1,"CHD":0,"INF":0,"UNN":0},"redempoint":false,"pointsBreakup":{"option":"","value":0},"isMultiCity":false,"isDomestic":true}`,
          method: "POST",
          mode: "cors",
          credentials: "omit",
        }
      )
        .then((response) => response.text())
        .catch((error) => console.log("error", error));

      // Make points req
      const points = await fetch(
        "https://jbrest.jetblue.com/lfs-rwb/outboundLFS",
        {
          headers: {
            accept: "application/json",
            "api-version": "v3",
            "application-channel": "Desktop_Web",
            "booking-application-type": "NGB",
            "content-type": "application/json",
            ...h,
          },
          referrer:
            `"https://www.jetblue.com/booking/flights?from=` +
            `${from}` +
            `&to=` +
            `${to}` +
            `&depart=` +
            `${depart}` +
            `&isMultiCity=` +
            `${isMultiCity}` +
            `&noOfRoute=1&lang=en&adults=` +
            `${adults}` +
            `&children=` +
            `${children}` +
            `&infants=` +
            `${infants}` +
            `&sharedMarket=` +
            `${sharedMarket}` +
            `&roundTripFaresFlag=` +
            `${roundTripFaresFlag}` +
            `&usePoints=` +
            `true"`,
          referrerPolicy: "no-referrer-when-downgrade",
          body:
            `{"tripType":"` +
            `${tripType}` +
            `","from":"` +
            `${from}` +
            `","to":"` +
            `${to}` +
            `","depart":"` +
            `${depart}` +
            `","cabin":"` +
            `${cabin}` +
            `","refundable":` +
            `${refundable}` +
            `,"dates":{"before":"3","after":"3"},"pax":{"ADT":1,"CHD":0,"INF":0,"UNN":0},"redempoint":true,"pointsBreakup":{"option":"","value":0},"isMultiCity":false,"isDomestic":true}`,
          method: "POST",
          mode: "cors",
          credentials: "omit",
        }
      )
        .then((response) => response.text())
        .catch((error) => console.log("error", error));

      chrome.storage.local.set({ cash }).then(async (result) => {
        chrome.storage.local.get(["cash"], (result) => {
          console.log("Retrieved name: " + result.cash);
        });
      });
      chrome.storage.local.set({ points }).then(async (result) => {
        chrome.storage.local.get(["points"], (result) => {
          console.log("Retrieved name: " + result.points);
        });
      });
    }
  },
  { urls: ["https://*.jetblue.com/*"] },
  ["requestHeaders"]
);
