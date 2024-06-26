// FUNCTION ----------------------------------------------------------------------
const interval = setInterval(addCpp, 2000);
addCpp(interval);

function addCpp(interval) {
  if (document.querySelectorAll(".cpp-rate")) {
    document.querySelectorAll(".cpp-rate").forEach((e) => e.remove());
  } // if

  // Only run script when clicked "use points"
  if (!window.location.href.includes("&rateFilter=woh")) return;

  let points = document.querySelectorAll(".points-rate .rate-currency");
  console.log(points);
  let cash = document.querySelectorAll(".cash-rate .rate-currency");
  console.log(cash);
  let rates = document.querySelectorAll(".rates");

  let centsPerPoint = [];

  if (points.length > 0) {
    clearInterval(interval);

    for (let i = 0; i < points.length; i++) {
      let cpp =
        Math.round(
          (parseInt(cash[i].innerText.replaceAll(",", "").substring(1)) /
            parseInt(
              points[i].innerText.replaceAll(",", "").replaceAll("$", "")
            )) *
            10000,
          2
        ) / 100;

      centsPerPoint.push(cpp);
    }
    console.log(centsPerPoint);

    for (let i = 0; i < rates.length; i++) {
      const mainDiv = document.createElement("div");

      mainDiv.setAttribute("class", "cpp-rate rate b-row b-row_align-middle");

      const div = document.createElement("div");

      div.style.fontWeight = "bold";
      div.innerText = `${centsPerPoint[i]}`;

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
