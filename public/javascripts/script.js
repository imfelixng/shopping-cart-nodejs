$(document).ready(function () {
    
    $('.carousel').carousel();
    $("[rel=tooltip]").tooltip();

    var $container = $('.product-container');
    $container.imagesLoaded( function(){
    	$container.masonry();
    });

        $(".quantity-product").each((i, product) => {
            $(product).change(() => {
                $(".frm-quantity")[i].submit();
            });
        });
    menu();
});

let menu = () => {
    $.ajax({
        url: '/menu',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            let {categories, products} = data;
            let xhtml = (window.location.pathname === '/') ? '<li class="active"><a href="/">Home</a></li>' : '<li><a href="/">Home</a></li>';
            $.each(categories, (key, item) => {
                let pathCategory = window.location.pathname + window.location.search;
                let pathProduct = window.location.pathname;
                let idCategory = parseInt(pathProduct.split('/')[2]);
                if((pathCategory === '/danh-muc?catogery=' + item.id) || (idCategory === item.id)){
                    xhtml += `<li class = "active"><a href="/danh-muc?catogery=${item.id}">${item.name}</a></li>`;
                }else{
                    xhtml += `<li ><a href="/danh-muc?catogery=${item.id}">${item.name}</a></li>`;
                }
            });
            $('.nav-menus .nav-pills').html(xhtml);
        }
    });
}

let categories = () => {
    $.ajax({
        url: '/danh-muc'
    })
}