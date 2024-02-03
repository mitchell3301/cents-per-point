let selectedDate = null;

let url = window.location.href;
const originalDepartDate = url.split("depart=")[1].substring(0, 10);

chrome.storage.session.set({
  originalDepartDate: originalDepartDate,
});

chrome.storage.session.set({
  currentDepartDate: originalDepartDate,
});

if (url.includes("return")) {
  let originalReturnDate = url.split("return=")[1].substring(0, 10);
  console.log(originalReturnDate);
  chrome.storage.session.set({
    originalReturnDate,
  });

  chrome.storage.session.set({
    currentReturnDate: originalReturnDate,
  });
}

// s

chrome.storage.onChanged.addListener((changes, areaName) => {
  for (const [key, value] of Object.entries(changes)) {
    if (key == "points") {
      addCppLowestPoints();
    }
  }
});

/**
 * addDateChangeListeners()
 */
async function addDateChangeListeners() {
  Array.from(document.querySelectorAll(".jb-best-fare-date-box")).map((elm) => {
    elm.addEventListener("click", async () => {
      // Set previous to current before updating current

      // let curr = await chrome.storage.session.get(["currentDepartDate"]);
      // console.log(curr.currentDepartDate);
      // await chrome.storage.session.set({
      //   previousDepartDate: curr.currentDepartDate,
      // });

      // Set new one
      let toSet = null;
      toSet = elm.innerText.split("\n")[0];
      if (toSet.includes("pts")) {
        toSet = elm.innerText.substring(1, 11);
        if (toSet[toSet.length()] == "") {
          console.log(toSet[toSet.length()]);
          toSet = toSet.substring(0, 10);
        }
      }
      await chrome.storage.session.set({
        currentDepartDate: toSet,
      });
    });
  });
}

/**
 *
 * addCppLowestPoints()
 *
 * @returns {*} flights, the array of flight objects created within func
 */
async function addCppLowestPoints() {
  let cash = await chrome.storage.session.get(["cash"]);

  let points = await chrome.storage.session.get(["points"]);

  if (cash === null || points === null) {
    console.log("nothing");
    return;
  } // return until values are detected from storage

  // Remove any prev cpp added on previous runs
  if (document.querySelectorAll(".with-cpp")) {
    document.querySelectorAll(".with-cpp").forEach((e) => e.remove());
    console.log("removed");
  } // if

  cash = cash.cash;
  points = points.points;

  cash = JSON.parse(cash);
  points = JSON.parse(points);

  // CREATE FLIGHTS ARRAY ----------------------------------------------------------------------------
  const flights = [];

  let webElements = [];
  let webElementCodes = [];

  while (Array.from(webElements).length == 0) {
    webElements = Array.from(document.querySelectorAll(".pointsText"));
    // if (interval) {
    //   clearInterval(interval);
    // } // if

    await new Promise((res) => {
      // HOPEFULLY TEMP SOLUTION
      setTimeout(() => {
        res();
      }, 1000);
    });
  } // if

  while (Array.from(webElementCodes).length == 0) {
    webElementCodes = webElementCodes = document.querySelectorAll(
      "#app-container-div .royal-blue.pointer.ng-star-inserted"
    );

    await new Promise((res) => {
      // HOPEFULLY TEMP SOLUTION
      setTimeout(() => {
        res();
      }, 1000);
    });
  } // if

  for (let i = 0; i < cash.itinerary.length; i++) {
    for (let j = 0; j < cash.itinerary[i].bundles.length; j++) {
      if (cash.itinerary[i] != null && points.itinerary[i] != null) {
        //if (cash.itinerary[i].id != 4) {
        let specCash = cash.itinerary[i];
        let specPoints = points.itinerary[i];

        if (specPoints.bundles[j].code) {
          let flight = {
            id: parseInt(specPoints.id),
            pathId: specPoints.bundles[j].id,
            to: specPoints.to,
            from: specPoints.from,
            seatCode: specPoints.bundles[j].code,
            points: parseInt(specPoints.bundles[j].points),
            status: specPoints.bundles[j].status,
            operatingAirlineCode: specPoints.segments[0].operatingAirlineCode,
            operatingFlightno: specPoints.segments[0].operatingFlightno,
            arrivalDateTime: specPoints.arrive,
          };

          flight.cash = specCash.bundles.filter(
            (b) => b.code == flight.seatCode
          )[0].price;

          flights.push(flight);
        }
        //}
        // }
      }
    } // for j
  } // for i

  // Now that we have an array of objects that contains cash values and points values for every
  // ... flight, we can now loop through the web elements to attach cpp to the front facing singular
  // ... point value. We need to be sure that we pick the right cash value to match up however

  if (
    document.querySelectorAll("#auto-flight-quickest-or-lowest-0 .b--sky-blue")
      .length == 1
  ) {
    for (let k = 1; k < webElementCodes.length; k++) {
      webElements[k - 1].style = "line-height: 1.7";

      let webElementPoints = webElements[k - 1].innerText
        .replaceAll(",", "")
        .replaceAll(" pts", "")
        .replaceAll(" ", "");

      let matchedCash = flights
        .filter((flight) =>
          webElementCodes[k - 1].innerText.includes(
            flight.operatingAirlineCode + " " + flight.operatingFlightno
          )
        ) // subset all flights to only 1, with all seat code options
        .filter((flight) => flight.points == webElementPoints); // change to match points from web element

      if (matchedCash.length > 0) {
        matchedCash = matchedCash[0].cash;

        let cpp = (
          (parseInt(matchedCash) / parseInt(webElementPoints)) *
          100
        ).toFixed(2);
        console.log(cpp);

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
      }
      // Append to web element k - 1
    } // for k
  } else if (
    document.querySelectorAll("#auto-flight-quickest-or-lowest-0 .b--sky-blue")
      .length == 2
  ) {
    for (let k = 0; k < webElements.length; k++) {
      webElements[k].style = "line-height: 1.7";

      let webElementPoints = webElements[k].innerText
        .replaceAll(",", "")
        .replaceAll(" pts", "")
        .replaceAll(" ", "");

      let matchedCash = flights
        .filter((flight) =>
          webElementCodes[Math.floor(k / 2)].innerText.includes(
            flight.operatingAirlineCode + " " + flight.operatingFlightno
          )
        ) // subset all flights to only 1, with all seat code options
        .filter((flight) => flight.points == webElementPoints); // change to match points from web element

      if (matchedCash.length > 0) {
        matchedCash = matchedCash[0].cash;

        let cpp = (
          (parseInt(matchedCash) / parseInt(webElementPoints)) *
          100
        ).toFixed(2);

        let cashElm = document.createElement("div");
        cashElm.innerText = "$" + matchedCash + " cash";
        cashElm.setAttribute("class", "with-cpp");

        let cppElm = document.createElement("div");
        cppElm.innerText = cpp + " cents/point";
        cppElm.setAttribute("class", "with-cpp");

        webElements[k].appendChild(cashElm);
        webElements[k].appendChild(cppElm);
      }
      // Append to web element k - 1
    } // for k
  }
  return flights;
} // addCppLowestPoints()

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
