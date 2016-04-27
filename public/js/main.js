'use strict';

$(document).ready(function() {
    $('.add-room').submit(addRoom);
    $('.rooms-list').on('click', '.delete-room', deleteRoom);
    $('.rooms-list').on('click', '.edit-room', editRoom);
    $('.edit-room-form').submit(saveRoom);

    $('.add-category').submit(addCategory);
    $('.categories-list').on('click', '.delete-category', deleteCategory);
    $('.categories-list').on('click', '.edit-category', editCategory);
    $('.edit-category-form').submit(saveCategory);

    $('#item-room').val('');
    $('#item-category').val('');

    $('.add-item').submit(addItem);
    $('.items-list').on('click', '.delete-item', deleteItem);
    $('.items-list').on('click', '.edit-item', editItem);
    $('.edit-item-form').submit(saveItem);
});

function addRoom(event) {
    event.preventDefault();

    var room = {
        name: $('#room-name').val()
    };

    $('#room-name').val('');

    $.ajax({
        url: '/api/rooms',
        method: 'POST',
        data: room,
        success: function(newRoom) {
            var $room = $('.room-template').clone();
            $room.removeClass('room-template');

            $room.find('.room-name').text(newRoom[0].name);
            $room.find('.room-value').addClass(newRoom[0].id);
            $room.find('.edit-room').attr('data-id', newRoom[0].id);
            $room.find('.delete-room').attr('data-id', newRoom[0].id);

            $('.rooms-list').append($room);

            var $itemRoom = $('<option>').val(newRoom[0].id).text(newRoom[0].name);

            $('#item-room').append($itemRoom);
            $('#item-room').val('');
        },
        error: function(err) {
            console.error('error:', err);
        }
    });
}

function addCategory(event) {
    event.preventDefault();

    var category = {
        name: $('#category-name').val()
    };

    $('#category-name').val('');

    $.ajax({
        url: '/api/categories',
        method: 'POST',
        data: category,
        success: function(newCategory) {
            var $category = $('.category-template').clone();
            $category.removeClass('category-template');

            $category.find('.category-name').text(newCategory[0].name);
            $category.find('.category-value').addClass(newCategory[0].id);
            $category.find('.edit-category').attr('data-id', newCategory[0].id);
            $category.find('.delete-category').attr('data-id', newCategory[0].id);

            $('.categories-list').append($category);

            var $itemCategory = $('<option>').val(newCategory[0].id).text(newCategory[0].name);

            $('#item-category').append($itemCategory);
            $('#item-category').val('');
        },
        error: function(err) {
            console.error('error:', err);
        }
    });
}

function addItem(event) {
    event.preventDefault();

    var item = {
        description: $('#item-description').val(),
        value: $('#item-value').val(),
        room: $('#item-room').val(),
        category: $('#item-category').val()
    };

    $('#item-description').val('');
    $('#item-value').val('');
    $('#item-room').val('');
    $('#item-category').val('');

    $.ajax({
        url: '/api/items',
        method: 'POST',
        data: item,
        success: function(newItem) {
            var $item = $('.item-template').clone();
            $item.removeClass('item-template');

            $item.find('.item-description').text(newItem[0].description);
            $item.find('.item-value').text('$' + newItem[0].value);
            $item.find('.item-room').addClass(`${newItem[0].room_id}`).text(newItem[0].room_name).attr('data-id', newItem[0].room_id);
            $item.find('.item-category').addClass(`${newItem[0].category_id}`).text(newItem[0].category_name).attr('data-id', newItem[0].category_id);
            $item.find('.edit-item').attr('data-id', newItem[0].id);
            $item.find('.delete-item').attr('data-id', newItem[0].id);

            $('.items-list').append($item);
            
            var totalValue = parseFloat($('.total-value').text().replace(/\$/, ''));
            totalValue += parseFloat(item.value);
            $('.total-value').text('$' + totalValue);

            var roomValue = parseFloat($(`.room-value.${newItem[0].room_id}`).text().replace(/\$/, ''));
            roomValue += parseFloat(item.value);
            $(`.room-value.${newItem[0].room_id}`).text('$' + roomValue);

            var categoryValue = parseFloat($(`.category-value.${newItem[0].category_id}`).text().replace(/\$/, ''));
            categoryValue += parseFloat(item.value);
            $(`.category-value.${newItem[0].category_id}`).text('$' + categoryValue);
        },
        error: function(err) {
            console.error('error:', err);
        }
    });
}

function deleteRoom() {
    var id = $(this).attr('data-id');
    var $room = $(this);

    $.ajax({
        url: '/api/rooms/' + id,
        method: 'DELETE',
        success: function() {
            $room.closest('tr').remove();
            $('#item-room').find('[value="' + id + '"]').remove();
            $('#item-room').val('');

            $(`.item-room.${id}`).text('');
        },
        error: function(err) {
            console.error('error:', err);
        }
    });
}

function deleteCategory() {
    var id = $(this).attr('data-id');
    var $category = $(this);

    $.ajax({
        url: '/api/categories/' + id,
        method: 'DELETE',
        success: function() {
            $category.closest('tr').remove();
            $('#item-category').find('[value="' + id + '"]').remove();
            $('#item-category').val('');

            $(`.item-category.${id}`).text('');
        },
        error: function(err) {
            console.error('error:', err);
        }
    });
}

function deleteItem() {
    var id = $(this).attr('data-id');
    var $item = $(this);
    var $row = $item.closest('tr');
    var roomId = $row.find('.item-room').attr('data-id');
    var categoryId = $row.find('.item-category').attr('data-id');
    var itemValue = $row.find('.item-value').text().replace(/\$/, '');

    $.ajax({
        url: '/api/items/' + id,
        method: 'DELETE',
        success: function() {
            var totalValue = parseFloat($('.total-value').text().replace(/\$/, ''));
            totalValue -= parseFloat(itemValue);
            $('.total-value').text('$' + totalValue);

            var roomValue = parseFloat($(`.room-value.${roomId}`).text().replace(/\$/, ''));
            roomValue -= parseFloat(itemValue);
            $(`.room-value.${roomId}`).text('$' + roomValue);

            var categoryValue = parseFloat($(`.category-value.${categoryId}`).text().replace(/\$/, ''));
            categoryValue -= parseFloat(itemValue);
            $(`.category-value.${categoryId}`).text('$' + categoryValue);

            $item.closest('tr').remove();
        },
        error: function(err) {
            console.error('error:', err);
        }
    });
}

function editRoom() {
    var id = $(this).attr('data-id');

    $.ajax({
        url: '/api/rooms/' + id,
        method: 'GET',
        success: function(data) {
            $('#edit-room-name').val(data[0].name);
            $('#edit-room-id').val(data[0].id);
        },
        error: function(err) {
            console.error('error:', err);
        }
    });
}

function editCategory() {
    var id = $(this).attr('data-id');

    $.ajax({
        url: '/api/categories/' + id,
        method: 'GET',
        success: function(data) {
            $('#edit-category-name').val(data[0].name);
            $('#edit-category-id').val(data[0].id);
        },
        error: function(err) {
            console.error('error:', err);
        }
    });
}

function editItem() {
    var id = $(this).attr('data-id');

    $.ajax({
        url: '/api/items/' + id,
        method: 'GET',
        success: function(data) {
            $('#edit-item-description').val(data[0].description);
            $('#edit-item-value').val(data[0].value);
            $('#edit-item-id').val(data[0].id);

            $.get('/api/rooms', function(rooms) {
                var str = '';

                for (var i = 0; i < rooms.length; i++) {
                    if (rooms[i].name === data[0].room_name) {
                        str += `<option value="${rooms[i].id}" selected>${rooms[i].name}</option>`;
                    } else {
                        str += `<option value="${rooms[i].id}">${rooms[i].name}</option>`;
                    }
                }

                $('#edit-item-room').html(str);
            });

            $.get('/api/categories', function(categories) {
                var str = '';

                for (var i = 0; i < categories.length; i++) {
                    if (categories[i].name === data[0].category_name) {
                        str += `<option value="${categories[i].id}" selected>${categories[i].name}</option>`;
                    } else {
                        str += `<option value="${categories[i].id}">${categories[i].name}</option>`;
                    }
                }

                $('#edit-item-category').html(str);
            });
        },
        error: function(err) {
            console.error('error:', err);
        }
    });
}

function saveRoom(event) {
    event.preventDefault();

    var id = $('#edit-room-id').val();

    var room = {
        name: $('#edit-room-name').val()
    };

    $.ajax({
        url: '/api/rooms/' + id,
        method: 'PUT',
        data: room,
        success: function() {
            var $rm = $('.rooms-list').find('[data-id="' + id + '"]');
            var $prevRow = $rm.closest('tr').prev();

            $rm.closest('tr').remove();

            var $room = $('.room-template').clone();
            $room.removeClass('room-template');

            $room.find('.room-name').text(room.name);
            $room.find('.edit-room').attr('data-id', id);
            $room.find('.delete-room').attr('data-id', id);

            if ($prevRow.length === 0) {
                $('.rooms-list').prepend($room);
            } else {
                $prevRow.after($room);
            }

            $('#item-room').find('[value="' + id + '"]').remove();

            var $itemRoom = $('<option>').val(id).text(room.name);

            $('#item-room').append($itemRoom);

            $(`.item-room.${id}`).text(room.name);

            $('#edit-room-name').val('');
            $('#edit-room-id').val('');
            $('#item-room').val('');

            $('#editRoomModal').modal('hide');
        },
        error: function(err) {
            console.error('error:', err);
        }
    });
}

function saveCategory(event) {
    event.preventDefault();

    var id = $('#edit-category-id').val();

    var category = {
        name: $('#edit-category-name').val()
    };

    $.ajax({
        url: '/api/categories/' + id,
        method: 'PUT',
        data: category,
        success: function() {
            var $cat = $('.categories-list').find('[data-id="' + id + '"]');
            var $prevRow = $cat.closest('tr').prev();

            $cat.closest('tr').remove();

            var $category = $('.category-template').clone();
            $category.removeClass('category-template');

            $category.find('.category-name').text(category.name);
            $category.find('.edit-category').attr('data-id', id);
            $category.find('.delete-category').attr('data-id', id);

            if ($prevRow.length === 0) {
                $('.categories-list').prepend($category);
            } else {
                $prevRow.after($category);
            }

            $('#item-category').find('[value="' + id + '"]').remove();

            var $itemCategory = $('<option>').val(id).text(category.name);

            $('#item-category').append($itemCategory);

            $(`.item-category.${id}`).text(category.name);

            $('#edit-category-name').val('');
            $('#edit-category-id').val('');
            $('#item-category').val('');

            $('#editCategoryModal').modal('hide');
        },
        error: function(err) {
            console.error('error:', err);
        }
    });
}

function saveItem(event) {
    event.preventDefault();

    var id = $('#edit-item-id').val();
    var $itm = $('.items-list').find('[data-id="' + id + '"]');
    var $row = $itm.closest('tr');
    var roomId = $row.find('.item-room').attr('data-id');
    var categoryId = $row.find('.item-category').attr('data-id');
    var itemValue = $row.find('.item-value').text().replace(/\$/, '');

    var item = {
        description: $('#edit-item-description').val(),
        value: $('#edit-item-value').val(),
        room: $('#edit-item-room').val(),
        category: $('#edit-item-category').val()
    };

    $.ajax({
        url: '/api/items/' + id,
        method: 'PUT',
        data: item,
        success: function() {
            var totalValue = parseFloat($('.total-value').text().replace(/\$/, ''));
            totalValue -= parseFloat(itemValue);
            $('.total-value').text('$' + totalValue);

            var roomValue = parseFloat($(`.room-value.${roomId}`).text().replace(/\$/, ''));
            roomValue -= parseFloat(itemValue);
            $(`.room-value.${roomId}`).text('$' + roomValue);

            var categoryValue = parseFloat($(`.category-value.${categoryId}`).text().replace(/\$/, ''));
            categoryValue -= parseFloat(itemValue);
            $(`.category-value.${categoryId}`).text('$' + categoryValue);

            var $prevRow = $itm.closest('tr').prev();
            $itm.closest('tr').remove();

            var $item = $('.item-template').clone();
            $item.removeClass('item-template');

            $item.find('.item-description').text(item.description);
            $item.find('.item-value').text('$' + item.value);
            $item.find('.item-room').addClass(`${item.room}`).text($('#edit-item-room option:selected').text());
            $item.find('.item-category').addClass(`${item.category}`).text($('#edit-item-category option:selected').text());
            $item.find('.edit-item').attr('data-id', id);
            $item.find('.delete-item').attr('data-id', id);

            if ($prevRow.length === 0) {
                $('.items-list').prepend($item);
            } else {
                $prevRow.after($item);
            }

            var newTotal = parseFloat($('.total-value').text().replace(/\$/, ''));
            newTotal += parseFloat(item.value);
            $('.total-value').text('$' + newTotal);

            var newRoomVal = parseFloat($(`.room-value.${item.room}`).text().replace(/\$/, ''));
            newRoomVal += parseFloat(item.value);
            $(`.room-value.${item.room}`).text('$' + newRoomVal);

            var newCatVal = parseFloat($(`.category-value.${item.category}`).text().replace(/\$/, ''));
            newCatVal += parseFloat(item.value);
            $(`.category-value.${item.category}`).text('$' + newCatVal);

            $('#edit-item-description').val('');
            $('#edit-item-value').val('');
            $('#edit-item-room').val('');
            $('#edit-item-category').val('');

            $('#editItemModal').modal('hide');
        },
        error: function(err) {
            console.error('error:', err);
        }
    });
}