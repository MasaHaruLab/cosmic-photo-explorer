(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&n(d)}).observe(document,{childList:!0,subtree:!0});function a(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(o){if(o.ep)return;o.ep=!0;const i=a(o);fetch(o.href,i)}})();const Ee="data/anchors/phase1.json",Me="data/probes.json",p="CDS/P/DM/flux-color-Rp-G-Bp/I/355/gaiadr3",D="P/DSS2/color",v={ra:266.4168,dec:-29.0078,fov:150},De=2400,Fe={"galactic-center":"galactic center milky way","antares-region":"rho ophiuchi","summer-triangle":"cygnus milky way","cygnus-rift":"cygnus dark nebula",andromeda:"andromeda galaxy",pleiades:"pleiades","orion-nebula":"orion nebula","carina-nebula":"carina nebula",lmc:"large magellanic cloud",smc:"small magellanic cloud","winter-triangle":"winter milky way",sirius:"sirius star",horsehead:"horsehead nebula",rosette:"rosette nebula",hyades:"hyades",m35:"Messier 35","crux-coalsack":"coalsack nebula","omega-centauri":"omega centauri","47-tucanae":"47 tucanae",tarantula:"tarantula nebula","alpha-centauri":"alpha centauri","vela-snr":"vela supernova remnant","voyager-1":"voyager spacecraft","voyager-2":"voyager 2","pioneer-10":"pioneer 10","pioneer-11":"pioneer 11 saturn","new-horizons":"new horizons pluto"},Ie={"voyager-1":{summary:"人类飞得最远的造物。1977 年出发，现在在 255 亿公里外，仍在用微弱的信号回话。",details:"1990 年它回头拍了那张《暗淡蓝点》——地球只是一粒悬浮在阳光里的尘埃。2012 年它穿出日球层，成为第一个进入星际空间的人造物。丝带上的年度小波浪不是它在抖，是地球带着我们绕太阳转圈的视差——证据就画在天上。"},"voyager-2":{summary:"唯一近距离看过天王星和海王星的探测器，比 1 号还早出发两周。",details:"它走了一条更贪心的路线：木星、土星、天王星、海王星四连访，至今无人重复。2018 年它也进入了星际空间。现在朝着南天的孔雀座方向飞去。"},"pioneer-10":{summary:"第一个穿过小行星带、第一个近距离看木星的探测器，1972 年出发。",details:"2003 年地球最后一次收到它的信号，之后它安静地继续飞，方向正对金牛座的毕宿五。它带着一块刻着人类男女形象和太阳系位置的金属板——如果有谁捡到它，那是我们的自我介绍。"},"pioneer-11":{summary:"第一个近距离看土星的探测器，也带着那块著名的人类名片金属板。",details:"1979 年它替人类第一次撩开土星的面纱，为后来的旅行者和卡西尼探路。1995 年失联。它现在朝着天鹰座方向漂流，大约几百万年后会路过那里的一颗恒星。"},"new-horizons":{summary:"2015 年飞掠冥王星，把一颗模糊的光点变成了有冰川和心形平原的世界。",details:'它是这五位信使里最年轻的，还在柯伊伯带工作，仍定期回传数据。它出发那年冥王星还是"第九大行星"，飞到一半冥王星被除名——它不在乎，照飞。'}},ne={[p]:{title:"真实数据 · Gaia DR3 官方全天图",copy:"这层底图来自 ESA Gaia DR3 的官方全天渲染，基于约 18 亿颗被实际测量的恒星位置与亮度。它适合做银河的大尺度总览，而不是深空长曝光照片。近距离下它会显出颗粒感——每个亮点都是一颗被单独测量的恒星，这正是“测量图”和“照片”的区别。"},[D]:{title:"真实数据 · DSS2 巡天照片",copy:"这层底图来自 DSS2 数字化巡天照片，放大到具体天区时能看到真实照相底片记录下的星场。它更适合近距离查看星云、暗云和密集星区。"}},Pe=document.querySelector("#app");Pe.innerHTML=`
  <div class="shell">
    <header class="topbar">
      <div>
        <div class="eyebrow">第一阶段 / 真实数据模式</div>
        <h1>星空照片探索器</h1>
        <p class="subtitle">从真实巡天数据进入银河：先看整片天空，再拉近到可以辨认的天区。</p>
      </div>
      <div class="topbar-actions">
        <div class="badge">银河总览</div>
        <a class="badge badge-link" href="solar.html">太阳系 →</a>
        <a class="badge badge-link" href="stations.html">空间站 →</a>
        <a class="badge badge-link" href="observatories.html">观星台 →</a>
      </div>
    </header>

    <main class="stage-wrap">
      <section class="stage">
        <div class="hero-view">
          <div class="hero-scene" data-hero-scene>
            <div id="sky-view" aria-label="可交互星空视图"></div>
            <div class="hero-overlay"></div>
            <div class="anchor-layer" data-anchor-layer></div>
            <div class="survey-chip" data-survey-chip hidden>
              <button class="survey-option" type="button" data-survey-choice="dss2">DSS2 照片</button>
              <button class="survey-option" type="button" data-survey-choice="gaia">Gaia 测量图</button>
            </div>
          </div>
          <div class="hero-caption" data-hero-caption>
            <div class="hero-kicker">真实天空 / 可交互巡天底图</div>
            <h2>把银河拉近</h2>
            <p>拖动天空可以自由探索，点击标记会把视野平滑带到对应天区。总览使用 Gaia DR3，近距离自动切到 DSS2。</p>
          </div>
        </div>
      </section>

      <aside class="panel">
        <div class="panel-section">
          <div class="panel-label">模式</div>
          <div class="panel-value">真实数据底图</div>
        </div>
        <div class="panel-section">
          <div class="panel-label">状态</div>
          <div class="panel-value" data-panel-status>总览模式</div>
        </div>
        <div class="panel-section">
          <div class="panel-label">当前目标</div>
          <div class="panel-value panel-title" data-panel-title>正在加载锚点…</div>
          <div class="panel-copy" data-panel-summary></div>
          <div class="panel-copy" data-panel-details>
            这里不再只是静态背景，而是可以从真实天空数据进入的探索界面。
          </div>
          <div class="panel-actions">
            <button class="ghost-button" type="button" data-nasa-open hidden>在 NASA 图库看这里</button>
          </div>
          <div class="probe-timeline" data-probe-timeline hidden>
            <div class="panel-label">时间机器</div>
            <input type="range" class="timeline-range" data-timeline-range min="0" max="1000" value="1000" aria-label="轨迹时间轴" />
            <div class="panel-copy timeline-label" data-timeline-label></div>
          </div>
        </div>
        <div class="panel-section">
          <div class="panel-label">边界</div>
          <div class="panel-value panel-boundary-title" data-panel-boundary-title>真实数据 · Gaia DR3 官方全天图</div>
          <div class="panel-copy" data-panel-boundary-copy></div>
        </div>
        <div class="panel-section">
          <div class="panel-label">天区</div>
          <div class="target-list" data-target-list></div>
        </div>
        <div class="panel-section">
          <div class="panel-label">解释层</div>
          <div class="panel-actions">
            <button class="ghost-button" type="button" data-toggle-bortle aria-expanded="false">光污染阶梯</button>
            <button class="ghost-button" type="button" data-toggle-galaxy aria-expanded="false">跳出银河系</button>
            <button class="ghost-button" type="button" data-toggle-apod aria-expanded="false">NASA 今天看什么</button>
          </div>
          <div class="explainer-card" data-apod-card hidden>
            <div class="panel-copy" data-apod-content>正在向 NASA 查询今天的天文图…</div>
          </div>
          <div class="explainer-card" data-bortle-card hidden>
            <img src="explainers/bortle_scale.png" alt="Bortle 光污染等级示意图" />
            <p>Bortle 标尺用 1 到 9 级描述夜空黑暗程度，级别越高，城市灯光对星空的遮蔽越明显。今天许多人看不到照片里的银河，主要不是银河消失了，而是城市光污染把它淹没在夜空背景里。</p>
          </div>
          <div class="explainer-card" data-galaxy-card hidden>
            <img src="explainers/milky_way_topdown.jpg" alt="银河系俯视示意图（艺术想象，基于真实测量）" />
            <p>这是银河系的俯视示意图（NASA/JPL-Caltech/R. Hurt，基于真实测量绘制）。注意"示意"两个字：人类没有任何一张从外面拍的银河系照片——飞得最远的旅行者 1 号走了近 50 年，也才离家 0.003 光年，而想拍到全貌得飞出去几万光年。所有"银河系全景"都是根据真实测量画出来的。</p>
            <p>但我们有一面真实的镜子：仙女座星系。它在 254 万光年外，和银河系是同类型的旋涡星系——在锚点列表里点开它，看到的那团旋涡，差不多就是别人眼中的我们。这是人类唯一能"看见自己"的方式，而且那是货真价实的照片。</p>
            <p>Gaia 精确测量的恒星，大多在太阳周围几千光年的范围内。这已经是人类历史上最大的三维星图，但放到直径约十万光年的整个银河系里，仍然只是家门口的一小片。宇宙地图，才刚刚开始画。</p>
          </div>
          <div class="panel-copy boundary-note">底图边界说明：Gaia 测量的是恒星位置与亮度，不是深空长曝光照片；DSS2 来自上世纪照相底片数字化，近看会保留底片和拼接痕迹。</div>
        </div>
        <div class="panel-section">
          <div class="panel-label">下一步</div>
          <div class="panel-value" data-panel-next>点击一个天区开始拉近。</div>
          <div class="panel-actions">
            <button class="primary-button" type="button" data-tour-toggle>自动漫游</button>
            <button class="ghost-button" type="button" data-reset-view>重置视野</button>
          </div>
          <div class="tour-config" data-tour-config>
            <label><input type="checkbox" data-tour-group="夏季银河" checked /> 夏季银河</label>
            <label><input type="checkbox" data-tour-group="秋冬星空" checked /> 秋冬星空</label>
            <label><input type="checkbox" data-tour-group="南天深空" checked /> 南天深空</label>
            <label><input type="checkbox" data-tour-group="深空信使" /> 深空信使</label>
            <label class="tour-dwell">每站停留
              <select data-tour-dwell>
                <option value="4000">4 秒</option>
                <option value="6000" selected>6 秒</option>
                <option value="10000">10 秒</option>
              </select>
            </label>
          </div>
        </div>
      </aside>
    </main>
  </div>
  <div class="modal-backdrop" data-nasa-modal hidden>
    <section class="nasa-modal" role="dialog" aria-label="NASA 图库">
      <div class="nasa-modal-header">
        <h3 data-nasa-title>NASA 图库</h3>
        <button class="modal-close" type="button" data-nasa-close aria-label="关闭 NASA 图库">×</button>
      </div>
      <div class="nasa-modal-body" data-nasa-content></div>
      <p class="nasa-modal-footer">图片版权归 NASA 及其合作机构所有，点击缩略图直接看大图。</p>
    </section>
  </div>
  <div class="lightbox-backdrop" data-nasa-lightbox hidden>
    <figure class="nasa-lightbox" role="dialog" aria-label="NASA 大图">
      <button class="modal-close lightbox-close" type="button" data-lightbox-close aria-label="关闭大图">×</button>
      <div class="lightbox-stage">
        <div class="nasa-state" data-lightbox-state>正在加载大图…</div>
        <img data-lightbox-img alt="" hidden />
      </div>
      <figcaption class="lightbox-caption">
        <span data-lightbox-title></span>
        <a data-lightbox-nasa-link href="#" target="_blank" rel="noreferrer">在 NASA 页面打开 ↗</a>
      </figcaption>
    </figure>
  </div>
`;const C=document.querySelector("[data-anchor-layer]"),y=document.querySelector("[data-panel-status]"),ue=document.querySelector("[data-panel-title]"),pe=document.querySelector("[data-panel-summary]"),fe=document.querySelector("[data-panel-details]"),Oe=document.querySelector("[data-panel-boundary-title]"),_e=document.querySelector("[data-panel-boundary-copy]"),f=document.querySelector("[data-panel-next]"),Be=document.querySelector("[data-reset-view]"),F=document.querySelector("[data-tour-toggle]"),ve=document.querySelector("[data-toggle-bortle]"),oe=document.querySelector("[data-bortle-card]"),he=document.querySelector("[data-toggle-galaxy]"),ie=document.querySelector("[data-galaxy-card]"),me=document.querySelector("[data-toggle-apod]"),re=document.querySelector("[data-apod-card]"),se=document.querySelector("[data-apod-content]"),Re=document.querySelector("[data-tour-config]"),ze=document.querySelector("[data-tour-dwell]"),le=document.querySelector("[data-probe-timeline]"),L=document.querySelector("[data-timeline-range]"),Ge=document.querySelector("[data-timeline-label]"),V=document.querySelector("[data-target-list]"),H=document.querySelector("[data-survey-chip]"),ye=document.querySelector("[data-nasa-open]"),k=document.querySelector("[data-nasa-modal]"),je=document.querySelector("[data-nasa-title]"),Y=document.querySelector("[data-nasa-content]"),Ue=document.querySelector("[data-nasa-close]"),q=document.querySelector("[data-nasa-lightbox]"),u=document.querySelector("[data-lightbox-img]"),E=document.querySelector("[data-lightbox-state]"),Ve=document.querySelector("[data-lightbox-title]"),He=document.querySelector("[data-lightbox-nasa-link]"),Ye=document.querySelector("[data-lightbox-close]");let s=null,c=[],r=null,m=p,b="auto",l={...v},h=null,g=!1,w=null,x=0;const G=new Map;let T=0;function We(e){return e<.5?4*e*e*e:1-(-2*e+2)**3/2}function X(e){return(e%360+360)%360}function Je(e,t,a){const n=(t-e+540)%360-180;return X(e+n*a)}function Ke(e,t,a){return Math.exp(Math.log(e)+(Math.log(t)-Math.log(e))*a)}function Ze(){if(!r||typeof r.getRaDec!="function")return null;const e=r.getRaDec();if(!e)return null;const t=Number(e[0]),a=Number(e[1]);return Number.isFinite(t)&&Number.isFinite(a)?{ra:X(t),dec:a}:null}function Qe(){if(!r)return null;const e=typeof r.getFoV=="function"?r.getFoV:r.getFov;if(typeof e!="function")return null;const t=e.call(r),a=Number(t&&typeof t=="object"?t[0]:t);return Number.isFinite(a)&&a>0?a:null}function ge(){const e=Ze(),t=Qe();e&&(l.ra=e.ra,l.dec=e.dec),t&&(l.fov=t)}function ee(){const e=ne[m]??ne[p];Oe.textContent=e.title,_e.textContent=e.copy}function j(e){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function be(){const e=Number.isFinite(l.fov)&&l.fov<30;H.hidden=!e;for(const t of H.querySelectorAll(".survey-option")){const n=(t.dataset.surveyChoice==="dss2"?D:p)===m;t.classList.toggle("is-selected",n),t.setAttribute("aria-pressed",String(n))}}function I(e){r&&(e!==m&&(m=e,r.setImageSurvey(m)),ee(),be())}function Se(e=l.fov){if(!r||!Number.isFinite(e))return;if(b==="manual"){be();return}const t=e<30?D:e>50?p:m;I(t)}function S(){if(!r||!c.length)return;const e=C.getBoundingClientRect();for(const t of c){const a=C.querySelector(`[data-anchor-id="${t.id}"]`);if(!a||!t.sky)continue;const n=r.world2pix(t.sky.ra,t.sky.dec),o=n?Number(n[0]):Number.NaN,i=n?Number(n[1]):Number.NaN,d=Number.isFinite(o)&&Number.isFinite(i)&&o>=0&&i>=0&&o<=e.width&&i<=e.height;a.style.left=`${o}px`,a.style.top=`${i}px`,a.style.visibility=d?"visible":"hidden"}}function ce(){ge(),Se(),S()}function W(e){ue.textContent=e.label,pe.textContent=e.summary,fe.textContent=e.details,ye.hidden=!e,ee()}function J(e){Y.innerHTML=`<div class="nasa-state">${e}</div>`}function de(e){if(!e.length){J("这个天区在 NASA 图库里没有直接匹配的照片。");return}Y.innerHTML=`
    <div class="nasa-grid">
      ${e.map((t,a)=>`
          <button class="nasa-card" type="button" data-nasa-index="${a}">
            <img src="${j(t.thumbnail)}" alt="${j(t.title)}" loading="lazy" />
            <span>${j(t.title)}</span>
          </button>
        `).join("")}
    </div>
  `;for(const t of Y.querySelectorAll("[data-nasa-index]"))t.addEventListener("click",()=>et(e[Number(t.dataset.nasaIndex)]))}function Xe(e){const a=["~large","~medium","~orig"].map(n=>e.thumbnail.replace(/~(thumb|small|medium)(?=\.[a-z]+$)/i,n)).filter(n=>n!==e.thumbnail);return a.push(e.thumbnail),[...new Set(a)]}function et(e){const t=Xe(e);let a=0;Ve.textContent=e.title,He.href=`https://images.nasa.gov/details/${encodeURIComponent(e.nasaId)}`,E.hidden=!1,E.textContent="正在加载大图…",u.hidden=!0,u.onload=()=>{E.hidden=!0,u.hidden=!1},u.onerror=()=>{a+=1,a<t.length?u.src=t[a]:E.textContent="大图加载失败，可以去 NASA 页面查看。"},u.src=t[0],q.hidden=!1}function te(){q.hidden=!0,u.onload=null,u.onerror=null,u.removeAttribute("src")}function tt(e){return e.map(t=>{const a=t.data?.[0]??{},n=t.links?.[0]?.href;return!n||!a.nasa_id?null:{nasaId:a.nasa_id,title:a.title||"NASA 图像",thumbnail:n}}).filter(Boolean).slice(0,6)}async function at(e,t){if(G.has(e.id)){de(G.get(e.id));return}const a=Fe[e.id]??e.label,n=new URL("https://images-api.nasa.gov/search");n.searchParams.set("q",a),n.searchParams.set("media_type","image"),n.searchParams.set("page_size","6"),J("正在向 NASA 查询…");try{const o=await fetch(n);if(!o.ok)throw new Error(`NASA API returned ${o.status}`);const i=await o.json(),d=tt(i.collection?.items??[]);G.set(e.id,d),t===T&&de(d)}catch{t===T&&J("查询失败，可能是网络问题。")}}function ae(){T+=1,k.hidden=!0}function nt(){const e=c.find(a=>a.id===s);if(!e)return;const t=T+1;T=t,je.textContent=`NASA 图库 · ${e.label}`,k.hidden=!1,at(e,t)}function ot(){for(const e of C.querySelectorAll(".anchor-hotspot"))e.classList.toggle("is-selected",e.dataset.anchorId===s);for(const e of V.querySelectorAll(".target-button"))e.classList.toggle("is-selected",e.dataset.anchorId===s)}function we(){h&&(cancelAnimationFrame(h.frameId),h=null)}function xe(){w&&(clearTimeout(w),w=null)}function P(e={}){const{cancelTween:t=!0}=e;!g&&!w||(x+=1,g=!1,xe(),t&&we(),F.textContent="自动漫游")}function K(e){r&&(l={ra:X(e.ra),dec:e.dec,fov:e.fov},r.gotoRaDec(l.ra,l.dec),r.setFoV(l.fov),Se(l.fov),S())}function O(e,t){if(!r)return;we(),ge();const a={...l},n=performance.now();h={frameId:0};function o(i){const d=Math.min((i-n)/De,1),z=We(d),$e={ra:Je(a.ra,e.ra,z),dec:a.dec+(e.dec-a.dec)*z,fov:Ke(a.fov,e.fov,z)};if(K($e),d<1){h.frameId=requestAnimationFrame(o);return}K(e),h=null,t?.()}h.frameId=requestAnimationFrame(o)}function _(e,t={}){const{moveSky:a=!0,fromTour:n=!1}=t;n||P({cancelTween:!0}),s=e;const o=c.find(i=>i.id===e);o&&(ot(),W(o),Ct(),a&&(b="auto",y.textContent=`已拉近：${o.label}`,f.textContent="可以继续拖动天空，或切换到另一个天区。",O({...o.sky,fov:o.fov},S)))}function it(){C.innerHTML=c.map(e=>`
      <button
        class="anchor-hotspot${e.id===s?" is-selected":""}"
        type="button"
        data-anchor-id="${e.id}"
        aria-label="${e.label}"
        title="${e.label}"
      >
        <span class="anchor-dot"></span>
        <span class="anchor-label">${e.label}</span>
      </button>
    `).join("");for(const e of C.querySelectorAll(".anchor-hotspot"))e.addEventListener("click",()=>_(e.dataset.anchorId)),e.addEventListener("mouseenter",()=>{const t=c.find(a=>a.id===e.dataset.anchorId);t&&W(t)}),e.addEventListener("mouseleave",()=>{const t=c.find(a=>a.id===s);t&&W(t)});S()}function rt(){const e=[];let t=null;for(const a of c)a.group!==t&&(t=a.group,e.push(`<div class="target-group-label">${t}</div>`)),e.push(`
      <button
        class="target-button${a.id===s?" is-selected":""}"
        type="button"
        data-anchor-id="${a.id}"
      >
        ${a.label}
      </button>
    `);V.innerHTML=e.join("");for(const a of V.querySelectorAll(".target-button"))a.addEventListener("click",()=>_(a.dataset.anchorId))}function st(e){b="auto",y.textContent="返回总览",f.textContent="漫游结束后可以重新选择任意天区。",O(v,()=>{e===x&&(g=!1,xe(),F.textContent="自动漫游",y.textContent="总览模式",f.textContent="点击一个天区开始拉近。",I(p),S())})}function Ae(){const e=new Set([...Re.querySelectorAll("[data-tour-group]:checked")].map(t=>t.dataset.tourGroup));return c.filter(t=>e.has(t.group))}function Ce(e,t){if(t!==x||!g)return;const a=Ae();if(e>=a.length){st(t);return}const n=a[e];b="auto",_(n.id,{moveSky:!1,fromTour:!0}),y.textContent=`漫游中 (${e+1}/${a.length})：${n.label}`,f.textContent="自动漫游会停留片刻，然后前往下一站。",O({...n.sky,fov:n.fov},()=>{t!==x||!g||(w=setTimeout(()=>{w=null,Ce(e+1,t)},Number(ze.value)||6e3))})}function lt(){if(!Ae().length){f.textContent="先在下面勾选至少一组天区，再开始漫游。";return}P({cancelTween:!0}),g=!0,x+=1,F.textContent="停止漫游",Ce(0,x)}function ct(){if(g){P({cancelTween:!0});const e=c.find(t=>t.id===s);y.textContent=e?`已停止：${e.label}`:"已停止漫游",f.textContent="可以继续拖动天空，或重新开始自动漫游。";return}lt()}function dt(){P({cancelTween:!0}),b="auto",y.textContent="总览模式",f.textContent="点击一个天区开始拉近。",O(v,()=>{I(p),S()})}function ut(e){b="manual",I(e==="dss2"?D:p)}function pt(){r.on("positionChanged",ce),r.on("zoomChanged",ce),window.addEventListener("resize",S)}function ft(){const e=oe.hidden;oe.hidden=!e,ve.setAttribute("aria-expanded",String(e))}function vt(){const e=ie.hidden;ie.hidden=!e,he.setAttribute("aria-expanded",String(e))}let Z=!1;async function ht(){try{const e=await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&thumbs=true");if(!e.ok)throw new Error(String(e.status));const t=await e.json(),a=t.media_type==="video"?t.thumbnail_url:t.url;se.innerHTML=`
      ${a?`<img src="${a}" alt="NASA 每日一图" />`:""}
      <p><strong>${t.title??""}</strong>（${t.date??""}）</p>
      ${t.media_type==="video"?`<p><a href="${t.url}" target="_blank" rel="noreferrer">今天是段视频，去看 ↗</a></p>`:""}
      <p>${(t.explanation??"").slice(0,300)}…（英文原文，<a href="https://apod.nasa.gov/apod/astropix.html" target="_blank" rel="noreferrer">APOD 官网 ↗</a>）</p>
    `}catch{Z=!1,se.textContent="查询失败——NASA 的免费接口偶尔限流，过一会儿再点一次。"}}function mt(){const e=re.hidden;re.hidden=!e,me.setAttribute("aria-expanded",String(e)),e&&!Z&&(Z=!0,ht())}const N={hoverColor:"rgba(157, 184, 255, 0.85)",selectionColor:"rgba(157, 184, 255, 0.85)"};function Le(e){try{const t=window.A.graphicOverlay({color:"rgba(255,255,255,0.3)",lineWidth:1});if(r.addOverlay(t),typeof window.A.polyline=="function"){t.add(window.A.polyline(e,{...N}));return}if(typeof window.A.line!="function")return;for(let a=0;a<e.length-1;a+=1)t.add(window.A.line(e[a],e[a+1],{...N}))}catch{}}function yt(){Le([[279.2347,38.7837],[310.358,45.2803],[297.6958,8.8683],[279.2347,38.7837]])}function gt(){Le([[101.28716,-16.71612],[88.79294,7.40706],[114.8255,5.22499],[101.28716,-16.71612]])}async function bt(){if(!window.A?.init)throw new Error("Aladin Lite 没有加载成功。");await window.A.init,r=window.A.aladin("#sky-view",{survey:p,target:`${v.ra} ${v.dec}`,fov:v.fov,cooFrame:"galactic",showFullscreenControl:!1,showLayersControl:!1,showGotoControl:!1,showZoomControl:!1,showFrame:!1,showCooGrid:!1,showSimbadPointerControl:!1}),pt(),yt(),gt(),requestAnimationFrame(()=>K(v))}let $=[];function St(e){return e.map(t=>{const a=Ie[t.id]??{summary:"",details:""},n=t.start.slice(0,4);return{id:t.id,label:t.label,kind:"probe",mode:"real",group:"深空信使",tour:!1,sky:{ra:t.current[0],dec:t.current[1]},fov:12,summary:a.summary,details:`${a.details} 银色丝带是它 ${n} 年出发以来在天幕上划过的真实轨迹（JPL Horizons 数据），此刻距离约 ${t.dist_au} AU（1 AU = 日地距离）。`}})}const ke=new Map,Q=new Set,wt=5;function xt(){for(const e of $)try{const t=window.A.graphicOverlay({color:"rgba(214, 226, 255, 0.34)",lineWidth:1});r.addOverlay(t),typeof window.A.polyline=="function"&&(t.add(window.A.polyline(e.path,{...N})),ke.set(e.id,t))}catch{}}function qe(e,t){const a=ke.get(e.id);if(a)try{a.removeAll(),a.add(window.A.polyline(e.path.slice(0,t+1),{...N}));const n=t>=e.path.length-1;if(!n&&typeof window.A.circle=="function"){const[o,i]=e.path[t];a.add(window.A.circle(o,i,.5,{color:"rgba(157, 184, 255, 0.9)",...N}))}n?Q.delete(e.id):Q.add(e.id)}catch{}}function At(e,t){const a=new Date(`${e.start}T00:00:00Z`),n=new Date(a.getTime()+t*wt*864e5);return`${n.getUTCFullYear()} 年 ${n.getUTCMonth()+1} 月`}function Te(){const e=$.find(n=>n.id===s);if(!e)return;const t=Number(L.value)/Number(L.max),a=Math.max(1,Math.round(t*(e.path.length-1)));qe(e,a),Ge.textContent=a>=e.path.length-1?`今天 · 距离约 ${e.dist_au} AU`:`${At(e,a)} · 它当时在天上的这个方向`}function Ct(){for(const t of[...Q]){if(t===s)continue;const a=$.find(n=>n.id===t);a&&qe(a,a.path.length-1)}if(!$.find(t=>t.id===s)){le.hidden=!0;return}le.hidden=!1,L.value=L.max,Te()}let U=!1;L.addEventListener("input",()=>{U||(U=!0,requestAnimationFrame(()=>{U=!1,Te()}))});async function Lt(){ee(),c=await(await fetch(Ee)).json();try{const t=await(await fetch(Me)).json();$=t,c.push(...St(t))}catch{}s=c[0]?.id??null,it(),rt(),s&&_(s,{moveSky:!1}),await bt(),xt()}Be.addEventListener("click",dt);F.addEventListener("click",ct);ve.addEventListener("click",ft);he.addEventListener("click",vt);me.addEventListener("click",mt);ye.addEventListener("click",nt);Ue.addEventListener("click",ae);k.addEventListener("click",e=>{e.target===k&&ae()});Ye.addEventListener("click",te);q.addEventListener("click",e=>{e.target===q&&te()});window.addEventListener("keydown",e=>{e.key==="Escape"&&(q.hidden?k.hidden||ae():te())});for(const e of H.querySelectorAll(".survey-option"))e.addEventListener("click",()=>ut(e.dataset.surveyChoice));const B=document.querySelector("[data-hero-caption]"),M=document.querySelector("[data-hero-scene]");let A=0;function R(){B.classList.add("is-hidden")}function Ne(e){B.classList.remove("is-hidden"),clearTimeout(A),e&&(A=setTimeout(R,e))}M.addEventListener("pointerdown",R,!0);M.addEventListener("mousemove",e=>{const t=M.getBoundingClientRect();e.clientY>t.top+t.height*.8?Ne(0):B.classList.contains("is-hidden")||(clearTimeout(A),A=setTimeout(R,1200))});M.addEventListener("mouseleave",()=>{B.classList.contains("is-hidden")||(clearTimeout(A),A=setTimeout(R,1200))});Ne(6e3);window.__cosmicDebug={get aladin(){return r},get currentView(){return l},get activeSurvey(){return m},get surveyMode(){return b}};Lt().catch(e=>{y.textContent="出错",ue.textContent="锚点或星图加载失败",pe.textContent="无法加载第一阶段的天区数据。",fe.textContent=String(e),f.textContent="请先修复数据或 Aladin Lite 加载问题。"});
