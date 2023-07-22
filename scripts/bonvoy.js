// BONVOY HOTELS

function addCpp() {
  console.log("runnnin");
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

      const span = document.createElement("span");

      span.setAttribute(
        "class",
        "t-font-xs t-font-weight-semibold t-price-night with-points"
      );

      span.innerText = cpp + " Cents/Point";
      containers[i].querySelector(".eeo-rate").appendChild(span);
    } // If
  } // For
}

document.onload = addCpp();
