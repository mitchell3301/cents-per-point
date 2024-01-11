// chrome.storage.local.setAccessLevel({
//   accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS",
// });

async function getTab() {
  let queryOptions = { active: true, currentWindow: true };
  let tabs = await chrome.tabs.query(queryOptions);
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
      let originalDepartDate = await chrome.storage.local.get([
        "originalDepartDate",
      ]);

      /// NEED THIS TO RUN FASTER
      let currentDepartDate = await chrome.storage.local.get([
        "currentDepartDate",
      ]);

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

      // self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
      //   for (const client of clients) {
      //     console.log(client.url); // Output: URLs of open tabs/windows within the scope
      //   }
      // });

      let tabUrl = null;
      while (tabUrl === null) {
        tabUrl = await getTab();
      }

      currentDepartDate = currentDepartDate.currentDepartDate;
      console.log(modDate(currentDepartDate.split(" ")[1]));
      console.log(currentDepartDate.split(" ")[2]);

      let day = null;
      if (currentDepartDate.split(" ")[2].length == 1) {
        day = "0" + currentDepartDate.split(" ")[2];
      } else {
        day = currentDepartDate.split(" ")[2];
      }

      let dateToReplace = `2024-${modDate(
        currentDepartDate.split(" ")[1]
      )}-${day}`;

      console.log(dateToReplace);

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
          referrer: tabUrl
            .replace("usePoints=true", "usePoints=false")
            .replace(
              "depart=2024-05-01",
              `depart=2024-${modDate(currentDepartDate.split(" ")[1])}-0${
                currentDepartDate.split(" ")[2]
              }`
            ),
          // `https://www.jetblue.com/booking/flights?from=` +
          // `${from}` +
          // `&to=` +
          // `${to}` +
          // `&depart=` +
          // `${depart}` +
          // `&isMultiCity=` +
          // `${isMultiCity}` +
          // `&noOfRoute=1&lang=en&adults=` +
          // `${adults}` +
          // `&children=` +
          // `${children}` +
          // `&infants=` +
          // `${infants}` +
          // `&sharedMarket=` +
          // `${sharedMarket}` +
          // `&roundTripFaresFlag=` +
          // `${roundTripFaresFlag}` +
          // `&usePoints=` +
          // `false`, // KEEP FALSE, THIS IS CASH REQ NOT POINS
          referrerPolicy: "no-referrer-when-downgrade",
          body:
            `{"tripType":"` +
            `${tripType}` +
            `","from":"` +
            `${from}` +
            `","to":"` +
            `${to}` +
            `","depart":"` +
            `${dateToReplace}` +
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

      let url = await chrome.storage.local.get(["url"]);
      console.log(url);
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
          referrer: tabUrl.replace(
            "depart=2024-05-01",
            `depart=2024-${modDate(currentDepartDate.split(" ")[1])}-0${
              currentDepartDate.split(" ")[2]
            }`
          ),
          // `"https://www.jetblue.com/booking/flights?from=` +
          // `${from}` +
          // `&to=` +
          // `${to}` +
          // `&depart=` +
          // `${depart}` +
          // `&isMultiCity=` +
          // `${isMultiCity}` +
          // `&noOfRoute=1&lang=en&adults=` +
          // `${adults}` +
          // `&children=` +
          // `${children}` +
          // `&infants=` +
          // `${infants}` +
          // `&sharedMarket=` +
          // `${sharedMarket}` +
          // `&roundTripFaresFlag=` +
          // `${roundTripFaresFlag}` +
          // `&usePoints=` +
          // `true"`,
          referrerPolicy: "no-referrer-when-downgrade",
          body:
            `{"tripType":"` +
            `${tripType}` +
            `","from":"` +
            `${from}` +
            `","to":"` +
            `${to}` +
            `","depart":"` +
            `${dateToReplace}` +
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
