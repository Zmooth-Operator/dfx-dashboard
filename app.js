var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let allAssets = [];
const fetchAssets = () => __awaiter(this, void 0, void 0, function* () {
    const response = yield fetch("https://api.dfx.swiss/v1/asset");
    const data = yield response.json();
    allAssets = data;
    const blockchains = [...new Set(allAssets.map(a => a.blockchain))];
    const select = document.getElementById("filter");
    blockchains.forEach(blockchain => {
        const option = document.createElement("option");
        option.value = blockchain;
        option.textContent = blockchain;
        select.appendChild(option);
    });
    document.getElementById("total-assets").textContent =
        String(allAssets.length);
    document.getElementById("total-blockchains").textContent =
        String(blockchains.length);
    document.getElementById("status").textContent = "Live";
    render();
});
const render = () => {
    const search = document.getElementById("search")
        .value.toLowerCase();
    const filter = document.getElementById("filter")
        .value;
    const filtered = allAssets.filter(asset => {
        const matchesSearch = asset.uniqueName.toLowerCase().includes(search);
        const matchesFilter = filter === "all" || asset.blockchain === filter;
        return matchesSearch && matchesFilter;
    });
    const grid = document.getElementById("grid");
    grid.innerHTML = filtered.map(asset => `
    <div class="asset-card">
      <div class="asset-name">${asset.uniqueName}</div>
      <div class="asset-blockchain">${asset.blockchain}</div>
    </div>
  `).join("");
};
fetchAssets();
