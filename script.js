
// MENCARI SEMUA TOMBOL PESAN
const buttons = document.querySelectorAll(".order-btn");

// MEMBERIKAN AKSI KETIKA DIKLIK
buttons.forEach(function(button) {

    button.addEventListener("click", function() {

        const product = button.dataset.product;

        const phone = "6285181607787";

        const message = "Halo KOPI RIMBA, saya ingin memesan " + product;

        const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);

        window.open(url, "_blank");

    });
});

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

menuToggle.addEventListener("click", function() {
    navMenu.classList.toggle("active");
});

// SCROLL ANIMATION

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(function(entries) {

    entries.forEach(function(entry) {

        if (entry.isIntersecting) {

            entry.target.classList.add("active");

        }

    });

});

reveals.forEach(function(element) {

    observer.observe(element);

});

// BACK TO TOP

const backToTop = document.querySelector("#backToTop");

// MUNCUL KETIKA SCROLL
window.addEventListener("scroll", function() {

    if (window.scrollY > 300) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }

});

// KEMBALI KE ATAS
backToTop.addEventListener("click", function() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

// NAVBAR SCROLL EFFECT

const navbar = document.querySelector(".navbar");

if (navbar) {

    window.addEventListener("scroll", function() {

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    });

}


// SHOPPING CART

let cart = JSON.parse(localStorage.getItem("kopiRimbaCart")) || [];

const addCartButtons = document.querySelectorAll(".add-cart"); 

const cartCount = document.querySelector("#cart-count");
const cartCountDisplay = document.querySelector("#cart-count-display");
const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");

const checkoutBtn = document.querySelector("#checkout-btn");
const checkoutSummary = document.querySelector("#checkout-summary");
const orderDetails = document.querySelector("#order-details");
const orderTotal = document.querySelector("#order-total");

// TAMBAH PRODUK

addCartButtons.forEach(function(button) { 
  

    button.addEventListener("click", function() {

        const product = button.dataset.product;
        const price = Number(button.dataset.price);

        if (!product || !Number.isFinite(price)) {
            console.error("Produk tidak valid!");
            return;
        }

        const existingItem = cart.find(function(item) {
            return item.name === product;
        });

        if (existingItem) {
            existingItem.qty++;
        } else {
            cart.push({
                name: product,
                price: price,
                qty: 1
            });
        }

        updateCart();
        showCartToast();

        const cartButton = document.querySelector(".cart-button");

        cartButton.classList.remove("bounce");

        void cartButton.offsetWidth;

        cartButton.classList.add("bounce");

    });

});

// UPDATE KERANJANG

function updateCart() {

  localStorage.setItem("kopiRimbaCart", JSON.stringify(cart));

    if (!cartCount || !cartItems || !cartTotal) {
        console.error("Elemen keranjang tidak ditemukan!");
        return;
    }

    const jumlahBarang = cart.reduce(function(sum, item) {
        return sum + item.qty;
    }, 0);

    cartCount.textContent = jumlahBarang;

    if (cartCountDisplay) {
        cartCountDisplay.textContent = jumlahBarang;
    }
cartCount.classList.remove("cart-count-pop");
cartCountDisplay.classList.remove("cart-count-pop");

void cartCount.offsetWidth;

cartCount.classList.add("cart-count-pop");
cartCountDisplay.classList.add("cart-count-pop");
    cartItems.innerHTML = "";

   if (cart.length === 0) {
    cartItems.textContent = "Belum ada produk.";

    checkoutBtn.disabled = true;
    checkoutBtn.textContent = "KERANJANG KOSONG";

} else {

    checkoutBtn.disabled = false;
    checkoutBtn.textContent = "CHECKOUT";

}

    cart.forEach(function(item, index) {

        const div = document.createElement("div");

        const nama = document.createElement("span");

        nama.textContent = item.name + " - Rp" +
            item.price.toLocaleString("id-ID");

        const minus = document.createElement("button");
        minus.textContent = "-";

        minus.addEventListener("click", function() {

            if (item.qty > 1) {
                item.qty--;
            } else {
                cart.splice(index, 1);
            }

            updateCart();

        });

        const jumlah = document.createElement("span");
        jumlah.textContent = item.qty;

        const plus = document.createElement("button");
        plus.textContent = "+";

        plus.addEventListener("click", function() {
            item.qty++;
            updateCart();
        });

        const hapus = document.createElement("button");
        hapus.textContent = "HAPUS";

        hapus.addEventListener("click", function() {
            cart.splice(index, 1);
            updateCart();
        });

        div.appendChild(nama);
        div.appendChild(minus);
        div.appendChild(jumlah);
        div.appendChild(plus);
        div.appendChild(hapus);

        cartItems.appendChild(div);

    });

    const total = cart.reduce(function(sum, item) {
        return sum + (item.price * item.qty);
    }, 0);

    cartTotal.textContent = total.toLocaleString("id-ID");

}

// CHECKOUT

if (checkoutBtn && checkoutSummary && orderDetails && orderTotal) {

    checkoutBtn.addEventListener("click", function() {

      if (cart.length === 0) {
    showNotification("Keranjang masih kosong!", "error");
    return;
}

const yakinCheckout = confirm(
    "Apakah kamu yakin ingin melanjutkan checkout?"
);

if (!yakinCheckout) {
    return;
}

        if (cart.length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }

        checkoutSummary.style.display = "block";
        orderDetails.innerHTML = "";

        cart.forEach(function(item) {

            const div = document.createElement("div");

            div.textContent = item.name +
                " x " + item.qty +
                " = Rp" +
                (item.price * item.qty).toLocaleString("id-ID");

            orderDetails.appendChild(div);

        });

        const total = cart.reduce(function(sum, item) {
            return sum + (item.price * item.qty);
        }, 0);

        orderTotal.textContent =
            "Total Pembayaran: Rp" +
            total.toLocaleString("id-ID");

    });

}

// TAMPILKAN KERANJANG AWAL

updateCart();


const sendOrder = document.getElementById("send-order");

if (sendOrder) {
function showNotification(message, type = "success") {
    const toast = document.getElementById("successToast");

    toast.querySelector("strong").textContent = message;

    toast.classList.remove("show", "error", "success");

    clearTimeout(window.toastTimer);

    void toast.offsetWidth;

    toast.classList.add("show", type);

    window.toastTimer = setTimeout(function() {
        toast.classList.remove("show");
        toast.classList.remove("error", "success");
    }, 3000);
}
}
    sendOrder.addEventListener("click", function() {

        const customerName =
            document.getElementById("customer-name").value.trim();

        const customerPhone =
            document.getElementById("customer-phone").value.trim();

        if (!customerName || !customerPhone) {
            showNotification("Nama dan nomor WhatsApp wajib diisi!", "error");
            return;
            
        }

        if (!/^[0-9]{10,15}$/.test(customerPhone)) {
    showNotification("Nomor WhatsApp harus 10-15 angka!", "error");
    return;
    

    
}


        if (cart.length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }

        let message = "HALO KOPI RIMBA!\n";
        message += "Saya ingin memesan:\n\n";
        message += "Nama: " + customerName + "\n";
        message += "WhatsApp: " + customerPhone + "\n\n";

        cart.forEach(function(item, index) {

            message += (index + 1) + ". ";
            message += item.name + " x " + item.qty;
            message += " = Rp" +
                (item.price * item.qty).toLocaleString("id-ID");
            message += "\n";

        });

        const total = cart.reduce(function(sum, item) {
            return sum + (item.price * item.qty);
        }, 0);

        message += "\nTOTAL: Rp" +
            total.toLocaleString("id-ID");

        const phone = "6285181607787";

        const url = "https://wa.me/" +
            phone + "?text=" + encodeURIComponent(message);

        const sendButton = document.getElementById("send-order");

sendButton.disabled = true;
sendButton.classList.add("loading");
sendButton.textContent = "MEMPROSES...";

window.open(url, "_blank");

setTimeout(function() {
    sendButton.disabled = false;
    sendButton.classList.remove("loading");
    sendButton.textContent = "KIRIM PESANAN";
}, 1500);
        const sudahDikirim = confirm(
    "Apakah pesanan sudah berhasil dikirim melalui WhatsApp?"
);

if (sudahDikirim) {
    cart = [];
    updateCart();

    const successToast = document.getElementById("successToast");

    successToast.classList.add("show");

    setTimeout(function() {
        successToast.classList.remove("show");
    }, 3000);
}

    });



// LEVEL 12 - SEARCH + FILTER MENU

const searchMenu = document.getElementById("searchMenu");
const menuCards = document.querySelectorAll(".menu-card");
const filterButtons = document.querySelectorAll(".filter-btn");

let activeCategory = "all";

function filterMenu() {

    const keyword = searchMenu.value.toLowerCase();

    menuCards.forEach(function(card) {

        const namaMenu = card.textContent.toLowerCase();
        const kategoriMenu = card.dataset.category;

        const cocokNama = namaMenu.includes(keyword);

        const cocokKategori =
            activeCategory === "all" ||
            kategoriMenu === activeCategory;

        if (cocokNama && cocokKategori) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

    const noMenu = document.getElementById("noMenu");

const visibleMenu = Array.from(menuCards).some(function(card) {
    return card.style.display !== "none";
});

noMenu.style.display = visibleMenu ? "none" : "block";

}

// PENCARIAN MENU
searchMenu.addEventListener("input", filterMenu);

// FILTER KATEGORI
filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        activeCategory = button.dataset.category;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        filterMenu();

    });

});

// LEVEL 15 - ANIMASI PRODUK

const productObserver = new IntersectionObserver(function(entries) {

    entries.forEach(function(entry) {

        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }

    });

}, {
    threshold: 0.2
});

menuCards.forEach(function(card) {
    productObserver.observe(card);
});

// LEVEL 17 - FUNGSI NOTIFIKASI

function showCartToast() {

    const cartToast = document.getElementById("cartToast");

    cartToast.classList.add("show");

    setTimeout(function() {
        cartToast.classList.remove("show");
    }, 2500);

}
// LEVEL 18 - BUKA DAN TUTUP KERANJANG

const cartButton = document.querySelector(".cart-button");
const cartBox = document.getElementById("cartBox");
const closeCart = document.getElementById("closeCart");
const cartOverlay = document.getElementById("cartOverlay");

// BUKA KERANJANG
cartButton.addEventListener("click", function() {
    cartBox.classList.add("active");
    cartOverlay.classList.add("active");
});

// TUTUP KERANJANG
closeCart.addEventListener("click", function() {
    cartBox.classList.remove("active");
    cartOverlay.classList.remove("active");
});

const clearCartButton = document.getElementById("clear-cart");

clearCartButton.addEventListener("click", function() {

    if (cart.length === 0) {
        showNotification("Keranjang sudah kosong!", "error");
        return;
    }

    const yakin = confirm("Yakin ingin mengosongkan keranjang?");

    if (yakin) {
        cart = [];
        updateCart();

        showNotification(
            "Semua produk berhasil dihapus!",
            "success"
        );
    }

});

// TUTUP KERANJANG SAAT AREA GELAP DISENTUH
cartOverlay.addEventListener("click", function() {
    cartBox.classList.remove("active");
    cartOverlay.classList.remove("active");
});