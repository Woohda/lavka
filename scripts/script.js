/* КОНФИГ */
const BASE_URL = "/products.json";

/* ТЕМПЛЕЙТЫ */
const itemTmp = document.querySelector(".lavka__list-item-template");

/* ЭЛЕМЕНТЫ СТРАНИЦЫ */
const productsContainer = document.querySelector(".lavka__list");
const basket = document.querySelector(".basket__for-products");
const basketPicture = document.querySelector(".basket__for-products-picture");
const paymentButton = document.getElementById("payment");

/* МЕХАНИКА */
/*ФУНЦИОНАЛ ЗАПРОСА И ОТРИСОВКИ ПРОДУКТОВ*/

// Функция запроса данных данных из JSON ✅
async function mainMechanics(entrypoint) {
  try {
    const data = await (await fetch(entrypoint)).json();
    appendCards({
      dataArray: data,
      itemTmp,
      container: productsContainer,
    });
    setupDragAndDrop(); // Вызываю функцию Drag and Drop после отрисовки контента
  } catch (error) {
    console.log(error);
  }
}

// Функция добавления карточки в контейнер, собирая их из данных JSON ✅
function appendCards({ dataArray, itemTmp, container }) {
  dataArray.forEach((el) => {
    const node = itemTmp.content.cloneNode(true);
    node.querySelector(".lavka__list-item-picture").src = el.src;
    node.querySelector(".lavka__list-item-picture").alt = el.alt;
    node.querySelector(".lavka__list-item-picture").id = el.alt;
    container.append(node);
  });
}

// Функция добавления класса кнопке Payment
function updateClassButton(count) {
  if (count === 3) {
    paymentButton.classList.toggle("hidden")
    paymentButton.classList.toggle("show");
  }
}

/* ФУНКЦИОНАЛ Drag and Drop */
let itemCount = 0; // Количество продуктов в корзине

function setupDragAndDrop() {
  const productItems = document.querySelectorAll(".lavka__list-item-picture");
  productItems.forEach((item) => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        // Проверка на мобильное устройство
        navigator.userAgent
      )
    ) {
      isTouchDevice(item);
    } else {
      isNotTouchDevice(item);
    }
  });

  basketPicture.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  basketPicture.addEventListener("drop", (event) => {
    event.preventDefault();
    const itemId = event.dataTransfer.getData("text");
    const draggedItem = document.getElementById(itemId);
    if (draggedItem && itemCount < 3) {
      basket.appendChild(draggedItem);
      itemCount++;
      updateClassButton(itemCount);
    }
  });
}

// Функция поддержки touch-событий на мобильных устройствах для Drag and Drop
function isTouchDevice(item) {
  item.addEventListener("touchstart", (event) => {
    const touch = event.touches[0];
    item.dataset.startX = touch.clientX;
    item.dataset.startY = touch.clientY;

    item.dataset.originalWidth = item.offsetWidth;
    item.dataset.originalHeight = item.offsetHeight;

    item.style.width = `${item.offsetWidth}px`;
    item.style.height = `${item.offsetHeight}px`;
  });
  item.addEventListener("touchmove", (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    item.style.position = "absolute";
    item.style.left = `${touch.clientX - item.offsetWidth / 2}px`;
    item.style.top = `${touch.clientY - item.offsetHeight / 2}px`;
  });

  item.addEventListener("touchend", (event) => {
    const touch = event.changedTouches[0];
    const basketRect = basketPicture.getBoundingClientRect();
    if (
      touch.clientX >= basketRect.left &&
      touch.clientX <= basketRect.right &&
      touch.clientY >= basketRect.top &&
      touch.clientY <= basketRect.bottom
    ) {
      if (itemCount < 3) {
        basket.appendChild(item);
        item.style.position = "static";
        item.style.width = "";
        item.style.height = "";
        itemCount++;
        updateClassButton(itemCount);
      }
    } else {
      item.style.position = "static";
      item.style.width = "";
      item.style.height = "";
    }
  });
}

// Функция поддержки touch-событий на десктопных устройствах для Drag and Drop
function isNotTouchDevice(item) {
  item.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text", event.target.id);
  });
}

paymentButton.addEventListener("click", () => {
  window.location.href = "https://lavka.yandex.ru";
});

/* ЗАПУСКАЮ ОСНОВНУЮ МЕХАНИКУ */

mainMechanics(BASE_URL);
