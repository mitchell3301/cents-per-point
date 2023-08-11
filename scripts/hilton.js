// Hilton Hotels ####################################################################

// UPDATE BUTTON --------------------------------------------------------------------
const updateButton = document.createElement("button");
const update = document.createElement("div");

updateButton.innerText = "Update CPP";
updateButton.id = "clickToUpdate";

update.setAttribute(
  "class",
  "flex content-center space-x-2 pt-5 rtl:mb-2 rtl:space-x-reverse md:mr-2 "
);

updateButton.setAttribute(
  "class",
  "btn btn-primary-outline flex content-center px-4 py-2"
);

update.appendChild(updateButton);

document.querySelector(".pb-4").appendChild(update);

updateButton.addEventListener("click", updateCpp);

// addCpp() -------------------------------------------------------------------------

const interval = setInterval(addCpp, 600);

function addCpp() {
  let cashArray = [];
  let pointsArray = [];
  let containers = document.querySelectorAll(".rtl\\:text-left .text-text-alt");

  if (containers.length > 0) {
    clearInterval(interval);

    // Switch from points to cash to get cash values
    document
      .querySelector(
        "#__next > main > div.mb-4.container-fluid > div.border-secondary.mb-4.flex.flex-wrap.items-center.border-b-4.pb-4 > div.ml-2.mr-0.flex.pt-5.rtl\\:mb-2.md\\:mx-2.md\\:px-2 > label > input"
      )
      .click();

    let cash = document.querySelectorAll("p.md\\:text-xl");

    // Store cash values
    for (let i = 0; i < cash.length; i++) {
      cashArray.push(cash[i].innerText.replace("$", "").replace("*", ""));
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
      if (cashArray[i] == "Sold Out" || cashArray[i] == "Coming Soon") {
        whereToInsert.push(i);
      }

      pointsArray.push(
        points[i].innerText
          .replace(",", "")
          .replace(" points/night", "")
          .replace("* points for first night", "")
      );
    } // for

    // If there is a non-numeric
    if (whereToInsert.length > 0 && cashArray.some(isNaN)) {
      for (let i = 0; i < whereToInsert.length; i++) {
        pointsArray.splice(whereToInsert, 0, "NONE");
      }
    }

    // Calculate CPP and store
    let cppArray = [];

    for (let i = 0; i < containers.length; i++) {
      cppArray.push(((cashArray[i] / pointsArray[i]) * 100).toFixed(2));
    }

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

function updateCpp() {
  if (document.querySelectorAll(".left")) {
    document.querySelectorAll(".left").forEach((e) => e.remove());
  }
  addCpp();
}

addCpp();
//document.onload = addCpp();
///.last\:border-b-0
//.lg\:w-2\/5 ul

// On switch to next page
// Block request that brings back to original page

// Sold out issue

//////////////////////////////////////////////////////////////////////////////////
// Update button
// Need to clear ones there
// Needs time????????

// FLOW -------------------------------------------------------------------
// go till end points, switch to cash, go back to beginning, back to points, run script
