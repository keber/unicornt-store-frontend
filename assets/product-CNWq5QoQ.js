import{a as e,c as t,d as n,f as r,h as i,i as a,l as o,m as s,n as c,o as l,p as u,r as d,s as f,t as p,u as m}from"./cart.view-WEO3wPre.js";import{c as h,f as g,p as _}from"./auth.service-CgvcWWGK.js";import{r as v}from"./product.service-Caol1wfS.js";var y=`<div class="col-12 col-md-6">
      <div class="detail-img-wrapper rounded-4 overflow-hidden shadow">
        <img
          src=""
          alt=""
          class="img-fluid w-100 product-detail__img"
        />
      </div>
    </div>

    <div class="col-12 col-md-6">
      <span class="badge product-detail__category mb-2"></span>
      <h1 class="fw-bold fs-3 mb-1 product-detail__name"></h1>
      <p class="fs-2 fw-bold text-accent mb-3 product-detail__price"></p>
      <p class="text-muted mb-4 product-detail__description"></p>

      <div class="d-flex align-items-center gap-3 mb-4">
        <label class="fw-semibold" for="qty-input">Cantidad:</label>
        <div class="input-group qty-selector">
          <button
            class="btn btn-outline-secondary"
            type="button"
            id="qty-minus"
            aria-label="Reducir cantidad"
          >−</button>
          <input
            type="number"
            id="qty-input"
            class="form-control text-center product-detail__quantity"
            value="1"
            min=""
            max=""
            aria-label="Cantidad"
            style="max-width: 60px;"
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            id="qty-plus"
            aria-label="Aumentar cantidad"
          >+</button>
        </div>
      </div>

      <div class="d-flex flex-wrap gap-3">
        <button class="btn btn-brand btn-lg flex-grow-1" type="button" id="btn-add-detail">
          <i class="fa-solid fa-cart-plus me-2"></i>Agregar al carrito
        </button>
        <a href="index.html" class="btn btn-outline-brand btn-lg">
          <i class="fa-solid fa-arrow-left me-1"></i>Volver
        </a>
      </div>
    </div>`,b=document.createElement(`template`);b.innerHTML=y;function x(e){return e.category===`Polera`?`badge-polera`:`badge-tazon`}function S(){let e=b.content.cloneNode(!0);if(!(e instanceof DocumentFragment))throw TypeError(`ProductDetail_template.html debe contener un fragmento HTML.`);return e}function C(e){let t=S(),i=_(`.product-detail__img`,HTMLImageElement,t);i.src=n(e,`detail`),i.alt=e.name;let a=g(`.product-detail__category`,t);a.classList.add(x(e)),a.textContent=e.category,g(`.product-detail__name`,t).textContent=e.name,g(`.product-detail__price`,t).textContent=r(e.price),g(`.product-detail__description`,t).textContent=e.description;let o=_(`#qty-input`,HTMLInputElement,t);return o.min=`1`,o.max=`99`,o.value=`1`,t}var w=`#product-content`,T=`#breadcrumb-name`;function E(){let e=new URLSearchParams(window.location.search).get(`id`);if(e===null)return null;let t=Number.parseInt(e,10);return Number.isInteger(t)?t:null}function D(e){let t=_(`#qty-input`,HTMLInputElement,e),n=_(`#qty-minus`,HTMLButtonElement,e),r=_(`#qty-plus`,HTMLButtonElement,e);return n.addEventListener(`click`,()=>{t.value=String(d(a(t.value)-1))}),r.addEventListener(`click`,()=>{t.value=String(d(a(t.value)+1))}),t}function O(t,n,r){let o=_(`#btn-add-detail`,HTMLButtonElement,t);o.addEventListener(`click`,()=>{let t=a(r.value);i(e(s(),n.id,t)),c(),f(`¡${n.name} agregado al carrito!`),l(o,`<i class="fa-solid fa-check me-2"></i>¡Agregado!`,1800)})}async function k(e){e.setAttribute(`aria-busy`,`true`),e.replaceChildren(t(`Cargando producto...`));try{let t;try{t=await v()}catch{e.replaceChildren(m(`No se pudo cargar el producto. Intenta de nuevo.`)),c(),g(o,e).addEventListener(`click`,()=>{k(e)},{once:!0});return}let n=E(),r=n===null?void 0:t.find(e=>e.id===n);if(!r){window.location.href=`index.html`;return}g(T).textContent=r.name,document.title=`${r.name} - Unicorn't Store`,e.appendChild(C(r)),O(e,r,D(e)),p(t)}finally{e.removeAttribute(`aria-busy`)}}function A(){k(g(w))}function j(){try{u(),A()}catch{h()}}document.addEventListener(`DOMContentLoaded`,j);