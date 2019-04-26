$(document).ready(() => {

            let object;
            $.getJSON('drevo5.json', data => {

                        object = data;
                        let parent = '.block'
                        let itemid;
                        object = object.info;

                        $('.next').click(function() {
                                    let data = $(this).attr('data-id');
                                    let next_id = $(`#${data}`).next().attr('id');
                                    if (next_id) {
                                        $(`a[data-block="${next_id}"]`).click();
                                        $(this).attr('data-id', next_id)
                                    } else {
                                        $(`a[data-target="${$(`#${data}`).parent().next().attr('id')}_toggle"]`).click();
                    next_id = $(`#${data}`).parent().next().children().attr('id');
                    $(`a[data-block="${next_id}"]`).click();

                    $(this).attr('data-id', next_id)
                }
            })

        // radioyes, radiono START
        $(document).on('change', 'div.radio_yes input[type="radio"]', function () {
            let name = $(this).attr('name');

            if ($(this).is(':checked')) {
                $(this).parent().addClass('checked_radio');
                $(`input[name="${name}"].radio_no`).parent().removeClass('checked_radio')
            }
        })
        $(document).on('change', 'div.radio_no input[type="radio"]', function () {
            let name = $(this).attr('name');
            // console.log('no')
            if ($(this).is(':checked')) {
                $(this).parent().addClass('checked_radio');
                $(`input[name="${name}"].radio_yes`).parent().removeClass('checked_radio')
            }
        })
        // radioyes, radiono END
        const form_add = (form) => {
            form.find('input').each(function () {
                let name, val, obj;
                //  console.log('added')
                if ($(this).attr('type') == "radio") {
                    if ($(this).is(":checked")) {
                        name = $(this).attr('id');
                        val = $(this).val();
                        type = $(this).attr('type');

                        obj = {
                            "name": name,
                            "value": val,
                            "type": type
                        };
                        object_array.push(obj);
                        $(this).prop('checked', false);
                        $(this).parent().find('.hidden_block').hide()


                    }
                } else if ($(this).attr('type') == "text") {
                    if ($(this).val().length > 0) {
                        name = $(this).attr('id');
                        val = $(this).val();
                        type = $(this).attr('type');

                        obj = {
                            "name": name,
                            "value": val,
                            "type": type
                        };
                        object_array.push(obj);
                        $(this).val('');

                    }
                } else if ($(this).attr('type') == "checkbox") {
                    if ($(this).is(":checked")) {

                        name = $(this).attr('id');
                        val = $(this).val();
                        type = $(this).attr('type');

                        obj = {
                            "name": name,
                            "value": val,
                            "type": type
                        };
                        object_array.push(obj);
                        $(this).prop('checked', false);
                        $(this).parent().find('.hidden_block').hide()
                    }
                }

            })
        };
        $(document).on('click', '.active_block_tabs div button', function (e) {
            e.preventDefault()
            e.stopImmediatePropagation();
            let form = $(`#${$('.opened').attr('id')}`);
            let target_name = $(this).attr('data-class');

            let to_save_id = $('.active_tab').attr('data-class')

            document.querySelector('.active_block_tabs div .active_tab').classList.remove('active_tab')
            e.target.classList.add('active_tab');

            let to_save_id_key, target_name_key, target_name_index, to_save_id_index;

            for (let i = 0; i < incomes_parent.length; i++) {
                let key = Object.keys(incomes_parent[i])[0];
                if (key == target_name) {
                    target_name_key = true;
                    target_name_index = i;
                } else if (key == to_save_id) {
                    to_save_id_key = true;
                    to_save_id_index = i;
                }
            }
            if ((target_name_key == true) && (to_save_id_key == undefined)) {
                object_array = [];

                form_add(form)

                object_income = {
                    [to_save_id]: object_array
                }
                incomes_parent.push(object_income);

                incomes_parent[target_name_index][target_name].forEach((item, i) => {
                    if (item.type == "radio" || item.type == 'checkbox') {
                        $(`#${item.name}`).click();
                    } else if (item.type == "text") {
                        $(`#${item.name}`).val(item.value);
                    } 
                })
            } else if ((target_name_key == true) && (to_save_id_key == true)) {
                object_array = [];

                form_add(form)

                object_income = {
                    [to_save_id]: object_array
                }
                incomes_parent.push(object_income);
                incomes_parent[target_name_index][target_name].forEach((item, i) => {
                    if (item.type == "radio" || item.type == 'checkbox') {
                        $(`#${item.name}`).click();
                    } else if (item.type == "text") {
                        $(`#${item.name}`).val(item.value);
                    }
                })

                incomes_parent.splice(to_save_id_index, 1);

                if (delete_item == true) {
                    for (let i = 0; i < incomes_parent.length; i++) {
                        let key = Object.keys(incomes_parent[i])[0];
                        if (key == to_save_id) {
                            to_save_id_index_new = i;
                        }

                    }
                    incomes_parent.splice(to_save_id_index_new, 1);
                    delete_item = false;
                    $(`[data-class="${to_save_id}"]`).remove()
                } else if (delete_item_for_last == true) {
                    incomes_parent.splice(to_save_id_index, 1);
                }
            }
        })


        // block generation START
        object.forEach(item => {
            if (item.type == "Title_name") {
                $(parent).append(`<div class='child' id='${item.id}'></div>`);

                itemid = item.id;
                gen(item);
            }
        })

        function gen(block) {
            block.children.forEach(item => {
                if (item.type == "Block_name") {
                    if (item.class == "change") {
                        $(`#${itemid}`).append(`<div class='child blockname' id='${item.id}'><div class='change_input_parent'><input type='text' id='header_${item.id}' class='change_input_header change${item.id}' value='Доход'></div></div>`);

                    } else {
                        $(`#${itemid}`).append(`<form action='' class='child blockname' id='${item.id}'></form>`);
                    }
                    parentid = item.id
                    parent_id_block = item.id
                    gen_elements(item)
                }
            })
        }

        function gen_elements(block) {
            let i = 0;

            block.children.forEach(item => {
                if (item.type == "text_input") {

                    $(`#${parentid}`).append(`<div class='input_form ${item.class.split(' ')[1]}' id='parent_${item.id}' ><label for='${item.id}'>${item.label}</label><div class='input_row ${item.class}'><input name='${item.id}' type='text' id='${item.id}' placeholder='${item.placeholder}' class='${item.class}'><p class='type_tips'>${item.description}</p></div></div>`);
                }
                if (item.type == "tabs") {
                    $('.tabs-block').append(`<div class="tabs tabs_${item.class}"><div><button class="tab active_tab" data-class="${item.class}1">Доход 1</button></div><button class="add_income_button add" data-counter="1" data-class=${item.class}>+</button></div>`)

                }
                if (item.type == "button") {

                    $(`#${parentid}`).append(`<div class='add_income ${item.id}_income ${item.class}'><button type='button' id='${item.id}' class='${item.class}'>${item.label}</button><button  id='${item.id}_delete' class='delete_item'>Удалить доход</button></div>`);
                }

                if (item.type == "radio_input") {
                    $(`#${parentid}`).append(`<div class='radio_input_block ${item.class}' id='parent_${item.id}'><label for='${item.id}${i}'><input type='radio' name='${item.id.slice(0, -1)}' data-event='${item.event}' id='${item.id}${i}' class='${item.class}' value='${item.label}'><span></span>${item.label}</label></div>`);

                    if (i < 10) {
                        i++;
                    } else {
                        i = 0;

                    }
                    gen(item)
                }
                if (item.type == "checkbox_input") {

                    $(`#${parentid}`).append(`<div class='checkbox_input_block' id='parent_${item.id}'><label for='${item.id}${i}'><input type='checkbox' name='${item.id.slice(0, -1)}' data-show='${item.event}' id='${item.id}${i}' class='${item.class}'><span></span>${item.label}</label></div>`);
                }
                if (item.type == "subtitle") {

                    $(`#${parentid}`).append(`<h3 id='${item.id}'>${item.label}</h3>`);
                }


            })

        }

        function gen_hidden_elements(block) {
            let i = 0;

            block.children.forEach(item => {
                if (item.type == "text_input") {

                    $(`#${hidden_block}`).append(`<div class='input_form' id='parent_${item.id}'><label for='${item.id}'>${item.label}</label><div class='input_row ${item.class}'><input  name='${item.id}' type='text' id='${item.id}' placeholder='${item.placeholder}' class='${item.class}'><p class='type_tips'>${item.description}</p></div></div>`);
                }
                if (item.type == "file_input") {

                    $(`#${hidden_block}`).append(`<div class='file_input' id='parent_${item.id}'><label for='${item.id}'>Обзор...</label><input type='file' id='${item.id}' class='${item.class}'><a class='filename'>Файл не выбран...</a></div>`);
                }
                if (item.type == "radio_input") {

                    $(`#${hidden_block}`).append(`<div class='radio_input_block ${item.class}' id='parent_${item.id}'><label for='${item.id}${i}'><input type='radio' name='${item.id.slice(0, -1)}' data-event='${item.event}' id='${item.id}${i}' class='${item.class}' value='${item.label}'><span></span>${item.label}</label></div>`);
                    if (i < 10) {
                        i++;
                    } else {
                        i = 0;

                    }
                }

                if (item.type == "checkbox_input") {

                    $(`#${hidden_block}`).append(`<div class='checkbox_input_block' id='parent_${item.id}'><label for='${item.id}${i}'><input type='checkbox' name='${item.id.slice(0, -1)}' data-show='${item.event}' id='${item.id}${i}' class='${item.class}'><span></span>${item.label}</label></div>`);
                }
                if (item.type == "subtitle") {
                    // console.log('sub')
                    $(`#${hidden_block}`).append(`<h3  id='${item.id}'>${item.label}</h3>`);
                }


            })

        }
        // block generation END


        // tips START
        $('.toggle_tips').click(function () {
            $('.type_tips').toggle();
            $(this).toggleClass('show_tips');
            if ($(this).hasClass('show_tips')) {
                $(this).text('Выкл. подсказки')
            } else {
                $(this).text('Вкл. подсказки')

            }
        })
        // tips end


        // Input_file_change START
        $(document).on('change', 'input[type="file"]', function (item) {
            $(this).parent().find('.filename').text(this.files[0].name)
        })
        // Input_file_change END


        // change for hidden_block START
        $(document).on('change', 'input[type="radio"]', function () {
            $(this).parent().parent().parent().find('.hidden_block').hide().find('input[type="radio"]').prop('checked', false);
            $(this).parent().parent().parent().find('.hidden_block').find('input[type="text"]').val('');
console.log('go')
            if ($(this).attr('data-target')) {

                // console.log($(this).attr('data-target'))
                $(`#${$(this).attr('data-target')}`).show()
            } else {

                if ($(this).attr('data-event') == "open_child") {
                    wantedid = $(this).attr('id').slice(0, -1);
                    console.log(wantedid)
                    radio = $(this).attr('id');
                    $(this).removeAttr('data-event');
                    traverse(object, wantedid);
                }
            }


        })

        $(document).on('change', '.block input[type="checkbox"]', function () {
            if ($(this).attr('data-show')) {

                if ($(this).is(':checked')) {
                    wantedid = $(this).attr('id').slice(0, -1);
                    radio = $(this).attr('id');
                    $(this).attr('data-toggle', $(this).attr('data-show'));
                    $(this).removeAttr('data-show')
                    traverse(object, wantedid);
                }
            } else if ($(this).attr('data-toggle').length > 0) {
                // console.log(kek)
                if ($(this).is(':checked')) {
                    toggleid = $(this).attr('data-toggle')
                    $(`#${toggleid}`).show();
                    // console.log('show')
                } else {
                    toggleid = $(this).attr('data-toggle')

                    $(`#${toggleid}`).hide();

                }
            } else {}

        })


        function traverse(obj, wanted_id) {
            obj.forEach(function(item) {
                //  console.log('ga')
                if (typeof(item.children) == "object") {
                    traverse(item.children);
                    if ((item.id == wantedid) && (item.children.length > 0)) {

                        if (item.children[0].type == "hidden_block") {
                            // console.log(item.children[0].type)
                            // console.log(item.children[0].id)
                            $('#' + radio).attr('data-target', item.id).parent().append("<div class='hidden_block' id='" + item.id + "'><h3 class='hidden_h3'>" + item.label + "</h3></div>");
                            hidden_block = item.id;
                            gen_hidden_elements(item.children[0]);
                        }
                    }
                }
            })
        }

        // change for hidden_block END
 

        // income_tabs START
        let incomes_parent = [];
        let incomes_counter;
        let object_array = [];
        let object_income;
        let delete_item, delete_item_for_last;
        $(document).on('click', '.delete_item', () => {
            let to_save_id = $('.active_tab').attr('data-class')
            let to_save_id_key;
            for (let i = 0; i < incomes_parent.length; i++) {
                let key = Object.keys(incomes_parent[i])[0];
                if (key == to_save_id) {
                    to_save_id_key = true;
                    to_save_id_index = i;
                }
            }

            let index = parseInt($('.active_tab').index());
            let last_index = parseInt($('.active_block_tabs .tab:last-child').index())

            if (to_save_id_key == true) {
                if (index != last_index) {
                    delete_item = true;
                    $('.active_block_tabs .tab:last-child').click();
                }
            } else {
                if (index == last_index) {
                    delete_item_for_last = true;
                    $('.active_block_tabs .tab:last-child').prev().click();
                    $('.active_block_tabs .tab:last-child').remove()
                }
            }
        })
        $(document).on('click', '.tabs-block .add', function () {
            let data_class = $(this).attr('data-class')
            $(`#${data_class}_add_income`).click();
        })
        $(document).on('click', '.add_income .add', function () {
            let form = $(`#${$('.opened').attr('id')}`);
            incomes_counter = parseInt($('.active_block_tabs .add').attr('data-counter'))

            let input_name = $(this).parent().parent().find('.change_input_header').val();

            let object_array = [];
            let to_save_id = $('.active_tab').attr('data-class')

            let to_save_id_key, to_save_id_index;
            for (let i = 0; i < incomes_parent.length; i++) {
                let key = Object.keys(incomes_parent[i])[0];
                if (key == to_save_id) {
                    to_save_id_key = true;
                    to_save_id_index = i;
                }
            }
            

            if (to_save_id_key == true) {
                object_array = [];
                let form = $(`#${$('.opened').attr('id')}`);

                let input_name = form.find('.change_input_header').val();

                form_add(form)
                
                object_income = {
                    [to_save_id]: object_array
                }
                incomes_parent.push(object_income);

                incomes_parent.splice(to_save_id_index, 1);

                incomes_counter++;
                $('.active_block_tabs .add').attr('data-counter', incomes_counter)
                let block_name = form.attr('id')
                $('.active_tab').removeClass('active_tab')
                $(`.tabs_${block_name} div`).append(`<button class="tab active_tab"  data-class="${block_name}${incomes_counter}">${input_name != `Доход ${parseInt(incomes_counter) - 1}` ? input_name : "Новый доход"}</button>`)
                $(this).parent().parent().find('.change_input_header').val('Новый доход').click();
            } else {

                form_add(form)

                object_income = {
                    [form.attr('id') + incomes_counter]: object_array
                }
                incomes_parent.push(object_income);

                incomes_counter++;
                $('.active_block_tabs .add').attr('data-counter', incomes_counter)
                let block_name = form.attr('id')
                // console.log();
                $('.active_tab').removeClass('active_tab')
                $(`.tabs_${block_name} div`).append(`<button class="tab active_tab"  data-class="${block_name}${incomes_counter}">${input_name != `Доход ${parseInt(incomes_counter) - 1}` ? input_name : "Новый доход"}</button>`)


                $('body').on('click', '.add_income_button', () => {
                    $('.opened .change_input_header').focus()
                })

                $(this).parent().parent().find('.change_input_header').val('Новый доход').focus();


            }

        })


    });

    $(document).on('keyup', '.change_input_header', function () {
        $('.active_block_tabs .active_tab').text($(this).val())
    })
    // income_tabs END

    // Side_bar toggle START
    $('.side-bar .accordeon_open').click(function () {

        let attr = $(this).data('target');
        if ($(this).hasClass('active-link')) {
            $(`.${attr}`).slideToggle();
            $(this).removeClass('active-link')

        } else {
            $(this).parent().find('.toggle').hide();
            $(this).parent().find('.accordeon_open').removeClass('active-link')
            $(`.${attr}`).slideToggle();
            $(this).toggleClass('active-link')
        }
    })

    $('.side-bar .toggler').click(function () {
        $('.main_title h3').text($(this).parent().parent().data('name'))

        $('.blockname').hide();
        let datablock = $(this).data('block');
        let subtitle = $(this).text();
        $('.category h3').text(subtitle);
        $('.next').attr('data-id', datablock)
        $(this).parent().addClass('checked_div')
        $('.tabs').hide().removeClass('active_block_tabs');
        $('.opened').removeClass('opened')
        if (datablock == "standart") {
            $('.tabs_standart').show().addClass('active_block_tabs');
            $('.tabs .tab[data-class="standart1"]').addClass('active_tab')
            $('#standart').addClass('opened')
        } else if (datablock == "vznosi") {
            $('#vznosi').addClass('opened')
            $('.tabs_vznosi').show().addClass('active_block_tabs');
            $('.tabs .tab[data-class="vznosi1"]').addClass('active_tab')
        } else if (datablock == "tovarishch") {
            $('.tabs .tab[data-class="tovarishch"]').addClass('active_tab')
            $('#tovarishch').addClass('opened')
            $('.tabs_investition').show().addClass('active_block_tabs')
        }
        $(`#${datablock}`).show();
        $('.toggle_parent input').attr('data-check', datablock)
        $('.side-bar a').removeClass('active_toggler')
        $(this).addClass('active_toggler');
        if (!($(`input[data-block="${datablock}"]`).is(':checked'))) {
            $(`input[data-block="${datablock}"]`).click();
        }
    })
    $('.toggle_parent .checkbox').change(function () {
        let attr = $(this).attr('data-check')

        if ($(this).is(':checked')) {

            $(`.side-bar input[data-block="${attr}"]`).click();

        } else {

            $(`.side-bar input[data-block="${attr}"]`).click();

        }
    })
    // Side_bar toggle END

    const click = () => {
        $('a[data-block="Taxpayer_Information"]').click()
    };

    // other
    $('a[data-target="Information_toggle"]').click();
    setTimeout(click, 100)


})