// Hilton Hotels ####################################################################

// addCpp() -------------------------------------------------------------------------

const interval = setInterval(addCpp, 600);

addCpp(interval);

function addCpp(interval) {
  // Make sure use points was selected
  if (!window.location.href.includes("redeemPts=true")) return;

  // remove any cpp previously added
  if (document.querySelectorAll(".left")) {
    document.querySelectorAll(".left").forEach((e) => e.remove());
  } // if

  let cashArray = [];
  let pointsArray = [];
  let containers = document.querySelectorAll(".rtl\\:text-left .text-text-alt");

  if (containers.length > 0) {
    if (interval) {
      clearInterval(interval);
    }

    // Switch from points to cash to get cash values
    document
      .querySelector(
        "#__next > main > div.mb-4.container-fluid > div.border-secondary.mb-4.flex.flex-wrap.items-center.border-b-4.pb-4 > div.ml-2.mr-0.flex.pt-5.rtl\\:mb-2.md\\:mx-2.md\\:px-2 > label > input"
      )
      .click();

    // Store cash values

    cash = document.querySelectorAll("p.md\\:text-xl");

    for (let i = 0; i < cash.length; i++) {
      cashArray.push(
        cash[i].innerText.replace("$", "").replace("*", "").replace(",", "")
      );
    }

    // Back to points
    document
      .querySelector(
        "#__next > main > div.mb-4.container-fluid > div.border-secondary.mb-4.flex.flex-wrap.items-center.border-b-4.pb-4 > div.ml-2.mr-0.flex.pt-5.rtl\\:mb-2.md\\:mx-2.md\\:px-2 > label > input"
      )
      .click();

    let points = document.querySelectorAll("p.text-tertiary");

    // ###################
    let whereToInsert = []; // handles non numeric values, e.g. Sold out, Coming soon, etc.
    // ###################

    for (let i = 0; i < points.length; i++) {
      pointsArray.push(
        points[i].innerText
          .replace(",", "")
          .replace(" points/night", "")
          .replace("* points for first night", "")
      );
    } // for

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
  } // if
} // addCpp()

document.addEventListener(".md\\:flex-1", () => {
  if (document.querySelectorAll(".left")) {
    document.querySelectorAll(".left").forEach((e) => e.remove());
  } // if
});
