// Hilton Hotels ####################################################################

// addCpp() -------------------------------------------------------------------------

function addCpp() {
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

window.onload = () => {
  addCpp();
};
