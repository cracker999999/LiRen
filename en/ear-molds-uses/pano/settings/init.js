var winWidth = $(window).width() || window.innerWidth || document.documentElement.clientWidth
    , winHeight = $(window).height() || window.innerHeight || document.documentElement.clientHeight;
console.log(winWidth, winHeight);

function showHotspotAlert(id, x, y, h, v, text) {
    const info = {id, x, y, h: Number(h), v: Number(v), text};
    const e = new Event("hotspot_click");
    e.info = info;
    document.dispatchEvent(e);
}

function getHotspot(id) {
    const p = window.krpano.get("hotspot[" + id + "]");
    if (p) {
        const center = p.getcenter();

        const screen = window.krpano.spheretoscreen(center.x, center.y);
        return {
            id: id,
            x: screen.x,
            y: screen.y,
            h: Number(center.x),
            v: Number(center.y)
        }
    }
    return null
}

/**
 * 设置当新场景被加载时执行的动作.
 */
document.addEventListener('click', onClick);

function onClick(e) {
    const sphere = window.krpano.screentosphere(e.clientX, e.clientY);
    // console.log(sphere);
    sphere.x = Number(sphere.x.toFixed(1));
    sphere.y = Number(sphere.y.toFixed(1));
    console.log(sphere.x, sphere.y);
    const floorHeight = 160;
    const depth = 1;
    const xyz = window.krpano.spheretospace(sphere.x, sphere.y, depth);
    console.log('tx:', xyz.x * floorHeight / xyz.y);
    console.log('tz:', xyz.z * floorHeight / xyz.y);
    console.log('ty:', floorHeight);
}

/**
 * 点击热点弹出卡片
 * @param info 热点信息
 */
function addHotspotCard(info, html) {
    const ele = document.getElementById(`alert-box-${info.id}`);
    if (ele) return;
    const appDom = document.getElementById("app");
    const dom = document.createElement('div');
    dom.className = "alert-box ";
    dom.id = 'alert-box-' + info.id;
    appDom.appendChild(dom);
    const line = document.createElement('div');
    line.className = 'line';
    dom.appendChild(line);
    const box = document.createElement('div');
    box.className = 'box';
    box.innerHTML = html;
    dom.appendChild(box);
    dom.setAttribute('h', info.h);
    dom.setAttribute('v', info.v);

    /*if(winWidth > 768){
        //获取line角度
        var st = window.getComputedStyle(line, null);
        var tr = st.getPropertyValue("-webkit-transform") ||
            st.getPropertyValue("-moz-transform") ||
            st.getPropertyValue("-ms-transform") ||
            st.getPropertyValue("-o-transform") ||
            st.getPropertyValue("transform") ||
            "FAIL";
        // console.log('Matrix: ' + tr);
        var values = tr.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var c = values[2];
        var d = values[3];
        var scale = Math.sqrt(a * a + b * b);
        var sin = b / scale;
        var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

        const radian = Math.PI / 180 * Math.abs(angle);
        const x = Math.cos(radian) * line.clientWidth;
        const y = Math.sin(radian) * line.clientWidth;
        box.setAttribute('offsetX', x.toString());
        box.setAttribute('offsetY', y.toString());
        refreshCard();
    }*/
}

/**
 * 移除指定热点弹出卡片
 * @param ids 热点名称集合
 */
function removeHotspotBox(ids) {
    ids.forEach(id => {
        const dom = document.getElementById(`alert-box-${id}`);
        if (dom) {
            dom.parentElement.removeChild(dom);
        }
    })
}


/**
 * 实时刷新热点弹出卡片
 */
function refreshCard() {
    const domList = document.getElementsByClassName('alert-box');
    const len = domList.length;
    for (let i = 0; i < len; i++) {
        const dom = domList[i];
        const h = Number(dom.getAttribute('h'));
        const v = Number(dom.getAttribute('v'));
        const screen = krpano.spheretoscreen(h, v);
        const line = dom.getElementsByClassName('line')[0];
        const box = dom.getElementsByClassName('box')[0];
        line.style.top = screen.y + 'px';
        line.style.left = screen.x + 'px';
        const x = Number(box.getAttribute('offsetX'));
        const y = Number(box.getAttribute('offsetY'));

        var st = window.getComputedStyle(line, null);
        var tr = st.getPropertyValue("-webkit-transform") ||
            st.getPropertyValue("-moz-transform") ||
            st.getPropertyValue("-ms-transform") ||
            st.getPropertyValue("-o-transform") ||
            st.getPropertyValue("transform") ||
            "FAIL";
        // console.log('Matrix: ' + tr);
        var values = tr.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var c = values[2];
        var d = values[3];
        var scale = Math.sqrt(a * a + b * b);
        // console.log('Scale: ' + scale);
        var sin = b / scale;
        var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        // console.log('Rotate: ' + angle + 'deg');
        // box.style.top = (screen.y - y - box.clientHeight * 0.5) + 'px';
        if (angle < 0) {
            box.style.top = (screen.y - y - box.clientHeight * 0.5) + 'px';
        } else {
            box.style.top = (screen.y + y - box.clientHeight * 0.5) + 'px';
        }
        box.style.left = (screen.x + x) + 'px';
    }
    requestAnimationFrame(refreshCard);
}

/**
 * 显示指定热点提示文字
 * @param hotspotTextList  需要显示文字的热点信息[{id, text}]
 */
function showHotspotText(hotspotTextList) {
    hotspotTextList.forEach(item => {
        const p = window.krpano.get("hotspot[" + item.id + "]");
        console.log(p, 'hotspot');
        if (p) {
            const ele = document.getElementById(`hotspot-text-${item.id}`);
            if (!ele) {
                const center = p.getcenter();
                console.log(center.x, center.y);
                const screen = window.krpano.spheretoscreen(center.x, center.y);
                const span = document.createElement('span');
                span.id = `hotspot-text-${item.id}`;
                span.setAttribute('h', center.x);
                span.setAttribute('v', center.y);

                span.classList.add('text-span');
                if (item.className) {
                    span.classList.add(item.className);
                }
                span.innerHTML = item.text;
                span.setAttribute("data-frame", item.frameSrc);
                span.style.top = (screen.y + 20) + 'px';
                span.style.left = screen.x + 'px';
                document.body.appendChild(span);
            }
        }
    })
    refreshText();
}

/**
 * 移除指定热点的提示文字
 * @param ids [id]
 */
function removeHotspotText(ids) {
    ids.forEach(id => {
        const dom = document.getElementById(`hotspot-text-${id}`);
        if (dom) {
            dom.parentElement.removeChild(dom);
        }
    })
}

/**
 * 实时改变热点文字的位置
 */
function refreshText() {
    const list = document.getElementsByClassName('text-span');
    for (let i = 0; i < list.length; i++) {
        const h = list[i].getAttribute('h');
        const v = list[i].getAttribute('v');
        const screen = window.krpano.spheretoscreen(Number(h), Number(v));
        list[i].style.top = (screen.y + 20) + 'px';
        list[i].style.left = screen.x + 'px';
    }
    requestAnimationFrame(refreshText);
}

/**
 * 判断热点是否已经显示
 * @param id
 */
function isHotspotShow(id) {
    const a = needShowHotspot.find(item => item.id === id);
    // console.log(id, a);
    return !!a;
}
