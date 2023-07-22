// Hyatt makes some sort of external request that makes it so:
// Even though page is 'loaded,' list of hotels isn't there
// Workaround: Rerunning every .6 seconds

const interval = setInterval(addCpp, 600);

// document
//   .getElementById(".search-this-area")
//   .addEventListener(onclick, addCpp());

function addCpp() {
  //const interval = setInterval(addCpp, 600);

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
      const div = document.createElement("div");
      const span = document.createElement("span");

      div.style.fontWeight = "bold";
      div.innerText = `${centsPerPoint[(i - 1) / 2]}`;

      span.setAttribute(
        "class",
        "b-row b-row_align-middle avg-rate-label b-text_copy-1 b-color_text-grayscale-65 b-text_weight-normal"
      );
      span.innerText = "  Cents/Point";
      rates[i].appendChild(div);
      rates[i].appendChild(span);
    }
  }
}

document.onreadystatechange();
