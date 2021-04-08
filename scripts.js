/*jshint esversion: 6 */
const PIZZA_STORAGE_KEY = "PIZZA_STORAGE";
const submit = document.getElementById("submitForm");
const removeMessage = document.getElementById("remove-pizza-message");
const confirmPizzaRemove = document.getElementById("confirm-remove");
const cancelPizzaRemove = document.getElementById("cancel-remove");
const pizzaMenu = document.getElementById("pizza-menu");
let pizzaNameInput = document.getElementById("pizzaName");
let priceInput = document.getElementById("price");
let heatInput = document.getElementById("heat");
let checkedToppings = document.querySelectorAll(".checkbox-group div input");
let pizzaImageInputs = document.querySelectorAll("#image-checkbox li input");
let pizzaImageInputsSrc = document.querySelectorAll(
  "#image-checkbox li  label img"
);
let sortingRadioInputs = document.querySelectorAll(
  ".sort-radio-group div input"
);

document.getElementById("sort-name").onclick = () => {
  clearPizzaList();
  let pizzaList = getAllStorageValues();
  sortPizzaListByName(pizzaList);
  displaySortedPizzaList(pizzaList);
};

document.getElementById("sort-price").onclick = () => {
  clearPizzaList();
  let pizzaList = getAllStorageValues();
  sortPizzaListByPrice(pizzaList);
  displaySortedPizzaList(pizzaList);
};

document.getElementById("sort-heat").onclick = () => {
  clearPizzaList();
  let pizzaList = getAllStorageValues();
  sortPizzaListByHeat(pizzaList);
  displaySortedPizzaList(pizzaList);
};

loopThroughAllStorageValuesAndDisplayThem();

submit.addEventListener("click", savePizza);

confirmPizzaRemove.addEventListener("click", () => {
  removePizzaFromListAndFromLocalStorage(confirmPizzaRemove.data);
  confirmPizzaRemove.data = "";
  removeMessage.classList.remove("show");
});

cancelPizzaRemove.addEventListener("click", () => {
  confirmPizzaRemove.data = "";
  removeMessage.classList.remove("show");
});

document.addEventListener("keyup", function (event) {
  // check if key on the keyboard is "Enter"
  if (event.keyCode === 13) {
    event.preventDefault();
    savePizza();
  }
});

function savePizza() {
  //   construct pizza object:
  let pizza = {};
  pizza.name = pizzaNameInput.value;
  pizza.price = Number(priceInput.value).toFixed(2);
  pizza.heat = heatInput.value;
  pizza.toppings = getCheckedToppings();
  pizza.image = getPickedPizzaImage();
  getCheckedToppings();
  getPickedPizzaImage();
  //   store results to localStorage:
  if (validForm() === true) {
    let pizzaStorage = localStorage.getItem(PIZZA_STORAGE_KEY)
      ? JSON.parse(localStorage.getItem(PIZZA_STORAGE_KEY))
      : [];
    pizzaStorage.push(pizza);
    localStorage.setItem(PIZZA_STORAGE_KEY, JSON.stringify(pizzaStorage));
    pizzaMenu.style.display = "block";
    loopThroughAllStorageValuesAndDisplayThem();
    clearInputFields();
    clearValidationMessages();
  } else {
    showValidationMessages();
  }
}

// check if all fields are filled
function validForm() {
  if (
    pizzaNameInput.value &&
    checkDuplicatePizzaNames() === false &&
    priceInput.value > 0 &&
    ((heatInput.value > 0 && heatInput.value <= 3) || !heatInput.value) &&
    getCheckedToppings().length !== 0 &&
    getCheckedToppings().length >= 2
  ) {
    return true;
  }
  return false;
}

// // check inputs validity:
function showValidationMessages() {
  let toppingsValidationMessage = "Value must be greater than or equal to 2";
  checkDuplicatePizzaNames();
  if (!pizzaNameInput.checkValidity()) {
    document.getElementById("pizza-name-validity-msg").innerHTML =
      pizzaNameInput.validationMessage;
      document.getElementById("pizzaName").style.border = "1px solid red";
  } else if (!priceInput.checkValidity()) {
    document.getElementById("price-validity-msg").innerHTML =
      priceInput.validationMessage;
      document.getElementById("price").style.border = "1px solid red";
  } else if (getCheckedToppings().length < 2) {
    document.getElementById(
      "toppings-validity-msg"
    ).innerHTML = toppingsValidationMessage;
    document.getElementById("toppings-list").style.border = "1px solid red";
  } else if (!heatInput.checkValidity()) {
    document.getElementById("heat-validity-msg").innerHTML =
      heatInput.validationMessage;
      document.getElementById("heat").style.border = "1px solid red";
  }
}

// check if pizza name already exists in localStorage
function checkDuplicatePizzaNames() {
  let duplicateErrorMessage =
    " name already exists. Please choose other pizza name.";
  let duplicated = false;
  let allNames = getpizzaNamesInLocalStorage();
  if (allNames.includes(pizzaNameInput.value)) {
    document.getElementById("pizza-name-validity-msg").innerHTML =
      pizzaNameInput.value + duplicateErrorMessage;
    duplicated = true;
  }
  return duplicated;
}

function clearValidationMessages() {
  document.getElementById("pizza-name-validity-msg").innerHTML = "";
  document.getElementById("pizzaName").style.border = "none";
  document.getElementById("price-validity-msg").innerHTML = "";
  document.getElementById("price").style.border = "none";
  document.getElementById("toppings-validity-msg").innerHTML = "";
  document.getElementById("toppings-list").style.border = "none";
  document.getElementById("heat-validity-msg").innerHTML = "";
  document.getElementById("heat").style.border = "none";
}

// get checked toppings values and push them into picked toppings array
function getCheckedToppings() {
  let toppingsArray = [];
  for (var i = 0; i < checkedToppings.length; i++) {
    // Check if the element is a checkbox.
    if (checkedToppings[i].type == "checkbox") {
      // check if the checkbox is checked.
      if (checkedToppings[i].checked) {
        toppingsArray.push(checkedToppings[i].value);
      }
    }
  }
  return toppingsArray;
}

// get checked pizza image and set img src
function getPickedPizzaImage() {
  let checkedImage;
  for (var i = 0; i < pizzaImageInputs.length; i++) {
    // Check if the element is a radio.
    if (pizzaImageInputs[i].type == "radio") {
      // check if the radio is checked.
      if (pizzaImageInputs[i].checked) {
        checkedImage = pizzaImageInputsSrc[i].src;
      }
    }
  }
  return checkedImage;
}

// get all values from local storage
function getAllStorageValues() {
  let pizzaStorage = localStorage.getItem(PIZZA_STORAGE_KEY);
  return pizzaStorage ? JSON.parse(pizzaStorage) : [];
}

// get all pizza names in localStorage
function getpizzaNamesInLocalStorage() {
  let storageItems = getAllStorageValues();
  let names = [];
  storageItems.forEach((item) => {
    names.push(item.name);
  });
  return names;
}

// clear form
function clearInputFields() {
  pizzaNameInput.value = "";
  priceInput.value = "";
  heatInput.value = "";
  for (var i = 0; i < checkedToppings.length; i++) {
    if (checkedToppings[i].type == "checkbox") {
      // check if the checkbox is checked.
      //   if it is - set checked to false
      if (checkedToppings[i].checked) {
        checkedToppings[i].checked = false;
      }
    }
  }
  for (var j = 0; j < pizzaImageInputs.length; j++) {
    if (pizzaImageInputs[j].type == "radio") {
      // check if the radio is checked.
      //   if it is - set checked to false
      if (pizzaImageInputs[j].checked) {
        pizzaImageInputs[j].checked = false;
      }
    }
  }
}

function addPizzaInstance(pizzaObj) {
  let parent = document.querySelector("#pizza_list_parent");
  let template = document.querySelector("#new_pizza");
  // clone the new li and insert it into the parent ul
  let clone = template.content.cloneNode(true);
  // take data from local storage and push it into template instance
  let createdPizzaName = clone.querySelector(".pizza-name");
  createdPizzaName.textContent = pizzaObj.name;
  let numberOfCreatedChillis = 0;
  while (numberOfCreatedChillis < pizzaObj.heat) {
    let chilliImage = document.createElement("img");
    chilliImage.src = "./assets/img/chilli.png";
    chilliImage.classList.add("chilli-pepper-image");
    chilliImage.alt = `${pizzaObj.heat} chilli`;
    let chilliParent = clone.querySelector(".pizza-title-block");
    chilliParent.appendChild(chilliImage);
    numberOfCreatedChillis++;
  }
  let createdPizzaPrice = clone.querySelector(".pizza-price");
  createdPizzaPrice.textContent = "Price: " + pizzaObj.price;
  let createdPizzaToppings = clone.querySelector(".pizza-toppings-list");
  createdPizzaToppings.textContent = pizzaObj.toppings.join(", ");
  if (pizzaObj.image) {
    let createdPizzaPhoto = clone.querySelector(".chosen-pizza-photo");
    createdPizzaPhoto.src = pizzaObj.image;
    createdPizzaPhoto.alt = pizzaObj.name;
    createdPizzaPhoto.classList.add("addStyling");
  }
  let removePizzaButton = clone.querySelector(".remove-button");
  removePizzaButton.id = pizzaObj.name;
  // let allPizzas = getAllStorageValues();
  const remove = clone.querySelector(".remove-button");
  remove.addEventListener("click", () => {
    removeMessage.classList.add("show");
    confirmPizzaRemove.data = pizzaObj.name;
  });
  parent.appendChild(clone);
}

function getCheckedSorting() {
  let checkedSorting;
  for (var i = 0; i < sortingRadioInputs.length; i++) {
    // Check if the element is a radio.
    if (sortingRadioInputs[i].type == "radio") {
      // check if the radio is checked.
      if (sortingRadioInputs[i].checked) {
        checkedSorting = sortingRadioInputs[i].value;
      }
    }
  }
  return checkedSorting;
}

function loopThroughAllStorageValuesAndDisplayThem() {
  let allValues = getAllStorageValues();
  // sort pizza (default option: by name)
  if (allValues.length === 0) {
    pizzaMenu.style.display = "none";
    document.getElementById("create-pizza-form").style.margin = "3% 0 3% 0";
  } else {
    allValues = sortPizzaList(allValues);
    displaySortedPizzaList(allValues);
  }
}

function clearPizzaList() {
  let listParent = document.getElementById("pizza_list_parent");
  listParent.innerHTML = "";
}

function displaySortedPizzaList(pizzaList) {
  pizzaList.forEach((pizza) => {
    addPizzaInstance(pizza);
  });
}

function sortPizzaList(sortedPizzas) {
  if (getCheckedSorting() === "Name") {
    clearPizzaList();
    sortPizzaListByName(sortedPizzas);
  } else if (getCheckedSorting() === "Price") {
    clearPizzaList();
    sortPizzaListByPrice(sortedPizzas);
  } else if (getCheckedSorting() === "Heat") {
    clearPizzaList();
    sortPizzaListByHeat(sortedPizzas);
  }
  return sortedPizzas;
}

function sortPizzaListByName(allPizzas) {
  allPizzas.sort((p1, p2) => {
    let name1 = p1.name.toUpperCase(); // ignore upper and lowercase
    let name2 = p2.name.toUpperCase(); // ignore upper and lowercase
    if (name1 < name2) {
      return -1;
    }
    if (name1 > name2) {
      return 1;
    }
    return 0;
  });
}

function sortPizzaListByPrice(allPizzas) {
  allPizzas.sort((p1, p2) => {
    let price1 = Number(p1.price);
    let price2 = Number(p2.price);
    if (price1 < price2) {
      return -1;
    }
    if (price1 > price2) {
      return 1;
    }
    return 0;
  });
}

function sortPizzaListByHeat(allPizzas) {
  allPizzas.sort((p1, p2) => {
    let heat1 = Number(p1.heat);
    let heat2 = Number(p2.heat);
    console.log(typeof heat1, typeof heat2);
    if (heat1 < heat2) {
      return -1;
    }
    if (heat1 > heat2) {
      return 1;
    }
    return 0;
  });
}

function removePizzaFromListAndFromLocalStorage(pizzaNameToRemove) {
  clearPizzaList();
  let items = getAllStorageValues().filter(pizza => pizza.name !== pizzaNameToRemove);

  localStorage.setItem(PIZZA_STORAGE_KEY, JSON.stringify(items));
  loopThroughAllStorageValuesAndDisplayThem();
}
