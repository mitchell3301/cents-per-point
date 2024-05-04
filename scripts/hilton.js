// Hilton Hotels ####################################################################

// addCpp() -------------------------------------------------------------------------

function addCpp(codes, arrivalDate, departureDate) {
  // Make sure use points was selected
  if (!window.location.href.includes("redeemPts=true")) return;

  // remove any cpp previously added
  if (document.querySelectorAll(".left")) {
    document.querySelectorAll(".left").forEach((e) => e.remove());
  } // if

  let cashArray = [];
  let pointsArray = [];
  let containers = null;
  // while (
  //   document.querySelectorAll(`.rtl\\:justify-start`).length < 1 ||
  //   document.querySelectorAll(`.rtl\\:justify-start`) === null
  // ) {
  console.log(document.querySelectorAll(`.rtl\\:justify-start`));
  containers = document.querySelectorAll(`.rtl\\:justify-start`);
  // }
  console.log(containers);

  //if (containers.length > 0) {
  // Switch from points to cash to get cash values
  console.log("Changing to cash");
  document.querySelector(".form-checkbox").click();

  // Store cash values

  let cash = null;

  //while (document.querySelectorAll(".md\\:text-xl").length < 1) {
  console.log(document.querySelectorAll(".md\\:text-xl"));
  console.log(document.querySelectorAll(".md\\:text-xl").length);
  cash = document.querySelectorAll(".md\\:text-xl");
  //}
  console.log(cash);

  for (let i = 0; i < cash.length; i++) {
    console.log(
      cash[i].innerText.replace("$", "").replace("*", "").replace(",", "")
    );
    cashArray.push(
      cash[i].innerText.replace("$", "").replace("*", "").replace(",", "")
    );
  }
  console.log(cashArray);

  // Back to points
  document.querySelector(".form-checkbox").click();

  let points = [];

  // while (points.length < 1) {
  console.log(document.querySelectorAll(".md\\:text-xl"));
  points = document.querySelectorAll(".md\\:text-xl");
  // }

  console.log(points);

  // ###################
  let whereToInsert = []; // handles non numeric values, e.g. Sold out, Coming soon, etc.
  // ###################

  for (let i = 0; i < points.length; i++) {
    pointsArray.push(
      points[i].innerText
        .replace(",", "")
        .replace(" points/night", "")
        .replace("* points for first night", "")
        .replace(" points for first night", "")
    );
  } // for
  console.log(pointsArray);

  for (let i = 0; i < cash.length; i++) {
    if (cashArray[i] == "Sold Out" || cashArray[i] == "Coming Soon") {
      whereToInsert.push(i);
    }
  }
  // If there is a non-numeric
  if (whereToInsert.length > 0 && cashArray.some(isNaN)) {
    for (let i = 0; i < whereToInsert.length; i++) {
      pointsArray.splice(whereToInsert[i], 0, "NONE");
    }
  }

  // Calculate CPP and store
  let cppArray = [];

  for (let i = 0; i < containers.length; i++) {
    cppArray.push(((cashArray[i] / pointsArray[i]) * 100).toFixed(2));
  }

  console.log(cppArray);

  // Append to HTML
  for (let i = 0; i < containers.length; i++) {
    if (cppArray[i].trim() != "NaN") {
      let cashVal = document.createElement("div");
      let cpp = document.createElement("div");

      cashVal.innerText = "Cash Rate: $" + cashArray[i];
      cpp.innerText = cppArray[i] + " cents/point";

      cashVal.setAttribute(
        "class",
        "text-align: left text-primary font-bold numeric-tabular-nums leading-none rtl:text-left text-lg md:text-xl text-tertiary"
      );

      cpp.setAttribute(
        "class",
        "text-align: left text-primary font-bold numeric-tabular-nums leading-none rtl:text-left text-lg md:text-xl text-tertiary"
      );

      containers[i].appendChild(cashVal);
      containers[i].appendChild(cpp);
    } // if
  } // for
  //} // if
} // addCpp()

// document.addEventListener(".md\\:flex-1", () => {
//   if (document.querySelectorAll(".left")) {
//     document.querySelectorAll(".left").forEach((e) => e.remove());
//   } // if
// });

// window.onload = () => {
//   let codes = [...document.querySelectorAll(".text-base")]
//     .map((e) => e.id)
//     .map((e) => e.replace("hotel-", ""))
//     .filter((e) => e != "");

//   chrome.storage.session.set({ codes });
// };

chrome.storage.onChanged.addListener(async (changes, areaName) => {
  for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(oldValue);
    console.log(newValue);
    if (key == "hiltonHeaders") {
      console.log("Changed key: hiltonHeaders");
      let headers = await chrome.storage.session.get(["hiltonHeaders"]);

      console.log(headers);

      let codes = [...document.querySelectorAll(".text-base")]
        .map((e) => e.id)
        .map((e) => e.replace("hotel-", ""))
        .filter((e) => e != "")
        .map((e) => '"' + e + '"')
        .toString();
      console.log(window.location.href);
      let departureDate =
        '"' +
        window.location.href.split("departureDate=")[1].substring(0, 10) +
        '"';
      console.log(departureDate);
      let arrivalDate =
        '"' +
        window.location.href.split("arrivalDate=")[1].substring(0, 10) +
        '"';
      console.log(arrivalDate);

      await addCppHilton(headers, codes, arrivalDate, departureDate);
    }
  }
});

async function addCppHilton(headers, codes, arrivalDate, departureDate) {
  if (!window.location.href.includes("redeemPts=true")) return;

  // remove any cpp previously added
  console.log(document.querySelectorAll(".cpp-div"));
  if (document.querySelectorAll(".cpp-div")) {
    document.querySelectorAll(".cpp-div").forEach((e) => e.remove());
  } // if

  headers = headers.hiltonHeaders;

  console.log(
    `{"query":"query shopMultiPropAvail($ctyhocns: [String!], $language: String!, $input: ShopMultiPropAvailQueryInput!) {\\n  shopMultiPropAvail(input: $input, language: $language, ctyhocns: $ctyhocns) {\\n    ageBasedPricing\\n    ctyhocn\\n    currencyCode\\n    statusCode\\n    statusMessage\\n    lengthOfStay\\n    notifications {\\n      subType\\n      text\\n      type\\n    }\\n    summary {\\n      hhonors {\\n        dailyRmPointsRate\\n        dailyRmPointsRateFmt\\n        rateChangeIndicator\\n        ratePlan {\\n          ratePlanName @toUpperCase\\n        }\\n      }\\n      lowest {\\n        cmaTotalPriceIndicator\\n        feeTransparencyIndicator\\n        rateAmountFmt(strategy: trunc, decimal: 0)\\n        rateAmount(currencyCode: \\"USD\\")\\n        ratePlanCode\\n        rateChangeIndicator\\n        ratePlan {\\n          attributes\\n          ratePlanName @toUpperCase\\n          specialRateType\\n          confidentialRates\\n        }\\n        amountAfterTax(currencyCode: \\"USD\\")\\n        amountAfterTaxFmt(decimal: 0, strategy: trunc)\\n      }\\n      status {\\n        type\\n      }\\n    }\\n  }\\n}","operationName":"shopMultiPropAvail","variables":{"input":{"guestId":0,"guestLocationCountry":"US","arrivalDate":${arrivalDate},"departureDate":${departureDate},"numAdults":1,"numChildren":0,"numRooms":1,"childAges":[],"ratePlanCodes":[],"rateCategoryTokens":[],"specialRates":{"aaa":false,"aarp":false,"corporateId":"","governmentMilitary":false,"groupCode":"","hhonors":true,"pnd":"","offerId":null,"promoCode":"","senior":false,"smb":false,"travelAgent":false,"teamMember":false,"familyAndFriends":false,"owner":false,"ownerHGV":false}},"ctyhocns":[${codes}],"language":"en"}}`
  );
  let prices = await fetch(
    "https://www.hilton.com/graphql/customer?appName=dx_shop_search_app&operationName=shopMultiPropAvail&originalOpName=shopMultiPropAvailPoints&bl=en",
    {
      headers: { ...headers },
      referrer: "https://www.hilton.com/en/search/",
      referrerPolicy: "no-referrer-when-downgrade",
      body: `{"query":"query shopMultiPropAvail($ctyhocns: [String!], $language: String!, $input: ShopMultiPropAvailQueryInput!) {\\n  shopMultiPropAvail(input: $input, language: $language, ctyhocns: $ctyhocns) {\\n    ageBasedPricing\\n    ctyhocn\\n    currencyCode\\n    statusCode\\n    statusMessage\\n    lengthOfStay\\n    notifications {\\n      subType\\n      text\\n      type\\n    }\\n    summary {\\n      hhonors {\\n        dailyRmPointsRate\\n        dailyRmPointsRateFmt\\n        rateChangeIndicator\\n        ratePlan {\\n          ratePlanName @toUpperCase\\n        }\\n      }\\n      lowest {\\n        cmaTotalPriceIndicator\\n        feeTransparencyIndicator\\n        rateAmountFmt(strategy: trunc, decimal: 0)\\n        rateAmount(currencyCode: \\"USD\\")\\n        ratePlanCode\\n        rateChangeIndicator\\n        ratePlan {\\n          attributes\\n          ratePlanName @toUpperCase\\n          specialRateType\\n          confidentialRates\\n        }\\n        amountAfterTax(currencyCode: \\"USD\\")\\n        amountAfterTaxFmt(decimal: 0, strategy: trunc)\\n      }\\n      status {\\n        type\\n      }\\n    }\\n  }\\n}","operationName":"shopMultiPropAvail","variables":{"input":{"guestId":0,"guestLocationCountry":"US","arrivalDate":${arrivalDate},"departureDate":${departureDate},"numAdults":1,"numChildren":0,"numRooms":1,"childAges":[],"ratePlanCodes":[],"rateCategoryTokens":[],"specialRates":{"aaa":false,"aarp":false,"corporateId":"","governmentMilitary":false,"groupCode":"","hhonors":true,"pnd":"","offerId":null,"promoCode":"","senior":false,"smb":false,"travelAgent":false,"teamMember":false,"familyAndFriends":false,"owner":false,"ownerHGV":false}},"ctyhocns":[${codes}],"language":"en"}}`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  ).then((response) => response.json());

  let containers = document.querySelectorAll(".rtl\\:text-left .text-text-alt");
  console.log(containers);

  for (let i = 0; i < prices.data.shopMultiPropAvail.length; i++) {
    if (prices.data.shopMultiPropAvail[i].statusCode == 0) {
      // then points are redeemable at this property
      let cashFormatted =
        prices.data.shopMultiPropAvail[i].summary.lowest.rateAmountFmt;
      let rawCash = prices.data.shopMultiPropAvail[i].summary.lowest.rateAmount;
      let points =
        prices.data.shopMultiPropAvail[i].summary.hhonors.dailyRmPointsRate;
      let cpp = ((rawCash / points) * 100).toFixed(2);

      let cashDiv = document.createElement("div");
      let cppDiv = document.createElement("div");

      cashDiv.innerText = "Cash Rate: " + cashFormatted;
      cppDiv.innerText = cpp + " cents/point";

      // if (document.querySelectorAll(".cpp-div")) {
      //   document.querySelectorAll(".cpp-div").forEach((e) => e.remove());
      // } // if

      cashDiv.setAttribute(
        "class",
        "cpp-div text-align: left text-primary font-bold numeric-tabular-nums leading-none rtl:text-left text-lg md:text-xl text-tertiary"
      );

      cppDiv.setAttribute(
        "class",
        "cpp-div text-align: left text-primary font-bold numeric-tabular-nums leading-none rtl:text-left text-lg md:text-xl text-tertiary"
      );

      containers[i].appendChild(cashDiv);
      containers[i].appendChild(cppDiv);
    }
  }
}
