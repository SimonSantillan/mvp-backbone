/* Los datos que contendra mi modelo por defecto seran marca y modelo */
var ModeloAutos = Backbone.Model.extend({
  defaults: {
    marca: "",
    modelo: "",
    anio: 0,
    color: "",
    foto:""
  },
});
/* Creo una coleccion de modelos Autos */
var ColeccionAutos = Backbone.Collection.extend({
  model: ModeloAutos,
});


var SeleccionAutos = Backbone.View.extend({
  el: "body",

  template: _.template(`
    <header class="header">
      <div>
        <div>
          <h2>Seleccionar marca</h2>
          <select id="marca-selector">
          <option value="seleccionar"><--Seleccionar--></option>
            <% marcas.forEach(function(marca) { %>
              <option value="<%= marca %>"><%= marca %></option>
            <% }); %>
          </select>
        </div>
        <div>
          <h2>Seleccionar modelo</h2>
          <select id="modelo-selector"></select>
        </div>
      </div>

    </header>
    <main class="main">
      <div id="car-image-container">
        <img id="car-image" class="car-image" src="" alt="Car Image">
        <div>
          <h1 id="car-marca">Marca:</h1>
          <p id="car-modelo">Modelo:</p>
          <p id="car-anio">Año: </p>
          <p id="car-color">Color: </p>
        </div>
      </div>
    </main>
  `),

  initialize: function () {
    this.listenTo(this.collection, "change", this.render);
  },

  events: {
    "change #marca-selector": "onMarcaChange",
    "change #modelo-selector": "onModeloChange",
  },

  render: function () {
    var marcas = this.collection.pluck("marca");
    this.$el.html(this.template({ marcas: _.uniq(marcas) }));
    return this;
  },

  onMarcaChange: function (event) {
    var marcaSeleccionada = event.target.value;
    var modelos = this.collection
      .filter(function (car) {
        return car.get("marca") === marcaSeleccionada;
      })
      .map(function (car) {
        return {
          cid: car.cid,
          modelo: car.get("modelo"),
        };
      });
    this.renderModelos(modelos);
  },
  onModeloChange: function (event) {
    var modeloSeleccionado = event.target.value;
    var autoDetalle = this.collection.filter(function (car) {
      return car.cid === modeloSeleccionado;
    });
    var detalles = autoDetalle[0].attributes;

    this.renderAutos(detalles);
  },

  renderModelos: function (modelos) {
    var modeloSelector = this.$("#modelo-selector");
    modeloSelector.empty();

    modeloSelector.append(
      $("<option>").text("<--Seleccionar-->").val("seleccionar")
    );

    modelos.forEach(function (modelo) {
      var option = $("<option>").text(modelo.modelo).val(modelo.cid);
      modeloSelector.append(option);
    });
  },
  renderAutos: function (autos) {
    var autoImg = this.$("#car-image");
    autoImg.attr("src", autos.foto);

    var autoNombre = this.$("#car-marca");
    autoNombre.text("Marca: ");
    autoNombre.append(autos.marca);

    var autoModelo = this.$("#car-modelo");
    autoModelo.text("Modelo: ");
    autoModelo.append(autos.modelo);

    var autoAnio = this.$("#car-anio");
    autoAnio.text("Año: ");
    autoAnio.append(autos.anio);

    var autoColor = this.$("#car-color");
    autoColor.text("Color: ");
    autoColor.append(autos.color);
  },
});


var carsData1;
$.getJSON("../data/concesionarias.json")
  .done(function (carsData) {
    var autos = [];
    carsData1 = carsData;

    
    for (let i = 0; i < carsData1.length; i++) {
      for (let j = 0; j < carsData1[i].autos.length; j++) {
        autos.push(carsData1[i].autos[j]);
      }
    }
    


    var carsCollection = new ColeccionAutos(autos);
    
    var Autos = new SeleccionAutos({
      collection: carsCollection,
    });
    Autos.render();

  })
  .fail(function (error) {
    console.error("Error loading JSON:", error);
  });


