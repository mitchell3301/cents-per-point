// BONVOY HOTELS
const interval = setInterval(addCpp, 1000);

addCpp(interval);

function addCpp(interval) {
  console.log("GOIN");

  // remove any cpp previously added
  if (document.querySelectorAll(".with-points")) {
    document.querySelectorAll(".with-points").forEach((e) => e.remove());
  } // if

  let containers = document.querySelectorAll(".non-saver");
  console.log(containers);

  if (containers.length > 0) {
    if (interval) {
      clearInterval(interval);
    }

    for (let i = 0; i < containers.length; i++) {
      console.log(containers[i]);
      if (
        containers[i].querySelector(".price-section") &&
        containers[i].querySelector(".m-price-currency-s")
      ) {
        // make sure both cash and points options exist
        let cpp = (
          (parseInt(
            containers[i]
              .querySelector(".price-value")
              .innerText.replace(",", "")
          ) /
            parseInt(
              containers[i]
                .querySelector(".points-value")
                .innerText.replace(",", "")
            )) *
          100
        ).toFixed(2);

        console.log(cpp);

        const outerDiv = document.createElement("div");
        const firstChild = document.createElement("div");
        const secondChild = document.createElement("div");

        outerDiv.setAttribute(
          "class",
          "currency-section m-price-currency-s with-points"
        );

        firstChild.setAttribute(
          "class",
          "t-font-alt-xs price-value m-price-currency-s"
        );

        secondChild.setAttribute(
          "class",
          "t-font-alt-xs currency-label m-price-currency-s"
        );

        firstChild.innerHTML = cpp;
        secondChild.innerHTML = " Cents/Point";

        outerDiv.appendChild(firstChild);
        outerDiv.appendChild(secondChild);

        containers[i].appendChild(outerDiv);
      } // If
    } // For
  } // If
}
