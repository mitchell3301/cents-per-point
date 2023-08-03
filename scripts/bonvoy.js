// BONVOY HOTELS

function addCpp() {
  let containers = document.querySelectorAll(".eeo-rate-not-enabled-class");

  for (let i = 0; i < containers.length; i++) {
    if (
      containers[i].querySelector("span.t-points.t-point-saver-point") &&
      containers[i].querySelector(
        "span.price-night.t-font-xs.t-font-weight-semibold.t-price-night.with-points > span > span > span.t-price"
      )
    ) {
      // make sure both cash and points options exist
      let cpp = (
        (parseInt(
          containers[i]
            .querySelector(
              "span.price-night.t-font-xs.t-font-weight-semibold.t-price-night.with-points > span > span > span.t-price"
            )
            .innerText.replace(",", "")
        ) /
          parseInt(
            containers[i]
              .querySelector("span.t-points.t-point-saver-point")
              .innerText.replace(",", "")
          )) *
        100
      ).toFixed(2);

      const outerSpan = document.createElement("span");
      const middleSpan = document.createElement("span");
      const innerSpan = document.createElement("span");
      const span = document.createElement("span");

      outerSpan.setAttribute(
        "class",
        "price-night t-font-xs t-font-weight-semibold t-price-night with-points"
      );

      innerSpan.setAttribute("class", "non-eeo-price-container");

      span.setAttribute(
        "class",
        "t-font-xs t-font-weight-semibold t-price-night with-points"
      );

      span.innerHTML = cpp + " Cents/Point&nbsp;";

      outerSpan.appendChild(middleSpan);
      middleSpan.appendChild(innerSpan);
      innerSpan.appendChild(span);

      containers[i].appendChild(outerSpan);
    } // If
  } // For
}

document.onload = addCpp();
