import{a as e,c as t,d as n,f as r,h as i,l as a,m as o,n as s,o as c,p as l,s as u,t as d,u as f}from"./cart.view-D6HyfYQP.js";import{c as p,d as m,f as h,l as g,o as _,p as v,s as y,u as b}from"./auth.service-CsBnu_28.js";import{r as x}from"./product.service-CnKV6CeJ.js";var S=`<article class="col">
      <div class="card product-card h-100 shadow-sm">
        <div class="product-card__img-wrapper">
          <img
            src=""
            alt=""
            class="card-img-top product-card__img"
            loading="lazy"
          />
        </div>
        <div class="card-body d-flex flex-column">
          <span class="badge mb-2 align-self-start product-card__category">
            <!-- category -->
          </span>
          <h3 class="card-title fs-6 fw-bold product-card__name"><!-- name --></h3>
          <p class="card-text text-muted small flex-grow-1 product-card__description">
            <!-- description -->
          </p>
          <p class="card-text fw-bold fs-5 text-accent mt-2 product-card__price">
            <!-- price -->
          </p>
          <div class="d-flex gap-2 mt-3">
            <a
              href="#"  
              class="btn btn-outline-brand btn-sm flex-grow-1 product-card__detail-link"
            >
              <i class="fa-solid fa-eye me-1"></i>Ver más
            </a>
            <button
              class="btn btn-brand btn-sm flex-grow-1 btn-add-cart"
              type="button"
              data-id=""
            >
              <i class="fa-solid fa-cart-plus me-1"></i>Agregar
            </button>
          </div>
        </div>
      </div>
    </article>`,C=document.createElement(`template`);C.innerHTML=S;function w(e){return e.category===`Polera`?`badge-polera`:`badge-tazon`}function T(){let e=C.content.firstElementChild?.cloneNode(!0);if(!(e instanceof HTMLElement))throw TypeError(`ProductCard_template.html debe contener un elemento HTML raíz.`);return e}function E(e){let t=T(),i=v(`.product-card__img`,HTMLImageElement,t);i.src=n(e,`card`),i.alt=e.name;let a=h(`.product-card__category`,t);a.classList.add(w(e)),a.textContent=e.category,h(`.product-card__name`,t).textContent=e.name,h(`.product-card__description`,t).textContent=e.description,h(`.product-card__price`,t).textContent=r(e.price);let o=v(`.product-card__detail-link`,HTMLAnchorElement,t);o.href=`product.html?id=${encodeURIComponent(String(e.id))}`;let s=v(`.btn-add-cart`,HTMLButtonElement,t);return s.dataset.id=String(e.id),t}async function D(){return _(`/api/v1/categories`)}function O(e){return typeof e==`string`&&e.trim().length>0}function k(e){if(typeof e!=`object`||!e)return!1;let t=e;return typeof t.id==`number`&&Number.isInteger(t.id)&&t.id>0&&O(t.name)&&O(t.slug)}function A(e){return Array.isArray(e)&&e.every(k)}function j(e){return{id:e.id,name:e.name,slug:e.slug}}async function M(){let e=await D();if(!A(e))throw new y(`invalid-payload`,`The categories response does not have the expected shape.`);return e.map(j)}var N=`#product-list`,P=`category-filter`;function F(t){t.addEventListener(`click`,t=>{let n=b(t.target,`.btn-add-cart`);if(!n)return;g(n,HTMLButtonElement,`.btn-add-cart`);let r=m(n);i(e(o(),r)),s(),u(`¡Producto agregado al carrito!`),c(n,`<i class="fa-solid fa-check me-1"></i>Agregado`,1500)})}async function I(e,n){e.setAttribute(`aria-busy`,`true`),e.replaceChildren(t(`Cargando catálogo...`));try{let t=await x(n!==void 0&&n.length>0?{category:n}:{});e.replaceChildren(...t.map(E)),F(e),d(t)}catch{e.replaceChildren(f(`No se pudo cargar el catálogo. Intenta de nuevo.`)),s(),h(a,e).addEventListener(`click`,()=>{I(e,n)},{once:!0})}finally{e.removeAttribute(`aria-busy`)}}async function L(e){if(document.getElementById(P)!==null)return;let t;try{t=await M()}catch{return}let n=document.createElement(`select`);n.id=P,n.className=`form-select mb-4`,n.setAttribute(`aria-label`,`Filtrar por categoría`);let r=document.createElement(`option`);r.value=``,r.textContent=`Todas las categorías`,n.append(r);for(let e of t){let t=document.createElement(`option`);t.value=e.slug,t.textContent=e.name,n.append(t)}n.addEventListener(`change`,()=>{I(e,n.value)}),e.parentElement?.insertBefore(n,e)}function R(){let e=h(N);I(e),L(e)}function z(){try{l(),R()}catch{p()}}document.addEventListener(`DOMContentLoaded`,z);