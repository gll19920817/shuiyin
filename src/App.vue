<script setup>
import logo from "./assets/imgs/logo.png";
import imageAddIcon from "./assets/imgs/image-add-line.png";
import editIcon from "./assets/imgs/image-edit-line.png";
import downloadIcon from "./assets/imgs/download-line.png";
import closeIcon from "./assets/imgs/close-line.png";

import { ref, onMounted, computed } from "vue";
import { useLoading } from "vue-loading-overlay";

const $loading = useLoading({});

const $loader = ref(null);

import * as htmlToImage from "html-to-image";
const downloadImg = () => {
  $loader.value = $loading.show({
    color: "#8bc63f",
  });

  htmlToImage
    .toJpeg(document.getElementById("capture"), {
      quality: 1,
      filter: (e) => e.id != "reload-btn",
    })
    .then(function (dataUrl) {
      $loader.value.hide();
      const link = document.createElement("a");
      link.download = `leetphoto-${Math.random().toString(36).slice(2)}.jpeg`;
      link.href = dataUrl;
      link.click();
    });
};

const exifObj = ref(null);

const imageUrl = ref("");

const fileInput = ref(null);

const uploadImg = () => {
  fileInput.value.click();
};

const getExif = () => {
  setTimeout(() => {
    EXIF.getData(document.getElementById("photo"), function () {
      exifObj.value = EXIF.getAllTags(this);
      exifObj.value.DateTimeFormated =
        exifObj.value.DateTimeOriginal.split(" ")[0].replaceAll(":", "-") +
        "T" +
        exifObj.value.DateTimeOriginal.split(" ")[1].substr(0, 5);
    });
  }, 1000);
};

const brandLogoPath = (logo) => `/images/${logo}.png`;

onMounted(() => {
  fileInput.value.addEventListener("change", (e) => {
    $loader.value = $loading.show({
      color: "#8bc63f",
    });

    const fileReader = new FileReader();
    fileReader.addEventListener("load", (event) => {
      $loader.value.hide();

      imageUrl.value = fileReader.result;

      getExif();
    });

    fileReader.readAsDataURL(e.target.files[0]);
  });
});

const showEditor = ref(false);

const brandLogos = {
  apple: "x",
  canon: "y",
  fujifilm: "y",
  hasselblad: "x",
  huawei: "x",
  kodak: "y",
  leica: "x",
  nikon: "x",
  olympus: "y",
  oppo: "y",
  panasonic: "y",
  pentax: "y",
  ricoh: "y",
  samsung: "y",
  sony: "y",
  xiaomi: "x",
  zeiss: "x",
  zte: "y",
};

const rectangleLogo = computed(
  () => brandLogos[exifObj.value.Make.toLowerCase()] == "y"
);

const toggleBrand = (brand) => (exifObj.value.Make = brand.toUpperCase());

const refresh = () => window.location.reload();
</script>

<template>
  <div v-if="imageUrl">
    <div id="capture" class="max-w-xl relative">
      <button
        id="reload-btn"
        @click="refresh"
        class="absolute top-2 right-2 rounded-full p-1 hover:bg-white transition-all"
      >
        <img v-show="!showEditor" class="w-6 h-6" :src="closeIcon" alt="" />
      </button>
      <img id="photo" :src="imageUrl" />
      <div
        v-if="exifObj && Object.keys(exifObj).length"
        class="bg-white p-5 flex justify-between items-start"
      >
        <h3 v-show="exifObj.Model" class="text-sm">{{ exifObj.Model }}</h3>
        <div class="flex justify-between items-center gap-3">
          <img
            v-show="exifObj.Model"
            class="h-8 object-contain"
            :class="{ 'w-12': rectangleLogo, 'w-8': !rectangleLogo }"
            :src="brandLogoPath(exifObj.Make.toLowerCase())"
          />
          <div class="w-[1.5px] h-9 bg-gray-300"></div>
          <div class="flex flex-col justify-between gap-3">
            <h3 class="flex gap-2.5 text-sm leading-none">
              <span v-show="exifObj.FocalLengthIn35mmFilm"
                >{{ exifObj.FocalLengthIn35mmFilm }}mm</span
              ><span v-show="exifObj.ApertureValue"
                >f/{{ exifObj.ApertureValue }}</span
              ><span v-show="exifObj.ExposureTime"
                >{{
                  exifObj.ExposureTime >= 1
                    ? exifObj.ExposureTime
                    : "1/" + Math.round(1 / exifObj.ExposureTime)
                }}s</span
              ><span v-show="exifObj.ISOSpeedRatings"
                >ISO{{ exifObj.ISOSpeedRatings }}</span
              >
            </h3>
            <h5
              class="font-light text-gray-600 opacity-75 text-xs leading-none flex gap-1 tracking-wider"
            >
              <span v-if="exifObj.DateTimeFormated">{{
                exifObj.DateTimeFormated.split("T")[0].replaceAll("-", ".")
              }}</span
              ><span v-if="exifObj.DateTimeFormated">{{
                exifObj.DateTimeFormated.split("T")[1]
              }}</span>
            </h5>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!showEditor"
      @click="showEditor = true"
      class="bg-white p-2 cursor-pointer w-10 h-10 grid place-items-center rounded-full fixed right-[10vw] bottom-[20vh]"
    >
      <img :src="editIcon" />
    </div>

    <div
      v-if="!showEditor"
      @click="downloadImg"
      class="bg-white p-2 cursor-pointer w-10 h-10 grid place-items-center rounded-full fixed right-[10vw] bottom-[10vh]"
    >
      <img :src="downloadIcon" />
    </div>
  </div>
  <div
    @click="uploadImg"
    class="w-full h-full md:w-9/12 md:h-4/5 cursor-pointer flex flex-col items-center justify-center rounded-lg md:border-4 md:border-dotted md:border-white m-10"
    v-else
  >
    <img class="w-48 h-48" :src="imageAddIcon" />
    <button
      class="text-[#8bc63f] bg-white hover:bg-[#8bc63f] hover:text-white transition-all px-10 py-2 mt-16 font-bold rounded"
    >
      添加图片
    </button>
    <input ref="fileInput" class="hidden" type="file" accept="image/*" />
  </div>

  <header class="absolute top-4 flex gap-1 items-center" v-if="!imageUrl">
    <img class="w-8 h-8" :src="logo" alt="" />
    <h3 class="text-white text-lg">
      eetphoto<span class="text-[#8bc63f]">.</span>
    </h3>
  </header>

  <footer
    class="absolute bottom-4 text-gray-400 text-sm flex text-center items-center justify-between gap-2"
    v-if="!imageUrl"
  >
    <a target="_blank" href="https://beian.miit.gov.cn/"
      >豫ICP备2023005272号-1</a
    >
    <span>leetphoto.com</span>
  </footer>

  <div
    class="glass w-full h-full md:w-2/3 md:h-4/5 overflow-y-scroll absolute flex flex-col md:flex-row px-6 py-10 gap-4"
    v-if="exifObj && showEditor"
  >
    <button
      @click="showEditor = false"
      class="absolute top-2 right-2 rounded-full p-1 hover:bg-white transition-all"
    >
      <img class="w-6 h-6" :src="closeIcon" alt="" />
    </button>
    <div class="flex-1">
      <h3 class="border-b pb-2 mb-6">选择相机厂商</h3>

      <div class="flex flex-wrap gap-4">
        <div
          class="flex flex-col gap-2 cursor-pointer"
          @click="toggleBrand(brand)"
          v-for="(_, brand) in brandLogos"
        >
          <div class="border rounded-full p-2 bg-white self-center">
            <img class="w-6 h-6 object-contain" :src="brandLogoPath(brand)" />
          </div>
          <h5 class="text-xs self-center">{{ brand }}</h5>
        </div>
      </div>
    </div>
    <div class="flex-1">
      <h3 class="border-b pb-2 mb-6">Exif信息</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <h5>相机厂商</h5>
          <input
            class="outline-none px-2 py-1 rounded"
            type="text"
            v-model="exifObj.Make"
          />
        </div>
        <div class="flex flex-col gap-2">
          <h5>相机型号</h5>
          <input
            class="outline-none px-2 py-1 rounded"
            type="text"
            v-model="exifObj.Model"
          />
        </div>
        <div class="flex flex-col gap-2">
          <h5>焦距(mm)</h5>
          <input
            class="outline-none px-2 py-1 rounded"
            type="number"
            min="1"
            v-model="exifObj.FocalLengthIn35mmFilm"
          />
        </div>
        <div class="flex flex-col gap-2">
          <h5>光圈(ƒ)</h5>
          <input
            class="outline-none px-2 py-1 rounded"
            type="number"
            step="0.1"
            min="0.95"
            v-model="exifObj.ApertureValue"
          />
        </div>
        <div class="flex flex-col gap-2">
          <h5>快门速度(s)</h5>
          <input
            class="outline-none px-2 py-1 rounded"
            type="number"
            step="0.001"
            min="0.001"
            v-model="exifObj.ExposureTime"
          />
        </div>
        <div class="flex flex-col gap-2">
          <h5>ISO</h5>
          <input
            class="outline-none px-2 py-1 rounded"
            type="number"
            min="50"
            v-model="exifObj.ISOSpeedRatings"
          />
        </div>
        <div class="flex flex-col gap-2">
          <h5>拍摄时间</h5>
          <input
            class="outline-none px-2 py-1 rounded"
            type="datetime-local"
            v-model="exifObj.DateTimeFormated"
          />
        </div>
      </div>
    </div>
  </div>
</template>
