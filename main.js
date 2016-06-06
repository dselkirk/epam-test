window.table_item = [];
window.filter='';

function initItem() {
    if (isCorrect()) {
            var item = {
                name: $('#name').val(),
                count: Number($('#count').val())
            };
        if ($('#price').val().substr(0, 1) == '$'){
            item['price']=Number(reverseConvert($('#price').val()));
        } else {
            item['price']=Number($('#price').val());
            }
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
        $('#nameFormGroup').addClass('has-error');
    }
    else if ($('#name').val().length > 15) {
        $('#error').text('Максимальная длина 15 символов!');
        $('#nameFormGroup').addClass('has-error');
    }
    else {
        flag = true;
        $('#error').text('');
        $('#nameFormGroup').removeClass('has-error');
    }

    return flag;
}


function drowNewRow(num) {
    //console.log('draw' + num);
    if (table_item[num] === undefined) {
        return;
    }
    if (table_item[num].name.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
        $('tbody').append(
            "<tr id='tr" + num + "''><td>" + table_item[num].name + "<span class='pull-right'>" + table_item[num].count + "</span></td><td>"
            + convert(table_item[num].price) + "</td><td>" +
            "<input id='edit" + num + "' type='submit' value='Edit' class='btn btn-success'>" +
            "<input id='delete" + num + "'type='submit' value='Delete' class='btn btn-danger'></td></tr>"
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
        $('#price').val(convert(table_item[num].price));
        isCorrect();
        if ($('#add').val() == "Update") {
            $('#add').unbind('click');
            $('#add').click(function () {
                if (isCorrect()) {
                    delete table_item[num];
                    $('#tr' + num + '').remove();
                    initItem();
                    $('#name').val('');
                    $('#count').val('');
                    $('#price').val('');
                    $('#add').unbind('click');
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
function eventReverseSort(id, compare) {
    $(id).unbind('click');
    $(id).click(function () {
        table_item.sort(compare);
        table_item.reverse();
        redraw();
        $(id).css('transform', 'none');
        eventSort(id, compare);
    });
}

//Сортировка прямая
function eventSort(id, compare) {
    $(id).unbind('click');
    $(id).click(function () {
        table_item.sort(compare);
        redraw();
        $(id).css('transform', 'rotate(180deg)');
        eventReverseSort(id, compare);
    });
}

function eventFilter() {
    $('#fltr').click(function () {
        //if ($('filter').val()==''){
        //    return;
        //}
        filter=$('#filter').val();
        redraw();
    })
}

function convert(price) {
    var money = '$' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return money;
}

function reverseConvert(money) {
    if (money.substr(0, 1) == '$' && money !== undefined) {
        var price = money.substr(1);
        return price.replace(/,/g, '');
    } else {
        return '';
    }

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

$('#count').keyup(function () {
    var val = $('#count').val().replace(/\D/g, '');
    $('#count').val(val);
});

$('#price').keyup(function () {
    var val = $('#price').val().replace(/[^\d\.]/g, '');
    $('#price').val(val);
});

//событие для конвертации
$('#price').blur(function () {
    $('#price').val(convert(Number($('#price').val())));
});

$('#price').focus(function () {
    $('#price').val(reverseConvert($('#price').val()));
});

//$('#name').keyup(function () {
//    $('#error').text('');
//    $('#nameFormGroup').removeClass('has-error');
//});

eventSort('#srt1', compareItemName);
eventSort('#srt2', compareItemPrice);
eventFilter();
