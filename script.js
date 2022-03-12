const APIKEY = "30cb1da452da0d15b4384bffb2d4f1fe";

const url = (city) =>
  `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}`;

async function getWeatherByCity(city) {
  const resp = await fetch(url(city), {
    method: "GET",
    redirect: "follow",
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.cod != 200) {
        errorHandler("City not found!");
      } else {
        return response;
      }
    })
    .catch((error) => console.log(error));

  //addWeatherToPage(resp);
  addDaysToPage(resp.list);
}

const addDaysToPage = (data) => {
  const div = document.getElementById("days");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  var previous = new Date(0).setHours(0, 0, 0, 0);
  for (i = 0; i < data.length; i++) {
    var current = new Date(data[i].dt * 1000).setHours(0, 0, 0, 0);

    if (current != previous) {
      let btn = document.createElement("button");
      btn.type = "button";
      btn.innerText = btn.value = (function () {
        var a = new Date(data[i].dt * 1000);
        var month = a.getMonth() + 1;
        var date = a.getDate();
        return date + "/" + month;
      })();
      btn.value = data[i].dt;

      btn.onclick = () => addWeatherToPage(data, btn.value);
      div.append(btn);
    }
    previous = current;
  }
};

const addWeatherToPage = (data, time) => {
  if (data == undefined) {
    return;
  }
  console.log("addWeatherToPage");
  console.log(data);
  console.log(time);

  var table = document.createElement("table");
  const div = document.getElementById("result");
  if (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  div.appendChild(table);

  // helper function
  function addCell(tr, text) {
    var td = tr.insertCell();
    td.textContent = text;
    return td;
  }

  var th = table.createTHead();
  var headerRow = th.insertRow();
  addCell(headerRow, "Date");
  addCell(headerRow, "Temperature");
  addCell(headerRow, "Weather");

  var current = new Date(time * 1000).setHours(0, 0, 0, 0);
  for (i = 0; i < data.length; i++) {
    var previous = new Date(data[i].dt * 1000).setHours(0, 0, 0, 0);

    if (current === previous) {
      var row = table.insertRow();
      addCell(row, unixToDate(data[i].dt));
      addCell(row, KelvinToCelsius(data[i].main.feels_like) + "°C");
      addCell(
        row
      ).innerHTML = `<h2><img src="https://openweathermap.org/img/wn/${data[i].weather[0].icon}.png" /></h2>`;
    }
  }
};

const unixToDate = (unix) => {
  var a = new Date(unix * 1000);
  var hour = a.getHours();
  var time = hour + ":00";
  return time;
};

const KelvinToCelsius = (Kelvin) => {
  return Math.floor(Kelvin - 273.15);
};

form.addEventListener("submit", (e) => {
  //TODO: if value hasn't changed it shouldn't call the api
  e.preventDefault();
  if (search.value == "") {
    errorHandler("Enter a valid city");
  } else {
    error.innerHTML = "";
    const city = search.value;

    getWeatherByCity(city);
  }
});

const errorHandler = (message) => {
  document.getElementById("result").innerHTML = "";
  const error = document.getElementById("error");
  error.innerHTML = "";
  error.innerHTML = message;
};
