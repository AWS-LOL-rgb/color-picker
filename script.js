function initializeTailwind() {}

let currentPage = 0
let swatches = []
let pickedColor = "#67e8f9"
let harmonyMode = 0

// 20 beautiful calm colors
let calmColors = [
    { hex: "#e0f2fe", name: "Cloud White" },
    { hex: "#bae6fd", name: "Ice Blue" },
    { hex: "#a5f3fc", name: "Soft Turquoise" },
    { hex: "#99f6e4", name: "Minty" },
    { hex: "#a1e9c8", name: "Aquatic Green" },
    { hex: "#bef575", name: "Lime Green" },
    { hex: "#d1fae5", name: "Pale Green" },
    { hex: "#ecfdf5", name: "Botanical" },
    { hex: "#fefce8", name: "Warm Cream" },
    { hex: "#fef3c7", name: "Honey" },
    { hex: "#fde68c", name: "Apricot" },
    { hex: "#fed7aa", name: "Soft Orange" },
    { hex: "#f3e8ff", name: "Lavender" },
    { hex: "#e9d5ff", name: "Light Purple" },
    { hex: "#f5d0fe", name: "Dusty Pink" },
    { hex: "#fae8e8", name: "Pastel Pink" },
    { hex: "#f1e0d6", name: "Warm Beige" },
    { hex: "#e6d9cc", name: "Clay" },
    { hex: "#e0e7ff", name: "Pale Indigo" },
    { hex: "#dbeafe", name: "Sky Blue" }
]

let blendsData = [
    {
        title: "Morning Dawn",
        subtitle: "Soft dawn",
        colors: ["#f3e8ff", "#c7d2fe", "#67e8f9"],
        style: "from-violet-200 via-indigo-200 to-cyan-200"
    },
    {
        title: "Dew Forest",
        subtitle: "Dew forest",
        colors: ["#a1e9c8", "#67e8f9", "#22d3ee"],
        style: "from-emerald-200 via-cyan-200 to-sky-200"
    },
    {
        title: "Desert Dusk",
        subtitle: "Desert dusk",
        colors: ["#fed7aa", "#fde68c", "#f59e0b"],
        style: "from-orange-200 via-amber-200 to-yellow-300"
    },
    {
        title: "Lunar Silver",
        subtitle: "Lunar silver",
        colors: ["#e0f2fe", "#c4d0ff", "#a5b4fc"],
        style: "from-sky-100 via-indigo-100 to-blue-200"
    },
    {
        title: "Spring Blossom",
        subtitle: "Blossom",
        colors: ["#fce7f3", "#f9a8d4", "#e879f9"],
        style: "from-pink-200 via-fuchsia-200 to-purple-200"
    },
    {
        title: "Amber Sea",
        subtitle: "Amber sea",
        colors: ["#fef3c7", "#a5f3fc", "#67e8f9"],
        style: "from-amber-100 via-cyan-100 to-sky-200"
    }
]

function randomHex() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase()
}

function hexToHsl(hex) {
    let r = parseInt(hex.slice(1,3),16)/255
    let g = parseInt(hex.slice(3,5),16)/255
    let b = parseInt(hex.slice(5,7),16)/255
    let max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2
    if (max === min) {
        h = s = 0
    } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break
            case g: h = (b - r) / d + 2; break
            case b: h = (r - g) / d + 4; break
        }
        h /= 6
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToHex(h, s, l) {
    h = h % 360
    s = Math.max(0, Math.min(100, s))
    l = Math.max(5, Math.min(95, l))
    let c = (1 - Math.abs(2 * l / 100 - 1)) * (s / 100)
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    let m = l / 100 - c/2
    let r = 0, g = 0, b = 0
    if (h < 60) { r = c; g = x; b = 0 }
    else if (h < 120) { r = x; g = c; b = 0 }
    else if (h < 180) { r = 0; g = c; b = x }
    else if (h < 240) { r = 0; g = x; b = c }
    else if (h < 300) { r = x; g = 0; b = c }
    else { r = c; g = 0; b = x }
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)
    return "#" + [r,g,b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase()
}

function generateVariations(baseHex) {
    const hsl = hexToHsl(baseHex)
    const variations = []

    // 16 variations - 4 lightness steps x 4 saturation tweaks
    const lightnessSteps = [92, 78, 55, 28]
    const satSteps = [95, 75, 55, 30]

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const newH = (hsl.h + (j * 4 - 6)) % 360
            const newS = Math.max(18, Math.min(98, hsl.s * (satSteps[j] / 100)))
            const newL = lightnessSteps[i]
            const hex = hslToHex(newH, newS, newL)
            variations.push({
                hex: hex,
                label: `${newL}%`
            })
        }
    }
    return variations
}

function createHomeSwatch(i) {
    const div = document.createElement('div')
    div.className = `flex flex-col group`
    div.innerHTML = `
        <div id="swatch-${i}" onclick="copySwatch(${i}); event.stopImmediatePropagation()"
             class="swatch cursor-pointer h-[380px] rounded-3xl border border-white shadow-sm overflow-hidden relative">
            <div onclick="event.stopImmediatePropagation(); toggleLock(${i});"
                 id="lockbtn-${i}"
                 class="absolute top-6 right-6 bg-white/90 text-xs w-6 h-6 rounded-2xl flex items-center justify-center text-stone-400 hover:text-amber-500 transition-colors shadow">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
            </div>
        </div>
        <div class="flex justify-between items-center mt-5 px-3">
            <div onclick="copySwatch(${i}); event.stopImmediatePropagation()" class="cursor-pointer">
                <div id="hex-${i}" class="color-code text-3xl font-medium text-stone-900">#F4A261</div>
                <div id="info-${i}" class="font-mono text-xs text-stone-400">hsl(27, 87%, 67%)</div>
                <div class="flex gap-2 mt-2">
                    <button onclick="event.stopImmediatePropagation(); copySwatchFormat(${i}, 'hex')" class="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded transition">HEX</button>
                    <button onclick="event.stopImmediatePropagation(); copySwatchFormat(${i}, 'rgb')" class="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded transition">RGB</button>
                    <button onclick="event.stopImmediatePropagation(); copySwatchFormat(${i}, 'hsl')" class="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded transition">HSL</button>
                </div>
            </div>
            <button onclick="event.stopImmediatePropagation(); randomizeOne(${i});"
                    class="w-8 h-8 opacity-30 group-hover:opacity-100 flex items-center justify-center text-xl hover:scale-110 transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </button>
        </div>
    `
    return div
}

function renderHome() {
    const container = document.getElementById("home-swatches")
    container.innerHTML = ""
    swatches = []

    const starterHues = [200, 260, 340, 155]

    for (let i = 0; i < 4; i++) {
        const hex = hslToHex(starterHues[i], 72, 68)
        swatches.push({ hex: hex, locked: false })

        const el = createHomeSwatch(i)
        container.appendChild(el)
        refreshSwatch(i)
    }
}

function refreshSwatch(i) {
    const sw = swatches[i]
    const swatchDiv = document.getElementById(`swatch-${i}`)
    const hexDiv = document.getElementById(`hex-${i}`)
    const infoDiv = document.getElementById(`info-${i}`)

    swatchDiv.style.background = sw.hex
    hexDiv.textContent = sw.hex

    const hslVal = hexToHsl(sw.hex)
    infoDiv.textContent = `hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`

    const lockEl = document.getElementById(`lockbtn-${i}`)
    lockEl.innerHTML = sw.locked ?
        `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>` :
        `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>`
}

function toggleLock(i) {
    swatches[i].locked = !swatches[i].locked
    refreshSwatch(i)
}

function randomizeOne(i) {
    if (swatches[i].locked) return
    swatches[i].hex = randomHex()
    refreshSwatch(i)
}

function copySwatch(i) {
    navigator.clipboard.writeText(swatches[i].hex).then(() => {
        showToast("Copied " + swatches[i].hex)
    })
}

function generateNewPalette() {
    if (currentPage === 0) {
        for (let i = 0; i < swatches.length; i++) {
            if (!swatches[i].locked) {
                swatches[i].hex = randomHex()
            }
            refreshSwatch(i)
        }

        const container = document.getElementById("home-swatches")
        container.style.transitionDuration = '150ms'
        container.style.transform = 'scale(0.96)'
        setTimeout(() => {
            container.style.transitionDuration = '450ms'
            container.style.transform = 'scale(1)'
        }, 1)
    } else if (currentPage === 1) {
        calmColors = []
        for (let i = 0; i < 20; i++) {
            const h = Math.floor(Math.random() * 360)
            const s = Math.floor(Math.random() * 40) + 30
            const l = Math.floor(Math.random() * 25) + 75
            calmColors.push({ hex: hslToHex(h, s, l), name: hueName(h) + " " + (i + 1) })
        }
        renderCalm()
    } else if (currentPage === 2) {
        randomBaseColor()
    } else if (currentPage === 3) {
        blendsData = []
        for (let i = 0; i < 6; i++) {
            const colors = generateBlendColors()
            blendsData.push({
                title: "Blend " + (i + 1),
                subtitle: colors[0] + " to " + colors[2],
                colors: colors
            })
        }
        renderBlends()
    }
}

function renderCalm() {
    const container = document.getElementById("calm-grid")
    container.innerHTML = ""

    calmColors.forEach(item => {
        const card = document.createElement("div")
        card.className = "group bg-white border border-transparent hover:border-teal-200 transition-all rounded-3xl overflow-hidden cursor-pointer"
        card.innerHTML = `
            <div class="h-64 transition-all" style="background-color: ${item.hex}"></div>
            <div class="px-5 py-6">
                <div class="flex justify-between items-center">
                    <div class="font-medium text-xl text-stone-800">${item.hex}</div>
                    <div class="text-xs text-teal-500 font-light">${item.name}</div>
                </div>
                <div class="flex gap-2 mt-3">
                    <button onclick="event.stopImmediatePropagation(); copyCalmFormat('${item.hex}', 'hex')" class="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded transition">HEX</button>
                    <button onclick="event.stopImmediatePropagation(); copyCalmFormat('${item.hex}', 'rgb')" class="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded transition">RGB</button>
                    <button onclick="event.stopImmediatePropagation(); copyCalmFormat('${item.hex}', 'hsl')" class="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded transition">HSL</button>
                </div>
            </div>
        `
        card.onclick = () => {
            pickedColor = item.hex
            navigate(2)
        }
        container.appendChild(card)
    })
}

function renderManualVariations() {
    const container = document.getElementById("variations-grid")
    container.innerHTML = ""

    const variations = generateVariations(pickedColor)

    variations.forEach((v, index) => {
        const card = document.createElement("div")
        card.className = "group bg-white border border-stone-100 rounded-3xl overflow-hidden cursor-pointer active:scale-95 transition-transform"
        card.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"
        card.innerHTML = `
            <div class="h-28 swatch" style="background: ${v.hex}"></div>
            <div class="px-4 py-4 text-xs">
                <div class="font-mono text-stone-900 text-base">${v.hex}</div>
                <div class="text-stone-400">${v.label}</div>
                <div class="flex gap-2 mt-2">
                    <button onclick="event.stopImmediatePropagation(); copyFormat('${v.hex}', 'hex')" class="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded transition">HEX</button>
                    <button onclick="event.stopImmediatePropagation(); copyFormat('${v.hex}', 'rgb')" class="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded transition">RGB</button>
                    <button onclick="event.stopImmediatePropagation(); copyFormat('${v.hex}', 'hsl')" class="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded transition">HSL</button>
                </div>
            </div>
        `
        card.onclick = () => {
            navigator.clipboard.writeText(v.hex)
            showToast("Copied " + v.hex)
        }
        container.append(card)
    })

    document.getElementById("picked-hex").textContent = pickedColor
    const rgb = hexToRgb(pickedColor)
    document.getElementById("picked-rgb").textContent = `rgb(${rgb.r},${rgb.g},${rgb.b})`
    const hsl = hexToHsl(pickedColor)
    document.getElementById("picked-hsl").textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
}


function hexToRgb(hex) {
    return {
        r: parseInt(hex.substr(1,2),16),
        g: parseInt(hex.substr(3,2),16),
        b: parseInt(hex.substr(5,2),16)
    }
}

function hueName(h) {
    if (h < 15 || h >= 345) return "Rose"
    if (h < 45) return "Amber"
    if (h < 75) return "Gold"
    if (h < 105) return "Lime"
    if (h < 135) return "Mint"
    if (h < 165) return "Teal"
    if (h < 195) return "Sky"
    if (h < 225) return "Azure"
    if (h < 255) return "Lavender"
    if (h < 285) return "Violet"
    if (h < 315) return "Berry"
    return "Coral"
}

function generateBlendColors() {
    const baseH = Math.floor(Math.random() * 360)
    const spread = 20 + Math.floor(Math.random() * 41)
    const h1 = baseH
    const h2 = (baseH + spread) % 360
    const h3 = (baseH + spread * 2) % 360
    const s = Math.floor(Math.random() * 30) + 50
    const l1 = Math.floor(Math.random() * 15) + 80
    const l2 = Math.floor(Math.random() * 15) + 70
    const l3 = Math.floor(Math.random() * 15) + 60
    return [
        hslToHex(h1, s, l1),
        hslToHex(h2, s, l2),
        hslToHex(h3, s, l3)
    ]
}


function formatColor(hex, fmt) {
    if (fmt === 'hex') return hex
    if (fmt === 'rgb') {
        const rgb = hexToRgb(hex)
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    }
    if (fmt === 'hsl') {
        const hsl = hexToHsl(hex)
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    }
    return hex
}

function copyFormat(hex, fmt) {
    const text = formatColor(hex, fmt)
    navigator.clipboard.writeText(text).then(() => showToast("Copied " + text))
}

function copySwatchFormat(i, fmt) {
    const text = formatColor(swatches[i].hex, fmt)
    navigator.clipboard.writeText(text).then(() => showToast("Copied " + text))
}

function copyCalmFormat(hex, fmt) {
    const text = formatColor(hex, fmt)
    navigator.clipboard.writeText(text).then(() => showToast("Copied " + text))
}

function switchHarmony(n) {
    harmonyMode = n
    for (let i = 0; i < 3; i++) {
        const el = document.getElementById("harmony-" + i)
        if (el) {
            if (i === n) {
                el.classList.add("border-b", "border-teal-400", "text-teal-500")
            } else {
                el.classList.remove("border-b", "border-teal-400", "text-teal-500")
            }
        }
    }
    renderManualVariations()
}

function copyPickedFormat(fmt) {
    const text = formatColor(pickedColor, fmt)
    navigator.clipboard.writeText(text).then(() => {
        showToast("Copied " + text)
    })
}

function randomBaseColor() {
    pickedColor = randomHex()
    document.getElementById("manual-color").value = pickedColor
    renderManualVariations()
}

function renderBlends() {
    const container = document.getElementById("blends-grid")
    container.innerHTML = ""

    blendsData.forEach(blend => {
        const cardHTML = `
        <div onclick="applyBlend('${blend.colors[0]}','${blend.colors[1]}','${blend.colors[2]}')"
             class="bg-white border border-transparent hover:border-violet-200 group rounded-3xl overflow-hidden cursor-pointer transition-all">
            <div class="h-80 p-8 flex flex-col justify-end relative" style="background: linear-gradient(135deg, ${blend.colors[0]}, ${blend.colors[1]}, ${blend.colors[2]})">
                <div class="absolute top-8 right-8 text-xs font-medium bg-white/80 text-stone-700 px-4 py-2.5 rounded-3xl shadow-sm">
                    ${blend.subtitle}
                </div>

                <div>
                    <div class="text-4xl font-semibold text-stone-900">${blend.title}</div>
                    <div class="flex gap-x-3 mt-6">
                        ${blend.colors.map(color => `
                            <div onclick="event.stopImmediatePropagation(); copySingle('${color}')"
                                class="w-9 h-9 rounded-2xl shadow-sm ring-2 ring-white"
                                style="background: ${color}"></div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="px-6 py-5 text-xs flex justify-between text-stone-400">
                <div>Copy palette to Generator</div>
                <div class="text-teal-400 group-active:scale-90">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </div>
            </div>
        </div>`
        container.innerHTML += cardHTML
    })
}

function applyBlend(c1, c2, c3) {
    showToast("Blend applied to Generator")
    navigate(0)
    if (swatches.length > 2) {
        swatches[0].hex = c1
        swatches[1].hex = c2
        swatches[2].hex = c3
        refreshSwatch(0)
        refreshSwatch(1)
        refreshSwatch(2)
    }
}

function copySingle(hex) {
    navigator.clipboard.writeText(hex).then(() => showToast("Copied " + hex))
}

function showToast(txt) {
    const toast = document.createElement("div")
    toast.style.cssText = `position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:white; color:#0f766e; padding:14px 28px; border-radius:9999px; box-shadow: 0 10px 30px -10px rgb(16 185 129); font-size:13px; display:flex; align-items:center; gap:14px; z-index:99999; white-space:nowrap;`
    toast.innerHTML = `
        <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        <span>${txt}</span>
    `
    document.body.appendChild(toast)
    setTimeout(() => {
        toast.style.transition = "all .4s cubic-bezier(0.4,0,1,1)"
        toast.style.opacity = "0"
        toast.style.transform = "translateX(-50%) translateY(30px)"
        setTimeout(() => toast.remove(), 400)
    }, 2500)
}

function navigate(page) {
    currentPage = page
    document.querySelectorAll("#main-content > div").forEach(d => d.classList.add("hidden"))
    document.getElementById("page-" + page).classList.remove("hidden")

    document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"))
    const activeNav = document.getElementById("nav-" + page)
    if (activeNav) activeNav.classList.add("active")

    const titles = ["Generator", "Calm Colors", "Manual Picker", "Gradients"]
    const titleEl = document.getElementById("page-title")
    if (titleEl) titleEl.textContent = titles[page]

    const btnLabel = document.getElementById("new-palette-btn-label")
    if (btnLabel) {
        const labels = ["New Palette", "New Calm Set", "Randomize", "New Gradients"]
        btnLabel.textContent = labels[page]
    }

    if (page === 2) {
        document.getElementById("manual-color").value = pickedColor
        renderManualVariations()
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar")
    if (sidebar.style.width === "72px") {
        sidebar.style.width = "288px"
    } else {
        sidebar.style.width = "72px"
    }
}

function handleColorInput() {
    const input = document.getElementById("manual-color")
    input.addEventListener("input", (e) => {
        pickedColor = e.target.value.toUpperCase()
        renderManualVariations()
    })
}

function initialize() {
    initializeTailwind()
    renderHome()
    renderCalm()
    renderBlends()
    handleColorInput()
    navigate(0)

    // initial manual render
    setTimeout(() => {
        renderManualVariations()
    }, 120)

    console.log('%ccolor-picker • refreshed and lightened', 'font-size:10px; color:#67e8f9')
}

function handleLogin() {
    const overlay = document.getElementById("login-overlay")
    const username = document.getElementById("login-user").value.trim()
    const password = document.getElementById("login-pass").value.trim()
    const errorEl = document.getElementById("login-error")

    if (username === "admin" && password === "admin") {
        errorEl.classList.add("hidden")
        overlay.style.transition = "opacity 0.5s ease"
        overlay.style.opacity = "0"
        setTimeout(() => {
            overlay.style.display = "none"
            showToast("Welcome back, admin!")
        }, 500)
    } else {
        errorEl.textContent = "Invalid username or password"
        errorEl.classList.remove("hidden")
    }
}

document.addEventListener("keydown", (e) => {
    const overlay = document.getElementById("login-overlay")
    if (e.key === "Enter" && overlay && overlay.style.display !== "none") {
        handleLogin()
    }
})

window.onload = initialize
