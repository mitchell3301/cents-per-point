// UPDATE BUTTON -------------------------------------------------------------
const updateButton = document.createElement("button");
updateButton.innerText = "Update CPP";
updateButton.id = "clickToUpdate";
updateButton.setAttribute("class", "b-button b-button_height-mini b-mb0 b-ph5");
document.querySelector(".hbe-header_woh").appendChild(updateButton);

updateButton.addEventListener("click", () => {
  updateCpp();
});

// SEARCH AS MAP MOVES --------------------------------------------------------
document.querySelector(".search-this-area").addEventListener("click", () => {
  const intervalSTA = setInterval(() => {
    // Remove any overlapping cpp from radius
    if (document.querySelectorAll(".cpp-rate").length > 0) {
      console.log("Removing");
      document.querySelectorAll(".cpp-rate").forEach((e) => e.remove());
    }

    if (document.querySelectorAll(".rate-currency").length > 0) {
      clearInterval(intervalSTA);
      addCpp();
    }
  }, 200);
});

// FUNCTION ----------------------------------------------------------------------
const interval = setInterval(addCpp, 100);

// When change in selector, rerun

function addCpp() {
  // Only run script when clicked "use points"
  if (!window.location.href.includes("&rateFilter=woh")) return;

  let selector = document.querySelectorAll(".rate-currency");
  let rates = document.querySelectorAll(".rates");

  let centsPerPoint = [];

  if (selector.length > 0) {
    clearInterval(interval);

    for (let i = 0; i < selector.length; i += 4) {
      let cpp =
        Math.round(
          (parseInt(
            selector[i + 1].innerText.replaceAll(",", "").substring(1)
          ) /
            parseInt(selector[i].innerText.replaceAll(",", ""))) *
            10000,
          2
        ) / 100;

      centsPerPoint.push(cpp);
    }

    for (let i = 1; i < rates.length; i += 2) {
      const mainDiv = document.createElement("div");

      mainDiv.setAttribute("class", "cpp-rate rate b-row b-row_align-middle");

      const div = document.createElement("div");

      div.style.fontWeight = "bold";
      div.innerText = `${centsPerPoint[(i - 1) / 2]}`;

      const span = document.createElement("span");
      span.setAttribute(
        "class",
        "b-row b-row_align-middle avg-rate-label b-text_copy-1 b-color_text-grayscale-65 b-text_weight-normal"
      );
      span.innerText = "  Cents/Point";

      rates[i].appendChild(mainDiv);
      mainDiv.appendChild(div);
      mainDiv.appendChild(span);
    } // for
  } // if
} // addCpp()

function updateCpp() {
  if (document.querySelectorAll(".cpp-rate")) {
    document.querySelectorAll(".cpp-rate").forEach((e) => e.remove());
  } // if
  addCpp();
} // updateCpp()
