<script setup>
import logo from "./assets/imgs/logo.png";
import imageAddIcon from "./assets/imgs/image-add-line.png";

import editIcon from "./assets/imgs/image-edit-line.png";
import downloadIcon from "./assets/imgs/download-line.png";
import closeIcon from "./assets/imgs/close-line.png";
import sunIcon from "./assets/imgs/sun-line.png";
import moonIcon from "./assets/imgs/moon-line.png";
import switcherIcon from "./assets/imgs/camera-switch-line.png";
import slideshowIcon from "./assets/imgs/slideshow-line.png";

import paletteIcon from "./assets/imgs/palette-line.svg";
import fontSizeIcon from "./assets/imgs/font-size.png";

import { ref, onMounted, computed, watch } from "vue";

import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

import { Typed } from "@duskmoon/vue3-typed-js";

const options = {
  strings: ["eetphoto.", "et's image."],
  loop: true,
  typeSpeed: 100,
  backSpeed: 50,
};

const $toast = useToast({
  position: "top-right",
});

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

const colorPicker = ref(null);
const pickColor = () => {
  colorPicker.value.click();
};

const getExif = () => {
  EXIF.getData(document.getElementById("photo"), function () {
    exifObj.value = EXIF.getAllTags(this);

    if (Object.keys(exifObj.value).length == 0) {
      $toast.warning("Exif信息获取失败，请手动编辑");
      return;
    }

    if (typeof exifObj.value.Make == "undefined") {
      $toast.warning("Exif信息获取不完整，请手动补充");
    }

    if (typeof exifObj.value.DateTimeOriginal != "undefined") {
      let original = exifObj.value.DateTimeOriginal.split(" ");
      exifObj.value.DateTimeFormated =
        original[0].replaceAll(":", "-") + "T" + original[1].substr(0, 5);
    }

    oritorientation.value = exifObj.value.PixelXDimension > exifObj.value.PixelYDimension ? 'landscape' : 'portrait'
  });
};

const brandLogoPath = (logo, theme) => {
  let suffix = brandLogos[logo].substr(-1);

  if (theme == "dark" && suffix == "+") {
    return `/images/${logo}_light.png`;
  }

  return `/images/${logo}.png`;
};

const welcomeMessage = () => {
  if (window.localStorage.getItem('first-time-visitor')) {
    return;
  }

  window.localStorage.setItem('first-time-visitor', true);
  $toast.info('欢迎👏🏻👏🏻👏🏻，首次使用请耐心等待网站字体加载完整，视网速情况约需要10-20s...', {
    duration: 20000,
  });
}

onMounted(() => {
  document.addEventListener("click", (e) => {
    if (showEditor.value == true) {
      showEditor.value = false
    }
  })

  fileInput.value.addEventListener("change", (e) => {
    $loader.value = $loading.show({
      color: "#8bc63f",
    });

    const fileReader = new FileReader();
    fileReader.addEventListener("load", (event) => {
      imageUrl.value = fileReader.result;

      setTimeout(() => {
        getExif();
        $loader.value.hide();
      }, 1000);

      welcomeMessage();
    });

    fileReader.readAsDataURL(e.target.files[0]);
  });
});

const showEditor = ref(false);

const brandLogos = {
  apple: "x+",
  canon: "y",
  dji: 'x+',
  fujifilm: "y+",
  hasselblad: "x",
  honor: "y+",
  huawei: "x+",
  kodak: "y",
  leica: "x",
  lumix: "y+",
  nikon: "x",
  olympus: "y",
  oneplus: 'y',
  oppo: "y",
  panasonic: "y",
  pentax: "y",
  ricoh: "y",
  samsung: "y",
  sony: "y+",
  vivo: "x",
  xmage: "y",
  xiaomi: "x",
  zeiss: "x",
  zte: "y",
  lp: "x",
};

const rectangleLogo = computed(
  () => brandLogos[exifObj.value.Make.toLowerCase()][0] == "y"
);

const toggleBrand = (brand) => (exifObj.value.Make = brand.toUpperCase());

const refresh = () => {
  let ok = confirm('Tip：记得保存嗷🙌🏻')
  if (ok) {
    window.location.reload();
  }
}

const theme = ref("light");
const toggleTheme = () =>
  (theme.value = theme.value == "dark" ? "light" : "dark");

const templates = ["xiaomi", "oppo", "vivo", "huawei"];
const tmpl_idx = ref(0);

const template = computed(() => templates[tmpl_idx.value % templates.length]);
const toggleTemplate = () => {
  tmpl_idx.value++;
  $toast.info(`水印样式【${templates[tmpl_idx.value % templates.length].toUpperCase()}】`);
};

const showTooltips = ref({
  menu: false,
  refresh: false,
  theme: false,
  edit: false,
  template: false,
  download: false,
});

const menuOpen = ref(false)

const handwriteColor = ref(theme.value == "dark" ? "#ffffff" : "#000000");
const colorPickerInput = (e) => {
  handwriteColor.value = e.target.value;
};

watch(theme, (newTheme) => {
  handwriteColor.value = newTheme == "dark" ? "#ffffff" : "#000000";
});

const handwriteFontsize = ref(18)
const showFontsizeSlider = ref(false)

const oritorientation = ref('landscape')
</script>

<template>
  <div v-if="imageUrl">
    <div id="capture" class="max-w-2xl relative">
      <div :class="{
        'px-6': template == 'oppo',
        'pt-6': template == 'oppo',
        'bg-white': theme == 'light',
        'bg-black': theme == 'dark',
      }">
        <img id="photo" :src="imageUrl" />
      </div>
      <div v-if="exifObj && Object.keys(exifObj).length">
        <div v-if="template == 'xiaomi'" class="p-5 flex justify-between items-start" :class="{
          'bg-black': theme == 'dark',
          'text-white': theme == 'dark',
          'bg-white': theme == 'light',
          'text-black': theme == 'light',
          'p-6': oritorientation == 'portrait'
        }">
          <div>
            <div class="font-midemibold" v-show="exifObj.Model">{{ exifObj.Model }}</div>
          </div>

          <div v-show="exifObj.Artist" class="font-handwrite tracking-wide"
            :style="{ color: handwriteColor, fontSize: handwriteFontsize + 'px' }">
            {{ exifObj.Artist }}
          </div>

          <div class="flex justify-between items-center gap-3">
            <img v-if="exifObj.Make" class="h-8 object-contain" :class="{ 'w-12': rectangleLogo, 'w-8': !rectangleLogo }"
              :src="brandLogoPath(exifObj.Make.toLowerCase(), theme)" />
            <div class="w-[1px] h-9 bg-[#cbcbcb] opacity-75"></div>
            <div class="flex flex-col justify-between gap-3">
              <div class="font-midemibold flex gap-2 leading-none">
                <span v-show="exifObj.FocalLength">{{ exifObj.FocalLength }}mm</span><span
                  v-show="exifObj.ApertureValue">f/{{ exifObj.ApertureValue }}</span><span
                  v-show="exifObj.ExposureTime">{{
                    exifObj.ExposureTime >= 1
                    ? exifObj.ExposureTime
                    : "1/" + Math.round(1 / exifObj.ExposureTime)
                  }}s</span><span v-show="exifObj.ISOSpeedRatings">ISO{{ exifObj.ISOSpeedRatings }}</span>
              </div>
              <div class="font-mithin font-bold flex items-center gap-2 text-xs text-[#676767] leading-none tracking-wider">
                <span v-if="exifObj.DateTimeFormated">{{
                  exifObj.DateTimeFormated.split("T")[0].replaceAll("-", ".")
                }}</span><span v-if="exifObj.DateTimeFormated">{{
  exifObj.DateTimeFormated.split("T")[1]+':00'
}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="py-6 px-16 tracking-wide text-lg flex justify-between items-center" :class="{
          'bg-black': theme == 'dark',
          'text-white': theme == 'dark',
          'bg-white': theme == 'light',
          'text-black': theme == 'light',
        }" v-else-if="template == 'oppo'">
          <div class="font-midemibold">{{ exifObj.Model }}</div>
          <div v-show="exifObj.Artist" class="font-handwrite tracking-wide"
            :style="{ color: handwriteColor, fontSize: handwriteFontsize + 'px' }">
            {{ exifObj.Artist }}
          </div>
          <div class="flex flex-col items-end gap-3">
            <div class="font-mukta">{{ exifObj.Make }}</div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#fd7a22]"></span>
              <div class=" font-midemibold flex items-center gap-2 text-sm text-[#6c6c6c] leading-none">
                <span v-show="exifObj.FocalLength">{{ exifObj.FocalLength }}mm</span><span
                  v-show="exifObj.ApertureValue">f/{{ exifObj.ApertureValue }}</span><span
                  v-show="exifObj.ExposureTime">{{
                    exifObj.ExposureTime >= 1
                    ? exifObj.ExposureTime
                    : "1/" + Math.round(1 / exifObj.ExposureTime)
                  }}s</span><span v-show="exifObj.ISOSpeedRatings">ISO{{ exifObj.ISOSpeedRatings }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="template == 'vivo'" class="py-4 flex flex-col justify-center items-center" :class="{
          'bg-black': theme == 'dark',
          'text-white': theme == 'dark',
          'bg-white': theme == 'light',
          'text-black': theme == 'light',
        }">
          <div v-show="exifObj.Artist" class="absolute right-10 font-handwrite tracking-wide"
            :style="{ color: handwriteColor, fontSize: handwriteFontsize + 'px' }">
            {{ exifObj.Artist }}
          </div>

          <img v-if="exifObj.Make" class="w-12 object-contain mb-4"
            :src="brandLogoPath(exifObj.Make.toLowerCase(), theme)" />
          <div class="font-midemibold mb-2 flex items-center gap-2">
            <span>{{ exifObj.Model }}</span>
            <span class="w-[2px] h-3 opacity-75" :class="{
              'bg-white': theme == 'dark',
              'bg-black': theme == 'light',
            }"></span>
            <span>{{ exifObj.Make }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-[#6c6c6c] leading-none">
            <span v-show="exifObj.FocalLength">{{ exifObj.FocalLength }}mm</span><span v-show="exifObj.ApertureValue">f/{{
              exifObj.ApertureValue }}</span><span v-show="exifObj.ExposureTime">{{
    exifObj.ExposureTime >= 1
    ? exifObj.ExposureTime
    : "1/" + Math.round(1 / exifObj.ExposureTime)
  }}s</span><span v-show="exifObj.ISOSpeedRatings">ISO{{ exifObj.ISOSpeedRatings }}</span>
          </div>
        </div>
        <div v-if="template == 'huawei'" class="px-4 py-2 flex justify-between items-center" :class="{
          'bg-black': theme == 'dark',
          'text-white': theme == 'dark',
          'bg-white': theme == 'light',
          'text-black': theme == 'light',
        }">
          <div class="font-midemibold">{{ exifObj.Model }}</div>
          <div v-show="exifObj.Artist" class="tracking-wide"
            :style="{ color: handwriteColor, fontSize: handwriteFontsize + 'px' }">
            {{ exifObj.Artist }}
          </div>
          <div class="flex flex-col items-end gap-2">
            <div class="font-optima text-[#ad213a] font-bold tracking-wider leading-none">{{ exifObj.Make }}</div>
            <div class="text-semibold text-xs">Confidently take photos with {{ exifObj.Make }} camera.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed right-[15%] top-[50%] transition-all -translate-y-[50%] flex flex-col gap-10 font-bold text-[#0f0f0f] items-center"
      v-if="!showEditor">
      <div @click="refresh" @mouseenter="showTooltips.refresh = true" @mouseleave="showTooltips.refresh = false"
        class="bg-white p-2 cursor-pointer w-10 h-10 grid place-items-center rounded-full">
        <img :src="switcherIcon" />
        <div v-show="showTooltips.refresh"
          class="absolute left-[120%] bg-white p-2 w-20 grid place-items-center text-center rounded whitespace-nowrap pointer-events-none">
          <span class="text-xs">重新选图</span>
          <span class="absolute w-2 h-2 bg-white -left-1 rotate-45"></span>
        </div>
      </div>

      <div @click="toggleTheme" @mouseenter="showTooltips.theme = true" @mouseleave="showTooltips.theme = false"
        class="bg-white p-2 cursor-pointer w-10 h-10 grid place-items-center rounded-full">
        <img class="w-6 h-6" :src="theme == 'dark' ? sunIcon : moonIcon" />
        <div v-show="showTooltips.theme == true"
          class="absolute left-[120%] bg-white p-2 w-20 grid place-items-center text-center rounded whitespace-nowrap pointer-events-none">
          <span class="text-xs">切换背景</span>
          <span class="absolute w-2 h-2 bg-inherit -left-1 rotate-45"></span>
        </div>
      </div>

      <div @click="toggleTemplate" @mouseenter="showTooltips.template = true" @mouseleave="showTooltips.template = false"
        class="bg-white p-2 cursor-pointer w-10 h-10 grid place-items-center rounded-full">
        <img :src="slideshowIcon" />
        <div v-show="showTooltips.template"
          class="absolute left-[120%] bg-white p-2 w-20 grid place-items-center text-center rounded whitespace-nowrap pointer-events-none">
          <span class="text-xs">切换样式</span>
          <span class="absolute w-2 h-2 bg-white -left-1 rotate-45"></span>
        </div>
      </div>

      <div @click.stop="showEditor = true; showTooltips.edit = false" @mouseenter="showTooltips.edit = true"
        @mouseleave="showTooltips.edit = false"
        class="bg-white p-2 cursor-pointer w-10 h-10 grid place-items-center rounded-full">
        <img :src="editIcon" />
        <div v-show="showTooltips.edit"
          class="absolute left-[120%] bg-white p-2 w-20 grid place-items-center text-center rounded whitespace-nowrap pointer-events-none">
          <span class="text-xs">编辑图片</span>
          <span class="absolute w-2 h-2 bg-white -left-1 rotate-45"></span>
        </div>
      </div>

      <div @click="downloadImg" @mouseenter="showTooltips.download = true" @mouseleave="showTooltips.download = false"
        class="bg-white p-2 cursor-pointer w-10 h-10 grid place-items-center rounded-full">
        <img :src="downloadIcon" />

        <div v-show="showTooltips.download"
          class="absolute left-[120%] bg-white p-2 w-20 grid place-items-center text-center rounded whitespace-nowrap pointer-events-none">
          <span class="text-xs">保存图片</span>
          <span class="absolute w-2 h-2 bg-white -left-1 rotate-45"></span>
        </div>
      </div>
    </div>
  </div>

  <div @click="uploadImg"
    class="w-full h-full md:w-9/12 md:h-4/5 cursor-pointer flex flex-col items-center justify-center rounded-lg md:border-4 md:border-dotted md:border-white m-10"
    v-else>
    <img class="w-48 object-contain" :src="imageAddIcon" />
    <button
      class="bg-[#8bc63f] text-white hover:bg-white hover:text-[#8bc63f] transition-all px-10 py-2 mt-16 font-bold rounded">
      添加图片
    </button>
    <input ref="fileInput" class="hidden" type="file" accept="image/*" />
  </div>
  
  <header class="absolute top-4 flex gap-1 items-center" v-if="!imageUrl">
    <img class="w-8 h-8" :src="logo" alt="" />
    <div class="text-white text-lg flex">
      <Typed :options="options">
        <span class="typing"></span>
      </Typed>
      <!-- <span class="text-[#8bc63f]">.</span> -->
    </div>
  </header>

  <footer class="absolute bottom-4 text-gray-400 text-sm flex text-center items-center justify-between gap-2"
    v-if="!imageUrl">
    <a target="_blank" href="https://beian.miit.gov.cn/">豫ICP备2023005272号-1</a>
    <span>leetphoto.com</span>
  </footer>

  <div @click.stop=""
    class="glass w-full h-full md:w-2/3 md:h-4/5 overflow-y-auto absolute flex flex-col md:flex-row px-6 py-10 gap-4"
    v-if="exifObj && showEditor">
    <button @click="showEditor = false" class="absolute top-2 right-2 rounded-full p-1 hover:bg-white transition-all">
      <img class="w-6 h-6" :src="closeIcon" />
    </button>
    <div class="flex-1">
      <div class="border-b pb-2 mb-6">选择相机厂商</div>

      <div class="flex flex-wrap gap-4">
        <div class="flex flex-col gap-2 cursor-pointer" @click="toggleBrand(brand)" v-for="(_, brand) in brandLogos">
          <div class="border-2 rounded-full p-2 bg-white self-center" :class="{
            'border-[#61c63f]':
              exifObj.Make && brand == exifObj.Make.toLowerCase(),
          }">
            <img class="w-6 h-6 object-contain" :src="brandLogoPath(brand)" />
          </div>
          <div class="text-xs self-center">{{ brand }}</div>
        </div>
      </div>
    </div>
    <div class="flex-1">
      <div class="border-b pb-2 mb-6">Exif信息</div>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label>相机厂商</label>
          <input class="outline-none px-2 py-1 rounded text-gray-600" type="text" v-model="exifObj.Make" />
        </div>
        <div class="flex flex-col gap-2">
          <label>相机型号</label>
          <input class="outline-none px-2 py-1 rounded text-gray-600" type="text" v-model="exifObj.Model" />
        </div>
        <div class="flex flex-col gap-2">
          <label>焦距(mm)</label>
          <input class="outline-none px-2 py-1 rounded text-gray-600" type="number" min="1"
            v-model="exifObj.FocalLength" />
        </div>
        <div class="flex flex-col gap-2">
          <label>光圈(ƒ)</label>
          <input class="outline-none px-2 py-1 rounded text-gray-600" type="number" step="0.1" min="0.95"
            v-model="exifObj.ApertureValue" />
        </div>
        <div class="flex flex-col gap-2">
          <label>快门速度(s)</label>
          <input class="outline-none px-2 py-1 rounded text-gray-600" type="number" step="0.001" min="0.001"
            v-model="exifObj.ExposureTime" />
        </div>
        <div class="flex flex-col gap-2">
          <label>ISO</label>
          <input class="outline-none px-2 py-1 rounded text-gray-600" type="number" min="50"
            v-model="exifObj.ISOSpeedRatings" />
        </div>
        <div class="flex flex-col gap-2">
          <label>拍摄时间</label>
          <input class="outline-none px-2 py-1 rounded text-gray-600" type="datetime-local"
            v-model="exifObj.DateTimeFormated" />
        </div>
        <div class="flex flex-col gap-2 relative">
          <div class="flex justify-between items-center">
            <label>拍摄者(签名)</label>
            <div class="flex gap-2 items-center">
              <div class="flex relative">
                <img @click="showFontsizeSlider = !showFontsizeSlider" class="w-4 h-4 cursor-pointer"
                  :src="fontSizeIcon" />
                <div v-show="showFontsizeSlider"
                  class="absolute -top-10 right-0 border bg-white py-2 px-3 rounded flex items-center gap-2">
                  <input type="range" min="16" max="24" step="1" v-model="handwriteFontsize" />
                  <span class="text-sm">{{ handwriteFontsize }}px</span>
                </div>
              </div>
              <div class="flex">
                <img class="w-4 h-4 cursor-pointer" @click="pickColor" :src="paletteIcon" />
                <input @change="colorPickerInput" type="color" class="w-0 h-0" ref="colorPicker"
                  v-model="handwriteColor" />
              </div>
            </div>
          </div>

          <input class="outline-none px-2 py-1 rounded text-gray-600" placeholder="拼音或英文..." type="text"
            v-model="exifObj.Artist" />
        </div>
      </div>
    </div>
  </div>
</template>
