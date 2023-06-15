let newMetadata = {
  name: "",
  symbol: "",
  image: "",
  description: "",
};

initPage();

function initPage() {
  document.getElementById("smallest-bundle").value = 50;
  document.getElementById("smallest-bundle-display").value = 50;
  document.getElementById("biggest-bundle").value = 50;
  document.getElementById("biggest-bundle-display").value = 50;
  document.getElementById("whale-factor").value = 50;
  document.getElementById("whale-factor-display").value = 50;

  document.getElementById("token-metadata").value = JSON.stringify(
    newMetadata,
    null,
    "\t"
  );
  document.getElementById("smallest-bundle").onchange = function (event) {
    document.getElementById("smallest-bundle-display").value =
      event.target.value;
  };
  document.getElementById("biggest-bundle").onchange = function (event) {
    document.getElementById("biggest-bundle-display").value =
      event.target.value;
  };
  document.getElementById("whale-factor").onchange = function (event) {
    document.getElementById("whale-factor-display").value = event.target.value;
  };

  Array.from(document.getElementsByClassName("metadata-trigger")).forEach(
    (_element) => {
      _element.value = "";
      _element.onchange = generateMetadata;
    }
  );

  document.getElementById("generate-btn").onclick = function (event) {
    document.getElementById("after-generation").hidden = false;
    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
    // Generate distribution text here
  };
}

function generateMetadata() {
  newMetadata = {
    name: document.getElementById("token-name").value,
    symbol: document.getElementById("token-symbol").value,
    image: document.getElementById("token-image").value,
    description: document.getElementById("token-description").value,
  };

  document.getElementById("token-metadata").value = JSON.stringify(
    newMetadata,
    null,
    "\t"
  );
}

function downloadMetadataJSON() {
  var el = document.createElement("a");
  // document.body.appendChild(el);

  var data_string =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(document.getElementById("token-metadata").value);
  el.setAttribute("href", data_string);
  el.setAttribute("download", "token_metadata.json");
  el.click();
}

function moveToStep(_step) {
  const steps = Array.from(document.getElementsByClassName("step-container"));
  steps.forEach((_element) => _element.classList.remove("active"));
  steps[_step].classList.add("active");
  window.scrollTo({ left: 0, top: 200, behavior: "smooth" });
}
