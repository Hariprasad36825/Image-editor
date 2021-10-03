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

const avail_submenu = [
  show_crop_submenu,
  show_crop_submenu,
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

// slide element declarations
const slider = document.querySelector(".rs-range");
var rangeBullet = document.getElementById("rs-bullet");
var scale_symbol = "%";
var cached_zoom_value = 20;
var cached_Rotation_value = 0;

CropIcon.addEventListener("click", function () {
  console.log("in");
  for (var i = 0; i < avail_submenu.length; i++) {
    avail_submenu[i](0);
  }
  show_crop_submenu(1);
  // cropper js

  const cropper = new Cropper(Image_Edit_Preview, {
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

  function getBackgroundSize(slider) {
    const min = +slider.min || 0;
    const max = +slider.max || 100;
    const value = +slider.value;

    const size = ((value - min) / (max - min)) * 100;
    return size;
  }

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

  okDiv.addEventListener("click", function () {
    const boxData = cropper.getCropBoxData();
    const OldData = cropper.getCanvasData();
    console.log('hi',cropper.getCroppedCanvas({
      minWidth: 256,
      minHeight: 256,
      maxWidth: 4096,
      maxHeight: 4096,
      fillColor: '#fff',
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
  }));
  ImagePreviewDiv.document.write('<img src="' + cropper.getCroppedCanvas({
    minWidth: 256,
    minHeight: 256,
    maxWidth: 4096,
    maxHeight: 4096,
    fillColor: '#fff',
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
}) + '">');
      
    console.log(Image_Edit_Preview.src);
    Undo = Undo.slice(0, ind);
    Redo = Redo.slice(0, ind);
    Undo.push(function () {
      cropper.setCanvasData(OldData);
      cropper.setCropBoxData(boxData);
    });
    Redo.push(function () {
      cropper.setCanvasData(boxData);
    });
    // console.log(Undo[0]);
    ind++;
    changeUndoDiv();
  });
});

const saveImg = () => {};
saveImg();

// show_crop_submenu(1);
