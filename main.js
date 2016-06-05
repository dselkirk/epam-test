window.table_item = [];
window.price = 'Price';

function initItem() {
    if (isCorrect()) {
        var item = {
            name: $('#name').val(),
            count: Number($('#count').val()),
            price: Number($('#price').val())
        };

        table_item.push(item);
        drowNewRow(table_item.length - 1);
        addEventDelete(table_item.length - 1);
        addEventEdit(table_item.length - 1);
    }

}

function isCorrect() {
    var pattern = /^[\s]+$/;
    var flag = false;
    if ($('#name').val() == '' || pattern.test(($('#name').val()))) {
        $('#error').text('Поле Name не может быть пустым!');
        $('#name').css('border-color', 'rgb(176,0,0)');
    }
    else if ($('#name').val().length >= 15) {
        $('#error').text('Максимальная длина 15 символов!');
        $('#name').css('border-color', 'rgb(176,0,0)');
    }
    else {
        flag = true;
        $('#error').text('');
        $('#name').css('border-color', 'rgb(238,238,238)');
    }

    return flag;
}


function drowNewRow(num) {
    //console.log('draw' + num);
    if (table_item[num] === undefined) {
        return;
    }
    if (table_item[num].name.toLowerCase().indexOf($('#filter').val().toLowerCase())>=0) {
        $('tbody').append(
            "<tr id='tr" + num + "''><td>" + table_item[num].name + "<span class='pull-right'>" + table_item[num].count + "</span></td><td>"
            + convert(table_item[num].price) + "</td><td><input id='edit" + num + "' type='submit' value='Edit'><input id='delete"
            + num + "'type='submit' value='Delete'></td></tr>"
        );
    }
}

function addEventDelete(num) {
    return $('#delete' + num + '').click(function () {
        var isDelete = confirm('Вы действительно хотите удалить товар?');
        if (isDelete) {
            delete table_item[(num)];
            $('#tr' + num + '').remove();
        }
    });
}

function addEventEdit(num) {
    $('#edit' + num + '').click(function () {
        $('#add').val('Update');
        $('#name').val('' + table_item[num].name);
        $('#count').val('' + table_item[num].count);
        $('#price').val('' + table_item[num].price);
        isCorrect();

        if ($('#add').val() == "Update") {
            $('#add').unbind('click');
            $('#add').click(function () {
                if (isCorrect()) {
                    delete table_item[num];
                    $('#tr' + num + '').remove();
                    initItem();
                }
            });
        }

    });
}

function compareItemName(a, b) {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
}

function compareItemPrice(a, b) {
    return a.price - b.price;
}

function redraw() {
    $('tbody > tr').remove();

    for (var i = 0; i < table_item.length; i++) {
        drowNewRow(i);
        addEventDelete(i);
        addEventEdit(i);
    }

}

//Сортировка обратная
function eventReverseSort(id,compare) {
    $(id).unbind('click');
    $(id).click(function () {
        table_item.sort(compare);
        table_item.reverse();
        redraw();
        $(id).css('transform', 'none');
        eventSort(id,compare);
    });
}

//Сортировка прямая
function eventSort(id,compare) {
    $(id).unbind('click');
    $(id).click(function () {
        table_item.sort(compare);
        redraw();
        $(id).css('transform', 'rotate(180deg)');
        eventReverseSort(id,compare);
    });
}

function eventFilter(){
    $('#fltr').click(function () {
        //if ($('filter').val()==''){
        //    return;
        //}
        redraw();
    })
}

function convert(price) {
    var money = '$' + price.toString().split(/(?=(?:\d{3})+$)/);
    return money;
}

//событие для add
if ($('#add').val() == "Add") {
    $('#add').unbind('click');
    $('#add').click(function () {
        initItem();
    });
}

//событие для addnew
$('#addnew').click(function () {
    $('#add').unbind('click');
    $('#add').val('Add');
    $('#name').val('');
    $('#count').val('');
    $('#price').val('');
    $('#add').click(function () {
        initItem();
    });
});

//событие для конвертации
$('#price').blur(function () {
    window.price = $('#price').val();
    $('#price').val(convert(Number($('#price').val())));
});

$('#price').focus(function () {
    $('#price').val(window.price);
})

eventSort('#srt1',compareItemName);
eventSort('#srt2',compareItemPrice);
eventFilter();
