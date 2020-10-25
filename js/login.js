(function () {
  /*-----------------------------------*/
  /* variables */
  /*-----------------------------------*/
  var formulario = document.getElementById("formulario");
  var txt_nombre = document.getElementById("nombre");
  var txt_pass = document.getElementById("pass");
  var alerta = document.getElementById("alerta");
  var icono_alerta = document.getElementById("icono-alerta");
  var texto_alerta = document.getElementById("texto-alerta");
  var lleno = false;
  /*-----------------------------------*/
  /* Configuracion basica de firebase */
  /*-----------------------------------*/
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAWTOHItY5LkyMom0yZFlNH-Pkds0YQcKo",
    authDomain: "rapillamadas-882e8.firebaseapp.com",
    databaseURL: "https://rapillamadas-882e8.firebaseio.com/",
    projectId: "rapillamadas-882e8",
    storageBucket: "rapillamadas-882e8.appspot.com",
    messagingSenderId: "373224831583",
    appId: "1:373224831583:web:e7d0bd0a9665cdbdcfb9ea"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  /*-----------------------------------*/
  /* Eventos */
  /*-----------------------------------*/
  formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    if (ValidarCampos() && lleno == false) {
      var nombre_completo = txt_nombre.value;
      var pass = txt_pass.value;
      var pass_encript = btoa(pass);
      // console.log(pass_encript);
      CompararContraseñas(pass_encript);
    }
  });
  /*-----------------------------------*/
  /* Funciones */
  /*-----------------------------------*/
  function Alerta(color, icono, texto, tiempo) {
    icono_alerta.setAttribute("class", icono);
    texto_alerta.innerHTML = texto;
    alerta.classList.add(color);
    setTimeout(function () {
      alerta.classList.remove(color);
    }, tiempo);
  }
  function ValidarCampos() {
    var inputs = formulario.getElementsByTagName("input");
    restablecer(inputs);
    for (var input of inputs) {
      if (input.value == 0) {
        input.classList.add("vacio");
        var texto = Generartexto(input);
        Alerta("red", "fas fa-times", texto,  3000);
        return false;
      }
    }
    return true;
  }
  function Generartexto(input) {
    var placeholder = input.placeholder;
    var arrayPlaceholder = placeholder.split(" ");
    var texto = "Debe rellenar el campo: ";
    for (var i = 1; i < arrayPlaceholder.length; i++) {
      var elemento = arrayPlaceholder[i];
      texto += elemento.toUpperCase() + " ";
    }
    return texto;
  }
  function restablecer(controles) {
    var clases = ["vacio", "error"];
    for (var control of controles) {
      for (var clase of clases) {
        if (control.classList.contains(clase)) {
          control.classList.remove(clase);
        }
      }
    }
  }
  function CompararContraseñas(pass) {
    var dbRef = firebase.database();
    var passRef = dbRef.ref("pass");
    passRef.once("value")
    .then((snap) => {
      var valPass = snap.val();
      if (valPass == pass) {
        Redireccionar();
      } else {
        Incorrecto();
      }
    });
  }
  function Redireccionar() {
    var dbRef = firebase.database();
    var pepoleRef = dbRef.ref("pepole");
    pepoleRef.once("value")
    .then((snap) => {
      var valPepole = snap.val();
      valPepole ++;
      pepoleRef.set(valPepole);
    });
    var nombre = txt_nombre.value;
    sessionStorage.setItem('login', true);
    sessionStorage.setItem('nombre', nombre);
    setTimeout(function () {
      window.location.href = "home.html";
    }, 3000);
  }
  function Incorrecto() {
    txt_pass.classList.add("error");
    Alerta("red", "fas fa-times", "Contraseña Incorrecta",  3000)
  }
  function main() {
    var dbRef = firebase.database();
    var pepoleRef = dbRef.ref("pepole");
    pepoleRef.once("value")
    .then((snap) => {
      var valPepole = snap.val();
      if (valPepole >= 2) {
        lleno = true;
        icono_alerta.setAttribute("class", "fas fa-times");
        texto_alerta.innerHTML = "La reunion ya esta llena";
        alerta.classList.add("red");
      }
    });
  }
  main();
}())
