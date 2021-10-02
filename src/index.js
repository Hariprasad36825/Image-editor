import "./styles.css";
import "./filter.css";
import "./frame.css";
import Cropper from "cropperjs";
// $(".lock").click(function () {
//   $(this).toggleClass("unlocked");
// });

const avail_submenu = [
  show_crop_submenu,
  show_crop_submenu,
  show_crop_submenu,
  show_crop_submenu,
  show_crop_submenu,
  show_crop_submenu
];

// icon div declarations

const CropIcon = document.getElementById("crop_icon");

// submenu declarations

const CropDiv = document.getElementById("Crop_submenu");
const AddCropDiv = document.getElementById("crop_addtional_menu");

const ImagePreviewDiv = document.getElementById("ImagePreview");
const Image_Edit_Preview = document.getElementById("Image_Edit_Preview");

function show_crop_submenu(fl) {
  if (fl) {
    CropDiv.classList.remove("d-none");
    CropDiv.classList.add("d-block");
    ImagePreviewDiv.style.marginTop = ".3rem";
    AddCropDiv.classList.remove("d-none");
    AddCropDiv.classList.add("d-flex");
  } else {
    CropDiv.classList.add("d-none");
    CropDiv.classList.remove("d-block");
    ImagePreviewDiv.style.marginTop = "calc(0.5rem + 40px);";
    AddCropDiv.classList.add("d-none");
    AddCropDiv.classList.remove("d-flex");
  }
}

// js for crop
// tag div declarations
const RotationTag = document.getElementById("RotationTag");
const zoomTag = document.getElementById("zoomTag");

CropIcon.addEventListener("click", function () {
  console.log("in");
  for (var i = 0; i < avail_submenu.length; i++) {
    avail_submenu[i](0);
  }
  show_crop_submenu(1);
});

RotationTag.addEventListener("click", function () {
  RotationTag.classList.add("active");
  zoomTag.classList.remove("active");
});

zoomTag.addEventListener("click", function () {
  RotationTag.classList.remove("active");
  zoomTag.classList.add("active");
});

// Slider js
const slider = document.querySelector(".rs-range");
var rangeBullet = document.getElementById("rs-bullet");
function setBackgroundSize(slider) {
  slider.style.setProperty(
    "--background-size",
    String(getBackgroundSize(slider)) + "%"
  );
}

setBackgroundSize(slider);

slider.addEventListener("input", function () {
  setBackgroundSize(slider);
  var bulletPosition = (slider.value - slider.min) * 2.4;
  rangeBullet.parentElement.style.left = bulletPosition + "px";
  rangeBullet.innerHTML = slider.value;
});

function getBackgroundSize(slider) {
  const min = +slider.min || 0;
  const max = +slider.max || 100;
  const value = +slider.value;

  const size = ((value - min) / (max - min)) * 100;

  return size;
}

// cropper js

const cropper = new Cropper(Image_Edit_Preview, {
  // aspectRatio: 16/9,
  crop(event) {
    console.log(event.detail.x);
    // console.log(event.detail.y);
    // console.log(event.detail.width);
    // console.log(event.detail.height);
    // console.log(event.detail.rotate);
    // console.log(event.detail.scaleX);
    // console.log(event.detail.scaleY);

    // cropx = event.detail.x
    // cropy = event.detail.y
    // crop_height = event.detail.height
    // crop_width = event.detail.width
    // image_need_to_send = img
  }
});

show_crop_submenu(1);
