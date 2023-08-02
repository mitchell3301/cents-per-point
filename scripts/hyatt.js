// Hyatt makes some sort of external request that makes it so:
// Even though page is 'loaded,' list of hotels isn't there
// Workaround: Rerunning every .6 seconds

// Need script to rerun when user drags across map
// console.log("running");
// let loader = document.querySelector(
//   "body > div.m-content-loader.b-layer-interstitial"
// );

// console.log(loader.innerHTML);
// loader.onchange = addCpp();

// UPDATE BUTTON -------------------------------------------------------------
const updateButton = document.createElement("button");
updateButton.innerText = "Update CPP";
updateButton.id = "clickToUpdate";

// btn btn-primary-outline flex content-center px-4 py-2
updateButton.setAttribute("class", "b-button b-button_height-mini b-mb0 b-ph5");

document.querySelector(".hbe-header_woh").appendChild(updateButton);

updateButton.addEventListener("click", () => {
  document.onload = updateCpp();
});

document
  .querySelector(".search-this-area")
  .addEventListener("click", updateCpp);

// FUNCTION ----------------------------------------------------------------------
const interval = setInterval(addCpp, 100);

// When change in selector, rerun

function addCpp() {
  console.log("addCpp()");

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

      // mainDiv.appendChild(div);
      // mainDiv.appendChild(span);

      // rates[i].appendChild(div);
      // rates[i].appendChild(span);
      rates[i].appendChild(mainDiv);
      mainDiv.appendChild(div);
      mainDiv.appendChild(span);
    }
  }
}

function updateCpp() {
  //let onPage = document.querySelector(".tabular-nums").innerText.charAt(0);
  //let nextPage = document.querySelector('#__next > main > div.mb-4.container-fluid > div.relative.flex > div.z-1.bg-bg.xl\:w-3\/7.relative.h-auto.w-full.rtl\:pr-0.md\:static.md\:h-auto.md\:w-1\/2.md\:pr-4.md\:rtl\:pl-4.lg\:w-2\/5 > div:nth-child(5) > div > div > button:nth-child(4)')
  //console.log(onPage);
  if (document.querySelectorAll(".cpp-rate")) {
    document.querySelectorAll(".cpp-rate").forEach((e) => e.remove());
    document.onload = addCpp();
  }
  // document
  //   .querySelector(
  //     "#__next > main > div.mb-4.container-fluid > div.relative.flex > div.z-1.bg-bg.xl:w-3/7.relative.h-auto.w-full.rtl:pr-0.md:static.md:h-auto.md:w-1/2.md:pr-4.md:rtl:pl-4.lg:w-2/5 > div:nth-child(5) > div > div > button:nth-child(4)"
  //   )
  //   .click();
}

// How to add class and then div under it

// Polling
