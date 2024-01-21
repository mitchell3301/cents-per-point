let selectedDate = null;

let url = window.location.href;
const originalDepartDate = url.split("&")[2];

chrome.storage.session.set({
  originalDepartDate: originalDepartDate,
});

chrome.storage.session.set({
  currentDepartDate: originalDepartDate,
});

if (url.includes("return")) {
  let originalReturnDate = url.split("&")[3];
  chrome.storage.session.set({
    originalReturnDate,
  });

  chrome.storage.session.set({
    currentReturnDate: originalReturnDate,
  });
}

const interval = setInterval(addCppLowestPoints, 1000);

addCppLowestPoints(interval);

chrome.storage.onChanged.addListener((changes, areaName) => {
  for (const [key, value] of Object.entries(changes)) {
    if (key == "points" || key == "cash") {
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

      let curr = await chrome.storage.session.get(["currentDepartDate"]);
      console.log(curr.currentDepartDate);
      await chrome.storage.session.set({
        previousDepartDate: curr.currentDepartDate,
      });

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

const arrowInterval = setInterval(addDateChangeListeners, 1000);

/**
 *
 * addCppLowestPoints()
 *
 * @returns {*} flights, the array of flight objects created within func
 */
async function addCppLowestPoints() {
  let cash = await chrome.storage.session.get(["cash"]);

  let points = await chrome.storage.session.get(["points"]);

  if (cash === null && points === null) {
    console.log("nothing");
    return;
  } // return until values are detected from storage

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

  let webElements = null;
  let webElmementCodes = document.querySelectorAll(
    "#app-container-div .royal-blue.pointer.ng-star-inserted"
  );

  if (webElements == null) {
    webElements = document.querySelectorAll(".pointsText");
    // if (interval) {
    //   clearInterval(interval);
    // } // if
  } // if

  for (let i = 0; i < cash.itinerary.length; i++) {
    for (let j = 0; j < cash.itinerary[i].bundles.length; j++) {
      if (cash.itinerary[i] != null && points.itinerary[i] != null) {
        if (cash.itinerary[i].id != 4) {
          let specCash = cash.itinerary[i];
          let specPoints = points.itinerary[i];

          // Create an object for each flight, with cash value and points value, along with other useful info

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
            arrivalDateTime: specCash.arrive,
          };

          // console.log(flight);
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

    // Append to web element k - 1
  } // for k

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
