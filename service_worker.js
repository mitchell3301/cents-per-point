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
        // make sure it's request we want
        "https://jbrest.jetblue.com/lfs-rwb/outboundLFS"
      ) &&
      details.requestHeaders.find(({ name, value }) => {
        // make sure it's not the request that we make inorganically later in script
        return name === "sec-ch-ua";
      })
    ) {
      let tabUrl = await getTab();

      await new Promise((res) => {
        // HOPEFULLY TEMP SOLUTION
        setTimeout(() => {
          res();
        }, 1000);
      });

      let currentDepartDate = await chrome.storage.session.get([
        "currentDepartDate",
      ]);

      let originalDepartDate = await chrome.storage.session.get([
        "originalDepartDate",
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

      currentDepartDate = currentDepartDate.currentDepartDate;
      originalDepartDate = originalDepartDate.originalDepartDate;

      let dateToReplace = currentDepartDate;

      if (!currentDepartDate.includes("-")) {
        // Handle leading zero
        let day = null;
        if (currentDepartDate.split(" ")[2].length == 1) {
          // if day is between 1 and 9
          day = "0" + currentDepartDate.split(" ")[2];
        } else {
          day = currentDepartDate.split(" ")[2];
        }

        dateToReplace = `2024-${modDate(
          currentDepartDate.split(" ")[1]
        )}-${day}`;
      }

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
            .replace(originalDepartDate, dateToReplace),
          referrerPolicy: "no-referrer-when-downgrade",
          body:
            `{"tripType":"` +
            `${tripType}` +
            `","from":"` +
            `${from}` +
            `","to":"` +
            `${to}` +
            `","depart":"` +
            `${dateToReplace.replace("depart=", "")}` +
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
          referrer: tabUrl.replace(originalDepartDate, dateToReplace),
          referrerPolicy: "no-referrer-when-downgrade",
          body:
            `{"tripType":"` +
            `${tripType}` +
            `","from":"` +
            `${from}` +
            `","to":"` +
            `${to}` +
            `","depart":"` +
            `${dateToReplace.replace("depart=", "")}` +
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
  },
  { urls: ["https://*.jetblue.com/*"] },
  ["requestHeaders"]
);
