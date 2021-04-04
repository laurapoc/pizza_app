const PIZZA_STORAGE_KEY = "PIZZA_STORAGE";
const submit = document.getElementById("submitForm");
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
  pizza.image = checkPickedPizzaImage();
  // console.log(validForm());

  getCheckedToppings();
  checkPickedPizzaImage();
  //   store results to localStorage:
  if (validForm() === true) {
    let pizzaStorage = localStorage.getItem(PIZZA_STORAGE_KEY)
      ? JSON.parse(localStorage.getItem(PIZZA_STORAGE_KEY))
      : [];
    pizzaStorage.push(pizza);
    localStorage.setItem(PIZZA_STORAGE_KEY, JSON.stringify(pizzaStorage));

    addPizzaInstance(pizza);
    sortPizzaList();
    clearInputFields();
    clearValidationMessages();
  } else {
    // alert("please check if all the fields ar valid");
    showValidationMessages();
  }
}

// check if all fields are filled
function validForm() {
  if (
    pizzaNameInput.value &&
    checkDuplicateNames() === false &&
    priceInput.value > 0 &&
    heatInput.value <= 3 &&
    getCheckedToppings().length !== 0 &&
    getCheckedToppings().length >= 2
  ) {
    return true;
  }
  return false;
}

let toppingsValidationMessage = "Value must be greater than or equal to 2";
// // check inputs validity:
function showValidationMessages() {
  checkDuplicateNames();
  if (!pizzaNameInput.checkValidity()) {
    document.getElementById("pizza-name-validity-msg").innerHTML =
      pizzaNameInput.validationMessage;
  } else if (!priceInput.checkValidity()) {
    document.getElementById("price-validity-msg").innerHTML =
      priceInput.validationMessage;
  } else if (getCheckedToppings().length < 2) {
    document.getElementById(
      "toppings-validity-msg"
    ).innerHTML = toppingsValidationMessage;
  }
}
// check if pizza name already exists in localStorage
function checkDuplicateNames() {
  let duplicateErrorMessage =
    " name already exists. Please choose other pizza name.";
  let duplicated = false;
  let allNames = getpizzaNamesInLocalStorage();

  if (allNames.includes(pizzaNameInput.value)) {
    document.getElementById("pizza-name-validity-msg").innerHTML =
      pizzaNameInput.value + duplicateErrorMessage;
    duplicated = true;
  }
  // console.log(duplicated);
  return duplicated;
}

function clearValidationMessages() {
  document.getElementById("pizza-name-validity-msg").innerHTML = "";
  document.getElementById("price-validity-msg").innerHTML = "";
  document.getElementById("toppings-validity-msg").innerHTML = "";
}

// create checked toppings list:
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

// find checked pizza image:
function checkPickedPizzaImage() {
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
  // console.log(names);
  return names;
}

// clear form
function clearInputFields() {
  pizzaNameInput.value = "";
  priceInput.value = "";
  heatInput.value = "";
  for (var i = 0; i < checkedToppings.length; i++) {
    // Check if the element is a checkbox.
    if (checkedToppings[i].type == "checkbox") {
      // check if the checkbox is checked.
      //   if it is - set checked to false
      if (checkedToppings[i].checked) {
        checkedToppings[i].checked = false;
      }
    }
  }
  for (var i = 0; i < pizzaImageInputs.length; i++) {
    // Check if the element is a radio.
    if (pizzaImageInputs[i].type == "radio") {
      // check if the radio is checked.
      //   if it is - set checked to false
      if (pizzaImageInputs[i].checked) {
        pizzaImageInputs[i].checked = false;
      }
    }
  }
}

function addPizzaInstance(pizzaObj) {
  let parent = document.querySelector("#pizza_list_parent");
  let template = document.querySelector("#new_pizza");
  // clone the new li and insert it into the parent ul
  let clone = template.content.cloneNode(true);
  let createdPizzaName = clone.querySelector(".pizza-name");
  // take data from local storage and push it into template instance
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
  createdPizzaPrice.textContent = pizzaObj.price;
  let createdPizzaToppings = clone.querySelector(".pizza-toppings-list");
  createdPizzaToppings.textContent = pizzaObj.toppings.join(", ");
  if (pizzaObj.image) {
    let createdPizzaPhoto = clone.querySelector(".chosen-pizza-photo");
    createdPizzaPhoto.src = pizzaObj.image;
    createdPizzaPhoto.alt = pizzaObj.name;
  }

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
  sortPizzaList();
  displaySortedPizzaList(allValues);
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

function sortPizzaList() {
  let allPizzas = getAllStorageValues();
  if (getCheckedSorting() === "Name") {
    clearPizzaList();
    sortPizzaListByName(allPizzas);
    displaySortedPizzaList(allPizzas);
  } else if (getCheckedSorting() === "Price") {
    clearPizzaList();
    sortPizzaListByPrice(allPizzas);
    displaySortedPizzaList(allPizzas);
  } else if (getCheckedSorting() === "Heat") {
    clearPizzaList();
    sortPizzaListByHeat(allPizzas);
    displaySortedPizzaList(allPizzas);
  }
}
