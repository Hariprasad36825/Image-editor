import "./styles.css";
import "./filter.css";
import "./frame.css";
import Cropper from "cropperjs";
// $(".lock").click(function () {
//   $(this).toggleClass("unlocked");
// });
// cache array to undo and redo
var Undo = [];
var Redo = [];
var ind = 0;

const okDiv = document.getElementById("okDiv");
const selectedDiv = "crop";
var cropper;

const avail_submenu = [
  show_crop_submenu,
  show_adjust_submenu,
  show_crop_submenu,
  show_crop_submenu,
  show_crop_submenu,
  show_crop_submenu
];

// Undo Redo function
const undo = document.getElementById("undoDiv");
const redo = document.getElementById("redoDiv");
const changeUndoDiv = () => {
  console.log(ind, "ind");
  function showDiv(div, fl) {
    if (fl) {
      div.classList.add("active");
    } else {
      div.classList.remove("active");
    }
  }

  if (ind !== 0 && Undo.length > 0) {
    showDiv(undo, 1);
  } else {
    showDiv(undo, 0);
  }
  if (ind !== Redo.length && Redo.length > 0) {
    showDiv(redo, 1);
  } else {
    showDiv(redo, 0);
  }
};
changeUndoDiv();

//click events
undo.addEventListener("click", function () {
  if (ind !== 0 && Undo.length > 0) {
    ind--;
    Undo[ind]();
    console.log(Undo);

    changeUndoDiv();
  }
});

redo.addEventListener("click", function () {
  if (ind !== Redo.length && Redo.length > 0) {
    Redo[ind++]();
    // ind++;
    changeUndoDiv();
  }
});

//ok div

const enableDiableOkDiv = (flag) => {
  if (flag) {
    okDiv.classList.add("active");
  } else {
    okDiv.classList.remove("active");
  }
};

// icon div declarations

const CropIcon = document.getElementById("crop_icon");
const AdjustIcon = document.getElementById("adjust_icon");
const AnnotateIcon = document.getElementById("annotate_icon");
const FilterIcon = document.getElementById("filter_icon");
const StickerIcon = document.getElementById("sticker_icon");
const FrameIcon = document.getElementById("frame_icon");
const ResizeIcon = document.getElementById("resize_icon");

// submenu declarations

const CropDiv = document.getElementById("Crop_submenu");
const AddCropDiv = document.getElementById("crop_addtional_menu");

const AdjustDiv = document.getElementById("Adjust_submenu");

const ImagePreviewDiv = document.getElementById("ImagePreview");
const Image_Edit_Preview = document.getElementById("Image_Edit_Preview");

// slide element declarations
const slider = document.querySelector(".rs-range");
var rangeBullet = document.getElementById("rs-bullet");
var scale_symbol = "%";
var cached_zoom_value = 20;
var cached_Rotation_value = 0;
var cancrop = 0;

// function RemoveEventListenerForSlider(){
//   slider.removeEventListener("input", )
// }

function show_crop_submenu(fl) {
  if (fl) {
    CropDiv.classList.remove("d-none");
    CropDiv.classList.add("d-block");
    ImagePreviewDiv.style.marginTop = ".3rem";
    AddCropDiv.classList.remove("d-none");
    AddCropDiv.classList.add("d-flex");
    rangeBullet.parentElement.style.left = "59px";
  } else {
    CropDiv.classList.add("d-none");
    CropDiv.classList.remove("d-block");
    ImagePreviewDiv.style.marginTop = "45px";
    AddCropDiv.classList.add("d-none");
    AddCropDiv.classList.remove("d-flex");
    rangeBullet.parentElement.style.left = "0px";
    try {
      cropper.destroy();
    } catch (error) {}
  }
}

function show_adjust_submenu(fl) {
  if (fl) {
    AdjustDiv.classList.remove("d-none");
    AdjustDiv.classList.add("d-block");
  } else {
    AdjustDiv.classList.add("d-none");
    AdjustDiv.classList.remove("d-block");
  }
}

// Slider js

function setBackgroundSize(slider) {
  slider.style.setProperty(
    "--background-size",
    String(getBackgroundSize(slider)) + "%"
  );
}

function getBackgroundSize(slider) {
  const min = +slider.min || 0;
  const max = +slider.max || 100;
  const value = +slider.value;

  const size = ((value - min) / (max - min)) * 100;
  return size;
}

function scrollHorizontally(e) {
  e = window.event || e;
  var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
  document.getElementById("AdjustTagContainer").scrollLeft -= delta * 40; // Multiplied by 40
  e.preventDefault();
}

function doScrollHorizontally(id) {
  if (document.getElementById(id).addEventListener) {
    // IE9, Chrome, Safari, Opera
    document
      .getElementById(id)
      .addEventListener("mousewheel", scrollHorizontally, false);
    // Firefox
    document
      .getElementById(id)
      .addEventListener("DOMMouseScroll", scrollHorizontally, false);
  } else {
    // IE 6/7/8
    document.getElementById(id).attachEvent("onmousewheel", scrollHorizontally);
  }
}

// Horizontal Scrollable tags
doScrollHorizontally("AdjustTagContainer");

// js for crop
// tag div declarations
const RotationTag = document.getElementById("RotationTag");
const zoomTag = document.getElementById("zoomTag");

const BrightnessTag = document.getElementById("BrightnessTag");
const ContrastTag = document.getElementById("ContrastTag");
const SaturationTag = document.getElementById("SaturationTag");
const ExposureTag = document.getElementById("ExposureTag");
const TemperatureTag = document.getElementById("TemperatureTag");
const GammaTag = document.getElementById("GammaTag");
const ClarityTag = document.getElementById("ClarityTag");
const VignetteTag = document.getElementById("VignetteTag");

//change Active tag
function changeActiveForTags(id) {
  let tags = document.querySelectorAll(".Tag");
  tags.forEach((el) => {
    el.classList.remove("active");
  });
  id.classList.add("active");
}

CropIcon.addEventListener("click", function () {
  cancrop = 1;
  console.log("in");
  for (var i = 0; i < avail_submenu.length; i++) {
    avail_submenu[i](0);
  }
  show_crop_submenu(1);
  // cropper js

  var imageDiv =
    Image_Edit_Preview.classList.length === 1
      ? Image_Edit_Preview
      : document.getElementById("CroppedImage_Edit_Preview");
  cropper = new Cropper(imageDiv, {
    // aspectRatio: 16/9,
    autoCropArea: 0.6,
    viewMode: 3,
    crop(event) {},
    cropstart(event) {
      const cached_crop_data = cropper.getCropBoxData();

      Undo = Undo.slice(0, ind);
      Undo.push(function () {
        cropper.setCropBoxData(cached_crop_data);
      });
    },
    cropend(event) {
      const croped_data = cropper.getCropBoxData();

      Redo = Redo.slice(0, ind);
      Redo.push(function () {
        cropper.setCropBoxData(croped_data);
      });
      ind++;
      changeUndoDiv();
    }
  });
  RotationTag.addEventListener("click", function () {
    scale_symbol = "°";
    slider.min = -50;
    slider.max = 50;
    slider.value = cached_Rotation_value;

    setBackgroundSize(slider);
    var bulletPosition = (slider.value - slider.min) * 2.4;
    rangeBullet.parentElement.style.left = bulletPosition + "px";
    rangeBullet.innerHTML = slider.value + scale_symbol;

    RotationTag.classList.add("active");
    zoomTag.classList.remove("active");
  });

  zoomTag.addEventListener("click", function () {
    scale_symbol = "%";
    slider.min = 0;
    slider.max = 100;
    slider.value = cached_zoom_value;

    setBackgroundSize(slider);
    var bulletPosition = (slider.value - slider.min) * 2.4;
    rangeBullet.parentElement.style.left = bulletPosition + "px";
    rangeBullet.innerHTML = slider.value + scale_symbol;

    RotationTag.classList.remove("active");
    zoomTag.classList.add("active");
  });

  // Slider js

  setBackgroundSize(slider);

  slider.addEventListener("input", function () {
    setBackgroundSize(slider);
    var bulletPosition = (slider.value - slider.min) * 2.4;
    rangeBullet.parentElement.style.left = bulletPosition + "px";
    rangeBullet.innerHTML = slider.value + scale_symbol;

    if (scale_symbol === "%") {
      cropper.zoomTo(slider.value / 20);
    } else {
      cropper.rotateTo(slider.value);
    }
  });

  slider.addEventListener("change", function () {
    Undo = Undo.slice(0, ind);
    Redo = Redo.slice(0, ind);
    if (scale_symbol === "%") {
      const temp = cached_zoom_value;
      Undo.push(function () {
        cropper.zoomTo(temp / 20);
        cached_zoom_value = temp;
        zoomTag.click();
      });

      cached_zoom_value = slider.value;

      const temp1 = cached_zoom_value;
      Redo.push(function () {
        cropper.zoomTo(temp1 / 20);
        cached_zoom_value = temp1;
        zoomTag.click();
      });
    } else {
      const temp = cached_Rotation_value;
      Undo.push(function () {
        cropper.rotateTo(temp);
        cached_Rotation_value = temp;
        RotationTag.click();
      });

      cached_Rotation_value = slider.value;

      const temp1 = cached_Rotation_value;
      Redo.push(function () {
        cropper.rotateTo(temp1);
        cached_Rotation_value = temp1;
        RotationTag.click();
      });
    }

    ind++;
    changeUndoDiv();
  });

  // crop options

  const cropOptionsFunction = () => {
    const cropOptions = document.querySelectorAll(".CropOptions");
    cropOptions.forEach((el) => {
      el.addEventListener("click", function () {
        cropOptions.forEach((i) => {
          i.classList.remove("active");
        });
        el.classList.add("active");
        cropper.setAspectRatio(parseInt(el.id[0]) / parseInt(el.id[2]));
      });
    });
  };
  cropOptionsFunction();

  const RotateFunction = () => {
    document
      .getElementById("rotate_90Deg_icon")
      .addEventListener("click", function () {
        cropper.rotate(90);
        Undo = Undo.slice(0, ind);
        Redo = Redo.slice(0, ind);
        Undo.push(function () {
          cropper.rotate(-90);
        });
        Redo.push(function () {
          cropper.rotate(90);
        });
        // console.log(Undo[0]);
        ind++;
        changeUndoDiv();
      });
  };
  RotateFunction();

  const FlipFunction = () => {
    var flipFL = 0;
    document.getElementById("Flip_icon").addEventListener("click", function () {
      Undo = Undo.slice(0, ind);
      Redo = Redo.slice(0, ind);
      if (flipFL) {
        cropper.scaleX(1);
        flipFL = 0;
        Undo.push(function () {
          cropper.scaleX(-1);
        });
        Redo.push(function () {
          cropper.scaleX(1);
        });
      } else {
        cropper.scaleX(-1);
        flipFL = 1;
        Undo.push(function () {
          cropper.scaleX(1);
        });
        Redo.push(function () {
          cropper.scaleX(-1);
        });
      }
      ind++;
      changeUndoDiv();
    });
  };
  FlipFunction();
});

AdjustIcon.addEventListener("click", function () {
  for (var i = 0; i < avail_submenu.length; i++) {
    avail_submenu[i](0);
  }
  show_adjust_submenu(1);

  BrightnessTag.addEventListener("click", function () {
    changeActiveForTags(BrightnessTag);
  });

  slider.addEventListener("input", function () {
    setBackgroundSize(slider);
    // var bulletPosition = (slider.value - slider.min) * 2.4;
    // rangeBullet.parentElement.style.left = bulletPosition + "px";
    // rangeBullet.innerHTML = slider.value + scale_symbol;

    // if (scale_symbol === "%") {
    //   cropper.zoomTo(slider.value / 20);
    // } else {
    //   cropper.rotateTo(slider.value);
    // }
    console.log("hi");
  });
});

const updateOKDiv = () => {
  if (cancrop) {
    okDiv.classList.add("active");
    okDiv.addEventListener("click", function () {
      const boxData = cropper.getCropBoxData();
      const canvas = cropper.getCroppedCanvas({
        minWidth: 200,
        minHeight: 200,
        maxWidth: 4096,
        maxHeight: 4096,
        fillColor: "#fff",
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "low"
      });
      cropper.destroy();
      show_crop_submenu(0);
      console.log(boxData, canvas);

      const cropped_Image = document.getElementById(
        "CroppedImage_Edit_Preview"
      );
      if (cropped_Image) {
        ImagePreviewDiv.removeChild(cropped_Image);
        console.log(ImagePreviewDiv, cropped_Image, canvas);
      }
      canvas.classList.add("Image_Edit_Preview");
      canvas.id = "CroppedImage_Edit_Preview";

      Image_Edit_Preview.classList.add("d-none");
      ImagePreviewDiv.appendChild(canvas);

      console.log(Image_Edit_Preview.src);
      Undo = Undo.slice(0, ind);
      Redo = Redo.slice(0, ind);

      const croppedImage = document.getElementById("CroppedImage_Edit_Preview");
      Undo.push(function () {
        Image_Edit_Preview.src += "?t=" + new Date().getTime();
        croppedImage.classList.add("d-none");
        Image_Edit_Preview.classList.remove("d-none");
        CropIcon.click();
        cached_zoom_value = 20;
        zoomTag.click();
        console.log(ImagePreviewDiv);
        cropper.setCropBoxData(boxData);
      });

      Redo.push(function () {
        croppedImage.classList.remove("d-none");
        Image_Edit_Preview.classList.add("d-none");
        show_crop_submenu(0);
        cropper.destroy();
      });
      // console.log(Undo[0]);
      ind++;
      changeUndoDiv();
    });
  } else {
    okDiv.classList.remove("active");
  }
};

const saveImg = () => {};
saveImg();

// show_crop_submenu(1);
