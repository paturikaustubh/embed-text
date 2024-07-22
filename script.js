let file = null;
let imgText = "MOVIES 4 YOU";
let imgHeight, imgWidth;

document.getElementById("file-input").addEventListener("change", function (e) {
  file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imgElement = document.getElementById("image-display");
      imgElement.src = e.target.result;
      imgElement.onload = () => {
        imgWidth = imgElement.naturalWidth;
        imgHeight = imgElement.naturalHeight;
      };
    };
    reader.readAsDataURL(file);
  }
});

document
  .getElementById("img-text")
  .addEventListener("input", ({ target: { value } }) => {
    imgText = value;

    const textOutlineEle = document.getElementById("img-text-outline");
    const textBgEle = document.getElementById("img-text-bg");

    textBgEle.innerText = value;
    textOutlineEle.innerText = value;
  });

document
  .getElementById("text-theme")
  .addEventListener("change", ({ target: { value } }) => {
    const textOutlineEle = document.getElementById("img-text-outline");
    const textBgEle = document.getElementById("img-text-bg");

    if (value === "dark") {
      textOutlineEle.classList.add("dark");
      textBgEle.classList.add("dark");
    } else {
      textOutlineEle.classList.remove("dark");
      textBgEle.classList.remove("dark");
    }
  });

document
  .getElementById("download")
  .addEventListener("click", async function () {
    if (file) {
      const captureEle = document.getElementById("capture");
      if (captureEle) {
        captureEle.style.maxWidth = "100%";
        const images = captureEle.getElementsByTagName("img");
        const promises = Array.from(images).map((img) => {
          img.width = imgWidth;
          img.height = imgHeight;
          return new Promise((resolve) => {
            if (img.complete) resolve();
            else {
              img.onload = resolve;
              img.onerror = resolve;
            }
          });
        });
        await Promise.all(promises);
        try {
          const canvas = await html2canvas(captureEle);
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = `${imgText}_${dayjs().format(
            "DD-MM-YYYY_HH-mm-ss"
          )}.png`;
          link.click();
          // captureEle.clientHeight = initHeight;
          // captureEle.clientWidth = initWidth;
        } catch (error) {
          console.error("Error generating canvas:", error);
        }
        captureEle.style.maxWidth = "90dvw";
      } else console.error('Element with id "capture" not found.');
    } else alert("Select an image");
  });
