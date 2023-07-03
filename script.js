// ==UserScript==
// @name         custom filter shopee
// @namespace    danielsemz
// @version      0.1
// @description  filtra os produtos com suporte à entrega pelos Correios
// @author       danielsemz
// @match        https://shopee.com.br/*
// @match        https://shopee.com.br
// @grant        none
// ==/UserScript==

// Define o CEP padrão para ser utilizado na consulta de rastreio
const CEP = 12345678;

class Rastreio {
  constructor(shopid, itemid) {
    // Verifica se o SHOPID e o itemid são válidos
    if (shopid === undefined || shopid === null) {
      throw "É necessário fornecer o SHOPID para fazer o rastreio";
    }
    if (itemid === undefined || itemid === null) {
      throw "É necessário fornecer o itemid para fazer o rastreio";
    }

    this.shopid = shopid;
    this.itemid = itemid;
  }

  fetch() {
    // Faz uma requisição para a API da Shopee para obter informações de envio
    return fetch(
      `https://shopee.com.br:443/api/v4/pdp/get_shipping?buyer_zipcode=${CEP}&city=&district=&itemid=${this.itemid}&shopid=${this.shopid}`
    );
  }

  static normalizar_dados(response_data) {
    let temp_list = [];
    let transportes = response_data.data.ungrouped_channel_infos;

    // Itera sobre os dados dos transportes retornados pela API e os normaliza
    for (let transporte of transportes) {
      temp_list.push({
        nome: transporte.name,
        valor: transporte.price_before_discount / 100000,
        data_minima: new Date(
          transporte.channel_delivery_info.estimated_delivery_date_from * 1000
        ).toLocaleDateString(),
        data_maxima: new Date(
          transporte.channel_delivery_info.estimated_delivery_date_to * 1000
        ).toLocaleDateString(),
      });
    }
    return temp_list;
  }
}

class Item {
  constructor(DOMelement) {
    // Verifica se o elemento é válido
    if (DOMelement === undefined || DOMelement === null) {
      throw "Elemento inválido";
    }

    this.element = DOMelement;
    this.href = this.element.href;

    let parcial_link = this.href.split("?")[0];
    let splitted_link = parcial_link.split(".");

    // O último índice é o id do item
    this.itemid = splitted_link.pop();

    // O penúltimo índice é o id da loja
    this.shopid = splitted_link.pop();
  }

  remover() {
    // Oculta o elemento pai (se eu removesse a pagina iria ficar com erro e não se comportaria direito)
    if (this.element) {
      this.element.parentElement.style.display = "none";
    }
  }

  alterar_cor(cor = "lightBlue") {
    // Altera a cor do elemento pai (pode se comportar de maneira estranha já que eu não sei onde pode estar o link)
    if (this.element) {
      this.element.parentElement.style.backgroundColor = cor;
    }
  }

  async get_supported_delivery() {
    try {
      let rastreio = new Rastreio(this.shopid, this.itemid);
      let response = await rastreio.fetch();
      let data = await response.json();
      return Rastreio.normalizar_dados(data);
    } catch (exception) {
      this.remover();
    }
  }

  async test_if_supports_correios() {
    let data = await this.get_supported_delivery();
    if (data === undefined || data === null) {
      throw "Não foi possível se comunicar com o servidor";
    }

    let flag = false;
    for (let transporte of data) {
      if (transporte.nome === "Correios") {
        flag = true;
      }
    }
    
    this.element.classList.add("javisto");
    return flag;
  }

  remove_if_not_support_correios() {
    this.test_if_supports_correios().then((result) => {
      if (result) {
        this.alterar_cor("lightblue");
        return;
      }
      this.remover();
    });
  }
}

window.filtrar_itens = function () {
  let regex = /-i\.\d*\.\d*/i;
  // Seleciona todos os links da página
  document.querySelectorAll("a").forEach((link) => {
    // Verifica se o link já foi processado e se corresponde ao padrão de itens da Shopee
    if (!link.classList.contains("javisto") && regex.test(link.href)) {
      let item = new Item(link);
      item.remove_if_not_support_correios();
    }
  });
};

window.intervalo = setInterval(() => {
  if(!document.getElementById("plugindsz")){
      // Cria um botão para filtrar os itens
      let button = document.createElement("button");
      button.id = "plugindsz";
      button.className = "shopee-button-solid shopee-button-solid--primary mpD9DF";
      button.style.backgroundColor = "rgb(163, 0, 255)";
      button.style.position = "fixed";
      button.style.right = "0";
      button.style.bottom = "55%";
      button.style.width = "94px";
      button.style.zIndex = "9999999";
      button.style.height = "40px";
      button.style.borderRadius = "10px 2px 2px 10px";
      button.innerText = "Apenas Correios";
      button.addEventListener("click", window.filtrar_itens);
      document.body.appendChild(button);
  }
  else{
      clearInterval(window.intervalo);
  }
}, 600);
