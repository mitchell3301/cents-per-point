let selectedDate = null;

// let dates = document.querySelectorAll(".jb-best-fare-date-box");

// for (let date of dates) {
//   date.addEventListener("click", () => {
//     //let intervalListener = setInterval(addCppLowestPoints, 1000)
//     addCppLowestPoints();
//   });
// }

const interval = setInterval(addCppLowestPoints, 1000);

addCppLowestPoints(interval);

// const originalDepartDate = document
//   .querySelector(".active")
//   .innerText.split("\n")[0];

const originalDepartDate = "Wed May 1";
console.log(originalDepartDate);

chrome.storage.session.set({
  originalDepartDate: originalDepartDate,
});

chrome.storage.session.set({
  currentDepartDate: originalDepartDate,
});

chrome.storage.session.get(["currentDepartDate"], (result) => {
  console.log("Retrieved name: " + result.currentDepartDate);
});

// function modDate(dateString) {
//   const parts = dateString.split(" ");
//   const day = parts[0]; // Wed
//   const month = parts[1]; // May
//   const date = parts[2]; // 1

//   const currentYear = new Date().getFullYear();
//   let year = currentYear;

//   const dayOfWeekMap = {
//     Sun: 0,
//     Mon: 1,
//     Tue: 2,
//     Wed: 3, // Wednesday is 3
//     Thu: 4,
//     Fri: 5,
//     Sat: 6,
//   };

//   const currentDay = new Date().getDay(); // Get current day index (0-6)
//   const targetDay = dayOfWeekMap[day]; // Get target day index
//   const daysToAdjust = (targetDay - currentDay + 7) % 7; // Calculate days to adjust for desired day

//   if (daysToAdjust > 3) {
//     year--; // If adjustment requires going to previous week, decrement year
//   }

//   const parsedDate = new Date(month + " " + date + ", " + year);
//   console.log(parsedDate);

//   return parsedDate;
// }

chrome.storage.onChanged.addListener((changes, areaName) => {
  for (const [key, value] of Object.entries(changes)) {
    if (key == "points" || key == "cash") {
      addCppLowestPoints();
    }
  }
});

/**
 *
 * addCppLowestPoints()
 *
 * @returns {*} flights, the array of flight objects created within func
 */
async function addCppLowestPoints(url) {
  let cash = await chrome.storage.session.get(["cash"]);

  let points = await chrome.storage.session.get(["points"]);
  console.log("here");

  if (cash === null && points === null) {
    console.log("nothing");
    return;
  } // return until values are detected from storage
  // console.log(cash);
  // console.log(points);

  // Remove any prev cpp added on previous runs
  if (document.querySelectorAll(".with-cpp")) {
    document.querySelectorAll(".with-cpp").forEach((e) => e.remove());
  } // if

  cash = cash.cash;
  points = points.points;

  cash = JSON.parse(cash);
  points = JSON.parse(points);

  // CREATE FLIGHTS ARRAY ----------------------------------------------------------------------------
  const flights = [];

  let webElements = document.querySelectorAll(".pointsText");
  let webElmementCodes = document.querySelectorAll(
    "#app-container-div .royal-blue.pointer.ng-star-inserted"
  );

  if (webElements.length > 0) {
    //console.log(webElements);
    if (interval) {
      clearInterval(interval);
    } // if
  } // if

  Array.from(document.querySelectorAll(".jb-best-fare-date-box")).map((elm) => {
    console.log(elm);
    elm.addEventListener("click", async () => {
      console.log(elm.innerText);
      await chrome.storage.session.set({
        currentDepartDate: elm.innerText.split("\n")[0],
      });

      chrome.storage.session.get(["originalDepartDate"], (result) => {
        console.log("Retrieved name: " + result.originalDepartDate);
      });

      chrome.storage.session.get(["currentDepartDate"], (result) => {
        console.log("Retrieved name: " + result.currentDepartDate);
      });

      // await new Promise((res) => {
      //   setTimeout(() => {
      //     res();
      //   }, 15000);
      // })
    });
  });

  for (let i = 0; i < cash.itinerary.length; i++) {
    for (let j = 0; j < cash.itinerary[i].bundles.length; j++) {
      if (cash.itinerary[i] != null && points.itinerary[i] != null) {
        if (cash.itinerary[i].id != 4) {
          let specCash = cash.itinerary[i];
          let specPoints = points.itinerary[i];

          // CHANGE SPEC CASH TO POINTS LATER
          // Create an object for each flight, with cash value and points value, along with other useful info

          // TEMP

          ///////////////TTTTTTTTTTTTTTTTTTTTTTTTT
          //if (specPoints.id == specCash.id) {
          let flight = {
            id: parseInt(specCash.id),
            pathId: specCash.bundles[j].id,
            to: specCash.to,
            from: specCash.from,
            seatCode: specCash.bundles[j].code,
            cash: parseInt(specCash.bundles[j].price),
            points: parseInt(specPoints.bundles[j].points),
            status: specCash.bundles[j].status,
            operatingAirlineCode: specCash.segments[0].operatingAirlineCode,
            operatingFlightno: specCash.segments[0].operatingFlightno,
          };

          console.log(flight);
          flights.push(flight);
          //}
        }
      }
    } // for j
  } // for i

  // Now that we have an array of objects that contains cash values and points values for every
  // ... flight, we can now loop through the web elements to attach cpp to the front facing singular
  // ... point value. We need to be sure that we pick the right cash value to match up however

  for (let k = 1; k < webElements.length; k++) {
    webElements[k - 1].style = "line-height: 1.7";
    console.log(
      webElements[k - 1].innerText
        .replaceAll(",", "")
        .replaceAll(" pts", "")
        .replaceAll(" ", "")
    );
    let webElementPoints = webElements[k - 1].innerText
      .replaceAll(",", "")
      .replaceAll(" pts", "")
      .replaceAll(" ", "");

    console.log(webElmementCodes[k - 1].innerText);
    //console.log(flight.operatingAirlineCode + " " + operatingFlightno);

    let matchedCash = flights
      .filter((flight) =>
        webElmementCodes[k - 1].innerText.includes(
          flight.operatingAirlineCode + " " + flight.operatingFlightno
        )
      ) // subset all flights to only 1, with all seat code options
      .filter((flight) => flight.points == webElementPoints)[0].cash; // change to match points from web element

    let cpp = (
      (parseInt(matchedCash) / parseInt(webElementPoints)) *
      100
    ).toFixed(2);

    let pointsElm = document.createElement("div");
    // pointsElm.innerText = document.querySelector;

    let cashElm = document.createElement("div");
    cashElm.innerText = "$" + matchedCash + " cash";
    cashElm.setAttribute("class", "with-cpp");

    let cppElm = document.createElement("div");
    cppElm.innerText = cpp + " cents/point";
    cppElm.setAttribute("class", "with-cpp");

    webElements[k - 1].appendChild(cashElm);
    webElements[k - 1].appendChild(cppElm);

    // Append to web element k - 1
  } // for k

  return flights;
} // addCppLowestPoints()

// async function getCash(headers) {
//   // To simulate the request, we must grab some parameters to fill in within the fetch
//   // tripType
//   // from
//   // to
//   // depart
//   // cabin

//   // let from = document.querySelector("#mainHeader .pr2");
//   // let to = document.querySelector("#mainHeader .pl2");
//   // let depart = "DATE OF REQ";
//   //console.log(headers[0]["X-1ItxWO9i-a"]);
//   // TEMP
//   let tripType = "oneWay";
//   let from = "JFK";
//   let to = "TPA";
//   let depart = "2024-05-01";
//   let isMultiCity = "false";
//   let adults = "1";
//   let children = "0";
//   let infants = "0";
//   let sharedMarket = "false";
//   let roundTripFaresFlag = "false";

//   let cabin = "economy";
//   let refundable = "false";

//   /**
//    * SIMULATE CASH REQUEST
//    */
//   console.log(headers);
//   console.log('"' + headers[0]["X-1ItxWO9i-a"] + '"');
//   console.log(headers[1]["X-1ItxWO9i-b"]);
//   console.log(headers[2]["X-1ItxWO9i-c"]);
//   console.log(headers[3]["X-1ItxWO9i-d"]);
//   console.log(headers[4]["X-1ItxWO9i-f"]);
//   console.log(headers[5]["X-1ItxWO9i-z"]);

//   console.log(
//     `https://www.jetblue.com/booking/flights?from=` +
//       `${from}` +
//       `&to=` +
//       `${to}` +
//       `&depart=` +
//       `${depart}` +
//       `&isMultiCity=` +
//       `${isMultiCity}` +
//       `&noOfRoute=1&lang=en&adults=` +
//       `${adults}` +
//       `&children=` +
//       `${children}` +
//       `&infants=` +
//       `${infants}` +
//       `&sharedMarket=` +
//       `${sharedMarket}` +
//       `&roundTripFaresFlag=` +
//       `${roundTripFaresFlag}` +
//       `&usePoints=` +
//       `false`
//   );
//   console.log(
//     `{"tripType":"` +
//       `${tripType}` +
//       `","from":"` +
//       `${from}` +
//       `","to":"` +
//       `${to}` +
//       `","depart":"` +
//       `${depart}` +
//       `","cabin":"` +
//       `${cabin}` +
//       `","refundable":` +
//       `${refundable}` +
//       `,"dates":{"before":"3","after":"3"},"pax":{"ADT":1,"CHD":0,"INF":0,"UNN":0},"redempoint":false,"pointsBreakup":{"option":"","value":0},"isMultiCity":false,"isDomestic":true}`
//   );

//   // const cash = await fetch("https://jbrest.jetblue.com/lfs-rwb/outboundLFS", {
//   //   headers: {
//   //     accept: "application/json",
//   //     "api-version": "v3",
//   //     "application-channel": "Desktop_Web",
//   //     "booking-application-type": "NGB",
//   //     "content-type": "application/json",
//   //     "x-1itxwo9i-a": '"' + headers[0]["X-1ItxWO9i-a"] + '"',
//   //     "x-1itxwo9i-b": '"' + headers[1]["X-1ItxWO9i-b"] + '"',
//   //     "x-1itxwo9i-c": '"' + headers[2]["X-1ItxWO9i-c"] + '"',
//   //     "x-1itxwo9i-d": '"' + headers[3]["X-1ItxWO9i-d"] + '"',
//   //     "x-1itxwo9i-f": '"' + headers[4]["X-1ItxWO9i-f"] + '"',
//   //     "x-1itxwo9i-z": '"' + headers[5]["X-1ItxWO9i-z"] + '"',
//   //   },
//   //   referrer:
//   //     `"https://www.jetblue.com/booking/flights?from=` +
//   //     `${from}` +
//   //     `&to=` +
//   //     `${to}` +
//   //     `&depart=` +
//   //     `${depart}` +
//   //     `&isMultiCity=` +
//   //     `${isMultiCity}` +
//   //     `&noOfRoute=1&lang=en&adults=` +
//   //     `${adults}` +
//   //     `&children=` +
//   //     `${children}` +
//   //     `&infants=` +
//   //     `${infants}` +
//   //     `&sharedMarket=` +
//   //     `${sharedMarket}` +
//   //     `&roundTripFaresFlag=` +
//   //     `${roundTripFaresFlag}` +
//   //     `&usePoints=` +
//   //     `false"`, // KEEP FALSE, THIS IS CASH REQ NOT POINS
//   //   referrerPolicy: "no-referrer-when-downgrade",
//   //   body:
//   //     `'{"tripType":"` +
//   //     `${tripType}` +
//   //     `","from":"` +
//   //     `${from}` +
//   //     `","to":"` +
//   //     `${to}` +
//   //     `","depart":"` +
//   //     `${depart}` +
//   //     `","cabin":"` +
//   //     `${cabin}` +
//   //     `","refundable":` +
//   //     `${refundable}` +
//   //     `,"dates":{"before":"3","after":"3"},"pax":{"ADT":1,"CHD":0,"INF":0,"UNN":0},"redempoint":false,"pointsBreakup":{"option":"","value":0},"isMultiCity":false,"isDomestic":true}'`,
//   //   method: "POST",
//   //   mode: "cors",
//   //   credentials: "omit",
//   // })
//   //   .then((response) => response.text())
//   //   .catch((error) => console.log("error", error));

//   const cash = await fetch("https://jbrest.jetblue.com/lfs-rwb/outboundLFS", {
//     headers: {
//       accept: "application/json",
//       "api-version": "v3",
//       "application-channel": "Desktop_Web",
//       "booking-application-type": "NGB",
//       "content-type": "application/json",
//       // "sec-ch-ua":
//       //   '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
//       // "sec-ch-ua-mobile": "?0",
//       // "sec-ch-ua-platform": '"Windows"',
//       "x-1itxwo9i-a":
//         "6jg-EQB8MxpII8Uja13yhqc-0iDM2_xVMvOKlhy6iDmxsCsADVyMFvPqF=cnmc_dg-q-P6_N-FDL5ZuZmMEe_UWaA8HTShMfi5vR6kWNH8Pb24jHjaaQb-LDW0MsMDvrRTVPlJ=QrHAb4YT7XQOoeRnghyJ16zcCc461nAtddPADUw0U-oG0V88Wcs_PEAdNpQ8hHM7HrBQwGBmelSDoJ6O8BHRzyb66pbTV8xmrRQGmnyy3Y7Po-pHZnorrGHhgmrp_uM_tt3sCZhZiRzLE-URkGTg5rxEbDNqvzLc3nBM2MAmpQdGZVyPVzP7fe10k=7jrYCGYFnBLMzdnt7fWAuP04qEAFO72LczZJlfgaRg8WODb=5SjRyVhsfDhPWtsWtOJVsTk_pEAcD444MLee2p1FcZ5fheXfUz2n2RgxlMIsQYqSgdqYygnEs7oysyNR325JLn2R7F=td7pN4bEXJLGJRR-1YYB5K7To=Ku_SrMgUmtJMMkpEORQ8r6h3tUIvcE6WEMCb-8wUsAlzGSdR42za0OldxjcQfzsE5KetBu72HBRWpJ3CNxhsN0qNtp6F0k8chXDpC88JGbmrcifqbCcykW2PBV-wrExogVB01ZBeboK-OdpgQ4EoZSACRTvXX7_JYRjtu3i4UnWKuHyv6CsrttuT8c5_w7tw1yT7X4QouiQChqB_USS=3io0rHgfpIuM838ucyCDHDywRAdsbog2M=qSnoJc=b3qR6mBM1UU-TuT8jC8dssIP8W8N5kcM7v4S76=AWftrOF6e654EhlgZLXy0QhcegsOIjFdgJ=P2hfo220OR4aVYaubOaoqTi7bMf56pQFw_hg0w802UUU=B0dLDtBA1bKEZXj7qL8U6MMXEfbh_48=6oA0Oz0MsrdwTypubmSxOYE3Oe7PNePqS3fe53WmeqJjX_BxPWL3WtRhi65ts0K-F1Ef=r_zt30sut3b3zC422AGEbXwALd5__=tCwa_h_Omdn24oMRhy74FfDnfU5_Bq6mbcc83FyfQradR703-H8WMSFD0a==qy_TrhYAwOFtd=nA65K_NEKWk2RdZwBurK8knKx1d7x_Sh2MM=4h6tcVIXQqBwAS-WGoBX8rIqtqULrmRrWbg_DNooD1JyeTtX5jfFIY3cKAAWOcvj1JDjmnb6lRUUIAe5WChrJd08cSBM1O7lfIkigGRnnwyyMOCgzYpGcUCwqh23rWX0wLoTHvinL8f_J7SPiHgUQiIAX1x5oNF7_J8JgIDrX0NzhJKDJ=3x6AsacmM0gCyVMZHAd-ARnL7kwW5lgPsVY8p5PhO-cNwarVi6egYgVLF_OB7IWZxNHXDnjC3CZXcJ6I7EGyf5JG-EnMEts=KmlbxMrPMgArSwy0O5tQg_uqY5fG6avgD2V_KDhJ0=Ohv-cdIXbLgCqbXFnXmRHxQIvwRa6d0KhuKmT5iVBLOAlpzwZkMxiyfwyz_BE3wlr1o_C6otVdL=OuN3NrymPe73NOrk0GN0JK5YCo4CUU582EeStNPFecrnzsG4EEYN3MWOguNk-AHMGWNcTR4txkUfzMtA8b6AkPwvn2MO7408D2dlOyQ7vw6TCHkAajSaw0FgK1X2Yezz5sEcczwoo55MC60DbymXVK6hjWPgcI_58skGOogi_wXnrebuWv_H55t233V8BqELXwdKijB6hI_K88m0ddDN8ZSf4dOO_EgFZJgk3U2vrDo3QOLcNEFQYJvQxls6WeDrzfks0uqM=5HJUhTBw-Lhh55joPtktZNGL6MLnm5jKSmMRHT8y3fyO4ZnI=Ym6-GZTA4YFsItR2amgtu-FuEAxEGJYRH2fO7PmuhoUw3w8We1Ztzjl18uT_LmO8Aq-T73Mu5JretlW-gLz4i8O1xXgpRYuvli=ZQndd_CpbYxl_CpFdBPKv6IIvnA56riV4T-Yn88CK6y0LwoXO4z-oT6qzKS8stH7Yz=Tewuz6EEFLnN8yWFMQRzKCXkFwW3xKT6HonfUlVN43y=ODou2GK=hYx-QQrbhS02RZ-1vcRVnw4HIxTJ5Ika-xXaU6o4Kuv8VGn2EOd60xW85-IRI07xzSbsacJk1SYZ1wvkyNy_ivUMd60GaMrE=XPbqqgyDNMYmOrXyRgr7pEBIas_Zpt_JayzNWwBwmpU0VqwB1EtAijKq0V43iNWIDLHTKL2le-2Z4mjowe2q0qra5H=h",
//       "x-1itxwo9i-b": "lis1eb",
//       "x-1itxwo9i-c":
//         "ACDIbLOMAQAADBp-viF38crBPEDWrahxoOCG-4d9gU1ge2PXCa0HUrONtNpS",
//       "x-1itxwo9i-d":
//         "ABaAhIDBCKGFgQGAAYIQgISigaIAwBGAzvpCzi_33wetB1KzjbTaUgAAAAByzJzLAIcg3m7RSMgCMSb1YOTcnGw",
//       "x-1itxwo9i-f":
//         "A1Thb7OMAQAAT6eDYPMyo1j9x4_J-OWJIVKhTg17Bs3AiQcr6KhyUqJtfRU_AUkmEOGucuKDwH8AAEB3AAAAAA==",
//       "x-1itxwo9i-z": "q",
//       // "x-b3-spanid": "1703817113261",
//       // "x-b3-traceid": "c8a06b4b96ec19b4",
//     },
//     referrer:
//       "https://www.jetblue.com/booking/flights?from=JFK&to=TPA&depart=2024-05-01&isMultiCity=false&noOfRoute=1&lang=en&adults=1&children=0&infants=0&sharedMarket=false&roundTripFaresFlag=false&usePoints=false",
//     referrerPolicy: "no-referrer-when-downgrade",
//     body: '{"tripType":"oneWay","from":"JFK","to":"TPA","depart":"2024-05-01","cabin":"economy","refundable":false,"dates":{"before":"3","after":"3"},"pax":{"ADT":1,"CHD":0,"INF":0,"UNN":0},"redempoint":false,"pointsBreakup":{"option":"","value":0},"isMultiCity":false,"isDomestic":true}',
//     method: "POST",
//     mode: "cors",
//     credentials: "omit",
//   })
//     .then((response) => response.text())
//     .catch((error) => console.log("error", error));

//   // HARDCODE FOR NOW

//   const cashUpdated = {
//     dategroup: [
//       {
//         to: "TPA",
//         from: "JFK",
//         group: [
//           {
//             uri: "/air/lfs/657e0821a0c1b577bade84f0/origins-destinations/1/departure-dates/2024-04-28",
//             date: "2024-04-28T00:00:00-04:00",
//             price: "108.90",
//           },
//           {
//             uri: "/air/lfs/657e0821a0c1b577bade84f0/origins-destinations/1/departure-dates/2024-04-29",
//             date: "2024-04-29T00:00:00-04:00",
//             price: "93.90",
//           },
//           {
//             uri: "/air/lfs/657e0821a0c1b577bade84f0/origins-destinations/1/departure-dates/2024-04-30",
//             date: "2024-04-30T00:00:00-04:00",
//             price: "93.90",
//           },
//           {
//             uri: "/air/lfs/657e0821a0c1b577bade84f0/origins-destinations/1/departure-dates/2024-05-01",
//             date: "2024-05-01T00:00:00-04:00",
//             price: "93.90",
//           },
//           {
//             uri: "/air/lfs/657e0821a0c1b577bade84f0/origins-destinations/1/departure-dates/2024-05-02",
//             date: "2024-05-02T00:00:00-04:00",
//             price: "108.90",
//           },
//           {
//             uri: "/air/lfs/657e0821a0c1b577bade84f0/origins-destinations/1/departure-dates/2024-05-03",
//             date: "2024-05-03T00:00:00-04:00",
//             price: "93.90",
//           },
//           {
//             uri: "/air/lfs/657e0821a0c1b577bade84f0/origins-destinations/1/departure-dates/2024-05-04",
//             date: "2024-05-04T00:00:00-04:00",
//             price: "N/A",
//           },
//         ],
//       },
//     ],
//     itinerary: [
//       {
//         id: "1",
//         sequenceID: "1",
//         from: "JFK",
//         to: "TPA",
//         depart: "2024-05-01T08:00:00-04:00",
//         arrive: "2024-05-01T10:55:00-04:00",
//         isOverNightFlight: false,
//         isQuickest: true,
//         duration: "PT2H55M",
//         arrivalOffset: "0",
//         bundles: [
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/1_1",
//             code: "BLUE_BASIC",
//             refundable: "false",
//             fareCode: "DN",
//             price: "93.90",
//             cabinclass: "Y",
//             bookingclass: "L",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/1_2",
//             code: "BLUE",
//             refundable: "false",
//             fareCode: "AN",
//             price: "118.90",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/1_3",
//             code: "BLUE_EXTRA",
//             refundable: "false",
//             fareCode: "GN",
//             price: "143.90",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/1_4",
//             code: "BLUE_REFUNDABLE",
//             refundable: "true",
//             fareCode: "AR",
//             price: "179.70",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/1_5",
//             code: "BLUE_EXTRA_REFUNDABLE",
//             refundable: "true",
//             fareCode: "GR",
//             price: "209.70",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//         ],
//         segments: [
//           {
//             id: "B6_1525_2024-05-01_JFK_TPA",
//             from: "JFK",
//             to: "TPA",
//             aircraft: "A320",
//             aircraftCode: "32M",
//             aircraftAmenityKey: "32M_B6_JFK_TPA",
//             stops: 0,
//             depart: "2024-05-01T08:00:00-04:00",
//             arrive: "2024-05-01T10:55:00-04:00",
//             flightno: "1525",
//             duration: "PT2H55M",
//             bookingclass: "U",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/1/flight-segments/B6_1525_2024-05-01_JFK_TPA:32M",
//             distance: 1005,
//             operatingFlightno: "1525",
//             throughFlightLegs: [
//               {
//                 departureAirport: "JFK",
//                 arrivalAirport: "TPA",
//                 departureTerminal: "5",
//                 duration: "PT2H55M",
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: "2",
//         sequenceID: "2",
//         from: "JFK",
//         to: "TPA",
//         depart: "2024-05-01T10:59:00-04:00",
//         arrive: "2024-05-01T13:54:00-04:00",
//         isOverNightFlight: false,
//         isQuickest: true,
//         duration: "PT2H55M",
//         arrivalOffset: "0",
//         bundles: [
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/2_6",
//             code: "BLUE_BASIC",
//             refundable: "false",
//             fareCode: "DN",
//             price: "93.90",
//             cabinclass: "Y",
//             bookingclass: "L",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/2_7",
//             code: "BLUE",
//             refundable: "false",
//             fareCode: "AN",
//             price: "118.90",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/2_8",
//             code: "BLUE_EXTRA",
//             refundable: "false",
//             fareCode: "GN",
//             price: "143.90",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/2_9",
//             code: "BLUE_REFUNDABLE",
//             refundable: "true",
//             fareCode: "AR",
//             price: "179.70",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/2_10",
//             code: "BLUE_EXTRA_REFUNDABLE",
//             refundable: "true",
//             fareCode: "GR",
//             price: "209.70",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//         ],
//         segments: [
//           {
//             id: "B6_2725_2024-05-01_JFK_TPA",
//             from: "JFK",
//             to: "TPA",
//             aircraft: "A220",
//             aircraftCode: "223",
//             aircraftAmenityKey: "223_B6_JFK_TPA",
//             stops: 0,
//             depart: "2024-05-01T10:59:00-04:00",
//             arrive: "2024-05-01T13:54:00-04:00",
//             flightno: "2725",
//             duration: "PT2H55M",
//             bookingclass: "U",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/2/flight-segments/B6_2725_2024-05-01_JFK_TPA:223",
//             distance: 1005,
//             operatingFlightno: "2725",
//             throughFlightLegs: [
//               {
//                 departureAirport: "JFK",
//                 arrivalAirport: "TPA",
//                 departureTerminal: "5",
//                 duration: "PT2H55M",
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: "3",
//         sequenceID: "3",
//         from: "JFK",
//         to: "TPA",
//         depart: "2024-05-01T20:10:00-04:00",
//         arrive: "2024-05-01T23:15:00-04:00",
//         isOverNightFlight: false,
//         isQuickest: true,
//         duration: "PT3H5M",
//         arrivalOffset: "0",
//         bundles: [
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/3_11",
//             code: "BLUE_BASIC",
//             refundable: "false",
//             fareCode: "DN",
//             price: "153.90",
//             cabinclass: "Y",
//             bookingclass: "L",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/3_12",
//             code: "BLUE",
//             refundable: "false",
//             fareCode: "AN",
//             price: "178.90",
//             cabinclass: "Y",
//             bookingclass: "M",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/3_13",
//             code: "BLUE_EXTRA",
//             refundable: "false",
//             fareCode: "GN",
//             price: "203.90",
//             cabinclass: "Y",
//             bookingclass: "M",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/3_14",
//             code: "BLUE_REFUNDABLE",
//             refundable: "true",
//             fareCode: "AR",
//             price: "251.70",
//             cabinclass: "Y",
//             bookingclass: "M",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/3_15",
//             code: "BLUE_EXTRA_REFUNDABLE",
//             refundable: "true",
//             fareCode: "GR",
//             price: "281.69",
//             cabinclass: "Y",
//             bookingclass: "M",
//             status: "AVAILABLE",
//           },
//         ],
//         segments: [
//           {
//             id: "B6_225_2024-05-01_JFK_TPA",
//             from: "JFK",
//             to: "TPA",
//             aircraft: "A220",
//             aircraftCode: "223",
//             aircraftAmenityKey: "223_B6_JFK_TPA",
//             stops: 0,
//             depart: "2024-05-01T20:10:00-04:00",
//             arrive: "2024-05-01T23:15:00-04:00",
//             flightno: "225",
//             duration: "PT3H5M",
//             bookingclass: "M",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/3/flight-segments/B6_225_2024-05-01_JFK_TPA:223",
//             distance: 1005,
//             operatingFlightno: "225",
//             throughFlightLegs: [
//               {
//                 departureAirport: "JFK",
//                 arrivalAirport: "TPA",
//                 departureTerminal: "5",
//                 duration: "PT3H5M",
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: "4",
//         sequenceID: "4",
//         from: "JFK",
//         to: "TPA",
//         connections: ["BOS"],
//         depart: "2024-05-01T06:30:00-04:00",
//         arrive: "2024-05-01T13:27:00-04:00",
//         isOverNightFlight: false,
//         isQuickest: false,
//         duration: "PT6H57M",
//         arrivalOffset: "0",
//         bundles: [
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/4_16",
//             code: "BLUE_BASIC",
//             refundable: "false",
//             fareCode: "DN",
//             price: "242.20",
//             cabinclass: "Y",
//             bookingclass: "L",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/4_17",
//             code: "BLUE",
//             refundable: "false",
//             fareCode: "AN",
//             price: "277.21",
//             cabinclass: "Y",
//             bookingclass: "Z",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/4_18",
//             code: "BLUE_EXTRA",
//             refundable: "false",
//             fareCode: "GN",
//             price: "302.21",
//             cabinclass: "Y",
//             bookingclass: "Z",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/4_19",
//             code: "BLUE_REFUNDABLE",
//             refundable: "true",
//             fareCode: "AR",
//             price: "367.81",
//             cabinclass: "Y",
//             bookingclass: "Z",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/4_20",
//             code: "BLUE_EXTRA_REFUNDABLE",
//             refundable: "true",
//             fareCode: "GR",
//             price: "397.81",
//             cabinclass: "Y",
//             bookingclass: "Z",
//             status: "AVAILABLE",
//           },
//         ],
//         segments: [
//           {
//             id: "B6_518_2024-05-01_JFK_BOS",
//             from: "JFK",
//             to: "BOS",
//             aircraft: "E190",
//             aircraftCode: "E90",
//             aircraftAmenityKey: "E90_B6_BOS_JFK",
//             stops: 0,
//             depart: "2024-05-01T06:30:00-04:00",
//             arrive: "2024-05-01T07:41:00-04:00",
//             flightno: "518",
//             duration: "PT1H11M",
//             layover: "PT2H31M",
//             bookingclass: "Z",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/4/flight-segments/B6_518_2024-05-01_JFK_BOS:E90",
//             distance: 187,
//             operatingFlightno: "518",
//             throughFlightLegs: [
//               {
//                 departureAirport: "JFK",
//                 arrivalAirport: "BOS",
//                 departureTerminal: "5",
//                 arrivalTerminal: "C",
//                 duration: "PT1H11M",
//               },
//             ],
//           },
//           {
//             id: "B6_891_2024-05-01_BOS_TPA",
//             from: "BOS",
//             to: "TPA",
//             aircraft: "A320",
//             aircraftCode: "32M",
//             aircraftAmenityKey: "32M_B6_BOS_TPA",
//             stops: 0,
//             depart: "2024-05-01T10:12:00-04:00",
//             arrive: "2024-05-01T13:27:00-04:00",
//             flightno: "891",
//             duration: "PT3H15M",
//             bookingclass: "Z",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/4/flight-segments/B6_891_2024-05-01_BOS_TPA:32M",
//             distance: 1185,
//             operatingFlightno: "891",
//             throughFlightLegs: [
//               {
//                 departureAirport: "BOS",
//                 arrivalAirport: "TPA",
//                 departureTerminal: "C",
//                 duration: "PT3H15M",
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: "5",
//         sequenceID: "5",
//         from: "JFK",
//         to: "TPA",
//         connections: ["FLL"],
//         depart: "2024-05-01T08:10:00-04:00",
//         arrive: "2024-05-01T14:50:00-04:00",
//         isOverNightFlight: false,
//         isQuickest: false,
//         duration: "PT6H40M",
//         arrivalOffset: "0",
//         bundles: [
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/5_21",
//             code: "BLUE",
//             refundable: "false",
//             fareCode: "AN",
//             price: "314.20",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/5_22",
//             code: "BLUE_REFUNDABLE",
//             refundable: "true",
//             fareCode: "AR",
//             price: "1356.20",
//             cabinclass: "Y",
//             bookingclass: "Y",
//             status: "AVAILABLE",
//           },
//         ],
//         segments: [
//           {
//             id: "B6_1_2024-05-01_JFK_FLL",
//             from: "JFK",
//             to: "FLL",
//             aircraft: "A320",
//             aircraftCode: "32M",
//             aircraftAmenityKey: "32M_B6_FLL_JFK",
//             stops: 0,
//             depart: "2024-05-01T08:10:00-04:00",
//             arrive: "2024-05-01T11:22:00-04:00",
//             flightno: "1",
//             duration: "PT3H12M",
//             layover: "PT2H13M",
//             bookingclass: "Y",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/5/flight-segments/B6_1_2024-05-01_JFK_FLL:32M",
//             distance: 1069,
//             operatingFlightno: "1",
//             throughFlightLegs: [
//               {
//                 departureAirport: "JFK",
//                 arrivalAirport: "FLL",
//                 departureTerminal: "5",
//                 arrivalTerminal: "3",
//                 duration: "PT3H12M",
//               },
//             ],
//           },
//           {
//             id: "B6_5492_2024-05-01_FLL_TPA",
//             from: "FLL",
//             to: "TPA",
//             aircraft: "ATR 42 Turboprop",
//             aircraftCode: "AT4",
//             aircraftAmenityKey: "AT4_3M_FLL_TPA",
//             stops: 0,
//             depart: "2024-05-01T13:35:00-04:00",
//             arrive: "2024-05-01T14:50:00-04:00",
//             flightno: "5492",
//             duration: "PT1H15M",
//             bookingclass: "Q",
//             cabinclass: "Y",
//             operatingAirlineCode: "3M",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "Silver Airways",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "Silver Airways",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/5/flight-segments/B6_5492_2024-05-01_FLL_TPA:AT4",
//             distance: 197,
//             operatingFlightno: "92",
//             throughFlightLegs: [
//               {
//                 departureAirport: "FLL",
//                 arrivalAirport: "TPA",
//                 departureTerminal: "1",
//                 duration: "PT1H15M",
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: "6",
//         sequenceID: "6",
//         from: "JFK",
//         to: "TPA",
//         connections: ["BOS"],
//         depart: "2024-05-01T12:10:00-04:00",
//         arrive: "2024-05-01T19:41:00-04:00",
//         isOverNightFlight: false,
//         isQuickest: false,
//         duration: "PT7H31M",
//         arrivalOffset: "0",
//         bundles: [
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/6_23",
//             code: "BLUE_BASIC",
//             refundable: "false",
//             fareCode: "DN",
//             price: "128.21",
//             cabinclass: "Y",
//             bookingclass: "L",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/6_24",
//             code: "BLUE",
//             refundable: "false",
//             fareCode: "AN",
//             price: "153.21",
//             cabinclass: "Y",
//             bookingclass: "S",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/6_25",
//             code: "BLUE_EXTRA",
//             refundable: "false",
//             fareCode: "GN",
//             price: "178.22",
//             cabinclass: "Y",
//             bookingclass: "S",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/6_26",
//             code: "BLUE_REFUNDABLE",
//             refundable: "true",
//             fareCode: "AR",
//             price: "219.01",
//             cabinclass: "Y",
//             bookingclass: "S",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/6_27",
//             code: "BLUE_EXTRA_REFUNDABLE",
//             refundable: "true",
//             fareCode: "GR",
//             price: "249.01",
//             cabinclass: "Y",
//             bookingclass: "S",
//             status: "AVAILABLE",
//           },
//         ],
//         segments: [
//           {
//             id: "B6_618_2024-05-01_JFK_BOS",
//             from: "JFK",
//             to: "BOS",
//             aircraft: "E190",
//             aircraftCode: "E90",
//             aircraftAmenityKey: "E90_B6_BOS_JFK",
//             stops: 0,
//             depart: "2024-05-01T12:10:00-04:00",
//             arrive: "2024-05-01T13:25:00-04:00",
//             flightno: "618",
//             duration: "PT1H15M",
//             layover: "PT2H51M",
//             bookingclass: "S",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/6/flight-segments/B6_618_2024-05-01_JFK_BOS:E90",
//             distance: 187,
//             operatingFlightno: "618",
//             throughFlightLegs: [
//               {
//                 departureAirport: "JFK",
//                 arrivalAirport: "BOS",
//                 departureTerminal: "5",
//                 arrivalTerminal: "C",
//                 duration: "PT1H15M",
//               },
//             ],
//           },
//           {
//             id: "B6_591_2024-05-01_BOS_TPA",
//             from: "BOS",
//             to: "TPA",
//             aircraft: "A321",
//             aircraftCode: "321",
//             aircraftAmenityKey: "321_B6_BOS_TPA",
//             stops: 0,
//             depart: "2024-05-01T16:16:00-04:00",
//             arrive: "2024-05-01T19:41:00-04:00",
//             flightno: "591",
//             duration: "PT3H25M",
//             bookingclass: "S",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/6/flight-segments/B6_591_2024-05-01_BOS_TPA:321",
//             distance: 1185,
//             operatingFlightno: "591",
//             throughFlightLegs: [
//               {
//                 departureAirport: "BOS",
//                 arrivalAirport: "TPA",
//                 departureTerminal: "C",
//                 duration: "PT3H25M",
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: "7",
//         sequenceID: "7",
//         from: "JFK",
//         to: "TPA",
//         connections: ["SJU"],
//         depart: "2024-05-01T13:05:00-04:00",
//         arrive: "2024-05-01T23:59:00-04:00",
//         isOverNightFlight: false,
//         isQuickest: false,
//         duration: "PT10H54M",
//         arrivalOffset: "0",
//         bundles: [
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/7_28",
//             code: "BLUE_BASIC",
//             refundable: "false",
//             fareCode: "DN",
//             price: "303.20",
//             cabinclass: "Y",
//             bookingclass: "L",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/7_29",
//             code: "BLUE",
//             refundable: "false",
//             fareCode: "AN",
//             price: "362.33",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/7_30",
//             code: "BLUE_EXTRA",
//             refundable: "false",
//             fareCode: "GN",
//             price: "416.08",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/7_31",
//             code: "BLUE_REFUNDABLE",
//             refundable: "true",
//             fareCode: "AR",
//             price: "510.91",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/7_32",
//             code: "BLUE_EXTRA_REFUNDABLE",
//             refundable: "true",
//             fareCode: "GR",
//             price: "575.41",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//         ],
//         segments: [
//           {
//             id: "B6_503_2024-05-01_JFK_SJU",
//             from: "JFK",
//             to: "SJU",
//             aircraft: "A321",
//             aircraftCode: "321",
//             aircraftAmenityKey: "321_B6_JFK_SJU",
//             stops: 0,
//             depart: "2024-05-01T13:05:00-04:00",
//             arrive: "2024-05-01T17:02:00-04:00",
//             flightno: "503",
//             duration: "PT3H57M",
//             layover: "PT3H54M",
//             bookingclass: "U",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/7/flight-segments/B6_503_2024-05-01_JFK_SJU:321",
//             distance: 1597,
//             operatingFlightno: "503",
//             throughFlightLegs: [
//               {
//                 departureAirport: "JFK",
//                 arrivalAirport: "SJU",
//                 departureTerminal: "5",
//                 arrivalTerminal: "A",
//                 duration: "PT3H57M",
//               },
//             ],
//           },
//           {
//             id: "B6_2752_2024-05-01_SJU_TPA",
//             from: "SJU",
//             to: "TPA",
//             aircraft: "A321",
//             aircraftCode: "321",
//             aircraftAmenityKey: "321_B6_SJU_TPA",
//             stops: 0,
//             depart: "2024-05-01T20:56:00-04:00",
//             arrive: "2024-05-01T23:59:00-04:00",
//             flightno: "2752",
//             duration: "PT3H3M",
//             bookingclass: "Z",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/7/flight-segments/B6_2752_2024-05-01_SJU_TPA:321",
//             distance: 1237,
//             operatingFlightno: "2752",
//             throughFlightLegs: [
//               {
//                 departureAirport: "SJU",
//                 arrivalAirport: "TPA",
//                 departureTerminal: "A",
//                 duration: "PT3H3M",
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: "8",
//         sequenceID: "8",
//         from: "JFK",
//         to: "TPA",
//         connections: ["BOS"],
//         depart: "2024-05-01T14:00:00-04:00",
//         arrive: "2024-05-01T19:41:00-04:00",
//         isOverNightFlight: false,
//         isQuickest: false,
//         duration: "PT5H41M",
//         arrivalOffset: "0",
//         bundles: [
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/8_33",
//             code: "BLUE_BASIC",
//             refundable: "false",
//             fareCode: "DN",
//             price: "128.21",
//             cabinclass: "Y",
//             bookingclass: "L",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/8_34",
//             code: "BLUE",
//             refundable: "false",
//             fareCode: "AN",
//             price: "153.21",
//             cabinclass: "Y",
//             bookingclass: "S",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/8_35",
//             code: "BLUE_EXTRA",
//             refundable: "false",
//             fareCode: "GN",
//             price: "178.22",
//             cabinclass: "Y",
//             bookingclass: "S",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/8_36",
//             code: "BLUE_REFUNDABLE",
//             refundable: "true",
//             fareCode: "AR",
//             price: "219.01",
//             cabinclass: "Y",
//             bookingclass: "S",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/8_37",
//             code: "BLUE_EXTRA_REFUNDABLE",
//             refundable: "true",
//             fareCode: "GR",
//             price: "249.01",
//             cabinclass: "Y",
//             bookingclass: "S",
//             status: "AVAILABLE",
//           },
//         ],
//         segments: [
//           {
//             id: "B6_818_2024-05-01_JFK_BOS",
//             from: "JFK",
//             to: "BOS",
//             aircraft: "E190",
//             aircraftCode: "E90",
//             aircraftAmenityKey: "E90_B6_BOS_JFK",
//             stops: 0,
//             depart: "2024-05-01T14:00:00-04:00",
//             arrive: "2024-05-01T15:21:00-04:00",
//             flightno: "818",
//             duration: "PT1H21M",
//             layover: "PT55M",
//             bookingclass: "S",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/8/flight-segments/B6_818_2024-05-01_JFK_BOS:E90",
//             distance: 187,
//             operatingFlightno: "818",
//             throughFlightLegs: [
//               {
//                 departureAirport: "JFK",
//                 arrivalAirport: "BOS",
//                 departureTerminal: "5",
//                 arrivalTerminal: "C",
//                 duration: "PT1H21M",
//               },
//             ],
//           },
//           {
//             id: "B6_591_2024-05-01_BOS_TPA",
//             from: "BOS",
//             to: "TPA",
//             aircraft: "A321",
//             aircraftCode: "321",
//             aircraftAmenityKey: "321_B6_BOS_TPA",
//             stops: 0,
//             depart: "2024-05-01T16:16:00-04:00",
//             arrive: "2024-05-01T19:41:00-04:00",
//             flightno: "591",
//             duration: "PT3H25M",
//             bookingclass: "S",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/8/flight-segments/B6_591_2024-05-01_BOS_TPA:321",
//             distance: 1185,
//             operatingFlightno: "591",
//             throughFlightLegs: [
//               {
//                 departureAirport: "BOS",
//                 arrivalAirport: "TPA",
//                 departureTerminal: "C",
//                 duration: "PT3H25M",
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: "9",
//         sequenceID: "9",
//         from: "JFK",
//         to: "TPA",
//         connections: ["BOS"],
//         depart: "2024-05-01T16:30:00-04:00",
//         arrive: "2024-05-01T23:31:00-04:00",
//         isOverNightFlight: false,
//         isQuickest: false,
//         duration: "PT7H1M",
//         arrivalOffset: "0",
//         bundles: [
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/9_38",
//             code: "BLUE_BASIC",
//             refundable: "false",
//             fareCode: "DN",
//             price: "160.21",
//             cabinclass: "Y",
//             bookingclass: "L",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/9_39",
//             code: "BLUE",
//             refundable: "false",
//             fareCode: "AN",
//             price: "185.21",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/9_40",
//             code: "BLUE_EXTRA",
//             refundable: "false",
//             fareCode: "GN",
//             price: "210.21",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/9_41",
//             code: "BLUE_REFUNDABLE",
//             refundable: "true",
//             fareCode: "AR",
//             price: "257.41",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/9_42",
//             code: "BLUE_EXTRA_REFUNDABLE",
//             refundable: "true",
//             fareCode: "GR",
//             price: "287.40",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//         ],
//         segments: [
//           {
//             id: "B6_718_2024-05-01_JFK_BOS",
//             from: "JFK",
//             to: "BOS",
//             aircraft: "E190",
//             aircraftCode: "E90",
//             aircraftAmenityKey: "E90_B6_BOS_JFK",
//             stops: 0,
//             depart: "2024-05-01T16:30:00-04:00",
//             arrive: "2024-05-01T18:00:00-04:00",
//             flightno: "718",
//             duration: "PT1H30M",
//             layover: "PT2H15M",
//             bookingclass: "U",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/9/flight-segments/B6_718_2024-05-01_JFK_BOS:E90",
//             distance: 187,
//             operatingFlightno: "718",
//             throughFlightLegs: [
//               {
//                 departureAirport: "JFK",
//                 arrivalAirport: "BOS",
//                 departureTerminal: "5",
//                 arrivalTerminal: "C",
//                 duration: "PT1H30M",
//               },
//             ],
//           },
//           {
//             id: "B6_691_2024-05-01_BOS_TPA",
//             from: "BOS",
//             to: "TPA",
//             aircraft: "A320",
//             aircraftCode: "32M",
//             aircraftAmenityKey: "32M_B6_BOS_TPA",
//             stops: 0,
//             depart: "2024-05-01T20:15:00-04:00",
//             arrive: "2024-05-01T23:31:00-04:00",
//             flightno: "691",
//             duration: "PT3H16M",
//             bookingclass: "U",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/9/flight-segments/B6_691_2024-05-01_BOS_TPA:32M",
//             distance: 1185,
//             operatingFlightno: "691",
//             throughFlightLegs: [
//               {
//                 departureAirport: "BOS",
//                 arrivalAirport: "TPA",
//                 departureTerminal: "C",
//                 duration: "PT3H16M",
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: "10",
//         sequenceID: "10",
//         from: "JFK",
//         to: "TPA",
//         connections: ["BOS"],
//         depart: "2024-05-01T17:30:00-04:00",
//         arrive: "2024-05-01T23:31:00-04:00",
//         isOverNightFlight: false,
//         isQuickest: false,
//         duration: "PT6H1M",
//         arrivalOffset: "0",
//         bundles: [
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/10_43",
//             code: "BLUE_BASIC",
//             refundable: "false",
//             fareCode: "DN",
//             price: "160.21",
//             cabinclass: "Y",
//             bookingclass: "L",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/10_44",
//             code: "BLUE",
//             refundable: "false",
//             fareCode: "AN",
//             price: "185.21",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/10_45",
//             code: "BLUE_EXTRA",
//             refundable: "false",
//             fareCode: "GN",
//             price: "210.21",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/10_46",
//             code: "BLUE_REFUNDABLE",
//             refundable: "true",
//             fareCode: "AR",
//             price: "257.41",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/10_47",
//             code: "BLUE_EXTRA_REFUNDABLE",
//             refundable: "true",
//             fareCode: "GR",
//             price: "287.40",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//         ],
//         segments: [
//           {
//             id: "B6_1118_2024-05-01_JFK_BOS",
//             from: "JFK",
//             to: "BOS",
//             aircraft: "E190",
//             aircraftCode: "E90",
//             aircraftAmenityKey: "E90_B6_BOS_JFK",
//             stops: 0,
//             depart: "2024-05-01T17:30:00-04:00",
//             arrive: "2024-05-01T19:01:00-04:00",
//             flightno: "1118",
//             duration: "PT1H31M",
//             layover: "PT1H14M",
//             bookingclass: "U",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/10/flight-segments/B6_1118_2024-05-01_JFK_BOS:E90",
//             distance: 187,
//             operatingFlightno: "1118",
//             throughFlightLegs: [
//               {
//                 departureAirport: "JFK",
//                 arrivalAirport: "BOS",
//                 departureTerminal: "5",
//                 arrivalTerminal: "C",
//                 duration: "PT1H31M",
//               },
//             ],
//           },
//           {
//             id: "B6_691_2024-05-01_BOS_TPA",
//             from: "BOS",
//             to: "TPA",
//             aircraft: "A320",
//             aircraftCode: "32M",
//             aircraftAmenityKey: "32M_B6_BOS_TPA",
//             stops: 0,
//             depart: "2024-05-01T20:15:00-04:00",
//             arrive: "2024-05-01T23:31:00-04:00",
//             flightno: "691",
//             duration: "PT3H16M",
//             bookingclass: "U",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/10/flight-segments/B6_691_2024-05-01_BOS_TPA:32M",
//             distance: 1185,
//             operatingFlightno: "691",
//             throughFlightLegs: [
//               {
//                 departureAirport: "BOS",
//                 arrivalAirport: "TPA",
//                 departureTerminal: "C",
//                 duration: "PT3H16M",
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: "11",
//         sequenceID: "11",
//         from: "JFK",
//         to: "TPA",
//         connections: ["BOS"],
//         depart: "2024-05-01T22:50:00-04:00",
//         arrive: "2024-05-02T10:38:00-04:00",
//         isOverNightFlight: true,
//         isQuickest: false,
//         duration: "PT11H48M",
//         arrivalOffset: "1",
//         bundles: [
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/11_48",
//             code: "BLUE_BASIC",
//             refundable: "false",
//             fareCode: "DN",
//             price: "307.81",
//             cabinclass: "Y",
//             bookingclass: "L",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/11_49",
//             code: "BLUE",
//             refundable: "false",
//             fareCode: "AN",
//             price: "357.79",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/11_50",
//             code: "BLUE_EXTRA",
//             refundable: "false",
//             fareCode: "GN",
//             price: "417.80",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/11_51",
//             code: "BLUE_REFUNDABLE",
//             refundable: "true",
//             fareCode: "AR",
//             price: "503.39",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/11_52",
//             code: "BLUE_EXTRA_REFUNDABLE",
//             refundable: "true",
//             fareCode: "GR",
//             price: "575.41",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//         ],
//         segments: [
//           {
//             id: "B6_1318_2024-05-01_JFK_BOS",
//             from: "JFK",
//             to: "BOS",
//             aircraft: "A320",
//             aircraftCode: "32M",
//             aircraftAmenityKey: "32M_B6_BOS_JFK",
//             stops: 0,
//             depart: "2024-05-01T22:50:00-04:00",
//             arrive: "2024-05-02T00:14:00-04:00",
//             flightno: "1318",
//             duration: "PT1H24M",
//             layover: "PT7H6M",
//             bookingclass: "U",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/11/flight-segments/B6_1318_2024-05-01_JFK_BOS:32M",
//             distance: 187,
//             operatingFlightno: "1318",
//             throughFlightLegs: [
//               {
//                 departureAirport: "JFK",
//                 arrivalAirport: "BOS",
//                 departureTerminal: "5",
//                 arrivalTerminal: "C",
//                 duration: "PT1H24M",
//               },
//             ],
//           },
//           {
//             id: "B6_391_2024-05-02_BOS_TPA",
//             from: "BOS",
//             to: "TPA",
//             aircraft: "A320",
//             aircraftCode: "32M",
//             aircraftAmenityKey: "32M_B6_BOS_TPA",
//             stops: 0,
//             depart: "2024-05-02T07:20:00-04:00",
//             arrive: "2024-05-02T10:38:00-04:00",
//             flightno: "391",
//             duration: "PT3H18M",
//             bookingclass: "W",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/11/flight-segments/B6_391_2024-05-02_BOS_TPA:32M",
//             distance: 1185,
//             operatingFlightno: "391",
//             throughFlightLegs: [
//               {
//                 departureAirport: "BOS",
//                 arrivalAirport: "TPA",
//                 departureTerminal: "C",
//                 duration: "PT3H18M",
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: "12",
//         sequenceID: "12",
//         from: "JFK",
//         to: "TPA",
//         connections: ["FLL"],
//         depart: "2024-05-01T06:00:00-04:00",
//         arrive: "2024-05-01T14:50:00-04:00",
//         isOverNightFlight: false,
//         isQuickest: false,
//         duration: "PT8H50M",
//         arrivalOffset: "0",
//         bundles: [
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/12_53",
//             code: "BLUE",
//             refundable: "false",
//             fareCode: "AN",
//             price: "314.80",
//             cabinclass: "Y",
//             bookingclass: "S",
//             status: "AVAILABLE",
//           },
//         ],
//         segments: [
//           {
//             id: "B6_601_2024-05-01_JFK_FLL",
//             from: "JFK",
//             to: "FLL",
//             aircraft: "A321",
//             aircraftCode: "3N1",
//             aircraftAmenityKey: "3N1_B6_FLL_JFK",
//             stops: 0,
//             depart: "2024-05-01T06:00:00-04:00",
//             arrive: "2024-05-01T09:01:00-04:00",
//             flightno: "601",
//             duration: "PT3H1M",
//             layover: "PT4H34M",
//             bookingclass: "S",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/12/flight-segments/B6_601_2024-05-01_JFK_FLL:3N1",
//             distance: 1069,
//             operatingFlightno: "601",
//             throughFlightLegs: [
//               {
//                 departureAirport: "JFK",
//                 arrivalAirport: "FLL",
//                 departureTerminal: "5",
//                 arrivalTerminal: "3",
//                 duration: "PT3H1M",
//               },
//             ],
//           },
//           {
//             id: "B6_5492_2024-05-01_FLL_TPA",
//             from: "FLL",
//             to: "TPA",
//             aircraft: "ATR 42 Turboprop",
//             aircraftCode: "AT4",
//             aircraftAmenityKey: "AT4_3M_FLL_TPA",
//             stops: 0,
//             depart: "2024-05-01T13:35:00-04:00",
//             arrive: "2024-05-01T14:50:00-04:00",
//             flightno: "5492",
//             duration: "PT1H15M",
//             bookingclass: "Q",
//             cabinclass: "Y",
//             operatingAirlineCode: "3M",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "Silver Airways",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "Silver Airways",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/12/flight-segments/B6_5492_2024-05-01_FLL_TPA:AT4",
//             distance: 197,
//             operatingFlightno: "92",
//             throughFlightLegs: [
//               {
//                 departureAirport: "FLL",
//                 arrivalAirport: "TPA",
//                 departureTerminal: "1",
//                 duration: "PT1H15M",
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: "13",
//         sequenceID: "13",
//         from: "JFK",
//         to: "TPA",
//         connections: ["SJU"],
//         depart: "2024-05-01T15:30:00-04:00",
//         arrive: "2024-05-01T23:59:00-04:00",
//         isOverNightFlight: false,
//         isQuickest: false,
//         duration: "PT8H29M",
//         arrivalOffset: "0",
//         bundles: [
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/13_54",
//             code: "BLUE_BASIC",
//             refundable: "false",
//             fareCode: "DN",
//             price: "303.20",
//             cabinclass: "Y",
//             bookingclass: "L",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/13_55",
//             code: "BLUE",
//             refundable: "false",
//             fareCode: "AN",
//             price: "362.33",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/13_56",
//             code: "BLUE_EXTRA",
//             refundable: "false",
//             fareCode: "GN",
//             price: "416.08",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/13_57",
//             code: "BLUE_REFUNDABLE",
//             refundable: "true",
//             fareCode: "AR",
//             price: "510.91",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/13_58",
//             code: "BLUE_EXTRA_REFUNDABLE",
//             refundable: "true",
//             fareCode: "GR",
//             price: "575.41",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//         ],
//         segments: [
//           {
//             id: "B6_803_2024-05-01_JFK_SJU",
//             from: "JFK",
//             to: "SJU",
//             aircraft: "A321",
//             aircraftCode: "321",
//             aircraftAmenityKey: "321_B6_JFK_SJU",
//             stops: 0,
//             depart: "2024-05-01T15:30:00-04:00",
//             arrive: "2024-05-01T19:26:00-04:00",
//             flightno: "803",
//             duration: "PT3H56M",
//             layover: "PT1H30M",
//             bookingclass: "U",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/13/flight-segments/B6_803_2024-05-01_JFK_SJU:321",
//             distance: 1597,
//             operatingFlightno: "803",
//             throughFlightLegs: [
//               {
//                 departureAirport: "JFK",
//                 arrivalAirport: "SJU",
//                 departureTerminal: "5",
//                 arrivalTerminal: "A",
//                 duration: "PT3H56M",
//               },
//             ],
//           },
//           {
//             id: "B6_2752_2024-05-01_SJU_TPA",
//             from: "SJU",
//             to: "TPA",
//             aircraft: "A321",
//             aircraftCode: "321",
//             aircraftAmenityKey: "321_B6_SJU_TPA",
//             stops: 0,
//             depart: "2024-05-01T20:56:00-04:00",
//             arrive: "2024-05-01T23:59:00-04:00",
//             flightno: "2752",
//             duration: "PT3H3M",
//             bookingclass: "Z",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/13/flight-segments/B6_2752_2024-05-01_SJU_TPA:321",
//             distance: 1237,
//             operatingFlightno: "2752",
//             throughFlightLegs: [
//               {
//                 departureAirport: "SJU",
//                 arrivalAirport: "TPA",
//                 departureTerminal: "A",
//                 duration: "PT3H3M",
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: "14",
//         sequenceID: "14",
//         from: "JFK",
//         to: "TPA",
//         connections: ["BOS", "FLL"],
//         depart: "2024-05-01T21:35:00-04:00",
//         arrive: "2024-05-02T17:25:00-04:00",
//         isOverNightFlight: true,
//         isQuickest: false,
//         duration: "PT19H50M",
//         arrivalOffset: "1",
//         bundles: [
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/14_59",
//             code: "BLUE",
//             refundable: "false",
//             fareCode: "AN",
//             price: "475.10",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//         ],
//         segments: [
//           {
//             id: "B6_318_2024-05-01_JFK_BOS",
//             from: "JFK",
//             to: "BOS",
//             aircraft: "E190",
//             aircraftCode: "E90",
//             aircraftAmenityKey: "E90_B6_BOS_JFK",
//             stops: 0,
//             depart: "2024-05-01T21:35:00-04:00",
//             arrive: "2024-05-01T22:56:00-04:00",
//             flightno: "318",
//             duration: "PT1H21M",
//             layover: "PT7H4M",
//             bookingclass: "U",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/14/flight-segments/B6_318_2024-05-01_JFK_BOS:E90",
//             distance: 187,
//             operatingFlightno: "318",
//             throughFlightLegs: [
//               {
//                 departureAirport: "JFK",
//                 arrivalAirport: "BOS",
//                 departureTerminal: "5",
//                 arrivalTerminal: "C",
//                 duration: "PT1H21M",
//               },
//             ],
//           },
//           {
//             id: "B6_569_2024-05-02_BOS_FLL",
//             from: "BOS",
//             to: "FLL",
//             aircraft: "A321",
//             aircraftCode: "321",
//             aircraftAmenityKey: "321_B6_BOS_FLL",
//             stops: 0,
//             depart: "2024-05-02T06:00:00-04:00",
//             arrive: "2024-05-02T09:20:00-04:00",
//             flightno: "569",
//             duration: "PT3H20M",
//             layover: "PT6H50M",
//             bookingclass: "W",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/14/flight-segments/B6_569_2024-05-02_BOS_FLL:321",
//             distance: 1237,
//             operatingFlightno: "569",
//             throughFlightLegs: [
//               {
//                 departureAirport: "BOS",
//                 arrivalAirport: "FLL",
//                 departureTerminal: "C",
//                 arrivalTerminal: "3",
//                 duration: "PT3H20M",
//               },
//             ],
//           },
//           {
//             id: "B6_5492_2024-05-02_FLL_TPA",
//             from: "FLL",
//             to: "TPA",
//             aircraft: "ATR 42 Turboprop",
//             aircraftCode: "AT4",
//             aircraftAmenityKey: "AT4_3M_FLL_TPA",
//             stops: 0,
//             depart: "2024-05-02T16:10:00-04:00",
//             arrive: "2024-05-02T17:25:00-04:00",
//             flightno: "5492",
//             duration: "PT1H15M",
//             bookingclass: "W",
//             cabinclass: "Y",
//             operatingAirlineCode: "3M",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "Silver Airways",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "Silver Airways",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/14/flight-segments/B6_5492_2024-05-02_FLL_TPA:AT4",
//             distance: 197,
//             operatingFlightno: "92",
//             throughFlightLegs: [
//               {
//                 departureAirport: "FLL",
//                 arrivalAirport: "TPA",
//                 departureTerminal: "1",
//                 duration: "PT1H15M",
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: "15",
//         sequenceID: "15",
//         from: "JFK",
//         to: "TPA",
//         connections: ["BOS", "FLL"],
//         depart: "2024-05-01T22:50:00-04:00",
//         arrive: "2024-05-02T17:25:00-04:00",
//         isOverNightFlight: true,
//         isQuickest: false,
//         duration: "PT18H35M",
//         arrivalOffset: "1",
//         bundles: [
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/15_60",
//             code: "BLUE",
//             refundable: "false",
//             fareCode: "AN",
//             price: "475.10",
//             cabinclass: "Y",
//             bookingclass: "U",
//             status: "AVAILABLE",
//           },
//         ],
//         segments: [
//           {
//             id: "B6_1318_2024-05-01_JFK_BOS",
//             from: "JFK",
//             to: "BOS",
//             aircraft: "A320",
//             aircraftCode: "32M",
//             aircraftAmenityKey: "32M_B6_BOS_JFK",
//             stops: 0,
//             depart: "2024-05-01T22:50:00-04:00",
//             arrive: "2024-05-02T00:14:00-04:00",
//             flightno: "1318",
//             duration: "PT1H24M",
//             layover: "PT5H46M",
//             bookingclass: "U",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/15/flight-segments/B6_1318_2024-05-01_JFK_BOS:32M",
//             distance: 187,
//             operatingFlightno: "1318",
//             throughFlightLegs: [
//               {
//                 departureAirport: "JFK",
//                 arrivalAirport: "BOS",
//                 departureTerminal: "5",
//                 arrivalTerminal: "C",
//                 duration: "PT1H24M",
//               },
//             ],
//           },
//           {
//             id: "B6_569_2024-05-02_BOS_FLL",
//             from: "BOS",
//             to: "FLL",
//             aircraft: "A321",
//             aircraftCode: "321",
//             aircraftAmenityKey: "321_B6_BOS_FLL",
//             stops: 0,
//             depart: "2024-05-02T06:00:00-04:00",
//             arrive: "2024-05-02T09:20:00-04:00",
//             flightno: "569",
//             duration: "PT3H20M",
//             layover: "PT6H50M",
//             bookingclass: "W",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/15/flight-segments/B6_569_2024-05-02_BOS_FLL:321",
//             distance: 1237,
//             operatingFlightno: "569",
//             throughFlightLegs: [
//               {
//                 departureAirport: "BOS",
//                 arrivalAirport: "FLL",
//                 departureTerminal: "C",
//                 arrivalTerminal: "3",
//                 duration: "PT3H20M",
//               },
//             ],
//           },
//           {
//             id: "B6_5492_2024-05-02_FLL_TPA",
//             from: "FLL",
//             to: "TPA",
//             aircraft: "ATR 42 Turboprop",
//             aircraftCode: "AT4",
//             aircraftAmenityKey: "AT4_3M_FLL_TPA",
//             stops: 0,
//             depart: "2024-05-02T16:10:00-04:00",
//             arrive: "2024-05-02T17:25:00-04:00",
//             flightno: "5492",
//             duration: "PT1H15M",
//             bookingclass: "W",
//             cabinclass: "Y",
//             operatingAirlineCode: "3M",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "Silver Airways",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "Silver Airways",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/15/flight-segments/B6_5492_2024-05-02_FLL_TPA:AT4",
//             distance: 197,
//             operatingFlightno: "92",
//             throughFlightLegs: [
//               {
//                 departureAirport: "FLL",
//                 arrivalAirport: "TPA",
//                 departureTerminal: "1",
//                 duration: "PT1H15M",
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: "16",
//         sequenceID: "16",
//         from: "JFK",
//         to: "TPA",
//         connections: ["BQN"],
//         depart: "2024-05-01T07:45:00-04:00",
//         arrive: "2024-05-01T19:19:00-04:00",
//         isOverNightFlight: false,
//         isQuickest: false,
//         duration: "PT11H34M",
//         arrivalOffset: "0",
//         bundles: [
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/16_61",
//             code: "BLUE_BASIC",
//             refundable: "false",
//             fareCode: "DN",
//             price: "283.85",
//             cabinclass: "Y",
//             bookingclass: "L",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/16_62",
//             code: "BLUE",
//             refundable: "false",
//             fareCode: "AN",
//             price: "353.73",
//             cabinclass: "Y",
//             bookingclass: "P",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/16_63",
//             code: "BLUE_EXTRA",
//             refundable: "false",
//             fareCode: "GN",
//             price: "407.48",
//             cabinclass: "Y",
//             bookingclass: "P",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/16_64",
//             code: "BLUE_REFUNDABLE",
//             refundable: "true",
//             fareCode: "AR",
//             price: "500.59",
//             cabinclass: "Y",
//             bookingclass: "P",
//             status: "AVAILABLE",
//           },
//           {
//             id: "/air/lfs/657e0821a0c1b577bade84f0/itinerary-prices/16_65",
//             code: "BLUE_EXTRA_REFUNDABLE",
//             refundable: "true",
//             fareCode: "GR",
//             price: "565.09",
//             cabinclass: "Y",
//             bookingclass: "P",
//             status: "AVAILABLE",
//           },
//         ],
//         segments: [
//           {
//             id: "B6_2539_2024-05-01_JFK_BQN",
//             from: "JFK",
//             to: "BQN",
//             aircraft: "A320",
//             aircraftCode: "32M",
//             aircraftAmenityKey: "32M_B6_BQN_JFK",
//             stops: 0,
//             depart: "2024-05-01T07:45:00-04:00",
//             arrive: "2024-05-01T11:37:00-04:00",
//             flightno: "2539",
//             duration: "PT3H52M",
//             layover: "PT4H37M",
//             bookingclass: "P",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/16/flight-segments/B6_2539_2024-05-01_JFK_BQN:32M",
//             distance: 1576,
//             operatingFlightno: "2539",
//             throughFlightLegs: [
//               {
//                 departureAirport: "JFK",
//                 arrivalAirport: "BQN",
//                 departureTerminal: "5",
//                 duration: "PT3H52M",
//               },
//             ],
//           },
//           {
//             id: "B6_2769_2024-05-01_BQN_TPA",
//             from: "BQN",
//             to: "TPA",
//             aircraft: "A320",
//             aircraftCode: "32M",
//             aircraftAmenityKey: "32M_B6_BQN_TPA",
//             stops: 0,
//             depart: "2024-05-01T16:14:00-04:00",
//             arrive: "2024-05-01T19:19:00-04:00",
//             flightno: "2769",
//             duration: "PT3H5M",
//             bookingclass: "Z",
//             cabinclass: "Y",
//             operatingAirlineCode: "B6",
//             marketingAirlineCode: "B6",
//             operatingAirlineName: "JetBlue",
//             marketingAirlineName: "JetBlue",
//             filingAirline: "JetBlue",
//             marketingAirline: "JetBlue",
//             seatMapUri:
//               "/air/lfs/657e0821a0c1b577bade84f0/itineraries/16/flight-segments/B6_2769_2024-05-01_BQN_TPA:32M",
//             distance: 1175,
//             operatingFlightno: "2769",
//             throughFlightLegs: [
//               {
//                 departureAirport: "BQN",
//                 arrivalAirport: "TPA",
//                 duration: "PT3H5M",
//               },
//             ],
//           },
//         ],
//       },
//     ],
//     stopsFilter: [0, 1, 2],
//     countryCode: "US",
//     pos: "JETBLUEMOBILEREVENUE_US",
//     currency: "USD",
//     programName: "FO2 BASIC",
//     isTransatlanticRoute: false,
//   };
//   console.log(cash);
//   return cash;
// }
// addCppLowestPoints();
/**
 *
 */
// function getPoints() {
//   //
//   //
// }

/**
 *
 * Likely will have to be an onclick function
 * When you click on "From ___" points box, able to see all seat codes and associated points
 * Need to match up cash values with appropriate point box
 * @param {*} flights, the array of all flights returned by addCppLowestPoints()
 * @param {*} webElements, the entire array of points boxes on page
 *
 */
async function addCppAllSeatCodes(flights, webElements) {
  // Click on the front facing points
  // Drop down open
  // Can hopefully match up the web element array number and points values to identify correct flight array entry
}

// /**
//  * To be able to append the correct CPP to the web elm, we need to figure out
//  * which points value is being displayed and from which seat type
//  * It is NOT always the lowest seat code
//  * @param {*} points a singular points value that is shown on the front end
//  * @param {*}
//  */
// function matchPointsToSeatCode() {}

// May 1- May3 JFK TPA
