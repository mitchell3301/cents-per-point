// Hilton Hotels

const interval = setInterval(addCpp, 600);

function addCpp() {
  let cashArray = [];
  let pointsArray = [];
  let containers = document.querySelectorAll(".rtl\\:text-left .text-text-alt");

  if (containers.length > 0) {
    clearInterval(interval);
    // Go to cash
    document
      .querySelector(
        "#__next > main > div.mb-4.container-fluid > div.border-secondary.mb-4.flex.flex-wrap.items-center.border-b-4.pb-4 > div.ml-2.mr-0.flex.pt-5.rtl\\:mb-2.md\\:mx-2.md\\:px-2 > label > input"
      )
      .click();

    let cash = document.querySelectorAll(".md\\:text-xl");

    for (let i = 0; i < cash.length; i++) {
      cashArray.push(cash[i].innerText.replace("$", "").replace("*", ""));
    }

    // Back to points
    document
      .querySelector(
        "#__next > main > div.mb-4.container-fluid > div.border-secondary.mb-4.flex.flex-wrap.items-center.border-b-4.pb-4 > div.ml-2.mr-0.flex.pt-5.rtl\\:mb-2.md\\:mx-2.md\\:px-2 > label > input"
      )
      .click();

    let points = document.querySelectorAll(".text-tertiary");

    //console.log("points");
    for (let i = 0; i < points.length; i += 2) {
      console.log(points[i].innerText);
      //#if (cashArray[i] != "Sold Out") {
      pointsArray.push(
        points[i].innerText
          .replace(",", "")
          .replace(" points/night", "")
          .replace("* points for first night", "")
      );
      //#  } else {
      //   i += 2;
      //  }
    } // for

    let cppArray = [];

    for (let i = 0; i < cashArray.length; i++) {
      console.log(cashArray[i] + " " + pointsArray[i]);
      cppArray.push(((cashArray[i] / pointsArray[i]) * 100).toFixed(2));
    }

    console.log(cppArray);

    // Append to HTML
    for (let i = 0; i < containers.length; i++) {
      //console.log(containers.length);
      if (cppArray[i].trim() != "NaN") {
        const cashVal = document.createElement("div");
        const cpp = document.createElement("div");

        cashVal.innerText = "Cash Rate: $" + cashArray[i];
        cpp.innerText = cppArray[i] + " cents/point";

        console.log(cppArray[i]);

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

//document.onload = addCpp();
///.last\:border-b-0
//.lg\:w-2\/5 ul

// On update button
// On switch to next page
