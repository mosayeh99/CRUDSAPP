let title = document.querySelector('.title');
let price = document.querySelector('.price');
let taxes = document.querySelector('.taxes');
let ads = document.querySelector('.ads');
let discount = document.querySelector('.discount');
let total = document.querySelector('.total span');
let count = document.querySelector('.count');
let category = document.querySelector('.category');
let createbtn = document.querySelector('.create');
let alert = document.querySelectorAll('.productinputs .alert');
let search = document.querySelector('.search');
let clearsearch = document.querySelector('.clearsearch');
let searchtitlebtn = document.querySelector('.searchbytitle');
let searchcatbtn = document.querySelector('.searchbycat');
let delall = document.querySelector('.delall');
let prodtablehead = document.querySelector('thead');
let allproductsdiv = document.querySelector('.allproducts');
let scrollbtn = document.querySelector('.scrollbtn');

let mood ='create';
let checkvalues = 'error';
let finalprice;
let updateindex = '';
let searchby = 'title';

// ----------- define products array ------------
let prodarray;
if (localStorage.products != null) {
    prodarray = JSON.parse(localStorage.products);
}else {
    prodarray = [];
}

// ----------- onclick on create button ------------
let product;
createbtn.onclick = () => {
    if (title.value != "" && price.value != "" && category.value != "" && finalprice > 0) {
        /* 
        --- storage data in object
        --- add objects in product array
        --- create localStorage key and add arry in it
        */
        product = {
            title: title.value.trim().toLowerCase(),
            price: price.value,
            taxes: taxes.value || 0,
            ads: ads.value || 0,
            discount: discount.value || 0,
            total: total.innerHTML,
            category: category.value.trim().toLowerCase(),
        }

        if (checkvalues == 'success') {
            if (mood == 'create') {
                console.log(checkvalues);
                if (count.value > 0) {
                    for (let i=0; i<count.value; i++){
                        prodarray.push(product);
                    }
                } else {
                    prodarray.push(product);
                }
            } else {
                prodarray[updateindex] = product;
                mood = "create";
                count.parentElement.style.display = "block";
                category.parentElement.style.flexBasis = "calc(50% - 15px)";
                createbtn.value = "Create";
            }
            clearInputs();
        }
        localStorage.setItem('products', JSON.stringify(prodarray));
        showdata();
        calcTotal();
        productcount();
        prodsearch();
    } else {
        if (title.value == "") {
            title.nextElementSibling.style.display = "block";
        }
        if (price.value == "") {
            price.nextElementSibling.nextElementSibling.style.display = "block";
        }
        if (category.value == "") {
            category.nextElementSibling.style.display = "block";
        }
    }
}

document.addEventListener('keyup', (e) => {
    if (e.target.classList.contains('noletter') == true) {
        console.log('success1');
        if (Number.isNaN(+e.target.value)) {
            console.log('success2');
            checkvalues = 'error';
            e.target.nextElementSibling.style.display = "block";
        } else {
            checkvalues = 'success'
            e.target.nextElementSibling.style.display = "none";
        }
    }
    if (e.target.classList.contains('noempty') == true) {
        e.target.nextElementSibling.style.display = "none";
    }
    if (e.target.classList.contains('price') == true) {
        e.target.nextElementSibling.nextElementSibling.style.display = "none";
    }
    if (finalprice < 0) {
        total.parentElement.nextElementSibling.style.display = "block";
    }else {
        total.parentElement.nextElementSibling.style.display = "none";
    }
})


// ----------- calc the final price of product ------------
calcTotal();
function calcTotal() {
    finalprice = +price.value + +taxes.value + +ads.value - +discount.value;
    if (Number.isNaN(finalprice) == true) {
        total.innerHTML = 0;
    }else {
        total.innerHTML = finalprice;
    }
}

// ----------- clear input filds ------------
function clearInputs() {
    title.value = "";
    price.value = "";
    taxes.value = "";
    ads.value = "";
    discount.value = "";
    count.value = "";
    category.value = "";
}

// ----------- show data in html ------------
showdata();
function showdata() {
    let table = '';
        for (let i=0; i<prodarray.length; i++) {
            table += `
            <tr>
                <td id="id">${i + 1}</td>
                <td id="title">${prodarray[i].title}</td>
                <td id="price">${prodarray[i].price}</td>
                <td id="taxes">${prodarray[i].taxes}</td>
                <td id="ads">${prodarray[i].ads}</td>
                <td id="discount">${prodarray[i].discount}</td>
                <td id="total">${prodarray[i].total}</td>
                <td id="category">${prodarray[i].category}</td>
                <td id="update" onclick="update(${i})"><button>Update</button></td>
                <td id="delete" onclick="delproduct(${i})"><button>Delete</button></td>
            </tr>
            `
        }
    document.querySelector('tbody').innerHTML = table;
}

// ------------- Delete All Button -----------
productcount();
function productcount() {
    if (prodarray.length > 0) {
        delall.value = `Delete All (${prodarray.length})`;
        delall.style.display = "block";
        search.parentElement.style.display = "block";
        searchcatbtn.style.display = "block";
        searchtitlebtn.style.display = "block";
        prodtablehead.style.visibility = "visible";
        allproductsdiv.style.overflowX = "auto";
    } else {
        delall.style.display = "none";
        search.parentElement.style.display = "none";
        searchcatbtn.style.display = "none";
        searchtitlebtn.style.display = "none";
        prodtablehead.style.visibility = "hidden";
        allproductsdiv.style.overflowX = "hidden";
    }
}

delall.onclick = () => {
    localStorage.clear();
    prodarray = [];
    showdata();
    productcount();
}

// ------------- Delete Product Button -----------
function delproduct(i) {
    prodarray.splice(i,1);
    localStorage.setItem('products', JSON.stringify(prodarray));
    showdata();
    productcount();
}

// ------------- Update Product Button -----------
function update(i) {
    title.value = prodarray[i].title;
    price.value = prodarray[i].price;
    taxes.value = prodarray[i].taxes;
    ads.value = prodarray[i].ads;
    discount.value = prodarray[i].discount;
    count.parentElement.style.display = "none";
    category.parentElement.style.flexBasis = "100%";
    category.value = prodarray[i].category;
    createbtn.value = "Update";
    calcTotal();
    mood = 'update';
    updateindex = i;
    scrollup();
}

// ------------- ScrollUp Button -----------
window.onscroll = () => {
    if (window.scrollY > 600) {
        scrollbtn.style.display = "block"
    } else {
        scrollbtn.style.display = "none"
    }
}

function scrollup() {
    window.scrollTo ({
        top: 0,
        behavior: "smooth"
    })
}

// ------------- search -----------
clearsearch.onclick = () => {
    search.value = "";
    clearsearch.style.display = 'none';
    showdata();
}

searchtitlebtn.onclick = () => {
    searchby = 'title';
    search.placeholder = 'Search By Title';
    prodsearch();
}
searchcatbtn.onclick = () => {
    searchby = 'category';
    search.placeholder = 'Search By Category';
    prodsearch();
}

function prodsearch() {
    let table = '';
    for (let i=0; i<prodarray.length; i++){
        if (searchby == 'title') {
            if (prodarray[i].title.includes(search.value.toLowerCase())) {
                table += `
                <tr>
                    <td id="id">${i + 1}</td>
                    <td id="title">${prodarray[i].title}</td>
                    <td id="price">${prodarray[i].price}</td>
                    <td id="taxes">${prodarray[i].taxes}</td>
                    <td id="ads">${prodarray[i].ads}</td>
                    <td id="discount">${prodarray[i].discount}</td>
                    <td id="total">${prodarray[i].total}</td>
                    <td id="category">${prodarray[i].category}</td>
                    <td id="update" onclick="update(${i})"><button>Update</button></td>
                    <td id="delete" onclick="delproduct(${i})"><button>Delete</button></td>
                </tr>
                `
            }
        } else if (prodarray[i].category.includes(search.value.toLowerCase())) {
            console.log('i am here');
            table += `
            <tr>
                <td id="id">${i + 1}</td>
                <td id="title">${prodarray[i].title}</td>
                <td id="price">${prodarray[i].price}</td>
                <td id="taxes">${prodarray[i].taxes}</td>
                <td id="ads">${prodarray[i].ads}</td>
                <td id="discount">${prodarray[i].discount}</td>
                <td id="total">${prodarray[i].total}</td>
                <td id="category">${prodarray[i].category}</td>
                <td id="update" onclick="update(${i})"><button>Update</button></td>
                <td id="delete" onclick="delproduct(${i})"><button>Delete</button></td>
            </tr>
            `
        } 
    }
    document.querySelector('tbody').innerHTML = table;

    if (search.value != "") {
        clearsearch.style.display = 'block';
    }
}