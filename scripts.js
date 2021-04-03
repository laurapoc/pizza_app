const submit = document.getElementById("submitForm");
let pizzaNameInput = document.getElementById("pizzaName");
let priceInput = document.getElementById("price");
let heatInput = document.getElementById("heat");
let checkedToppings = document.querySelectorAll(".checkbox-group div input");
let pizzaImageInputs = document.querySelectorAll("#image-checkbox li input");
let pizzaImageInputsSrc = document.querySelectorAll(
  "#image-checkbox li  label img"
);

submit.addEventListener("click", savePizza);
// window.addEventListener()
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
  let result;
  if (validForm() === true) {
    result = localStorage.setItem(pizzaNameInput.value, JSON.stringify(pizza));
    clearInputFields();
    clearValidationMessages();
  } else {
    // alert("please check if all the fields ar valid");
    showValidationMessages();
  }

  getpizzaNamesInLocalStorage();
  return result;
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

let toppingsValidationMessage = "Value must be greater than or equal to 2"
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
    document.getElementById("toppings-validity-msg").innerHTML =
    toppingsValidationMessage;
  }
  
}
// check if pizza name already exists in localStorage
function checkDuplicateNames() {
  let duplicateErrorMessage =
    " name already exists. Please choose other pizza name.";
  let duplicated = false;
  let allNames = getpizzaNamesInLocalStorage();

  if(allNames.includes( pizzaNameInput.value )) {
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
  var values = [],
    keys = Object.keys(localStorage),
    i = keys.length;

  while (i--) {
    values.push(localStorage.getItem(keys[i]));
  }
  //   console.log(values);
  return values;
}

// get all pizza names in localStorage
function getpizzaNamesInLocalStorage() {
  let storageItems = getAllStorageValues();
  let names = [];
  storageItems.forEach((item) => {
    let pizza = JSON.parse(item);
    names.push(pizza.name);
  });
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
